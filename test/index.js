let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

chai.use(chaiHttp);


describe('Test', () => {

  describe('/GET /', () => {
      it('it should GET status = 200', (done) => {
        chai.request(server)
            .get('/book')
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
  });

});