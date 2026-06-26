import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { Task } from '../../types/task';

interface CreateTaskPayload {
  title: string;
  description: string;
  category: string;
  priority: string;
  dueDate: string;
  dueTime: string;
  estimatedDuration: string;
  reminderDate: string;
  reminderTime: string;
  repeat: string;
  location: string;
  tags: string[];
  attachments: string[];
}

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  initialTask?: Task | null;
  mode?: 'Create' | 'Edit';
  onSave: (task: CreateTaskPayload, taskId?: string) => Promise<void>;
}

export function TaskModal({ open, onClose, initialTask = null, mode = 'Create', onSave }: TaskModalProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(today);
  const [dueTime, setDueTime] = useState('18:00');
  const [estimatedDuration, setEstimatedDuration] = useState('1h');
  const [reminderDate, setReminderDate] = useState(today);
  const [reminderTime, setReminderTime] = useState('17:50');
  const [repeat, setRepeat] = useState('Never');
  const [location, setLocation] = useState(initialTask?.location ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setTitle(initialTask?.title ?? '');
    setDescription(initialTask?.description ?? '');
    setCategory(initialTask?.category ?? 'Work');
    setPriority(initialTask?.priority ?? 'Medium');
    setDueDate(initialTask?.dueDate ?? today);
    setDueTime(initialTask?.dueTime ?? '18:00');
    setEstimatedDuration(initialTask?.estimatedDuration ?? '1h');
    setReminderDate(initialTask?.reminderDate ?? today);
    setReminderTime(initialTask?.reminderTime ?? '17:50');
    setRepeat(initialTask?.repeat ?? 'Never');
    setLocation(initialTask?.location ?? '');
    setError('');
  }, [initialTask, open, today]);

  if (!open) return null;

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Work');
    setPriority('Medium');
    setDueDate(today);
    setDueTime('18:00');
    setEstimatedDuration('1h');
    setReminderDate(today);
    setReminderTime('17:50');
    setRepeat('Never');
    setLocation('');
    setError('');
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please enter a task title.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await onSave(
        {
          title,
          description,
          category,
          priority,
          dueDate,
          dueTime,
          estimatedDuration,
          reminderDate,
          reminderTime,
          repeat,
          location,
          tags: initialTask?.tags ?? [],
          attachments: initialTask?.attachments ?? [],
        },
        initialTask?.id
      );
      resetForm();
      onClose();
    } catch (saveError) {
      console.error('Task save failed:', saveError);
      setError(
        (saveError as Error)?.message || 'Unable to save task. Check your network and Firebase settings.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl z-0" onClick={onClose} />
      <Card className="relative z-10 max-w-2xl w-full pointer-events-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">{mode === 'Edit' ? 'Edit Task' : 'New Task'}</h2>
            <p className="text-sm text-slate-400">
              {mode === 'Edit' ? 'Update your task details and save changes.' : 'Create a priority reminder with smart scheduling.'}
            </p>
          </div>
          <Button type="button" onClick={onClose} className="bg-slate-800/90 text-white">Close</Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Title</span>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Category</span>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Work</option>
              <option>Personal</option>
              <option>Health</option>
              <option>Learning</option>
            </Select>
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm text-slate-300">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[120px] rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
              placeholder="Enter task details"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Priority</span>
            <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </Select>
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Due date</span>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Due time</span>
            <Input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Reminder time</span>
            <Input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Repeat</span>
            <Select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
              <option>Never</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </Select>
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm text-slate-300">Location</span>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote / Office" />
          </label>
          <div className="flex flex-col gap-3 md:col-span-2">
            {error ? <p className="text-sm text-rose-400">{error}</p> : null}
            <div className="flex items-end justify-end gap-3">
              <Button type="button" onClick={onClose} className="bg-slate-800/90">Cancel</Button>
              <Button type="button" onClick={handleSave} disabled={isSaving} className="bg-sky-500 hover:bg-sky-400">
                {isSaving ? 'Saving...' : 'Save Task'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
