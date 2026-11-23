# Guia do Desenvolvedor — Observatório Digital Otto de Alencar 🗺️

> **Bem-vindo à equipe!**  
> Este documento foi escrito especialmente para quem acabou de clonar o repositório ou foi adicionado ao projeto hoje. Não importa se você é bolsista de extensão, estagiário, estudante ou professor: este guia vai te mostrar exatamente por onde começar a ler o código e onde encontrar cada coisa.

---

## 1. Por Onde Começar a Ler o Código?

Se você só tem 10 minutos para entender o projeto, abra estes 4 arquivos nesta ordem:

1. **`frontend/src/app/(public)/page.tsx`**  
   * **O que é:** É a porta de entrada (a Home Page).  
   * **Por que ler:** Ele é como o sumário de um livro. Você vai ver todas as seções que compõem a página inicial em sequência.

2. **`frontend/src/components/home/HeroStatusCockpit.tsx`**  
   * **O que é:** A primeira dobra da tela (onde respondemos *"Vale a pena olhar o céu hoje?"*).  
   * **Por que ler:** Aqui você aprende como consumimos os dados astronômicos em tempo real com React Hooks.

3. **`frontend/src/features/sky-today/services/fastapiAstroService.ts`**  
   * **O que é:** O arquivo que conversa com a API de astronomia em Python (FastAPI).  
   * **Por que ler:** Você vai ver como fazemos a requisição e como o sistema se protege caso o backend esteja desligado (dados de fallback).

4. **`frontend/src/styles/globals.css`**  
   * **O que é:** As cores do universo e estilos básicos (preto espacial `#080B10`, ciano de nebulosa, âmbar estelar).  
   * **Por que ler:** Para entender a paleta visual antes de criar qualquer botão ou card.

---

## 2. Mapa Mental das Pastas

Para não se perder na árvore de diretórios:

| Se você precisa... | Vá para esta pasta: | Exemplo de arquivo: |
|---|---|---|
| **Mudar ou criar uma página** | `src/app/(public)/` | `ceu-hoje/page.tsx`, `galeria/page.tsx` |
| **Mudar os textos da página inicial** | `src/components/home/` | `HeroStatusCockpit.tsx`, `ParaOndeOlhar.tsx` |
| **Ajustar botões, cards ou badges padrão** | `src/components/ui/` | `Button.tsx`, `Badge.tsx`, `Card.tsx` |
| **Alterar as chamadas para a FastAPI** | `src/features/sky-today/` | `services/fastapiAstroService.ts` |
| **Alterar as chamadas para o CMS (Payload)** | `src/features/content/` | `services/cmsContentService.ts` |
| **Mudar a URL da API ou latitude de Fortaleza** | `src/lib/constants.ts` | `API_CONFIG`, `OBSERVATORIO_CONFIG` |
| **Mudar as cores principais do site** | `src/styles/globals.css` | `--space-background`, `--nebula-cyan` |

---

## 3. Onde Alterar Cada Coisa? (Receitas Rápidas)

### "Quero mudar o texto do cabeçalho da Home"
* Abra: `src/components/home/HeroStatusCockpit.tsx`
* Encontre a tag `<h1>` e altere o texto desejado.

### "Quero mudar as coordenadas ou o nome do Observatório"
* Abra: `src/lib/constants.ts`
* Você verá:
  ```ts
  export const OBSERVATORIO_CONFIG = {
    NOME: "Observatório Digital Otto de Alencar",
    CIDADE: "Fortaleza",
    LATITUDE: -3.7793,
    LONGITUDE: -38.5661,
  };
  ```

### "Quero mudar a URL de onde a API e o CMS respondem"
* Abra o arquivo `.env.local` na raiz de `frontend/`:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8000
  NEXT_PUBLIC_CMS_URL=http://localhost:3000
  ```
* Se for para produção, basta trocar pelo endereço do servidor remoto!

### "Quero criar um novo card para a tela"
* Use os blocos de superfície do Tailwind já preparados:
  ```tsx
  <div className="rounded-2xl p-5 bg-space-surface-1 border border-white/[0.08] text-white">
    <h3 className="font-display font-bold">Título do Card</h3>
    <p className="text-xs text-space-text-muted">Descrição clara.</p>
  </div>
  ```

---

## 4. Como os Dados Circulam no Sistema?

Quando a tela precisa de informações sobre a Lua ou Júpiter, o caminho percorrido é este:

```text
[ Tela React (Componente) ]
            │
            ▼  chama
[ Hook: useSkyToday() ]  (Usa TanStack Query para guardar em memória temporária)
            │
            ▼  executa
[ Serviço: fastapiAstroService.getObservarHoje() ]
            │
            ▼  faz requisição HTTP via Axios
[ Backend FastAPI (Python na porta 8000) ]
            │
            ▼  devolve JSON
{ "planetas_visiveis_agora": [...], "fase_lua_nome": "Crescente" }
```

> **Dica de Ouro:** Se a FastAPI estiver desligada no seu computador, o arquivo `fastapiAstroService.ts` possui uma lista padrão embutida. Você consegue trabalhar e testar o front-end perfeitamente sem precisar subir o backend em Python!

---

## 5. Regras de Ouro de UX da Equipe

Ao desenvolver qualquer tela nova neste projeto:

1. **Nunca use jargões sem explicação:** Não mostre apenas "Azimute 78°", mostre "Leste (onde o Sol nasce)".
2. **Pense sempre no celular primeiro:** 80% das pessoas vão acessar o site de noite, no celular, olhando para o céu. Botões devem ter pelo menos `44px` de altura e textos devem ser fáceis de ler no escuro.
3. **Não mostre detalhes de infraestrutura na tela:** Coisas como portas de servidor, JWT ou nomes de bancos de dados pertencem aos bastidores da engenharia, não à família ou ao estudante visitando o site.

Bom código! Se tiver dúvidas, consulte o `README.md` principal para ver comandos e configurações de ambiente.
