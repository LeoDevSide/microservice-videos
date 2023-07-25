import { instanceToPlain } from 'class-transformer'
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './categories.presenter'
import { PaginationPresenter } from '../../@shared/presenters/pagination.presenter'

describe('CategoryPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const createdAt = new Date()
      const presenter = new CategoryPresenter({
        id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at: createdAt,
      })

      expect(presenter.id).toBe('61cd7b66-c215-4b84-bead-9aef0911aba7')
      expect(presenter.name).toBe('movie')
      expect(presenter.description).toBe('some description')
      expect(presenter.is_active).toBe(true)
      expect(presenter.created_at).toBe(createdAt)
    })
  })

  it('should presenter data', () => {
    const createdAt = new Date()
    const presenter = new CategoryPresenter({
      id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
      name: 'movie',
      description: 'some description',
      is_active: true,
      created_at: createdAt,
    })

    const data = instanceToPlain(presenter)
    expect(data).toStrictEqual({
      id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
      name: 'movie',
      description: 'some description',
      is_active: true,
      created_at: createdAt.toISOString(),
    })
  })
})

describe('CategoryCollectionPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const createdAt = new Date()
      const presenter = new CategoryCollectionPresenter({
        items: [
          {
            id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
            name: 'movie',
            description: 'some description',
            is_active: true,
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
        new CategoryPresenter({
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at: createdAt,
        }),
      ])
    })
  })

  it('should presenter data', () => {
    const createdAt = new Date()
    let presenter = new CategoryCollectionPresenter({
      items: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
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
          description: 'some description',
          is_active: true,
          created_at: createdAt.toISOString(),
        },
      ],
    })

    presenter = new CategoryCollectionPresenter({
      items: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
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
          description: 'some description',
          is_active: true,
          created_at: createdAt.toISOString(),
        },
      ],
    })
  })
})
