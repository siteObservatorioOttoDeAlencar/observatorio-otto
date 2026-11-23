import type { CollectionConfig } from 'payload'

import {
  PERFIS,
  apenasAdministrador,
  campoApenasAdministrador,
  campoCriacaoAdministradorOuPrimeiroUsuario,
  podeAcessarPainel,
} from '../access/perfis'

const administradorOuProprio: NonNullable<CollectionConfig['access']>['read'] = ({
  req: { user },
}) => {
  if (!user) return false
  if ((user as { perfil?: string }).perfil === 'administrador') return true
  return { id: { equals: user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuário', plural: 'Usuários' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'perfil'],
  },
  auth: true,
  access: {
    // Sem autocadastro público: só administradores criam usuários.
    // O primeiro usuário é criado pela tela inicial do /admin, que não passa por aqui.
    create: apenasAdministrador,
    delete: apenasAdministrador,
    // Administradores veem/editam todos; os demais, apenas o próprio cadastro.
    read: administradorOuProprio,
    update: administradorOuProprio,
    admin: podeAcessarPainel,
  },
  hooks: {
    beforeValidate: [
      // O primeiro cadastro (tela inicial do /admin) sempre vira administrador.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({
          collection: 'users',
          overrideAccess: true,
          req,
        })
        if (totalDocs === 0) return { ...data, perfil: 'administrador' }
        return data
      },
    ],
  },
  fields: [
    // Email e senha são adicionados automaticamente por `auth: true`.
    {
      name: 'perfil',
      label: 'Perfil',
      type: 'select',
      required: true,
      defaultValue: 'observacao',
      saveToJWT: true,
      options: [...PERFIS],
      access: {
        create: campoCriacaoAdministradorOuPrimeiroUsuario,
        update: campoApenasAdministrador,
      },
      admin: {
        description: 'Define o que o usuário pode fazer. Só administradores alteram este campo.',
      },
    },
  ],
}
