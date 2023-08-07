import { Entity } from './entity'

export abstract class AggregateRoot<
  Props = any,
  JsonProps = any,
> extends Entity<Props, JsonProps> {}
