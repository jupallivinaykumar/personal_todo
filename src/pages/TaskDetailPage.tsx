import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { useTasks } from '../hooks/useTasks';

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const { tasks } = useTasks();
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 shadow-glass backdrop-blur-xl text-center">
          <p className="text-xl font-semibold text-white">Task not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <h1 className="text-3xl font-semibold text-white">{task.title}</h1>
          <p className="mt-3 text-slate-400">{task.description}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Category</p>
              <p className="mt-2 text-lg text-white">{task.category}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Priority</p>
              <p className="mt-2 text-lg text-white">{task.priority}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
