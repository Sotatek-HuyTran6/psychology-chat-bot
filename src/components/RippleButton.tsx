import React, { type MouseEvent } from 'react';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const RippleButton: React.FC<RippleButtonProps> = ({ children, className, ...props }) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e);
    const button = e.currentTarget;
    const circle = document.createElement('span');

    const rect = button.getBoundingClientRect();
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.className = 'ripple';

    button.appendChild(circle);

    setTimeout(() => circle.remove(), 600);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`relative overflow-hidden px-4 py-2 cursor-pointer rounded flex ${className} hover:bg-[#c7c7c773] font-medium`}
    >
      {props.icon && <div className="mr-2">{props.icon}</div>}
      {children}
    </button>
  );
};

export default RippleButton;
