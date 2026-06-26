import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 text-center shadow-glass backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.4em] text-sky-300">Page not found</p>
        <h1 className="mt-6 text-4xl font-semibold text-white">We couldn’t find that page.</h1>
        <p className="mt-4 text-slate-400">Return to the dashboard to continue managing tasks and notifications.</p>
        <Link to="/">
          <Button className="mt-8">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
