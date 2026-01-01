// src/components/ui/Button.jsx
import React from 'react';
export default function Button({ children, onClick, variant = 'primary' }){
  const cls = variant === 'accent' ? 'btn-accent' : 'btn-primary';
  return <button onClick={onClick} className={`${cls} font-medium`}>{children}</button>
}
