import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ERROR_MESSAGES_FORM_VALIDATION } from '@/shared/utils/errors/error-messages-validations';

export class AuthDTO {
  @IsEmail(
    {},
    {
      message: ERROR_MESSAGES_FORM_VALIDATION.EMAIL,
    },
  )
  @IsString({
    message: ERROR_MESSAGES_FORM_VALIDATION.INVALID_VALUE,
  })
  @IsNotEmpty({
    message: ERROR_MESSAGES_FORM_VALIDATION.EMPTY,
  })
  email: string;

  @IsNotEmpty({
    message: ERROR_MESSAGES_FORM_VALIDATION.INVALID_VALUE,
  })
  password: string;
}
