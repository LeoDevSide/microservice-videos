import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  Query,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common'
import { CreateGenreDto } from './dto/create-genre.dto'
import { UpdateGenreDto } from './dto/update-genre.dto'
import {
  CreateGenreUseCase,
  DeleteGenreUseCase,
  FetchGenresUseCase,
  GenreUseCaseOutputDTO,
  GetGenreUseCase,
  UpdateGenreUseCase,
} from '@me/micro-videos/src/genre/application'
import { SearchGenresDTO } from './dto/search-genres.dto'
import {
  GenreCollectionPresenter,
  GenrePresenter,
} from './presenter/genres.presenter'

@Controller('genres')
export class GenresController {
  @Inject(CreateGenreUseCase)
  private createGenreUseCase: CreateGenreUseCase

  @Inject(GetGenreUseCase)
  private getGenreUseCase: GetGenreUseCase

  @Inject(FetchGenresUseCase)
  private fetchGenresUseCase: FetchGenresUseCase

  @Inject(UpdateGenreUseCase)
  private updateGenreUseCase: UpdateGenreUseCase

  @Inject(DeleteGenreUseCase)
  private deleteGenreUseCase: DeleteGenreUseCase

  @Post()
  async create(@Body() createGenreDto: CreateGenreDto) {
    const output = await this.createGenreUseCase.execute(createGenreDto)
    return GenresController.toResponse(output)
  }

  @Get()
  async search(@Query() searchGenresDto: SearchGenresDTO) {
    const output = await this.fetchGenresUseCase.execute(searchGenresDto)
    return new GenreCollectionPresenter(output)
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getGenreUseCase.execute({ id })
    return GenresController.toResponse(output)
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    const output = await this.updateGenreUseCase.execute({
      id,
      ...updateGenreDto,
    })
    return GenresController.toResponse(output)
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    await this.deleteGenreUseCase.execute({ id })
  }

  public static toResponse(output: GenreUseCaseOutputDTO) {
    return new GenrePresenter(output)
  }
}
