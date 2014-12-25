var util = require('util')
  , Transform = require('stream').Transform
  , CR = '\r'.charCodeAt(0)
  , LF = '\n'.charCodeAt(0);

/**
 *  Reads stream buffers and writes arrays of lines.
 *
 *  Designed to be piped to another transform stream that
 *  operates on the array of lines.
 *
 *  ## Options
 *
 *  @param encoding The encoding to use when converting buffers to strings.
 *  @param eol The EOL separator used to split lines, default is /\r?\n/.
 */
function LineReader(options) {
  Transform.call(this);
  this._writableState.objectMode = false;
  this._readableState.objectMode = true;
  options = options || {};
  this.encoding = options.encoding || 'utf8';
  this.eol = options.eol || /\r?\n/;
  function onEnd() {
    this.buffer = null;
  }
  this.on('end', onEnd.bind(this));
}

util.inherits(LineReader, Transform);

/**
 *  Transform function.
 */
function _transform(chunk, encoding, cb) {
  var str, lines, found, i = chunk.length - 1, b;

  if(this.buffer && this.buffer.length) {
    chunk = Buffer.concat(
      [this.buffer, chunk], this.buffer.length + chunk.length);
  }

  // end with line feed, safe to split the lot
  if(chunk[chunk.length - 1] === LF) {
    str = chunk.toString(this.encoding);
  }else{
    // reverse search for line feed
    while((b = chunk[i]) !== undefined) {
      if(b === LF) {
        str = chunk.toString(this.encoding, 0, i);
        this.buffer = chunk.slice(i);
        break;
      }
      i--;
    }
  }

  // no newline found, possibly very long line
  if(!str) {
    this.buffer = !this.buffer
      ? chunk
      : Buffer.concat([this.buffer, chunk], this.buffer.length + chunk.length);
    return cb();
  }

  lines = str.split(this.eol);
  this.push(lines);
  cb();
}

LineReader.prototype._transform = _transform;

module.exports = LineReader;