'use client';

import React from 'react';
import clsx from 'clsx';

export type EsportsButtonVariant = 'primary' | 'action' | 'ghost' | 'matchmaking';
export type EsportsButtonSize = 'sm' | 'md' | 'lg' | 'nav';

interface EsportsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: EsportsButtonVariant;
  size?: EsportsButtonSize;
  glow?: boolean;
  cyber?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  as?: 'button' | 'a';
  href?: string;
}

export default function EsportsButton({
  variant = 'primary',
  size = 'md',
  glow = false,
  cyber = false,
  fullWidth = false,
  children,
  className,
  as = 'button',
  href,
  ...props
}: EsportsButtonProps) {
  const baseClasses = clsx(
    'esports-btn',
    {
      'esports-btn-sm': size === 'sm',
      'esports-btn-lg': size === 'lg',
      'esports-btn-nav': size === 'nav',
      'esports-btn-primary': variant === 'primary',
      'esports-btn-action': variant === 'action',
      'esports-btn-ghost': variant === 'ghost',
      'esports-btn-matchmaking': variant === 'matchmaking',
      'esports-btn-glow': glow,
      'esports-btn-cyber': cyber,
      'w-full': fullWidth,
    },
    // Size-based padding
    {
      'px-3 py-1.5 text-xs': size === 'sm',
      'px-5 py-2.5 text-sm': size === 'md',
      'px-7 py-3.5 text-base': size === 'lg',
    },
    'inline-flex items-center justify-center gap-2',
    'cursor-pointer select-none',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    className
  );

  if (as === 'a' && href) {
    return (
      <a href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {children}
    </button>
  );
}

// Icon-enhanced variant for common use cases
interface EsportsButtonWithIconProps extends EsportsButtonProps {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function EsportsButtonWithIcon({
  icon,
  iconPosition = 'left',
  children,
  ...props
}: EsportsButtonWithIconProps) {
  return (
    <EsportsButton {...props}>
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </EsportsButton>
  );
}
