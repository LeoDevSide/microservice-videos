import { NotFoundError } from '@me/micro-videos/src/@shared/domain'
import { NotFoundErrorFilter } from './not-found-error.filter'

describe('NotFoundErrorFilter', () => {
  it('should be defined', () => {
    expect(new NotFoundErrorFilter()).toBeDefined()
  })

  describe('NotFoundErrorFilter', () => {
    let filter: NotFoundErrorFilter

    beforeEach(() => {
      filter = new NotFoundErrorFilter()
    })

    it('should handle NotFoundError and return proper response', () => {
      const errorMessage = 'Category anyid not found in db'

      const exception = new NotFoundError(errorMessage)

      const responseMock: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const hostMock = {
        switchToHttp: () => ({
          getResponse: () => responseMock,
        }),
      }

      filter.catch(exception, hostMock as any)

      expect(responseMock.status).toHaveBeenCalledWith(404)
      expect(responseMock.json).toHaveBeenCalledWith({
        statusCode: 404,
        error: 'Not Found',
        message: errorMessage,
      })
    })
  })
})
