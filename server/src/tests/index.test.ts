import app, { fxn, main } from '../app'
import request from 'supertest'
import 'setimmediate'
import { createSignedJWTForUser } from '../users/auth'

import * as CONFIG from '../config'

import jwt from 'jsonwebtoken'

describe('server runs', () => {
  it(`doesn't crash`, async done => {
    expect(() => {
      const server = main(3002)
      server.close()
    }).not.toThrow()
    done()
  })

  it('starts', async done => {
    expect(() => {
      const server = main()
      server.close()
    }).not.toThrow()
    done()
  })

  it('works', async done => {
    expect(() => {
      fxn()
    }).not.toThrow()
    done()
  })
})

describe('Auth utils', () => {
  it('returns a proper JWT given an id and username', done => {
    const JWToken = createSignedJWTForUser({ id: 1, username: 'giraffesyo' })
    const token = jwt.decode(JWToken)
    expect(token).toHaveProperty('iss')
    expect(token).toHaveProperty('sub')
    expect(token).toHaveProperty('aud')
    done()
  })

  // it('properly ensures environment is set', async () => {
  //   const mockExit = jest.spyOn(process, 'exit');
  //   process.env.JWT_TOKEN = undefined;
  //   await import('../src/users/auth');
  //   expect(mockExit).toHaveBeenCalledWith(1);
  // });
})

describe('POST /login', () => {
  it('rejects empty requests', async done => {
    request(app).post('/login').expect(400, done)
  })

  it('rejects incorrect password', async done => {
    request(app)
      .post('/login')
      .send({ username: 'giraffesyo', password: 'abc1234' })
      .expect(401, done)
  })
  it('rejects unknown usernames', async done => {
    request(app)
      .post('/login')
      .send({ username: 'abccccc', password: 'abc1234' })
      .expect(401, done)
  })
  it('rejects rejects empty username', async done => {
    request(app).post('/login').send({ password: 'abc1234' }).expect(400, done)
  })
  it('rejects rejects empty password', async done => {
    request(app).post('/login').send({ username: 'abc1234' }).expect(400, done)
  })
})

describe('POST /register', () => {
  it('properly handles empty username', async done => {
    const res = await request(app)
      .post('/register')
      .send({ password: 'abc123' })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Unknown Error occurred')
    done()
    // expect(res.body.message).toBe('')
  })

  it('properly handles empty password', async done => {
    const res = await request(app)
      .post('/register')
      .send({ username: 'giraffesyo' })
    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Unknown Error occurred')
    done()
  })

  // it('properly handles empty password', async done => {
  //   const res = await request(app)  //     .post('/register')
  //     .send({ username: 'giraffesyo', password: 'abc123' })
  //     .expect(201, done);
  // });
})

describe('UNAUTHENTICATED GET /userinfo', () => {
  it('properly rejects unauthenticated requests', async done => {
    const res = await request(app).get('/userinfo')
    expect(res.status).toBe(401)
    done()
  })
  it('rejects requests for non-existant but verified users (deleted users)', async done => {
    const token = jwt.sign(
      {
        iss: CONFIG.JWTOptions.issuer,
        aud: CONFIG.JWTOptions.audience,
        sub: { id: -1, username: 'nonexistent' },
      },
      CONFIG.JWTOptions.secretOrKey!,
      { expiresIn: CONFIG.JWT_EXPIRATION_TIME }
    )
    const header = `bearer ${token}`
    const res = await request(app).get('/userinfo').set('Authorization', header)
    expect(res.status).toBe(401)
    done()
  })
  it('rejects requests for invalid but SIGNED tokens ', async done => {
    const token = jwt.sign(
      {
        iss: CONFIG.JWTOptions.issuer,
        aud: CONFIG.JWTOptions.audience,
        sub: { id: 'a', username: 'nonexistent' },
      },
      CONFIG.JWTOptions.secretOrKey!,
      { expiresIn: CONFIG.JWT_EXPIRATION_TIME }
    )
    const header = `bearer ${token}`
    const res = await request(app).get('/userinfo').set('Authorization', header)
    expect(res.status).toBe(500)
    done()
  })
})

