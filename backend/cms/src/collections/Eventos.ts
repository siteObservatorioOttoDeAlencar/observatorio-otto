import type { CollectionConfig } from 'payload'

import { leituraPublicaApenasPublicado, podeEditarConteudo } from '../access/perfis'

/** Eventos do observatório (observações públicas, oficinas, palestras, visitas). */
export const Eventos: CollectionConfig = {
  slug: 'eventos',
  labels: { singular: 'Evento', plural: 'Eventos' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'tipo', 'inicio', 'situacao', '_status'],
  },
  access: {
    // Visitantes só enxergam eventos publicados; o painel vê também os rascunhos.
    read: leituraPublicaApenasPublicado,
    create: podeEditarConteudo,
    update: podeEditarConteudo,
    delete: podeEditarConteudo,
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
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      required: true,
      options: [
        { label: 'Observação', value: 'observacao' },
        { label: 'Oficina', value: 'oficina' },
        { label: 'Palestra', value: 'palestra' },
        { label: 'Visita', value: 'visita' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'inicio',
          label: 'Início',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' } },
        },
        {
          name: 'fim',
          label: 'Fim',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' } },
          validate: (valor: unknown, { siblingData }: { siblingData: { inicio?: string } }) => {
            if (valor && siblingData?.inicio && new Date(valor as string) < new Date(siblingData.inicio)) {
              return 'O fim não pode ser anterior ao início.'
            }
            return true
          },
        },
      ],
    },
    {
      name: 'local',
      label: 'Local',
      type: 'text',
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'richText',
    },
    {
      name: 'publicoAlvo',
      label: 'Público-alvo',
      type: 'text',
      admin: { description: 'Ex.: "Estudantes do ensino médio", "Público geral".' },
    },
    {
      name: 'situacao',
      label: 'Situação',
      type: 'select',
      required: true,
      defaultValue: 'agendado',
      options: [
        { label: 'Agendado', value: 'agendado' },
        { label: 'Realizado', value: 'realizado' },
        { label: 'Cancelado', value: 'cancelado' },
      ],
    },
    {
      name: 'linkInscricao',
      label: 'Link de inscrição',
      type: 'text',
      admin: { description: 'Opcional. Endereço completo, começando com https://' },
      validate: (valor: unknown) => {
        if (!valor) return true
        try {
          const url = new URL(valor as string)
          return ['http:', 'https:'].includes(url.protocol) || 'Use um endereço http:// ou https://'
        } catch {
          return 'Informe um endereço válido, começando com https://'
        }
      },
    },
    {
      name: 'fotos',
      label: 'Fotos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'relato',
      label: 'Relato',
      type: 'richText',
      admin: { description: 'Texto sobre como foi o evento (preencher depois de realizado).' },
    },
  ],
}
