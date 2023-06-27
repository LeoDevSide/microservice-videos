import { FieldsErrors } from '../@shared/domain/validators/validators-fields.interface'

// Allows use expect().containsErrorMessage in spec.ts files
declare global {
  // eslint-disable-next-line no-unused-vars
  namespace jest {
    // eslint-disable-next-line no-unused-vars
    interface Matchers<R> {
      containsErrorMessages: (expected: FieldsErrors) => R
    }
  }
}

export {}