describe('GET /userinfo', () => {
  let token
  beforeAll(async done => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'quannguyen', password: 'password' })
    token = res.body
    done()
  })

  it('properly returns user info', async done => {
    const res = await request(app)
      .get('/userinfo')
      .set('Authorization', `bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('name')
    expect(res.body).toHaveProperty('zipCode')
    expect(res.body).toHaveProperty('city')
    expect(res.body).toHaveProperty('state')
    expect(res.body).toHaveProperty('addr1')
    expect(res.body).toHaveProperty('addr2')
    done()
  })
})

describe('POST /userinfo', () => {
  let token
  beforeAll(async done => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'quannguyen', password: 'password' })
    token = res.body
    done()
  })
  it('rejects names longer than 50 characters', async done => {
    request(app)
      .post('/userinfo')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // 110 A characters
        addr1: '925 N Eldridge Pkwy',
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '77079',
      })
      .expect(400, done)
  })
  it('rejects addresses1 shorter than 5 characters', async done => {
    request(app)
      .post('/userinfo')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Michael McQuade',
        addr1: '925', // 3 characters
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '77079',
      })
      .expect(400, done)
  })
  it('rejects addresses1 longer than 100 characters', async done => {
    request(app)
      .post('/userinfo')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Michael McQuade',
        addr1: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // 110 A characters
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '77079',
      })
      .expect(400, done)
  })
  it('rejects invalid addresses', async done => {
    request(app)
      .post('/userinfo')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Michael McQuade',
        addr1: '925;;;;!', // invalid characters
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '77079',
      })
      .expect(400, done)
  })
  it('rejects invalid addresses for address 2', async done => {
    request(app)
      .post('/userinfo')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: ';;;=!!!', // invalid characters
        city: 'Houston',
        state: 'TX',
        zipCode: '77079',
      })
      .expect(400, done)
  })
  it('rejects addresses2 longer than 100 characters', async done => {
    request(app)
      .post('/userinfo')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // 110 A characters
        city: 'Houston',
        state: 'TX',
        zipCode: '77079',
      })
      .expect(400, done)
  })
  it('rejects invalid characters in city name', async done => {
    request(app)
      .post('/userinfo')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: '',
        city: 'Houston;;', // invalid characters
        state: 'TX',
        zipCode: '77079',
      })
      .expect(400, done)
  })
  it('rejects short city names', async done => {
    request(app)
      .post('/userinfo')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: '',
        city: 'TX', // city too short
        state: 'TX',
        zipCode: '77079',
      })
      .expect(400, done)
  })
  it('rejects zip codes that are longer than 10 characters', async done => {
    request(app)
      .post('/userinfo')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '7707-12345', // zip code too long
      })
      .expect(400, done)
  })
  it('rejects zip codes that are shorter than 5 characters', async done => {
    request(app)
      .post('/userinfo')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '7707', // zip code too short
      })
      .expect(400, done)
  })
  it('rejects zip codes that contain letters', async done => {
    request(app)
      .post('/userinfo')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '7707a', // zip code isnt all numbers
      })
      .expect(400, done)
  })
  it('successfully updates user', async done => {
    request(app)
      .post('/userinfo')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '77079',
      })
      .expect(200, done)
  })
})

// describe('Server', () => {
//   it('listens on PORT', async done => {
//     const consoleSpy = jest.spyOn(console, 'log');
//     const server = await import('../src/index');

//     expect(consoleSpy).toHaveBeenCalled();
//     done();
//   });
// });

// describe('GET /user', function() {
//   it('responds with json', function(done) {
//     request(app)//       .get('/login')
//       .expect(200, done);
//   });
// });

// import app from './app';
// import supertest from 'supertest';
// const request = supertest(app);

// describe('GET /test', () => {
//   it('returns json with pass message', async done => {
//     const res = await request(app).get('/test');
//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe('pass');
//     done();
//   });
// });

describe('POST /quote', () => {
  let token
  beforeAll(async done => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'asdf', password: 'asdf' })
    token = res.body
    done()
  })
  it('fails (lack of parameters)', async done => {
    request(app)
      .post('/quote')
      .set('Authorization', `bearer ${token}`)
      .send({})
      .expect(400, done)
  })
  it('fails (no user)', async done => {
    request(app).post('/quote').expect(401, done)
  })

  it('succeeds', async done => {
    request(app)
      .post('/quote')
      .set('Authorization', `bearer ${token}`)
      .send({
        gallon: 10,
        deliveryDate: '2018-01-01',
      })
      .expect(200, done)
  })

  it('fails (fractional gallons)', async done => {
    request(app)
      .post('/quote')
      .set('Authorization', `bearer ${token}`)
      .send({
        gallon: 1.5,
        deliveryDate: '2018-01-01',
      })
      .expect(400, done)
  })

  it('fails (gallons not a number)', async done => {
    request(app)
      .post('/quote')
      .set('Authorization', `bearer ${token}`)
      .send({
        gallon: 'asdf',
        deliveryDate: '2018-01-01',
      })
      .expect(400, done)
  })

  it('fails (gallons are negative)', async done => {
    request(app)
      .post('/quote')
      .set('Authorization', `bearer ${token}`)
      .send({
        gallon: -1,
        deliveryDate: '2018-01-01',
      })
      .expect(400, done)
  })

  it('fails (bad delivery date)', async done => {
    request(app)
      .post('/quote')
      .set('Authorization', `bearer ${token}`)
      .send({
        gallon: 10,
        deliveryDate: 'hello',
      })
      .expect(400, done)
  })
})

describe('GET /quoteinfo', () => {
  let token
  beforeAll(async done => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'asdf', password: 'asdf' })
    token = res.body
    done()
  })

  it('fails (no user)', async done => {
    request(app).get('/quoteinfo').expect(401, done)
  })

  it('succeeds', async done => {
    request(app)
      .get('/quoteinfo')
      .set('Authorization', `bearer ${token}`)
      .expect(200, done)
  })
})
