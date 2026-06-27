import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createTask, fetchUserTasks, updateTask as updateTaskService } from '../services/taskService';
import type { Task } from '../types/task';

interface Analytics {
  todayCount: number;
  upcomingCount: number;
  missedCount: number;
  completedCount: number;
  productivityScore: number;
  dailySummary: string;
}

function getTaskCacheKey(userId: string) {
  return `smart-notify-tasks:${userId}`;
}

function readCachedTasks(userId: string) {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(getTaskCacheKey(userId));
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch (error) {
    console.error('Failed to read cached tasks:', error);
    return [];
  }
}

function writeCachedTasks(userId: string, tasks: Task[]) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(getTaskCacheKey(userId), JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to cache tasks:', error);
  }
}

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const cachedTasks = readCachedTasks(user.uid);

    if (cachedTasks.length > 0) {
      setTasks(cachedTasks);
    }

    fetchUserTasks(user.uid)
      .then((fetchedTasks) => {
        setTasks(fetchedTasks);
        writeCachedTasks(user.uid, fetchedTasks);
      })
      .catch((error) => {
        console.error('Failed to fetch user tasks:', error);
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    writeCachedTasks(user.uid, tasks);
  }, [tasks, user]);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const optimisticTask: Task = {
      id: `temp-${Date.now()}`,
      ...taskData,
      ownerId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Task;

    setTasks((prevTasks) => [optimisticTask, ...prevTasks]);

    try {
      const savedTask = await createTask({ ...taskData, ownerId: user.uid });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === optimisticTask.id ? savedTask : task))
      );
      return savedTask;
    } catch (error) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== optimisticTask.id));
      throw error;
    }
  };

  const updateTask = async (taskId: string, patch: Partial<Task>) => {
    const previousTasks = tasks;
    const updatedAt = new Date().toISOString();

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...patch, updatedAt } : task
      )
    );

    try {
      await updateTaskService(taskId, patch);
    } catch (error) {
      setTasks(previousTasks);
      throw error;
    }
  };

  const analytics = useMemo<Analytics>(() => {
    const today = new Date().toISOString().slice(0, 10);

    const normalizeStatus = (status: string | undefined) => String(status ?? '').trim().toLowerCase();
    const isCompletedStatus = (status: string) => ['completed', 'complete', 'done'].includes(normalizeStatus(status));
    const isMissedStatus = (status: string) => normalizeStatus(status) === 'missed';
    const isActiveTask = (task: Task) => !isCompletedStatus(task.status) && !isMissedStatus(task.status);

    const todayTasks = tasks.filter((task) => isActiveTask(task) && task.dueDate <= today);
    const upcoming = tasks.filter((task) => isActiveTask(task) && task.dueDate > today);
    const missed = tasks.filter((task) => isMissedStatus(task.status));
    const completed = tasks.filter((task) => isCompletedStatus(task.status));
    const productivityScore = tasks.length ? Math.round((completed.length / tasks.length) * 100) : 0;

    return {
      todayCount: todayTasks.length,
      upcomingCount: upcoming.length,
      missedCount: missed.length,
      completedCount: completed.length,
      productivityScore,
      dailySummary: `You completed ${completed.length} tasks this week.`,
    };
  }, [tasks]);

  return { tasks, loading, analytics, setTasks, addTask, updateTask };
  
}