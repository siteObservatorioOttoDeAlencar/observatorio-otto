import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Inicio } from './globals/Inicio'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media],
  globals: [Inicio],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Esquema sempre controlado por migrações (npm run payload migrate:create),
    // inclusive em desenvolvimento: o que roda local é o que roda em produção.
    push: false,
    // Embute as migrações no bundle: `payload migrate` funciona no build da Vercel.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      // Sem BLOB_READ_WRITE_TOKEN (dev local) o plugin se desativa e os
      // arquivos vão para o disco local (cms/media).
      token: process.env.BLOB_READ_WRITE_TOKEN,
      collections: { media: true },
      // Mantém o mesmo esquema do banco com ou sem o token (migrações iguais).
      alwaysInsertFields: true,
    }),
  ],
})
