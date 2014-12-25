var expect = require('chai').expect
  , fs = require('fs')
  , LineReader = require('../..')
  , LineEmitter = LineReader.LineEmitter;

describe('stream-lines:', function() {

  it('line reader should handle input with no newlines', function(done) {
    var lines = new LineReader()
      , emitter = new LineEmitter()
      , source = 'test/fixtures/no-newline.conf'
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

    emitter.on('lines', onLines);
    lines.on('finish', onFinish);

    stream.pipe(lines).pipe(emitter);
  });
});
