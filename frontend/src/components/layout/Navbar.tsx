"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Telescope,
  Compass,
  BookOpen,
  Camera,
  Info,
  LogIn,
  LogOut,
  User,
  PlusCircle,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";

const NAV_ITEMS = [
  { href: "/ceu-hoje", label: "O Céu Hoje", icon: Compass },
  { href: "/conteudo", label: "Notícias & Artigos", icon: BookOpen },
  { href: "/galeria", label: "Astrofotografia", icon: Camera },
  { href: "/registros", label: "Mural de Observações", icon: Sparkles },
  { href: "/sobre", label: "Sobre o Observatório", icon: Info },
];

/**
 * 🎓 BARRA DE NAVEGAÇÃO PRINCIPAL (Navbar)
 * 
 * Por que este componente é "use client"?
 * 1. Ele lê a rota atual com `usePathname()` para destacar visualmente a página ativa.
 * 2. Ele gerencia o estado `mobileMenuOpen` para abrir/fechar o drawer em celulares.
 * 3. Ele se conecta à store Zustand (`useAuthStore`) para exibir dinamicamente o avatar
 *    do usuário logado ou o botão de login.
 * 
 * Efeito Cósmico:
 * A classe `cosmic-glass` aplica um backdrop-blur suave com borda translúcida,
 * permitindo que as estrelas e o conteúdo passem por baixo da barra durante a rolagem.
 */
export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  // Fecha o menu móvel automaticamente assim que o usuário clica em um link e a rota muda
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full cosmic-glass border-b border-space-border/60 transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Identidade Visual / Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nebula-cyan rounded-lg p-1"
        >
          <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-space-surface-2 border border-space-border/80 group-hover:border-nebula-cyan/50 transition-colors">
            <Telescope className="h-5 w-5 text-nebula-cyan group-hover:scale-110 transition-transform cosmic-glow" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-aurora-green"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-display font-bold tracking-tight text-lunar-silver text-base sm:text-lg leading-tight group-hover:text-nebula-cyan transition-colors">
              Observatório Otto de Alencar
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-space-text-muted">
              Fortaleza • 3.77° S, 38.56° O
            </span>
          </div>
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-nebula-cyan/10 text-nebula-cyan border border-nebula-cyan/30 shadow-cosmic-sm"
                    : "text-space-text-muted hover:text-lunar-silver hover:bg-space-surface-2/60"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-nebula-cyan" : "text-space-text-muted")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bloco de Ações e Autenticação Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link href="/registros/novo">
                <Button variant="primary" size="sm" className="gap-1.5 shadow-cosmic-sm">
                  <PlusCircle className="h-4 w-4" />
                  Novo Registro
                </Button>
              </Link>

              <div className="flex items-center gap-2 rounded-lg border border-space-border bg-space-surface-1 px-3 py-1.5 text-xs">
                <User className="h-3.5 w-3.5 text-nebula-cyan" />
                <span className="font-medium text-lunar-silver max-w-[100px] truncate">
                  {user.username}
                </span>
                <button
                  onClick={() => logout()}
                  title="Encerrar Sessão"
                  className="ml-1 text-space-text-muted hover:text-crimson-deep transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="glass" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4 text-nebula-cyan" />
                  Entrar
                </Button>
              </Link>
              <Link href="/auth/cadastro">
                <Button variant="primary" size="sm">
                  Registrar-se
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Botão Mobile Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-space-border bg-space-surface-1 p-2.5 text-lunar-silver hover:text-nebula-cyan hover:border-nebula-cyan/40 transition-colors focus:outline-none focus:ring-2 focus:ring-nebula-cyan"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu Gaveta Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden cosmic-glass border-b border-space-border/80 px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-nebula-cyan/15 text-nebula-cyan border border-nebula-cyan/30"
                      : "text-space-text-muted hover:text-lunar-silver hover:bg-space-surface-2"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-space-border/60">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-space-text-muted px-1">
                  <span>Conectado como <strong className="text-lunar-silver">{user.username}</strong></span>
                  <button
                    onClick={() => logout()}
                    className="text-crimson-deep hover:underline flex items-center gap-1"
                  >
                    <LogOut className="h-3 w-3" /> Sair
                  </button>
                </div>
                <Link href="/registros/novo" className="block w-full">
                  <Button variant="primary" className="w-full gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Novo Registro de Observação
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/auth/login" className="w-full">
                  <Button variant="glass" className="w-full gap-1.5">
                    <LogIn className="h-4 w-4 text-nebula-cyan" />
                    Entrar
                  </Button>
                </Link>
                <Link href="/auth/cadastro" className="w-full">
                  <Button variant="primary" className="w-full">
                    Registrar-se
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
