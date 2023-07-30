import { FieldsErrors } from '../validators'

export class ValidationError extends Error {}

export abstract class BaseValidationError extends Error {
  public errors: FieldsErrors
  constructor(errors: FieldsErrors = {}, message = 'Validation Error') {
    super(message)
    this.errors = errors
  }

  setFromError(field: string, error: Error) {
    if (error) {
      this.errors[field] = [error.message]
    }
  }

  count() {
    return Object.keys(this.errors).length
  }
}

export class EntityValidationError extends BaseValidationError {
  constructor(public errors: FieldsErrors = {}) {
    super(errors, 'Entity Validation Error')
    this.name = 'EntityValidationError'
  }
}

export class SearchValidationError extends BaseValidationError {
  constructor(public errors: FieldsErrors = {}) {
    super(errors, 'Search Validation Error')
    this.name = 'SearchValidationError'
  }
}
