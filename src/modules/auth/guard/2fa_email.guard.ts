import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TwoFAEMailAuthGuard extends AuthGuard('2fa_email') {}
