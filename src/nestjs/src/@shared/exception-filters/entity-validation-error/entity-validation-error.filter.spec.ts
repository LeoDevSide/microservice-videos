import { EntityValidationErrorFilter } from './entity-validation-error.filter'
import { EntityValidationError } from '@me/micro-videos/src/@shared/domain'

describe('EntityValidationErrorFilter', () => {
  it('should be defined', () => {
    expect(new EntityValidationErrorFilter()).toBeDefined()
  })

  describe('EntityValidationErrorFilter', () => {
    let filter: EntityValidationErrorFilter

    beforeEach(() => {
      filter = new EntityValidationErrorFilter()
    })

    it('should handle EntityValidationError and return proper response', () => {
      const errors = {
        field1: ['Error message 1'],
        field2: ['Error message 2', 'Error message 3'],
      }
      const exception = new EntityValidationError(errors)

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

      expect(responseMock.status).toHaveBeenCalledWith(422)
      expect(responseMock.json).toHaveBeenCalledWith({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: ['Error message 1', 'Error message 2', 'Error message 3'],
      })
    })
  })
})
