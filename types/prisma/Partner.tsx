import RequestType from 'types/prisma/Request'

export interface PartnerType {
  id?: string
  address?: string
  network?: string
  name?: string
  description?: string
  requests?: RequestType[]
  dateCreated?: Date
  dateUpdated?: Date
}

export default PartnerType
