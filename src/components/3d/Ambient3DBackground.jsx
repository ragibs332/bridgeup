import React from 'react';

export default function Ambient3DBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Soft Ambient Light Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-teal-500/10 dark:bg-brand-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-brand-amber-500/10 dark:bg-brand-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-brand-mint-500/10 dark:bg-brand-mint-500/5 rounded-full blur-3xl" />
    </div>
  );
}
