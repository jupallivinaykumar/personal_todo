import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { TaskList } from '../components/dashboard/TaskList';
import { TaskModal } from '../components/dashboard/TaskModal';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../types/task';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, analytics, addTask, updateTask } = useTasks();
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeReminder, setActiveReminder] = useState<Task | null>(null);
  const notificationPermissionRequestedRef = useRef(false);
  const lastNotificationRef = useRef<Record<string, number>>({});

  const handleSaveTask = async (taskData: any, taskId?: string) => {
    if (!user) {
      throw new Error('No authenticated user. Please sign in again.');
    }

    if (taskId) {
      await updateTask(taskId, {
        ...taskData,
        status: selectedTask?.status ?? 'Pending',
        ownerId: user.uid,
      });
    } else {
      await addTask({
        ...taskData,
        status: 'Pending',
        ownerId: user.uid,
      });
    }

    setSelectedTask(null);
    setOpenTaskModal(false);
  };

  const handleToggleTaskComplete = async (task: Task, completed: boolean) => {
    if (!user) return;

    const status = completed
      ? 'Completed'
      : task.status === 'Completed'
      ? 'Missed'
      : task.status;

    await updateTask(task.id, {
      status,
      ownerId: user.uid,
    });
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setOpenTaskModal(true);
  };

  const stats = useMemo(
    () => [
      { title: "Today's Tasks", value: analytics.todayCount },
      { title: 'Upcoming Tasks', value: analytics.upcomingCount },
      { title: 'Missed Tasks', value: analytics.missedCount },
      { title: 'Completed Tasks', value: analytics.completedCount },
    ],
    [analytics]
  );

  useEffect(() => {
    document.title = 'Smart Notify Dashboard';
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      if (notificationPermissionRequestedRef.current) return;
      notificationPermissionRequestedRef.current = true;

      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };

    requestPermission();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = new Date();
      const dueTask = tasks.find((task) => {
        if (!task.reminderDate || !task.reminderTime) return false;
        if (task.status === 'Completed') return false;

        const reminderDateTime = new Date(`${task.reminderDate}T${task.reminderTime}:00`);
        if (reminderDateTime > now) return false;

        const lastSent = lastNotificationRef.current[task.id] ?? 0;
        const minutesSinceLast = (Date.now() - lastSent) / 1000 / 60;
        return minutesSinceLast >= 3;
      });

      if (dueTask) {
        lastNotificationRef.current[dueTask.id] = Date.now();
        setActiveReminder(dueTask);

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Task Reminder', {
            body: `${dueTask.title} is due at ${dueTask.reminderTime}.`,
          });
        }
      }
    }, 30_000);

    return () => window.clearInterval(interval);
  }, [tasks]);

  return (
    <div className="min-h-screen bg-slate-950/95 px-6 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-sky-300">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Hi {user?.displayName || 'Productivity Champion'}</h1>
            <p className="mt-2 max-w-2xl text-slate-400">Your AI assistant is prioritizing tasks, scheduling reminders, and tracking your streaks.</p>
          </div>
          <Button onClick={() => setOpenTaskModal(true)} className="gap-2 px-5 py-3">
            <Plus size={16} /> New Task
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{stat.title}</p>
              <p className="mt-4 text-3xl font-semibold text-white">{stat.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <Card className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Productivity Score</p>
                <p className="mt-3 text-4xl font-semibold text-white">{analytics.productivityScore}%</p>
              </div>
              <div className="rounded-3xl bg-slate-800/80 px-4 py-2 text-sm tracking-wide text-sky-300">Live AI insights</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
              <p>
                You have completed <span className="font-semibold text-white">{analytics.completedCount}</span> out of{' '}
                <span className="font-semibold text-white">{tasks.length}</span> tasks.
              </p>
              <p className="mt-2 text-slate-400">
                Keep moving through today&apos;s list to raise your score.
              </p>
            </div>
          </Card>

          <Card>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Recent Notifications</p>
            <div className="mt-5 space-y-4">
              {tasks.slice(0, 4).map((task) => (
                <div key={task.id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                  <p className="font-semibold text-white">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-400">Reminder: {task.reminderDate ?? 'Not set'}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Your tasks</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Quick actions and schedule</h2>
            </div>
            <p className="rounded-full bg-slate-800/80 px-4 py-2 text-sm text-slate-300">{analytics.dailySummary}</p>
          </div>
          <TaskList tasks={tasks} onEdit={handleEditTask} onToggleComplete={handleToggleTaskComplete} />
        </Card>
      </div>
      <TaskModal
        open={openTaskModal}
        onClose={() => {
          setOpenTaskModal(false);
          setSelectedTask(null);
        }}
        initialTask={selectedTask}
        mode={selectedTask ? 'Edit' : 'Create'}
        onSave={handleSaveTask}
      />

      {activeReminder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-950/95 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Task reminder</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{activeReminder.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveReminder(null)}
                className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-sky-400 hover:text-sky-300"
              >
                Dismiss
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-300">{activeReminder.description || 'Reminder time reached for this task.'}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
              <span>Due {activeReminder.reminderDate}</span>
              <span>{activeReminder.reminderTime}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
