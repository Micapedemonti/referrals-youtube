import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReferralWithUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  uidBitunix: string;

  @IsString()
  @IsNotEmpty()
  tradingView: string;
}
