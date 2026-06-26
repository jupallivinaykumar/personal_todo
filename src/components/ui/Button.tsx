import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Button({ children, className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_45px_-25px_rgba(56,189,248,0.9)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_20px_60px_-30px_rgba(56,189,248,0.8)] focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
