import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { userProviders } from 'src/user/user.provider';

@Module({
  controllers: [AuthController],
  providers: [JwtService, ...userProviders],
})
export class AuthModule {}
