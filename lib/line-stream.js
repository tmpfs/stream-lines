var through = require('through3')
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
 */
function Line(options) {
  options = options || {};
  this.encoding = options.encoding || 'utf8';
  this.eol = /\r?\n/;
  if(options.buffer) {
    this.body = [];
  }
}

/**
 *  Transform function.
 */
function transform(chunk, encoding, cb) {
  var str, lines, i = chunk.length - 1, b;

  if(Buffer.isBuffer(chunk)) {

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
          // get what we can split now
          str = chunk.toString(this.encoding, 0, i);
          // stash the remainder for the next transform or flush
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
  }else if(typeof chunk === 'string') {
    str = chunk;
  }else{
    // force objectMode false instead?
    return cb(new Error('line stream accepts buffers or strings'));
  }

  //console.dir(str);

  //if(typeof str === 'string') {
    lines = str.split(this.eol);
  //}
  if(this.body) {
    this.body = this.body.concat(lines);
  }else{
    this.push(lines);
  }
  this.emit('lines', lines);
  cb();
}

function flush(cb) {
  var lines;
  // unterminated last line, need to flush it
  if(this.buffer) {
    lines = [this.buffer.toString(this.encoding).replace(/^\r?\n/, '')];
    if(this.body) {
      this.body = this.body.concat(lines);
    }else{
      this.push(lines);
    }
    this.emit('lines', lines);
  }
  // buffered array of all lines
  if(this.body) {
    this.push(this.body);
    this.body = null;
  }
  this.buffer = null;
  cb();
}

module.exports = through.transform(transform, flush, {ctor: Line});
