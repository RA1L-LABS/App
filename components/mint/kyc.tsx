import dynamic from 'next/dynamic'
import { useState } from 'react'
import { setData, setProgress, setStep } from 'redux/slice/mint'
import { useDispatch } from 'redux/store'
import { post } from 'superagent'
import AccountType from 'types/prisma/Account'
import { PERSONA_ENVIRONMENT_ID, PERSONA_TEMPLATE_ID } from 'util/persona'
import { hexConverter } from 'util/wallet'
import { useAccount } from 'wagmi'

export interface KycI {}

export const options = {
  host: 'production',
  templateId: PERSONA_TEMPLATE_ID,
  templateVersionId: '',
  environment: 'sandbox'
}

export function Kyc({}: KycI) {
  const dispatch = useDispatch()
  const { chainId } = useAccount()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const Inquiry = dynamic(() => import('persona').then((mod) => mod.Inquiry), {
    ssr: false
  })

  return (
    <div className="mint-kyc">
      <h2>Verify Your Identity</h2>
      <p>
        We need this key information from you in order to mint your KYC Token
      </p>
      <Inquiry
        templateId={PERSONA_TEMPLATE_ID}
        environmentId={PERSONA_ENVIRONMENT_ID}
        onLoad={() => {
          console.log('Persona Loaded')
        }}
        onError={(error) => {
          console.error(error)
        }}
        onCancel={(cancel) => {
          console.log('Cancelled')
        }}
        onComplete={async ({ inquiryId, status, fields }) => {
          const fieldData = fields as any
          const payload: AccountType = {
            network: hexConverter(chainId || 0),
            country: fieldData['address-country-code']?.value || '',
            birthday: (fieldData.birthdate as any)?.value || '',
            postalCode: fieldData['address-postal-code']?.value || '',
            phone: fieldData['phone-number']?.value || '',
            email: fieldData['email-address']?.value || '',
            firstName: fieldData['name-first']?.value || '',
            middleName: fieldData['name-middle']?.value || '',
            lastName: fieldData['name-last']?.value || '',
            personaId: inquiryId,
            personaClass: fieldData['selected-id-class']?.value || '',
            personaNumber: fieldData['identification-number']?.value || '',
            status
          }

          const age = Number(payload.birthday?.split('-')[0])
          payload.age = age

          setLoading(true)
          setError(false)
          try {
            await post('/api/submit').send(payload)
            dispatch(setData(payload))
            dispatch(setProgress(3))
            dispatch(setStep(3))
          } catch (error) {
            console.error(error)
            setError(true)
          }
          setLoading(false)
        }}
      />
    </div>
  )
}

export default Kyc
