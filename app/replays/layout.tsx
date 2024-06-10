"use client"
import SessionConsoleLayout from '@/components/console-layout/session-console-layout';

export default function ReplaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning >
      <head />
      <body>
        <SessionConsoleLayout>
          <div>
            {children}
          </div>
        </SessionConsoleLayout>
      </body>
    </html>
  );
}
