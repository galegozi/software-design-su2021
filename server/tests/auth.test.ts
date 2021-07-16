import app from '../src/app';
import request from 'supertest';
import 'setimmediate';

describe('POST /login', () => {
  it('rejects empty requests', async done => {
    request(app)
      .post('/login')
      .expect(400, done);
  });
});

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
