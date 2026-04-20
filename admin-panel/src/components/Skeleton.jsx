import React from 'react';

export default function Skeleton({ className = "", variant = "rectangular" }) {
  // Tailwind skeleton animation + DICE tokens
  const baseStyle = `animate-pulse bg-[#F1F5F9] dark:bg-[#222222]`;
  
  let borderRadius = "rounded-xl";
  if (variant === "circular") borderRadius = "rounded-full";
  if (variant === "text") borderRadius = "rounded-md";

  return (
    <div className={`${baseStyle} ${borderRadius} ${className}`} />
  );
}
