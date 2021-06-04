let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/index');
let io     = require('socket.io-client');

chai.use(chaiHttp);
chai.should();

let expect = chai.expect;  

var socketUrl = `http://localhost:8010`;

var options = {  
  transports: ['websocket'],
  'force new connection': true
};

describe('Conversation', () => {
  var socket;

  describe('emit REQUEST_CONVERSATION', () => {
    it('should listen of conversation and get array', function (done) {  
      socket = io.connect(socketUrl, options);
  
      socket.emit('REQUEST_CONVERSATION')
      socket.on('CONVERSATION_SENT', function(msg){
        expect(msg).to.be.a('array');
        done();
      });
    });
  })
});