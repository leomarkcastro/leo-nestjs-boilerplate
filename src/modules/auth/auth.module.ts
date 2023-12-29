import { CONFIG } from '@/config/env';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailBrevoModule } from '../mail-brevo/mail-brevo.module';
import { AuthService } from './services/auth.service';
import { TwoFaEmailStrategy } from './strategies/2fa_email.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: CONFIG.SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    MailBrevoModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, TwoFaEmailStrategy],
  exports: [AuthService],
})
export class AuthModule {}
