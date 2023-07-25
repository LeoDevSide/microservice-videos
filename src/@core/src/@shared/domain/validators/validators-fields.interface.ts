export type FieldsErrors = {
  [field: string]: string[] // name: [required, string, max_lenght, etc etc]
}
export interface IValidatorFields<PropsValidated> {
  errors: FieldsErrors
  validatedData: PropsValidated
  validate(data: any): boolean
}
