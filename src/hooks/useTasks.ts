/**
 * useTasks Hook
 *
 * Responsibilities:
 * - Fetch user tasks from Firebase Firestore.
 * - Cache tasks in browser localStorage.
 * - Restore cached tasks after page refresh.
 * - Keep Firebase and localStorage synchronized.
 * - Support optimistic add/update operations.
 * - Calculate task analytics.
 *
 * Task Persistence:
 * After a user logs in and adds tasks, the tasks are stored in
 * Firebase Firestore and cached in browser localStorage.
 * Refreshing the page does not remove the tasks.
 * Cached tasks are loaded immediately, while the latest data
 * is synchronized from Firebase in the background.
 */

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createTask,
  fetchUserTasks,
  updateTask as updateTaskService,
} from "../services/taskService";
import type { Task } from "../types/task";

interface Analytics {
  todayCount: number;
  upcomingCount: number;
  missedCount: number;
  completedCount: number;
  productivityScore: number;
  dailySummary: string;
}

/* ------------------------- Local Storage Helpers ------------------------- */

const getCacheKey = (userId: string) => `smart-notify-tasks:${userId}`;

const readCachedTasks = (userId: string): Task[] => {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(getCacheKey(userId));
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCachedTasks = (userId: string, tasks: Task[]) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(getCacheKey(userId), JSON.stringify(tasks));
};

/* ------------------------------ Custom Hook ------------------------------ */

export function useTasks() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load cached tasks first.
   * Then synchronize with Firebase.
   */
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const cached = readCachedTasks(user.uid);

    if (cached.length) {
      setTasks(cached);
    }

    fetchUserTasks(user.uid)
      .then((firebaseTasks) => {
        setTasks(firebaseTasks);
        saveCachedTasks(user.uid, firebaseTasks);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  /**
   * Keep localStorage synchronized.
   */
  useEffect(() => {
    if (!user) return;

    saveCachedTasks(user.uid, tasks);
  }, [tasks, user]);

  /**
   * Add Task
   * Uses Optimistic UI.
   */
  const addTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!user) return;

    const optimisticTask: Task = {
      id: `temp-${Date.now()}`,
      ...taskData,
      ownerId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Task;

    setTasks((prev) => [optimisticTask, ...prev]);
    try {
      const savedTask = await createTask({
        ...taskData,
        ownerId: user.uid,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === optimisticTask.id ? savedTask : task
        )
      );

      return savedTask;
    } catch (error) {
      setTasks((prev) =>
        prev.filter((task) => task.id !== optimisticTask.id)
      );

      throw error;
    }
  };

  /**
   * Update Task
   */
  const updateTask = async (
    taskId: string,
    patch: Partial<Task>
  ) => {
    const previousTasks = tasks;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );

    try {
      await updateTaskService(taskId, patch);
    } catch (error) {
      setTasks(previousTasks);
      throw error;
    }
  };

  /**
   * Dashboard Analytics
   */
  const analytics = useMemo<Analytics>(() => {
    const today = new Date().toISOString().slice(0, 10);

    const completed = tasks.filter(
      (task) => task.status?.toLowerCase() === "completed"
    );

    const missed = tasks.filter(
      (task) => task.status?.toLowerCase() === "missed"
    );

    const active = tasks.filter(
      (task) =>
        task.status?.toLowerCase() !== "completed" &&
        task.status?.toLowerCase() !== "missed"
    );

    return {
      todayCount: active.filter((t) => t.dueDate <= today).length,
      upcomingCount: active.filter((t) => t.dueDate > today).length,
      missedCount: missed.length,
      completedCount: completed.length,
      productivityScore: tasks.length
        ? Math.round((completed.length / tasks.length) * 100)
        : 0,
      dailySummary: `You completed ${completed.length} tasks this week.`,
    };
  }, [tasks]);

  return {
    tasks,
    loading,
    analytics,
    setTasks,
    addTask,
    updateTask,
  };
}
