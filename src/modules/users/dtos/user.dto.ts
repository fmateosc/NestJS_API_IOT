// user.dto.ts

import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ACCESS_LEVEL } from 'src/constants';

/**
 * @description Data Transfer Object (DTO) maestro para la creación y validación de Usuarios.
 * Contiene reglas estrictas de Regex para contraseñas seguras y restricciones de formato para usernames.
 */
export class UserDto {
  //id
  @IsOptional()
  @IsString()
  id?: string;

  /** @property {string} username - Nombre de usuario alfanumérico en minúsculas (Mínimo 4 caracteres). */
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  username: string;

  /** @property {string} password - Contraseña cruda que será hasheada. Debe contener Mayúscula, Minúscula, Número y Carácter Especial. */
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,20}/,
    {
      message:
        'The password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be between 8 and 20 characters long',
    },
  )
  password: string;

  /** @property {ACCESS_LEVEL} userAccess - Opcional. Forzado por el Backend a ADMIN si proviene de registro Web Público. */
  @IsOptional()
  @IsEnum(ACCESS_LEVEL)
  userAccess?: ACCESS_LEVEL;

  /** @property {string} userFullName - Nombre completo opcional, utilizado para personalización de Correos. */
  @IsOptional()
  @IsString()
  @MinLength(4) // new update front
  @MaxLength(50) // new update front
  userFullName?: string;

  /** @property {string} userEmail - Dirección destino para 2FA y Verificación. */
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  userEmail: string;

  // userToken
  @IsOptional()
  @IsString()
  userToken?: string;

  // userLogin
  @IsOptional()
  @IsBoolean()
  userLogin?: boolean;

  // userLastseen
  @IsOptional()
  @IsDate()
  userLastseen?: Date;

  // userStatus
  @IsOptional()
  @IsBoolean()
  userStatus?: boolean;

  // salt
  @IsOptional()
  @IsString()
  salt?: string;

  // isSuperuser
  @IsOptional()
  @IsBoolean()
  isSuperuser?: boolean;
}
