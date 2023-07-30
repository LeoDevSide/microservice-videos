import { CastMemberType } from '../../../domain'

export type CastMemberUseCaseOutputDTO = {
  id: string
  name: string
  type: CastMemberType
  created_at: Date
}
