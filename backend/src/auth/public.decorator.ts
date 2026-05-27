import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_LINK = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_LINK, true);
