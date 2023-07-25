import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { WrapperDataInterceptor } from './@shared/interceptors/wrapper-data/wrapper-data.interceptor'
import { EntityValidationErrorFilter } from './@shared/exception-filters/entity-validation-error/entity-validation-error.filter'
import { NotFoundErrorFilter } from './@shared/exception-filters/not-found-error/not-found-error.filter'

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  )
  app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: 422 }))
  app.useGlobalFilters(
    new EntityValidationErrorFilter(),
    new NotFoundErrorFilter(),
  )
}
