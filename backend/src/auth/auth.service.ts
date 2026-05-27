import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PersonService } from '../person/person.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly person: PersonService,
    private readonly jwtServices: JwtService,
  ) {}

  async signIn(createAuthDto: CreateAuthDto) {
    try {
      const res = await this.person.getOneSingIn(
        createAuthDto.name,
        createAuthDto.password,
      );

      const payload = { id: res.id, name: res.name, birthday: res.birthday };

      const token = await this.jwtServices.signAsync(payload);

      return { access_token: token };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
