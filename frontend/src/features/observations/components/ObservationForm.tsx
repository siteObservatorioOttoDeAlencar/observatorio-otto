import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ObservationFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export function ObservationForm({ onSubmit, isLoading }: ObservationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-medium text-space-text-muted mb-1 block">Objeto Celeste Observado</label>
        <Input name="objeto_celeste" placeholder="Ex: Júpiter, Lua, Nebulosa de Órion" required />
      </div>
      <div>
        <label className="text-xs font-medium text-space-text-muted mb-1 block">Equipamento Utilizado</label>
        <Input name="equipamento_utilizado" placeholder="Ex: Telescópio Schmidt-Cassegrain 8''" />
      </div>
      <div>
        <label className="text-xs font-medium text-space-text-muted mb-1 block">Anotações da Observação</label>
        <textarea
          name="anotacoes"
          rows={4}
          className="w-full rounded-md border border-space-border bg-space-surface-1 p-3 text-sm text-lunar-silver placeholder:text-space-text-muted focus:border-nebula-cyan focus:outline-none"
          placeholder="Descreva a nitidez, seeing e detalhes observados..."
          required
        />
      </div>
      <Button type="submit" isLoading={isLoading} className="w-full">
        Salvar Registro no Observatório
      </Button>
    </form>
  );
}
