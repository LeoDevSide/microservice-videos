import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Query,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common'
import { CreateCastMemberDto } from './dto/create-cast-member.dto'
import { UpdateCastMemberDto } from './dto/update-cast-member.dto'
import {
  CastMemberUseCaseOutputDTO,
  CreateCastMemberUseCase,
  DeleteCastMemberUseCase,
  FetchCastMembersUseCase,
  GetCastMemberUseCase,
  UpdateCastMemberUseCase,
} from '@me/micro-videos/src/cast-member/application'
import { SearchCastMembersDTO } from './dto/search-cast-members.dto'
import {
  CastMemberCollectionPresenter,
  CastMemberPresenter,
} from './presenter/cast-members.presenter'
@Controller('cast-members')
export class CastMembersController {
  public static toResponse(output: CastMemberUseCaseOutputDTO) {
    return new CastMemberPresenter(output)
  }

  @Inject(CreateCastMemberUseCase)
  private createCastMemberUseCase: CreateCastMemberUseCase

  @Inject(GetCastMemberUseCase)
  private getCastMemberUseCase: GetCastMemberUseCase

  @Inject(FetchCastMembersUseCase)
  private fetchCastMembersUseCase: FetchCastMembersUseCase

  @Inject(UpdateCastMemberUseCase)
  private updateCastMemberUseCase: UpdateCastMemberUseCase

  @Inject(DeleteCastMemberUseCase)
  private deleteCastMemberUseCase: DeleteCastMemberUseCase

  @Post()
  async create(@Body() createCastMemberDto: CreateCastMemberDto) {
    const output = await this.createCastMemberUseCase.execute(
      createCastMemberDto,
    )
    return CastMembersController.toResponse(output)
  }

  @Get()
  async search(@Query() searchCastMembersDto: SearchCastMembersDTO) {
    const output = await this.fetchCastMembersUseCase.execute(
      searchCastMembersDto,
    )
    return new CastMemberCollectionPresenter(output)
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getCastMemberUseCase.execute({ id })
    return CastMembersController.toResponse(output)
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCastMemberDto: UpdateCastMemberDto,
  ) {
    const output = await this.updateCastMemberUseCase.execute({
      id,
      name: updateCastMemberDto.name,
      type: updateCastMemberDto.type,
    })
    return CastMembersController.toResponse(output)
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    await this.deleteCastMemberUseCase.execute({ id })
  }
}
