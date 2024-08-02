import PartnerType from 'types/prisma/Partner'

export interface RequestType {
  id?: string
  address?: string
  network?: string
  account?: string
  approved?: boolean
  partner?: PartnerType
  dateCreated?: Date
  dateUpdated?: Date
}

export default RequestType
