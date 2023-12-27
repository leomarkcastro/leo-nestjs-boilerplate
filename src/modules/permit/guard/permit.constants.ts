import { SetMetadata } from '@nestjs/common';
import { PermitRule } from '../permit-rule.types';

export const PERMIT_KEY = 'permit';

export const SimplePermit = (permit: string[]) =>
  SetMetadata(PERMIT_KEY, permit);

export const THROW_ON_RESOURCE_NOT_FOUND = {
  throwOnResourceNotFound: true,
};

export const IF_RESOURCE_EXIST: PermitRule<any> = {
  type: 'Condition',
  condition(v: any) {
    // We will arrive here if the fetch is successful
    return !!v;
  },
};

export const SAFE_NULL_OBJECT = {
  safeNullObject: true,
};
