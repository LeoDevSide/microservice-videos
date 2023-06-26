import { randomUUID } from 'crypto'
import ValueObject from './value-object'

export class UniqueEntityId extends ValueObject<string> {
  constructor(id?: string) {
    super(id ?? randomUUID())
  }
}
