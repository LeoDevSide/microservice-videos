import { instanceToPlain } from 'class-transformer'
import { GenreCollectionPresenter, GenrePresenter } from './genres.presenter'
import { PaginationPresenter } from '../../@shared/presenters/pagination.presenter'

describe('GenrePresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const createdAt = new Date()
      const presenter = new GenrePresenter({
        id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
        name: 'name',
        is_active: true,
        categories_id: ['23', '123'],
        created_at: createdAt,
      })

      expect(presenter.id).toBe('61cd7b66-c215-4b84-bead-9aef0911aba7')
      expect(presenter.name).toBe('name')
      expect(presenter.is_active).toBe(true)
      expect(presenter.created_at).toBe(createdAt)
      expect(presenter.categories_id).toEqual(['23', '123'])
    })
  })

  it('should presenter data', () => {
    const createdAt = new Date()
    const presenter = new GenrePresenter({
      id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
      name: 'movie',
      is_active: true,
      categories_id: ['23', '123'],
      created_at: createdAt,
    })

    const data = instanceToPlain(presenter)
    expect(data).toStrictEqual({
      id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
      name: 'movie',
      is_active: true,
      categories_id: ['23', '123'],
      created_at: createdAt.toISOString(),
    })
  })
})

describe('GenreCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const createdAt = new Date()
      const presenter = new GenreCollectionPresenter({
        items: [
          {
            id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
            name: 'movie',
            is_active: true,
            categories_id: ['23', '123'],
            created_at: createdAt,
          },
        ],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      })

      expect(presenter.meta).toBeInstanceOf(PaginationPresenter)
      expect(presenter.meta).toEqual(
        new PaginationPresenter({
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        }),
      )
      expect(presenter.data).toStrictEqual([
        new GenrePresenter({
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          is_active: true,
          categories_id: ['23', '123'],
          created_at: createdAt,
        }),
      ])
    })
  })

  it('should presenter data', () => {
    const createdAt = new Date()
    let presenter = new GenreCollectionPresenter({
      items: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          is_active: true,
          categories_id: ['23', '123'],
          created_at: createdAt,
        },
      ],
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    })

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          is_active: true,
          categories_id: ['23', '123'],
          created_at: createdAt.toISOString(),
        },
      ],
    })

    presenter = new GenreCollectionPresenter({
      items: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          is_active: true,
          categories_id: ['23', '123'],
          created_at: createdAt,
        },
      ],
      current_page: '1' as any,
      per_page: '2' as any,
      last_page: '3' as any,
      total: '4' as any,
    })

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          is_active: true,
          categories_id: ['23', '123'],
          created_at: createdAt.toISOString(),
        },
      ],
    })
  })
})
