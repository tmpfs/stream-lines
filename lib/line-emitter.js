var util = require('util')
  , Transform = require('stream').Transform;

/**
 *  Emits a lines event and writes the lines array.
 */
function LineEmitter(conf, options, file) {
  Transform.call(this);
  this._writableState.objectMode = true;
  this._readableState.objectMode = true;
}

util.inherits(LineEmitter, Transform);

/**
 *  Transform function.
 */
function _transform(chunk, encoding, cb) {
  this.emit('lines', chunk);
  this.push(chunk);
  cb();
}

LineEmitter.prototype._transform = _transform;

module.exports = LineEmitter;
