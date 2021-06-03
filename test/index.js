let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/index');

chai.use(chaiHttp);
chai.should();


describe('Test', () => {

  describe('/GET /', () => {
      it('it should GET status = 200', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  done();
            });
      });
  });

});