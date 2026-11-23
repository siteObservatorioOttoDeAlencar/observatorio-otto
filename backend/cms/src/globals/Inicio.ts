import type { GlobalConfig } from 'payload'

import { leituraPublicaApenasPublicado, podeEditarConteudo } from '../access/perfis'

/** Página inicial do site (conteúdo único, com rascunho/publicação). */
export const Inicio: GlobalConfig = {
  slug: 'inicio',
  label: 'Início',
  access: {
    read: leituraPublicaApenasPublicado,
    update: podeEditarConteudo,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'titulo',
      label: 'Título',
      type: 'text',
      required: true,
    },
    {
      name: 'apresentacao',
      label: 'Apresentação',
      type: 'richText',
    },
    {
      name: 'destaques',
      label: 'Destaques',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
  ],
}
