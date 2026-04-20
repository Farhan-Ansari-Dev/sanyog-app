import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Skeleton({ className = "", variant = "rectangular" }) {
  const { isDark } = useTheme();
  
  // Tailwind skeleton animation + DICE tokens
  const baseStyle = `animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`;
  
  let borderRadius = "rounded-xl";
  if (variant === "circular") borderRadius = "rounded-full";
  if (variant === "text") borderRadius = "rounded-md";

  return (
    <div className={`${baseStyle} ${borderRadius} ${className}`} />
  );
}
