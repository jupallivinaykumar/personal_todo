import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-glass backdrop-blur-2xl transition duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
