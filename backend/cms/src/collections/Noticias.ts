import type { CollectionConfig } from 'payload'

import { leituraPublicaApenasPublicado, podeEditarConteudo } from '../access/perfis'

/** Notícias e artigos de divulgação científica (página /conteudo do site). */
export const Noticias: CollectionConfig = {
  slug: 'noticias',
  labels: { singular: 'Notícia', plural: 'Notícias' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'categoria', 'dataPublicacao', '_status'],
  },
  access: {
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
      name: 'slug',
      label: 'Endereço (slug)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Parte final da URL, em minúsculas e com hífens. Ex.: otto-de-alencar-sobral-1919' },
      validate: (valor: unknown) =>
        (typeof valor === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(valor)) ||
        'Use apenas letras minúsculas sem acento, números e hífens (ex.: meu-artigo).',
    },
    {
      name: 'resumo',
      label: 'Resumo',
      type: 'textarea',
      required: true,
    },
    {
      name: 'categoria',
      label: 'Categoria',
      type: 'select',
      options: [
        { label: 'Astrofísica', value: 'astrofisica' },
        { label: 'História da Ciência', value: 'historia-da-ciencia' },
        { label: 'Observacional', value: 'observacional' },
        { label: 'Instrumentação', value: 'instrumentacao' },
      ],
    },
    {
      name: 'autor',
      label: 'Autor(es)',
      type: 'text',
    },
    {
      name: 'corpo',
      label: 'Corpo do texto',
      type: 'richText',
    },
    {
      name: 'capa',
      label: 'Capa',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'dataPublicacao',
      label: 'Data de publicação',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
    },
    {
      name: 'projetoRelacionado',
      label: 'Projeto relacionado',
      type: 'text',
      admin: { description: 'Opcional. Nome do projeto de pesquisa/extensão ao qual o texto se relaciona.' },
    },
  ],
}
