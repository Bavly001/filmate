'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  className?: string;
  activeClassName?: string;
  inActiveClassName?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function NavLink({
  href,
  className = '',
  activeClassName = '',
  inActiveClassName = '',
  onClick,
  children,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${className} ${isActive ? activeClassName : inActiveClassName}`}
    >
      {children}
    </Link>
  );
}
