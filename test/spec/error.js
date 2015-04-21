var expect = require('chai').expect
  , LineReader = require('../..');

describe('stream-lines:', function() {

  it('line reader should emit error on bad input', function(done) {
    var lines = new LineReader({buffer: true});
    function onError(e) {
      function fn() {
        throw e;
      }
      expect(fn).throws(Error);
      expect(fn).throws(/line stream accepts/);
      done();
    }

    lines.on('error', onError);
    lines.end({});
  });

});
