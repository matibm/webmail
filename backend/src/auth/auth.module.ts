import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EncryptionService } from './encryption.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }, // Token valid for 1 day
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, EncryptionService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, EncryptionService] // Export if needed elsewhere
})
export class AuthModule { }
