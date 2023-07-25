import { Transform } from 'class-transformer'
import {
  CategoryOutputDTO,
  FetchCategoriesOutputDTO,
} from '@me/micro-videos/src/category/application'
import { CollectionPresenter } from '../../@shared/presenters/collection.presenter'

export class CategoryPresenter {
  id: string
  name: string
  description: string | null
  is_active: boolean
  @Transform(({ value }: { value: Date }) => {
    return value.toISOString()
  })
  created_at: Date

  constructor(output: CategoryOutputDTO) {
    this.id = output.id
    this.name = output.name
    this.description = output.description
    this.is_active = output.is_active
    this.created_at = output.created_at
  }
}

export class CategoryCollectionPresenter extends CollectionPresenter {
  data: CategoryPresenter[]
  // sugestão de reuso
  // constructor(output: CategoryOutput[], paginationProps){

  // }

  constructor(output: FetchCategoriesOutputDTO) {
    const { items, ...paginationProps } = output
    super(paginationProps)
    this.data = items.map((item) => new CategoryPresenter(item))
  }
}
