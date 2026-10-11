import * as React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-space-background px-4">
      <div className="w-full max-w-md cosmic-glass rounded-2xl p-8 border border-space-border/80">
        {children}
      </div>
    </div>
  );
}
