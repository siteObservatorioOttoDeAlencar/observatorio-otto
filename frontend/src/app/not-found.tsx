import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="font-display text-7xl font-extrabold text-nebula-cyan">404</h1>
      <p className="mt-4 text-xl font-medium text-lunar-silver">Coordenadas Perdidas no Espaço</p>
      <p className="mt-2 text-sm text-space-text-muted max-w-md">
        O objeto celeste ou página que você está procurando não existe nesta órbita.
      </p>
      <Link href="/" className="mt-6">
        <Button variant="primary">Retornar à Base</Button>
      </Link>
    </div>
  );
}
