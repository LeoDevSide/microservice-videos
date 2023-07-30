import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CategoriesModule } from './categories/categories.module'
import { ConfigModule } from './config/config.module'
import { DatabaseModule } from './database/database.module'
import { SharedModule } from './@shared/@shared.module'
import { CastMembersModule } from './cast-members/cast-members.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    CategoriesModule,
    DatabaseModule,
    SharedModule,
    CastMembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
