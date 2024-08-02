import Owner from 'components/mint/owner'
import Steps from 'components/mint/steps'
import { ReactNode, Suspense } from 'react'

export const metadata = {}

export interface LayoutI {
  children: ReactNode
}

export default function LayoutComponent({ children }: LayoutI) {
  return (
    <Suspense>
      <div className="container page">
        <Owner />
        <Steps />
        {children}
      </div>
    </Suspense>
  )
}
