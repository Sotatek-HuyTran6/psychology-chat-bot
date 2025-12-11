import React, { type MouseEvent } from 'react';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
}

const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  className,
  loading = false,
  ...props
}) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (loading) return;
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
      disabled={loading || props.disabled}
      className={`relative overflow-hidden px-4 py-2 cursor-pointer rounded flex items-center justify-center ${className} hover:bg-[#c7c7c773] font-medium ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children}
        </>
      ) : (
        <>
          {props.icon && <div className="mr-2">{props.icon}</div>}
          {children}
        </>
      )}
    </button>
  );
};

export default RippleButton;
