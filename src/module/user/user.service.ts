import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthBy, User } from 'src/database/entity/user.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { TokenPayload } from 'google-auth-library';
import * as bcrypt from 'bcrypt'
import { Profile } from '../facebook-auth/response/profile';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  
  async create(createUserDto: CreateUserDto) {
    return this.userRepo.save(createUserDto);
  }

  async update(userId: string, updateUserDto: UpdateUserDto, queryRunner?:QueryRunner) {
    if(queryRunner){
      return queryRunner.manager.update(User, userId, updateUserDto)
    }
    return this.userRepo.update(userId, updateUserDto);
  }

  async getByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  async getByUsername(username: string) {
    return this.userRepo.findOneBy({ username });
  }

  async getById(id: string) {
    return this.userRepo.findOneBy({ id });
  }



  async removeRefreshToken(authorId: string) {
    return this.userRepo.update(authorId, {
      currentHashedRefreshToken: null,
    });
  }

  async createWithGoogle(userData: TokenPayload) {
    return this.userRepo.save({
      email: userData.email,
      name: userData.name,
      authBy: AuthBy.GOOGLE,
    });
  }

  async createWithFacebook(userData: Profile){
    return this.userRepo.save({
      email: userData.email,
      name: userData.name,
      authBy: AuthBy.FACEBOOK
    })
  }



  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user: User = await this.getById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }
  
}
