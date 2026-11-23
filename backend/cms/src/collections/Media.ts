import type { CollectionConfig } from 'payload'

import { podeEditarConteudo } from '../access/perfis'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Mídia', plural: 'Mídias' },
  access: {
    read: () => true,
    create: podeEditarConteudo,
    update: podeEditarConteudo,
    delete: podeEditarConteudo,
  },
  admin: {
    defaultColumns: ['filename', 'alt', 'credito', 'updatedAt'],
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo',
      type: 'text',
      required: true,
      admin: {
        description: 'Descreva a imagem para leitores de tela (acessibilidade).',
      },
    },
    {
      name: 'legenda',
      label: 'Legenda',
      type: 'text',
    },
    {
      name: 'credito',
      label: 'Crédito',
      type: 'text',
      admin: {
        description: 'Autoria ou fonte (ex.: "NASA/JPL", "Foto: Fulano").',
      },
    },
  ],
  upload: true,
}
