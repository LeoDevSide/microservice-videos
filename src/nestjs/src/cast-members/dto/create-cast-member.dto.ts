import { IsNotEmpty, IsString, IsEnum } from 'class-validator'
import { CastMemberType } from '@me/micro-videos/src/cast-member/domain'

export class CreateCastMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(CastMemberType)
  type: CastMemberType
}
