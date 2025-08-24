import { IsEnum, IsNotEmpty } from 'class-validator';
import { RequestAction } from '@common/enum/request-status.enum';

export class RequestStatusDto {
  @IsEnum(RequestAction)
  @IsNotEmpty()
  status: RequestAction;
}