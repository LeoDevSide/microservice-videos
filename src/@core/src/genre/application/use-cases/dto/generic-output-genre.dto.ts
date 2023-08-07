export type GenreUseCaseOutputDTO = {
  id: string
  name: string
  is_active: boolean
  created_at: Date

  categories_id: string[]
}
