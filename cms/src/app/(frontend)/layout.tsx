import React from 'react'

export const metadata = {
  description: 'CMS do Observatório Digital Otto de Alencar.',
  title: 'Observatório Otto de Alencar — CMS',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <main>{props.children}</main>
      </body>
    </html>
  )
}
