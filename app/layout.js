// Gunakan 'export' huruf kecil
export const metadata = {
  title: 'Crypto Analysis Elsa',
  description: 'Testing Dashboard Crypto di Vercel',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: '#121212', color: 'white' }}>
        {children}
      </body>
    </html>
  )
}
