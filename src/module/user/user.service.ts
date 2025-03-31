import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthBy, User } from 'src/database/entity/user.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { TokenPayload } from 'google-auth-library';
import * as bcrypt from 'bcrypt'
import { Profile } from '../facebook-auth/response/profile';
import { UpdatePasswordDto } from '../auth/dto/updatePassword.dto';
import dayjs from 'dayjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';




@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let user = await this.getByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Email has been used already');
    }

    user = await this.getByUsername(createUserDto.username);
    if (user) {
      throw new BadRequestException('Username has been used already');
    }

    return this.userRepo.save(createUserDto);
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
    queryRunner?: QueryRunner,
  ) {
    if (queryRunner) {
      return queryRunner.manager.update(User, userId, updateUserDto);
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
    return this.cacheManager.wrap(`user-detail:${id}`, () =>
      this.userRepo.findOneBy({ id }),
    );
  }

  // async removeRefreshToken(authorId: string) {
  //   return this.userRepo.update(authorId, {
  //     currentHashedRefreshToken: null,
  //   });
  // }

  async createWithGoogle(userData: TokenPayload) {
    return this.userRepo.save({
      email: userData.email,
      name: userData.name,
      authBy: AuthBy.GOOGLE,
    });
  }

  async createWithFacebook(userData: Profile) {
    return this.userRepo.save({
      email: userData.email,
      name: userData.name,
      authBy: AuthBy.FACEBOOK,
    });
  }

  // async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
  //   const user: User = await this.getById(userId);

  //   const isRefreshTokenMatching = await bcrypt.compare(
  //     refreshToken,
  //     user.currentHashedRefreshToken,
  //   );

  //   if (isRefreshTokenMatching) {
  //     return user;
  //   }
  // }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const user: User = await this.userRepo.findOneBy({ id: userId });
    const isPasswordMatching = await bcrypt.compare(
      updatePasswordDto.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Password is not correct');
    }
    const hashedPassword = await bcrypt.hash(
      updatePasswordDto.new_password,
      10,
    );

    return this.userRepo.update({ id: userId }, { password: hashedPassword });
  }

  async genCode(email: string, code: string, codeExprired: string) {
    return this.userRepo.update({ email }, { code, codeExprired });
  }

  async verifyCode(email: string, code: string) {
    const user = await this.userRepo.findOneBy({ email, code });
    if (!user) {
      throw new BadRequestException('Code is exprired or incorrect');
    }
    const dateExprired = dayjs(user.codeExprired); // parse

    const checkValidCode = dayjs().isBefore(dateExprired);

    if (checkValidCode) {
      // remove code
      await this.userRepo.update(user.id, { code: null });
    } else {
      throw new BadRequestException('Code is exprired or incorrect');
    }
    return checkValidCode;
  }

  async resetPassword(id: string, password: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Not found user');
    }
    return this.userRepo.update(id, { password });
  }

  async changePassword(id: string, password: string) {
    return this.userRepo.update(id, { password, codeExprired: null });
  }
}
