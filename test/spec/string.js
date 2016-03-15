var expect = require('chai').expect
  , LineReader = require('../..');

describe('stream-lines:', function() {

  it('line reader should handle string input', function(done) {
    var lines = new LineReader({buffer: true})
      , received = [];

    function onLines(lines) {
      received = received.concat(lines);
    }

    function onFinish() {
      expect(received).to.eql(['1', '2', '3']);
      done();
    }

    lines.on('lines', onLines);
    lines.on('finish', onFinish);
    lines.end('1\n2\n3');
  });

  it('line reader should handle simple buffer input', function(done) {
    var lines = new LineReader()
      , received = [];

    function onLines(lines) {
      received = received.concat(lines);
    }

    function onFinish() {
      expect(received).to.eql(['1', '2', '3']);
      done();
    }

    lines.on('lines', onLines);
    lines.on('finish', onFinish);
    lines.end(new Buffer('1\n2\n3'));
  });

});
