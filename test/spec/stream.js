var expect = require('chai').expect
  , fs = require('fs')
  , LineReader = require('../..')
  //, LineEmitter = LineReader.LineEmitter;

describe('stream-lines:', function() {

  it('line reader should handle stream', function(done) {
    var lines = new LineReader()
      //, emitter = new LineEmitter()
      , source = 'test/fixtures/redis.conf'
      , received = []
      , stream = fs.createReadStream(source);

    function onLines(lines) {
      received = received.concat(lines);
    }
    function onFinish() {
      var src = fs.readFileSync(source).toString().split('\n');
      expect(received).to.eql(src);
      done();
    }

    lines.on('lines', onLines);
    lines.on('finish', onFinish);

    stream.pipe(lines);
  });
});
