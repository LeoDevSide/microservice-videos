// import { Transform } from 'class-transformer'
import {
  CastMemberUseCaseOutputDTO,
  FetchCastMembersOutputDTO,
} from '@me/micro-videos/src/cast-member/application'
import { CollectionPresenter } from '../../@shared/presenters/collection.presenter'
import { CastMemberType } from '@me/micro-videos/src/cast-member/domain'

export class CastMemberPresenter {
  id: string
  name: string
  type: CastMemberType
  // @Transform(({ value }: { value: Date }) => {
  //   return value.toISOString()
  // })
  created_at: Date

  constructor(output: CastMemberUseCaseOutputDTO) {
    this.id = output.id
    this.name = output.name
    this.type = output.type
    this.created_at = output.created_at
  }
}

export class CastMemberCollectionPresenter extends CollectionPresenter {
  data: CastMemberPresenter[]
  // sugestão de reuso
  // constructor(output: CastMemberOutput[], paginationProps){

  // }

  constructor(output: FetchCastMembersOutputDTO) {
    const { items, ...paginationProps } = output
    super(paginationProps)
    this.data = items.map((item) => new CastMemberPresenter(item))
  }
}
