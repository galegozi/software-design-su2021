import { ExtractJwt } from 'passport-jwt'
import type { StrategyOptions } from 'passport-jwt'

export const JWTOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  issuer: 'softwaredesignsu2021.local',
  audience: 'softwaredesignsu2021.local',
}
export const JWT_EXPIRATION_TIME = 10000000
export const port = 3001
export const saltRounds = 10 // salt rounds for password hashing
