import { FieldsErrors } from '../validators/validators-fields.interface'

export default class EntityValidationError extends Error {
  constructor(public errors: FieldsErrors) {
    super('Entity Validation Error')
    this.name = 'EntityValidationError'
  }
}
