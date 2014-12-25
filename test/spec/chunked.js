var expect = require('chai').expect
  , fs = require('fs')
  , LineReader = require('../..');

describe('streamlines:', function() {

  it('line reader should handle chunks', function(done) {

    var lines = new LineReader()
      , buf = fs.readFileSync('test/fixtures/redis.conf')
      , buffers = []
      , longline
      , size = 4096
      , len
      , interval
      , i = 0;

    longline = new Buffer(size * 4);
    longline.fill('a'.charCodeAt(0))

    buf = Buffer.concat([buf, longline])

    var len = buf.length / size;
    if(buf.length % size !== 0) len++;

    for(i = 0;i < len;i++) {
      buffers.push(buf.slice(i * size, (i * size) + size));
    }

    i = 0;
    function writeChunk() {
      var chunk = buffers[i];
      //console.dir('writing chunk: ' + chunk);
      if(!chunk) {
        lines.end();
        done();
        return clearInterval(interval);
      }
      lines.write(chunk);
      i++;
    }

    interval = setInterval(writeChunk, 1);
  });

});
