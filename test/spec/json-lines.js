var expect = require('chai').expect
  , fs = require('fs')
  , LineReader = require('../..');

describe('stream-lines:', function() {

  it('line reader should parse long json lines', function(done) {
    var lines = new LineReader()
      , source = 'test/fixtures/fuzzy-json.log.json'
      , received = []
      , stream = fs.createReadStream(source);

    function onLines(lines) {
      received = received.concat(lines);
    }

    function onFinish() {
      received.forEach(function(line) {
        if(!line){return} 
        //try {
          //JSON.parse(line);
        //}catch(e) {
          //console.error('stream-lines: produced non-json line'); 
          //console.error(line);
        //}
        expect(JSON.parse(line)).to.be.an('object');
      })
      done();
    }

    lines.on('lines', onLines);
    lines.on('finish', onFinish);

    stream.pipe(lines);
  });
});
