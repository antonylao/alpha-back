import jwt from 'jsonwebtoken'

export class AuthService {
  createToken(data: { id: number }, secret, expirationTime): string {
    var token = jwt.sign(data, secret, { expiresIn: expirationTime });
    return token
  }
}