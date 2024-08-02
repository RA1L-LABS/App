import 'scss/printer.scss'
import { Metadata } from 'next'
import { ReactNode, Suspense } from 'react'
import { ReduxProvider } from 'redux/provider'
import Providers from 'app/providers'
import Header from 'components/shared/header'
import Switch from 'components/shared/switch'

export const metadata: Metadata = {
  title: 'App | RA1L',
  description: 'RAIL: The Future of ZK Identity',
  icons: {
    icon: '/assets/img/logo.jpg'
  }
}

export interface LayoutI {
  children: ReactNode
}

export default function RootLayout({ children }: LayoutI) {
  return (
    <html>
      <body>
        <Suspense>
          <ReduxProvider>
            <Providers>
              <Header />
              <Switch />
              {children}
            </Providers>
          </ReduxProvider>
        </Suspense>
      </body>
    </html>
  )
}
