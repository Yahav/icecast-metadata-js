/* Copyright 2020 Ethan Halsall

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

const { Writable, PassThrough } = require("stream");
const IcecastMetadataReader = require("./IcecastMetadataReader");

/**
 * @description NodeJS streams wrapper for IcecastMetadataReader
 * @param {Object} IcecastMetadataStream constructor parameter
 * @param {number} IcecastMetadataStream.icyMetaInt Interval in bytes of metadata updates returned by the Icecast server
 * @param {number} IcecastMetadataStream.icyBr Bitrate of audio stream used to increase accuracy when to updating metadata
 */
class IcecastMetadataStream extends Writable {
  constructor({ icyMetaInt, icyBr }) {
    super();
    this._icyBr = icyBr;

    this._stream = new PassThrough();
    this._metadata = new PassThrough({ objectMode: true });

    this._generator = new IcecastMetadataReader({
      icyMetaInt,
      onStream: (value) => this._handleStream(value),
      onMetadata: (value) => this._handleMetadata(value),
    });
  }

  /**
   * @returns Readable stream for stream data
   */
  get stream() {
    return this._stream;
  }

  /**
   * @returns Readable stream for metadata
   */
  get metadata() {
    return this._metadata;
  }

  _handleStream({ stream }) {
    this._stream.push(stream);
  }

  _handleMetadata({ metadata, stats: { streamBytesRead } }) {
    this._metadata.push({
      metadata,
      time: streamBytesRead / (this._icyBr * 125),
    });
  }

  _write(chunk, enc, next) {
    for (let i of this._generator.iterator(chunk)) {
    }
    next();
  }

  end() {
    this._stream.push(null);
    this._metadata.push(null);
    super.end();
  }
}

module.exports = IcecastMetadataStream;
