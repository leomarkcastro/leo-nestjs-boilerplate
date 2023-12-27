import { SimplePermit } from '@/modules/permit/guard/permit.constants';
import { SimplePermitListGuard } from '@/modules/permit/guard/simplepermitlist.guard';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';

export function WithPermission(permissions: string[]) {
  return applyDecorators(
    SimplePermit(permissions),
    UseGuards(SimplePermitListGuard),
    ApiForbiddenResponse({ description: 'Forbidden Access' }),
  );
}
