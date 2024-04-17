import jwt from 'jsonwebtoken'
import { AppError, HttpCode } from '../utils/AppError';

export class AuthService {
  createToken(data: { id: number }, secret, expirationTime): string {
    try {
      var token = jwt.sign(data, secret, { expiresIn: expirationTime });
      return token
    } catch (error) {
      throw error
    }
  }
}