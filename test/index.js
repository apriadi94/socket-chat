let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/index');
let io     = require('socket.io-client');

chai.use(chaiHttp);
chai.should();

let expect = chai.expect;  

var socketUrl = 'http://localhost:8010';

var options = {  
  transports: ['websocket'],
  'force new connection': true
};

describe('Test', () => {
  var client1;

  describe('emit REQUEST_CONVERSATION', () => {
    it('should listen of conversation and get array', function (done) {  
      // Set up client1 connection
      client1 = io.connect(socketUrl, options);
  
      client1.emit('REQUEST_CONVERSATION')
      client1.on('CONVERSATION_SENT', function(msg){
        expect(msg).to.be.a('array');
        done();
      });
    });
  })
});