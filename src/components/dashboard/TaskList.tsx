import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Task } from '../../types/task';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onToggleComplete: (task: Task, completed: boolean) => void;
}

export function TaskList({ tasks, onEdit, onToggleComplete }: TaskListProps) {
  return (
    <div className="grid gap-4">
      {tasks.slice(0, 6).map((task) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.status === 'Completed'}
                  onChange={(e) => onToggleComplete(task, e.target.checked)}
                  className="h-5 w-5 rounded border border-slate-700 bg-slate-900 text-sky-400 focus:ring-sky-400"
                  aria-label={`Mark ${task.title} completed`}
                />
                <div>
                  <p className="text-lg font-semibold text-white">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{task.category} · {task.priority}</p>
                </div>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-sky-400 hover:text-sky-300"
              >
                Edit
              </button>
              <div className="rounded-3xl bg-slate-800/80 px-4 py-2 text-sm text-sky-300">{task.status}</div>
            </div>
          </div>
          <p className="mt-4 line-clamp-2 text-slate-300">{task.description}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
            <span>{task.dueDate}</span>
            <span>{task.dueTime}</span>
            <span>{task.repeat}</span>
          </div>
          <Link to={`/task/${task.id}`} className="mt-4 inline-flex text-sm text-sky-300 hover:underline">
            View details
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
