import ValueObject from '../value-object'

class StubValueObject extends ValueObject {}

// mock/spy - instancia fake
// stub
describe('ValueObject Unit Tests', () => {
  it('should set value', () => {
    let vo = new StubValueObject('string value')
    expect(vo.value).toBe('string value')

    vo = new StubValueObject({ prop1: 'value1' })
    expect(vo.value).toStrictEqual({ prop1: 'value1' })
  })

  describe('should convert to a string', () => {
    const date = new Date()
    const arrange = [
      { received: '', expected: '' },
      { received: 'fake test', expected: 'fake test' },
      { received: 0, expected: '0' },
      { received: 1, expected: '1' },
      { received: 5, expected: '5' },
      { received: true, expected: 'true' },
      { received: false, expected: 'false' },
      { received: date, expected: date.toString() },
      {
        received: { prop1: 'value1' },
        expected: JSON.stringify({ prop1: 'value1' }),
      },
    ]

    test.each(arrange)(
      'from $received to $expected',
      ({ received, expected }) => {
        const vo = new StubValueObject(received)
        expect(vo + '').toBe(expected)
      },
    )
  })
})
