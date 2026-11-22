import { redirect } from 'next/navigation'

// Este projeto é só o CMS: a raiz leva ao painel administrativo.
export default function HomePage() {
  redirect('/admin')
}
