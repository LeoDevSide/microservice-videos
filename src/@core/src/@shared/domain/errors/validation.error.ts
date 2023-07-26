import { FieldsErrors } from '../validators/validators-fields.interface'

export class EntityValidationError extends Error {
  constructor(public errors: FieldsErrors) {
    super('Entity Validation Error')
    this.name = JSON.stringify(this.errors)
  }
}
