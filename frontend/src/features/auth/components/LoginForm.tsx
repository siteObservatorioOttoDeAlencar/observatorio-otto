import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface LoginFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-space-text-muted mb-1 block">E-mail</label>
        <Input name="email" type="email" autoComplete="email" placeholder="astronomo@observatorio.ce" required />
      </div>
      <div>
        <label className="text-xs font-medium text-space-text-muted mb-1 block">Senha</label>
        <Input name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />
      </div>
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Acessar Observatório
      </Button>
    </form>
  );
}
