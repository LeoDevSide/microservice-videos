export type FieldsErrors = {
  [field: string]: string[] // name: [required, string, max_lenght, etc etc]
}
export default interface IValidatorFields<PropsValidated> {
  errors: FieldsErrors
  validatedData: PropsValidated
  validate(data: any): boolean
}
