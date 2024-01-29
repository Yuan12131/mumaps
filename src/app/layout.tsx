import styles from '@/app/styles/layout.module.scss'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={styles.body}>{children}</body>
    </html>
  )
}