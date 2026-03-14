import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from '@prisma/client';
import {config} from '../../shared/config';
import {AuthRepository} from './auth.repository';
import {TLogin} from './auth.schema';
import {HttpException} from '../../shared/exceptions/http-exception';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async login(email: TLogin['email'], password: TLogin['password']) {
    const user = await this.authRepository.findUserByEmail(email);

    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new HttpException('Invalid credentials', 401);
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }

  async register(data: TLogin & {firstName: string; lastName: string}) {
    const existingUser = await this.authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.authRepository.createUser({
      ...data,
      password: hashedPassword
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET as jwt.Secret) as {email: string};
      const user = await this.authRepository.findUserByEmail(decoded.email);

      if (!user) {
        throw new HttpException('User not found', 404);
      }

      const accessToken = this.generateAccessToken(user);
      return {accessToken};
    } catch (error) {
      throw new HttpException('Invalid refresh token', 401);
    }
  }

  private generateAccessToken(user: User) {
    return jwt.sign({id: user.id, email: user.email, role: user.role}, config.ACCESS_TOKEN_SECRET as jwt.Secret, {
      expiresIn: config.ACCESS_TOKEN_DURATION as jwt.SignOptions['expiresIn']
    });
  }

  private generateRefreshToken(user: User) {
    return jwt.sign({id: user.id, email: user.email}, config.REFRESH_TOKEN_SECRET as jwt.Secret, {
      expiresIn: config.REFRESH_TOKEN_DURATION as jwt.SignOptions['expiresIn']
    });
  }
}
