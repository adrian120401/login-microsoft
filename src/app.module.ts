import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MicrosoftStrategy } from './strategy/microsoft.strategy';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'microsoft' }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    UserModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, MicrosoftStrategy],
})
export class AppModule {}
