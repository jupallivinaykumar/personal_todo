import { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none backdrop-blur-sm shadow-inner shadow-black/10 transition duration-200 placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 ${className}`}
      {...props}
    />
  );
}
