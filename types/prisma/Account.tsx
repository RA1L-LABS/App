export interface AccountType {
  id?: string
  address?: string
  network?: string
  country?: string
  birthday?: string
  age?: number
  postalCode?: string
  phone?: string
  email?: string
  firstName?: string
  middleName?: string
  lastName?: string
  personaId?: string
  personaClass?: string
  personaNumber?: string
  status?: string
  nftTx?: string
  nftId?: number
  autoApprove?: boolean
  dateCreated?: Date
  dateUpdated?: Date
}

export default AccountType
