import { FieldsErrors } from '../validators'

export class LoadEntityError extends Error {
  constructor(public errors: FieldsErrors, message?: string) {
    super(message ?? 'An entity can not be loaded')
    this.name = 'loadEntityError'
  }
}
