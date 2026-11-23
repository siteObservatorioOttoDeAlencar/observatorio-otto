import type { Access, FieldAccess } from 'payload'

export const PERFIS = [
  { label: 'Administrador', value: 'administrador' },
  { label: 'Coordenador', value: 'coordenador' },
  { label: 'Editor', value: 'editor' },
  { label: 'Observação', value: 'observacao' },
] as const

export type Perfil = (typeof PERFIS)[number]['value']

/** Perfis que podem editar conteúdo (mídia e página inicial) no painel. */
const PERFIS_EDITORIAIS: Perfil[] = ['administrador', 'coordenador', 'editor']

const perfilDe = (user: unknown): Perfil | undefined =>
  (user as { perfil?: Perfil } | null | undefined)?.perfil

export const apenasAdministrador: Access = ({ req: { user } }) =>
  perfilDe(user) === 'administrador'

const ehEditorial = (user: unknown): boolean => {
  const perfil = perfilDe(user)
  return Boolean(perfil && PERFIS_EDITORIAIS.includes(perfil))
}

export const podeEditarConteudo: Access = ({ req: { user } }) => ehEditorial(user)

/**
 * Leitura pública de documentos com rascunho: visitantes só enxergam o publicado
 * (inclusive com ?draft=true); usuários do painel veem também os rascunhos.
 */
export const leituraPublicaApenasPublicado: Access = ({ req: { user } }) => {
  if (ehEditorial(user)) return true
  return { _status: { equals: 'published' } }
}

/** Acesso ao painel /admin: o perfil "observacao" usa só a API, não o painel. */
export const podeAcessarPainel = ({ req: { user } }: { req: { user: unknown } }): boolean =>
  ehEditorial(user)

/** Campo editável apenas por administradores. */
export const campoApenasAdministrador: FieldAccess = ({ req: { user } }) =>
  perfilDe(user) === 'administrador'

/** Criação do campo: administradores, ou ninguém logado (cadastro do primeiro usuário). */
export const campoCriacaoAdministradorOuPrimeiroUsuario: FieldAccess = ({ req: { user } }) =>
  !user || perfilDe(user) === 'administrador'
