// import { Transform } from 'class-transformer'
import {
  GenreUseCaseOutputDTO,
  FetchGenresOutputDTO,
} from '@me/micro-videos/src/genre/application'
import { CollectionPresenter } from '../../@shared/presenters/collection.presenter'
import { Transform } from 'class-transformer'

export class GenrePresenter {
  id: string
  name: string
  is_active: boolean
  categories_id: string[]
  @Transform(({ value }: { value: Date }) => {
    return value.toISOString()
  })
  created_at: Date

  constructor(output: GenreUseCaseOutputDTO) {
    this.id = output.id
    this.name = output.name
    this.is_active = output.is_active
    this.created_at = output.created_at
    this.categories_id = output.categories_id
  }
}

export class GenreCollectionPresenter extends CollectionPresenter {
  data: GenrePresenter[]
  // sugestão de reuso
  // constructor(output: GenreOutput[], paginationProps){

  // }

  constructor(output: FetchGenresOutputDTO) {
    const { items, ...paginationProps } = output
    super(paginationProps)
    this.data = items.map((item) => new GenrePresenter(item))
  }
}
