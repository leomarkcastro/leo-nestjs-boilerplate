import { IUserJwt } from '../auth/types/UserJWT.dto';

export type PermitRule<V> =
  | {
      type: 'Permission';
      role: string;
    }
  | {
      type: 'Condition';
      condition: (source: { user: IUserJwt; resource: V }) => boolean;
    }
  | {
      type: 'AND';
      rules: PermitRule<V>[];
    }
  | {
      type: 'OR';
      rules: PermitRule<V>[];
    };
