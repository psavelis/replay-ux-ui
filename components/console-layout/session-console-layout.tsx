/* eslint-disable @next/next/no-head-element */
"use client"

import ConsoleLayout from '@/components/console-layout/console';
import { fontSans } from '@/config/fonts';
import clsx from 'clsx';
import { SessionProvider } from 'next-auth/react';

export default function SessionConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ConsoleLayout>
        <div>
          {children}
        </div>
      </ConsoleLayout>
    </SessionProvider>
  );
}
