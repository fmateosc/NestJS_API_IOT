// src/modules/auth/decorators/access.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { ACCESS_LEVEL, ACCESS_LEVEL_KEY } from 'src/constants';

export const Access = (...access: Array<keyof typeof ACCESS_LEVEL>) =>
  SetMetadata(ACCESS_LEVEL_KEY, access);
