var expect = require('chai').expect
  , fs = require('fs')
  , LineReader = require('../..');

describe('stream-lines:', function() {

  it('line reader should handle stream (buffer)', function(done) {
    var lines = new LineReader({buffer: true})
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
