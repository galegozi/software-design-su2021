import app from '../src/app';
import request from 'supertest';
import 'setimmediate';
import { createSignedJWTForUser } from '../src/users/auth';

import jwt from 'jsonwebtoken';

describe('Auth utils', () => {
  it('returns a proper JWT given an id and username', done => {
    const JWToken = createSignedJWTForUser({ id: 1, username: 'giraffesyo' });
    const token = jwt.decode(JWToken);
    expect(token).toHaveProperty('iss');
    expect(token).toHaveProperty('sub');
    expect(token).toHaveProperty('aud');
    done();
  });

  // it('properly ensures environment is set', async () => {
  //   const mockExit = jest.spyOn(process, 'exit');
  //   process.env.JWT_TOKEN = undefined;
  //   await import('../src/users/auth');
  //   expect(mockExit).toHaveBeenCalledWith(1);
  // });
});

describe('POST /login', () => {
  it('rejects empty requests', async done => {
    request(app)
      .post('/login')
      .expect(400, done);
  });

  it('rejects incorrect password', async done => {
    request(app)
      .post('/login')
      .send({ username: 'giraffesyo', password: 'abc1234' })
      .expect(401, done);
  });
  it('rejects unknown usernames', async done => {
    request(app)
      .post('/login')
      .send({ username: 'abccccc', password: 'abc1234' })
      .expect(401, done);
  });
  it('rejects rejects empty username', async done => {
    request(app)
      .post('/login')
      .send({ password: 'abc1234' })
      .expect(400, done);
  });
  it('rejects rejects empty password', async done => {
    request(app)
      .post('/login')
      .send({ username: 'abc1234' })
      .expect(400, done);
  });
});

describe('POST /register', () => {
  it('properly handles empty username', async done => {
    const res = await request(app)
      .post('/register')
      .send({ password: 'abc123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Unknown Error occurred');
    done();
    // expect(res.body.message).toBe('')
  });

  it('properly handles empty password', async done => {
    const res = await request(app)
      .post('/register')
      .send({ username: 'giraffesyo' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Unknown Error occurred');
    done();
  });

  // it('properly handles empty password', async done => {
  //   const res = await request(app)
  //     .post('/register')
  //     .send({ username: 'giraffesyo', password: 'abc123' })
  //     .expect(201, done);
  // });
});

describe('GET /userinfo', () => {
  it('properly returns user info', async done => {
    const res = await request(app).get('/userinfo');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('zip');
    expect(res.body).toHaveProperty('city');
    expect(res.body).toHaveProperty('state');
    expect(res.body).toHaveProperty('address');
    expect(res.body).toHaveProperty('address2');
    done();
  });
});

describe('POST /userinfo', () => {
  it('rejects names longer than 100 characters', async done => {
    request(app)
      .post('/userinfo')
      .send({
        name:
          'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', // 110 A characters
        addr1: '925 N Eldridge Pkwy',
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '77079',
      })
      .expect(400, done);
  });
  it('rejects addresses shorter than 5 characters', async done => {
    request(app)
      .post('/userinfo')
      .send({
        name: 'Michael McQuade',
        addr1: '925', // 3 characters
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '77079',
      })
      .expect(400, done);
  });
  it('rejects invalid addresses', async done => {
    request(app)
      .post('/userinfo')
      .send({
        name: 'Michael McQuade',
        addr1: '925;;;;!', // invalid characters
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '77079',
      })
      .expect(400, done);
  });
  it('rejects invalid addresses for address 2', async done => {
    request(app)
      .post('/userinfo')
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: ';;;=!!!', // invalid characters
        city: 'Houston',
        state: 'TX',
        zipCode: '77079',
      })
      .expect(400, done);
  });
  it('rejects invalid characters in city name', async done => {
    request(app)
      .post('/userinfo')
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: '',
        city: 'Houston;;', // invalid characters
        state: 'TX',
        zipCode: '77079',
      })
      .expect(400, done);
  });
  it('rejects short city names', async done => {
    request(app)
      .post('/userinfo')
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: '',
        city: 'TX', // city too short
        state: 'TX',
        zipCode: '77079',
      })
      .expect(400, done);
  });
  it('rejects zip codes that are longer than 5 characters', async done => {
    request(app)
      .post('/userinfo')
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '770799', // zip code too long
      })
      .expect(400, done);
  });
  it('rejects zip codes that are shorter than 5 characters', async done => {
    request(app)
      .post('/userinfo')
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '7707', // zip code too short
      })
      .expect(400, done);
  });
  it('rejects zip codes that contain letters', async done => {
    request(app)
      .post('/userinfo')
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '7707a', // zip code isnt all numbers
      })
      .expect(400, done);
  });
  it('successfully updates user', async done => {
    request(app)
      .post('/userinfo')
      .send({
        name: 'Michael McQuade',
        addr1: '925 Eldridge Pkwy',
        addr2: '',
        city: 'Houston',
        state: 'TX',
        zipCode: '77079',
      })
      .expect(200, done);
  });
});

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
//     request(app)
//       .get('/login')
//       .expect(200, done);
//   });
// });

// import app from './app';
// import supertest from 'supertest';
// const request = supertest(app);

// describe('GET /test', () => {
//   it('returns json with pass message', async done => {
//     const res = await request.get('/test');
//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe('pass');
//     done();
//   });
// });
