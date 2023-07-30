import { IsString, IsEnum, IsOptional } from 'class-validator'
import {} from '@me/micro-videos/src/cast-member/application'
import { CastMemberType } from '@me/micro-videos/src/cast-member/domain'

export class UpdateCastMemberDto {
  @IsString()
  @IsOptional()
  name: string

  @IsEnum(CastMemberType)
  @IsOptional()
  type: CastMemberType
}
