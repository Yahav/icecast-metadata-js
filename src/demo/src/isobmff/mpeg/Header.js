/*
This class is heavily inspired by https://github.com/biril/mp3-parser.
*/

/*
Copyright (c) 2013-2016 Alex Lambiris

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

export default class Header {
  static v1l1Bitrates = {
    "0000": "free",
    "0001": 32,
    "0010": 64,
    "0011": 96,
    "0100": 128,
    "0101": 160,
    "0110": 192,
    "0111": 224,
    1000: 256,
    1001: 288,
    1010: 320,
    1011: 352,
    1100: 384,
    1101: 416,
    1110: 448,
    1111: "bad",
  };

  static v1l2Bitrates = {
    "0000": "free",
    "0001": 32,
    "0010": 48,
    "0011": 56,
    "0100": 64,
    "0101": 80,
    "0110": 96,
    "0111": 112,
    1000: 128,
    1001: 160,
    1010: 192,
    1011: 224,
    1100: 256,
    1101: 320,
    1110: 384,
    1111: "bad",
  };

  static v1l3Bitrates = {
    "0000": "free",
    "0001": 32,
    "0010": 40,
    "0011": 48,
    "0100": 56,
    "0101": 64,
    "0110": 80,
    "0111": 96,
    1000: 112,
    1001: 128,
    1010: 160,
    1011: 192,
    1100: 224,
    1101: 256,
    1110: 320,
    1111: "bad",
  };

  static v2l1Bitrates = {
    "0000": "free",
    "0001": 32,
    "0010": 48,
    "0011": 56,
    "0100": 64,
    "0101": 80,
    "0110": 96,
    "0111": 112,
    1000: 128,
    1001: 144,
    1010: 160,
    1011: 176,
    1100: 192,
    1101: 224,
    1110: 256,
    1111: "bad",
  };

  static v2l2Bitrates = {
    "0000": "free",
    "0001": 8,
    "0010": 16,
    "0011": 24,
    "0100": 32,
    "0101": 40,
    "0110": 48,
    "0111": 56,
    1000: 64,
    1001: 80,
    1010: 96,
    1011: 112,
    1100: 128,
    1101: 144,
    1110: 160,
    1111: "bad",
  };
  static v2l3Bitrates = Header.v2l2Bitrates;

  static v1SampleRates = {
    "00": 44100,
    "01": 48000,
    10: 32000,
    11: "reserved",
  };

  static v2SampleRates = {
    "00": 22050,
    "01": 24000,
    10: 16000,
    11: "reserved",
  };

  static v25SampleRates = {
    "00": 11025,
    "01": 12000,
    10: 8000,
    11: "reserved",
  };

  static channelModes = {
    "00": "Stereo",
    "01": "Joint stereo (Stereo)",
    10: "Dual channel (Stereo)",
    11: "Single channel (Mono)",
  };

  static layerMap = {
    "00": "reserved",
    "01": "Layer III",
    10: "Layer II",
    11: "Layer I",
  };

  static v1SampleLengths = {
    "01": 1152,
    10: 1152,
    11: 384,
  };

  static v2SampleLengths = {
    "01": 576,
    10: 1152,
    11: 384,
  };

  static mpegVersionMap = {
    0b00000000: {
      description: "MPEG Version 2.5 (unofficial)",
      bitRates: {
        "01": Header.v2l3Bitrates,
        10: Header.v2l2Bitrates,
        11: Header.v2l1Bitrates,
      },
      sampleRates: Header.v25SampleRates,
      sampleLengths: Header.v2SampleLengths,
    },
    0b00001000: { description: "reserved" },
    0b00010000: {
      description: "MPEG Version 2 (ISO/IEC 13818-3)",
      bitRates: {
        "01": Header.v2l3Bitrates,
        10: Header.v2l2Bitrates,
        11: Header.v2l1Bitrates,
      },
      sampleRates: Header.v2SampleRates,
      sampleLengths: Header.v2SampleLengths,
    },
    0b00011000: {
      description: "MPEG Version 1 (ISO/IEC 11172-3)",
      bitRates: {
        "01": Header.v1l3Bitrates,
        10: Header.v1l2Bitrates,
        11: Header.v1l1Bitrates,
      },
      sampleRates: Header.v1SampleRates,
      sampleLengths: Header.v1SampleLengths,
    },
  };

  // Produce octet's binary representation as a string
  static octetToBinRep(octet) {
    let b = [];
    b[0] = (octet & 128) === 128 ? "1" : "0";
    b[1] = (octet & 64) === 64 ? "1" : "0";
    b[2] = (octet & 32) === 32 ? "1" : "0";
    b[3] = (octet & 16) === 16 ? "1" : "0";
    b[4] = (octet & 8) === 8 ? "1" : "0";
    b[5] = (octet & 4) === 4 ? "1" : "0";
    b[6] = (octet & 2) === 2 ? "1" : "0";
    b[7] = (octet & 1) === 1 ? "1" : "0";
    return b.join("");
  }

  constructor(headerValues) {
    this._values = headerValues;
  }

  get values() {
    return this._values;
  }

  static _buildHeader(buffer) {
    // Header's first (out of four) octet: `11111111`: Frame sync (all bits must be set)
    if (buffer[0] ^ 0b11111111) {
      return null;
    }

    // Header's second (out of four) octet: `111xxxxx`
    //
    // * `111.....`: Rest of frame sync (all bits must be set)
    // * `...BB...`: MPEG Audio version ID (11 -> MPEG Version 1 (ISO/IEC 11172-3))
    // * `.....CC.`: Layer description (01 -> Layer III)
    // * `.......1`: Protection bit (1 = Not protected)

    // Require the three most significant bits to be `111` (>= 224)
    const remainingFrameSync = buffer[1] & 0b11100000;
    const b2 = buffer[1];

    if (remainingFrameSync !== 0b11100000) {
      return null;
    }

    const mpegVersionBits = buffer[1] & 0b00011000;
    const mpegVersion = Header.mpegVersionMap[mpegVersionBits];

    const layerDescriptionBits = buffer[1] & 0b00000110;
    const protectionBit = buffer[1] & 0b00000001;

    //const mpegVersion = Header.octetToBinRep(b2).substr(3, 2);
    const layerVersion = Header.octetToBinRep(b2).substr(5, 2);

    //
    const header = {
      mpegVersion: mpegVersion.description,
      layerDescription: Header.layerMap[layerVersion],
      isProtected: b2 & 1, // Just check if last bit is set
    };

    if (header.mpegVersion === "reserved") {
      return null;
    }
    if (header.layerDescription === "reserved") {
      return null;
    }

    // Header's third (out of four) octet: `EEEEFFGH`
    //
    // * `EEEE....`: Bitrate index. 1111 is invalid, everything else is accepted
    // * `....FF..`: Sample rate, 00=44100, 01=48000, 10=32000, 11=reserved
    // * `......G.`: Padding bit, 0=frame not padded, 1=frame padded
    // * `.......H`: Private bit. This is informative
    let b3 = buffer[2];
    b3 = Header.octetToBinRep(b3);
    header.bitrateBits = b3.substr(0, 4);
    header.bitrate = mpegVersion.bitRates[layerVersion][header.bitrateBits];
    if (header.bitrate === "bad") {
      return null;
    }

    header.sampleRateBits = b3.substr(4, 2);
    header.sampleRate = mpegVersion.sampleRates[header.sampleRateBits];
    if (header.sampleRate === "reserved") {
      return null;
    }
    header.sampleLength = mpegVersion.sampleLengths[layerVersion];

    header.frameIsPaddedBit = b3.substr(6, 1);
    header.frameIsPadded = header.frameIsPaddedBit === "1";
    header.framePadding = header.frameIsPadded ? 1 : 0;

    header.privateBit = b3.substr(7, 1);

    // Header's fourth (out of four) octet: `IIJJKLMM`
    //
    // * `II......`: Channel mode
    // * `..JJ....`: Mode extension (only if joint stereo)
    // * `....K...`: Copyright
    // * `.....L..`: Original
    // * `......MM`: Emphasis
    const b4 = buffer[3];
    header.channelModeBits = Header.octetToBinRep(b4).substr(0, 2);
    header.channelMode = Header.channelModes[header.channelModeBits];

    return header;
  }

  // Get the number of bytes in a frame given its `bitrate`, `sampleRate` and `padding`.
  //  Based on [magic formula](http://mpgedit.org/mpgedit/mpeg_format/mpeghdr.htm)
  get frameByteLength() {
    const sampleLength = this._values.sampleLength;
    const paddingSize = this._values.framePadding
      ? this._values.layerVersion === "11"
        ? 4
        : 1
      : 0;
    const byteRate = (this._values.bitrate * 1000) / 8;
    return Math.floor(
      (sampleLength * byteRate) / this._values.sampleRate + paddingSize
    );
  }
}
