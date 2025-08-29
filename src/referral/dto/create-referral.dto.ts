import { IsAlphanumeric,Length,IsNumberString, IsNotEmpty } from 'class-validator';

export class CreateReferralWithUserDto {
  @IsAlphanumeric() 
  @Length(1, 20)  
  @IsNotEmpty()
  username: string;

  @IsNumberString()
  @Length(1, 10) 
  @IsNotEmpty()
  uidBitunix: string;

  @IsAlphanumeric()
  @Length(1, 30) 
  @IsNotEmpty()
  tradingView: string;
}
