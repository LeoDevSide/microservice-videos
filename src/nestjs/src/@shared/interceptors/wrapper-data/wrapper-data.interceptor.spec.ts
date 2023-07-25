import { Observable, of } from 'rxjs'
import { WrapperDataInterceptor } from './wrapper-data.interceptor'

describe('WrapperDataInterceptor', () => {
  let interceptor: WrapperDataInterceptor
  beforeEach(() => {
    interceptor = new WrapperDataInterceptor()
  })
  it('should wrapper with data key', (done) => {
    expect(new WrapperDataInterceptor()).toBeDefined()
    const fakeBody = { name: 'test' }
    const _contextParam = {} as any
    const nextParam: any = {
      handle(): Observable<any> {
        return of(fakeBody)
      },
    }
    const obs$ = interceptor.intercept(_contextParam, nextParam)
    obs$
      .subscribe({
        next: (value) => {
          expect(value).toEqual({ data: fakeBody })
        },
      })
      .add(() => {
        done()
      })
  })
  it('should not wrapper with meta key present', (done) => {
    expect(new WrapperDataInterceptor()).toBeDefined()
    const fakeBody = { meta: { name: 'test' } }
    const _contextParam = {} as any
    const nextParam: any = {
      handle(): Observable<any> {
        return of(fakeBody)
      },
    }
    const obs$ = interceptor.intercept(_contextParam, nextParam)
    obs$
      .subscribe({
        next: (value) => {
          expect(value).toEqual(fakeBody)
        },
      })
      .add(() => {
        done()
      })
  })
})
