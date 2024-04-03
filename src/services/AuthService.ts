import jwt from 'jsonwebtoken'

export class AuthService {
  createToken(data: { id: number }): string {
    var token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: '4h' });
    return token
  }
}