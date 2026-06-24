var brainCloud = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // (disabled):crypto
  var require_crypto = __commonJS({
    "(disabled):crypto"() {
    }
  });

  // node_modules/crypto-js/core.js
  var require_core = __commonJS({
    "node_modules/crypto-js/core.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory();
        } else if (typeof define === "function" && define.amd) {
          define([], factory);
        } else {
          root.CryptoJS = factory();
        }
      })(exports, function() {
        var CryptoJS = CryptoJS || function(Math2, undefined2) {
          var crypto;
          if (typeof window !== "undefined" && window.crypto) {
            crypto = window.crypto;
          }
          if (typeof self !== "undefined" && self.crypto) {
            crypto = self.crypto;
          }
          if (typeof globalThis !== "undefined" && globalThis.crypto) {
            crypto = globalThis.crypto;
          }
          if (!crypto && typeof window !== "undefined" && window.msCrypto) {
            crypto = window.msCrypto;
          }
          if (!crypto && typeof global !== "undefined" && global.crypto) {
            crypto = global.crypto;
          }
          if (!crypto && typeof __require === "function") {
            try {
              crypto = require_crypto();
            } catch (err) {
            }
          }
          var cryptoSecureRandomInt = function() {
            if (crypto) {
              if (typeof crypto.getRandomValues === "function") {
                try {
                  return crypto.getRandomValues(new Uint32Array(1))[0];
                } catch (err) {
                }
              }
              if (typeof crypto.randomBytes === "function") {
                try {
                  return crypto.randomBytes(4).readInt32LE();
                } catch (err) {
                }
              }
            }
            throw new Error("Native crypto module could not be used to get secure random number.");
          };
          var create = Object.create || /* @__PURE__ */ function() {
            function F() {
            }
            return function(obj) {
              var subtype;
              F.prototype = obj;
              subtype = new F();
              F.prototype = null;
              return subtype;
            };
          }();
          var C = {};
          var C_lib = C.lib = {};
          var Base = C_lib.Base = /* @__PURE__ */ function() {
            return {
              /**
               * Creates a new object that inherits from this object.
               *
               * @param {Object} overrides Properties to copy into the new object.
               *
               * @return {Object} The new object.
               *
               * @static
               *
               * @example
               *
               *     var MyType = CryptoJS.lib.Base.extend({
               *         field: 'value',
               *
               *         method: function () {
               *         }
               *     });
               */
              extend: function(overrides) {
                var subtype = create(this);
                if (overrides) {
                  subtype.mixIn(overrides);
                }
                if (!subtype.hasOwnProperty("init") || this.init === subtype.init) {
                  subtype.init = function() {
                    subtype.$super.init.apply(this, arguments);
                  };
                }
                subtype.init.prototype = subtype;
                subtype.$super = this;
                return subtype;
              },
              /**
               * Extends this object and runs the init method.
               * Arguments to create() will be passed to init().
               *
               * @return {Object} The new object.
               *
               * @static
               *
               * @example
               *
               *     var instance = MyType.create();
               */
              create: function() {
                var instance = this.extend();
                instance.init.apply(instance, arguments);
                return instance;
              },
              /**
               * Initializes a newly created object.
               * Override this method to add some logic when your objects are created.
               *
               * @example
               *
               *     var MyType = CryptoJS.lib.Base.extend({
               *         init: function () {
               *             // ...
               *         }
               *     });
               */
              init: function() {
              },
              /**
               * Copies properties into this object.
               *
               * @param {Object} properties The properties to mix in.
               *
               * @example
               *
               *     MyType.mixIn({
               *         field: 'value'
               *     });
               */
              mixIn: function(properties) {
                for (var propertyName in properties) {
                  if (properties.hasOwnProperty(propertyName)) {
                    this[propertyName] = properties[propertyName];
                  }
                }
                if (properties.hasOwnProperty("toString")) {
                  this.toString = properties.toString;
                }
              },
              /**
               * Creates a copy of this object.
               *
               * @return {Object} The clone.
               *
               * @example
               *
               *     var clone = instance.clone();
               */
              clone: function() {
                return this.init.prototype.extend(this);
              }
            };
          }();
          var WordArray = C_lib.WordArray = Base.extend({
            /**
             * Initializes a newly created word array.
             *
             * @param {Array} words (Optional) An array of 32-bit words.
             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.create();
             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
             */
            init: function(words, sigBytes) {
              words = this.words = words || [];
              if (sigBytes != undefined2) {
                this.sigBytes = sigBytes;
              } else {
                this.sigBytes = words.length * 4;
              }
            },
            /**
             * Converts this word array to a string.
             *
             * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
             *
             * @return {string} The stringified word array.
             *
             * @example
             *
             *     var string = wordArray + '';
             *     var string = wordArray.toString();
             *     var string = wordArray.toString(CryptoJS.enc.Utf8);
             */
            toString: function(encoder) {
              return (encoder || Hex).stringify(this);
            },
            /**
             * Concatenates a word array to this word array.
             *
             * @param {WordArray} wordArray The word array to append.
             *
             * @return {WordArray} This word array.
             *
             * @example
             *
             *     wordArray1.concat(wordArray2);
             */
            concat: function(wordArray) {
              var thisWords = this.words;
              var thatWords = wordArray.words;
              var thisSigBytes = this.sigBytes;
              var thatSigBytes = wordArray.sigBytes;
              this.clamp();
              if (thisSigBytes % 4) {
                for (var i2 = 0; i2 < thatSigBytes; i2++) {
                  var thatByte = thatWords[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
                  thisWords[thisSigBytes + i2 >>> 2] |= thatByte << 24 - (thisSigBytes + i2) % 4 * 8;
                }
              } else {
                for (var j = 0; j < thatSigBytes; j += 4) {
                  thisWords[thisSigBytes + j >>> 2] = thatWords[j >>> 2];
                }
              }
              this.sigBytes += thatSigBytes;
              return this;
            },
            /**
             * Removes insignificant bits.
             *
             * @example
             *
             *     wordArray.clamp();
             */
            clamp: function() {
              var words = this.words;
              var sigBytes = this.sigBytes;
              words[sigBytes >>> 2] &= 4294967295 << 32 - sigBytes % 4 * 8;
              words.length = Math2.ceil(sigBytes / 4);
            },
            /**
             * Creates a copy of this word array.
             *
             * @return {WordArray} The clone.
             *
             * @example
             *
             *     var clone = wordArray.clone();
             */
            clone: function() {
              var clone = Base.clone.call(this);
              clone.words = this.words.slice(0);
              return clone;
            },
            /**
             * Creates a word array filled with random bytes.
             *
             * @param {number} nBytes The number of random bytes to generate.
             *
             * @return {WordArray} The random word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.random(16);
             */
            random: function(nBytes) {
              var words = [];
              for (var i2 = 0; i2 < nBytes; i2 += 4) {
                words.push(cryptoSecureRandomInt());
              }
              return new WordArray.init(words, nBytes);
            }
          });
          var C_enc = C.enc = {};
          var Hex = C_enc.Hex = {
            /**
             * Converts a word array to a hex string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The hex string.
             *
             * @static
             *
             * @example
             *
             *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var hexChars = [];
              for (var i2 = 0; i2 < sigBytes; i2++) {
                var bite = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 15).toString(16));
              }
              return hexChars.join("");
            },
            /**
             * Converts a hex string to a word array.
             *
             * @param {string} hexStr The hex string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
             */
            parse: function(hexStr) {
              var hexStrLength = hexStr.length;
              var words = [];
              for (var i2 = 0; i2 < hexStrLength; i2 += 2) {
                words[i2 >>> 3] |= parseInt(hexStr.substr(i2, 2), 16) << 24 - i2 % 8 * 4;
              }
              return new WordArray.init(words, hexStrLength / 2);
            }
          };
          var Latin1 = C_enc.Latin1 = {
            /**
             * Converts a word array to a Latin1 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The Latin1 string.
             *
             * @static
             *
             * @example
             *
             *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var latin1Chars = [];
              for (var i2 = 0; i2 < sigBytes; i2++) {
                var bite = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
                latin1Chars.push(String.fromCharCode(bite));
              }
              return latin1Chars.join("");
            },
            /**
             * Converts a Latin1 string to a word array.
             *
             * @param {string} latin1Str The Latin1 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
             */
            parse: function(latin1Str) {
              var latin1StrLength = latin1Str.length;
              var words = [];
              for (var i2 = 0; i2 < latin1StrLength; i2++) {
                words[i2 >>> 2] |= (latin1Str.charCodeAt(i2) & 255) << 24 - i2 % 4 * 8;
              }
              return new WordArray.init(words, latin1StrLength);
            }
          };
          var Utf8 = C_enc.Utf8 = {
            /**
             * Converts a word array to a UTF-8 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-8 string.
             *
             * @static
             *
             * @example
             *
             *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
             */
            stringify: function(wordArray) {
              try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
              } catch (e) {
                throw new Error("Malformed UTF-8 data");
              }
            },
            /**
             * Converts a UTF-8 string to a word array.
             *
             * @param {string} utf8Str The UTF-8 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
             */
            parse: function(utf8Str) {
              return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
            }
          };
          var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
            /**
             * Resets this block algorithm's data buffer to its initial state.
             *
             * @example
             *
             *     bufferedBlockAlgorithm.reset();
             */
            reset: function() {
              this._data = new WordArray.init();
              this._nDataBytes = 0;
            },
            /**
             * Adds new data to this block algorithm's buffer.
             *
             * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
             *
             * @example
             *
             *     bufferedBlockAlgorithm._append('data');
             *     bufferedBlockAlgorithm._append(wordArray);
             */
            _append: function(data) {
              if (typeof data == "string") {
                data = Utf8.parse(data);
              }
              this._data.concat(data);
              this._nDataBytes += data.sigBytes;
            },
            /**
             * Processes available data blocks.
             *
             * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
             *
             * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
             *
             * @return {WordArray} The processed data.
             *
             * @example
             *
             *     var processedData = bufferedBlockAlgorithm._process();
             *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
             */
            _process: function(doFlush) {
              var processedWords;
              var data = this._data;
              var dataWords = data.words;
              var dataSigBytes = data.sigBytes;
              var blockSize = this.blockSize;
              var blockSizeBytes = blockSize * 4;
              var nBlocksReady = dataSigBytes / blockSizeBytes;
              if (doFlush) {
                nBlocksReady = Math2.ceil(nBlocksReady);
              } else {
                nBlocksReady = Math2.max((nBlocksReady | 0) - this._minBufferSize, 0);
              }
              var nWordsReady = nBlocksReady * blockSize;
              var nBytesReady = Math2.min(nWordsReady * 4, dataSigBytes);
              if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                  this._doProcessBlock(dataWords, offset);
                }
                processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
              }
              return new WordArray.init(processedWords, nBytesReady);
            },
            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = bufferedBlockAlgorithm.clone();
             */
            clone: function() {
              var clone = Base.clone.call(this);
              clone._data = this._data.clone();
              return clone;
            },
            _minBufferSize: 0
          });
          var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
            /**
             * Configuration options.
             */
            cfg: Base.extend(),
            /**
             * Initializes a newly created hasher.
             *
             * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
             *
             * @example
             *
             *     var hasher = CryptoJS.algo.SHA256.create();
             */
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
              this.reset();
            },
            /**
             * Resets this hasher to its initial state.
             *
             * @example
             *
             *     hasher.reset();
             */
            reset: function() {
              BufferedBlockAlgorithm.reset.call(this);
              this._doReset();
            },
            /**
             * Updates this hasher with a message.
             *
             * @param {WordArray|string} messageUpdate The message to append.
             *
             * @return {Hasher} This hasher.
             *
             * @example
             *
             *     hasher.update('message');
             *     hasher.update(wordArray);
             */
            update: function(messageUpdate) {
              this._append(messageUpdate);
              this._process();
              return this;
            },
            /**
             * Finalizes the hash computation.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} messageUpdate (Optional) A final message update.
             *
             * @return {WordArray} The hash.
             *
             * @example
             *
             *     var hash = hasher.finalize();
             *     var hash = hasher.finalize('message');
             *     var hash = hasher.finalize(wordArray);
             */
            finalize: function(messageUpdate) {
              if (messageUpdate) {
                this._append(messageUpdate);
              }
              var hash = this._doFinalize();
              return hash;
            },
            blockSize: 512 / 32,
            /**
             * Creates a shortcut function to a hasher's object interface.
             *
             * @param {Hasher} hasher The hasher to create a helper for.
             *
             * @return {Function} The shortcut function.
             *
             * @static
             *
             * @example
             *
             *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
             */
            _createHelper: function(hasher) {
              return function(message, cfg) {
                return new hasher.init(cfg).finalize(message);
              };
            },
            /**
             * Creates a shortcut function to the HMAC's object interface.
             *
             * @param {Hasher} hasher The hasher to use in this HMAC helper.
             *
             * @return {Function} The shortcut function.
             *
             * @static
             *
             * @example
             *
             *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
             */
            _createHmacHelper: function(hasher) {
              return function(message, key) {
                return new C_algo.HMAC.init(hasher, key).finalize(message);
              };
            }
          });
          var C_algo = C.algo = {};
          return C;
        }(Math);
        return CryptoJS;
      });
    }
  });

  // node_modules/crypto-js/x64-core.js
  var require_x64_core = __commonJS({
    "node_modules/crypto-js/x64-core.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function(undefined2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var X32WordArray = C_lib.WordArray;
          var C_x64 = C.x64 = {};
          var X64Word = C_x64.Word = Base.extend({
            /**
             * Initializes a newly created 64-bit word.
             *
             * @param {number} high The high 32 bits.
             * @param {number} low The low 32 bits.
             *
             * @example
             *
             *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
             */
            init: function(high, low) {
              this.high = high;
              this.low = low;
            }
            /**
             * Bitwise NOTs this word.
             *
             * @return {X64Word} A new x64-Word object after negating.
             *
             * @example
             *
             *     var negated = x64Word.not();
             */
            // not: function () {
            // var high = ~this.high;
            // var low = ~this.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Bitwise ANDs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to AND with this word.
             *
             * @return {X64Word} A new x64-Word object after ANDing.
             *
             * @example
             *
             *     var anded = x64Word.and(anotherX64Word);
             */
            // and: function (word) {
            // var high = this.high & word.high;
            // var low = this.low & word.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Bitwise ORs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to OR with this word.
             *
             * @return {X64Word} A new x64-Word object after ORing.
             *
             * @example
             *
             *     var ored = x64Word.or(anotherX64Word);
             */
            // or: function (word) {
            // var high = this.high | word.high;
            // var low = this.low | word.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Bitwise XORs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to XOR with this word.
             *
             * @return {X64Word} A new x64-Word object after XORing.
             *
             * @example
             *
             *     var xored = x64Word.xor(anotherX64Word);
             */
            // xor: function (word) {
            // var high = this.high ^ word.high;
            // var low = this.low ^ word.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Shifts this word n bits to the left.
             *
             * @param {number} n The number of bits to shift.
             *
             * @return {X64Word} A new x64-Word object after shifting.
             *
             * @example
             *
             *     var shifted = x64Word.shiftL(25);
             */
            // shiftL: function (n) {
            // if (n < 32) {
            // var high = (this.high << n) | (this.low >>> (32 - n));
            // var low = this.low << n;
            // } else {
            // var high = this.low << (n - 32);
            // var low = 0;
            // }
            // return X64Word.create(high, low);
            // },
            /**
             * Shifts this word n bits to the right.
             *
             * @param {number} n The number of bits to shift.
             *
             * @return {X64Word} A new x64-Word object after shifting.
             *
             * @example
             *
             *     var shifted = x64Word.shiftR(7);
             */
            // shiftR: function (n) {
            // if (n < 32) {
            // var low = (this.low >>> n) | (this.high << (32 - n));
            // var high = this.high >>> n;
            // } else {
            // var low = this.high >>> (n - 32);
            // var high = 0;
            // }
            // return X64Word.create(high, low);
            // },
            /**
             * Rotates this word n bits to the left.
             *
             * @param {number} n The number of bits to rotate.
             *
             * @return {X64Word} A new x64-Word object after rotating.
             *
             * @example
             *
             *     var rotated = x64Word.rotL(25);
             */
            // rotL: function (n) {
            // return this.shiftL(n).or(this.shiftR(64 - n));
            // },
            /**
             * Rotates this word n bits to the right.
             *
             * @param {number} n The number of bits to rotate.
             *
             * @return {X64Word} A new x64-Word object after rotating.
             *
             * @example
             *
             *     var rotated = x64Word.rotR(7);
             */
            // rotR: function (n) {
            // return this.shiftR(n).or(this.shiftL(64 - n));
            // },
            /**
             * Adds this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to add with this word.
             *
             * @return {X64Word} A new x64-Word object after adding.
             *
             * @example
             *
             *     var added = x64Word.add(anotherX64Word);
             */
            // add: function (word) {
            // var low = (this.low + word.low) | 0;
            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
            // var high = (this.high + word.high + carry) | 0;
            // return X64Word.create(high, low);
            // }
          });
          var X64WordArray = C_x64.WordArray = Base.extend({
            /**
             * Initializes a newly created word array.
             *
             * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
             *
             * @example
             *
             *     var wordArray = CryptoJS.x64.WordArray.create();
             *
             *     var wordArray = CryptoJS.x64.WordArray.create([
             *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
             *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
             *     ]);
             *
             *     var wordArray = CryptoJS.x64.WordArray.create([
             *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
             *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
             *     ], 10);
             */
            init: function(words, sigBytes) {
              words = this.words = words || [];
              if (sigBytes != undefined2) {
                this.sigBytes = sigBytes;
              } else {
                this.sigBytes = words.length * 8;
              }
            },
            /**
             * Converts this 64-bit word array to a 32-bit word array.
             *
             * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
             *
             * @example
             *
             *     var x32WordArray = x64WordArray.toX32();
             */
            toX32: function() {
              var x64Words = this.words;
              var x64WordsLength = x64Words.length;
              var x32Words = [];
              for (var i2 = 0; i2 < x64WordsLength; i2++) {
                var x64Word = x64Words[i2];
                x32Words.push(x64Word.high);
                x32Words.push(x64Word.low);
              }
              return X32WordArray.create(x32Words, this.sigBytes);
            },
            /**
             * Creates a copy of this word array.
             *
             * @return {X64WordArray} The clone.
             *
             * @example
             *
             *     var clone = x64WordArray.clone();
             */
            clone: function() {
              var clone = Base.clone.call(this);
              var words = clone.words = this.words.slice(0);
              var wordsLength = words.length;
              for (var i2 = 0; i2 < wordsLength; i2++) {
                words[i2] = words[i2].clone();
              }
              return clone;
            }
          });
        })();
        return CryptoJS;
      });
    }
  });

  // node_modules/crypto-js/lib-typedarrays.js
  var require_lib_typedarrays = __commonJS({
    "node_modules/crypto-js/lib-typedarrays.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          if (typeof ArrayBuffer != "function") {
            return;
          }
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var superInit = WordArray.init;
          var subInit = WordArray.init = function(typedArray) {
            if (typedArray instanceof ArrayBuffer) {
              typedArray = new Uint8Array(typedArray);
            }
            if (typedArray instanceof Int8Array || typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray || typedArray instanceof Int16Array || typedArray instanceof Uint16Array || typedArray instanceof Int32Array || typedArray instanceof Uint32Array || typedArray instanceof Float32Array || typedArray instanceof Float64Array) {
              typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
            }
            if (typedArray instanceof Uint8Array) {
              var typedArrayByteLength = typedArray.byteLength;
              var words = [];
              for (var i2 = 0; i2 < typedArrayByteLength; i2++) {
                words[i2 >>> 2] |= typedArray[i2] << 24 - i2 % 4 * 8;
              }
              superInit.call(this, words, typedArrayByteLength);
            } else {
              superInit.apply(this, arguments);
            }
          };
          subInit.prototype = WordArray;
        })();
        return CryptoJS.lib.WordArray;
      });
    }
  });

  // node_modules/crypto-js/enc-utf16.js
  var require_enc_utf16 = __commonJS({
    "node_modules/crypto-js/enc-utf16.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          var Utf16BE = C_enc.Utf16 = C_enc.Utf16BE = {
            /**
             * Converts a word array to a UTF-16 BE string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-16 BE string.
             *
             * @static
             *
             * @example
             *
             *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var utf16Chars = [];
              for (var i2 = 0; i2 < sigBytes; i2 += 2) {
                var codePoint = words[i2 >>> 2] >>> 16 - i2 % 4 * 8 & 65535;
                utf16Chars.push(String.fromCharCode(codePoint));
              }
              return utf16Chars.join("");
            },
            /**
             * Converts a UTF-16 BE string to a word array.
             *
             * @param {string} utf16Str The UTF-16 BE string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
             */
            parse: function(utf16Str) {
              var utf16StrLength = utf16Str.length;
              var words = [];
              for (var i2 = 0; i2 < utf16StrLength; i2++) {
                words[i2 >>> 1] |= utf16Str.charCodeAt(i2) << 16 - i2 % 2 * 16;
              }
              return WordArray.create(words, utf16StrLength * 2);
            }
          };
          C_enc.Utf16LE = {
            /**
             * Converts a word array to a UTF-16 LE string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-16 LE string.
             *
             * @static
             *
             * @example
             *
             *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var utf16Chars = [];
              for (var i2 = 0; i2 < sigBytes; i2 += 2) {
                var codePoint = swapEndian(words[i2 >>> 2] >>> 16 - i2 % 4 * 8 & 65535);
                utf16Chars.push(String.fromCharCode(codePoint));
              }
              return utf16Chars.join("");
            },
            /**
             * Converts a UTF-16 LE string to a word array.
             *
             * @param {string} utf16Str The UTF-16 LE string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
             */
            parse: function(utf16Str) {
              var utf16StrLength = utf16Str.length;
              var words = [];
              for (var i2 = 0; i2 < utf16StrLength; i2++) {
                words[i2 >>> 1] |= swapEndian(utf16Str.charCodeAt(i2) << 16 - i2 % 2 * 16);
              }
              return WordArray.create(words, utf16StrLength * 2);
            }
          };
          function swapEndian(word) {
            return word << 8 & 4278255360 | word >>> 8 & 16711935;
          }
        })();
        return CryptoJS.enc.Utf16;
      });
    }
  });

  // node_modules/crypto-js/enc-base64.js
  var require_enc_base64 = __commonJS({
    "node_modules/crypto-js/enc-base64.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          var Base64 = C_enc.Base64 = {
            /**
             * Converts a word array to a Base64 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The Base64 string.
             *
             * @static
             *
             * @example
             *
             *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var map = this._map;
              wordArray.clamp();
              var base64Chars = [];
              for (var i2 = 0; i2 < sigBytes; i2 += 3) {
                var byte1 = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
                var byte2 = words[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255;
                var byte3 = words[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255;
                var triplet = byte1 << 16 | byte2 << 8 | byte3;
                for (var j = 0; j < 4 && i2 + j * 0.75 < sigBytes; j++) {
                  base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                while (base64Chars.length % 4) {
                  base64Chars.push(paddingChar);
                }
              }
              return base64Chars.join("");
            },
            /**
             * Converts a Base64 string to a word array.
             *
             * @param {string} base64Str The Base64 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
             */
            parse: function(base64Str) {
              var base64StrLength = base64Str.length;
              var map = this._map;
              var reverseMap = this._reverseMap;
              if (!reverseMap) {
                reverseMap = this._reverseMap = [];
                for (var j = 0; j < map.length; j++) {
                  reverseMap[map.charCodeAt(j)] = j;
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex !== -1) {
                  base64StrLength = paddingIndex;
                }
              }
              return parseLoop(base64Str, base64StrLength, reverseMap);
            },
            _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
          };
          function parseLoop(base64Str, base64StrLength, reverseMap) {
            var words = [];
            var nBytes = 0;
            for (var i2 = 0; i2 < base64StrLength; i2++) {
              if (i2 % 4) {
                var bits1 = reverseMap[base64Str.charCodeAt(i2 - 1)] << i2 % 4 * 2;
                var bits2 = reverseMap[base64Str.charCodeAt(i2)] >>> 6 - i2 % 4 * 2;
                var bitsCombined = bits1 | bits2;
                words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
                nBytes++;
              }
            }
            return WordArray.create(words, nBytes);
          }
        })();
        return CryptoJS.enc.Base64;
      });
    }
  });

  // node_modules/crypto-js/enc-base64url.js
  var require_enc_base64url = __commonJS({
    "node_modules/crypto-js/enc-base64url.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C.enc;
          var Base64url = C_enc.Base64url = {
            /**
             * Converts a word array to a Base64url string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @param {boolean} urlSafe Whether to use url safe
             *
             * @return {string} The Base64url string.
             *
             * @static
             *
             * @example
             *
             *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
             */
            stringify: function(wordArray, urlSafe) {
              if (urlSafe === void 0) {
                urlSafe = true;
              }
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var map = urlSafe ? this._safe_map : this._map;
              wordArray.clamp();
              var base64Chars = [];
              for (var i2 = 0; i2 < sigBytes; i2 += 3) {
                var byte1 = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
                var byte2 = words[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255;
                var byte3 = words[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255;
                var triplet = byte1 << 16 | byte2 << 8 | byte3;
                for (var j = 0; j < 4 && i2 + j * 0.75 < sigBytes; j++) {
                  base64Chars.push(map.charAt(triplet >>> 6 * (3 - j) & 63));
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                while (base64Chars.length % 4) {
                  base64Chars.push(paddingChar);
                }
              }
              return base64Chars.join("");
            },
            /**
             * Converts a Base64url string to a word array.
             *
             * @param {string} base64Str The Base64url string.
             *
             * @param {boolean} urlSafe Whether to use url safe
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
             */
            parse: function(base64Str, urlSafe) {
              if (urlSafe === void 0) {
                urlSafe = true;
              }
              var base64StrLength = base64Str.length;
              var map = urlSafe ? this._safe_map : this._map;
              var reverseMap = this._reverseMap;
              if (!reverseMap) {
                reverseMap = this._reverseMap = [];
                for (var j = 0; j < map.length; j++) {
                  reverseMap[map.charCodeAt(j)] = j;
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex !== -1) {
                  base64StrLength = paddingIndex;
                }
              }
              return parseLoop(base64Str, base64StrLength, reverseMap);
            },
            _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
          };
          function parseLoop(base64Str, base64StrLength, reverseMap) {
            var words = [];
            var nBytes = 0;
            for (var i2 = 0; i2 < base64StrLength; i2++) {
              if (i2 % 4) {
                var bits1 = reverseMap[base64Str.charCodeAt(i2 - 1)] << i2 % 4 * 2;
                var bits2 = reverseMap[base64Str.charCodeAt(i2)] >>> 6 - i2 % 4 * 2;
                var bitsCombined = bits1 | bits2;
                words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
                nBytes++;
              }
            }
            return WordArray.create(words, nBytes);
          }
        })();
        return CryptoJS.enc.Base64url;
      });
    }
  });

  // node_modules/crypto-js/md5.js
  var require_md5 = __commonJS({
    "node_modules/crypto-js/md5.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function(Math2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo;
          var T = [];
          (function() {
            for (var i2 = 0; i2 < 64; i2++) {
              T[i2] = Math2.abs(Math2.sin(i2 + 1)) * 4294967296 | 0;
            }
          })();
          var MD5 = C_algo.MD5 = Hasher.extend({
            _doReset: function() {
              this._hash = new WordArray.init([
                1732584193,
                4023233417,
                2562383102,
                271733878
              ]);
            },
            _doProcessBlock: function(M, offset) {
              for (var i2 = 0; i2 < 16; i2++) {
                var offset_i = offset + i2;
                var M_offset_i = M[offset_i];
                M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
              }
              var H = this._hash.words;
              var M_offset_0 = M[offset + 0];
              var M_offset_1 = M[offset + 1];
              var M_offset_2 = M[offset + 2];
              var M_offset_3 = M[offset + 3];
              var M_offset_4 = M[offset + 4];
              var M_offset_5 = M[offset + 5];
              var M_offset_6 = M[offset + 6];
              var M_offset_7 = M[offset + 7];
              var M_offset_8 = M[offset + 8];
              var M_offset_9 = M[offset + 9];
              var M_offset_10 = M[offset + 10];
              var M_offset_11 = M[offset + 11];
              var M_offset_12 = M[offset + 12];
              var M_offset_13 = M[offset + 13];
              var M_offset_14 = M[offset + 14];
              var M_offset_15 = M[offset + 15];
              var a = H[0];
              var b = H[1];
              var c = H[2];
              var d = H[3];
              a = FF(a, b, c, d, M_offset_0, 7, T[0]);
              d = FF(d, a, b, c, M_offset_1, 12, T[1]);
              c = FF(c, d, a, b, M_offset_2, 17, T[2]);
              b = FF(b, c, d, a, M_offset_3, 22, T[3]);
              a = FF(a, b, c, d, M_offset_4, 7, T[4]);
              d = FF(d, a, b, c, M_offset_5, 12, T[5]);
              c = FF(c, d, a, b, M_offset_6, 17, T[6]);
              b = FF(b, c, d, a, M_offset_7, 22, T[7]);
              a = FF(a, b, c, d, M_offset_8, 7, T[8]);
              d = FF(d, a, b, c, M_offset_9, 12, T[9]);
              c = FF(c, d, a, b, M_offset_10, 17, T[10]);
              b = FF(b, c, d, a, M_offset_11, 22, T[11]);
              a = FF(a, b, c, d, M_offset_12, 7, T[12]);
              d = FF(d, a, b, c, M_offset_13, 12, T[13]);
              c = FF(c, d, a, b, M_offset_14, 17, T[14]);
              b = FF(b, c, d, a, M_offset_15, 22, T[15]);
              a = GG(a, b, c, d, M_offset_1, 5, T[16]);
              d = GG(d, a, b, c, M_offset_6, 9, T[17]);
              c = GG(c, d, a, b, M_offset_11, 14, T[18]);
              b = GG(b, c, d, a, M_offset_0, 20, T[19]);
              a = GG(a, b, c, d, M_offset_5, 5, T[20]);
              d = GG(d, a, b, c, M_offset_10, 9, T[21]);
              c = GG(c, d, a, b, M_offset_15, 14, T[22]);
              b = GG(b, c, d, a, M_offset_4, 20, T[23]);
              a = GG(a, b, c, d, M_offset_9, 5, T[24]);
              d = GG(d, a, b, c, M_offset_14, 9, T[25]);
              c = GG(c, d, a, b, M_offset_3, 14, T[26]);
              b = GG(b, c, d, a, M_offset_8, 20, T[27]);
              a = GG(a, b, c, d, M_offset_13, 5, T[28]);
              d = GG(d, a, b, c, M_offset_2, 9, T[29]);
              c = GG(c, d, a, b, M_offset_7, 14, T[30]);
              b = GG(b, c, d, a, M_offset_12, 20, T[31]);
              a = HH(a, b, c, d, M_offset_5, 4, T[32]);
              d = HH(d, a, b, c, M_offset_8, 11, T[33]);
              c = HH(c, d, a, b, M_offset_11, 16, T[34]);
              b = HH(b, c, d, a, M_offset_14, 23, T[35]);
              a = HH(a, b, c, d, M_offset_1, 4, T[36]);
              d = HH(d, a, b, c, M_offset_4, 11, T[37]);
              c = HH(c, d, a, b, M_offset_7, 16, T[38]);
              b = HH(b, c, d, a, M_offset_10, 23, T[39]);
              a = HH(a, b, c, d, M_offset_13, 4, T[40]);
              d = HH(d, a, b, c, M_offset_0, 11, T[41]);
              c = HH(c, d, a, b, M_offset_3, 16, T[42]);
              b = HH(b, c, d, a, M_offset_6, 23, T[43]);
              a = HH(a, b, c, d, M_offset_9, 4, T[44]);
              d = HH(d, a, b, c, M_offset_12, 11, T[45]);
              c = HH(c, d, a, b, M_offset_15, 16, T[46]);
              b = HH(b, c, d, a, M_offset_2, 23, T[47]);
              a = II(a, b, c, d, M_offset_0, 6, T[48]);
              d = II(d, a, b, c, M_offset_7, 10, T[49]);
              c = II(c, d, a, b, M_offset_14, 15, T[50]);
              b = II(b, c, d, a, M_offset_5, 21, T[51]);
              a = II(a, b, c, d, M_offset_12, 6, T[52]);
              d = II(d, a, b, c, M_offset_3, 10, T[53]);
              c = II(c, d, a, b, M_offset_10, 15, T[54]);
              b = II(b, c, d, a, M_offset_1, 21, T[55]);
              a = II(a, b, c, d, M_offset_8, 6, T[56]);
              d = II(d, a, b, c, M_offset_15, 10, T[57]);
              c = II(c, d, a, b, M_offset_6, 15, T[58]);
              b = II(b, c, d, a, M_offset_13, 21, T[59]);
              a = II(a, b, c, d, M_offset_4, 6, T[60]);
              d = II(d, a, b, c, M_offset_11, 10, T[61]);
              c = II(c, d, a, b, M_offset_2, 15, T[62]);
              b = II(b, c, d, a, M_offset_9, 21, T[63]);
              H[0] = H[0] + a | 0;
              H[1] = H[1] + b | 0;
              H[2] = H[2] + c | 0;
              H[3] = H[3] + d | 0;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              var nBitsTotalH = Math2.floor(nBitsTotal / 4294967296);
              var nBitsTotalL = nBitsTotal;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 16711935 | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 4278255360;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 16711935 | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 4278255360;
              data.sigBytes = (dataWords.length + 1) * 4;
              this._process();
              var hash = this._hash;
              var H = hash.words;
              for (var i2 = 0; i2 < 4; i2++) {
                var H_i = H[i2];
                H[i2] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
              }
              return hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          function FF(a, b, c, d, x, s, t) {
            var n = a + (b & c | ~b & d) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }
          function GG(a, b, c, d, x, s, t) {
            var n = a + (b & d | c & ~d) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }
          function HH(a, b, c, d, x, s, t) {
            var n = a + (b ^ c ^ d) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }
          function II(a, b, c, d, x, s, t) {
            var n = a + (c ^ (b | ~d)) + x + t;
            return (n << s | n >>> 32 - s) + b;
          }
          C.MD5 = Hasher._createHelper(MD5);
          C.HmacMD5 = Hasher._createHmacHelper(MD5);
        })(Math);
        return CryptoJS.MD5;
      });
    }
  });

  // node_modules/crypto-js/sha1.js
  var require_sha1 = __commonJS({
    "node_modules/crypto-js/sha1.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo;
          var W = [];
          var SHA1 = C_algo.SHA1 = Hasher.extend({
            _doReset: function() {
              this._hash = new WordArray.init([
                1732584193,
                4023233417,
                2562383102,
                271733878,
                3285377520
              ]);
            },
            _doProcessBlock: function(M, offset) {
              var H = this._hash.words;
              var a = H[0];
              var b = H[1];
              var c = H[2];
              var d = H[3];
              var e = H[4];
              for (var i2 = 0; i2 < 80; i2++) {
                if (i2 < 16) {
                  W[i2] = M[offset + i2] | 0;
                } else {
                  var n = W[i2 - 3] ^ W[i2 - 8] ^ W[i2 - 14] ^ W[i2 - 16];
                  W[i2] = n << 1 | n >>> 31;
                }
                var t = (a << 5 | a >>> 27) + e + W[i2];
                if (i2 < 20) {
                  t += (b & c | ~b & d) + 1518500249;
                } else if (i2 < 40) {
                  t += (b ^ c ^ d) + 1859775393;
                } else if (i2 < 60) {
                  t += (b & c | b & d | c & d) - 1894007588;
                } else {
                  t += (b ^ c ^ d) - 899497514;
                }
                e = d;
                d = c;
                c = b << 30 | b >>> 2;
                b = a;
                a = t;
              }
              H[0] = H[0] + a | 0;
              H[1] = H[1] + b | 0;
              H[2] = H[2] + c | 0;
              H[3] = H[3] + d | 0;
              H[4] = H[4] + e | 0;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 4294967296);
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
              data.sigBytes = dataWords.length * 4;
              this._process();
              return this._hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          C.SHA1 = Hasher._createHelper(SHA1);
          C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
        })();
        return CryptoJS.SHA1;
      });
    }
  });

  // node_modules/crypto-js/sha256.js
  var require_sha256 = __commonJS({
    "node_modules/crypto-js/sha256.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function(Math2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo;
          var H = [];
          var K = [];
          (function() {
            function isPrime(n2) {
              var sqrtN = Math2.sqrt(n2);
              for (var factor = 2; factor <= sqrtN; factor++) {
                if (!(n2 % factor)) {
                  return false;
                }
              }
              return true;
            }
            function getFractionalBits(n2) {
              return (n2 - (n2 | 0)) * 4294967296 | 0;
            }
            var n = 2;
            var nPrime = 0;
            while (nPrime < 64) {
              if (isPrime(n)) {
                if (nPrime < 8) {
                  H[nPrime] = getFractionalBits(Math2.pow(n, 1 / 2));
                }
                K[nPrime] = getFractionalBits(Math2.pow(n, 1 / 3));
                nPrime++;
              }
              n++;
            }
          })();
          var W = [];
          var SHA256 = C_algo.SHA256 = Hasher.extend({
            _doReset: function() {
              this._hash = new WordArray.init(H.slice(0));
            },
            _doProcessBlock: function(M, offset) {
              var H2 = this._hash.words;
              var a = H2[0];
              var b = H2[1];
              var c = H2[2];
              var d = H2[3];
              var e = H2[4];
              var f = H2[5];
              var g = H2[6];
              var h = H2[7];
              for (var i2 = 0; i2 < 64; i2++) {
                if (i2 < 16) {
                  W[i2] = M[offset + i2] | 0;
                } else {
                  var gamma0x = W[i2 - 15];
                  var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
                  var gamma1x = W[i2 - 2];
                  var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
                  W[i2] = gamma0 + W[i2 - 7] + gamma1 + W[i2 - 16];
                }
                var ch = e & f ^ ~e & g;
                var maj = a & b ^ a & c ^ b & c;
                var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
                var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);
                var t1 = h + sigma1 + ch + K[i2] + W[i2];
                var t2 = sigma0 + maj;
                h = g;
                g = f;
                f = e;
                e = d + t1 | 0;
                d = c;
                c = b;
                b = a;
                a = t1 + t2 | 0;
              }
              H2[0] = H2[0] + a | 0;
              H2[1] = H2[1] + b | 0;
              H2[2] = H2[2] + c | 0;
              H2[3] = H2[3] + d | 0;
              H2[4] = H2[4] + e | 0;
              H2[5] = H2[5] + f | 0;
              H2[6] = H2[6] + g | 0;
              H2[7] = H2[7] + h | 0;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math2.floor(nBitsTotal / 4294967296);
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
              data.sigBytes = dataWords.length * 4;
              this._process();
              return this._hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          C.SHA256 = Hasher._createHelper(SHA256);
          C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
        })(Math);
        return CryptoJS.SHA256;
      });
    }
  });

  // node_modules/crypto-js/sha224.js
  var require_sha224 = __commonJS({
    "node_modules/crypto-js/sha224.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_sha256());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./sha256"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var C_algo = C.algo;
          var SHA256 = C_algo.SHA256;
          var SHA224 = C_algo.SHA224 = SHA256.extend({
            _doReset: function() {
              this._hash = new WordArray.init([
                3238371032,
                914150663,
                812702999,
                4144912697,
                4290775857,
                1750603025,
                1694076839,
                3204075428
              ]);
            },
            _doFinalize: function() {
              var hash = SHA256._doFinalize.call(this);
              hash.sigBytes -= 4;
              return hash;
            }
          });
          C.SHA224 = SHA256._createHelper(SHA224);
          C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
        })();
        return CryptoJS.SHA224;
      });
    }
  });

  // node_modules/crypto-js/sha512.js
  var require_sha512 = __commonJS({
    "node_modules/crypto-js/sha512.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_x64_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./x64-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Hasher = C_lib.Hasher;
          var C_x64 = C.x64;
          var X64Word = C_x64.Word;
          var X64WordArray = C_x64.WordArray;
          var C_algo = C.algo;
          function X64Word_create() {
            return X64Word.create.apply(X64Word, arguments);
          }
          var K = [
            X64Word_create(1116352408, 3609767458),
            X64Word_create(1899447441, 602891725),
            X64Word_create(3049323471, 3964484399),
            X64Word_create(3921009573, 2173295548),
            X64Word_create(961987163, 4081628472),
            X64Word_create(1508970993, 3053834265),
            X64Word_create(2453635748, 2937671579),
            X64Word_create(2870763221, 3664609560),
            X64Word_create(3624381080, 2734883394),
            X64Word_create(310598401, 1164996542),
            X64Word_create(607225278, 1323610764),
            X64Word_create(1426881987, 3590304994),
            X64Word_create(1925078388, 4068182383),
            X64Word_create(2162078206, 991336113),
            X64Word_create(2614888103, 633803317),
            X64Word_create(3248222580, 3479774868),
            X64Word_create(3835390401, 2666613458),
            X64Word_create(4022224774, 944711139),
            X64Word_create(264347078, 2341262773),
            X64Word_create(604807628, 2007800933),
            X64Word_create(770255983, 1495990901),
            X64Word_create(1249150122, 1856431235),
            X64Word_create(1555081692, 3175218132),
            X64Word_create(1996064986, 2198950837),
            X64Word_create(2554220882, 3999719339),
            X64Word_create(2821834349, 766784016),
            X64Word_create(2952996808, 2566594879),
            X64Word_create(3210313671, 3203337956),
            X64Word_create(3336571891, 1034457026),
            X64Word_create(3584528711, 2466948901),
            X64Word_create(113926993, 3758326383),
            X64Word_create(338241895, 168717936),
            X64Word_create(666307205, 1188179964),
            X64Word_create(773529912, 1546045734),
            X64Word_create(1294757372, 1522805485),
            X64Word_create(1396182291, 2643833823),
            X64Word_create(1695183700, 2343527390),
            X64Word_create(1986661051, 1014477480),
            X64Word_create(2177026350, 1206759142),
            X64Word_create(2456956037, 344077627),
            X64Word_create(2730485921, 1290863460),
            X64Word_create(2820302411, 3158454273),
            X64Word_create(3259730800, 3505952657),
            X64Word_create(3345764771, 106217008),
            X64Word_create(3516065817, 3606008344),
            X64Word_create(3600352804, 1432725776),
            X64Word_create(4094571909, 1467031594),
            X64Word_create(275423344, 851169720),
            X64Word_create(430227734, 3100823752),
            X64Word_create(506948616, 1363258195),
            X64Word_create(659060556, 3750685593),
            X64Word_create(883997877, 3785050280),
            X64Word_create(958139571, 3318307427),
            X64Word_create(1322822218, 3812723403),
            X64Word_create(1537002063, 2003034995),
            X64Word_create(1747873779, 3602036899),
            X64Word_create(1955562222, 1575990012),
            X64Word_create(2024104815, 1125592928),
            X64Word_create(2227730452, 2716904306),
            X64Word_create(2361852424, 442776044),
            X64Word_create(2428436474, 593698344),
            X64Word_create(2756734187, 3733110249),
            X64Word_create(3204031479, 2999351573),
            X64Word_create(3329325298, 3815920427),
            X64Word_create(3391569614, 3928383900),
            X64Word_create(3515267271, 566280711),
            X64Word_create(3940187606, 3454069534),
            X64Word_create(4118630271, 4000239992),
            X64Word_create(116418474, 1914138554),
            X64Word_create(174292421, 2731055270),
            X64Word_create(289380356, 3203993006),
            X64Word_create(460393269, 320620315),
            X64Word_create(685471733, 587496836),
            X64Word_create(852142971, 1086792851),
            X64Word_create(1017036298, 365543100),
            X64Word_create(1126000580, 2618297676),
            X64Word_create(1288033470, 3409855158),
            X64Word_create(1501505948, 4234509866),
            X64Word_create(1607167915, 987167468),
            X64Word_create(1816402316, 1246189591)
          ];
          var W = [];
          (function() {
            for (var i2 = 0; i2 < 80; i2++) {
              W[i2] = X64Word_create();
            }
          })();
          var SHA512 = C_algo.SHA512 = Hasher.extend({
            _doReset: function() {
              this._hash = new X64WordArray.init([
                new X64Word.init(1779033703, 4089235720),
                new X64Word.init(3144134277, 2227873595),
                new X64Word.init(1013904242, 4271175723),
                new X64Word.init(2773480762, 1595750129),
                new X64Word.init(1359893119, 2917565137),
                new X64Word.init(2600822924, 725511199),
                new X64Word.init(528734635, 4215389547),
                new X64Word.init(1541459225, 327033209)
              ]);
            },
            _doProcessBlock: function(M, offset) {
              var H = this._hash.words;
              var H0 = H[0];
              var H1 = H[1];
              var H2 = H[2];
              var H3 = H[3];
              var H4 = H[4];
              var H5 = H[5];
              var H6 = H[6];
              var H7 = H[7];
              var H0h = H0.high;
              var H0l = H0.low;
              var H1h = H1.high;
              var H1l = H1.low;
              var H2h = H2.high;
              var H2l = H2.low;
              var H3h = H3.high;
              var H3l = H3.low;
              var H4h = H4.high;
              var H4l = H4.low;
              var H5h = H5.high;
              var H5l = H5.low;
              var H6h = H6.high;
              var H6l = H6.low;
              var H7h = H7.high;
              var H7l = H7.low;
              var ah = H0h;
              var al = H0l;
              var bh = H1h;
              var bl = H1l;
              var ch = H2h;
              var cl = H2l;
              var dh = H3h;
              var dl = H3l;
              var eh = H4h;
              var el = H4l;
              var fh = H5h;
              var fl = H5l;
              var gh = H6h;
              var gl = H6l;
              var hh = H7h;
              var hl = H7l;
              for (var i2 = 0; i2 < 80; i2++) {
                var Wil;
                var Wih;
                var Wi = W[i2];
                if (i2 < 16) {
                  Wih = Wi.high = M[offset + i2 * 2] | 0;
                  Wil = Wi.low = M[offset + i2 * 2 + 1] | 0;
                } else {
                  var gamma0x = W[i2 - 15];
                  var gamma0xh = gamma0x.high;
                  var gamma0xl = gamma0x.low;
                  var gamma0h = (gamma0xh >>> 1 | gamma0xl << 31) ^ (gamma0xh >>> 8 | gamma0xl << 24) ^ gamma0xh >>> 7;
                  var gamma0l = (gamma0xl >>> 1 | gamma0xh << 31) ^ (gamma0xl >>> 8 | gamma0xh << 24) ^ (gamma0xl >>> 7 | gamma0xh << 25);
                  var gamma1x = W[i2 - 2];
                  var gamma1xh = gamma1x.high;
                  var gamma1xl = gamma1x.low;
                  var gamma1h = (gamma1xh >>> 19 | gamma1xl << 13) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
                  var gamma1l = (gamma1xl >>> 19 | gamma1xh << 13) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xl >>> 6 | gamma1xh << 26);
                  var Wi7 = W[i2 - 7];
                  var Wi7h = Wi7.high;
                  var Wi7l = Wi7.low;
                  var Wi16 = W[i2 - 16];
                  var Wi16h = Wi16.high;
                  var Wi16l = Wi16.low;
                  Wil = gamma0l + Wi7l;
                  Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
                  Wil = Wil + gamma1l;
                  Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
                  Wil = Wil + Wi16l;
                  Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);
                  Wi.high = Wih;
                  Wi.low = Wil;
                }
                var chh = eh & fh ^ ~eh & gh;
                var chl = el & fl ^ ~el & gl;
                var majh = ah & bh ^ ah & ch ^ bh & ch;
                var majl = al & bl ^ al & cl ^ bl & cl;
                var sigma0h = (ah >>> 28 | al << 4) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
                var sigma0l = (al >>> 28 | ah << 4) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
                var sigma1h = (eh >>> 14 | el << 18) ^ (eh >>> 18 | el << 14) ^ (eh << 23 | el >>> 9);
                var sigma1l = (el >>> 14 | eh << 18) ^ (el >>> 18 | eh << 14) ^ (el << 23 | eh >>> 9);
                var Ki = K[i2];
                var Kih = Ki.high;
                var Kil = Ki.low;
                var t1l = hl + sigma1l;
                var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
                var t1l = t1l + chl;
                var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
                var t1l = t1l + Kil;
                var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
                var t1l = t1l + Wil;
                var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);
                var t2l = sigma0l + majl;
                var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);
                hh = gh;
                hl = gl;
                gh = fh;
                gl = fl;
                fh = eh;
                fl = el;
                el = dl + t1l | 0;
                eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
                dh = ch;
                dl = cl;
                ch = bh;
                cl = bl;
                bh = ah;
                bl = al;
                al = t1l + t2l | 0;
                ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
              }
              H0l = H0.low = H0l + al;
              H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
              H1l = H1.low = H1l + bl;
              H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
              H2l = H2.low = H2l + cl;
              H2.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
              H3l = H3.low = H3l + dl;
              H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
              H4l = H4.low = H4l + el;
              H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
              H5l = H5.low = H5l + fl;
              H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
              H6l = H6.low = H6l + gl;
              H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
              H7l = H7.low = H7l + hl;
              H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 128 >>> 10 << 5) + 30] = Math.floor(nBitsTotal / 4294967296);
              dataWords[(nBitsLeft + 128 >>> 10 << 5) + 31] = nBitsTotal;
              data.sigBytes = dataWords.length * 4;
              this._process();
              var hash = this._hash.toX32();
              return hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            },
            blockSize: 1024 / 32
          });
          C.SHA512 = Hasher._createHelper(SHA512);
          C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
        })();
        return CryptoJS.SHA512;
      });
    }
  });

  // node_modules/crypto-js/sha384.js
  var require_sha384 = __commonJS({
    "node_modules/crypto-js/sha384.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_x64_core(), require_sha512());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./x64-core", "./sha512"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_x64 = C.x64;
          var X64Word = C_x64.Word;
          var X64WordArray = C_x64.WordArray;
          var C_algo = C.algo;
          var SHA512 = C_algo.SHA512;
          var SHA384 = C_algo.SHA384 = SHA512.extend({
            _doReset: function() {
              this._hash = new X64WordArray.init([
                new X64Word.init(3418070365, 3238371032),
                new X64Word.init(1654270250, 914150663),
                new X64Word.init(2438529370, 812702999),
                new X64Word.init(355462360, 4144912697),
                new X64Word.init(1731405415, 4290775857),
                new X64Word.init(2394180231, 1750603025),
                new X64Word.init(3675008525, 1694076839),
                new X64Word.init(1203062813, 3204075428)
              ]);
            },
            _doFinalize: function() {
              var hash = SHA512._doFinalize.call(this);
              hash.sigBytes -= 16;
              return hash;
            }
          });
          C.SHA384 = SHA512._createHelper(SHA384);
          C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
        })();
        return CryptoJS.SHA384;
      });
    }
  });

  // node_modules/crypto-js/sha3.js
  var require_sha3 = __commonJS({
    "node_modules/crypto-js/sha3.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_x64_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./x64-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function(Math2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_x64 = C.x64;
          var X64Word = C_x64.Word;
          var C_algo = C.algo;
          var RHO_OFFSETS = [];
          var PI_INDEXES = [];
          var ROUND_CONSTANTS = [];
          (function() {
            var x = 1, y = 0;
            for (var t = 0; t < 24; t++) {
              RHO_OFFSETS[x + 5 * y] = (t + 1) * (t + 2) / 2 % 64;
              var newX = y % 5;
              var newY = (2 * x + 3 * y) % 5;
              x = newX;
              y = newY;
            }
            for (var x = 0; x < 5; x++) {
              for (var y = 0; y < 5; y++) {
                PI_INDEXES[x + 5 * y] = y + (2 * x + 3 * y) % 5 * 5;
              }
            }
            var LFSR = 1;
            for (var i2 = 0; i2 < 24; i2++) {
              var roundConstantMsw = 0;
              var roundConstantLsw = 0;
              for (var j = 0; j < 7; j++) {
                if (LFSR & 1) {
                  var bitPosition = (1 << j) - 1;
                  if (bitPosition < 32) {
                    roundConstantLsw ^= 1 << bitPosition;
                  } else {
                    roundConstantMsw ^= 1 << bitPosition - 32;
                  }
                }
                if (LFSR & 128) {
                  LFSR = LFSR << 1 ^ 113;
                } else {
                  LFSR <<= 1;
                }
              }
              ROUND_CONSTANTS[i2] = X64Word.create(roundConstantMsw, roundConstantLsw);
            }
          })();
          var T = [];
          (function() {
            for (var i2 = 0; i2 < 25; i2++) {
              T[i2] = X64Word.create();
            }
          })();
          var SHA3 = C_algo.SHA3 = Hasher.extend({
            /**
             * Configuration options.
             *
             * @property {number} outputLength
             *   The desired number of bits in the output hash.
             *   Only values permitted are: 224, 256, 384, 512.
             *   Default: 512
             */
            cfg: Hasher.cfg.extend({
              outputLength: 512
            }),
            _doReset: function() {
              var state = this._state = [];
              for (var i2 = 0; i2 < 25; i2++) {
                state[i2] = new X64Word.init();
              }
              this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
            },
            _doProcessBlock: function(M, offset) {
              var state = this._state;
              var nBlockSizeLanes = this.blockSize / 2;
              for (var i2 = 0; i2 < nBlockSizeLanes; i2++) {
                var M2i = M[offset + 2 * i2];
                var M2i1 = M[offset + 2 * i2 + 1];
                M2i = (M2i << 8 | M2i >>> 24) & 16711935 | (M2i << 24 | M2i >>> 8) & 4278255360;
                M2i1 = (M2i1 << 8 | M2i1 >>> 24) & 16711935 | (M2i1 << 24 | M2i1 >>> 8) & 4278255360;
                var lane = state[i2];
                lane.high ^= M2i1;
                lane.low ^= M2i;
              }
              for (var round = 0; round < 24; round++) {
                for (var x = 0; x < 5; x++) {
                  var tMsw = 0, tLsw = 0;
                  for (var y = 0; y < 5; y++) {
                    var lane = state[x + 5 * y];
                    tMsw ^= lane.high;
                    tLsw ^= lane.low;
                  }
                  var Tx = T[x];
                  Tx.high = tMsw;
                  Tx.low = tLsw;
                }
                for (var x = 0; x < 5; x++) {
                  var Tx4 = T[(x + 4) % 5];
                  var Tx1 = T[(x + 1) % 5];
                  var Tx1Msw = Tx1.high;
                  var Tx1Lsw = Tx1.low;
                  var tMsw = Tx4.high ^ (Tx1Msw << 1 | Tx1Lsw >>> 31);
                  var tLsw = Tx4.low ^ (Tx1Lsw << 1 | Tx1Msw >>> 31);
                  for (var y = 0; y < 5; y++) {
                    var lane = state[x + 5 * y];
                    lane.high ^= tMsw;
                    lane.low ^= tLsw;
                  }
                }
                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
                  var tMsw;
                  var tLsw;
                  var lane = state[laneIndex];
                  var laneMsw = lane.high;
                  var laneLsw = lane.low;
                  var rhoOffset = RHO_OFFSETS[laneIndex];
                  if (rhoOffset < 32) {
                    tMsw = laneMsw << rhoOffset | laneLsw >>> 32 - rhoOffset;
                    tLsw = laneLsw << rhoOffset | laneMsw >>> 32 - rhoOffset;
                  } else {
                    tMsw = laneLsw << rhoOffset - 32 | laneMsw >>> 64 - rhoOffset;
                    tLsw = laneMsw << rhoOffset - 32 | laneLsw >>> 64 - rhoOffset;
                  }
                  var TPiLane = T[PI_INDEXES[laneIndex]];
                  TPiLane.high = tMsw;
                  TPiLane.low = tLsw;
                }
                var T0 = T[0];
                var state0 = state[0];
                T0.high = state0.high;
                T0.low = state0.low;
                for (var x = 0; x < 5; x++) {
                  for (var y = 0; y < 5; y++) {
                    var laneIndex = x + 5 * y;
                    var lane = state[laneIndex];
                    var TLane = T[laneIndex];
                    var Tx1Lane = T[(x + 1) % 5 + 5 * y];
                    var Tx2Lane = T[(x + 2) % 5 + 5 * y];
                    lane.high = TLane.high ^ ~Tx1Lane.high & Tx2Lane.high;
                    lane.low = TLane.low ^ ~Tx1Lane.low & Tx2Lane.low;
                  }
                }
                var lane = state[0];
                var roundConstant = ROUND_CONSTANTS[round];
                lane.high ^= roundConstant.high;
                lane.low ^= roundConstant.low;
              }
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              var blockSizeBits = this.blockSize * 32;
              dataWords[nBitsLeft >>> 5] |= 1 << 24 - nBitsLeft % 32;
              dataWords[(Math2.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits >>> 5) - 1] |= 128;
              data.sigBytes = dataWords.length * 4;
              this._process();
              var state = this._state;
              var outputLengthBytes = this.cfg.outputLength / 8;
              var outputLengthLanes = outputLengthBytes / 8;
              var hashWords = [];
              for (var i2 = 0; i2 < outputLengthLanes; i2++) {
                var lane = state[i2];
                var laneMsw = lane.high;
                var laneLsw = lane.low;
                laneMsw = (laneMsw << 8 | laneMsw >>> 24) & 16711935 | (laneMsw << 24 | laneMsw >>> 8) & 4278255360;
                laneLsw = (laneLsw << 8 | laneLsw >>> 24) & 16711935 | (laneLsw << 24 | laneLsw >>> 8) & 4278255360;
                hashWords.push(laneLsw);
                hashWords.push(laneMsw);
              }
              return new WordArray.init(hashWords, outputLengthBytes);
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              var state = clone._state = this._state.slice(0);
              for (var i2 = 0; i2 < 25; i2++) {
                state[i2] = state[i2].clone();
              }
              return clone;
            }
          });
          C.SHA3 = Hasher._createHelper(SHA3);
          C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
        })(Math);
        return CryptoJS.SHA3;
      });
    }
  });

  // node_modules/crypto-js/ripemd160.js
  var require_ripemd160 = __commonJS({
    "node_modules/crypto-js/ripemd160.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function(Math2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C.algo;
          var _zl = WordArray.create([
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            7,
            4,
            13,
            1,
            10,
            6,
            15,
            3,
            12,
            0,
            9,
            5,
            2,
            14,
            11,
            8,
            3,
            10,
            14,
            4,
            9,
            15,
            8,
            1,
            2,
            7,
            0,
            6,
            13,
            11,
            5,
            12,
            1,
            9,
            11,
            10,
            0,
            8,
            12,
            4,
            13,
            3,
            7,
            15,
            14,
            5,
            6,
            2,
            4,
            0,
            5,
            9,
            7,
            12,
            2,
            10,
            14,
            1,
            3,
            8,
            11,
            6,
            15,
            13
          ]);
          var _zr = WordArray.create([
            5,
            14,
            7,
            0,
            9,
            2,
            11,
            4,
            13,
            6,
            15,
            8,
            1,
            10,
            3,
            12,
            6,
            11,
            3,
            7,
            0,
            13,
            5,
            10,
            14,
            15,
            8,
            12,
            4,
            9,
            1,
            2,
            15,
            5,
            1,
            3,
            7,
            14,
            6,
            9,
            11,
            8,
            12,
            2,
            10,
            0,
            4,
            13,
            8,
            6,
            4,
            1,
            3,
            11,
            15,
            0,
            5,
            12,
            2,
            13,
            9,
            7,
            10,
            14,
            12,
            15,
            10,
            4,
            1,
            5,
            8,
            7,
            6,
            2,
            13,
            14,
            0,
            3,
            9,
            11
          ]);
          var _sl = WordArray.create([
            11,
            14,
            15,
            12,
            5,
            8,
            7,
            9,
            11,
            13,
            14,
            15,
            6,
            7,
            9,
            8,
            7,
            6,
            8,
            13,
            11,
            9,
            7,
            15,
            7,
            12,
            15,
            9,
            11,
            7,
            13,
            12,
            11,
            13,
            6,
            7,
            14,
            9,
            13,
            15,
            14,
            8,
            13,
            6,
            5,
            12,
            7,
            5,
            11,
            12,
            14,
            15,
            14,
            15,
            9,
            8,
            9,
            14,
            5,
            6,
            8,
            6,
            5,
            12,
            9,
            15,
            5,
            11,
            6,
            8,
            13,
            12,
            5,
            12,
            13,
            14,
            11,
            8,
            5,
            6
          ]);
          var _sr = WordArray.create([
            8,
            9,
            9,
            11,
            13,
            15,
            15,
            5,
            7,
            7,
            8,
            11,
            14,
            14,
            12,
            6,
            9,
            13,
            15,
            7,
            12,
            8,
            9,
            11,
            7,
            7,
            12,
            7,
            6,
            15,
            13,
            11,
            9,
            7,
            15,
            11,
            8,
            6,
            6,
            14,
            12,
            13,
            5,
            14,
            13,
            13,
            7,
            5,
            15,
            5,
            8,
            11,
            14,
            14,
            6,
            14,
            6,
            9,
            12,
            9,
            12,
            5,
            15,
            8,
            8,
            5,
            12,
            9,
            12,
            5,
            14,
            6,
            8,
            13,
            6,
            5,
            15,
            13,
            11,
            11
          ]);
          var _hl = WordArray.create([0, 1518500249, 1859775393, 2400959708, 2840853838]);
          var _hr = WordArray.create([1352829926, 1548603684, 1836072691, 2053994217, 0]);
          var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
            _doReset: function() {
              this._hash = WordArray.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
            },
            _doProcessBlock: function(M, offset) {
              for (var i2 = 0; i2 < 16; i2++) {
                var offset_i = offset + i2;
                var M_offset_i = M[offset_i];
                M[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
              }
              var H = this._hash.words;
              var hl = _hl.words;
              var hr = _hr.words;
              var zl = _zl.words;
              var zr = _zr.words;
              var sl = _sl.words;
              var sr = _sr.words;
              var al, bl, cl, dl, el;
              var ar, br, cr, dr, er;
              ar = al = H[0];
              br = bl = H[1];
              cr = cl = H[2];
              dr = dl = H[3];
              er = el = H[4];
              var t;
              for (var i2 = 0; i2 < 80; i2 += 1) {
                t = al + M[offset + zl[i2]] | 0;
                if (i2 < 16) {
                  t += f1(bl, cl, dl) + hl[0];
                } else if (i2 < 32) {
                  t += f2(bl, cl, dl) + hl[1];
                } else if (i2 < 48) {
                  t += f3(bl, cl, dl) + hl[2];
                } else if (i2 < 64) {
                  t += f4(bl, cl, dl) + hl[3];
                } else {
                  t += f5(bl, cl, dl) + hl[4];
                }
                t = t | 0;
                t = rotl(t, sl[i2]);
                t = t + el | 0;
                al = el;
                el = dl;
                dl = rotl(cl, 10);
                cl = bl;
                bl = t;
                t = ar + M[offset + zr[i2]] | 0;
                if (i2 < 16) {
                  t += f5(br, cr, dr) + hr[0];
                } else if (i2 < 32) {
                  t += f4(br, cr, dr) + hr[1];
                } else if (i2 < 48) {
                  t += f3(br, cr, dr) + hr[2];
                } else if (i2 < 64) {
                  t += f2(br, cr, dr) + hr[3];
                } else {
                  t += f1(br, cr, dr) + hr[4];
                }
                t = t | 0;
                t = rotl(t, sr[i2]);
                t = t + er | 0;
                ar = er;
                er = dr;
                dr = rotl(cr, 10);
                cr = br;
                br = t;
              }
              t = H[1] + cl + dr | 0;
              H[1] = H[2] + dl + er | 0;
              H[2] = H[3] + el + ar | 0;
              H[3] = H[4] + al + br | 0;
              H[4] = H[0] + bl + cr | 0;
              H[0] = t;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 16711935 | (nBitsTotal << 24 | nBitsTotal >>> 8) & 4278255360;
              data.sigBytes = (dataWords.length + 1) * 4;
              this._process();
              var hash = this._hash;
              var H = hash.words;
              for (var i2 = 0; i2 < 5; i2++) {
                var H_i = H[i2];
                H[i2] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
              }
              return hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          function f1(x, y, z) {
            return x ^ y ^ z;
          }
          function f2(x, y, z) {
            return x & y | ~x & z;
          }
          function f3(x, y, z) {
            return (x | ~y) ^ z;
          }
          function f4(x, y, z) {
            return x & z | y & ~z;
          }
          function f5(x, y, z) {
            return x ^ (y | ~z);
          }
          function rotl(x, n) {
            return x << n | x >>> 32 - n;
          }
          C.RIPEMD160 = Hasher._createHelper(RIPEMD160);
          C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
        })(Math);
        return CryptoJS.RIPEMD160;
      });
    }
  });

  // node_modules/crypto-js/hmac.js
  var require_hmac = __commonJS({
    "node_modules/crypto-js/hmac.js"(exports, module) {
      (function(root, factory) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var C_enc = C.enc;
          var Utf8 = C_enc.Utf8;
          var C_algo = C.algo;
          var HMAC = C_algo.HMAC = Base.extend({
            /**
             * Initializes a newly created HMAC.
             *
             * @param {Hasher} hasher The hash algorithm to use.
             * @param {WordArray|string} key The secret key.
             *
             * @example
             *
             *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
             */
            init: function(hasher, key) {
              hasher = this._hasher = new hasher.init();
              if (typeof key == "string") {
                key = Utf8.parse(key);
              }
              var hasherBlockSize = hasher.blockSize;
              var hasherBlockSizeBytes = hasherBlockSize * 4;
              if (key.sigBytes > hasherBlockSizeBytes) {
                key = hasher.finalize(key);
              }
              key.clamp();
              var oKey = this._oKey = key.clone();
              var iKey = this._iKey = key.clone();
              var oKeyWords = oKey.words;
              var iKeyWords = iKey.words;
              for (var i2 = 0; i2 < hasherBlockSize; i2++) {
                oKeyWords[i2] ^= 1549556828;
                iKeyWords[i2] ^= 909522486;
              }
              oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
              this.reset();
            },
            /**
             * Resets this HMAC to its initial state.
             *
             * @example
             *
             *     hmacHasher.reset();
             */
            reset: function() {
              var hasher = this._hasher;
              hasher.reset();
              hasher.update(this._iKey);
            },
            /**
             * Updates this HMAC with a message.
             *
             * @param {WordArray|string} messageUpdate The message to append.
             *
             * @return {HMAC} This HMAC instance.
             *
             * @example
             *
             *     hmacHasher.update('message');
             *     hmacHasher.update(wordArray);
             */
            update: function(messageUpdate) {
              this._hasher.update(messageUpdate);
              return this;
            },
            /**
             * Finalizes the HMAC computation.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} messageUpdate (Optional) A final message update.
             *
             * @return {WordArray} The HMAC.
             *
             * @example
             *
             *     var hmac = hmacHasher.finalize();
             *     var hmac = hmacHasher.finalize('message');
             *     var hmac = hmacHasher.finalize(wordArray);
             */
            finalize: function(messageUpdate) {
              var hasher = this._hasher;
              var innerHash = hasher.finalize(messageUpdate);
              hasher.reset();
              var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));
              return hmac;
            }
          });
        })();
      });
    }
  });

  // node_modules/crypto-js/pbkdf2.js
  var require_pbkdf2 = __commonJS({
    "node_modules/crypto-js/pbkdf2.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_sha256(), require_hmac());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./sha256", "./hmac"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var C_algo = C.algo;
          var SHA256 = C_algo.SHA256;
          var HMAC = C_algo.HMAC;
          var PBKDF2 = C_algo.PBKDF2 = Base.extend({
            /**
             * Configuration options.
             *
             * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
             * @property {Hasher} hasher The hasher to use. Default: SHA256
             * @property {number} iterations The number of iterations to perform. Default: 250000
             */
            cfg: Base.extend({
              keySize: 128 / 32,
              hasher: SHA256,
              iterations: 25e4
            }),
            /**
             * Initializes a newly created key derivation function.
             *
             * @param {Object} cfg (Optional) The configuration options to use for the derivation.
             *
             * @example
             *
             *     var kdf = CryptoJS.algo.PBKDF2.create();
             *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
             *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
             */
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
            },
            /**
             * Computes the Password-Based Key Derivation Function 2.
             *
             * @param {WordArray|string} password The password.
             * @param {WordArray|string} salt A salt.
             *
             * @return {WordArray} The derived key.
             *
             * @example
             *
             *     var key = kdf.compute(password, salt);
             */
            compute: function(password, salt) {
              var cfg = this.cfg;
              var hmac = HMAC.create(cfg.hasher, password);
              var derivedKey = WordArray.create();
              var blockIndex = WordArray.create([1]);
              var derivedKeyWords = derivedKey.words;
              var blockIndexWords = blockIndex.words;
              var keySize = cfg.keySize;
              var iterations = cfg.iterations;
              while (derivedKeyWords.length < keySize) {
                var block = hmac.update(salt).finalize(blockIndex);
                hmac.reset();
                var blockWords = block.words;
                var blockWordsLength = blockWords.length;
                var intermediate = block;
                for (var i2 = 1; i2 < iterations; i2++) {
                  intermediate = hmac.finalize(intermediate);
                  hmac.reset();
                  var intermediateWords = intermediate.words;
                  for (var j = 0; j < blockWordsLength; j++) {
                    blockWords[j] ^= intermediateWords[j];
                  }
                }
                derivedKey.concat(block);
                blockIndexWords[0]++;
              }
              derivedKey.sigBytes = keySize * 4;
              return derivedKey;
            }
          });
          C.PBKDF2 = function(password, salt, cfg) {
            return PBKDF2.create(cfg).compute(password, salt);
          };
        })();
        return CryptoJS.PBKDF2;
      });
    }
  });

  // node_modules/crypto-js/evpkdf.js
  var require_evpkdf = __commonJS({
    "node_modules/crypto-js/evpkdf.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_sha1(), require_hmac());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./sha1", "./hmac"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var C_algo = C.algo;
          var MD5 = C_algo.MD5;
          var EvpKDF = C_algo.EvpKDF = Base.extend({
            /**
             * Configuration options.
             *
             * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
             * @property {Hasher} hasher The hash algorithm to use. Default: MD5
             * @property {number} iterations The number of iterations to perform. Default: 1
             */
            cfg: Base.extend({
              keySize: 128 / 32,
              hasher: MD5,
              iterations: 1
            }),
            /**
             * Initializes a newly created key derivation function.
             *
             * @param {Object} cfg (Optional) The configuration options to use for the derivation.
             *
             * @example
             *
             *     var kdf = CryptoJS.algo.EvpKDF.create();
             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
             */
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
            },
            /**
             * Derives a key from a password.
             *
             * @param {WordArray|string} password The password.
             * @param {WordArray|string} salt A salt.
             *
             * @return {WordArray} The derived key.
             *
             * @example
             *
             *     var key = kdf.compute(password, salt);
             */
            compute: function(password, salt) {
              var block;
              var cfg = this.cfg;
              var hasher = cfg.hasher.create();
              var derivedKey = WordArray.create();
              var derivedKeyWords = derivedKey.words;
              var keySize = cfg.keySize;
              var iterations = cfg.iterations;
              while (derivedKeyWords.length < keySize) {
                if (block) {
                  hasher.update(block);
                }
                block = hasher.update(password).finalize(salt);
                hasher.reset();
                for (var i2 = 1; i2 < iterations; i2++) {
                  block = hasher.finalize(block);
                  hasher.reset();
                }
                derivedKey.concat(block);
              }
              derivedKey.sigBytes = keySize * 4;
              return derivedKey;
            }
          });
          C.EvpKDF = function(password, salt, cfg) {
            return EvpKDF.create(cfg).compute(password, salt);
          };
        })();
        return CryptoJS.EvpKDF;
      });
    }
  });

  // node_modules/crypto-js/cipher-core.js
  var require_cipher_core = __commonJS({
    "node_modules/crypto-js/cipher-core.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_evpkdf());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./evpkdf"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.lib.Cipher || function(undefined2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
          var C_enc = C.enc;
          var Utf8 = C_enc.Utf8;
          var Base64 = C_enc.Base64;
          var C_algo = C.algo;
          var EvpKDF = C_algo.EvpKDF;
          var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
            /**
             * Configuration options.
             *
             * @property {WordArray} iv The IV to use for this operation.
             */
            cfg: Base.extend(),
            /**
             * Creates this cipher in encryption mode.
             *
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {Cipher} A cipher instance.
             *
             * @static
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
             */
            createEncryptor: function(key, cfg) {
              return this.create(this._ENC_XFORM_MODE, key, cfg);
            },
            /**
             * Creates this cipher in decryption mode.
             *
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {Cipher} A cipher instance.
             *
             * @static
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
             */
            createDecryptor: function(key, cfg) {
              return this.create(this._DEC_XFORM_MODE, key, cfg);
            },
            /**
             * Initializes a newly created cipher.
             *
             * @param {number} xformMode Either the encryption or decryption transormation mode constant.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
             */
            init: function(xformMode, key, cfg) {
              this.cfg = this.cfg.extend(cfg);
              this._xformMode = xformMode;
              this._key = key;
              this.reset();
            },
            /**
             * Resets this cipher to its initial state.
             *
             * @example
             *
             *     cipher.reset();
             */
            reset: function() {
              BufferedBlockAlgorithm.reset.call(this);
              this._doReset();
            },
            /**
             * Adds data to be encrypted or decrypted.
             *
             * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
             *
             * @return {WordArray} The data after processing.
             *
             * @example
             *
             *     var encrypted = cipher.process('data');
             *     var encrypted = cipher.process(wordArray);
             */
            process: function(dataUpdate) {
              this._append(dataUpdate);
              return this._process();
            },
            /**
             * Finalizes the encryption or decryption process.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
             *
             * @return {WordArray} The data after final processing.
             *
             * @example
             *
             *     var encrypted = cipher.finalize();
             *     var encrypted = cipher.finalize('data');
             *     var encrypted = cipher.finalize(wordArray);
             */
            finalize: function(dataUpdate) {
              if (dataUpdate) {
                this._append(dataUpdate);
              }
              var finalProcessedData = this._doFinalize();
              return finalProcessedData;
            },
            keySize: 128 / 32,
            ivSize: 128 / 32,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            /**
             * Creates shortcut functions to a cipher's object interface.
             *
             * @param {Cipher} cipher The cipher to create a helper for.
             *
             * @return {Object} An object with encrypt and decrypt shortcut functions.
             *
             * @static
             *
             * @example
             *
             *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
             */
            _createHelper: /* @__PURE__ */ function() {
              function selectCipherStrategy(key) {
                if (typeof key == "string") {
                  return PasswordBasedCipher;
                } else {
                  return SerializableCipher;
                }
              }
              return function(cipher) {
                return {
                  encrypt: function(message, key, cfg) {
                    return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                  },
                  decrypt: function(ciphertext, key, cfg) {
                    return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                  }
                };
              };
            }()
          });
          var StreamCipher = C_lib.StreamCipher = Cipher.extend({
            _doFinalize: function() {
              var finalProcessedBlocks = this._process(true);
              return finalProcessedBlocks;
            },
            blockSize: 1
          });
          var C_mode = C.mode = {};
          var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
            /**
             * Creates this mode for encryption.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @static
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
             */
            createEncryptor: function(cipher, iv) {
              return this.Encryptor.create(cipher, iv);
            },
            /**
             * Creates this mode for decryption.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @static
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
             */
            createDecryptor: function(cipher, iv) {
              return this.Decryptor.create(cipher, iv);
            },
            /**
             * Initializes a newly created mode.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
             */
            init: function(cipher, iv) {
              this._cipher = cipher;
              this._iv = iv;
            }
          });
          var CBC = C_mode.CBC = function() {
            var CBC2 = BlockCipherMode.extend();
            CBC2.Encryptor = CBC2.extend({
              /**
               * Processes the data block at offset.
               *
               * @param {Array} words The data words to operate on.
               * @param {number} offset The offset where the block starts.
               *
               * @example
               *
               *     mode.processBlock(data.words, offset);
               */
              processBlock: function(words, offset) {
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;
                xorBlock.call(this, words, offset, blockSize);
                cipher.encryptBlock(words, offset);
                this._prevBlock = words.slice(offset, offset + blockSize);
              }
            });
            CBC2.Decryptor = CBC2.extend({
              /**
               * Processes the data block at offset.
               *
               * @param {Array} words The data words to operate on.
               * @param {number} offset The offset where the block starts.
               *
               * @example
               *
               *     mode.processBlock(data.words, offset);
               */
              processBlock: function(words, offset) {
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;
                var thisBlock = words.slice(offset, offset + blockSize);
                cipher.decryptBlock(words, offset);
                xorBlock.call(this, words, offset, blockSize);
                this._prevBlock = thisBlock;
              }
            });
            function xorBlock(words, offset, blockSize) {
              var block;
              var iv = this._iv;
              if (iv) {
                block = iv;
                this._iv = undefined2;
              } else {
                block = this._prevBlock;
              }
              for (var i2 = 0; i2 < blockSize; i2++) {
                words[offset + i2] ^= block[i2];
              }
            }
            return CBC2;
          }();
          var C_pad = C.pad = {};
          var Pkcs7 = C_pad.Pkcs7 = {
            /**
             * Pads data using the algorithm defined in PKCS #5/7.
             *
             * @param {WordArray} data The data to pad.
             * @param {number} blockSize The multiple that the data should be padded to.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
             */
            pad: function(data, blockSize) {
              var blockSizeBytes = blockSize * 4;
              var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
              var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes;
              var paddingWords = [];
              for (var i2 = 0; i2 < nPaddingBytes; i2 += 4) {
                paddingWords.push(paddingWord);
              }
              var padding = WordArray.create(paddingWords, nPaddingBytes);
              data.concat(padding);
            },
            /**
             * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
             *
             * @param {WordArray} data The data to unpad.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.pad.Pkcs7.unpad(wordArray);
             */
            unpad: function(data) {
              var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
              data.sigBytes -= nPaddingBytes;
            }
          };
          var BlockCipher = C_lib.BlockCipher = Cipher.extend({
            /**
             * Configuration options.
             *
             * @property {Mode} mode The block mode to use. Default: CBC
             * @property {Padding} padding The padding strategy to use. Default: Pkcs7
             */
            cfg: Cipher.cfg.extend({
              mode: CBC,
              padding: Pkcs7
            }),
            reset: function() {
              var modeCreator;
              Cipher.reset.call(this);
              var cfg = this.cfg;
              var iv = cfg.iv;
              var mode = cfg.mode;
              if (this._xformMode == this._ENC_XFORM_MODE) {
                modeCreator = mode.createEncryptor;
              } else {
                modeCreator = mode.createDecryptor;
                this._minBufferSize = 1;
              }
              if (this._mode && this._mode.__creator == modeCreator) {
                this._mode.init(this, iv && iv.words);
              } else {
                this._mode = modeCreator.call(mode, this, iv && iv.words);
                this._mode.__creator = modeCreator;
              }
            },
            _doProcessBlock: function(words, offset) {
              this._mode.processBlock(words, offset);
            },
            _doFinalize: function() {
              var finalProcessedBlocks;
              var padding = this.cfg.padding;
              if (this._xformMode == this._ENC_XFORM_MODE) {
                padding.pad(this._data, this.blockSize);
                finalProcessedBlocks = this._process(true);
              } else {
                finalProcessedBlocks = this._process(true);
                padding.unpad(finalProcessedBlocks);
              }
              return finalProcessedBlocks;
            },
            blockSize: 128 / 32
          });
          var CipherParams = C_lib.CipherParams = Base.extend({
            /**
             * Initializes a newly created cipher params object.
             *
             * @param {Object} cipherParams An object with any of the possible cipher parameters.
             *
             * @example
             *
             *     var cipherParams = CryptoJS.lib.CipherParams.create({
             *         ciphertext: ciphertextWordArray,
             *         key: keyWordArray,
             *         iv: ivWordArray,
             *         salt: saltWordArray,
             *         algorithm: CryptoJS.algo.AES,
             *         mode: CryptoJS.mode.CBC,
             *         padding: CryptoJS.pad.PKCS7,
             *         blockSize: 4,
             *         formatter: CryptoJS.format.OpenSSL
             *     });
             */
            init: function(cipherParams) {
              this.mixIn(cipherParams);
            },
            /**
             * Converts this cipher params object to a string.
             *
             * @param {Format} formatter (Optional) The formatting strategy to use.
             *
             * @return {string} The stringified cipher params.
             *
             * @throws Error If neither the formatter nor the default formatter is set.
             *
             * @example
             *
             *     var string = cipherParams + '';
             *     var string = cipherParams.toString();
             *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
             */
            toString: function(formatter) {
              return (formatter || this.formatter).stringify(this);
            }
          });
          var C_format = C.format = {};
          var OpenSSLFormatter = C_format.OpenSSL = {
            /**
             * Converts a cipher params object to an OpenSSL-compatible string.
             *
             * @param {CipherParams} cipherParams The cipher params object.
             *
             * @return {string} The OpenSSL-compatible string.
             *
             * @static
             *
             * @example
             *
             *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
             */
            stringify: function(cipherParams) {
              var wordArray;
              var ciphertext = cipherParams.ciphertext;
              var salt = cipherParams.salt;
              if (salt) {
                wordArray = WordArray.create([1398893684, 1701076831]).concat(salt).concat(ciphertext);
              } else {
                wordArray = ciphertext;
              }
              return wordArray.toString(Base64);
            },
            /**
             * Converts an OpenSSL-compatible string to a cipher params object.
             *
             * @param {string} openSSLStr The OpenSSL-compatible string.
             *
             * @return {CipherParams} The cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
             */
            parse: function(openSSLStr) {
              var salt;
              var ciphertext = Base64.parse(openSSLStr);
              var ciphertextWords = ciphertext.words;
              if (ciphertextWords[0] == 1398893684 && ciphertextWords[1] == 1701076831) {
                salt = WordArray.create(ciphertextWords.slice(2, 4));
                ciphertextWords.splice(0, 4);
                ciphertext.sigBytes -= 16;
              }
              return CipherParams.create({ ciphertext, salt });
            }
          };
          var SerializableCipher = C_lib.SerializableCipher = Base.extend({
            /**
             * Configuration options.
             *
             * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
             */
            cfg: Base.extend({
              format: OpenSSLFormatter
            }),
            /**
             * Encrypts a message.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {WordArray|string} message The message to encrypt.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {CipherParams} A cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             */
            encrypt: function(cipher, message, key, cfg) {
              cfg = this.cfg.extend(cfg);
              var encryptor = cipher.createEncryptor(key, cfg);
              var ciphertext = encryptor.finalize(message);
              var cipherCfg = encryptor.cfg;
              return CipherParams.create({
                ciphertext,
                key,
                iv: cipherCfg.iv,
                algorithm: cipher,
                mode: cipherCfg.mode,
                padding: cipherCfg.padding,
                blockSize: cipher.blockSize,
                formatter: cfg.format
              });
            },
            /**
             * Decrypts serialized ciphertext.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {WordArray} The plaintext.
             *
             * @static
             *
             * @example
             *
             *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             */
            decrypt: function(cipher, ciphertext, key, cfg) {
              cfg = this.cfg.extend(cfg);
              ciphertext = this._parse(ciphertext, cfg.format);
              var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
              return plaintext;
            },
            /**
             * Converts serialized ciphertext to CipherParams,
             * else assumed CipherParams already and returns ciphertext unchanged.
             *
             * @param {CipherParams|string} ciphertext The ciphertext.
             * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
             *
             * @return {CipherParams} The unserialized ciphertext.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
             */
            _parse: function(ciphertext, format) {
              if (typeof ciphertext == "string") {
                return format.parse(ciphertext, this);
              } else {
                return ciphertext;
              }
            }
          });
          var C_kdf = C.kdf = {};
          var OpenSSLKdf = C_kdf.OpenSSL = {
            /**
             * Derives a key and IV from a password.
             *
             * @param {string} password The password to derive from.
             * @param {number} keySize The size in words of the key to generate.
             * @param {number} ivSize The size in words of the IV to generate.
             * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
             *
             * @return {CipherParams} A cipher params object with the key, IV, and salt.
             *
             * @static
             *
             * @example
             *
             *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
             *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
             */
            execute: function(password, keySize, ivSize, salt, hasher) {
              if (!salt) {
                salt = WordArray.random(64 / 8);
              }
              if (!hasher) {
                var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
              } else {
                var key = EvpKDF.create({ keySize: keySize + ivSize, hasher }).compute(password, salt);
              }
              var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
              key.sigBytes = keySize * 4;
              return CipherParams.create({ key, iv, salt });
            }
          };
          var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
            /**
             * Configuration options.
             *
             * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
             */
            cfg: SerializableCipher.cfg.extend({
              kdf: OpenSSLKdf
            }),
            /**
             * Encrypts a message using a password.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {WordArray|string} message The message to encrypt.
             * @param {string} password The password.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {CipherParams} A cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
             *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
             */
            encrypt: function(cipher, message, password, cfg) {
              cfg = this.cfg.extend(cfg);
              var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, cfg.salt, cfg.hasher);
              cfg.iv = derivedParams.iv;
              var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);
              ciphertext.mixIn(derivedParams);
              return ciphertext;
            },
            /**
             * Decrypts serialized ciphertext using a password.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
             * @param {string} password The password.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {WordArray} The plaintext.
             *
             * @static
             *
             * @example
             *
             *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
             *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
             */
            decrypt: function(cipher, ciphertext, password, cfg) {
              cfg = this.cfg.extend(cfg);
              ciphertext = this._parse(ciphertext, cfg.format);
              var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt, cfg.hasher);
              cfg.iv = derivedParams.iv;
              var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
              return plaintext;
            }
          });
        }();
      });
    }
  });

  // node_modules/crypto-js/mode-cfb.js
  var require_mode_cfb = __commonJS({
    "node_modules/crypto-js/mode-cfb.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.mode.CFB = function() {
          var CFB = CryptoJS.lib.BlockCipherMode.extend();
          CFB.Encryptor = CFB.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
              this._prevBlock = words.slice(offset, offset + blockSize);
            }
          });
          CFB.Decryptor = CFB.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var thisBlock = words.slice(offset, offset + blockSize);
              generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
              this._prevBlock = thisBlock;
            }
          });
          function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
            var keystream;
            var iv = this._iv;
            if (iv) {
              keystream = iv.slice(0);
              this._iv = void 0;
            } else {
              keystream = this._prevBlock;
            }
            cipher.encryptBlock(keystream, 0);
            for (var i2 = 0; i2 < blockSize; i2++) {
              words[offset + i2] ^= keystream[i2];
            }
          }
          return CFB;
        }();
        return CryptoJS.mode.CFB;
      });
    }
  });

  // node_modules/crypto-js/mode-ctr.js
  var require_mode_ctr = __commonJS({
    "node_modules/crypto-js/mode-ctr.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.mode.CTR = function() {
          var CTR = CryptoJS.lib.BlockCipherMode.extend();
          var Encryptor = CTR.Encryptor = CTR.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var counter = this._counter;
              if (iv) {
                counter = this._counter = iv.slice(0);
                this._iv = void 0;
              }
              var keystream = counter.slice(0);
              cipher.encryptBlock(keystream, 0);
              counter[blockSize - 1] = counter[blockSize - 1] + 1 | 0;
              for (var i2 = 0; i2 < blockSize; i2++) {
                words[offset + i2] ^= keystream[i2];
              }
            }
          });
          CTR.Decryptor = Encryptor;
          return CTR;
        }();
        return CryptoJS.mode.CTR;
      });
    }
  });

  // node_modules/crypto-js/mode-ctr-gladman.js
  var require_mode_ctr_gladman = __commonJS({
    "node_modules/crypto-js/mode-ctr-gladman.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.mode.CTRGladman = function() {
          var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();
          function incWord(word) {
            if ((word >> 24 & 255) === 255) {
              var b1 = word >> 16 & 255;
              var b2 = word >> 8 & 255;
              var b3 = word & 255;
              if (b1 === 255) {
                b1 = 0;
                if (b2 === 255) {
                  b2 = 0;
                  if (b3 === 255) {
                    b3 = 0;
                  } else {
                    ++b3;
                  }
                } else {
                  ++b2;
                }
              } else {
                ++b1;
              }
              word = 0;
              word += b1 << 16;
              word += b2 << 8;
              word += b3;
            } else {
              word += 1 << 24;
            }
            return word;
          }
          function incCounter(counter) {
            if ((counter[0] = incWord(counter[0])) === 0) {
              counter[1] = incWord(counter[1]);
            }
            return counter;
          }
          var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var counter = this._counter;
              if (iv) {
                counter = this._counter = iv.slice(0);
                this._iv = void 0;
              }
              incCounter(counter);
              var keystream = counter.slice(0);
              cipher.encryptBlock(keystream, 0);
              for (var i2 = 0; i2 < blockSize; i2++) {
                words[offset + i2] ^= keystream[i2];
              }
            }
          });
          CTRGladman.Decryptor = Encryptor;
          return CTRGladman;
        }();
        return CryptoJS.mode.CTRGladman;
      });
    }
  });

  // node_modules/crypto-js/mode-ofb.js
  var require_mode_ofb = __commonJS({
    "node_modules/crypto-js/mode-ofb.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.mode.OFB = function() {
          var OFB = CryptoJS.lib.BlockCipherMode.extend();
          var Encryptor = OFB.Encryptor = OFB.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var keystream = this._keystream;
              if (iv) {
                keystream = this._keystream = iv.slice(0);
                this._iv = void 0;
              }
              cipher.encryptBlock(keystream, 0);
              for (var i2 = 0; i2 < blockSize; i2++) {
                words[offset + i2] ^= keystream[i2];
              }
            }
          });
          OFB.Decryptor = Encryptor;
          return OFB;
        }();
        return CryptoJS.mode.OFB;
      });
    }
  });

  // node_modules/crypto-js/mode-ecb.js
  var require_mode_ecb = __commonJS({
    "node_modules/crypto-js/mode-ecb.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.mode.ECB = function() {
          var ECB = CryptoJS.lib.BlockCipherMode.extend();
          ECB.Encryptor = ECB.extend({
            processBlock: function(words, offset) {
              this._cipher.encryptBlock(words, offset);
            }
          });
          ECB.Decryptor = ECB.extend({
            processBlock: function(words, offset) {
              this._cipher.decryptBlock(words, offset);
            }
          });
          return ECB;
        }();
        return CryptoJS.mode.ECB;
      });
    }
  });

  // node_modules/crypto-js/pad-ansix923.js
  var require_pad_ansix923 = __commonJS({
    "node_modules/crypto-js/pad-ansix923.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.pad.AnsiX923 = {
          pad: function(data, blockSize) {
            var dataSigBytes = data.sigBytes;
            var blockSizeBytes = blockSize * 4;
            var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;
            var lastBytePos = dataSigBytes + nPaddingBytes - 1;
            data.clamp();
            data.words[lastBytePos >>> 2] |= nPaddingBytes << 24 - lastBytePos % 4 * 8;
            data.sigBytes += nPaddingBytes;
          },
          unpad: function(data) {
            var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
            data.sigBytes -= nPaddingBytes;
          }
        };
        return CryptoJS.pad.Ansix923;
      });
    }
  });

  // node_modules/crypto-js/pad-iso10126.js
  var require_pad_iso10126 = __commonJS({
    "node_modules/crypto-js/pad-iso10126.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.pad.Iso10126 = {
          pad: function(data, blockSize) {
            var blockSizeBytes = blockSize * 4;
            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
            data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
          },
          unpad: function(data) {
            var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
            data.sigBytes -= nPaddingBytes;
          }
        };
        return CryptoJS.pad.Iso10126;
      });
    }
  });

  // node_modules/crypto-js/pad-iso97971.js
  var require_pad_iso97971 = __commonJS({
    "node_modules/crypto-js/pad-iso97971.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.pad.Iso97971 = {
          pad: function(data, blockSize) {
            data.concat(CryptoJS.lib.WordArray.create([2147483648], 1));
            CryptoJS.pad.ZeroPadding.pad(data, blockSize);
          },
          unpad: function(data) {
            CryptoJS.pad.ZeroPadding.unpad(data);
            data.sigBytes--;
          }
        };
        return CryptoJS.pad.Iso97971;
      });
    }
  });

  // node_modules/crypto-js/pad-zeropadding.js
  var require_pad_zeropadding = __commonJS({
    "node_modules/crypto-js/pad-zeropadding.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.pad.ZeroPadding = {
          pad: function(data, blockSize) {
            var blockSizeBytes = blockSize * 4;
            data.clamp();
            data.sigBytes += blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
          },
          unpad: function(data) {
            var dataWords = data.words;
            var i2 = data.sigBytes - 1;
            for (var i2 = data.sigBytes - 1; i2 >= 0; i2--) {
              if (dataWords[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255) {
                data.sigBytes = i2 + 1;
                break;
              }
            }
          }
        };
        return CryptoJS.pad.ZeroPadding;
      });
    }
  });

  // node_modules/crypto-js/pad-nopadding.js
  var require_pad_nopadding = __commonJS({
    "node_modules/crypto-js/pad-nopadding.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        CryptoJS.pad.NoPadding = {
          pad: function() {
          },
          unpad: function() {
          }
        };
        return CryptoJS.pad.NoPadding;
      });
    }
  });

  // node_modules/crypto-js/format-hex.js
  var require_format_hex = __commonJS({
    "node_modules/crypto-js/format-hex.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function(undefined2) {
          var C = CryptoJS;
          var C_lib = C.lib;
          var CipherParams = C_lib.CipherParams;
          var C_enc = C.enc;
          var Hex = C_enc.Hex;
          var C_format = C.format;
          var HexFormatter = C_format.Hex = {
            /**
             * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
             *
             * @param {CipherParams} cipherParams The cipher params object.
             *
             * @return {string} The hexadecimally encoded string.
             *
             * @static
             *
             * @example
             *
             *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
             */
            stringify: function(cipherParams) {
              return cipherParams.ciphertext.toString(Hex);
            },
            /**
             * Converts a hexadecimally encoded ciphertext string to a cipher params object.
             *
             * @param {string} input The hexadecimally encoded string.
             *
             * @return {CipherParams} The cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
             */
            parse: function(input) {
              var ciphertext = Hex.parse(input);
              return CipherParams.create({ ciphertext });
            }
          };
        })();
        return CryptoJS.format.Hex;
      });
    }
  });

  // node_modules/crypto-js/aes.js
  var require_aes = __commonJS({
    "node_modules/crypto-js/aes.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C.algo;
          var SBOX = [];
          var INV_SBOX = [];
          var SUB_MIX_0 = [];
          var SUB_MIX_1 = [];
          var SUB_MIX_2 = [];
          var SUB_MIX_3 = [];
          var INV_SUB_MIX_0 = [];
          var INV_SUB_MIX_1 = [];
          var INV_SUB_MIX_2 = [];
          var INV_SUB_MIX_3 = [];
          (function() {
            var d = [];
            for (var i2 = 0; i2 < 256; i2++) {
              if (i2 < 128) {
                d[i2] = i2 << 1;
              } else {
                d[i2] = i2 << 1 ^ 283;
              }
            }
            var x = 0;
            var xi = 0;
            for (var i2 = 0; i2 < 256; i2++) {
              var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
              sx = sx >>> 8 ^ sx & 255 ^ 99;
              SBOX[x] = sx;
              INV_SBOX[sx] = x;
              var x2 = d[x];
              var x4 = d[x2];
              var x8 = d[x4];
              var t = d[sx] * 257 ^ sx * 16843008;
              SUB_MIX_0[x] = t << 24 | t >>> 8;
              SUB_MIX_1[x] = t << 16 | t >>> 16;
              SUB_MIX_2[x] = t << 8 | t >>> 24;
              SUB_MIX_3[x] = t;
              var t = x8 * 16843009 ^ x4 * 65537 ^ x2 * 257 ^ x * 16843008;
              INV_SUB_MIX_0[sx] = t << 24 | t >>> 8;
              INV_SUB_MIX_1[sx] = t << 16 | t >>> 16;
              INV_SUB_MIX_2[sx] = t << 8 | t >>> 24;
              INV_SUB_MIX_3[sx] = t;
              if (!x) {
                x = xi = 1;
              } else {
                x = x2 ^ d[d[d[x8 ^ x2]]];
                xi ^= d[d[xi]];
              }
            }
          })();
          var RCON = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
          var AES = C_algo.AES = BlockCipher.extend({
            _doReset: function() {
              var t;
              if (this._nRounds && this._keyPriorReset === this._key) {
                return;
              }
              var key = this._keyPriorReset = this._key;
              var keyWords = key.words;
              var keySize = key.sigBytes / 4;
              var nRounds = this._nRounds = keySize + 6;
              var ksRows = (nRounds + 1) * 4;
              var keySchedule = this._keySchedule = [];
              for (var ksRow = 0; ksRow < ksRows; ksRow++) {
                if (ksRow < keySize) {
                  keySchedule[ksRow] = keyWords[ksRow];
                } else {
                  t = keySchedule[ksRow - 1];
                  if (!(ksRow % keySize)) {
                    t = t << 8 | t >>> 24;
                    t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 255] << 16 | SBOX[t >>> 8 & 255] << 8 | SBOX[t & 255];
                    t ^= RCON[ksRow / keySize | 0] << 24;
                  } else if (keySize > 6 && ksRow % keySize == 4) {
                    t = SBOX[t >>> 24] << 24 | SBOX[t >>> 16 & 255] << 16 | SBOX[t >>> 8 & 255] << 8 | SBOX[t & 255];
                  }
                  keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
                }
              }
              var invKeySchedule = this._invKeySchedule = [];
              for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
                var ksRow = ksRows - invKsRow;
                if (invKsRow % 4) {
                  var t = keySchedule[ksRow];
                } else {
                  var t = keySchedule[ksRow - 4];
                }
                if (invKsRow < 4 || ksRow <= 4) {
                  invKeySchedule[invKsRow] = t;
                } else {
                  invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[t >>> 16 & 255]] ^ INV_SUB_MIX_2[SBOX[t >>> 8 & 255]] ^ INV_SUB_MIX_3[SBOX[t & 255]];
                }
              }
            },
            encryptBlock: function(M, offset) {
              this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
            },
            decryptBlock: function(M, offset) {
              var t = M[offset + 1];
              M[offset + 1] = M[offset + 3];
              M[offset + 3] = t;
              this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
              var t = M[offset + 1];
              M[offset + 1] = M[offset + 3];
              M[offset + 3] = t;
            },
            _doCryptBlock: function(M, offset, keySchedule, SUB_MIX_02, SUB_MIX_12, SUB_MIX_22, SUB_MIX_32, SBOX2) {
              var nRounds = this._nRounds;
              var s0 = M[offset] ^ keySchedule[0];
              var s1 = M[offset + 1] ^ keySchedule[1];
              var s2 = M[offset + 2] ^ keySchedule[2];
              var s3 = M[offset + 3] ^ keySchedule[3];
              var ksRow = 4;
              for (var round = 1; round < nRounds; round++) {
                var t0 = SUB_MIX_02[s0 >>> 24] ^ SUB_MIX_12[s1 >>> 16 & 255] ^ SUB_MIX_22[s2 >>> 8 & 255] ^ SUB_MIX_32[s3 & 255] ^ keySchedule[ksRow++];
                var t1 = SUB_MIX_02[s1 >>> 24] ^ SUB_MIX_12[s2 >>> 16 & 255] ^ SUB_MIX_22[s3 >>> 8 & 255] ^ SUB_MIX_32[s0 & 255] ^ keySchedule[ksRow++];
                var t2 = SUB_MIX_02[s2 >>> 24] ^ SUB_MIX_12[s3 >>> 16 & 255] ^ SUB_MIX_22[s0 >>> 8 & 255] ^ SUB_MIX_32[s1 & 255] ^ keySchedule[ksRow++];
                var t3 = SUB_MIX_02[s3 >>> 24] ^ SUB_MIX_12[s0 >>> 16 & 255] ^ SUB_MIX_22[s1 >>> 8 & 255] ^ SUB_MIX_32[s2 & 255] ^ keySchedule[ksRow++];
                s0 = t0;
                s1 = t1;
                s2 = t2;
                s3 = t3;
              }
              var t0 = (SBOX2[s0 >>> 24] << 24 | SBOX2[s1 >>> 16 & 255] << 16 | SBOX2[s2 >>> 8 & 255] << 8 | SBOX2[s3 & 255]) ^ keySchedule[ksRow++];
              var t1 = (SBOX2[s1 >>> 24] << 24 | SBOX2[s2 >>> 16 & 255] << 16 | SBOX2[s3 >>> 8 & 255] << 8 | SBOX2[s0 & 255]) ^ keySchedule[ksRow++];
              var t2 = (SBOX2[s2 >>> 24] << 24 | SBOX2[s3 >>> 16 & 255] << 16 | SBOX2[s0 >>> 8 & 255] << 8 | SBOX2[s1 & 255]) ^ keySchedule[ksRow++];
              var t3 = (SBOX2[s3 >>> 24] << 24 | SBOX2[s0 >>> 16 & 255] << 16 | SBOX2[s1 >>> 8 & 255] << 8 | SBOX2[s2 & 255]) ^ keySchedule[ksRow++];
              M[offset] = t0;
              M[offset + 1] = t1;
              M[offset + 2] = t2;
              M[offset + 3] = t3;
            },
            keySize: 256 / 32
          });
          C.AES = BlockCipher._createHelper(AES);
        })();
        return CryptoJS.AES;
      });
    }
  });

  // node_modules/crypto-js/tripledes.js
  var require_tripledes = __commonJS({
    "node_modules/crypto-js/tripledes.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var WordArray = C_lib.WordArray;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C.algo;
          var PC1 = [
            57,
            49,
            41,
            33,
            25,
            17,
            9,
            1,
            58,
            50,
            42,
            34,
            26,
            18,
            10,
            2,
            59,
            51,
            43,
            35,
            27,
            19,
            11,
            3,
            60,
            52,
            44,
            36,
            63,
            55,
            47,
            39,
            31,
            23,
            15,
            7,
            62,
            54,
            46,
            38,
            30,
            22,
            14,
            6,
            61,
            53,
            45,
            37,
            29,
            21,
            13,
            5,
            28,
            20,
            12,
            4
          ];
          var PC2 = [
            14,
            17,
            11,
            24,
            1,
            5,
            3,
            28,
            15,
            6,
            21,
            10,
            23,
            19,
            12,
            4,
            26,
            8,
            16,
            7,
            27,
            20,
            13,
            2,
            41,
            52,
            31,
            37,
            47,
            55,
            30,
            40,
            51,
            45,
            33,
            48,
            44,
            49,
            39,
            56,
            34,
            53,
            46,
            42,
            50,
            36,
            29,
            32
          ];
          var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];
          var SBOX_P = [
            {
              0: 8421888,
              268435456: 32768,
              536870912: 8421378,
              805306368: 2,
              1073741824: 512,
              1342177280: 8421890,
              1610612736: 8389122,
              1879048192: 8388608,
              2147483648: 514,
              2415919104: 8389120,
              2684354560: 33280,
              2952790016: 8421376,
              3221225472: 32770,
              3489660928: 8388610,
              3758096384: 0,
              4026531840: 33282,
              134217728: 0,
              402653184: 8421890,
              671088640: 33282,
              939524096: 32768,
              1207959552: 8421888,
              1476395008: 512,
              1744830464: 8421378,
              2013265920: 2,
              2281701376: 8389120,
              2550136832: 33280,
              2818572288: 8421376,
              3087007744: 8389122,
              3355443200: 8388610,
              3623878656: 32770,
              3892314112: 514,
              4160749568: 8388608,
              1: 32768,
              268435457: 2,
              536870913: 8421888,
              805306369: 8388608,
              1073741825: 8421378,
              1342177281: 33280,
              1610612737: 512,
              1879048193: 8389122,
              2147483649: 8421890,
              2415919105: 8421376,
              2684354561: 8388610,
              2952790017: 33282,
              3221225473: 514,
              3489660929: 8389120,
              3758096385: 32770,
              4026531841: 0,
              134217729: 8421890,
              402653185: 8421376,
              671088641: 8388608,
              939524097: 512,
              1207959553: 32768,
              1476395009: 8388610,
              1744830465: 2,
              2013265921: 33282,
              2281701377: 32770,
              2550136833: 8389122,
              2818572289: 514,
              3087007745: 8421888,
              3355443201: 8389120,
              3623878657: 0,
              3892314113: 33280,
              4160749569: 8421378
            },
            {
              0: 1074282512,
              16777216: 16384,
              33554432: 524288,
              50331648: 1074266128,
              67108864: 1073741840,
              83886080: 1074282496,
              100663296: 1073758208,
              117440512: 16,
              134217728: 540672,
              150994944: 1073758224,
              167772160: 1073741824,
              184549376: 540688,
              201326592: 524304,
              218103808: 0,
              234881024: 16400,
              251658240: 1074266112,
              8388608: 1073758208,
              25165824: 540688,
              41943040: 16,
              58720256: 1073758224,
              75497472: 1074282512,
              92274688: 1073741824,
              109051904: 524288,
              125829120: 1074266128,
              142606336: 524304,
              159383552: 0,
              176160768: 16384,
              192937984: 1074266112,
              209715200: 1073741840,
              226492416: 540672,
              243269632: 1074282496,
              260046848: 16400,
              268435456: 0,
              285212672: 1074266128,
              301989888: 1073758224,
              318767104: 1074282496,
              335544320: 1074266112,
              352321536: 16,
              369098752: 540688,
              385875968: 16384,
              402653184: 16400,
              419430400: 524288,
              436207616: 524304,
              452984832: 1073741840,
              469762048: 540672,
              486539264: 1073758208,
              503316480: 1073741824,
              520093696: 1074282512,
              276824064: 540688,
              293601280: 524288,
              310378496: 1074266112,
              327155712: 16384,
              343932928: 1073758208,
              360710144: 1074282512,
              377487360: 16,
              394264576: 1073741824,
              411041792: 1074282496,
              427819008: 1073741840,
              444596224: 1073758224,
              461373440: 524304,
              478150656: 0,
              494927872: 16400,
              511705088: 1074266128,
              528482304: 540672
            },
            {
              0: 260,
              1048576: 0,
              2097152: 67109120,
              3145728: 65796,
              4194304: 65540,
              5242880: 67108868,
              6291456: 67174660,
              7340032: 67174400,
              8388608: 67108864,
              9437184: 67174656,
              10485760: 65792,
              11534336: 67174404,
              12582912: 67109124,
              13631488: 65536,
              14680064: 4,
              15728640: 256,
              524288: 67174656,
              1572864: 67174404,
              2621440: 0,
              3670016: 67109120,
              4718592: 67108868,
              5767168: 65536,
              6815744: 65540,
              7864320: 260,
              8912896: 4,
              9961472: 256,
              11010048: 67174400,
              12058624: 65796,
              13107200: 65792,
              14155776: 67109124,
              15204352: 67174660,
              16252928: 67108864,
              16777216: 67174656,
              17825792: 65540,
              18874368: 65536,
              19922944: 67109120,
              20971520: 256,
              22020096: 67174660,
              23068672: 67108868,
              24117248: 0,
              25165824: 67109124,
              26214400: 67108864,
              27262976: 4,
              28311552: 65792,
              29360128: 67174400,
              30408704: 260,
              31457280: 65796,
              32505856: 67174404,
              17301504: 67108864,
              18350080: 260,
              19398656: 67174656,
              20447232: 0,
              21495808: 65540,
              22544384: 67109120,
              23592960: 256,
              24641536: 67174404,
              25690112: 65536,
              26738688: 67174660,
              27787264: 65796,
              28835840: 67108868,
              29884416: 67109124,
              30932992: 67174400,
              31981568: 4,
              33030144: 65792
            },
            {
              0: 2151682048,
              65536: 2147487808,
              131072: 4198464,
              196608: 2151677952,
              262144: 0,
              327680: 4198400,
              393216: 2147483712,
              458752: 4194368,
              524288: 2147483648,
              589824: 4194304,
              655360: 64,
              720896: 2147487744,
              786432: 2151678016,
              851968: 4160,
              917504: 4096,
              983040: 2151682112,
              32768: 2147487808,
              98304: 64,
              163840: 2151678016,
              229376: 2147487744,
              294912: 4198400,
              360448: 2151682112,
              425984: 0,
              491520: 2151677952,
              557056: 4096,
              622592: 2151682048,
              688128: 4194304,
              753664: 4160,
              819200: 2147483648,
              884736: 4194368,
              950272: 4198464,
              1015808: 2147483712,
              1048576: 4194368,
              1114112: 4198400,
              1179648: 2147483712,
              1245184: 0,
              1310720: 4160,
              1376256: 2151678016,
              1441792: 2151682048,
              1507328: 2147487808,
              1572864: 2151682112,
              1638400: 2147483648,
              1703936: 2151677952,
              1769472: 4198464,
              1835008: 2147487744,
              1900544: 4194304,
              1966080: 64,
              2031616: 4096,
              1081344: 2151677952,
              1146880: 2151682112,
              1212416: 0,
              1277952: 4198400,
              1343488: 4194368,
              1409024: 2147483648,
              1474560: 2147487808,
              1540096: 64,
              1605632: 2147483712,
              1671168: 4096,
              1736704: 2147487744,
              1802240: 2151678016,
              1867776: 4160,
              1933312: 2151682048,
              1998848: 4194304,
              2064384: 4198464
            },
            {
              0: 128,
              4096: 17039360,
              8192: 262144,
              12288: 536870912,
              16384: 537133184,
              20480: 16777344,
              24576: 553648256,
              28672: 262272,
              32768: 16777216,
              36864: 537133056,
              40960: 536871040,
              45056: 553910400,
              49152: 553910272,
              53248: 0,
              57344: 17039488,
              61440: 553648128,
              2048: 17039488,
              6144: 553648256,
              10240: 128,
              14336: 17039360,
              18432: 262144,
              22528: 537133184,
              26624: 553910272,
              30720: 536870912,
              34816: 537133056,
              38912: 0,
              43008: 553910400,
              47104: 16777344,
              51200: 536871040,
              55296: 553648128,
              59392: 16777216,
              63488: 262272,
              65536: 262144,
              69632: 128,
              73728: 536870912,
              77824: 553648256,
              81920: 16777344,
              86016: 553910272,
              90112: 537133184,
              94208: 16777216,
              98304: 553910400,
              102400: 553648128,
              106496: 17039360,
              110592: 537133056,
              114688: 262272,
              118784: 536871040,
              122880: 0,
              126976: 17039488,
              67584: 553648256,
              71680: 16777216,
              75776: 17039360,
              79872: 537133184,
              83968: 536870912,
              88064: 17039488,
              92160: 128,
              96256: 553910272,
              100352: 262272,
              104448: 553910400,
              108544: 0,
              112640: 553648128,
              116736: 16777344,
              120832: 262144,
              124928: 537133056,
              129024: 536871040
            },
            {
              0: 268435464,
              256: 8192,
              512: 270532608,
              768: 270540808,
              1024: 268443648,
              1280: 2097152,
              1536: 2097160,
              1792: 268435456,
              2048: 0,
              2304: 268443656,
              2560: 2105344,
              2816: 8,
              3072: 270532616,
              3328: 2105352,
              3584: 8200,
              3840: 270540800,
              128: 270532608,
              384: 270540808,
              640: 8,
              896: 2097152,
              1152: 2105352,
              1408: 268435464,
              1664: 268443648,
              1920: 8200,
              2176: 2097160,
              2432: 8192,
              2688: 268443656,
              2944: 270532616,
              3200: 0,
              3456: 270540800,
              3712: 2105344,
              3968: 268435456,
              4096: 268443648,
              4352: 270532616,
              4608: 270540808,
              4864: 8200,
              5120: 2097152,
              5376: 268435456,
              5632: 268435464,
              5888: 2105344,
              6144: 2105352,
              6400: 0,
              6656: 8,
              6912: 270532608,
              7168: 8192,
              7424: 268443656,
              7680: 270540800,
              7936: 2097160,
              4224: 8,
              4480: 2105344,
              4736: 2097152,
              4992: 268435464,
              5248: 268443648,
              5504: 8200,
              5760: 270540808,
              6016: 270532608,
              6272: 270540800,
              6528: 270532616,
              6784: 8192,
              7040: 2105352,
              7296: 2097160,
              7552: 0,
              7808: 268435456,
              8064: 268443656
            },
            {
              0: 1048576,
              16: 33555457,
              32: 1024,
              48: 1049601,
              64: 34604033,
              80: 0,
              96: 1,
              112: 34603009,
              128: 33555456,
              144: 1048577,
              160: 33554433,
              176: 34604032,
              192: 34603008,
              208: 1025,
              224: 1049600,
              240: 33554432,
              8: 34603009,
              24: 0,
              40: 33555457,
              56: 34604032,
              72: 1048576,
              88: 33554433,
              104: 33554432,
              120: 1025,
              136: 1049601,
              152: 33555456,
              168: 34603008,
              184: 1048577,
              200: 1024,
              216: 34604033,
              232: 1,
              248: 1049600,
              256: 33554432,
              272: 1048576,
              288: 33555457,
              304: 34603009,
              320: 1048577,
              336: 33555456,
              352: 34604032,
              368: 1049601,
              384: 1025,
              400: 34604033,
              416: 1049600,
              432: 1,
              448: 0,
              464: 34603008,
              480: 33554433,
              496: 1024,
              264: 1049600,
              280: 33555457,
              296: 34603009,
              312: 1,
              328: 33554432,
              344: 1048576,
              360: 1025,
              376: 34604032,
              392: 33554433,
              408: 34603008,
              424: 0,
              440: 34604033,
              456: 1049601,
              472: 1024,
              488: 33555456,
              504: 1048577
            },
            {
              0: 134219808,
              1: 131072,
              2: 134217728,
              3: 32,
              4: 131104,
              5: 134350880,
              6: 134350848,
              7: 2048,
              8: 134348800,
              9: 134219776,
              10: 133120,
              11: 134348832,
              12: 2080,
              13: 0,
              14: 134217760,
              15: 133152,
              2147483648: 2048,
              2147483649: 134350880,
              2147483650: 134219808,
              2147483651: 134217728,
              2147483652: 134348800,
              2147483653: 133120,
              2147483654: 133152,
              2147483655: 32,
              2147483656: 134217760,
              2147483657: 2080,
              2147483658: 131104,
              2147483659: 134350848,
              2147483660: 0,
              2147483661: 134348832,
              2147483662: 134219776,
              2147483663: 131072,
              16: 133152,
              17: 134350848,
              18: 32,
              19: 2048,
              20: 134219776,
              21: 134217760,
              22: 134348832,
              23: 131072,
              24: 0,
              25: 131104,
              26: 134348800,
              27: 134219808,
              28: 134350880,
              29: 133120,
              30: 2080,
              31: 134217728,
              2147483664: 131072,
              2147483665: 2048,
              2147483666: 134348832,
              2147483667: 133152,
              2147483668: 32,
              2147483669: 134348800,
              2147483670: 134217728,
              2147483671: 134219808,
              2147483672: 134350880,
              2147483673: 134217760,
              2147483674: 134219776,
              2147483675: 0,
              2147483676: 133120,
              2147483677: 2080,
              2147483678: 131104,
              2147483679: 134350848
            }
          ];
          var SBOX_MASK = [
            4160749569,
            528482304,
            33030144,
            2064384,
            129024,
            8064,
            504,
            2147483679
          ];
          var DES = C_algo.DES = BlockCipher.extend({
            _doReset: function() {
              var key = this._key;
              var keyWords = key.words;
              var keyBits = [];
              for (var i2 = 0; i2 < 56; i2++) {
                var keyBitPos = PC1[i2] - 1;
                keyBits[i2] = keyWords[keyBitPos >>> 5] >>> 31 - keyBitPos % 32 & 1;
              }
              var subKeys = this._subKeys = [];
              for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
                var subKey = subKeys[nSubKey] = [];
                var bitShift = BIT_SHIFTS[nSubKey];
                for (var i2 = 0; i2 < 24; i2++) {
                  subKey[i2 / 6 | 0] |= keyBits[(PC2[i2] - 1 + bitShift) % 28] << 31 - i2 % 6;
                  subKey[4 + (i2 / 6 | 0)] |= keyBits[28 + (PC2[i2 + 24] - 1 + bitShift) % 28] << 31 - i2 % 6;
                }
                subKey[0] = subKey[0] << 1 | subKey[0] >>> 31;
                for (var i2 = 1; i2 < 7; i2++) {
                  subKey[i2] = subKey[i2] >>> (i2 - 1) * 4 + 3;
                }
                subKey[7] = subKey[7] << 5 | subKey[7] >>> 27;
              }
              var invSubKeys = this._invSubKeys = [];
              for (var i2 = 0; i2 < 16; i2++) {
                invSubKeys[i2] = subKeys[15 - i2];
              }
            },
            encryptBlock: function(M, offset) {
              this._doCryptBlock(M, offset, this._subKeys);
            },
            decryptBlock: function(M, offset) {
              this._doCryptBlock(M, offset, this._invSubKeys);
            },
            _doCryptBlock: function(M, offset, subKeys) {
              this._lBlock = M[offset];
              this._rBlock = M[offset + 1];
              exchangeLR.call(this, 4, 252645135);
              exchangeLR.call(this, 16, 65535);
              exchangeRL.call(this, 2, 858993459);
              exchangeRL.call(this, 8, 16711935);
              exchangeLR.call(this, 1, 1431655765);
              for (var round = 0; round < 16; round++) {
                var subKey = subKeys[round];
                var lBlock = this._lBlock;
                var rBlock = this._rBlock;
                var f = 0;
                for (var i2 = 0; i2 < 8; i2++) {
                  f |= SBOX_P[i2][((rBlock ^ subKey[i2]) & SBOX_MASK[i2]) >>> 0];
                }
                this._lBlock = rBlock;
                this._rBlock = lBlock ^ f;
              }
              var t = this._lBlock;
              this._lBlock = this._rBlock;
              this._rBlock = t;
              exchangeLR.call(this, 1, 1431655765);
              exchangeRL.call(this, 8, 16711935);
              exchangeRL.call(this, 2, 858993459);
              exchangeLR.call(this, 16, 65535);
              exchangeLR.call(this, 4, 252645135);
              M[offset] = this._lBlock;
              M[offset + 1] = this._rBlock;
            },
            keySize: 64 / 32,
            ivSize: 64 / 32,
            blockSize: 64 / 32
          });
          function exchangeLR(offset, mask) {
            var t = (this._lBlock >>> offset ^ this._rBlock) & mask;
            this._rBlock ^= t;
            this._lBlock ^= t << offset;
          }
          function exchangeRL(offset, mask) {
            var t = (this._rBlock >>> offset ^ this._lBlock) & mask;
            this._lBlock ^= t;
            this._rBlock ^= t << offset;
          }
          C.DES = BlockCipher._createHelper(DES);
          var TripleDES = C_algo.TripleDES = BlockCipher.extend({
            _doReset: function() {
              var key = this._key;
              var keyWords = key.words;
              if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
                throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
              }
              var key1 = keyWords.slice(0, 2);
              var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
              var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);
              this._des1 = DES.createEncryptor(WordArray.create(key1));
              this._des2 = DES.createEncryptor(WordArray.create(key2));
              this._des3 = DES.createEncryptor(WordArray.create(key3));
            },
            encryptBlock: function(M, offset) {
              this._des1.encryptBlock(M, offset);
              this._des2.decryptBlock(M, offset);
              this._des3.encryptBlock(M, offset);
            },
            decryptBlock: function(M, offset) {
              this._des3.decryptBlock(M, offset);
              this._des2.encryptBlock(M, offset);
              this._des1.decryptBlock(M, offset);
            },
            keySize: 192 / 32,
            ivSize: 64 / 32,
            blockSize: 64 / 32
          });
          C.TripleDES = BlockCipher._createHelper(TripleDES);
        })();
        return CryptoJS.TripleDES;
      });
    }
  });

  // node_modules/crypto-js/rc4.js
  var require_rc4 = __commonJS({
    "node_modules/crypto-js/rc4.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C.algo;
          var RC4 = C_algo.RC4 = StreamCipher.extend({
            _doReset: function() {
              var key = this._key;
              var keyWords = key.words;
              var keySigBytes = key.sigBytes;
              var S = this._S = [];
              for (var i2 = 0; i2 < 256; i2++) {
                S[i2] = i2;
              }
              for (var i2 = 0, j = 0; i2 < 256; i2++) {
                var keyByteIndex = i2 % keySigBytes;
                var keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 255;
                j = (j + S[i2] + keyByte) % 256;
                var t = S[i2];
                S[i2] = S[j];
                S[j] = t;
              }
              this._i = this._j = 0;
            },
            _doProcessBlock: function(M, offset) {
              M[offset] ^= generateKeystreamWord.call(this);
            },
            keySize: 256 / 32,
            ivSize: 0
          });
          function generateKeystreamWord() {
            var S = this._S;
            var i2 = this._i;
            var j = this._j;
            var keystreamWord = 0;
            for (var n = 0; n < 4; n++) {
              i2 = (i2 + 1) % 256;
              j = (j + S[i2]) % 256;
              var t = S[i2];
              S[i2] = S[j];
              S[j] = t;
              keystreamWord |= S[(S[i2] + S[j]) % 256] << 24 - n * 8;
            }
            this._i = i2;
            this._j = j;
            return keystreamWord;
          }
          C.RC4 = StreamCipher._createHelper(RC4);
          var RC4Drop = C_algo.RC4Drop = RC4.extend({
            /**
             * Configuration options.
             *
             * @property {number} drop The number of keystream words to drop. Default 192
             */
            cfg: RC4.cfg.extend({
              drop: 192
            }),
            _doReset: function() {
              RC4._doReset.call(this);
              for (var i2 = this.cfg.drop; i2 > 0; i2--) {
                generateKeystreamWord.call(this);
              }
            }
          });
          C.RC4Drop = StreamCipher._createHelper(RC4Drop);
        })();
        return CryptoJS.RC4;
      });
    }
  });

  // node_modules/crypto-js/rabbit.js
  var require_rabbit = __commonJS({
    "node_modules/crypto-js/rabbit.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C.algo;
          var S = [];
          var C_ = [];
          var G = [];
          var Rabbit = C_algo.Rabbit = StreamCipher.extend({
            _doReset: function() {
              var K = this._key.words;
              var iv = this.cfg.iv;
              for (var i2 = 0; i2 < 4; i2++) {
                K[i2] = (K[i2] << 8 | K[i2] >>> 24) & 16711935 | (K[i2] << 24 | K[i2] >>> 8) & 4278255360;
              }
              var X = this._X = [
                K[0],
                K[3] << 16 | K[2] >>> 16,
                K[1],
                K[0] << 16 | K[3] >>> 16,
                K[2],
                K[1] << 16 | K[0] >>> 16,
                K[3],
                K[2] << 16 | K[1] >>> 16
              ];
              var C2 = this._C = [
                K[2] << 16 | K[2] >>> 16,
                K[0] & 4294901760 | K[1] & 65535,
                K[3] << 16 | K[3] >>> 16,
                K[1] & 4294901760 | K[2] & 65535,
                K[0] << 16 | K[0] >>> 16,
                K[2] & 4294901760 | K[3] & 65535,
                K[1] << 16 | K[1] >>> 16,
                K[3] & 4294901760 | K[0] & 65535
              ];
              this._b = 0;
              for (var i2 = 0; i2 < 4; i2++) {
                nextState.call(this);
              }
              for (var i2 = 0; i2 < 8; i2++) {
                C2[i2] ^= X[i2 + 4 & 7];
              }
              if (iv) {
                var IV = iv.words;
                var IV_0 = IV[0];
                var IV_1 = IV[1];
                var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
                var i22 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
                var i1 = i0 >>> 16 | i22 & 4294901760;
                var i3 = i22 << 16 | i0 & 65535;
                C2[0] ^= i0;
                C2[1] ^= i1;
                C2[2] ^= i22;
                C2[3] ^= i3;
                C2[4] ^= i0;
                C2[5] ^= i1;
                C2[6] ^= i22;
                C2[7] ^= i3;
                for (var i2 = 0; i2 < 4; i2++) {
                  nextState.call(this);
                }
              }
            },
            _doProcessBlock: function(M, offset) {
              var X = this._X;
              nextState.call(this);
              S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
              S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
              S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
              S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
              for (var i2 = 0; i2 < 4; i2++) {
                S[i2] = (S[i2] << 8 | S[i2] >>> 24) & 16711935 | (S[i2] << 24 | S[i2] >>> 8) & 4278255360;
                M[offset + i2] ^= S[i2];
              }
            },
            blockSize: 128 / 32,
            ivSize: 64 / 32
          });
          function nextState() {
            var X = this._X;
            var C2 = this._C;
            for (var i2 = 0; i2 < 8; i2++) {
              C_[i2] = C2[i2];
            }
            C2[0] = C2[0] + 1295307597 + this._b | 0;
            C2[1] = C2[1] + 3545052371 + (C2[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
            C2[2] = C2[2] + 886263092 + (C2[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
            C2[3] = C2[3] + 1295307597 + (C2[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
            C2[4] = C2[4] + 3545052371 + (C2[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
            C2[5] = C2[5] + 886263092 + (C2[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
            C2[6] = C2[6] + 1295307597 + (C2[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
            C2[7] = C2[7] + 3545052371 + (C2[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
            this._b = C2[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
            for (var i2 = 0; i2 < 8; i2++) {
              var gx = X[i2] + C2[i2];
              var ga = gx & 65535;
              var gb = gx >>> 16;
              var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
              var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
              G[i2] = gh ^ gl;
            }
            X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
            X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
            X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
            X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
            X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
            X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
            X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
            X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
          }
          C.Rabbit = StreamCipher._createHelper(Rabbit);
        })();
        return CryptoJS.Rabbit;
      });
    }
  });

  // node_modules/crypto-js/rabbit-legacy.js
  var require_rabbit_legacy = __commonJS({
    "node_modules/crypto-js/rabbit-legacy.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C.algo;
          var S = [];
          var C_ = [];
          var G = [];
          var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
            _doReset: function() {
              var K = this._key.words;
              var iv = this.cfg.iv;
              var X = this._X = [
                K[0],
                K[3] << 16 | K[2] >>> 16,
                K[1],
                K[0] << 16 | K[3] >>> 16,
                K[2],
                K[1] << 16 | K[0] >>> 16,
                K[3],
                K[2] << 16 | K[1] >>> 16
              ];
              var C2 = this._C = [
                K[2] << 16 | K[2] >>> 16,
                K[0] & 4294901760 | K[1] & 65535,
                K[3] << 16 | K[3] >>> 16,
                K[1] & 4294901760 | K[2] & 65535,
                K[0] << 16 | K[0] >>> 16,
                K[2] & 4294901760 | K[3] & 65535,
                K[1] << 16 | K[1] >>> 16,
                K[3] & 4294901760 | K[0] & 65535
              ];
              this._b = 0;
              for (var i2 = 0; i2 < 4; i2++) {
                nextState.call(this);
              }
              for (var i2 = 0; i2 < 8; i2++) {
                C2[i2] ^= X[i2 + 4 & 7];
              }
              if (iv) {
                var IV = iv.words;
                var IV_0 = IV[0];
                var IV_1 = IV[1];
                var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
                var i22 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
                var i1 = i0 >>> 16 | i22 & 4294901760;
                var i3 = i22 << 16 | i0 & 65535;
                C2[0] ^= i0;
                C2[1] ^= i1;
                C2[2] ^= i22;
                C2[3] ^= i3;
                C2[4] ^= i0;
                C2[5] ^= i1;
                C2[6] ^= i22;
                C2[7] ^= i3;
                for (var i2 = 0; i2 < 4; i2++) {
                  nextState.call(this);
                }
              }
            },
            _doProcessBlock: function(M, offset) {
              var X = this._X;
              nextState.call(this);
              S[0] = X[0] ^ X[5] >>> 16 ^ X[3] << 16;
              S[1] = X[2] ^ X[7] >>> 16 ^ X[5] << 16;
              S[2] = X[4] ^ X[1] >>> 16 ^ X[7] << 16;
              S[3] = X[6] ^ X[3] >>> 16 ^ X[1] << 16;
              for (var i2 = 0; i2 < 4; i2++) {
                S[i2] = (S[i2] << 8 | S[i2] >>> 24) & 16711935 | (S[i2] << 24 | S[i2] >>> 8) & 4278255360;
                M[offset + i2] ^= S[i2];
              }
            },
            blockSize: 128 / 32,
            ivSize: 64 / 32
          });
          function nextState() {
            var X = this._X;
            var C2 = this._C;
            for (var i2 = 0; i2 < 8; i2++) {
              C_[i2] = C2[i2];
            }
            C2[0] = C2[0] + 1295307597 + this._b | 0;
            C2[1] = C2[1] + 3545052371 + (C2[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
            C2[2] = C2[2] + 886263092 + (C2[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
            C2[3] = C2[3] + 1295307597 + (C2[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
            C2[4] = C2[4] + 3545052371 + (C2[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
            C2[5] = C2[5] + 886263092 + (C2[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
            C2[6] = C2[6] + 1295307597 + (C2[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
            C2[7] = C2[7] + 3545052371 + (C2[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
            this._b = C2[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
            for (var i2 = 0; i2 < 8; i2++) {
              var gx = X[i2] + C2[i2];
              var ga = gx & 65535;
              var gb = gx >>> 16;
              var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
              var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
              G[i2] = gh ^ gl;
            }
            X[0] = G[0] + (G[7] << 16 | G[7] >>> 16) + (G[6] << 16 | G[6] >>> 16) | 0;
            X[1] = G[1] + (G[0] << 8 | G[0] >>> 24) + G[7] | 0;
            X[2] = G[2] + (G[1] << 16 | G[1] >>> 16) + (G[0] << 16 | G[0] >>> 16) | 0;
            X[3] = G[3] + (G[2] << 8 | G[2] >>> 24) + G[1] | 0;
            X[4] = G[4] + (G[3] << 16 | G[3] >>> 16) + (G[2] << 16 | G[2] >>> 16) | 0;
            X[5] = G[5] + (G[4] << 8 | G[4] >>> 24) + G[3] | 0;
            X[6] = G[6] + (G[5] << 16 | G[5] >>> 16) + (G[4] << 16 | G[4] >>> 16) | 0;
            X[7] = G[7] + (G[6] << 8 | G[6] >>> 24) + G[5] | 0;
          }
          C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
        })();
        return CryptoJS.RabbitLegacy;
      });
    }
  });

  // node_modules/crypto-js/blowfish.js
  var require_blowfish = __commonJS({
    "node_modules/crypto-js/blowfish.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_enc_base64(), require_md5(), require_evpkdf(), require_cipher_core());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        } else {
          factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        (function() {
          var C = CryptoJS;
          var C_lib = C.lib;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C.algo;
          const N = 16;
          const ORIG_P = [
            608135816,
            2242054355,
            320440878,
            57701188,
            2752067618,
            698298832,
            137296536,
            3964562569,
            1160258022,
            953160567,
            3193202383,
            887688300,
            3232508343,
            3380367581,
            1065670069,
            3041331479,
            2450970073,
            2306472731
          ];
          const ORIG_S = [
            [
              3509652390,
              2564797868,
              805139163,
              3491422135,
              3101798381,
              1780907670,
              3128725573,
              4046225305,
              614570311,
              3012652279,
              134345442,
              2240740374,
              1667834072,
              1901547113,
              2757295779,
              4103290238,
              227898511,
              1921955416,
              1904987480,
              2182433518,
              2069144605,
              3260701109,
              2620446009,
              720527379,
              3318853667,
              677414384,
              3393288472,
              3101374703,
              2390351024,
              1614419982,
              1822297739,
              2954791486,
              3608508353,
              3174124327,
              2024746970,
              1432378464,
              3864339955,
              2857741204,
              1464375394,
              1676153920,
              1439316330,
              715854006,
              3033291828,
              289532110,
              2706671279,
              2087905683,
              3018724369,
              1668267050,
              732546397,
              1947742710,
              3462151702,
              2609353502,
              2950085171,
              1814351708,
              2050118529,
              680887927,
              999245976,
              1800124847,
              3300911131,
              1713906067,
              1641548236,
              4213287313,
              1216130144,
              1575780402,
              4018429277,
              3917837745,
              3693486850,
              3949271944,
              596196993,
              3549867205,
              258830323,
              2213823033,
              772490370,
              2760122372,
              1774776394,
              2652871518,
              566650946,
              4142492826,
              1728879713,
              2882767088,
              1783734482,
              3629395816,
              2517608232,
              2874225571,
              1861159788,
              326777828,
              3124490320,
              2130389656,
              2716951837,
              967770486,
              1724537150,
              2185432712,
              2364442137,
              1164943284,
              2105845187,
              998989502,
              3765401048,
              2244026483,
              1075463327,
              1455516326,
              1322494562,
              910128902,
              469688178,
              1117454909,
              936433444,
              3490320968,
              3675253459,
              1240580251,
              122909385,
              2157517691,
              634681816,
              4142456567,
              3825094682,
              3061402683,
              2540495037,
              79693498,
              3249098678,
              1084186820,
              1583128258,
              426386531,
              1761308591,
              1047286709,
              322548459,
              995290223,
              1845252383,
              2603652396,
              3431023940,
              2942221577,
              3202600964,
              3727903485,
              1712269319,
              422464435,
              3234572375,
              1170764815,
              3523960633,
              3117677531,
              1434042557,
              442511882,
              3600875718,
              1076654713,
              1738483198,
              4213154764,
              2393238008,
              3677496056,
              1014306527,
              4251020053,
              793779912,
              2902807211,
              842905082,
              4246964064,
              1395751752,
              1040244610,
              2656851899,
              3396308128,
              445077038,
              3742853595,
              3577915638,
              679411651,
              2892444358,
              2354009459,
              1767581616,
              3150600392,
              3791627101,
              3102740896,
              284835224,
              4246832056,
              1258075500,
              768725851,
              2589189241,
              3069724005,
              3532540348,
              1274779536,
              3789419226,
              2764799539,
              1660621633,
              3471099624,
              4011903706,
              913787905,
              3497959166,
              737222580,
              2514213453,
              2928710040,
              3937242737,
              1804850592,
              3499020752,
              2949064160,
              2386320175,
              2390070455,
              2415321851,
              4061277028,
              2290661394,
              2416832540,
              1336762016,
              1754252060,
              3520065937,
              3014181293,
              791618072,
              3188594551,
              3933548030,
              2332172193,
              3852520463,
              3043980520,
              413987798,
              3465142937,
              3030929376,
              4245938359,
              2093235073,
              3534596313,
              375366246,
              2157278981,
              2479649556,
              555357303,
              3870105701,
              2008414854,
              3344188149,
              4221384143,
              3956125452,
              2067696032,
              3594591187,
              2921233993,
              2428461,
              544322398,
              577241275,
              1471733935,
              610547355,
              4027169054,
              1432588573,
              1507829418,
              2025931657,
              3646575487,
              545086370,
              48609733,
              2200306550,
              1653985193,
              298326376,
              1316178497,
              3007786442,
              2064951626,
              458293330,
              2589141269,
              3591329599,
              3164325604,
              727753846,
              2179363840,
              146436021,
              1461446943,
              4069977195,
              705550613,
              3059967265,
              3887724982,
              4281599278,
              3313849956,
              1404054877,
              2845806497,
              146425753,
              1854211946
            ],
            [
              1266315497,
              3048417604,
              3681880366,
              3289982499,
              290971e4,
              1235738493,
              2632868024,
              2414719590,
              3970600049,
              1771706367,
              1449415276,
              3266420449,
              422970021,
              1963543593,
              2690192192,
              3826793022,
              1062508698,
              1531092325,
              1804592342,
              2583117782,
              2714934279,
              4024971509,
              1294809318,
              4028980673,
              1289560198,
              2221992742,
              1669523910,
              35572830,
              157838143,
              1052438473,
              1016535060,
              1802137761,
              1753167236,
              1386275462,
              3080475397,
              2857371447,
              1040679964,
              2145300060,
              2390574316,
              1461121720,
              2956646967,
              4031777805,
              4028374788,
              33600511,
              2920084762,
              1018524850,
              629373528,
              3691585981,
              3515945977,
              2091462646,
              2486323059,
              586499841,
              988145025,
              935516892,
              3367335476,
              2599673255,
              2839830854,
              265290510,
              3972581182,
              2759138881,
              3795373465,
              1005194799,
              847297441,
              406762289,
              1314163512,
              1332590856,
              1866599683,
              4127851711,
              750260880,
              613907577,
              1450815602,
              3165620655,
              3734664991,
              3650291728,
              3012275730,
              3704569646,
              1427272223,
              778793252,
              1343938022,
              2676280711,
              2052605720,
              1946737175,
              3164576444,
              3914038668,
              3967478842,
              3682934266,
              1661551462,
              3294938066,
              4011595847,
              840292616,
              3712170807,
              616741398,
              312560963,
              711312465,
              1351876610,
              322626781,
              1910503582,
              271666773,
              2175563734,
              1594956187,
              70604529,
              3617834859,
              1007753275,
              1495573769,
              4069517037,
              2549218298,
              2663038764,
              504708206,
              2263041392,
              3941167025,
              2249088522,
              1514023603,
              1998579484,
              1312622330,
              694541497,
              2582060303,
              2151582166,
              1382467621,
              776784248,
              2618340202,
              3323268794,
              2497899128,
              2784771155,
              503983604,
              4076293799,
              907881277,
              423175695,
              432175456,
              1378068232,
              4145222326,
              3954048622,
              3938656102,
              3820766613,
              2793130115,
              2977904593,
              26017576,
              3274890735,
              3194772133,
              1700274565,
              1756076034,
              4006520079,
              3677328699,
              720338349,
              1533947780,
              354530856,
              688349552,
              3973924725,
              1637815568,
              332179504,
              3949051286,
              53804574,
              2852348879,
              3044236432,
              1282449977,
              3583942155,
              3416972820,
              4006381244,
              1617046695,
              2628476075,
              3002303598,
              1686838959,
              431878346,
              2686675385,
              1700445008,
              1080580658,
              1009431731,
              832498133,
              3223435511,
              2605976345,
              2271191193,
              2516031870,
              1648197032,
              4164389018,
              2548247927,
              300782431,
              375919233,
              238389289,
              3353747414,
              2531188641,
              2019080857,
              1475708069,
              455242339,
              2609103871,
              448939670,
              3451063019,
              1395535956,
              2413381860,
              1841049896,
              1491858159,
              885456874,
              4264095073,
              4001119347,
              1565136089,
              3898914787,
              1108368660,
              540939232,
              1173283510,
              2745871338,
              3681308437,
              4207628240,
              3343053890,
              4016749493,
              1699691293,
              1103962373,
              3625875870,
              2256883143,
              3830138730,
              1031889488,
              3479347698,
              1535977030,
              4236805024,
              3251091107,
              2132092099,
              1774941330,
              1199868427,
              1452454533,
              157007616,
              2904115357,
              342012276,
              595725824,
              1480756522,
              206960106,
              497939518,
              591360097,
              863170706,
              2375253569,
              3596610801,
              1814182875,
              2094937945,
              3421402208,
              1082520231,
              3463918190,
              2785509508,
              435703966,
              3908032597,
              1641649973,
              2842273706,
              3305899714,
              1510255612,
              2148256476,
              2655287854,
              3276092548,
              4258621189,
              236887753,
              3681803219,
              274041037,
              1734335097,
              3815195456,
              3317970021,
              1899903192,
              1026095262,
              4050517792,
              356393447,
              2410691914,
              3873677099,
              3682840055
            ],
            [
              3913112168,
              2491498743,
              4132185628,
              2489919796,
              1091903735,
              1979897079,
              3170134830,
              3567386728,
              3557303409,
              857797738,
              1136121015,
              1342202287,
              507115054,
              2535736646,
              337727348,
              3213592640,
              1301675037,
              2528481711,
              1895095763,
              1721773893,
              3216771564,
              62756741,
              2142006736,
              835421444,
              2531993523,
              1442658625,
              3659876326,
              2882144922,
              676362277,
              1392781812,
              170690266,
              3921047035,
              1759253602,
              3611846912,
              1745797284,
              664899054,
              1329594018,
              3901205900,
              3045908486,
              2062866102,
              2865634940,
              3543621612,
              3464012697,
              1080764994,
              553557557,
              3656615353,
              3996768171,
              991055499,
              499776247,
              1265440854,
              648242737,
              3940784050,
              980351604,
              3713745714,
              1749149687,
              3396870395,
              4211799374,
              3640570775,
              1161844396,
              3125318951,
              1431517754,
              545492359,
              4268468663,
              3499529547,
              1437099964,
              2702547544,
              3433638243,
              2581715763,
              2787789398,
              1060185593,
              1593081372,
              2418618748,
              4260947970,
              69676912,
              2159744348,
              86519011,
              2512459080,
              3838209314,
              1220612927,
              3339683548,
              133810670,
              1090789135,
              1078426020,
              1569222167,
              845107691,
              3583754449,
              4072456591,
              1091646820,
              628848692,
              1613405280,
              3757631651,
              526609435,
              236106946,
              48312990,
              2942717905,
              3402727701,
              1797494240,
              859738849,
              992217954,
              4005476642,
              2243076622,
              3870952857,
              3732016268,
              765654824,
              3490871365,
              2511836413,
              1685915746,
              3888969200,
              1414112111,
              2273134842,
              3281911079,
              4080962846,
              172450625,
              2569994100,
              980381355,
              4109958455,
              2819808352,
              2716589560,
              2568741196,
              3681446669,
              3329971472,
              1835478071,
              660984891,
              3704678404,
              4045999559,
              3422617507,
              3040415634,
              1762651403,
              1719377915,
              3470491036,
              2693910283,
              3642056355,
              3138596744,
              1364962596,
              2073328063,
              1983633131,
              926494387,
              3423689081,
              2150032023,
              4096667949,
              1749200295,
              3328846651,
              309677260,
              2016342300,
              1779581495,
              3079819751,
              111262694,
              1274766160,
              443224088,
              298511866,
              1025883608,
              3806446537,
              1145181785,
              168956806,
              3641502830,
              3584813610,
              1689216846,
              3666258015,
              3200248200,
              1692713982,
              2646376535,
              4042768518,
              1618508792,
              1610833997,
              3523052358,
              4130873264,
              2001055236,
              3610705100,
              2202168115,
              4028541809,
              2961195399,
              1006657119,
              2006996926,
              3186142756,
              1430667929,
              3210227297,
              1314452623,
              4074634658,
              4101304120,
              2273951170,
              1399257539,
              3367210612,
              3027628629,
              1190975929,
              2062231137,
              2333990788,
              2221543033,
              2438960610,
              1181637006,
              548689776,
              2362791313,
              3372408396,
              3104550113,
              3145860560,
              296247880,
              1970579870,
              3078560182,
              3769228297,
              1714227617,
              3291629107,
              3898220290,
              166772364,
              1251581989,
              493813264,
              448347421,
              195405023,
              2709975567,
              677966185,
              3703036547,
              1463355134,
              2715995803,
              1338867538,
              1343315457,
              2802222074,
              2684532164,
              233230375,
              2599980071,
              2000651841,
              3277868038,
              1638401717,
              4028070440,
              3237316320,
              6314154,
              819756386,
              300326615,
              590932579,
              1405279636,
              3267499572,
              3150704214,
              2428286686,
              3959192993,
              3461946742,
              1862657033,
              1266418056,
              963775037,
              2089974820,
              2263052895,
              1917689273,
              448879540,
              3550394620,
              3981727096,
              150775221,
              3627908307,
              1303187396,
              508620638,
              2975983352,
              2726630617,
              1817252668,
              1876281319,
              1457606340,
              908771278,
              3720792119,
              3617206836,
              2455994898,
              1729034894,
              1080033504
            ],
            [
              976866871,
              3556439503,
              2881648439,
              1522871579,
              1555064734,
              1336096578,
              3548522304,
              2579274686,
              3574697629,
              3205460757,
              3593280638,
              3338716283,
              3079412587,
              564236357,
              2993598910,
              1781952180,
              1464380207,
              3163844217,
              3332601554,
              1699332808,
              1393555694,
              1183702653,
              3581086237,
              1288719814,
              691649499,
              2847557200,
              2895455976,
              3193889540,
              2717570544,
              1781354906,
              1676643554,
              2592534050,
              3230253752,
              1126444790,
              2770207658,
              2633158820,
              2210423226,
              2615765581,
              2414155088,
              3127139286,
              673620729,
              2805611233,
              1269405062,
              4015350505,
              3341807571,
              4149409754,
              1057255273,
              2012875353,
              2162469141,
              2276492801,
              2601117357,
              993977747,
              3918593370,
              2654263191,
              753973209,
              36408145,
              2530585658,
              25011837,
              3520020182,
              2088578344,
              530523599,
              2918365339,
              1524020338,
              1518925132,
              3760827505,
              3759777254,
              1202760957,
              3985898139,
              3906192525,
              674977740,
              4174734889,
              2031300136,
              2019492241,
              3983892565,
              4153806404,
              3822280332,
              352677332,
              2297720250,
              60907813,
              90501309,
              3286998549,
              1016092578,
              2535922412,
              2839152426,
              457141659,
              509813237,
              4120667899,
              652014361,
              1966332200,
              2975202805,
              55981186,
              2327461051,
              676427537,
              3255491064,
              2882294119,
              3433927263,
              1307055953,
              942726286,
              933058658,
              2468411793,
              3933900994,
              4215176142,
              1361170020,
              2001714738,
              2830558078,
              3274259782,
              1222529897,
              1679025792,
              2729314320,
              3714953764,
              1770335741,
              151462246,
              3013232138,
              1682292957,
              1483529935,
              471910574,
              1539241949,
              458788160,
              3436315007,
              1807016891,
              3718408830,
              978976581,
              1043663428,
              3165965781,
              1927990952,
              4200891579,
              2372276910,
              3208408903,
              3533431907,
              1412390302,
              2931980059,
              4132332400,
              1947078029,
              3881505623,
              4168226417,
              2941484381,
              1077988104,
              1320477388,
              886195818,
              18198404,
              3786409e3,
              2509781533,
              112762804,
              3463356488,
              1866414978,
              891333506,
              18488651,
              661792760,
              1628790961,
              3885187036,
              3141171499,
              876946877,
              2693282273,
              1372485963,
              791857591,
              2686433993,
              3759982718,
              3167212022,
              3472953795,
              2716379847,
              445679433,
              3561995674,
              3504004811,
              3574258232,
              54117162,
              3331405415,
              2381918588,
              3769707343,
              4154350007,
              1140177722,
              4074052095,
              668550556,
              3214352940,
              367459370,
              261225585,
              2610173221,
              4209349473,
              3468074219,
              3265815641,
              314222801,
              3066103646,
              3808782860,
              282218597,
              3406013506,
              3773591054,
              379116347,
              1285071038,
              846784868,
              2669647154,
              3771962079,
              3550491691,
              2305946142,
              453669953,
              1268987020,
              3317592352,
              3279303384,
              3744833421,
              2610507566,
              3859509063,
              266596637,
              3847019092,
              517658769,
              3462560207,
              3443424879,
              370717030,
              4247526661,
              2224018117,
              4143653529,
              4112773975,
              2788324899,
              2477274417,
              1456262402,
              2901442914,
              1517677493,
              1846949527,
              2295493580,
              3734397586,
              2176403920,
              1280348187,
              1908823572,
              3871786941,
              846861322,
              1172426758,
              3287448474,
              3383383037,
              1655181056,
              3139813346,
              901632758,
              1897031941,
              2986607138,
              3066810236,
              3447102507,
              1393639104,
              373351379,
              950779232,
              625454576,
              3124240540,
              4148612726,
              2007998917,
              544563296,
              2244738638,
              2330496472,
              2058025392,
              1291430526,
              424198748,
              50039436,
              29584100,
              3605783033,
              2429876329,
              2791104160,
              1057563949,
              3255363231,
              3075367218,
              3463963227,
              1469046755,
              985887462
            ]
          ];
          var BLOWFISH_CTX = {
            pbox: [],
            sbox: []
          };
          function F(ctx, x) {
            let a = x >> 24 & 255;
            let b = x >> 16 & 255;
            let c = x >> 8 & 255;
            let d = x & 255;
            let y = ctx.sbox[0][a] + ctx.sbox[1][b];
            y = y ^ ctx.sbox[2][c];
            y = y + ctx.sbox[3][d];
            return y;
          }
          function BlowFish_Encrypt(ctx, left, right) {
            let Xl = left;
            let Xr = right;
            let temp;
            for (let i2 = 0; i2 < N; ++i2) {
              Xl = Xl ^ ctx.pbox[i2];
              Xr = F(ctx, Xl) ^ Xr;
              temp = Xl;
              Xl = Xr;
              Xr = temp;
            }
            temp = Xl;
            Xl = Xr;
            Xr = temp;
            Xr = Xr ^ ctx.pbox[N];
            Xl = Xl ^ ctx.pbox[N + 1];
            return { left: Xl, right: Xr };
          }
          function BlowFish_Decrypt(ctx, left, right) {
            let Xl = left;
            let Xr = right;
            let temp;
            for (let i2 = N + 1; i2 > 1; --i2) {
              Xl = Xl ^ ctx.pbox[i2];
              Xr = F(ctx, Xl) ^ Xr;
              temp = Xl;
              Xl = Xr;
              Xr = temp;
            }
            temp = Xl;
            Xl = Xr;
            Xr = temp;
            Xr = Xr ^ ctx.pbox[1];
            Xl = Xl ^ ctx.pbox[0];
            return { left: Xl, right: Xr };
          }
          function BlowFishInit(ctx, key, keysize) {
            for (let Row = 0; Row < 4; Row++) {
              ctx.sbox[Row] = [];
              for (let Col = 0; Col < 256; Col++) {
                ctx.sbox[Row][Col] = ORIG_S[Row][Col];
              }
            }
            let keyIndex = 0;
            for (let index = 0; index < N + 2; index++) {
              ctx.pbox[index] = ORIG_P[index] ^ key[keyIndex];
              keyIndex++;
              if (keyIndex >= keysize) {
                keyIndex = 0;
              }
            }
            let Data1 = 0;
            let Data2 = 0;
            let res = 0;
            for (let i2 = 0; i2 < N + 2; i2 += 2) {
              res = BlowFish_Encrypt(ctx, Data1, Data2);
              Data1 = res.left;
              Data2 = res.right;
              ctx.pbox[i2] = Data1;
              ctx.pbox[i2 + 1] = Data2;
            }
            for (let i2 = 0; i2 < 4; i2++) {
              for (let j = 0; j < 256; j += 2) {
                res = BlowFish_Encrypt(ctx, Data1, Data2);
                Data1 = res.left;
                Data2 = res.right;
                ctx.sbox[i2][j] = Data1;
                ctx.sbox[i2][j + 1] = Data2;
              }
            }
            return true;
          }
          var Blowfish = C_algo.Blowfish = BlockCipher.extend({
            _doReset: function() {
              if (this._keyPriorReset === this._key) {
                return;
              }
              var key = this._keyPriorReset = this._key;
              var keyWords = key.words;
              var keySize = key.sigBytes / 4;
              BlowFishInit(BLOWFISH_CTX, keyWords, keySize);
            },
            encryptBlock: function(M, offset) {
              var res = BlowFish_Encrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
              M[offset] = res.left;
              M[offset + 1] = res.right;
            },
            decryptBlock: function(M, offset) {
              var res = BlowFish_Decrypt(BLOWFISH_CTX, M[offset], M[offset + 1]);
              M[offset] = res.left;
              M[offset + 1] = res.right;
            },
            blockSize: 64 / 32,
            keySize: 128 / 32,
            ivSize: 64 / 32
          });
          C.Blowfish = BlockCipher._createHelper(Blowfish);
        })();
        return CryptoJS.Blowfish;
      });
    }
  });

  // node_modules/crypto-js/index.js
  var require_crypto_js = __commonJS({
    "node_modules/crypto-js/index.js"(exports, module) {
      (function(root, factory, undef) {
        if (typeof exports === "object") {
          module.exports = exports = factory(require_core(), require_x64_core(), require_lib_typedarrays(), require_enc_utf16(), require_enc_base64(), require_enc_base64url(), require_md5(), require_sha1(), require_sha256(), require_sha224(), require_sha512(), require_sha384(), require_sha3(), require_ripemd160(), require_hmac(), require_pbkdf2(), require_evpkdf(), require_cipher_core(), require_mode_cfb(), require_mode_ctr(), require_mode_ctr_gladman(), require_mode_ofb(), require_mode_ecb(), require_pad_ansix923(), require_pad_iso10126(), require_pad_iso97971(), require_pad_zeropadding(), require_pad_nopadding(), require_format_hex(), require_aes(), require_tripledes(), require_rc4(), require_rabbit(), require_rabbit_legacy(), require_blowfish());
        } else if (typeof define === "function" && define.amd) {
          define(["./core", "./x64-core", "./lib-typedarrays", "./enc-utf16", "./enc-base64", "./enc-base64url", "./md5", "./sha1", "./sha256", "./sha224", "./sha512", "./sha384", "./sha3", "./ripemd160", "./hmac", "./pbkdf2", "./evpkdf", "./cipher-core", "./mode-cfb", "./mode-ctr", "./mode-ctr-gladman", "./mode-ofb", "./mode-ecb", "./pad-ansix923", "./pad-iso10126", "./pad-iso97971", "./pad-zeropadding", "./pad-nopadding", "./format-hex", "./aes", "./tripledes", "./rc4", "./rabbit", "./rabbit-legacy", "./blowfish"], factory);
        } else {
          root.CryptoJS = factory(root.CryptoJS);
        }
      })(exports, function(CryptoJS) {
        return CryptoJS;
      });
    }
  });

  // node_modules/lodash.memoize/index.js
  var require_lodash = __commonJS({
    "node_modules/lodash.memoize/index.js"(exports, module) {
      var FUNC_ERROR_TEXT = "Expected a function";
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      var funcTag = "[object Function]";
      var genTag = "[object GeneratorFunction]";
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      function getValue(object, key) {
        return object == null ? void 0 : object[key];
      }
      function isHostObject(value) {
        var result2 = false;
        if (value != null && typeof value.toString != "function") {
          try {
            result2 = !!(value + "");
          } catch (e) {
          }
        }
        return result2;
      }
      var arrayProto = Array.prototype;
      var funcProto = Function.prototype;
      var objectProto = Object.prototype;
      var coreJsData = root["__core-js_shared__"];
      var maskSrcKey = function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      }();
      var funcToString = funcProto.toString;
      var hasOwnProperty = objectProto.hasOwnProperty;
      var objectToString = objectProto.toString;
      var reIsNative = RegExp(
        "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      );
      var splice = arrayProto.splice;
      var Map = getNative(root, "Map");
      var nativeCreate = getNative(Object, "create");
      function Hash(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
      }
      function hashDelete(key) {
        return this.has(key) && delete this.__data__[key];
      }
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result2 = data[key];
          return result2 === HASH_UNDEFINED ? void 0 : result2;
        }
        return hasOwnProperty.call(data, key) ? data[key] : void 0;
      }
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
      }
      function hashSet(key, value) {
        var data = this.__data__;
        data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
        return this;
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype["delete"] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function ListCache(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function listCacheClear() {
        this.__data__ = [];
      }
      function listCacheDelete(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }
        return true;
      }
      function listCacheGet(key) {
        var data = this.__data__, index = assocIndexOf(data, key);
        return index < 0 ? void 0 : data[index][1];
      }
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }
      function listCacheSet(key, value) {
        var data = this.__data__, index = assocIndexOf(data, key);
        if (index < 0) {
          data.push([key, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype["delete"] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      function MapCache(entries) {
        var index = -1, length = entries ? entries.length : 0;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      function mapCacheClear() {
        this.__data__ = {
          "hash": new Hash(),
          "map": new (Map || ListCache)(),
          "string": new Hash()
        };
      }
      function mapCacheDelete(key) {
        return getMapData(this, key)["delete"](key);
      }
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }
      function mapCacheSet(key, value) {
        getMapData(this, key).set(key, value);
        return this;
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype["delete"] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      function assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function getMapData(map, key) {
        var data = map.__data__;
        return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
      }
      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : void 0;
      }
      function isKeyable(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e) {
          }
          try {
            return func + "";
          } catch (e) {
          }
        }
        return "";
      }
      function memoize(func, resolver) {
        if (typeof func != "function" || resolver && typeof resolver != "function") {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        var memoized = function() {
          var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
          if (cache.has(key)) {
            return cache.get(key);
          }
          var result2 = func.apply(this, args);
          memoized.cache = cache.set(key, result2);
          return result2;
        };
        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }
      memoize.Cache = MapCache;
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      function isFunction(value) {
        var tag = isObject(value) ? objectToString.call(value) : "";
        return tag == funcTag || tag == genTag;
      }
      function isObject(value) {
        var type = typeof value;
        return !!value && (type == "object" || type == "function");
      }
      module.exports = memoize;
    }
  });

  // node_modules/get-user-locale/dist/umd/index.js
  var require_umd = __commonJS({
    "node_modules/get-user-locale/dist/umd/index.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.getUserLocales = exports.getUserLocale = exports["default"] = void 0;
      var _lodash = _interopRequireDefault(require_lodash());
      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { "default": obj };
      }
      function resolver(options) {
        return JSON.stringify(options);
      }
      function uniqDefined(arr) {
        return arr.filter(function(el, index) {
          return el && arr.indexOf(el) === index;
        });
      }
      function normalizeLocales(arr) {
        return arr.map(function(el) {
          if (!el || el.indexOf("-") === -1 || el.toLowerCase() !== el) {
            return el;
          }
          var splitEl = el.split("-");
          return splitEl[0] + "-" + splitEl[1].toUpperCase();
        });
      }
      function getUserLocalesInternal(_temp) {
        var _ref = _temp === void 0 ? {} : _temp, _ref$useFallbackLocal = _ref.useFallbackLocale, useFallbackLocale = _ref$useFallbackLocal === void 0 ? true : _ref$useFallbackLocal, _ref$fallbackLocale = _ref.fallbackLocale, fallbackLocale = _ref$fallbackLocale === void 0 ? "en-US" : _ref$fallbackLocale;
        var languageList = [];
        if (typeof window !== "undefined") {
          var _window = window, navigator2 = _window.navigator;
          languageList = languageList.concat(navigator2.languages, navigator2.language, navigator2.userLanguage, navigator2.browserLanguage, navigator2.systemLanguage);
        }
        if (useFallbackLocale) {
          languageList.push(fallbackLocale);
        }
        return normalizeLocales(uniqDefined(languageList));
      }
      var getUserLocales = (0, _lodash["default"])(getUserLocalesInternal, resolver);
      exports.getUserLocales = getUserLocales;
      function getUserLocaleInternal(options) {
        return getUserLocales(options)[0] || null;
      }
      var getUserLocale = (0, _lodash["default"])(getUserLocaleInternal, resolver);
      exports.getUserLocale = getUserLocale;
      var _default = getUserLocale;
      exports["default"] = _default;
    }
  });

  // shims/form-data.js
  var require_form_data = __commonJS({
    "shims/form-data.js"(exports, module) {
      module.exports = typeof FormData !== "undefined" ? FormData : function FormData2() {
      };
    }
  });

  // node_modules/base64-js/index.js
  var require_base64_js = __commonJS({
    "node_modules/base64-js/index.js"(exports) {
      "use strict";
      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i2 = 0, len = code.length; i2 < len; ++i2) {
        lookup[i2] = code[i2];
        revLookup[code.charCodeAt(i2)] = i2;
      }
      var i2;
      var len;
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1) validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i3;
        for (i3 = 0; i3 < len2; i3 += 4) {
          tmp = revLookup[b64.charCodeAt(i3)] << 18 | revLookup[b64.charCodeAt(i3 + 1)] << 12 | revLookup[b64.charCodeAt(i3 + 2)] << 6 | revLookup[b64.charCodeAt(i3 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i3)] << 2 | revLookup[b64.charCodeAt(i3 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i3)] << 10 | revLookup[b64.charCodeAt(i3 + 1)] << 4 | revLookup[b64.charCodeAt(i3 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i3 = start; i3 < end; i3 += 3) {
          tmp = (uint8[i3] << 16 & 16711680) + (uint8[i3 + 1] << 8 & 65280) + (uint8[i3 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i3 = 0, len22 = len2 - extraBytes; i3 < len22; i3 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i3, i3 + maxChunkLength > len22 ? len22 : i3 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
          );
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
          );
        }
        return parts.join("");
      }
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      exports.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i2 = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i2];
        i2 += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i2], i2 += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i2], i2 += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i2 = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i2] = m & 255, i2 += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i2] = e & 255, i2 += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i2 - d] |= s * 128;
      };
    }
  });

  // node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "node_modules/buffer/index.js"(exports) {
      "use strict";
      var base64 = require_base64_js();
      var ieee754 = require_ieee754();
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer2;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new Uint8Array(1);
          const proto = { foo: function() {
            return 42;
          } };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      Object.defineProperty(Buffer2.prototype, "parent", {
        enumerable: true,
        get: function() {
          if (!Buffer2.isBuffer(this)) return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer2.prototype, "offset", {
        enumerable: true,
        get: function() {
          if (!Buffer2.isBuffer(this)) return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf = new Uint8Array(length);
        Object.setPrototypeOf(buf, Buffer2.prototype);
        return buf;
      }
      function Buffer2(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      Buffer2.poolSize = 8192;
      function from(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
          );
        }
        if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer2.from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value);
        if (b) return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      Buffer2.from = function(value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer2, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      Buffer2.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      Buffer2.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer2.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength(string, encoding) | 0;
        let buf = createBuffer(length);
        const actual = buf.write(string, encoding);
        if (actual !== length) {
          buf = buf.slice(0, actual);
        }
        return buf;
      }
      function fromArrayLike(array) {
        const length = array.length < 0 ? 0 : checked(array.length) | 0;
        const buf = createBuffer(length);
        for (let i2 = 0; i2 < length; i2 += 1) {
          buf[i2] = array[i2] & 255;
        }
        return buf;
      }
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
          const copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf;
        if (byteOffset === void 0 && length === void 0) {
          buf = new Uint8Array(array);
        } else if (length === void 0) {
          buf = new Uint8Array(array, byteOffset);
        } else {
          buf = new Uint8Array(array, byteOffset, length);
        }
        Object.setPrototypeOf(buf, Buffer2.prototype);
        return buf;
      }
      function fromObject(obj) {
        if (Buffer2.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf = createBuffer(len);
          if (buf.length === 0) {
            return buf;
          }
          obj.copy(buf, 0, 0, len);
          return buf;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer2.alloc(+length);
      }
      Buffer2.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer2.prototype;
      };
      Buffer2.compare = function compare(a, b) {
        if (isInstance(a, Uint8Array)) a = Buffer2.from(a, a.offset, a.byteLength);
        if (isInstance(b, Uint8Array)) b = Buffer2.from(b, b.offset, b.byteLength);
        if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b) return 0;
        let x = a.length;
        let y = b.length;
        for (let i2 = 0, len = Math.min(x, y); i2 < len; ++i2) {
          if (a[i2] !== b[i2]) {
            x = a[i2];
            y = b[i2];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer2.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      Buffer2.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer2.alloc(0);
        }
        let i2;
        if (length === void 0) {
          length = 0;
          for (i2 = 0; i2 < list.length; ++i2) {
            length += list[i2].length;
          }
        }
        const buffer = Buffer2.allocUnsafe(length);
        let pos = 0;
        for (i2 = 0; i2 < list.length; ++i2) {
          let buf = list[i2];
          if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
              if (!Buffer2.isBuffer(buf)) buf = Buffer2.from(buf);
              buf.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(
                buffer,
                buf,
                pos
              );
            }
          } else if (!Buffer2.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf.copy(buffer, pos);
          }
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer2.isBuffer(string)) {
          return string.length;
        }
        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
          );
        }
        const len = string.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0) return 0;
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer2.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding) encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer2.prototype._isBuffer = true;
      function swap(b, n, m) {
        const i2 = b[n];
        b[n] = b[m];
        b[m] = i2;
      }
      Buffer2.prototype.swap16 = function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i2 = 0; i2 < len; i2 += 2) {
          swap(this, i2, i2 + 1);
        }
        return this;
      };
      Buffer2.prototype.swap32 = function swap32() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i2 = 0; i2 < len; i2 += 4) {
          swap(this, i2, i2 + 3);
          swap(this, i2 + 1, i2 + 2);
        }
        return this;
      };
      Buffer2.prototype.swap64 = function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i2 = 0; i2 < len; i2 += 8) {
          swap(this, i2, i2 + 7);
          swap(this, i2 + 1, i2 + 6);
          swap(this, i2 + 2, i2 + 5);
          swap(this, i2 + 3, i2 + 4);
        }
        return this;
      };
      Buffer2.prototype.toString = function toString() {
        const length = this.length;
        if (length === 0) return "";
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
      Buffer2.prototype.equals = function equals(b) {
        if (!Buffer2.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return Buffer2.compare(this, b) === 0;
      };
      Buffer2.prototype.inspect = function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max) str += " ... ";
        return "<Buffer " + str + ">";
      };
      if (customInspectSymbol) {
        Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
      }
      Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer2.from(target, target.offset, target.byteLength);
        }
        if (!Buffer2.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i2 = 0; i2 < len; ++i2) {
          if (thisCopy[i2] !== targetCopy[i2]) {
            x = thisCopy[i2];
            y = targetCopy[i2];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0) return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0;
          else return -1;
        }
        if (typeof val === "string") {
          val = Buffer2.from(val, encoding);
        }
        if (Buffer2.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i3) {
          if (indexSize === 1) {
            return buf[i3];
          } else {
            return buf.readUInt16BE(i3 * indexSize);
          }
        }
        let i2;
        if (dir) {
          let foundIndex = -1;
          for (i2 = byteOffset; i2 < arrLength; i2++) {
            if (read(arr, i2) === read(val, foundIndex === -1 ? 0 : i2 - foundIndex)) {
              if (foundIndex === -1) foundIndex = i2;
              if (i2 - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i2 -= i2 - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
          for (i2 = byteOffset; i2 >= 0; i2--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
              if (read(arr, i2 + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found) return i2;
          }
        }
        return -1;
      }
      Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };
      Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i2;
        for (i2 = 0; i2 < length; ++i2) {
          const parsed = parseInt(string.substr(i2 * 2, 2), 16);
          if (numberIsNaN(parsed)) return i2;
          buf[offset + i2] = parsed;
        }
        return i2;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer2.prototype.write = function write(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0) encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining) length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding) encoding = "utf8";
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };
      Buffer2.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        const res = [];
        let i2 = start;
        while (i2 < end) {
          const firstByte = buf[i2];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i2 + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i2 + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i2 + 1];
                thirdByte = buf[i2 + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i2 + 1];
                thirdByte = buf[i2 + 2];
                fourthByte = buf[i2 + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i2 += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i2 = 0;
        while (i2 < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i2, i2 += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      function asciiSlice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i2 = start; i2 < end; ++i2) {
          ret += String.fromCharCode(buf[i2] & 127);
        }
        return ret;
      }
      function latin1Slice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i2 = start; i2 < end; ++i2) {
          ret += String.fromCharCode(buf[i2]);
        }
        return ret;
      }
      function hexSlice(buf, start, end) {
        const len = buf.length;
        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;
        let out = "";
        for (let i2 = start; i2 < end; ++i2) {
          out += hexSliceLookupTable[buf[i2]];
        }
        return out;
      }
      function utf16leSlice(buf, start, end) {
        const bytes = buf.slice(start, end);
        let res = "";
        for (let i2 = 0; i2 < bytes.length - 1; i2 += 2) {
          res += String.fromCharCode(bytes[i2] + bytes[i2 + 1] * 256);
        }
        return res;
      }
      Buffer2.prototype.slice = function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start) end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer2.prototype);
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i2 = 0;
        while (++i2 < byteLength2 && (mul *= 256)) {
          val += this[offset + i2] * mul;
        }
        return val;
      };
      Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length);
        }
        let val = this[offset + --byteLength2];
        let mul = 1;
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul;
        }
        return val;
      };
      Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      };
      Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer2.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      });
      Buffer2.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      });
      Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i2 = 0;
        while (++i2 < byteLength2 && (mul *= 256)) {
          val += this[offset + i2] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let i2 = byteLength2;
        let mul = 1;
        let val = this[offset + --i2];
        while (i2 > 0 && (mul *= 256)) {
          val += this[offset + --i2] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128)) return this[offset];
        return (255 - this[offset] + 1) * -1;
      };
      Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer2.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      });
      Buffer2.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first << 24) + // Overflow
        this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      });
      Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer2.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let mul = 1;
        let i2 = 0;
        this[offset] = value & 255;
        while (++i2 < byteLength2 && (mul *= 256)) {
          this[offset + i2] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let i2 = byteLength2 - 1;
        let mul = 1;
        this[offset + i2] = value & 255;
        while (--i2 >= 0 && (mul *= 256)) {
          this[offset + i2] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      };
      Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      function wrtBigUInt64LE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        return offset;
      }
      function wrtBigUInt64BE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset + 7] = lo;
        lo = lo >> 8;
        buf[offset + 6] = lo;
        lo = lo >> 8;
        buf[offset + 5] = lo;
        lo = lo >> 8;
        buf[offset + 4] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset + 3] = hi;
        hi = hi >> 8;
        buf[offset + 2] = hi;
        hi = hi >> 8;
        buf[offset + 1] = hi;
        hi = hi >> 8;
        buf[offset] = hi;
        return offset + 8;
      }
      Buffer2.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer2.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i2 = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value & 255;
        while (++i2 < byteLength2 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i2 - 1] !== 0) {
            sub = 1;
          }
          this[offset + i2] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i2 = byteLength2 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i2] = value & 255;
        while (--i2 >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i2 + 1] !== 0) {
            sub = 1;
          }
          this[offset + i2] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
        if (value < 0) value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      };
      Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0) value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      Buffer2.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      Buffer2.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer2.isBuffer(target)) throw new TypeError("argument should be a Buffer");
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start;
        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        if (end > this.length) end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      };
      Buffer2.prototype.fill = function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
              val = code;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val) val = 0;
        let i2;
        if (typeof val === "number") {
          for (i2 = start; i2 < end; ++i2) {
            this[i2] = val;
          }
        } else {
          const bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i2 = 0; i2 < end - start; ++i2) {
            this[i2 + start] = bytes[i2 % len];
          }
        }
        return this;
      };
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = class NodeError extends Base {
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        };
      }
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(name) {
          if (name) {
            return `${name} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function(name, actual) {
          return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function(str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i2 = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i2 >= start + 4; i2 -= 3) {
          res = `_${val.slice(i2 - 3, i2)}${res}`;
        }
        return `${val.slice(0, i2)}${res}`;
      }
      function checkBounds(buf, offset, byteLength2) {
        validateNumber(offset, "offset");
        if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
          boundsError(offset, buf.length - (byteLength2 + 1));
        }
      }
      function checkIntBI(value, min, max, buf, offset, byteLength2) {
        if (value > max || value < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength2 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf, offset, byteLength2);
      }
      function validateNumber(value, name) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
        }
      }
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value
        );
      }
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        let codePoint;
        const length = string.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i2 = 0; i2 < length; ++i2) {
          codePoint = string.charCodeAt(i2);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              } else if (i2 + 1 === length) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i2 = 0; i2 < str.length; ++i2) {
          byteArray.push(str.charCodeAt(i2) & 255);
        }
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i2 = 0; i2 < str.length; ++i2) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i2);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        let i2;
        for (i2 = 0; i2 < length; ++i2) {
          if (i2 + offset >= dst.length || i2 >= src.length) break;
          dst[i2 + offset] = src[i2];
        }
        return i2;
      }
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      var hexSliceLookupTable = function() {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i2 = 0; i2 < 16; ++i2) {
          const i16 = i2 * 16;
          for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i2] + alphabet[j];
          }
        }
        return table;
      }();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
    }
  });

  // build/brainCloudClient.concat.js
  var require_brainCloudClient_concat = __commonJS({
    "build/brainCloudClient.concat.js"(exports) {
      if (typeof CryptoJS === "undefined" || CryptoJS === null) {
        CryptoJS = require_crypto_js();
      }
      var CryptoJS;
      function BrainCloudManager() {
        var bcm = this;
        var _setInterval = typeof customSetInterval === "function" ? customSetInterval : setInterval;
        bcm.name = "BrainCloudManager";
        bcm._sendQueue = [];
        bcm._inProgressQueue = [];
        bcm._abTestingId = -1;
        bcm._sessionId = "";
        bcm._packetId = 0;
        bcm._loader = null;
        bcm._eventCallback = null;
        bcm._autoReconnectCallback = null;
        bcm._rewardCallback = null;
        bcm._errorCallback = null;
        bcm._jsonedQueue = "";
        bcm._idleTimeout = 30;
        bcm._heartBeatIntervalId = null;
        bcm._bundlerIntervalId = null;
        bcm._packetTimeouts = [15, 20, 35, 50];
        bcm._retry = 0;
        bcm._requestId = 0;
        bcm._appId = "";
        bcm._secret = "";
        bcm._secretMap = {};
        bcm._serverUrl = "https://api.braincloudservers.com";
        bcm._dispatcherUrl = bcm._serverUrl + "/dispatcherv2";
        bcm._fileUploadUrl = bcm._serverUrl + "/uploader";
        bcm._appVersion = "";
        bcm._debugEnabled = false;
        bcm._compressionEnabled = true;
        bcm._compressionThreshold = 51200;
        bcm._autoReconnectEnabled = false;
        bcm._requestInProgress = false;
        bcm._bundleDelayActive = false;
        bcm._statusCodeCache = 403;
        bcm._reasonCodeCache = 40304;
        bcm._statusMessageCache = "No session";
        bcm._killSwitchThreshold = 11;
        bcm._killSwitchEngaged = false;
        bcm._killSwitchErrorCount = 0;
        bcm._killSwitchService = "";
        bcm._killSwitchOperation = "";
        bcm._isInitialized = false;
        bcm._isAuthenticated = false;
        bcm.compressRequest = function(requestToCompress) {
          var compressionStream = new Blob([requestToCompress]).stream().pipeThrough(new CompressionStream("gzip"));
          return new Response(compressionStream).blob().then(function(compressedBlob) {
            return compressedBlob.arrayBuffer();
          }).catch(function(error) {
            console.error("Error during compression:", error);
            throw error;
          });
        };
        bcm.initialize = function(appId, secret, appVersion) {
          bcm._appId = appId;
          bcm._secret = secret;
          bcm._secretMap = {};
          bcm._secretMap[appId] = secret;
          bcm._appVersion = appVersion;
          bcm._isInitialized = true;
        };
        bcm.initializeWithApps = function(defaultAppId, secretMap, appVersion) {
          bcm._appId = defaultAppId;
          bcm._secret = secretMap[defaultAppId];
          bcm._secretMap = secretMap;
          bcm._appVersion = appVersion;
          bcm._isInitialized = true;
        };
        bcm.setServerUrl = function(serverUrl) {
          bcm._serverUrl = serverUrl;
          if (bcm._serverUrl.endsWith("/dispatcherv2")) {
            bcm._serverUrl = bcm._serverUrl.substring(0, bcm._serverUrl.length - "/dispatcherv2".length);
          }
          while (bcm._serverUrl.length > 0 && bcm._serverUrl.charAt(bcm._serverUrl.length - 1) == "/") {
            bcm._serverUrl = bcm._serverUrl.substring(0, bcm._serverUrl.length - 1);
          }
          bcm._dispatcherUrl = bcm._serverUrl + "/dispatcherv2";
          bcm._fileUploadUrl = bcm._serverUrl + "/uploader";
        };
        bcm.getDispatcherUrl = function() {
          return bcm._dispatcherUrl;
        };
        bcm.getFileUploadUrl = function() {
          return bcm._fileUploadUrl;
        };
        bcm.setABTestingId = function(abTestingId) {
          bcm._abTestingId = abTestingId;
        };
        bcm.getABTestingId = function() {
          return bcm._abTestingId;
        };
        bcm.getSessionId = function() {
          return bcm._sessionId;
        };
        bcm.setSessionId = function(sessionId) {
          if (sessionId !== null || sessionId !== "") {
            bcm._isAuthenticated = true;
          } else {
            bcm._packetId = 0;
          }
          bcm._sessionId = sessionId;
        };
        bcm.getSecret = function() {
          return bcm._secret;
        };
        bcm.setSecret = function(secret) {
          bcm._secret = secret;
        };
        bcm.getAppVersion = function() {
          return bcm._appVersion;
        };
        bcm.setAppVersion = function(appVersion) {
          bcm._appVersion = appVersion;
        };
        bcm.getAppId = function() {
          return bcm._appId;
        };
        bcm.setAppId = function(appId) {
          bcm._appId = appId;
        };
        bcm.registerEventCallback = function(eventCallback) {
          bcm._eventCallback = eventCallback;
        };
        bcm.deregisterEventCallback = function() {
          bcm._eventCallback = null;
        };
        bcm.registerAutoReconnectCallback = function(autoReconnectCallback) {
          bcm._autoReconnectCallback = autoReconnectCallback;
        };
        bcm.deregisterAutoReconnectCallback = function() {
          bcm._autoReconnectCallback = null;
        };
        bcm.registerRewardCallback = function(rewardCallback) {
          bcm._rewardCallback = rewardCallback;
        };
        bcm.deregisterRewardCallback = function() {
          bcm._rewardCallback = null;
        };
        bcm.setErrorCallback = function(errorCallback) {
          bcm._errorCallback = errorCallback;
        };
        bcm.setDebugEnabled = function(debugEnabled) {
          bcm._debugEnabled = debugEnabled;
        };
        bcm.isInitialized = function() {
          return bcm._isInitialized;
        };
        bcm.isAuthenticated = function() {
          return bcm._isAuthenticated;
        };
        bcm.setAuthenticated = function() {
          bcm._isAuthenticated = true;
          bcm.startHeartBeat();
        };
        bcm.debugLog = function(msg, isError) {
          if (bcm._debugEnabled === true) {
            if (isError) {
              console.error(msg);
            } else {
              console.log(msg);
            }
          }
        };
        bcm.sendRequest = function(request) {
          bcm.debugLog("SendRequest: " + JSON.stringify(request));
          bcm._sendQueue.push(request);
          if (!bcm._requestInProgress && !bcm._bundleDelayActive) {
            bcm._bundleDelayActive = true;
            setTimeout(function() {
              bcm._bundleDelayActive = false;
              bcm.processQueue();
            }, 0);
          }
        };
        bcm.resetCommunication = function() {
          bcm.stopHeartBeat();
          bcm._sendQueue = [];
          bcm._inProgressQueue = [];
          bcm._sessionId = "";
          bcm.packetId = 0;
          bcm._isAuthenticated = false;
          bcm._requestInProgress = false;
          bcm.resetErrorCache();
        };
        bcm.resetErrorCache = function() {
          bcm._statusCodeCache = 403;
          bcm._reasonCodeCache = 40304;
          bcm._statusMessageCache = "No session";
        };
        bcm.updateKillSwitch = function(service, operation, statusCode) {
          if (statusCode === bcm.statusCodes.CLIENT_NETWORK_ERROR) {
            return;
          }
          if (bcm._killSwitchService.length === 0) {
            bcm._killSwitchService = service;
            bcm._killSwitchOperation = operation;
            bcm._killSwitchErrorCount++;
          } else if (service === bcm._killSwitchService && operation === bcm._killSwitchOperation) {
            bcm._killSwitchErrorCount++;
          }
          if (!bcm._killSwitchEngaged && bcm._killSwitchErrorCount >= bcm._killSwitchThreshold) {
            bcm._killSwitchEngaged = true;
            bcm.debugLog("Client disabled due to repeated errors from a single API call: " + service + " | " + operation);
          }
        };
        bcm.resetKillSwitch = function() {
          bcm._killSwitchErrorCount = 0;
          bcm._killSwitchService = "";
          bcm._killSwitchOperation = "";
        };
        bcm.startHeartBeat = function() {
          bcm.stopHeartBeat();
          bcm._heartBeatIntervalId = _setInterval(function() {
            bcm.sendRequest({
              service: "heartbeat",
              operation: "READ",
              callback: function(result2) {
              }
            });
          }, bcm._idleTimeout * 1e3);
        };
        bcm.stopHeartBeat = function() {
          if (bcm._heartBeatIntervalId) {
            clearInterval(bcm._heartBeatIntervalId);
            bcm._heartBeatIntervalId = null;
          }
        };
        bcm.handleSuccessResponse = function(response) {
          var messages = response["responses"];
          if (bcm._debugEnabled) {
            for (var c = 0; c < messages.length; ++c) {
              if (messages[c].status == 200) {
                bcm.debugLog("Response(" + messages[c].status + "): " + JSON.stringify(messages[c]));
              } else {
                bcm.debugLog("Response(" + messages[c].status + "): " + JSON.stringify(messages[c]), true);
              }
            }
          }
          for (var c = 0; c < bcm._inProgressQueue.length && c < messages.length; ++c) {
            var callback = bcm._inProgressQueue[c].callback;
            if (bcm._inProgressQueue[c] != null && bcm._errorCallback && messages[c].status != 200) {
              bcm._errorCallback(messages[c]);
            }
            if (bcm._inProgressQueue[c] == null) return;
            if (messages[c].status == 200) {
              bcm.resetKillSwitch();
              var data = messages[c].data;
              if (data && (bcm._inProgressQueue[c].service == "authenticationV2" || bcm._inProgressQueue[c].service == "identity")) {
                if (data.sessionId) {
                  bcm._sessionId = data.sessionId;
                }
                if (data.profileId) {
                  bcm.authentication.profileId = data.profileId;
                }
                if (data.switchToAppId) {
                  bcm._appId = data.switchToAppId;
                  bcm._secret = bcm._secretMap[data.switchToAppId];
                }
              }
              if (bcm._inProgressQueue[c].service == "playerState" && (bcm._inProgressQueue[c].operation == "LOGOUT" || bcm._inProgressQueue[c].operation == "FULL_RESET")) {
                bcm.stopHeartBeat();
                bcm._isAuthenticated = false;
                bcm._sessionId = "";
                bcm.authentication.profileId = "";
              } else if (bcm._inProgressQueue[c].operation == "AUTHENTICATE") {
                bcm._isAuthenticated = true;
                if (data.hasOwnProperty("playerSessionExpiry")) {
                  bcm._idleTimeout = data.playerSessionExpiry * 0.85;
                } else {
                  bcm._idleTimeout = 30;
                }
                if (data.hasOwnProperty("maxKillCount")) {
                  bcm._killSwitchThreshold = data.maxKillCount;
                }
                if (data.hasOwnProperty("compressIfLarger")) {
                  bcm._compressionThreshold = data.compressIfLarger;
                }
                bcm.resetErrorCache();
                bcm.startHeartBeat();
              }
              if (bcm._rewardCallback) {
                var rewards = null;
                if (data && bcm._inProgressQueue[c].service && bcm._inProgressQueue[c].operation) {
                  if (bcm._inProgressQueue[c].service == "authenticationV2" && bcm._inProgressQueue[c].operation == "AUTHENTICATE") {
                    bcm.resetErrorCache();
                    if (data.rewards && data.rewards.rewards) {
                      rewards = data.rewards;
                    }
                  } else if (bcm._inProgressQueue[c].service == "playerStatistics" && bcm._inProgressQueue[c].operation == "UPDATE" || bcm._inProgressQueue[c].service == "playerStatisticsEvent" && (bcm._inProgressQueue[c].operation == "TRIGGER" || bcm._inProgressQueue[c].operation == "TRIGGER_MULTIPLE")) {
                    if (data.rewards) {
                      rewards = data;
                    }
                  }
                  if (rewards) {
                    bcm._rewardCallback(rewards);
                  }
                }
              }
            } else {
              var statusCode = messages[c].status;
              var reasonCode2 = messages[c].reason_code;
              if (reasonCode2 === 40303 && bcm._autoReconnectEnabled && bcm._inProgressQueue[c].operation !== "AUTHENTICATE" && bcm._isAuthenticated) {
                var expiredCall = bcm._inProgressQueue.slice(0);
                var queuedCalls = bcm._sendQueue.splice(0, bcm._sendQueue.length);
                bcm.stopHeartBeat();
                bcm._isAuthenticated = false;
                bcm._sessionId = "";
                bcm.packetId = 0;
                bcm._requestInProgress = false;
                bcm.authentication.authenticateAnonymous(false, function(result2) {
                  if (result2.status === 200) {
                    bcm.debugLog("Long Session reconnect successful. Re-queuing expired calls . . .");
                    bcm._sendQueue = expiredCall.concat(queuedCalls);
                    bcm.processQueue();
                  } else {
                    bcm.debugLog("Long Session reconnect failed");
                    _autoReconnectEnabled = false;
                  }
                  if (bcm._autoReconnectCallback) {
                    bcm._autoReconnectCallback(result2);
                  }
                });
                return;
              }
              if (reasonCode2 === 40303 || reasonCode2 === 40304 || reasonCode2 === 40356) {
                bcm.stopHeartBeat();
                bcm._isAuthenticated = false;
                bcm._sessionID = "";
                bcm._statusCodeCache = statusCode;
                bcm._reasonCodeCache = reasonCode2;
                bcm._statusMessageCache = messages[c].status_message;
              }
              bcm.debugLog("STATUSCodes: " + bcm.statusCodes.CLIENT_NETWORK_ERROR);
              bcm.updateKillSwitch(bcm._inProgressQueue[c].service, bcm._inProgressQueue[c].operation, statusCode);
            }
            if (callback) {
              callback(messages[c]);
            }
          }
          var events = response["events"];
          if (events && bcm._eventCallback) {
            for (var c = 0; c < events.length; ++c) {
              var eventsJson = {
                events
              };
              bcm._eventCallback(eventsJson);
            }
          }
        };
        bcm.fakeErrorResponse = function(statusCode, reasonCode2, message) {
          var responses = [];
          var response = {};
          response.status = statusCode;
          response.reason_code = reasonCode2;
          response.status_message = message;
          response.severity = "ERROR";
          for (var i2 = 0; i2 < bcm._inProgressQueue.length; i2++) {
            responses.push(response);
          }
          bcm.handleSuccessResponse(
            {
              "responses": responses
            }
          );
        };
        bcm.setHeader = function(xhr) {
          var sig = CryptoJS.MD5(bcm._jsonedQueue + bcm._secret);
          xhr.setRequestHeader("X-SIG", sig);
          xhr.setRequestHeader("X-APPID", bcm._appId);
        };
        bcm.retry = function() {
          if (bcm._retry <= bcm._packetTimeouts.length) {
            bcm._retry++;
            bcm.debugLog("Retry # " + bcm._retry.toString(), false);
            if (bcm._retry === 1) {
              bcm.debugLog("Retrying right away", false);
              bcm.performQuery();
            } else {
              bcm.debugLog("Waiting for " + bcm._packetTimeouts[bcm._retry - 1] + " sec...", false);
              setTimeout(bcm.performQuery, bcm._packetTimeouts[bcm._retry - 1] * 1e3);
            }
          } else {
            bcm.debugLog("Failed after " + bcm._retry + " retries.", true);
            if (bcm._errorCallback != void 0 && typeof bcm._errorCallback == "function") {
              bcm._errorCallback(errorThrown);
            }
            bcm.fakeErrorResponse(bcm.statusCodes.CLIENT_NETWORK_ERROR, bcm.reasonCodes.CLIENT_NETWORK_ERROR_TIMEOUT, "Request timed out");
            bcm._requestInProgress = false;
            bcm.processQueue();
          }
        };
        bcm.handleResponse = function(status, response) {
          clearTimeout(bcm.xml_timeoutId);
          bcm.xml_timeoutId = null;
          bcm.debugLog("Response Status: " + status);
          bcm.debugLog("Response: " + JSON.stringify(response));
          if (status == 200) {
            bcm.handleSuccessResponse(response);
            bcm._requestInProgress = false;
            bcm.processQueue();
          } else if (status == 502 || status == 503 || status == 504) {
            bcm.debugLog("packet in progress", false);
            bcm.retry();
            return;
          } else {
            try {
              var errorResponse = response;
              if (errorResponse["reason_code"]) {
                reasonCode = errorResponse["reason_code"];
              }
              if (errorResponse["status_message"]) {
                statusMessage = errorResponse["status_message"];
              } else {
                statusMessage = response;
              }
            } catch (e) {
              reasonCode = 0;
              statusMessage = response;
            }
            var errorMessage = response;
            bcm.debugLog("Failed", true);
            if (bcm._errorCallback != void 0 && typeof bcm._errorCallback == "function") {
              bcm._errorCallback(errorMessage);
            }
            if (!errorMessage || errorMessage == "") errorMessage = "Unknown error. Did you lose internet connection?";
            bcm.fakeErrorResponse(
              bcm.statusCodes.CLIENT_NETWORK_ERROR,
              reasonCode,
              errorMessage
            );
          }
        };
        bcm.performQuery = function() {
          clearTimeout(bcm.xml_timeoutId);
          bcm.xml_timeoutId = null;
          bcm._requestInProgress = true;
          var xmlhttp;
          if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
          } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
          }
          xmlhttp.requestId = ++bcm._requestId;
          xmlhttp.ontimeout_bc = function() {
            if (xmlhttp.readyState < 4) {
              xmlhttp.hasTimedOut = true;
              xmlhttp.abort();
              xmlhttp.hasTimedOut = null;
              bcm.xml_timeoutId = null;
              bcm.debugLog("timeout", false);
              bcm.retry();
            }
          };
          xmlhttp.onreadystatechange = function() {
            if (xmlhttp.hasTimedOut || xmlhttp.requestId != bcm._requestId) {
              return;
            }
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
              bcm.handleResponse(xmlhttp.status, JSON.parse(xmlhttp.responseText));
            }
          };
          bcm.xml_timeoutId = setTimeout(xmlhttp.ontimeout_bc, bcm._packetTimeouts[0] * 1e3);
          xmlhttp.open("POST", bcm._dispatcherUrl, true);
          xmlhttp.setRequestHeader("Content-type", "application/json");
          var sig = CryptoJS.MD5(bcm._jsonedQueue + bcm._secret);
          xmlhttp.setRequestHeader("X-SIG", sig);
          xmlhttp.setRequestHeader("X-APPID", bcm._appId);
          var encodedRequest = new TextEncoder().encode(bcm._jsonedQueue);
          var requestSize = encodedRequest.length;
          if (bcm._compressionEnabled && bcm._compressionThreshold >= 0 && requestSize >= bcm._compressionThreshold) {
            bcm.compressRequest(encodedRequest).then(function(compressedData) {
              fetch(bcm._dispatcherUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-SIG": sig,
                  "X-APPID": bcm._appId,
                  "Content-Encoding": "gzip"
                },
                body: compressedData
              }).then(function(response) {
                var status = response.status;
                return response.arrayBuffer().then(function(buffer) {
                  return { status, buffer };
                });
              }).then(function(result2) {
                var responseStatus = result2.status;
                var jsonString = new TextDecoder().decode(result2.buffer);
                var responseJSON = JSON.parse(jsonString);
                bcm.handleResponse(responseStatus, responseJSON);
              }).catch(function(error) {
                console.error(error);
              });
            }).catch(function(err) {
              console.error("Compression failed:", err);
              console.log("Sending request without compression...");
              xmlhttp.send(bcm._jsonedQueue);
            });
          } else {
            xmlhttp.send(bcm._jsonedQueue);
          }
        };
        bcm.processQueue = function() {
          if (bcm._sendQueue.length > 0) {
            bcm._inProgressQueue = [];
            var itemsProcessed;
            for (itemsProcessed = 0; itemsProcessed < bcm._sendQueue.length; ++itemsProcessed) {
              var message = bcm._sendQueue[itemsProcessed];
              if (message.operation == "END_BUNDLE_MARKER") {
                if (bcm._inProgressQueue.length == 0) {
                  continue;
                } else {
                  ++itemsProcessed;
                  break;
                }
              }
              bcm._inProgressQueue.push(message);
            }
            bcm._sendQueue.splice(0, itemsProcessed);
            if (bcm._inProgressQueue.length <= 0) {
              return;
            }
            bcm._jsonedQueue = JSON.stringify(
              {
                messages: bcm._inProgressQueue,
                gameId: bcm._appId,
                sessionId: bcm._sessionId,
                packetId: bcm._packetId++
              }
            );
            localStorage.setItem("lastPacketId", bcm._packetId);
            if (bcm._killSwitchEngaged) {
              bcm.fakeErrorResponse(
                bcm.statusCodes.CLIENT_NETWORK_ERROR,
                bcm.reasonCodes.CLIENT_DISABLED,
                "Client disabled due to repeated errors from a single API call"
              );
              return;
            }
            if (!bcm._isAuthenticated) {
              var isAuth = false;
              for (i = 0; i < bcm._inProgressQueue.length; i++) {
                if (bcm._inProgressQueue[i].operation == "AUTHENTICATE" || bcm._inProgressQueue[i].operation == "RESET_EMAIL_PASSWORD" || bcm._inProgressQueue[i].operation == "RESET_EMAIL_PASSWORD_ADVANCED" || bcm._inProgressQueue[i].operation == "GET_SERVER_VERSION") {
                  isAuth = true;
                  break;
                }
              }
              if (!isAuth) {
                bcm.fakeErrorResponse(bcm._statusCodeCache, bcm._reasonCodeCache, bcm._statusMessageCache);
                return;
              }
            }
            bcm._retry = 0;
            bcm.performQuery();
          }
        };
      }
      BrainCloudManager.apply(window.brainCloudManager = window.brainCloudManager || {});
      function BCAbTest() {
        var bc2 = this;
        bc2.abtests = {};
        bc2.abtests.loadABTestData = function(dataUrl, callback) {
          console.log("called loadABTestData(" + dataUrl + ",callback)");
          jQuery.ajax({
            timeout: 15e3,
            url: dataUrl,
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({})
          }).done(function(response) {
            console.log("loadABTestData() - GOT: " + JSON.stringify(response));
            if (response != null) {
              abTestData = response;
            }
            if (callback) {
              callback();
            }
          }).fail(function(jqXhr, textStatus, errorThrown2) {
            console.log(
              "loadABTestData() - FAILED: " + jqXhr + " " + textStatus + " " + errorThrown2
            );
          });
        };
        bc2.abtests.getABTest = function(abTestingId, abTestName) {
          console.log("called getABTest(" + abTestingId + "," + abTestName + ").");
          for (var x = 0; x < abTestData.ab_tests.length; x++) {
            if (abTestData.ab_tests[x].name == abTestName && abTestData.ab_tests[x].active == "true") {
              for (var y = 0; y < abTestData.ab_tests[x].data.length; y++) {
                var minId = abTestData.ab_tests[x].data[y].min;
                var maxId = abTestData.ab_tests[x].data[y].max;
                if (abTestingId >= minId && abTestingId <= maxId) {
                  console.log(
                    "getABTest() - Found AB test '" + abTestName + ":" + abTestData.ab_tests[x].data[y].name + "' for abTestingId '" + abTestingId + "' in range '" + minId + "' to '" + maxId + "'."
                  );
                  return abTestData.ab_tests[x].data[y].name;
                }
              }
            }
          }
          console.log(
            "getABTest() - Could not find an '" + abTestName + "' AB test for abTestingId '" + abTestingId + "'."
          );
          return null;
        };
        bc2.abtests.pushABTestResult = function(abTestingId, abTestName, abSelection, result2) {
          console.log(
            "called pushABTestResult(" + abTestingId + "," + abTestName + "," + abSelection + "," + result2 + ")."
          );
        };
        bc2.abtests.setABTestingId = function(abTestingId) {
          bc2.brainCloudManager.setABTestingId(abTestingId);
        };
        bc2.abtests.getABTestingId = function() {
          return bc2.brainCloudManager.getABTestingId();
        };
      }
      BCAbTest.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCAppStore() {
        var bc2 = this;
        bc2.appStore = {};
        bc2.SERVICE_APP_STORE = "appStore";
        bc2.appStore.OPERATION_CACHE_PURCHASE_PAYLOAD_CONTEXT = "CACHE_PURCHASE_PAYLOAD_CONTEXT";
        bc2.appStore.OPERATION_FINALIZE_PURCHASE = "FINALIZE_PURCHASE";
        bc2.appStore.OPERATION_GET_ELIGIBLE_PROMOTIONS = "ELIGIBLE_PROMOTIONS";
        bc2.appStore.OPERATION_GET_SALES_INVENTORY = "GET_INVENTORY";
        bc2.appStore.OPERATION_REFRESH_PROMOTIONS = "REFRESH_PROMOTIONS";
        bc2.appStore.OPERATION_START_PURCHASE = "START_PURCHASE";
        bc2.appStore.OPERATION_VERIFY_PURCHASE = "VERIFY_PURCHASE";
        bc2.appStore.cachePurchasePayloadContext = function(storeId, iapId, payload, callback) {
          var data = {
            storeId,
            iapId,
            payload
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_APP_STORE,
            operation: bc2.appStore.OPERATION_CACHE_PURCHASE_PAYLOAD_CONTEXT,
            data,
            callback
          });
        };
        bc2.appStore.verifyPurchase = function(storeId, receiptData, callback) {
          var message = {
            storeId,
            receiptData
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_APP_STORE,
            operation: bc2.appStore.OPERATION_VERIFY_PURCHASE,
            data: message,
            callback
          });
        };
        bc2.appStore.getEligiblePromotions = function(callback) {
          var message = {};
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_APP_STORE,
            operation: bc2.appStore.OPERATION_GET_ELIGIBLE_PROMOTIONS,
            data: message,
            callback
          });
        };
        bc2.appStore.getSalesInventory = function(storeId, userCurrency, callback) {
          bc2.appStore.getSalesInventoryByCategory(
            storeId,
            userCurrency,
            null,
            callback
          );
        };
        bc2.appStore.getSalesInventoryByCategory = function(storeId, userCurrency, category, callback) {
          var message = {
            storeId,
            category,
            priceInfoCriteria: {
              userCurrency
            }
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_APP_STORE,
            operation: bc2.appStore.OPERATION_GET_SALES_INVENTORY,
            data: message,
            callback
          });
        };
        bc2.appStore.startPurchase = function(storeId, purchaseData, callback) {
          var message = {
            storeId,
            purchaseData
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_APP_STORE,
            operation: bc2.appStore.OPERATION_START_PURCHASE,
            data: message,
            callback
          });
        };
        bc2.appStore.finalizePurchase = function(storeId, transactionId, transactionData, callback) {
          var message = {
            storeId,
            transactionId,
            transactionData
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_APP_STORE,
            operation: bc2.appStore.OPERATION_FINALIZE_PURCHASE,
            data: message,
            callback
          });
        };
        bc2.appStore.refreshPromotions = function(callback) {
          var message = {};
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_APP_STORE,
            operation: bc2.appStore.OPERATION_REFRESH_PROMOTIONS,
            data: message,
            callback
          });
        };
      }
      BCAppStore.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCAsyncMatch() {
        var bc2 = this;
        bc2.asyncMatch = {};
        bc2.SERVICE_ASYNC_MATCH = "asyncMatch";
        bc2.asyncMatch.OPERATION_SUBMIT_TURN = "SUBMIT_TURN";
        bc2.asyncMatch.OPERATION_UPDATE_SUMMARY = "UPDATE_SUMMARY";
        bc2.asyncMatch.OPERATION_ABANDON = "ABANDON";
        bc2.asyncMatch.OPERATION_COMPLETE = "COMPLETE";
        bc2.asyncMatch.OPERATION_CREATE = "CREATE";
        bc2.asyncMatch.OPERATION_READ_MATCH = "READ_MATCH";
        bc2.asyncMatch.OPERATION_READ_MATCH_HISTORY = "READ_MATCH_HISTORY";
        bc2.asyncMatch.OPERATION_FIND_MATCHES = "FIND_MATCHES";
        bc2.asyncMatch.OPERATION_FIND_MATCHES_COMPLETED = "FIND_MATCHES_COMPLETED";
        bc2.asyncMatch.OPERATION_DELETE_MATCH = "DELETE_MATCH";
        bc2.asyncMatch.OPERATION_ABANDON_MATCH_WITH_SUMMARY_DATA = "ABANDON_MATCH_WITH_SUMMARY_DATA";
        bc2.asyncMatch.OPERATION_COMPLETE_MATCH_WITH_SUMMARY_DATA = "COMPLETE_MATCH_WITH_SUMMARY_DATA";
        bc2.asyncMatch.OPERATION_UPDATE_MATCH_STATE_CURRENT_TURN = "UPDATE_MATCH_STATE_CURRENT_TURN";
        bc2.asyncMatch.createMatch = function(opponentIds, pushNotificationMessage, callback) {
          var data = {
            players: opponentIds
          };
          if (pushNotificationMessage) {
            data["pushContent"] = pushNotificationMessage;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ASYNC_MATCH,
            operation: bc2.asyncMatch.OPERATION_CREATE,
            data,
            callback
          });
        };
        bc2.asyncMatch.createMatchWithInitialTurn = function(opponentIds, matchState, pushNotificationMessage, nextPlayer, summary, callback) {
          var data = {
            players: opponentIds
          };
          if (matchState) {
            data["matchState"] = matchState;
          } else data["matchState"] = {};
          if (pushNotificationMessage) {
            data["pushContent"] = pushNotificationMessage;
          }
          if (nextPlayer) {
            data["status"] = { currentPlayer: nextPlayer };
          }
          if (summary) {
            data["summary"] = summary;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ASYNC_MATCH,
            operation: bc2.asyncMatch.OPERATION_CREATE,
            data,
            callback
          });
        };
        bc2.asyncMatch.readMatch = function(ownerId, matchId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ASYNC_MATCH,
            operation: bc2.asyncMatch.OPERATION_READ_MATCH,
            data: {
              ownerId,
              matchId
            },
            callback
          });
        };
        bc2.asyncMatch.submitTurn = function(ownerId, matchId, version, matchState, pushNotificationMessage, nextPlayer, summary, statistics, callback) {
          var data = {
            ownerId,
            matchId,
            version
          };
          if (matchState) {
            data["matchState"] = matchState;
          } else data["matchState"] = {};
          if (nextPlayer) {
            data["status"] = { currentPlayer: nextPlayer };
          }
          if (summary) {
            data["summary"] = summary;
          }
          if (statistics) {
            data["statistics"] = statistics;
          }
          if (pushNotificationMessage) {
            data["pushContent"] = pushNotificationMessage;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ASYNC_MATCH,
            operation: bc2.asyncMatch.OPERATION_SUBMIT_TURN,
            data,
            callback
          });
        };
        bc2.asyncMatch.updateMatchSummaryData = function(ownerId, matchId, version, summary, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ASYNC_MATCH,
            operation: bc2.asyncMatch.OPERATION_UPDATE_SUMMARY,
            data: {
              ownerId,
              matchId,
              version,
              summary
            },
            callback
          });
        };
        bc2.asyncMatch.abandonMatch = function(ownerId, matchId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ASYNC_MATCH,
            operation: bc2.asyncMatch.OPERATION_ABANDON,
            data: {
              ownerId,
              matchId
            },
            callback
          });
        };
        bc2.asyncMatch.completeMatch = function(ownerId, matchId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ASYNC_MATCH,
            operation: bc2.asyncMatch.OPERATION_COMPLETE,
            data: {
              ownerId,
              matchId
            },
            callback
          });
        };
        bc2.asyncMatch.readMatchHistory = function(ownerId, matchId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ASYNC_MATCH,
            operation: bc2.asyncMatch.OPERATION_READ_MATCH_HISTORY,
            data: {
              ownerId,
              matchId
            },
            callback
          });
        };
        bc2.asyncMatch.findMatches = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ASYNC_MATCH,
            operation: bc2.asyncMatch.OPERATION_FIND_MATCHES,
            callback
          });
        };
        bc2.asyncMatch.findCompleteMatches = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ASYNC_MATCH,
            operation: bc2.asyncMatch.OPERATION_FIND_MATCHES_COMPLETED,
            callback
          });
        };
        bc2.asyncMatch.deleteMatch = function(ownerId, matchId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ASYNC_MATCH,
            operation: bc2.asyncMatch.OPERATION_DELETE_MATCH,
            data: {
              ownerId,
              matchId
            },
            callback
          });
        };
        bc2.asyncMatch.completeMatchWithSummaryData = function(ownerId, matchId, pushContent, summary, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ASYNC_MATCH,
            operation: bc2.asyncMatch.OPERATION_COMPLETE_MATCH_WITH_SUMMARY_DATA,
            data: {
              ownerId,
              matchId,
              pushContent,
              summary
            },
            callback
          });
        };
        bc2.asyncMatch.abandonMatchWithSummaryData = function(ownerId, matchId, pushContent, summary, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ASYNC_MATCH,
            operation: bc2.asyncMatch.OPERATION_ABANDON_MATCH_WITH_SUMMARY_DATA,
            data: {
              ownerId,
              matchId,
              pushContent,
              summary
            },
            callback
          });
        };
        bc2.asyncMatch.updateMatchStateCurrentTurn = function(ownerId, matchId, version, matchState, statistics, callback) {
          var data = {
            ownerId,
            matchId,
            version
          };
          if (matchState) {
            data["matchState"] = matchState;
          } else data["matchState"] = {};
          if (statistics) {
            data["statistics"] = statistics;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ASYNC_MATCH,
            operation: bc2.asyncMatch.OPERATION_UPDATE_MATCH_STATE_CURRENT_TURN,
            data,
            callback
          });
        };
      }
      BCAsyncMatch.apply(window.brainCloudClient = window.brainCloudClient || {});
      if (typeof window === "undefined" || window === null) {
        window = {};
      }
      if (!window.navigator) {
        window.navigator = {};
      }
      if (!window.navigator.userLanguage && !window.navigator.language) {
        window.navigator.userLanguage = require_umd().getUserLocale();
      }
      function BCAuthentication() {
        var bc2 = this;
        bc2.authentication = {};
        bc2.SERVICE_AUTHENTICATION = "authenticationV2";
        bc2.authentication.OPERATION_AUTHENTICATE = "AUTHENTICATE";
        bc2.authentication.OPERATION_RESET_EMAIL_PASSWORD = "RESET_EMAIL_PASSWORD";
        bc2.authentication.OPERATION_RESET_EMAIL_PASSWORD_ADVANCED = "RESET_EMAIL_PASSWORD_ADVANCED";
        bc2.authentication.OPERATION_RESET_EMAIL_PASSWORD_WITH_EXPIRY = "RESET_EMAIL_PASSWORD_WITH_EXPIRY";
        bc2.authentication.OPERATION_RESET_EMAIL_PASSWORD_ADVANCED_WITH_EXPIRY = "RESET_EMAIL_PASSWORD_ADVANCED_WITH_EXPIRY";
        bc2.authentication.OPERATION_RESET_UNIVERSAL_ID_PASSWORD = "RESET_UNIVERSAL_ID_PASSWORD";
        bc2.authentication.OPERATION_RESET_UNIVERSAL_ID_PASSWORD_ADVANCED = "RESET_UNIVERSAL_ID_PASSWORD_ADVANCED";
        bc2.authentication.OPERATION_RESET_UNIVERSAL_ID_PASSWORD_WITH_EXPIRY = "RESET_UNIVERSAL_ID_PASSWORD_WITH_EXPIRY";
        bc2.authentication.OPERATION_RESET_UNIVERSAL_ID_PASSWORD_ADVANCED_WITH_EXPIRY = "RESET_UNIVERSAL_ID_PASSWORD_ADVANCED_WITH_EXPIRY";
        bc2.authentication.OPERATION_GET_SERVER_VERSION = "GET_SERVER_VERSION";
        bc2.authentication.AUTHENTICATION_TYPE_ANONYMOUS = "Anonymous";
        bc2.authentication.AUTHENTICATION_TYPE_EMAIL = "Email";
        bc2.authentication.AUTHENTICATION_TYPE_EXTERNAL = "External";
        bc2.authentication.AUTHENTICATION_TYPE_FACEBOOK = "Facebook";
        bc2.authentication.AUTHENTICATION_TYPE_FACEBOOK_LIMITED = "FacebookLimited";
        bc2.authentication.AUTHENTICATION_TYPE_APPLE = "Apple";
        bc2.authentication.AUTHENTICATION_TYPE_GOOGLE = "Google";
        bc2.authentication.AUTHENTICATION_TYPE_GOOGLE_OPEN_ID = "GoogleOpenId";
        bc2.authentication.AUTHENTICATION_TYPE_APPLE = "Apple";
        bc2.authentication.AUTHENTICATION_TYPE_ULTRA = "Ultra";
        bc2.authentication.AUTHENTICATION_TYPE_UNIVERSAL = "Universal";
        bc2.authentication.AUTHENTICATION_TYPE_GAME_CENTER = "GameCenter";
        bc2.authentication.AUTHENTICATION_TYPE_STEAM = "Steam";
        bc2.authentication.AUTHENTICATION_TYPE_BLOCKCHAIN = "Blockchain";
        bc2.authentication.AUTHENTICATION_TYPE_TWITTER = "Twitter";
        bc2.authentication.AUTHENTICATION_TYPE_PARSE = "Parse";
        bc2.authentication.AUTHENTICATION_TYPE_HANDOFF = "Handoff";
        bc2.authentication.AUTHENTICATION_TYPE_SETTOP_HANDOFF = "SettopHandoff";
        bc2.authentication.compressResponses = true;
        bc2.authentication.profileId = "";
        bc2.authentication.anonymousId = "";
        bc2.authentication.previousAuthParams = {
          externalId: "",
          authenticationToken: "",
          authenticationType: "",
          externalAuthName: "",
          forceCreate: true,
          extraJson: ""
        };
        bc2.authentication.initialize = function(profileId, anonymousId) {
          bc2.authentication.anonymousId = anonymousId;
          bc2.authentication.profileId = profileId;
        };
        bc2.authentication.generateAnonymousId = function() {
          var d = (/* @__PURE__ */ new Date()).getTime();
          if (window.performance && typeof window.performance.now === "function") {
            d += performance.now();
          }
          var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function(c) {
              var r = (d + Math.random() * 16) % 16 | 0;
              d = Math.floor(d / 16);
              return (c == "x" ? r : r & 3 | 8).toString(16);
            }
          );
          return uuid;
        };
        bc2.authentication.clearSavedProfileId = function() {
          bc2.authentication.profileId = "";
        };
        bc2.authentication.authenticateAnonymous = function(forceCreate, callback) {
          bc2.authentication.authenticate(
            bc2.authentication.anonymousId,
            "",
            bc2.authentication.AUTHENTICATION_TYPE_ANONYMOUS,
            null,
            forceCreate,
            null,
            callback
          );
        };
        bc2.authentication.authenticateEmailPassword = function(email, password, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            email,
            password,
            bc2.authentication.AUTHENTICATION_TYPE_EMAIL,
            null,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.authenticateExternal = function(userId, token, externalAuthName, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            userId,
            token,
            bc2.authentication.AUTHENTICATION_TYPE_EXTERNAL,
            externalAuthName,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.authenticateFacebook = function(facebookId, facebookToken, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            facebookId,
            facebookToken,
            bc2.authentication.AUTHENTICATION_TYPE_FACEBOOK,
            null,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.authenticateFacebookLimited = function(facebookLimitedId2, facebookToken, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            facebookLimitedId2,
            facebookToken,
            bc2.authentication.AUTHENTICATION_TYPE_FACEBOOK_LIMITED,
            null,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.authenticateApple = function(appleId, appleToken, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            appleId,
            appleToken,
            bc2.authentication.AUTHENTICATION_TYPE_APPLE,
            null,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.authenticateGameCenter = function(gameCenterId, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            gameCenterId,
            null,
            bc2.authentication.AUTHENTICATION_TYPE_GAME_CENTER,
            null,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.authenticateApple = function(appleUserId, identityToken, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            appleUserId,
            identityToken,
            bc2.authentication.AUTHENTICATION_TYPE_APPLE,
            null,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.authenticateGoogle = function(googleUserId, serverAuthCode, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            googleUserId,
            serverAuthCode,
            bc2.authentication.AUTHENTICATION_TYPE_GOOGLE,
            null,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.authenticateGoogleOpenId = function(googleUserAccountEmail, IdToken, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            googleUserAccountEmail,
            IdToken,
            bc2.authentication.AUTHENTICATION_TYPE_GOOGLE_OPEN_ID,
            null,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.authenticateGoogleOpenId = function(googleOpenId, googleToken, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            googleOpenId,
            googleToken,
            bc2.authentication.AUTHENTICATION_TYPE_GOOGLE_OPEN_ID,
            null,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.authenticateUltra = function(ultraUsername, ultraIdToken, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            ultraUsername,
            ultraIdToken,
            bc2.authentication.AUTHENTICATION_TYPE_ULTRA,
            null,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.authenticateSteam = function(userId, sessionTicket, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            userId,
            sessionTicket,
            bc2.authentication.AUTHENTICATION_TYPE_STEAM,
            null,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.authenticateTwitter = function(userId, token, secret, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            userId,
            token + ":" + secret,
            bc2.authentication.AUTHENTICATION_TYPE_TWITTER,
            null,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.authenticateUniversal = function(userId, userPassword, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            userId,
            userPassword,
            bc2.authentication.AUTHENTICATION_TYPE_UNIVERSAL,
            null,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.authenticateAdvanced = function(authenticationType, ids, forceCreate, extraJson, responseHandler) {
          bc2.authentication.authenticate(
            ids.externalId,
            ids.authenticationToken,
            authenticationType,
            ids.authenticationSubType,
            forceCreate,
            extraJson,
            responseHandler
          );
        };
        bc2.authentication.authenticateParse = function(userId, token, forceCreate, responseHandler) {
          bc2.authentication.authenticate(
            userId,
            token,
            bc2.authentication.AUTHENTICATION_TYPE_PARSE,
            null,
            forceCreate,
            null,
            responseHandler
          );
        };
        bc2.authentication.resetEmailPassword = function(email, responseHandler) {
          var callerCallback = responseHandler;
          var appId = bc2.brainCloudManager.getAppId();
          var request = {
            service: bc2.SERVICE_AUTHENTICATION,
            operation: bc2.authentication.OPERATION_RESET_EMAIL_PASSWORD,
            data: {
              gameId: appId,
              externalId: email
            },
            callerCallback: responseHandler,
            callback: function(result2) {
              if (result2 && result2.status == 200) {
              }
              if (callerCallback) {
                callerCallback(result2);
              }
            }
          };
          bc2.brainCloudManager.sendRequest(request);
        };
        bc2.authentication.resetEmailPasswordAdvanced = function(emailAddress, serviceParams, responseHandler) {
          var appId = bc2.brainCloudManager.getAppId();
          var request = {
            service: bc2.SERVICE_AUTHENTICATION,
            operation: bc2.authentication.OPERATION_RESET_EMAIL_PASSWORD_ADVANCED,
            data: {
              gameId: appId,
              emailAddress,
              serviceParams
            },
            callback: responseHandler
          };
          bc2.brainCloudManager.sendRequest(request);
        };
        bc2.authentication.resetEmailPasswordWithExpiry = function(email, tokenTtlInMinutes, responseHandler) {
          var callerCallback = responseHandler;
          var appId = bc2.brainCloudManager.getAppId();
          var request = {
            service: bc2.SERVICE_AUTHENTICATION,
            operation: bc2.authentication.OPERATION_RESET_EMAIL_PASSWORD_WITH_EXPIRY,
            data: {
              gameId: appId,
              externalId: email,
              tokenTtlInMinutes
            },
            callerCallback: responseHandler,
            callback: function(result2) {
              if (result2 && result2.status == 200) {
              }
              if (callerCallback) {
                callerCallback(result2);
              }
            }
          };
          bc2.brainCloudManager.sendRequest(request);
        };
        bc2.authentication.resetEmailPasswordAdvancedWithExpiry = function(emailAddress, serviceParams, tokenTtlInMinutes, responseHandler) {
          var appId = bc2.brainCloudManager.getAppId();
          var request = {
            service: bc2.SERVICE_AUTHENTICATION,
            operation: bc2.authentication.OPERATION_RESET_EMAIL_PASSWORD_ADVANCED_WITH_EXPIRY,
            data: {
              gameId: appId,
              emailAddress,
              serviceParams,
              tokenTtlInMinutes
            },
            callback: responseHandler
          };
          bc2.brainCloudManager.sendRequest(request);
        };
        bc2.authentication.resetUniversalIdPassword = function(universalId, responseHandler) {
          var callerCallback = responseHandler;
          var appId = bc2.brainCloudManager.getAppId();
          var request = {
            service: bc2.SERVICE_AUTHENTICATION,
            operation: bc2.authentication.OPERATION_RESET_UNIVERSAL_ID_PASSWORD,
            data: {
              gameId: appId,
              universalId
            },
            callerCallback: responseHandler,
            callback: function(result2) {
              if (result2 && result2.status == 200) {
              }
              if (callerCallback) {
                callerCallback(result2);
              }
            }
          };
          bc2.brainCloudManager.sendRequest(request);
        };
        bc2.authentication.resetUniversalIdPasswordAdvanced = function(universalId, serviceParams, responseHandler) {
          var appId = bc2.brainCloudManager.getAppId();
          var request = {
            service: bc2.SERVICE_AUTHENTICATION,
            operation: bc2.authentication.OPERATION_RESET_UNIVERSAL_ID_PASSWORD_ADVANCED,
            data: {
              gameId: appId,
              universalId,
              serviceParams
            },
            callback: responseHandler
          };
          bc2.brainCloudManager.sendRequest(request);
        };
        bc2.authentication.resetUniversalIdPasswordWithExpiry = function(universalId, tokenTtlInMinutes, responseHandler) {
          var callerCallback = responseHandler;
          var appId = bc2.brainCloudManager.getAppId();
          var request = {
            service: bc2.SERVICE_AUTHENTICATION,
            operation: bc2.authentication.OPERATION_RESET_UNIVERSAL_ID_PASSWORD,
            data: {
              gameId: appId,
              universalId,
              tokenTtlInMinutes
            },
            callerCallback: responseHandler,
            callback: function(result2) {
              if (result2 && result2.status == 200) {
              }
              if (callerCallback) {
                callerCallback(result2);
              }
            }
          };
          bc2.brainCloudManager.sendRequest(request);
        };
        bc2.authentication.resetUniversalIdPasswordAdvancedWithExpiry = function(universalId, serviceParams, tokenTtlInMinutes, responseHandler) {
          var appId = bc2.brainCloudManager.getAppId();
          var request = {
            service: bc2.SERVICE_AUTHENTICATION,
            operation: bc2.authentication.OPERATION_RESET_UNIVERSAL_ID_PASSWORD_ADVANCED,
            data: {
              gameId: appId,
              universalId,
              serviceParams,
              tokenTtlInMinutes
            },
            callback: responseHandler
          };
          bc2.brainCloudManager.sendRequest(request);
        };
        bc2.authentication.getServerVersion = function(responseHandler) {
          var appId = bc2.brainCloudManager.getAppId();
          var request = {
            service: bc2.SERVICE_AUTHENTICATION,
            operation: bc2.authentication.OPERATION_GET_SERVER_VERSION,
            data: {
              gameId: appId
            },
            callback: responseHandler
          };
          bc2.brainCloudManager.sendRequest(request);
        };
        bc2.authentication.authenticateHandoff = function(handoffId, securityToken, callback) {
          bc2.authentication.authenticate(
            handoffId,
            securityToken,
            bc2.authentication.AUTHENTICATION_TYPE_HANDOFF,
            null,
            false,
            null,
            callback
          );
        };
        bc2.authentication.authenticateSettopHandoff = function(handoffCode, callback) {
          bc2.authentication.authenticate(
            handoffCode,
            "",
            bc2.authentication.AUTHENTICATION_TYPE_SETTOP_HANDOFF,
            null,
            false,
            null,
            callback
          );
        };
        bc2.authentication.retryPreviousAuthenticate = function(callback) {
          bc2.authentication.authenticate(
            bc2.authentication.previousAuthParams.externalId,
            bc2.authentication.previousAuthParams.authenticationToken,
            bc2.authentication.previousAuthParams.authenticationType,
            bc2.authentication.previousAuthParams.externalAuthName,
            bc2.authentication.previousAuthParams.forceCreate,
            bc2.authentication.previousAuthParams.extraJson,
            callback
          );
        };
        bc2.authentication.authenticate = function(externalId, authenticationToken2, authenticationType, externalAuthName, forceCreate, extraJson, responseHandler) {
          bc2.authentication.previousAuthParams.externalId = externalId;
          bc2.authentication.previousAuthParams.authenticationToken = authenticationToken2;
          bc2.authentication.previousAuthParams.authenticationType = authenticationType;
          bc2.authentication.previousAuthParams.externalAuthName = externalAuthName;
          bc2.authentication.previousAuthParams.forceCreate = forceCreate;
          bc2.authentication.previousAuthParams.extraJson = extraJson;
          var callerCallback = responseHandler;
          var _navLangCode = window.navigator.userLanguage || window.navigator.language;
          _navLangCode = _navLangCode.split("-");
          var languageCode = bc2.languageCode == null ? _navLangCode[0] : bc2.languageCode;
          var countryCode = bc2.countryCode == null ? _navLangCode[1] : bc2.countryCode;
          if (countryCode === "419") {
            countryCode = "_LA_";
          }
          if (countryCode === "Hans" || countryCode === "Hant") {
            countryCode = "CN";
          }
          var now = /* @__PURE__ */ new Date();
          var timeZoneOffset = -now.getTimezoneOffset() / 60;
          var appId = bc2.brainCloudManager.getAppId();
          var appVersion = bc2.brainCloudManager.getAppVersion();
          bc2.brainCloudManager.setSessionId("");
          var data = {
            gameId: appId,
            externalId,
            releasePlatform: "WEB",
            gameVersion: appVersion,
            clientLibVersion: bc2.version || bc2.brainCloudClient.version,
            authenticationToken: authenticationToken2,
            authenticationType,
            forceCreate,
            compressResponses: bc2.authentication.compressResponses,
            anonymousId: bc2.authentication.anonymousId,
            profileId: bc2.authentication.profileId,
            timeZoneOffset,
            languageCode,
            countryCode,
            clientLib: "js"
          };
          if (externalAuthName) {
            data["externalAuthName"] = externalAuthName;
          }
          if (extraJson) {
            data["extraJson"] = extraJson;
          }
          var request = {
            service: bc2.SERVICE_AUTHENTICATION,
            operation: bc2.authentication.OPERATION_AUTHENTICATE,
            data,
            callback: function(result2) {
              if (result2 && result2.status == 200) {
                bc2.brainCloudManager.setABTestingId(result2.data.abTestingId);
                bc2.brainCloudManager.setSessionId(result2.data.sessionId);
                bc2.authentication.profileId = result2.data.profileId;
              }
              if (callerCallback) {
                callerCallback(result2);
              }
            }
          };
          bc2.brainCloudManager.sendRequest(request);
        };
        bc2.invokeRawAPI = function(service, operation, data, callback) {
          var isAuthOp = false;
          if (service == bc2.SERVICE_AUTHENTICATION) {
            if (operation == bc2.authentication.OPERATION_AUTHENTICATE) {
              isAuthOp = true;
              bc2.setSessionId("");
            }
          }
          var request = {
            service,
            operation,
            data,
            callback: function(result2) {
              if (isAuthOp) {
                if (result2 && result2.status == 200) {
                  bc2.setABTestingId(result2.data.abTestingId);
                  bc2.setUserId(result2.data.userId);
                  bc2.setSessionId(result2.data._sessionId);
                }
              }
              if (callback) {
                callback(result2);
              }
            }
          };
          bc2.brainCloudManager.sendRequest(request);
        };
      }
      BCAuthentication.apply(
        window.brainCloudClient = window.brainCloudClient || {}
      );
      function BCBlockchain() {
        var bc2 = this;
        bc2.blockchain = {};
        bc2.SERVICE_BLOCKCHAIN = "blockchain";
        bc2.blockchain.OPERATION_GET_BLOCKCHAIN_ITEMS = "GET_BLOCKCHAIN_ITEMS";
        bc2.blockchain.OPERATION_GET_UNIQS = "GET_UNIQS";
        bc2.blockchain.getBlockchainItems = function(integrationId, contextJson, callback) {
          var message = {
            integrationId,
            contextJson
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_BLOCKCHAIN,
            operation: bc2.blockchain.OPERATION_GET_BLOCKCHAIN_ITEMS,
            data: message,
            callback
          });
        };
        bc2.blockchain.getUniqs = function(integrationId, contextJson, callback) {
          var message = {
            integrationId,
            contextJson
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_BLOCKCHAIN,
            operation: bc2.blockchain.OPERATION_GET_UNIQS,
            data: message,
            callback
          });
        };
      }
      function BCCampaign() {
        var bc2 = this;
        bc2.campaign = {};
        bc2.SERVICE_CAMPAIGN = "campaign";
        bc2.campaign.OPERATION_GET_MY_CAMPAIGNS = "GET_MY_CAMPAIGNS";
        bc2.campaign.getMyCampaigns = function(optionsJson, callback) {
          var data = {
            optionsJson
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CAMPAIGN,
            operation: bc2.campaign.OPERATION_GET_MY_CAMPAIGNS,
            data,
            callback
          });
        };
      }
      BCCampaign.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCChat() {
        var bc2 = this;
        bc2.chat = {};
        bc2.SERVICE_CHAT = "chat";
        bc2.chat.OPERATION_CHANNEL_CONNECT = "CHANNEL_CONNECT";
        bc2.chat.OPERATION_CHANNEL_DISCONNECT = "CHANNEL_DISCONNECT";
        bc2.chat.OPERATION_DELETE_CHAT_MESSAGE = "DELETE_CHAT_MESSAGE";
        bc2.chat.OPERATION_GET_CHANNEL_ID = "GET_CHANNEL_ID";
        bc2.chat.OPERATION_GET_CHANNEL_INFO = "GET_CHANNEL_INFO";
        bc2.chat.OPERATION_GET_CHAT_MESSAGE = "GET_CHAT_MESSAGE";
        bc2.chat.OPERATION_GET_RECENT_CHAT_MESSAGES = "GET_RECENT_CHAT_MESSAGES";
        bc2.chat.OPERATION_GET_SUBSCRIBED_CHANNELS = "GET_SUBSCRIBED_CHANNELS";
        bc2.chat.OPERATION_POST_CHAT_MESSAGE = "POST_CHAT_MESSAGE";
        bc2.chat.OPERATION_UPDATE_CHAT_MESSAGE = "UPDATE_CHAT_MESSAGE";
        bc2.chat.channelConnect = function(channelId, maxReturn, callback) {
          var message = {
            channelId,
            maxReturn
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CHAT,
            operation: bc2.chat.OPERATION_CHANNEL_CONNECT,
            data: message,
            callback
          });
        };
        bc2.chat.channelDisconnect = function(channelId, callback) {
          var message = {
            channelId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CHAT,
            operation: bc2.chat.OPERATION_CHANNEL_DISCONNECT,
            data: message,
            callback
          });
        };
        bc2.chat.deleteChatMessage = function(channelId, msgId, version, callback) {
          var message = {
            channelId,
            msgId,
            version
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CHAT,
            operation: bc2.chat.OPERATION_DELETE_CHAT_MESSAGE,
            data: message,
            callback
          });
        };
        bc2.chat.getChannelId = function(channelType, channelSubId, callback) {
          var message = {
            channelType,
            channelSubId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CHAT,
            operation: bc2.chat.OPERATION_GET_CHANNEL_ID,
            data: message,
            callback
          });
        };
        bc2.chat.getChannelInfo = function(channelId, callback) {
          var message = {
            channelId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CHAT,
            operation: bc2.chat.OPERATION_GET_CHANNEL_INFO,
            data: message,
            callback
          });
        };
        bc2.chat.getChatMessage = function(channelId, msgId, callback) {
          var message = {
            channelId,
            msgId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CHAT,
            operation: bc2.chat.OPERATION_GET_CHAT_MESSAGE,
            data: message,
            callback
          });
        };
        bc2.chat.getRecentChatMessages = function(channelId, maxReturn, callback) {
          var message = {
            channelId,
            maxReturn
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CHAT,
            operation: bc2.chat.OPERATION_GET_RECENT_CHAT_MESSAGES,
            data: message,
            callback
          });
        };
        bc2.chat.getSubscribedChannels = function(channelType, callback) {
          var message = {
            channelType
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CHAT,
            operation: bc2.chat.OPERATION_GET_SUBSCRIBED_CHANNELS,
            data: message,
            callback
          });
        };
        bc2.chat.postChatMessage = function(channelId, content, recordInHistory, callback) {
          var message = {
            channelId,
            content,
            recordInHistory
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CHAT,
            operation: bc2.chat.OPERATION_POST_CHAT_MESSAGE,
            data: message,
            callback
          });
        };
        bc2.chat.postChatMessageSimple = function(channelId, text, recordInHistory, callback) {
          var message = {
            channelId,
            content: {
              text
            },
            recordInHistory
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CHAT,
            operation: bc2.chat.OPERATION_POST_CHAT_MESSAGE,
            data: message,
            callback
          });
        };
        bc2.chat.updateChatMessage = function(channelId, msgId, version, content, callback) {
          var message = {
            channelId,
            msgId,
            version,
            content
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CHAT,
            operation: bc2.chat.OPERATION_UPDATE_CHAT_MESSAGE,
            data: message,
            callback
          });
        };
      }
      BCChat.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCCustomEntity() {
        var bc2 = this;
        bc2.customEntity = {};
        bc2.SERVICE_CUSTOM_ENTITY = "customEntity";
        bc2.customEntity.OPERATION_CREATE = "CREATE_ENTITY";
        bc2.customEntity.OPERATION_GET_COUNT = "GET_COUNT";
        bc2.customEntity.OPERATION_GET_PAGE = "GET_PAGE";
        bc2.customEntity.OPERATION_GET_RANDOM_ENTITIES_MATCHING = "GET_RANDOM_ENTITIES_MATCHING";
        bc2.customEntity.OPERATION_GET_PAGE_OFFSET = "GET_PAGE_BY_OFFSET";
        bc2.customEntity.OPERATION_GET_ENTITY_PAGE = "GET_ENTITY_PAGE";
        bc2.customEntity.OPERATION_GET_ENTITY_PAGE_OFFSET = "GET_ENTITY_PAGE_OFFSET";
        bc2.customEntity.OPERATION_READ_ENTITY = "READ_ENTITY";
        bc2.customEntity.OPERATION_UPDATE_ENTITY = "UPDATE_ENTITY";
        bc2.customEntity.OPERATION_UPDATE_ENTITY_FIELDS = "UPDATE_ENTITY_FIELDS";
        bc2.customEntity.OPERATION_UPDATE_ENTITY_FIELDS_SHARDED = "UPDATE_ENTITY_FIELDS_SHARDED";
        bc2.customEntity.OPERATION_DELETE_ENTITY = "DELETE_ENTITY";
        bc2.customEntity.OPERATION_DELETE_ENTITIES = "DELETE_ENTITIES";
        bc2.customEntity.OPERATION_DELETE_SINGLETON = "DELETE_SINGLETON";
        bc2.customEntity.OPERATION_READ_SINGLETON = "READ_SINGLETON";
        bc2.customEntity.OPERATION_INCREMENT_SINGLETON_DATA = "INCREMENT_SINGLETON_DATA";
        bc2.customEntity.OPERATION_UPDATE_SINGLETON = "UPDATE_SINGLETON";
        bc2.customEntity.OPERATION_UPDATE_SINGLETON_FIELDS = "UPDATE_SINGLETON_FIELDS";
        bc2.customEntity.createEntity = function(entityType, dataJson, acl, timeToLive, isOwned, callback) {
          var message = {
            entityType,
            dataJson,
            timeToLive,
            isOwned
          };
          if (acl) {
            message["acl"] = acl;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_CREATE,
            data: message,
            callback
          });
        };
        bc2.customEntity.getCount = function(entityType, whereJson, callback) {
          var message = {
            entityType,
            whereJson
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_GET_COUNT,
            data: message,
            callback
          });
        };
        bc2.customEntity.getRandomEntitiesMatching = function(entityType, whereJson, maxReturn, callback) {
          var message = {
            entityType,
            whereJson,
            maxReturn
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_GET_RANDOM_ENTITIES_MATCHING,
            data: message,
            callback
          });
        };
        bc2.customEntity.getEntityPage = function(entityType, context, callback) {
          var message = {
            entityType,
            context
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_GET_ENTITY_PAGE,
            data: message,
            callback
          });
        };
        bc2.customEntity.getEntityPageOffset = function(entityType, context, pageOffset, callback) {
          var message = {
            entityType,
            context,
            pageOffset
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_GET_ENTITY_PAGE_OFFSET,
            data: message,
            callback
          });
        };
        bc2.customEntity.readEntity = function(entityType, entityId, callback) {
          var message = {
            entityType,
            entityId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_READ_ENTITY,
            data: message,
            callback
          });
        };
        bc2.customEntity.updateEntity = function(entityType, entityId, version, dataJson, acl, timeToLive, callback) {
          var message = {
            entityType,
            entityId,
            version,
            timeToLive
          };
          if (dataJson) message.dataJson = dataJson;
          if (acl) message.acl = acl;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_UPDATE_ENTITY,
            data: message,
            callback
          });
        };
        bc2.customEntity.updateEntityFields = function(entityType, entityId, version, fieldsJson, callback) {
          var message = {
            entityType,
            entityId,
            version
          };
          if (fieldsJson) message.fieldsJson = fieldsJson;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_UPDATE_ENTITY_FIELDS,
            data: message,
            callback
          });
        };
        bc2.customEntity.updateEntityFieldsSharded = function(entityType, entityId, version, fieldsJson, shardKeyJson, callback) {
          var message = {
            entityType,
            entityId,
            version
          };
          if (fieldsJson) message.fieldsJson = fieldsJson;
          if (shardKeyJson) message.shardKeyJson = shardKeyJson;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_UPDATE_ENTITY_FIELDS_SHARDED,
            data: message,
            callback
          });
        };
        bc2.customEntity.deleteEntities = function(entityType, deleteCriteria, callback) {
          var message = {
            entityType,
            deleteCriteria
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_DELETE_ENTITIES,
            data: message,
            callback
          });
        };
        bc2.customEntity.deleteSingleton = function(entityType, version, callback) {
          var message = {
            entityType,
            version
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_DELETE_SINGLETON,
            data: message,
            callback
          });
        };
        bc2.customEntity.readSingleton = function(entityType, callback) {
          var message = {
            entityType
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_READ_SINGLETON,
            data: message,
            callback
          });
        };
        bc2.customEntity.incrementSingletonData = function(entityType, fieldsJson, callback) {
          var message = {
            entityType,
            fieldsJson
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_INCREMENT_SINGLETON_DATA,
            data: message,
            callback
          });
        };
        bc2.customEntity.updateSingleton = function(entityType, version, dataJson, acl, timeToLive, callback) {
          var message = {
            entityType,
            version,
            dataJson,
            acl,
            timeToLive
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_UPDATE_SINGLETON,
            data: message,
            callback
          });
        };
        bc2.customEntity.updateSingletonFields = function(entityType, version, fieldsJson, callback) {
          var message = {
            entityType,
            version,
            fieldsJson
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_UPDATE_SINGLETON_FIELDS,
            data: message,
            callback
          });
        };
        bc2.customEntity.incrementData = function(entityType, entityId, fieldsJson, callback) {
          var message = {
            entityType,
            entityId,
            fieldsJson
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_INCREMENT_DATA,
            data: message,
            callback
          });
        };
        bc2.customEntity.deleteEntity = function(entityType, entityId, version, callback) {
          var message = {
            entityType,
            entityId,
            version
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_CUSTOM_ENTITY,
            operation: bc2.customEntity.OPERATION_DELETE_ENTITY,
            data: message,
            callback
          });
        };
      }
      BCCustomEntity.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCDataStream() {
        var bc2 = this;
        bc2.dataStream = {};
        bc2.SERVICE_DATA_STREAM = "dataStream";
        bc2.dataStream.OPERATION_CUSTOM_PAGE_EVENT = "CUSTOM_PAGE_EVENT";
        bc2.dataStream.OPERATION_CUSTOM_SCREEN_EVENT = "CUSTOM_SCREEN_EVENT";
        bc2.dataStream.OPERATION_CUSTOM_TRACK_EVENT = "CUSTOM_TRACK_EVENT";
        bc2.dataStream.OPERATION_SUBMIT_CRASH_REPORT = "SEND_CRASH_REPORT";
        bc2.dataStream.customPageEvent = function(eventName, eventProperties, callback) {
          var message = {
            eventName
          };
          if (eventProperties) {
            message["eventProperties"] = eventProperties;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_DATA_STREAM,
            operation: bc2.dataStream.OPERATION_CUSTOM_PAGE_EVENT,
            data: message,
            callback
          });
        };
        bc2.dataStream.customScreenEvent = function(eventName, eventProperties, callback) {
          var message = {
            eventName
          };
          if (eventProperties) {
            message["eventProperties"] = eventProperties;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_DATA_STREAM,
            operation: bc2.dataStream.OPERATION_CUSTOM_SCREEN_EVENT,
            data: message,
            callback
          });
        };
        bc2.dataStream.customTrackEvent = function(eventName, eventProperties, callback) {
          var message = {
            eventName
          };
          if (eventProperties) {
            message["eventProperties"] = eventProperties;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_DATA_STREAM,
            operation: bc2.dataStream.OPERATION_CUSTOM_TRACK_EVENT,
            data: message,
            callback
          });
        };
        bc2.dataStream.submitCrashReport = function(crashType, errorMsg, crashJson, crashLog, userName, userEmail, userNotes, userSubmitted, callback) {
          var message = {
            crashType,
            errorMsg,
            crashJson,
            crashLog,
            userName,
            userEmail,
            userNotes,
            userSubmitted
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_DATA_STREAM,
            operation: bc2.dataStream.OPERATION_SUBMIT_CRASH_REPORT,
            data: message,
            callback
          });
        };
      }
      BCDataStream.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCEntity() {
        var bc2 = this;
        bc2.entity = {};
        bc2.SERVICE_ENTITY = "entity";
        bc2.entity.OPERATION_READ = "READ";
        bc2.entity.OPERATION_CREATE = "CREATE";
        bc2.entity.OPERATION_READ_BY_TYPE = "READ_BY_TYPE";
        bc2.entity.OPERATION_READ_SHARED = "READ_SHARED";
        bc2.entity.OPERATION_READ_SHARED_ENTITY = "READ_SHARED_ENTITY";
        bc2.entity.OPERATION_READ_SINGLETON = "READ_SINGLETON";
        bc2.entity.OPERATION_UPDATE = "UPDATE";
        bc2.entity.OPERATION_UPDATE_SHARED = "UPDATE_SHARED";
        bc2.entity.OPERATION_UPDATE_SINGLETON = "UPDATE_SINGLETON";
        bc2.entity.OPERATION_UPDATE_PARTIAL = "UPDATE_PARTIAL";
        bc2.entity.OPERATION_DELETE = "DELETE";
        bc2.entity.OPERATION_DELETE_SINGLETON = "DELETE_SINGLETON";
        bc2.entity.OPERATION_GET_LIST = "GET_LIST";
        bc2.entity.OPERATION_GET_LIST_COUNT = "GET_LIST_COUNT";
        bc2.entity.OPERATION_GET_PAGE = "GET_PAGE";
        bc2.entity.OPERATION_GET_PAGE_BY_OFFSET = "GET_PAGE_BY_OFFSET";
        bc2.entity.OPERATION_READ_SHARED_ENTITIES_LIST = "READ_SHARED_ENTITIES_LIST";
        bc2.entity.OPERATION_INCREMENT_USER_ENTITY_DATA = "INCREMENT_USER_ENTITY_DATA";
        bc2.entity.OPERATION_INCREMENT_SHARED_USER_ENTITY_DATA = "INCREMENT_SHARED_USER_ENTITY_DATA";
        bc2.entity.createEntity = function(entityType, data, acl, callback) {
          var message = {
            entityType,
            data
          };
          if (acl) {
            message["acl"] = acl;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_CREATE,
            data: message,
            callback
          });
        };
        bc2.entity.getEntity = function(entityId, callback) {
          var message = {
            entityId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_READ,
            data: message,
            callback
          });
        };
        bc2.entity.getEntitiesByType = function(entityType, callback) {
          var message = {
            entityType
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_READ_BY_TYPE,
            data: message,
            callback
          });
        };
        bc2.entity.getSharedEntityForProfileId = function(profileId, entityId, callback) {
          var message = {
            targetPlayerId: profileId,
            entityId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_READ_SHARED_ENTITY,
            data: message,
            callback
          });
        };
        bc2.entity.getSharedEntitiesForProfileId = function(profileId, callback) {
          var message = {
            targetPlayerId: profileId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_READ_SHARED,
            data: message,
            callback
          });
        };
        bc2.entity.getSharedEntitiesListForProfileId = function(profileId, where, orderBy, maxReturn, callback) {
          var message = {
            targetPlayerId: profileId,
            maxReturn
          };
          if (where) message.where = where;
          if (orderBy) message.orderBy = orderBy;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_READ_SHARED_ENTITIES_LIST,
            data: message,
            callback
          });
        };
        bc2.entity.updateEntity = function(entityId, entityType, data, acl, version, callback) {
          var message = {
            entityId,
            data,
            version
          };
          if (entityType) {
            message["entityType"] = entityType;
          }
          if (acl) {
            message["acl"] = acl;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_UPDATE,
            data: message,
            callback
          });
        };
        bc2.entity.updateSharedEntity = function(entityId, targetProfileId, entityType, data, version, callback) {
          var message = {
            targetPlayerId: targetProfileId,
            entityId,
            data,
            version
          };
          if (entityType) {
            message["entityType"] = entityType;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_UPDATE_SHARED,
            data: message,
            callback
          });
        };
        bc2.entity.updateSingleton = function(entityType, data, acl, version, callback) {
          var message = {
            entityType,
            data,
            version
          };
          if (acl) {
            message["acl"] = acl;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_UPDATE_SINGLETON,
            data: message,
            callback
          });
        };
        bc2.entity.getSingleton = function(entityType, callback) {
          var message = {
            entityType
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_READ_SINGLETON,
            data: message,
            callback
          });
        };
        bc2.entity.deleteEntity = function(entityId, version, callback) {
          var message = {
            entityId,
            version
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_DELETE,
            data: message,
            callback
          });
        };
        bc2.entity.deleteSingleton = function(entityType, version, callback) {
          var message = {
            entityType,
            version
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_DELETE_SINGLETON,
            data: message,
            callback
          });
        };
        bc2.entity.getList = function(whereJson, orderByJson, maxReturn, callback) {
          var message = {
            where: whereJson,
            maxReturn
          };
          if (orderByJson) {
            message.orderBy = orderByJson;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_GET_LIST,
            data: message,
            callback
          });
        };
        bc2.entity.getListCount = function(whereJson, callback) {
          var message = {
            where: whereJson
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_GET_LIST_COUNT,
            data: message,
            callback
          });
        };
        bc2.entity.getPage = function(context, callback) {
          var message = {
            context
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_GET_PAGE,
            data: message,
            callback
          });
        };
        bc2.entity.getPageOffset = function(context, pageOffset, callback) {
          var message = {
            context,
            pageOffset
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_GET_PAGE_BY_OFFSET,
            data: message,
            callback
          });
        };
        bc2.entity.incrementUserEntityData = function(entityId, data, callback) {
          var message = {
            entityId,
            data
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_INCREMENT_USER_ENTITY_DATA,
            data: message,
            callback
          });
        };
        bc2.entity.incrementSharedUserEntityData = function(entityId, targetProfileId, data, callback) {
          var message = {
            entityId,
            targetPlayerId: targetProfileId,
            data
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ENTITY,
            operation: bc2.entity.OPERATION_INCREMENT_SHARED_USER_ENTITY_DATA,
            data: message,
            callback
          });
        };
      }
      BCEntity.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCEvents() {
        var bc2 = this;
        bc2.event = {};
        bc2.SERVICE_EVENT = "event";
        bc2.event.OPERATION_SEND = "SEND";
        bc2.event.OPERATION_SEND_EVENT_TO_PROFILES = "SEND_EVENT_TO_PROFILES";
        bc2.event.OPERATION_UPDATE_EVENT_DATA = "UPDATE_EVENT_DATA";
        bc2.event.OPERATION_UPDATE_EVENT_DATA_IF_EXISTS = "UPDATE_EVENT_DATA_IF_EXISTS";
        bc2.event.OPERATION_DELETE_INCOMING = "DELETE_INCOMING";
        bc2.event.OPERATION_DELETE_SENT = "DELETE_SENT";
        bc2.event.OPERATION_GET_EVENTS = "GET_EVENTS";
        bc2.event.OPERATION_DELETE_INCOMING_EVENTS = "DELETE_INCOMING_EVENTS";
        bc2.event.OPERATION_DELETE_INCOMING_EVENTS_OLDER_THAN = "DELETE_INCOMING_EVENTS_OLDER_THAN";
        bc2.event.OPERATION_DELETE_INCOMING_EVENTS_BY_TYPE_OLDER_THAN = "DELETE_INCOMING_EVENTS_BY_TYPE_OLDER_THAN";
        bc2.event.sendEvent = function(toProfileId, eventType, eventData, callback) {
          var message = {
            toId: toProfileId,
            eventType,
            eventData
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_EVENT,
            operation: bc2.event.OPERATION_SEND,
            data: message,
            callback
          });
        };
        bc2.event.sendEventToProfiles = function(toIds, eventType, eventData, callback) {
          var data = {
            toIds,
            eventType,
            evemtData: eventData
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_EVENT,
            operation: bc2.event.OPERATION_SEND_EVENT_TO_PROFILES,
            data,
            callback
          });
        };
        bc2.event.updateIncomingEventData = function(evId, eventData, callback) {
          var message = {
            evId,
            eventData
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_EVENT,
            operation: bc2.event.OPERATION_UPDATE_EVENT_DATA,
            data: message,
            callback
          });
        };
        bc2.event.updateIncomingEventDataIfExists = function(evId, eventData, callback) {
          var message = {
            evId,
            eventData
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_EVENT,
            operation: bc2.event.OPERATION_UPDATE_EVENT_DATA_IF_EXISTS,
            data: message,
            callback
          });
        };
        bc2.event.deleteIncomingEvent = function(evId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_EVENT,
            operation: bc2.event.OPERATION_DELETE_INCOMING,
            data: {
              evId
            },
            callback
          });
        };
        bc2.event.getEvents = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_EVENT,
            operation: bc2.event.OPERATION_GET_EVENTS,
            data: null,
            callback
          });
        };
        bc2.event.deleteIncomingEvents = function(evIds, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_EVENT,
            operation: bc2.event.OPERATION_DELETE_INCOMING_EVENTS,
            data: {
              evIds
            },
            callback
          });
        };
        bc2.event.DeleteIncomingEventsByTypeOlderThan = function(eventType, dateMillis, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_EVENT,
            operation: bc2.event.OPERATION_DELETE_INCOMING_EVENTS_OLDER_THAN,
            data: {
              eventType,
              dateMillis
            },
            callback
          });
        };
        bc2.event.deleteIncomingEventsOlderThan = function(dateMillis, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_EVENT,
            operation: bc2.event.OPERATION_DELETE_INCOMING_EVENTS_OLDER_THAN,
            data: {
              dateMillis
            },
            callback
          });
        };
      }
      BCEvents.apply(window.brainCloudClient = window.brainCloudClient || {});
      if (typeof window === "undefined" || window === null) {
        window = {};
      }
      if (!window.FormData) {
        window.FormData = require_form_data();
        FormData = window.FormData;
      }
      function BCFile() {
        var bc2 = this;
        bc2.file = {};
        bc2.SERVICE_FILE = "file";
        bc2.file.OPERATION_PREPARE_USER_UPLOAD = "PREPARE_USER_UPLOAD";
        bc2.file.OPERATION_LIST_USER_FILES = "LIST_USER_FILES";
        bc2.file.OPERATION_DELETE_USER_FILES = "DELETE_USER_FILES";
        bc2.file.OPERATION_GET_CDN_URL = "GET_CDN_URL";
        bc2.file.prepareUserUpload = function(cloudPath, cloudFilename, shareable, replaceIfExists, fileSize, callback) {
          var message = {
            cloudPath,
            cloudFilename,
            shareable,
            replaceIfExists,
            fileSize
            // not used in js -- localPath : localPath
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FILE,
            operation: bc2.file.OPERATION_PREPARE_USER_UPLOAD,
            data: message,
            callback
          });
        };
        bc2.file.uploadFile = function(xhr, file, uploadId, peerCode) {
          var url = bc2.brainCloudManager.getFileUploadUrl();
          var fd = new FormData();
          var fileSize = file.size;
          xhr.open("POST", url, true);
          fd.append("sessionId", bc2.brainCloudManager.getSessionId());
          if (peerCode !== void 0) fd.append("peerCode", peerCode);
          fd.append("uploadId", uploadId);
          fd.append("fileSize", fileSize);
          fd.append("uploadFile", file);
          xhr.send(fd);
        };
        bc2.file.uploadFileFromMemory = function(cloudPath, cloudFilename, shareable, replaceIfExists, fileData, callback) {
          var fileSize = fileData.length ? fileData.length : fileData.size;
          var message = {
            cloudPath,
            cloudFilename,
            shareable,
            replaceIfExists,
            fileSize
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FILE,
            operation: bc2.file.OPERATION_PREPARE_USER_UPLOAD,
            data: message,
            callback: function(prepareResult) {
              if (prepareResult.status && prepareResult.status == 200) {
                var formData = new FormData();
                formData.append("sessionId", bc2.brainCloudManager._sessionId);
                formData.append("uploadId", prepareResult.data.fileDetails.uploadId);
                formData.append("fileSize", fileSize);
                formData.append("uploadFile", fileData, { filename: cloudFilename });
                if (formData.submit) {
                  formData.submit(
                    bc2.brainCloudManager._fileUploadUrl,
                    function(err, res) {
                      if (res.statusCode != 200) {
                        if (callback)
                          callback({
                            reasonCode: res.statusCode,
                            errorMessage: res.statusMessage
                          });
                      } else {
                        if (callback) callback(prepareResult);
                      }
                      res.resume();
                    }
                  );
                } else {
                  var xhr;
                  if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                  } else {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                  }
                  xhr.onreadystatechange = function() {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                      if (xhr.status == 200) {
                        if (callback) callback(prepareResult);
                      } else {
                        reasonCode = 0;
                        statusMessage = "";
                        try {
                          var errorResponse = JSON.parse(xhr.responseText);
                          if (errorResponse["reason_code"]) {
                            reasonCode = errorResponse["reason_code"];
                          }
                          if (errorResponse["status_message"]) {
                            statusMessage = errorResponse["status_message"];
                          } else {
                            statusMessage = xhr.responseText;
                          }
                        } catch (e) {
                          reasonCode = 0;
                          statusMessage = xhr.responseText;
                        }
                        if (callback)
                          callback({
                            reasonCode,
                            errorMessage: statusMessage
                          });
                      }
                    }
                  };
                  xhr.open("POST", bc2.brainCloudManager._fileUploadUrl, true);
                  xhr.send(formData);
                }
              } else {
                if (callback) callback(result);
              }
            }
          });
        };
        bc2.file.listUserFiles = function(cloudPath, recurse, callback) {
          var message = {};
          if (cloudPath != null) {
            message.cloudPath = cloudPath;
          }
          if (recurse != null) {
            message.recurse = recurse;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FILE,
            operation: bc2.file.OPERATION_LIST_USER_FILES,
            data: message,
            callback
          });
        };
        bc2.file.deleteUserFile = function(cloudPath, cloudFilename, callback) {
          var message = {
            cloudPath,
            cloudFilename
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FILE,
            operation: bc2.file.OPERATION_DELETE_USER_FILES,
            data: message,
            callback
          });
        };
        bc2.file.deleteUserFiles = function(cloudPath, recurse, callback) {
          var message = {
            cloudPath,
            recurse
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FILE,
            operation: bc2.file.OPERATION_DELETE_USER_FILES,
            data: message,
            callback
          });
        };
        bc2.file.getCDNUrl = function(cloudPath, cloudFilename, callback) {
          var message = {
            cloudPath,
            cloudFilename
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FILE,
            operation: bc2.file.OPERATION_GET_CDN_URL,
            data: message,
            callback
          });
        };
      }
      BCFile.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCFriend() {
        var bc2 = this;
        bc2.friend = {};
        bc2.SERVICE_FRIEND = "friend";
        bc2.friend.OPERATION_GET_FRIEND_PROFILE_INFO_FOR_EXTERNAL_ID = "GET_FRIEND_PROFILE_INFO_FOR_EXTERNAL_ID";
        bc2.friend.OPERATION_GET_PROFILE_INFO_FOR_CREDENTIAL = "GET_PROFILE_INFO_FOR_CREDENTIAL";
        bc2.friend.OPERATION_GET_PROFILE_INFO_FOR_CREDENTIAL_IF_EXISTS = "GET_PROFILE_INFO_FOR_CREDENTIAL_IF_EXISTS";
        bc2.friend.OPERATION_GET_PROFILE_INFO_FOR_EXTERNAL_AUTH_ID = "GET_PROFILE_INFO_FOR_EXTERNAL_AUTH_ID";
        bc2.friend.OPERATION_GET_PROFILE_INFO_FOR_EXTERNAL_AUTH_ID_IF_EXISTS = "GET_PROFILE_INFO_FOR_EXTERNAL_AUTH_ID_IF_EXISTS";
        bc2.friend.OPERATION_GET_EXTERNAL_ID_FOR_PROFILE_ID = "GET_EXTERNAL_ID_FOR_PROFILE_ID";
        bc2.friend.OPERATION_READ_FRIENDS = "READ_FRIENDS";
        bc2.friend.OPERATION_READ_FRIEND_ENTITY = "READ_FRIEND_ENTITY";
        bc2.friend.OPERATION_READ_FRIENDS_ENTITIES = "READ_FRIENDS_ENTITIES";
        bc2.friend.OPERATION_READ_FRIEND_PLAYER_STATE = "READ_FRIEND_PLAYER_STATE";
        bc2.friend.OPERATION_READ_FRIENDS_WITH_APPLICATION = "READ_FRIENDS_WITH_APPLICATION";
        bc2.friend.OPERATION_FIND_PLAYER_BY_NAME = "FIND_PLAYER_BY_NAME";
        bc2.friend.OPERATION_FIND_PLAYER_BY_UNIVERSAL_ID = "FIND_PLAYER_BY_UNIVERSAL_ID";
        bc2.friend.OPERATION_LIST_FRIENDS = "LIST_FRIENDS";
        bc2.friend.OPERATION_GET_MY_SOCIAL_INFO = "GET_MY_SOCIAL_INFO";
        bc2.friend.OPERATION_ADD_FRIENDS = "ADD_FRIENDS";
        bc2.friend.OPERATION_ADD_FRIENDS_FROM_PLATFORM = "ADD_FRIENDS_FROM_PLATFORM";
        bc2.friend.OPERATION_REMOVE_FRIENDS = "REMOVE_FRIENDS";
        bc2.friend.OPERATION_GET_SUMMARY_DATA_FOR_PROFILE_ID = "GET_SUMMARY_DATA_FOR_PROFILE_ID";
        bc2.friend.OPERATION_GET_USERS_ONLINE_STATUS = "GET_USERS_ONLINE_STATUS";
        bc2.friend.OPERATION_FIND_USERS_BY_EXACT_NAME = "FIND_USERS_BY_EXACT_NAME";
        bc2.friend.OPERATION_FIND_USERS_BY_SUBSTR_NAME = "FIND_USERS_BY_SUBSTR_NAME";
        bc2.friend.OPERATION_FIND_USERS_BY_NAME_STARTING_WITH = "FIND_USERS_BY_NAME_STARTING_WITH";
        bc2.friend.OPERATION_FIND_USERS_BY_UNIVERSAL_ID_STARTING_WITH = "FIND_USERS_BY_UNIVERSAL_ID_STARTING_WITH";
        bc2.friend.OPERATION_FIND_USER_BY_EXACT_UNIVERSAL_ID = "FIND_USER_BY_EXACT_UNIVERSAL_ID";
        bc2.friend.friendPlatform = Object.freeze({
          All: "All",
          BrainCloud: "brainCloud",
          Facebook: "Facebook"
        });
        bc2.friend.getProfileInfoForCredential = function(externalId, authenticationType, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_GET_PROFILE_INFO_FOR_CREDENTIAL,
            data: {
              externalId,
              authenticationType
            },
            callback
          });
        };
        bc2.friend.getProfileInfoForCredentialIfExists = function(externalId, authenticationType, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_GET_PROFILE_INFO_FOR_CREDENTIAL_IF_EXISTS,
            data: {
              externalId,
              authenticationType
            },
            callback
          });
        };
        bc2.friend.getProfileInfoForExternalAuthId = function(externalId, externalAuthType, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_GET_PROFILE_INFO_FOR_EXTERNAL_AUTH_ID,
            data: {
              externalId,
              externalAuthType
            },
            callback
          });
        };
        bc2.friend.getProfileInfoForExternalAuthIdIfExists = function(externalId, externalAuthType, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_GET_PROFILE_INFO_FOR_EXTERNAL_AUTH_ID_IF_EXISTS,
            data: {
              externalId,
              externalAuthType
            },
            callback
          });
        };
        bc2.friend.getExternalIdForProfileId = function(profileId, authenticationType, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_GET_EXTERNAL_ID_FOR_PROFILE_ID,
            data: {
              profileId,
              authenticationType
            },
            callback
          });
        };
        bc2.friend.readFriendEntity = function(friendId, entityId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_READ_FRIEND_ENTITY,
            data: {
              friendId,
              entityId
            },
            callback
          });
        };
        bc2.friend.readFriendsEntities = function(entityType, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_READ_FRIENDS_ENTITIES,
            data: {
              entityType
            },
            callback
          });
        };
        bc2.friend.readFriendUserState = function(friendId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_READ_FRIEND_PLAYER_STATE,
            data: {
              friendId
            },
            callback
          });
        };
        bc2.friend.findUsersByExactName = function(searchText, maxResults, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_FIND_USERS_BY_EXACT_NAME,
            data: {
              searchText,
              maxResults
            },
            callback
          });
        };
        bc2.friend.findUsersBySubstrName = function(searchText, maxResults, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_FIND_USERS_BY_SUBSTR_NAME,
            data: {
              searchText,
              maxResults
            },
            callback
          });
        };
        bc2.friend.findUserByExactUniversalId = function(searchText, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_FIND_USER_BY_EXACT_UNIVERSAL_ID,
            data: {
              searchText
            },
            callback
          });
        };
        bc2.friend.listFriends = function(friendPlatform, includeSummaryData, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_LIST_FRIENDS,
            data: {
              friendPlatform,
              includeSummaryData
            },
            callback
          });
        };
        bc2.friend.getMySocialInfo = function(friendPlatform, includeSummaryData, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_GET_MY_SOCIAL_INFO,
            data: {
              friendPlatform,
              includeSummaryData
            },
            callback
          });
        };
        bc2.friend.addFriends = function(profileIds, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_ADD_FRIENDS,
            data: {
              profileIds
            },
            callback
          });
        };
        bc2.friend.addFriendsFromPlatform = function(friendPlatform, mode, externalIds, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_ADD_FRIENDS_FROM_PLATFORM,
            data: {
              friendPlatform,
              mode,
              externalIds
            },
            callback
          });
        };
        bc2.friend.removeFriends = function(profileIds, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_REMOVE_FRIENDS,
            data: {
              profileIds
            },
            callback
          });
        };
        bc2.friend.getSummaryDataForProfileId = function(profileId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_GET_SUMMARY_DATA_FOR_PROFILE_ID,
            data: {
              profileId
            },
            callback
          });
        };
        bc2.friend.getUsersOnlineStatus = function(profileIds, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_GET_USERS_ONLINE_STATUS,
            data: {
              profileIds
            },
            callback
          });
        };
        bc2.friend.findUsersByNameStartingWith = function(searchText, maxResults, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_FIND_USERS_BY_NAME_STARTING_WITH,
            data: {
              searchText,
              maxResults
            },
            callback
          });
        };
        bc2.friend.findUsersByUniversalIdStartingWith = function(searchText, maxResults, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_FRIEND,
            operation: bc2.friend.OPERATION_FIND_USERS_BY_UNIVERSAL_ID_STARTING_WITH,
            data: {
              searchText,
              maxResults
            },
            callback
          });
        };
      }
      BCFriend.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCGamification() {
        var bc2 = this;
        bc2.gamification = {};
        bc2.gamification.SERVICE_GAMIFICATION = "gamification";
        bc2.gamification.OPERATION_READ = "READ";
        bc2.gamification.OPERATION_READ_XP_LEVELS = "READ_XP_LEVELS";
        bc2.gamification.OPERATION_READ_ACHIEVEMENTS = "READ_ACHIEVEMENTS";
        bc2.gamification.OPERATION_READ_ACHIEVED_ACHIEVEMENTS = "READ_ACHIEVED_ACHIEVEMENTS";
        bc2.gamification.OPERATION_AWARD_ACHIEVEMENTS = "AWARD_ACHIEVEMENTS";
        bc2.gamification.OPERATION_READ_MILESTONES = "READ_MILESTONES";
        bc2.gamification.OPERATION_READ_MILESTONES_BY_CATEGORY = "READ_MILESTONES_BY_CATEGORY";
        bc2.gamification.OPERATION_READ_COMPLETED_MILESTONES = "READ_COMPLETED_MILESTONES";
        bc2.gamification.OPERATION_READ_IN_PROGRESS_MILESTONES = "READ_IN_PROGRESS_MILESTONES";
        bc2.gamification.OPERATION_RESET_MILESTONES = "RESET_MILESTONES";
        bc2.gamification.OPERATION_READ_QUESTS = "READ_QUESTS";
        bc2.gamification.OPERATION_READ_QUESTS_BY_CATEGORY = "READ_QUESTS_BY_CATEGORY";
        bc2.gamification.OPERATION_READ_COMPLETED_QUESTS = "READ_COMPLETED_QUESTS";
        bc2.gamification.OPERATION_READ_IN_PROGRESS_QUESTS = "READ_IN_PROGRESS_QUESTS";
        bc2.gamification.OPERATION_READ_NOT_STARTED_QUESTS = "READ_NOT_STARTED_QUESTS";
        bc2.gamification.OPERATION_READ_QUESTS_WITH_STATUS = "READ_QUESTS_WITH_STATUS";
        bc2.gamification.OPERATION_READ_QUESTS_WITH_BASIC_PERCENTAGE = "READ_QUESTS_WITH_BASIC_PERCENTAGE";
        bc2.gamification.OPERATION_READ_QUESTS_WITH_COMPLEX_PERCENTAGE = "READ_QUESTS_WITH_COMPLEX_PERCENTAGE";
        bc2.gamification.readAllGamification = function(callback, includeMetaData) {
          var message = {};
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ,
            data: message,
            callback
          });
        };
        bc2.gamification.awardAchievements = function(achievements, callback, includeMetaData) {
          var message = {};
          message["achievements"] = achievements;
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_AWARD_ACHIEVEMENTS,
            data: message,
            callback
          });
        };
        bc2.gamification.readAchievedAchievements = function(callback, includeMetaData) {
          var message = {};
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_ACHIEVED_ACHIEVEMENTS,
            data: message,
            callback
          });
        };
        bc2.gamification.readXPLevelsMetaData = function(callback) {
          var message = {};
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_XP_LEVELS,
            callback
          });
        };
        bc2.gamification.readAchievements = function(callback, includeMetaData) {
          var message = {};
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_ACHIEVEMENTS,
            data: message,
            callback
          });
        };
        bc2.gamification.readMilestones = function(callback, includeMetaData) {
          var message = {};
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_MILESTONES,
            data: message,
            callback
          });
        };
        bc2.gamification.readMilestonesByCategory = function(category, callback, includeMetaData) {
          var message = {};
          message["category"] = category;
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_MILESTONES_BY_CATEGORY,
            data: message,
            callback
          });
        };
        bc2.gamification.readCompletedMilestones = function(callback, includeMetaData) {
          var message = {};
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_COMPLETED_MILESTONES,
            data: message,
            callback
          });
        };
        bc2.gamification.readInProgressMilestones = function(callback, includeMetaData) {
          var message = {};
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_IN_PROGRESS_MILESTONES,
            data: message,
            callback
          });
        };
        bc2.gamification.readQuests = function(callback, includeMetaData) {
          var message = {};
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_QUESTS,
            data: message,
            callback
          });
        };
        bc2.gamification.readQuestsByCategory = function(category, callback, includeMetaData) {
          var message = {};
          message["category"] = category;
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_QUESTS_BY_CATEGORY,
            data: message,
            callback
          });
        };
        bc2.gamification.readCompletedQuests = function(callback, includeMetaData) {
          var message = {};
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_COMPLETED_QUESTS,
            data: message,
            callback
          });
        };
        bc2.gamification.readInProgressQuests = function(callback, includeMetaData) {
          var message = {};
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_IN_PROGRESS_QUESTS,
            data: message,
            callback
          });
        };
        bc2.gamification.readNotStartedQuests = function(callback, includeMetaData) {
          var message = {};
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_NOT_STARTED_QUESTS,
            data: message,
            callback
          });
        };
        bc2.gamification.readQuestsWithStatus = function(callback, includeMetaData) {
          var message = {};
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_QUESTS_WITH_STATUS,
            data: message,
            callback
          });
        };
        bc2.gamification.readQuestsWithBasicPercentage = function(callback, includeMetaData) {
          var message = {};
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_QUESTS_WITH_BASIC_PERCENTAGE,
            data: message,
            callback
          });
        };
        bc2.gamification.readQuestsWithComplexPercentage = function(callback, includeMetaData) {
          var message = {};
          if (includeMetaData) {
            message["includeMetaData"] = includeMetaData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.gamification.SERVICE_GAMIFICATION,
            operation: bc2.gamification.OPERATION_READ_QUESTS_WITH_COMPLEX_PERCENTAGE,
            data: message,
            callback
          });
        };
      }
      BCGamification.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCGlobalApp() {
        var bc2 = this;
        bc2.globalApp = {};
        bc2.SERVICE_GLOBAL_APP = "globalApp";
        bc2.globalApp.OPERATION_READ_PROPERTIES = "READ_PROPERTIES";
        bc2.globalApp.OPERATION_READ_SELECTED_PROPERTIES = "READ_SELECTED_PROPERTIES";
        bc2.globalApp.OPERATION_READ_PROPERTIES_IN_CATEGORIES = "READ_PROPERTIES_IN_CATEGORIES";
        bc2.globalApp.readProperties = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_APP,
            operation: bc2.globalApp.OPERATION_READ_PROPERTIES,
            callback
          });
        };
        bc2.globalApp.readSelectedProperties = function(propertyNames, callback) {
          var message = {
            propertyNames
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_APP,
            operation: bc2.globalApp.OPERATION_READ_SELECTED_PROPERTIES,
            data: message,
            callback
          });
        };
        bc2.globalApp.readPropertiesInCategories = function(categories, callback) {
          var message = {
            categories
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_APP,
            operation: bc2.globalApp.OPERATION_READ_PROPERTIES_IN_CATEGORIES,
            data: message,
            callback
          });
        };
      }
      BCGlobalApp.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCGlobalFile() {
        var bc2 = this;
        bc2.globalFile = {};
        bc2.SERVICE_GLOBAL_FILE = "globalFileV3";
        bc2.globalFile.OPERATION_GET_FILE_INFO = "GET_FILE_INFO";
        bc2.globalFile.OPERATION_GET_FILE_INFO_SIMPLE = "GET_FILE_INFO_SIMPLE";
        bc2.globalFile.OPERATION_GET_GLOBAL_CDN_URL = "GET_GLOBAL_CDN_URL";
        bc2.globalFile.OPERATION_GET_GLOBAL_FILE_LIST = "GET_GLOBAL_FILE_LIST";
        bc2.globalFile.getFileInfo = function(fileId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_FILE,
            operation: bc2.globalFile.OPERATION_GET_FILE_INFO,
            data: {
              fileId
            },
            callback
          });
        };
        bc2.globalFile.getFileInfoSimple = function(folderPath, filename, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_FILE,
            operation: bc2.globalFile.OPERATION_GET_FILE_INFO_SIMPLE,
            data: {
              folderPath,
              filename
            },
            callback
          });
        };
        bc2.globalFile.getGlobalCDNUrl = function(fileId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_FILE,
            operation: bc2.globalFile.OPERATION_GET_GLOBAL_CDN_URL,
            data: {
              fileId
            },
            callback
          });
        };
        bc2.globalFile.getGlobalFileList = function(folderPath, recurse, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_FILE,
            operation: bc2.globalFile.OPERATION_GET_GLOBAL_FILE_LIST,
            data: {
              folderPath,
              recurse
            },
            callback
          });
        };
      }
      BCGlobalFile.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCGlobalStatistics() {
        var bc2 = this;
        bc2.globalStatistics = {};
        bc2.SERVICE_GLOBAL_GAME_STATISTICS = "globalGameStatistics";
        bc2.globalStatistics.OPERATION_READ = "READ";
        bc2.globalStatistics.OPERATION_READ_SUBSET = "READ_SUBSET";
        bc2.globalStatistics.OPERATION_READ_FOR_CATEGORY = "READ_FOR_CATEGORY";
        bc2.globalStatistics.OPERATION_UPDATE_INCREMENT = "UPDATE_INCREMENT";
        bc2.globalStatistics.OPERATION_PROCESS_STATISTICS = "PROCESS_STATISTICS";
        bc2.globalStatistics.incrementGlobalStats = function(stats, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_GAME_STATISTICS,
            operation: bc2.globalStatistics.OPERATION_UPDATE_INCREMENT,
            data: {
              statistics: stats
            },
            callback
          });
        };
        bc2.globalStatistics.readAllGlobalStats = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_GAME_STATISTICS,
            operation: bc2.globalStatistics.OPERATION_READ,
            callback
          });
        };
        bc2.globalStatistics.readGlobalStatsSubset = function(stats, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_GAME_STATISTICS,
            operation: bc2.globalStatistics.OPERATION_READ_SUBSET,
            data: {
              statistics: stats
            },
            callback
          });
        };
        bc2.globalStatistics.readGlobalStatsForCategory = function(category, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_GAME_STATISTICS,
            operation: bc2.globalStatistics.OPERATION_READ_FOR_CATEGORY,
            data: {
              category
            },
            callback
          });
        };
        bc2.globalStatistics.processStatistics = function(stats, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_GAME_STATISTICS,
            operation: bc2.globalStatistics.OPERATION_PROCESS_STATISTICS,
            data: {
              statistics: stats
            },
            callback
          });
        };
      }
      BCGlobalStatistics.apply(
        window.brainCloudClient = window.brainCloudClient || {}
      );
      function BCGlobalEntity() {
        var bc2 = this;
        bc2.globalEntity = {};
        bc2.SERVICE_GLOBAL_ENTITY = "globalEntity";
        bc2.globalEntity.OPERATION_CREATE = "CREATE";
        bc2.globalEntity.OPERATION_CREATE_WITH_INDEXED_ID = "CREATE_WITH_INDEXED_ID";
        bc2.globalEntity.OPERATION_READ = "READ";
        bc2.globalEntity.OPERATION_UPDATE = "UPDATE";
        bc2.globalEntity.OPERATION_UPDATE_ACL = "UPDATE_ACL";
        bc2.globalEntity.OPERATION_UPDATE_TIME_TO_LIVE = "UPDATE_TIME_TO_LIVE";
        bc2.globalEntity.OPERATION_DELETE = "DELETE";
        bc2.globalEntity.OPERATION_GET_LIST = "GET_LIST";
        bc2.globalEntity.OPERATION_GET_LIST_BY_INDEXED_ID = "GET_LIST_BY_INDEXED_ID";
        bc2.globalEntity.OPERATION_GET_LIST_COUNT = "GET_LIST_COUNT";
        bc2.globalEntity.OPERATION_GET_PAGE = "GET_PAGE";
        bc2.globalEntity.OPERATION_GET_PAGE_BY_OFFSET = "GET_PAGE_BY_OFFSET";
        bc2.globalEntity.OPERATION_INCREMENT_GLOBAL_ENTITY_DATA = "INCREMENT_GLOBAL_ENTITY_DATA";
        bc2.globalEntity.OPERATION_GET_RANDOM_ENTITIES_MATCHING = "GET_RANDOM_ENTITIES_MATCHING";
        bc2.globalEntity.OPERATION_UPDATE_ENTITY_INDEXED_ID = "UPDATE_INDEXED_ID";
        bc2.globalEntity.OPERATION_UPDATE_ENTITY_OWNER_AND_ACL = "UPDATE_ENTITY_OWNER_AND_ACL";
        bc2.globalEntity.OPERATION_MAKE_SYSTEM_ENTITY = "MAKE_SYSTEM_ENTITY";
        bc2.globalEntity.createEntity = function(entityType, timeToLive, acl, data, callback) {
          var message = {
            entityType,
            timeToLive,
            data
          };
          if (acl) {
            message["acl"] = acl;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_CREATE,
            data: message,
            callback
          });
        };
        bc2.globalEntity.createEntityWithIndexedId = function(entityType, indexedId, timeToLive, acl, data, callback) {
          var message = {
            entityType,
            entityIndexedId: indexedId,
            timeToLive,
            data
          };
          if (acl) {
            message["acl"] = acl;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_CREATE_WITH_INDEXED_ID,
            data: message,
            callback
          });
        };
        bc2.globalEntity.deleteEntity = function(entityId, version, callback) {
          var message = {
            entityId,
            version
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_DELETE,
            data: message,
            callback
          });
        };
        bc2.globalEntity.getList = function(where, orderBy, maxReturn, callback) {
          var message = {
            where,
            maxReturn
          };
          if (orderBy) {
            message["orderBy"] = orderBy;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_GET_LIST,
            data: message,
            callback
          });
        };
        bc2.globalEntity.getListByIndexedId = function(entityIndexedId, maxReturn, callback) {
          var message = {
            entityIndexedId,
            maxReturn
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_GET_LIST_BY_INDEXED_ID,
            data: message,
            callback
          });
        };
        bc2.globalEntity.getListCount = function(where, callback) {
          var message = {
            where
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_GET_LIST_COUNT,
            data: message,
            callback
          });
        };
        bc2.globalEntity.readEntity = function(entityId, callback) {
          var message = {
            entityId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_READ,
            data: message,
            callback
          });
        };
        bc2.globalEntity.updateEntity = function(entityId, version, data, callback) {
          var message = {
            entityId
          };
          if (typeof version === "number") {
            message.version = version;
            message.data = data;
          } else {
            message.version = data;
            message.data = version;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_UPDATE,
            data: message,
            callback
          });
        };
        bc2.globalEntity.updateEntityAcl = function(entityId, acl, version, callback) {
          var message = {
            entityId,
            version,
            acl
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_UPDATE_ACL,
            data: message,
            callback
          });
        };
        bc2.globalEntity.updateEntityTimeToLive = function(entityId, timeToLive, version, callback) {
          var message = {
            entityId,
            version,
            timeToLive
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_UPDATE_TIME_TO_LIVE,
            data: message,
            callback
          });
        };
        bc2.globalEntity.getPage = function(context, callback) {
          var message = {
            context
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_GET_PAGE,
            data: message,
            callback
          });
        };
        bc2.globalEntity.getPageOffset = function(context, pageOffset, callback) {
          var message = {
            context,
            pageOffset
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_GET_PAGE_BY_OFFSET,
            data: message,
            callback
          });
        };
        bc2.globalEntity.incrementGlobalEntityData = function(entityId, data, callback) {
          var message = {
            entityId,
            data
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_INCREMENT_GLOBAL_ENTITY_DATA,
            data: message,
            callback
          });
        };
        bc2.globalEntity.getRandomEntitiesMatching = function(where, maxReturn, callback) {
          var message = {
            where,
            maxReturn
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_GET_RANDOM_ENTITIES_MATCHING,
            data: message,
            callback
          });
        };
        bc2.globalEntity.updateEntityIndexedId = function(entityId, version, entityIndexedId, callback) {
          var message = {
            entityId,
            version,
            entityIndexedId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_UPDATE_ENTITY_INDEXED_ID,
            data: message,
            callback
          });
        };
        bc2.globalEntity.updateEntityOwnerAndAcl = function(entityId, version, ownerId, acl, callback) {
          var message = {
            entityId,
            version,
            ownerId,
            acl
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_UPDATE_ENTITY_OWNER_AND_ACL,
            data: message,
            callback
          });
        };
        bc2.globalEntity.makeSystemEntity = function(entityId, version, acl, callback) {
          var message = {
            entityId,
            version,
            acl
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GLOBAL_ENTITY,
            operation: bc2.globalEntity.OPERATION_MAKE_SYSTEM_ENTITY,
            data: message,
            callback
          });
        };
      }
      BCGlobalEntity.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCGroupFile() {
        var bc2 = this;
        bc2.groupFile = {};
        bc2.SERVICE_GROUP_FILE = "groupFile";
        bc2.groupFile.OPERATION_GET_FILE_INFO = "GET_FILE_INFO";
        bc2.groupFile.OPERATION_GET_FILE_INFO_SIMPLE = "GET_FILE_INFO_SIMPLE";
        bc2.groupFile.OPERATION_GET_CDN_URL = "GET_CDN_URL";
        bc2.groupFile.OPERATION_GET_FILE_LIST = "GET_FILE_LIST";
        bc2.groupFile.OPERATION_CHECK_FILENAME_EXISTS = "CHECK_FILENAME_EXISTS";
        bc2.groupFile.OPERATION_CHECK_FULLPATH_FILENAME_EXISTS = "CHECK_FULLPATH_FILENAME_EXISTS";
        bc2.groupFile.OPERATION_MOVE_FILE = "MOVE_FILE";
        bc2.groupFile.OPERATION_UPDATE_FILE_INFO = "UPDATE_FILE_INFO";
        bc2.groupFile.OPERATION_COPY_FILE = "COPY_FILE";
        bc2.groupFile.OPERATION_DELETE_FILE = "DELETE_FILE";
        bc2.groupFile.OPERATION_MOVE_USER_TO_GROUP_FILE = "MOVE_USER_TO_GROUP_FILE";
        bc2.groupFile.getFileInfo = function(groupId, fileId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP_FILE,
            operation: bc2.groupFile.OPERATION_GET_FILE_INFO,
            data: {
              groupId,
              fileId
            },
            callback
          });
        };
        bc2.groupFile.getFileInfoSimple = function(groupId, folderPath, filename, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP_FILE,
            operation: bc2.groupFile.OPERATION_GET_FILE_INFO_SIMPLE,
            data: {
              groupId,
              folderPath,
              filename
            },
            callback
          });
        };
        bc2.groupFile.getCDNUrl = function(groupId, fileId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP_FILE,
            operation: bc2.groupFile.OPERATION_GET_CDN_URL,
            data: {
              groupId,
              fileId
            },
            callback
          });
        };
        bc2.groupFile.getFileList = function(groupId, folderPath, recurse, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP_FILE,
            operation: bc2.groupFile.OPERATION_GET_FILE_LIST,
            data: {
              groupId,
              folderPath,
              recurse
            },
            callback
          });
        };
        bc2.groupFile.checkFilenameExists = function(groupId, folderPath, filename, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP_FILE,
            operation: bc2.groupFile.OPERATION_CHECK_FILENAME_EXISTS,
            data: {
              groupId,
              folderPath,
              filename
            },
            callback
          });
        };
        bc2.groupFile.checkFullpathFilenameExists = function(groupId, fullPathFilename, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP_FILE,
            operation: bc2.groupFile.OPERATION_CHECK_FULLPATH_FILENAME_EXISTS,
            data: {
              groupId,
              fullPathFilename
            },
            callback
          });
        };
        bc2.groupFile.moveFile = function(groupId, fileId, version, newTreeId, treeVersion, newFilename, overwriteIfPresent, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP_FILE,
            operation: bc2.groupFile.OPERATION_MOVE_FILE,
            data: {
              groupId,
              fileId,
              version,
              newTreeId,
              treeVersion,
              newFilename,
              overwriteIfPresent
            },
            callback
          });
        };
        bc2.groupFile.updateFileInfo = function(groupId, fileId, version, newFilename, newAcl, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP_FILE,
            operation: bc2.groupFile.OPERATION_UPDATE_FILE_INFO,
            data: {
              groupId,
              fileId,
              version,
              newFilename,
              newAcl
            },
            callback
          });
        };
        bc2.groupFile.copyFile = function(groupId, fileId, version, newTreeId, treeVersion, newFilename, overwriteIfPresent, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP_FILE,
            operation: bc2.groupFile.OPERATION_COPY_FILE,
            data: {
              groupId,
              fileId,
              version,
              newTreeId,
              treeVersion,
              newFilename,
              overwriteIfPresent
            },
            callback
          });
        };
        bc2.groupFile.deleteFile = function(groupId, fileId, version, filename, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP_FILE,
            operation: bc2.groupFile.OPERATION_DELETE_FILE,
            data: {
              groupId,
              fileId,
              version,
              filename
            },
            callback
          });
        };
        bc2.groupFile.moveUserToGroupFile = function(userCloudPath, userCloudFilename, groupId, groupTreeId, groupFilename, groupFileAcl, overwriteIfPresent, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP_FILE,
            operation: bc2.groupFile.OPERATION_MOVE_USER_TO_GROUP_FILE,
            data: {
              userCloudPath,
              userCloudFilename,
              groupId,
              groupTreeId,
              groupFilename,
              groupFileAcl,
              overwriteIfPresent
            },
            callback
          });
        };
      }
      BCGroupFile.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCGroup() {
        var bc2 = this;
        bc2.group = {};
        bc2.SERVICE_GROUP = "group";
        bc2.group.OPERATION_ACCEPT_GROUP_INVITATION = "ACCEPT_GROUP_INVITATION";
        bc2.group.OPERATION_ADD_GROUP_MEMBER = "ADD_GROUP_MEMBER";
        bc2.group.OPERATION_APPROVE_GROUP_JOIN_REQUEST = "APPROVE_GROUP_JOIN_REQUEST";
        bc2.group.OPERATION_AUTO_JOIN_GROUP = "AUTO_JOIN_GROUP";
        bc2.group.OPERATION_AUTO_JOIN_GROUP_MULTI = "AUTO_JOIN_GROUP_MULTI";
        bc2.group.OPERATION_CANCEL_GROUP_INVITATION = "CANCEL_GROUP_INVITATION";
        bc2.group.OPERATION_CREATE_GROUP = "CREATE_GROUP";
        bc2.group.OPERATION_CREATE_GROUP_ENTITY = "CREATE_GROUP_ENTITY";
        bc2.group.OPERATION_DELETE_GROUP = "DELETE_GROUP";
        bc2.group.OPERATION_DELETE_GROUP_ENTITY = "DELETE_GROUP_ENTITY";
        bc2.group.OPERATION_DELETE_GROUP_JOIN_REQUEST = "DELETE_GROUP_JOIN_REQUEST";
        bc2.group.OPERATION_DELETE_MEMBER_FROM_GROUP = "DELETE_MEMBER_FROM_GROUP";
        bc2.group.OPERATION_GET_MY_GROUPS = "GET_MY_GROUPS";
        bc2.group.OPERATION_INCREMENT_GROUP_DATA = "INCREMENT_GROUP_DATA";
        bc2.group.OPERATION_INCREMENT_GROUP_ENTITY_DATA = "INCREMENT_GROUP_ENTITY_DATA";
        bc2.group.OPERATION_INVITE_GROUP_MEMBER = "INVITE_GROUP_MEMBER";
        bc2.group.OPERATION_JOIN_GROUP = "JOIN_GROUP";
        bc2.group.OPERATION_LEAVE_GROUP = "LEAVE_GROUP";
        bc2.group.OPERATION_LIST_GROUPS_PAGE = "LIST_GROUPS_PAGE";
        bc2.group.OPERATION_LIST_GROUPS_PAGE_BY_OFFSET = "LIST_GROUPS_PAGE_BY_OFFSET";
        bc2.group.OPERATION_LIST_GROUPS_WITH_MEMBER = "LIST_GROUPS_WITH_MEMBER";
        bc2.group.OPERATION_READ_GROUP = "READ_GROUP";
        bc2.group.OPERATION_READ_GROUP_DATA = "READ_GROUP_DATA";
        bc2.group.OPERATION_READ_GROUP_ENTITIES_PAGE = "READ_GROUP_ENTITIES_PAGE";
        bc2.group.OPERATION_READ_GROUP_ENTITIES_PAGE_BY_OFFSET = "READ_GROUP_ENTITIES_PAGE_BY_OFFSET";
        bc2.group.OPERATION_READ_GROUP_ENTITY = "READ_GROUP_ENTITY";
        bc2.group.OPERATION_READ_GROUP_MEMBERS = "READ_GROUP_MEMBERS";
        bc2.group.OPERATION_REJECT_GROUP_INVITATION = "REJECT_GROUP_INVITATION";
        bc2.group.OPERATION_REJECT_GROUP_JOIN_REQUEST = "REJECT_GROUP_JOIN_REQUEST";
        bc2.group.OPERATION_REMOVE_GROUP_MEMBER = "REMOVE_GROUP_MEMBER";
        bc2.group.OPERATION_SET_GROUP_OPEN = "SET_GROUP_OPEN";
        bc2.group.OPERATION_UPDATE_GROUP_ACL = "UPDATE_GROUP_ACL";
        bc2.group.OPERATION_UPDATE_GROUP_DATA = "UPDATE_GROUP_DATA";
        bc2.group.OPERATION_UPDATE_GROUP_ENTITY_ACL = "UPDATE_GROUP_ENTITY_ACL";
        bc2.group.OPERATION_UPDATE_GROUP_ENTITY = "UPDATE_GROUP_ENTITY_DATA";
        bc2.group.OPERATION_UPDATE_GROUP_MEMBER = "UPDATE_GROUP_MEMBER";
        bc2.group.OPERATION_UPDATE_GROUP_NAME = "UPDATE_GROUP_NAME";
        bc2.group.OPERATION_UPDATE_GROUP_SUMMARY_DATA = "UPDATE_GROUP_SUMMARY_DATA";
        bc2.group.OPERATION_GET_RANDOM_GROUPS_MATCHING = "GET_RANDOM_GROUPS_MATCHING";
        bc2.group.role = Object.freeze({
          owner: "OWNER",
          admin: "ADMIN",
          member: "MEMBER",
          other: "OTHER"
        });
        bc2.group.autoJoinStrategy = Object.freeze({
          joinFirstGroup: "JoinFirstGroup",
          joinRandomGroup: "JoinRandomGroup"
        });
        bc2.group.acceptGroupInvitation = function(groupId, callback) {
          var message = {
            groupId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_ACCEPT_GROUP_INVITATION,
            data: message,
            callback
          });
        };
        bc2.group.addGroupMember = function(groupId, profileId, role, attributes, callback) {
          var message = {
            groupId,
            profileId,
            role
          };
          if (attributes) message.attributes = attributes;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_ADD_GROUP_MEMBER,
            data: message,
            callback
          });
        };
        bc2.group.approveGroupJoinRequest = function(groupId, profileId, role, attributes, callback) {
          var message = {
            groupId,
            profileId
          };
          if (role) message.role = role;
          if (attributes) message.attributes = attributes;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_APPROVE_GROUP_JOIN_REQUEST,
            data: message,
            callback
          });
        };
        bc2.group.autoJoinGroup = function(groupType, autoJoinStrategy, dataQueryJson, callback) {
          var message = {
            groupType,
            autoJoinStrategy
          };
          if (dataQueryJson) message.dataQueryJson = dataQueryJson;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_AUTO_JOIN_GROUP,
            data: message,
            callback
          });
        };
        bc2.group.autoJoinGroupMulti = function(groupTypes, autoJoinStrategy, where, callback) {
          var message = {
            groupTypes,
            autoJoinStrategy
          };
          if (where) message.where = where;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_AUTO_JOIN_GROUP_MULTI,
            data: message,
            callback
          });
        };
        bc2.group.cancelGroupInvitation = function(groupId, profileId, callback) {
          var message = {
            groupId,
            profileId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_CANCEL_GROUP_INVITATION,
            data: message,
            callback
          });
        };
        bc2.group.createGroup = function(name, groupType, isOpenGroup, acl, data, ownerAttributes, defaultMemberAttributes, callback) {
          var message = {
            groupType
          };
          if (name) message.name = name;
          if (isOpenGroup) message.isOpenGroup = isOpenGroup;
          if (acl) message.acl = acl;
          if (data) message.data = data;
          if (ownerAttributes) message.ownerAttributes = ownerAttributes;
          if (defaultMemberAttributes)
            message.defaultMemberAttributes = defaultMemberAttributes;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_CREATE_GROUP,
            data: message,
            callback
          });
        };
        bc2.group.createGroupWithSummaryData = function(name, groupType, isOpenGroup, acl, data, ownerAttributes, defaultMemberAttributes, summaryData, callback) {
          var message = {
            groupType
          };
          if (name) message.name = name;
          if (isOpenGroup) message.isOpenGroup = isOpenGroup;
          if (acl) message.acl = acl;
          if (data) message.data = data;
          if (ownerAttributes) message.ownerAttributes = ownerAttributes;
          if (defaultMemberAttributes)
            message.defaultMemberAttributes = defaultMemberAttributes;
          if (summaryData) message.summaryData = summaryData;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_CREATE_GROUP,
            data: message,
            callback
          });
        };
        bc2.group.createGroupEntity = function(groupId, entityType, isOwnedByGroupMember, acl, data, callback) {
          var message = {
            groupId
          };
          if (entityType) message.entityType = entityType;
          if (isOwnedByGroupMember)
            message.isOwnedByGroupMember = isOwnedByGroupMember;
          if (acl) message.acl = acl;
          if (data) message.data = data;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_CREATE_GROUP_ENTITY,
            data: message,
            callback
          });
        };
        bc2.group.deleteGroup = function(groupId, version, callback) {
          var message = {
            groupId,
            version
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_DELETE_GROUP,
            data: message,
            callback
          });
        };
        bc2.group.deleteGroupEntity = function(groupId, entityId, version, callback) {
          var message = {
            groupId,
            entityId,
            version
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_DELETE_GROUP_ENTITY,
            data: message,
            callback
          });
        };
        bc2.group.getMyGroups = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_GET_MY_GROUPS,
            data: {},
            callback
          });
        };
        bc2.group.incrementGroupData = function(groupId, data, callback) {
          var message = {
            groupId,
            data
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_INCREMENT_GROUP_DATA,
            data: message,
            callback
          });
        };
        bc2.group.incrementGroupEntityData = function(groupId, entityId, data, callback) {
          var message = {
            groupId,
            entityId,
            data
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_INCREMENT_GROUP_ENTITY_DATA,
            data: message,
            callback
          });
        };
        bc2.group.inviteGroupMember = function(groupId, profileId, role, attributes, callback) {
          var message = {
            groupId,
            profileId
          };
          if (role) message.role = role;
          if (attributes) message.attributes = attributes;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_INVITE_GROUP_MEMBER,
            data: message,
            callback
          });
        };
        bc2.group.joinGroup = function(groupId, callback) {
          var message = {
            groupId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_JOIN_GROUP,
            data: message,
            callback
          });
        };
        bc2.group.deleteGroupJoinRequest = function(groupId, callback) {
          var message = {
            groupId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_DELETE_GROUP_JOIN_REQUEST,
            data: message,
            callback
          });
        };
        bc2.group.leaveGroup = function(groupId, callback) {
          var message = {
            groupId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_LEAVE_GROUP,
            data: message,
            callback
          });
        };
        bc2.group.listGroupsPage = function(context, callback) {
          var message = {
            context
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_LIST_GROUPS_PAGE,
            data: message,
            callback
          });
        };
        bc2.group.listGroupsPageByOffset = function(encodedContext, pageOffset, callback) {
          var message = {
            context: encodedContext,
            pageOffset
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_LIST_GROUPS_PAGE_BY_OFFSET,
            data: message,
            callback
          });
        };
        bc2.group.listGroupsWithMember = function(profileId, callback) {
          var message = {
            profileId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_LIST_GROUPS_WITH_MEMBER,
            data: message,
            callback
          });
        };
        bc2.group.readGroup = function(groupId, callback) {
          var message = {
            groupId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_READ_GROUP,
            data: message,
            callback
          });
        };
        bc2.group.readGroupData = function(groupId, callback) {
          var message = {
            groupId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_READ_GROUP_DATA,
            data: message,
            callback
          });
        };
        bc2.group.readGroupEntitiesPage = function(context, callback) {
          var message = {
            context
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_READ_GROUP_ENTITIES_PAGE,
            data: message,
            callback
          });
        };
        bc2.group.readGroupEntitiesPageByOffset = function(encodedContext, pageOffset, callback) {
          var message = {
            context: encodedContext,
            pageOffset
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_READ_GROUP_ENTITIES_PAGE_BY_OFFSET,
            data: message,
            callback
          });
        };
        bc2.group.readGroupEntity = function(groupId, entityId, callback) {
          var message = {
            groupId,
            entityId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_READ_GROUP_ENTITY,
            data: message,
            callback
          });
        };
        bc2.group.readGroupMembers = function(groupId, callback) {
          var message = {
            groupId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_READ_GROUP_MEMBERS,
            data: message,
            callback
          });
        };
        bc2.group.rejectGroupInvitation = function(groupId, callback) {
          var message = {
            groupId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_REJECT_GROUP_INVITATION,
            data: message,
            callback
          });
        };
        bc2.group.rejectGroupJoinRequest = function(groupId, profileId, callback) {
          var message = {
            groupId,
            profileId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_REJECT_GROUP_JOIN_REQUEST,
            data: message,
            callback
          });
        };
        bc2.group.removeGroupMember = function(groupId, profileId, callback) {
          var message = {
            groupId,
            profileId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_REMOVE_GROUP_MEMBER,
            data: message,
            callback
          });
        };
        bc2.group.setGroupOpen = function(groupId, isOpenGroup, callback) {
          var message = {
            groupId,
            isOpenGroup
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_SET_GROUP_OPEN,
            data: message,
            callback
          });
        };
        bc2.group.updateGroupAcl = function(groupId, acl, callback) {
          var data = {
            groupId,
            acl
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_UPDATE_GROUP_ACL,
            data,
            callback
          });
        };
        bc2.group.updateGroupData = function(groupId, version, data, callback) {
          var message = {
            groupId,
            version,
            data
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_UPDATE_GROUP_DATA,
            data: message,
            callback
          });
        };
        bc2.group.updateGroupEntityAcl = function(groupId, entityId, acl, callback) {
          var message = {
            groupId,
            entityId,
            acl
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_UPDATE_GROUP_ENTITY_ACL,
            data: message,
            callback
          });
        };
        bc2.group.updateGroupEntityData = function(groupId, entityId, version, data, callback) {
          var message = {
            groupId,
            entityId,
            version,
            data
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_UPDATE_GROUP_ENTITY,
            data: message,
            callback
          });
        };
        bc2.group.updateGroupMember = function(groupId, profileId, role, attributes, callback) {
          var message = {
            groupId,
            profileId
          };
          if (role) message.role = role;
          if (attributes) message.attributes = attributes;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_UPDATE_GROUP_MEMBER,
            data: message,
            callback
          });
        };
        bc2.group.updateGroupName = function(groupId, name, callback) {
          var message = {
            groupId,
            name
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_UPDATE_GROUP_NAME,
            data: message,
            callback
          });
        };
        bc2.group.updateGroupSummaryData = function(groupId, version, summaryData, callback) {
          var message = {
            groupId,
            version,
            summaryData
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_UPDATE_GROUP_SUMMARY_DATA,
            data: message,
            callback
          });
        };
        bc2.group.getRandomGroupsMatching = function(where, maxReturn, callback) {
          var message = {
            where,
            maxReturn
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_GROUP,
            operation: bc2.group.OPERATION_GET_RANDOM_GROUPS_MATCHING,
            data: message,
            callback
          });
        };
      }
      BCGroup.apply(window.brainCloudClient = window.brainCloudClient || {});
      if (typeof window === "undefined" || window === null) {
        window = {};
      }
      if (!window.navigator) {
        window.navigator = {};
      }
      if (!window.navigator.userLanguage && !window.navigator.language) {
        window.navigator.userLanguage = require_umd().getUserLocale();
      }
      function BCIdentity() {
        var bc2 = this;
        bc2.identity = {};
        bc2.SERVICE_IDENTITY = "identity";
        bc2.identity.OPERATION_ATTACH = "ATTACH";
        bc2.identity.OPERATION_ATTACH_BLOCKCHAIN_IDENTITY = "ATTACH_BLOCKCHAIN_IDENTITY";
        bc2.identity.OPERATION_DETACH_BLOCKCHAIN_IDENTITY = "DETACH_BLOCKCHAIN_IDENTITY";
        bc2.identity.OPERATION_MERGE = "MERGE";
        bc2.identity.OPERATION_DETACH = "DETACH";
        bc2.identity.OPERATION_SWITCH_TO_CHILD_PROFILE = "SWITCH_TO_CHILD_PROFILE";
        bc2.identity.OPERATION_SWITCH_TO_PARENT_PROFILE = "SWITCH_TO_PARENT_PROFILE";
        bc2.identity.OPERATION_GET_CHILD_PROFILES = "GET_CHILD_PROFILES";
        bc2.identity.OPERATION_GET_IDENTITIES = "GET_IDENTITIES";
        bc2.identity.OPERATION_GET_IDENTITY_STATUS = "GET_IDENTITY_STATUS";
        bc2.identity.OPERATION_GET_EXPIRED_IDENTITIES = "GET_EXPIRED_IDENTITIES";
        bc2.identity.OPERATION_REFRESH_IDENTITY = "REFRESH_IDENTITY";
        bc2.identity.OPERATION_CHANGE_EMAIL_IDENTITY = "CHANGE_EMAIL_IDENTITY";
        bc2.identity.OPERATION_ATTACH_PARENT_WITH_IDENTITY = "ATTACH_PARENT_WITH_IDENTITY";
        bc2.identity.OPERATION_DETACH_PARENT = "DETACH_PARENT";
        bc2.identity.OPERATION_ATTACH_PEER_PROFILE = "ATTACH_PEER_PROFILE";
        bc2.identity.OPERATION_DETACH_PEER = "DETACH_PEER";
        bc2.identity.OPERATION_GET_PEER_PROFILES = "GET_PEER_PROFILES";
        bc2.identity.OPERATION_ATTACH_NONLOGIN_UNIVERSAL = "ATTACH_NONLOGIN_UNIVERSAL";
        bc2.identity.OPERATION_UPDATE_UNIVERSAL_LOGIN = "UPDATE_UNIVERSAL_LOGIN";
        bc2.identity.authenticationType = Object.freeze({
          anonymous: "Anonymous",
          universal: "Universal",
          email: "Email",
          facebook: "Facebook",
          gameCenter: "GameCenter",
          steam: "Steam",
          blockChain: "BlockChain",
          google: "Google",
          googleOpenId: "GoogleOpenId",
          twitter: "Twitter",
          apple: "Apple",
          parse: "Parse",
          external: "External",
          unknown: "UNKNOWN"
        });
        bc2.identity.attachFacebookIdentity = function(facebookId, authenticationToken2, callback) {
          bc2.identity.attachIdentity(
            facebookId,
            authenticationToken2,
            bc2.authentication.AUTHENTICATION_TYPE_FACEBOOK,
            callback
          );
        };
        bc2.identity.mergeFacebookIdentity = function(facebookId, authenticationToken2, callback) {
          bc2.identity.mergeIdentity(
            facebookId,
            authenticationToken2,
            bc2.authentication.AUTHENTICATION_TYPE_FACEBOOK,
            callback
          );
        };
        bc2.identity.detachFacebookIdentity = function(facebookId, continueAnon, callback) {
          bc2.identity.detachIdentity(
            facebookId,
            bc2.authentication.AUTHENTICATION_TYPE_FACEBOOK,
            continueAnon,
            callback
          );
        };
        bc2.identity.attachUltraIdentity = function(ultraUsername, ultraIdToken, callback) {
          bc2.identity.attachIdentity(
            ultraUsername,
            ultraIdToken,
            bc2.authentication.AUTHENTICATION_TYPE_ULTRA,
            callback
          );
        };
        bc2.identity.mergeUltraIdentity = function(ultraUsername, ultraIdToken, callback) {
          bc2.identity.mergeIdentity(
            ultraUsername,
            ultraIdToken,
            bc2.authentication.AUTHENTICATION_TYPE_ULTRA,
            callback
          );
        };
        bc2.identity.detachUltraIdentity = function(ultraUsername, continueAnon, callback) {
          bc2.identity.detachIdentity(
            ultraUsername,
            bc2.authentication.AUTHENTICATION_TYPE_ULTRA,
            continueAnon,
            callback
          );
        };
        bc2.identity.attachAdvancedIdentity = function(authenticationType, ids, extraJson, callback) {
          var data = {
            externalId: ids.externalId,
            authenticationType,
            authenticationToken: ids.authenticationToken
          };
          if (ids.authenticationSubType !== null || ids.authenticationSubType !== "") {
            data["externalAuthName"] = ids.authenticationSubType;
          }
          if (extraJson) {
            data["extraJson"] = extraJson;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_ATTACH,
            data,
            callback
          });
        };
        bc2.identity.mergeAdvancedIdentity = function(authenticationType, ids, extraJson, callback) {
          var data = {
            externalId: ids.externalId,
            authenticationType,
            authenticationToken: ids.authenticationToken
          };
          if (ids.authenticationSubType !== null || ids.authenticationSubType !== "") {
            data["externalAuthName"] = ids.authenticationSubType;
          }
          if (extraJson) {
            data["extraJson"] = extraJson;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_MERGE,
            data,
            callback
          });
        };
        bc2.identity.detachAdvancedIdentity = function(authenticationType, externalId, continueAnon, extraJson, callback) {
          var data = {
            externalId,
            authenticationType,
            confirmAnonymous: continueAnon
          };
          if (extraJson) {
            data["extraJson"] = extraJson;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_DETACH,
            data,
            callback
          });
        };
        bc2.identity.attachFacebookLimitedIdentity = function(facebookLimitedId2, authenticationToken2, callback) {
          bc2.identity.attachIdentity(
            facebookLimitedId2,
            authenticationToken2,
            bc2.authentication.AUTHENTICATION_TYPE_FACEBOOK_LIMITED,
            callback
          );
        };
        bc2.identity.mergeFacebookLimitedIdentity = function(facebookLimitedId2, authenticationToken2, callback) {
          bc2.identity.mergeIdentity(
            facebookLimitedId2,
            authenticationToken2,
            bc2.authentication.AUTHENTICATION_TYPE_FACEBOOK_LIMITED,
            callback
          );
        };
        bc2.identity.detachFacebookLimitedIdentity = function(facebookId, continueAnon, callback) {
          bc2.identity.detachIdentity(
            facebookLimitedId,
            bc2.authentication.AUTHENTICATION_TYPE_FACEBOOK_LIMITED,
            continueAnon,
            callback
          );
        };
        bc2.identity.attachGameCenterIdentity = function(gameCenterId, callback) {
          bc2.identity.detachIdentity(
            gameCenterId,
            "",
            authenticationToken,
            bc2.authentication.AUTHENTICATION_TYPE_GAME_CENTER,
            callback
          );
        };
        bc2.identity.mergeGameCenterIdentity = function(gameCenterId, callback) {
          bc2.identity.detachIdentity(
            gameCenterId,
            "",
            authenticationToken,
            bc2.authentication.AUTHENTICATION_TYPE_GAME_CENTER,
            callback
          );
        };
        bc2.identity.detachGameCenterIdentity = function(gameCenterId, continueAnon, callback) {
          bc2.identity.detachIdentity(
            gameCenterId,
            bc2.authentication.AUTHENTICATION_TYPE_GAME_CENTER,
            continueAnon,
            callback
          );
        };
        bc2.identity.attachEmailIdentity = function(email, password, callback) {
          bc2.identity.attachIdentity(
            email,
            password,
            bc2.authentication.AUTHENTICATION_TYPE_EMAIL,
            callback
          );
        };
        bc2.identity.mergeEmailIdentity = function(email, password, callback) {
          bc2.identity.mergeIdentity(
            email,
            password,
            bc2.authentication.AUTHENTICATION_TYPE_EMAIL,
            callback
          );
        };
        bc2.identity.detachEmailIdentity = function(email, continueAnon, callback) {
          bc2.identity.detachIdentity(
            email,
            bc2.authentication.AUTHENTICATION_TYPE_EMAIL,
            continueAnon,
            callback
          );
        };
        bc2.identity.attachUniversalIdentity = function(userId, password, callback) {
          bc2.identity.attachIdentity(
            userId,
            password,
            bc2.authentication.AUTHENTICATION_TYPE_UNIVERSAL,
            callback
          );
        };
        bc2.identity.mergeUniversalIdentity = function(userId, password, callback) {
          bc2.identity.mergeIdentity(
            userId,
            password,
            bc2.authentication.AUTHENTICATION_TYPE_UNIVERSAL,
            callback
          );
        };
        bc2.identity.detachUniversalIdentity = function(userId, continueAnon, callback) {
          bc2.identity.detachIdentity(
            userId,
            bc2.authentication.AUTHENTICATION_TYPE_UNIVERSAL,
            continueAnon,
            callback
          );
        };
        bc2.identity.attachSteamIdentity = function(steamId, sessionTicket, callback) {
          bc2.identity.attachIdentity(
            steamId,
            sessionTicket,
            bc2.authentication.AUTHENTICATION_TYPE_STEAM,
            callback
          );
        };
        bc2.identity.mergeSteamIdentity = function(steamId, sessionTicket, callback) {
          bc2.identity.mergeIdentity(
            steamId,
            sessionTicket,
            bc2.authentication.AUTHENTICATION_TYPE_STEAM,
            callback
          );
        };
        bc2.identity.detachSteamIdentity = function(steamId, continueAnon, callback) {
          bc2.identity.detachIdentity(
            steamId,
            bc2.authentication.AUTHENTICATION_TYPE_STEAM,
            continueAnon,
            callback
          );
        };
        bc2.identity.attachGoogleIdentity = function(googleId, authenticationToken2, callback) {
          bc2.identity.attachIdentity(
            googleId,
            authenticationToken2,
            bc2.authentication.AUTHENTICATION_TYPE_GOOGLE,
            callback
          );
        };
        bc2.identity.mergeGoogleIdentity = function(googleId, authenticationToken2, callback) {
          bc2.identity.mergeIdentity(
            googleId,
            authenticationToken2,
            bc2.authentication.AUTHENTICATION_TYPE_GOOGLE,
            callback
          );
        };
        bc2.identity.detachGoogleIdentity = function(googleId, continueAnon, callback) {
          bc2.identity.detachIdentity(
            googleId,
            bc2.authentication.AUTHENTICATION_TYPE_GOOGLE,
            continueAnon,
            callback
          );
        };
        bc2.identity.attachGoogleOpenIdIdentity = function(googleOpenId, authenticationToken2, callback) {
          bc2.identity.attachIdentity(
            googleOpenId,
            authenticationToken2,
            bc2.authentication.AUTHENTICATION_TYPE_GOOGLE_OPEN_ID,
            callback
          );
        };
        bc2.identity.mergeGoogleOpenIdIdentity = function(googleOpenId, authenticationToken2, callback) {
          bc2.identity.mergeIdentity(
            googleOpenId,
            authenticationToken2,
            bc2.authentication.AUTHENTICATION_TYPE_GOOGLE_OPEN_ID,
            callback
          );
        };
        bc2.identity.detachGoogleOpenIdIdentity = function(googleOpenId, continueAnon, callback) {
          bc2.identity.detachIdentity(
            googleOpenId,
            bc2.authentication.AUTHENTICATION_TYPE_GOOGLE_OPEN_ID,
            continueAnon,
            callback
          );
        };
        bc2.identity.attachAppleIdentity = function(appleId, authenticationToken2, callback) {
          bc2.identity.attachIdentity(
            appleId,
            authenticationToken2,
            bc2.authentication.AUTHENTICATION_TYPE_APPLE,
            callback
          );
        };
        bc2.identity.mergeAppleIdentity = function(appleId, authenticationToken2, callback) {
          bc2.identity.mergeIdentity(
            appleId,
            authenticationToken2,
            bc2.authentication.AUTHENTICATION_TYPE_APPLE,
            callback
          );
        };
        bc2.identity.detachAppleIdentity = function(appleId, continueAnon, callback) {
          bc2.identity.detachIdentity(
            appleId,
            bc2.authentication.AUTHENTICATION_TYPE_APPLE,
            continueAnon,
            callback
          );
        };
        bc2.identity.attachTwitterIdentity = function(twitterId, authenticationToken2, secret, callback) {
          bc2.identity.attachIdentity(
            twitterId,
            authenticationToken2 + ":" + secret,
            bc2.authentication.AUTHENTICATION_TYPE_TWITTER,
            callback
          );
        };
        bc2.identity.mergeTwitterIdentity = function(twitterId, authenticationToken2, secret, callback) {
          bc2.identity.mergeIdentity(
            twitterId,
            authenticationToken2 + ":" + secret,
            bc2.authentication.AUTHENTICATION_TYPE_TWITTER,
            callback
          );
        };
        bc2.identity.detachTwitterIdentity = function(twitterId, continueAnon, callback) {
          bc2.identity.detachIdentity(
            twitterId,
            bc2.authentication.AUTHENTICATION_TYPE_TWITTER,
            continueAnon,
            callback
          );
        };
        bc2.identity.attachParseIdentity = function(parseId, authenticationToken2, callback) {
          bc2.identity.attachIdentity(
            parseId,
            authenticationToken2,
            bc2.authentication.AUTHENTICATION_TYPE_PARSE,
            callback
          );
        };
        bc2.identity.mergeParseIdentity = function(parseId, authenticationToken2, callback) {
          bc2.identity.mergeIdentity(
            parseId,
            authenticationToken2,
            bc2.authentication.AUTHENTICATION_TYPE_PARSE,
            callback
          );
        };
        bc2.identity.detachParseIdentity = function(parseId, continueAnon, callback) {
          bc2.identity.detachIdentity(
            parseId,
            bc2.authentication.AUTHENTICATION_TYPE_PARSE,
            continueAnon,
            callback
          );
        };
        bc2.identity.switchToChildProfile = function(childProfileId, childAppId, forceCreate, callback) {
          bc2.identity.switchToChildProfileInternal(
            childProfileId,
            childAppId,
            forceCreate,
            false,
            callback
          );
        };
        bc2.identity.switchToSingletonChildProfile = function(childAppId, forceCreate, callback) {
          bc2.identity.switchToChildProfileInternal(
            null,
            childAppId,
            forceCreate,
            true,
            callback
          );
        };
        bc2.identity.attachBlockchainIdentity = function(blockchainConfig, publicKey, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_ATTACH_BLOCKCHAIN_IDENTITY,
            data: {
              blockchainConfig,
              publicKey
            },
            callback
          });
        };
        bc2.identity.detachBlockchainIdentity = function(blockchainConfig, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_DETACH_BLOCKCHAIN_IDENTITY,
            data: {
              blockchainConfig
            },
            callback
          });
        };
        bc2.identity.updateUniversalIdLogin = function(externalId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_UPDATE_UNIVERSAL_LOGIN,
            data: {
              externalId
            },
            callback
          });
        };
        bc2.identity.attachNonLoginUniversalId = function(externalId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_ATTACH_NONLOGIN_UNIVERSAL,
            data: {
              externalId
            },
            callback
          });
        };
        bc2.identity.switchToParentProfile = function(parentLevelName, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_SWITCH_TO_PARENT_PROFILE,
            data: {
              levelName: parentLevelName
            },
            callback
          });
        };
        bc2.identity.getChildProfiles = function(includeSummaryData, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_GET_CHILD_PROFILES,
            data: {
              includePlayerSummaryData: includeSummaryData
            },
            callback
          });
        };
        bc2.identity.getIdentities = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_GET_IDENTITIES,
            data: {},
            callback
          });
        };
        bc2.identity.getIdentityStatus = function(authenticationType, externalAuthName, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_GET_IDENTITY_STATUS,
            data: {
              authenticationType,
              externalAuthName
            },
            callback
          });
        };
        bc2.identity.getExpiredIdentities = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_GET_EXPIRED_IDENTITIES,
            data: {},
            callback
          });
        };
        bc2.identity.refreshIdentity = function(externalId, authenticationToken2, authenticationType, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_REFRESH_IDENTITY,
            data: {
              externalId,
              authenticationType,
              authenticationToken: authenticationToken2
            },
            callback
          });
        };
        bc2.identity.changeEmailIdentity = function(oldEmailAddress, password, newEmailAddress, updateContactEmail, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_CHANGE_EMAIL_IDENTITY,
            data: {
              oldEmailAddress,
              authenticationToken: password,
              newEmailAddress,
              updateContactEmail
            },
            callback
          });
        };
        bc2.identity.attachParentWithIdentity = function(externalId, authenticationToken2, authenticationType, externalAuthName, forceCreate, callback) {
          var data = {
            externalId,
            authenticationToken: authenticationToken2,
            authenticationType,
            forceCreate
          };
          if (externalAuthName) data.externalAuthName = externalAuthName;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_ATTACH_PARENT_WITH_IDENTITY,
            data,
            callback
          });
        };
        bc2.identity.detachParent = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_DETACH_PARENT,
            data: null,
            callback
          });
        };
        bc2.identity.attachPeerProfile = function(peer, externalId, authenticationToken2, authenticationType, externalAuthName, forceCreate, callback) {
          var data = {
            peer,
            externalId,
            authenticationToken: authenticationToken2,
            authenticationType,
            forceCreate
          };
          if (externalAuthName) data.externalAuthName = externalAuthName;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_ATTACH_PEER_PROFILE,
            data,
            callback
          });
        };
        bc2.identity.detachPeer = function(peer, callback) {
          var data = {
            peer
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_DETACH_PEER,
            data,
            callback
          });
        };
        bc2.identity.getPeerProfiles = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_GET_PEER_PROFILES,
            data: null,
            callback
          });
        };
        bc2.identity.attachIdentity = function(externalId, authenticationToken2, authenticationType, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_ATTACH,
            data: {
              externalId,
              authenticationType,
              authenticationToken: authenticationToken2
            },
            callback
          });
        };
        bc2.identity.mergeIdentity = function(externalId, authenticationToken2, authenticationType, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_MERGE,
            data: {
              externalId,
              authenticationType,
              authenticationToken: authenticationToken2
            },
            callback
          });
        };
        bc2.identity.detachIdentity = function(externalId, authenticationType, continueAnon, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_DETACH,
            data: {
              externalId,
              authenticationType,
              confirmAnonymous: continueAnon
            },
            callback
          });
        };
        bc2.identity.switchToChildProfileInternal = function(childProfileId, childAppId, forceCreate, forceSingleton, callback) {
          var _navLangCode = window.navigator.userLanguage || window.navigator.language;
          _navLangCode = _navLangCode.split("-");
          var languageCode = _navLangCode[0];
          var countryCode = _navLangCode[1];
          if (countryCode === "419") {
            countryCode = "_LA_";
          }
          if (countryCode === "Hans" || countryCode === "Hant") {
            countryCode = "CN";
          }
          var now = /* @__PURE__ */ new Date();
          var timeZoneOffset = -now.getTimezoneOffset() / 60;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_IDENTITY,
            operation: bc2.identity.OPERATION_SWITCH_TO_CHILD_PROFILE,
            data: {
              profileId: childProfileId,
              gameId: childAppId,
              forceCreate,
              forceSingleton,
              releasePlatform: "WEB",
              timeZoneOffset,
              languageCode,
              countryCode
            },
            callback
          });
        };
      }
      BCIdentity.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCItemCatalog() {
        var bc2 = this;
        bc2.itemCatalog = {};
        bc2.SERVICE_ITEMCATALOG = "itemCatalog";
        bc2.itemCatalog.OPERATION_GET_CATALOG_ITEM_DEFINITION = "GET_CATALOG_ITEM_DEFINITION";
        bc2.itemCatalog.OPERATION_GET_CATALOG_ITEMS_PAGE = "GET_CATALOG_ITEMS_PAGE";
        bc2.itemCatalog.OPERATION_GET_CATALOG_ITEMS_PAGE_OFFSET = "GET_CATALOG_ITEMS_PAGE_OFFSET";
        bc2.itemCatalog.getCatalogItemDefinition = function(defId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ITEMCATALOG,
            operation: bc2.itemCatalog.OPERATION_GET_CATALOG_ITEM_DEFINITION,
            data: {
              defId
            },
            callback
          });
        };
        bc2.itemCatalog.getCatalogItemsPage = function(context, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ITEMCATALOG,
            operation: bc2.itemCatalog.OPERATION_GET_CATALOG_ITEMS_PAGE,
            data: {
              context
            },
            callback
          });
        };
        bc2.itemCatalog.getCatalogItemsPageOffset = function(context, pageOffset, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ITEMCATALOG,
            operation: bc2.itemCatalog.OPERATION_GET_CATALOG_ITEMS_PAGE_OFFSET,
            data: {
              context,
              pageOffset
            },
            callback
          });
        };
      }
      BCItemCatalog.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCLobby() {
        var bc2 = this;
        bc2.lobby = {};
        bc2.SERVICE_LOBBY = "lobby";
        bc2.lobby.OPERATION_CREATE_LOBBY = "CREATE_LOBBY";
        bc2.lobby.OPERATION_CREATE_LOBBY_WITH_CONFIG = "CREATE_LOBBY_WITH_CONFIG";
        bc2.lobby.OPERATION_CREATE_LOBBY_WITH_PING_DATA = "CREATE_LOBBY_WITH_PING_DATA";
        bc2.lobby.OPERATION_CREATE_LOBBY_WITH_CONFIG_AND_PING_DATA = "CREATE_LOBBY_WITH_CONFIG_AND_PING_DATA";
        bc2.lobby.OPERATION_FIND_LOBBY = "FIND_LOBBY";
        bc2.lobby.OPERATION_FIND_LOBBY_WITH_PING_DATA = "FIND_LOBBY_WITH_PING_DATA";
        bc2.lobby.OPERATION_FIND_OR_CREATE_LOBBY = "FIND_OR_CREATE_LOBBY";
        bc2.lobby.OPERATION_FIND_OR_CREATE_LOBBY_WITH_PING_DATA = "FIND_OR_CREATE_LOBBY_WITH_PING_DATA";
        bc2.lobby.OPERATION_GET_LOBBY_DATA = "GET_LOBBY_DATA";
        bc2.lobby.OPERATION_LEAVE_LOBBY = "LEAVE_LOBBY";
        bc2.lobby.OPERATION_JOIN_LOBBY = "JOIN_LOBBY";
        bc2.lobby.OPERATION_JOIN_LOBBY_WITH_PING_DATA = "JOIN_LOBBY_WITH_PING_DATA";
        bc2.lobby.OPERATION_REMOVE_MEMBER = "REMOVE_MEMBER";
        bc2.lobby.OPERATION_SEND_SIGNAL = "SEND_SIGNAL";
        bc2.lobby.OPERATION_SWITCH_TEAM = "SWITCH_TEAM";
        bc2.lobby.OPERATION_UPDATE_READY = "UPDATE_READY";
        bc2.lobby.OPERATION_UPDATE_SETTINGS = "UPDATE_SETTINGS";
        bc2.lobby.OPERATION_CANCEL_FIND_REQUEST = "CANCEL_FIND_REQUEST";
        bc2.lobby.OPERATION_GET_REGIONS_FOR_LOBBIES = "GET_REGIONS_FOR_LOBBIES";
        bc2.lobby.OPERATION_PING_REGIONS = "PING_REGIONS";
        bc2.lobby.OPERATION_GET_LOBBY_INSTANCES = "GET_LOBBY_INSTANCES";
        bc2.lobby.OPERATION_GET_LOBBY_INSTANCES_WITH_PING_DATA = "GET_LOBBY_INSTANCES_WITH_PING_DATA";
        var pingData = null;
        var regionPingData = null;
        var regionsToPing = [];
        var targetPingCount = 0;
        var MAX_PING_CALLS = 4;
        var NUM_PING_CALLS_IN_PARRALLEL = 2;
        bc2.lobby.createLobby = function(lobbyType, rating, otherUserCxIds, isReady, extraJson, teamCode, settings, callback) {
          var data = {
            lobbyType,
            rating,
            otherUserCxIds,
            isReady,
            extraJson,
            teamCode,
            settings
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_CREATE_LOBBY,
            data,
            callback
          });
        };
        bc2.lobby.createLobbyWithConfig = function(lobbyType, rating, otherUserCxIds, isReady, extraJson, teamCode, settings, configOverrides, callback) {
          var data = {
            lobbyType,
            rating,
            otherUserCxIds,
            isReady,
            extraJson,
            teamCode,
            settings,
            configOverrides
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_CREATE_LOBBY_WITH_CONFIG,
            data,
            callback
          });
        };
        bc2.lobby.createLobbyWithPingData = function(lobbyType, rating, otherUserCxIds, isReady, extraJson, teamCode, settings, callback) {
          var data = {
            lobbyType,
            rating,
            otherUserCxIds,
            isReady,
            extraJson,
            teamCode,
            settings
          };
          attachPingDataAndSend(
            data,
            bc2.lobby.OPERATION_CREATE_LOBBY_WITH_PING_DATA,
            callback
          );
        };
        bc2.lobby.createLobbyWithConfigAndPingData = function(lobbyType, rating, otherUserCxIds, isReady, extraJson, teamCode, settings, configOverrides, callback) {
          var data = {
            lobbyType,
            rating,
            otherUserCxIds,
            isReady,
            extraJson,
            teamCode,
            settings,
            configOverrides
          };
          attachPingDataAndSend(
            data,
            bc2.lobby.OPERATION_CREATE_LOBBY_WITH_CONFIG_AND_PING_DATA,
            callback
          );
        };
        bc2.lobby.findLobby = function(lobbyType, rating, maxSteps, algo, filterJson, otherUserCxIds, isReady, extraJson, teamCode, callback) {
          var data = {
            lobbyType,
            rating,
            maxSteps,
            algo,
            filterJson,
            otherUserCxIds,
            isReady,
            extraJson,
            teamCode
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_FIND_LOBBY,
            data,
            callback
          });
        };
        bc2.lobby.findLobbyWithPingData = function(lobbyType, rating, maxSteps, algo, filterJson, otherUserCxIds, isReady, extraJson, teamCode, callback) {
          var data = {
            lobbyType,
            rating,
            maxSteps,
            algo,
            filterJson,
            otherUserCxIds,
            isReady,
            extraJson,
            teamCode
          };
          attachPingDataAndSend(
            data,
            bc2.lobby.OPERATION_FIND_LOBBY_WITH_PING_DATA,
            callback
          );
        };
        bc2.lobby.findOrCreateLobby = function(lobbyType, rating, maxSteps, algo, filterJson, otherUserCxIds, settings, isReady, extraJson, teamCode, callback) {
          var data = {
            lobbyType,
            rating,
            maxSteps,
            algo,
            filterJson,
            otherUserCxIds,
            settings,
            isReady,
            extraJson,
            teamCode
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_FIND_OR_CREATE_LOBBY,
            data,
            callback
          });
        };
        bc2.lobby.findOrCreateLobbyWithPingData = function(lobbyType, rating, maxSteps, algo, filterJson, otherUserCxIds, settings, isReady, extraJson, teamCode, callback) {
          var data = {
            lobbyType,
            rating,
            maxSteps,
            algo,
            filterJson,
            otherUserCxIds,
            settings,
            isReady,
            extraJson,
            teamCode
          };
          attachPingDataAndSend(
            data,
            bc2.lobby.OPERATION_FIND_OR_CREATE_LOBBY_WITH_PING_DATA,
            callback
          );
        };
        bc2.lobby.getLobbyData = function(lobbyId, callback) {
          var data = {
            lobbyId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_GET_LOBBY_DATA,
            data,
            callback
          });
        };
        bc2.lobby.leaveLobby = function(lobbyId, callback) {
          var data = {
            lobbyId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_LEAVE_LOBBY,
            data,
            callback
          });
        };
        bc2.lobby.joinLobby = function(lobbyId, isReady, extraJson, teamCode, otherUserCxIds, callback) {
          var data = {
            lobbyId,
            isReady,
            extraJson,
            teamCode,
            otherUserCxIds
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_JOIN_LOBBY,
            data,
            callback
          });
        };
        bc2.lobby.joinLobbyWithPingData = function(lobbyId, isReady, extraJson, teamCode, otherUserCxIds, callback) {
          var data = {
            lobbyId,
            isReady,
            extraJson,
            teamCode,
            otherUserCxIds
          };
          attachPingDataAndSend(
            data,
            bc2.lobby.OPERATION_JOIN_LOBBY_WITH_PING_DATA,
            callback
          );
        };
        bc2.lobby.removeMember = function(lobbyId, cxId, callback) {
          var data = {
            lobbyId,
            cxId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_REMOVE_MEMBER,
            data,
            callback
          });
        };
        bc2.lobby.sendSignal = function(lobbyId, signalData, callback) {
          var data = {
            lobbyId,
            signalData
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_SEND_SIGNAL,
            data,
            callback
          });
        };
        bc2.lobby.switchTeam = function(lobbyId, toTeamCode, callback) {
          var data = {
            lobbyId,
            toTeamCode
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_SWITCH_TEAM,
            data,
            callback
          });
        };
        bc2.lobby.updateReady = function(lobbyId, isReady, extraJson, callback) {
          var data = {
            lobbyId,
            isReady,
            extraJson
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_UPDATE_READY,
            data,
            callback
          });
        };
        bc2.lobby.updateSettings = function(lobbyId, settings, callback) {
          var data = {
            lobbyId,
            settings
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_UPDATE_SETTINGS,
            data,
            callback
          });
        };
        bc2.lobby.cancelFindRequest = function(lobbyType, callback) {
          var data = {
            lobbyType
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_CANCEL_FIND_REQUEST,
            data,
            callback
          });
        };
        bc2.lobby.cancelFindRequest = function(lobbyType, entryId, callback) {
          var data = {
            lobbyType,
            entryId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_CANCEL_FIND_REQUEST,
            data,
            callback
          });
        };
        bc2.lobby.getRegionsForLobbies = function(lobbyTypes, callback) {
          var data = {
            lobbyTypes
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_GET_REGIONS_FOR_LOBBIES,
            data,
            callback: function(result2) {
              if (result2.status == 200) {
                regionPingData = result2.data.regionPingData;
              }
              callback(result2);
            }
          });
        };
        bc2.lobby.getLobbyInstances = function(lobbyType, criteriaJson, callback) {
          var data = {
            lobbyType,
            criteriaJson
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LOBBY,
            operation: bc2.lobby.OPERATION_GET_LOBBY_INSTANCES,
            data,
            callback
          });
        };
        bc2.lobby.getLobbyInstancesWithPingData = function(lobbyType, criteriaJson, callback) {
          var data = {
            lobbyType,
            criteriaJson
          };
          attachPingDataAndSend(
            data,
            bc2.lobby.OPERATION_GET_LOBBY_INSTANCES_WITH_PING_DATA,
            callback
          );
        };
        bc2.lobby.getPingData = function() {
          return pingData || {};
        };
        bc2.lobby.pingRegions = function(callback) {
          pingData = {};
          if (regionPingData) {
            regionsToPing = [];
            var regionPingKeys = Object.keys(regionPingData);
            for (var i2 = 0; i2 < regionPingKeys.length; ++i2) {
              var regionName = regionPingKeys[i2];
              var region = regionPingData[regionName];
              if (region && region.target && region.type == "PING") {
                regionsToPing.push({
                  name: regionName,
                  url: region.target
                });
              }
            }
            targetPingCount = regionsToPing.length;
            if (targetPingCount == 0) {
              setTimeout(function() {
                onPingsCompleted(callback);
              }, 0);
            } else
              for (var i2 = 0; i2 < NUM_PING_CALLS_IN_PARRALLEL; ++i2) {
                if (regionsToPing.length > 0) {
                  var region = regionsToPing.splice(0, 1)[0];
                  handleNextPing(region, [], callback);
                }
              }
          } else {
            setTimeout(function() {
              callback({
                status: bc2.statusCodes.BAD_REQUEST,
                reason_code: bc2.reasonCodes.MISSING_REQUIRED_PARAMETER,
                status_message: "No Regions to Ping. Please call GetRegionsForLobbies and await the response before calling PingRegions",
                severity: "ERROR"
              });
            }, 0);
          }
        };
        function onPingsCompleted(callback) {
          callback({
            status: 200,
            data: pingData
          });
        }
        function handleNextPing(region, pings, callback) {
          if (pings.length >= MAX_PING_CALLS) {
            pings.sort(function(a, b) {
              return a - b;
            });
            var averagePing = 0;
            for (var i2 = 0; i2 < pings.length - 1; ++i2) {
              averagePing += pings[i2];
            }
            averagePing /= pings.length - 1;
            pingData[region.name] = Math.round(averagePing);
            if (regionsToPing.length > 0) {
              var region = regionsToPing.splice(0, 1)[0];
              handleNextPing(region, [], callback);
            } else if (Object.keys(pingData).length == targetPingCount) {
              onPingsCompleted(callback);
            }
          } else {
            pingHost(region, function(ping) {
              pings.push(ping);
              handleNextPing(region, pings, callback);
            });
          }
        }
        function pingHost(region, callback) {
          var success = false;
          var url = "http://" + region.url;
          var xmlhttp;
          if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
          } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
          }
          var hasTimedout = false;
          var timeoutId = setTimeout(function() {
            hasTimedout = true;
            xmlhttp.abort();
            callback(999);
          }, 2e3);
          var startTime = 0;
          xmlhttp.onreadystatechange = function() {
            if (hasTimedout) {
              return;
            }
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
              if (!hasTimedout) {
                clearTimeout(timeoutId);
              }
              if (xmlhttp.status == 200) {
                success = true;
              }
              var endTime = (/* @__PURE__ */ new Date()).getTime();
              var resultPing = Math.min(999, endTime - startTime);
              if (resultPing < 0 || !success) {
                resultPing = 999;
              }
              callback(resultPing);
            }
          };
          xmlhttp.open("GET", url, true);
          xmlhttp.setRequestHeader("Access-Control-Allow-Origin", ":*");
          xmlhttp.setRequestHeader("Access-Control-Allow-Headers", ":*");
          startTime = (/* @__PURE__ */ new Date()).getTime();
          xmlhttp.send();
        }
        function attachPingDataAndSend(data, operation, callback) {
          if (pingData && Object.keys(pingData).length > 0) {
            data.pingData = pingData;
            bc2.brainCloudManager.sendRequest({
              service: bc2.SERVICE_LOBBY,
              operation,
              data,
              callback
            });
          } else {
            setTimeout(function() {
              callback({
                status: bc2.statusCodes.BAD_REQUEST,
                reason_code: bc2.reasonCodes.MISSING_REQUIRED_PARAMETER,
                status_message: "Required Parameter 'pingData' is missing. Please ensure 'pingData' exists by first calling GetRegionsForLobbies and PingRegions, and waiting for response before proceeding.",
                severity: "ERROR"
              });
            }, 0);
          }
        }
      }
      BCLobby.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCMail() {
        var bc2 = this;
        bc2.mail = {};
        bc2.SERVICE_MAIL = "mail";
        bc2.mail.OPERATION_SEND_BASIC_EMAIL = "SEND_BASIC_EMAIL";
        bc2.mail.OPERATION_SEND_ADVANCED_EMAIL = "SEND_ADVANCED_EMAIL";
        bc2.mail.OPERATION_SEND_ADVANCED_EMAIL_BY_ADDRESS = "SEND_ADVANCED_EMAIL_BY_ADDRESS";
        bc2.mail.OPERATION_SEND_ADVANCED_EMAIL_BY_ADDRESSES = "SEND_ADVANCED_EMAIL_BY_ADDRESSES";
        bc2.mail.sendBasicEmail = function(profileId, subject, body, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MAIL,
            operation: bc2.mail.OPERATION_SEND_BASIC_EMAIL,
            data: {
              profileId,
              subject,
              body
            },
            callback
          });
        };
        bc2.mail.sendAdvancedEmail = function(profileId, serviceParams, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MAIL,
            operation: bc2.mail.OPERATION_SEND_ADVANCED_EMAIL,
            data: {
              profileId,
              serviceParams
            },
            callback
          });
        };
        bc2.mail.sendAdvancedEmailByAddress = function(emailAddress, serviceParams, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MAIL,
            operation: bc2.mail.OPERATION_SEND_ADVANCED_EMAIL_BY_ADDRESS,
            data: {
              emailAddress,
              serviceParams
            },
            callback
          });
        };
        bc2.mail.sendAdvancedEmailByAddresses = function(emailAddresses, serviceParams, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MAIL,
            operation: bc2.mail.OPERATION_SEND_ADVANCED_EMAIL_BY_ADDRESSES,
            data: {
              emailAddresses,
              serviceParams
            },
            callback
          });
        };
      }
      BCMail.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCMatchMaking() {
        var bc2 = this;
        bc2.matchMaking = {};
        bc2.SERVICE_MATCH_MAKING = "matchMaking";
        bc2.matchMaking.OPERATION_READ = "READ";
        bc2.matchMaking.OPERATION_SET_PLAYER_RATING = "SET_PLAYER_RATING";
        bc2.matchMaking.OPERATION_RESET_PLAYER_RATING = "RESET_PLAYER_RATING";
        bc2.matchMaking.OPERATION_INCREMENT_PLAYER_RATING = "INCREMENT_PLAYER_RATING";
        bc2.matchMaking.OPERATION_DECREMENT_PLAYER_RATING = "DECREMENT_PLAYER_RATING";
        bc2.matchMaking.OPERATION_TURN_SHIELD_ON = "SHIELD_ON";
        bc2.matchMaking.OPERATION_TURN_SHIELD_ON_FOR = "SHIELD_ON_FOR";
        bc2.matchMaking.OPERATION_TURN_SHIELD_OFF = "SHIELD_OFF";
        bc2.matchMaking.OPERATION_INCREMENT_SHIELD_ON_FOR = "INCREMENT_SHIELD_ON_FOR";
        bc2.matchMaking.OPERATION_GET_SHIELD_EXPIRY = "GET_SHIELD_EXPIRY";
        bc2.matchMaking.OPERATION_FIND_PLAYERS = "FIND_PLAYERS";
        bc2.matchMaking.OPERATION_FIND_PLAYERS_USING_FILTER = "FIND_PLAYERS_USING_FILTER";
        bc2.matchMaking.OPERATION_ENABLE_MATCH_MAKING = "ENABLE_FOR_MATCH";
        bc2.matchMaking.OPERATION_DISABLE_MATCH_MAKING = "DISABLE_FOR_MATCH";
        bc2.matchMaking.read = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MATCH_MAKING,
            operation: bc2.matchMaking.OPERATION_READ,
            data: {},
            callback
          });
        };
        bc2.matchMaking.setPlayerRating = function(playerRating, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MATCH_MAKING,
            operation: bc2.matchMaking.OPERATION_SET_PLAYER_RATING,
            data: {
              playerRating
            },
            callback
          });
        };
        bc2.matchMaking.resetPlayerRating = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MATCH_MAKING,
            operation: bc2.matchMaking.OPERATION_RESET_PLAYER_RATING,
            data: {},
            callback
          });
        };
        bc2.matchMaking.incrementPlayerRating = function(increment, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MATCH_MAKING,
            operation: bc2.matchMaking.OPERATION_INCREMENT_PLAYER_RATING,
            data: {
              playerRating: increment
            },
            callback
          });
        };
        bc2.matchMaking.decrementPlayerRating = function(decrement, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MATCH_MAKING,
            operation: bc2.matchMaking.OPERATION_DECREMENT_PLAYER_RATING,
            data: {
              playerRating: decrement
            },
            callback
          });
        };
        bc2.matchMaking.turnShieldOn = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MATCH_MAKING,
            operation: bc2.matchMaking.OPERATION_TURN_SHIELD_ON,
            data: {},
            callback
          });
        };
        bc2.matchMaking.turnShieldOnFor = function(minutes, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MATCH_MAKING,
            operation: bc2.matchMaking.OPERATION_TURN_SHIELD_ON_FOR,
            data: {
              minutes
            },
            callback
          });
        };
        bc2.matchMaking.turnShieldOff = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MATCH_MAKING,
            operation: bc2.matchMaking.OPERATION_TURN_SHIELD_OFF,
            data: {},
            callback
          });
        };
        bc2.matchMaking.incrementShieldOnFor = function(minutes, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MATCH_MAKING,
            operation: bc2.matchMaking.OPERATION_INCREMENT_SHIELD_ON_FOR,
            data: {
              minutes
            },
            callback
          });
        };
        bc2.matchMaking.getShieldExpiry = function(playerId, callback) {
          var data = {};
          if (playerId) {
            data["playerId"] = playerId;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MATCH_MAKING,
            operation: bc2.matchMaking.OPERATION_GET_SHIELD_EXPIRY,
            data,
            callback
          });
        };
        bc2.matchMaking.findPlayers = function(rangeDelta, numMatches, callback) {
          bc2.matchMaking.findPlayersWithAttributes(
            rangeDelta,
            numMatches,
            null,
            callback
          );
        };
        bc2.matchMaking.findPlayersWithAttributes = function(rangeDelta, numMatches, jsonAttributes, callback) {
          var data = {
            rangeDelta,
            numMatches
          };
          if (jsonAttributes) {
            data.attributes = jsonAttributes;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MATCH_MAKING,
            operation: bc2.matchMaking.OPERATION_FIND_PLAYERS,
            data,
            callback
          });
        };
        bc2.matchMaking.findPlayersUsingFilter = function(rangeDelta, numMatches, extraParms, callback) {
          bc2.matchMaking.findPlayersWithAttributesUsingFilter(
            rangeDelta,
            numMatches,
            null,
            extraParms,
            callback
          );
        };
        bc2.matchMaking.findPlayersWithAttributesUsingFilter = function(rangeDelta, numMatches, jsonAttributes, extraParms, callback) {
          var data = {
            rangeDelta,
            numMatches
          };
          if (jsonAttributes) {
            data.attributes = jsonAttributes;
          }
          if (extraParms) {
            data.extraParms = extraParms;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MATCH_MAKING,
            operation: bc2.matchMaking.OPERATION_FIND_PLAYERS_USING_FILTER,
            data,
            callback
          });
        };
        bc2.matchMaking.enableMatchMaking = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MATCH_MAKING,
            operation: bc2.matchMaking.OPERATION_ENABLE_MATCH_MAKING,
            data: {},
            callback
          });
        };
        bc2.matchMaking.disableMatchMaking = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MATCH_MAKING,
            operation: bc2.matchMaking.OPERATION_DISABLE_MATCH_MAKING,
            data: {},
            callback
          });
        };
      }
      BCMatchMaking.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCMessaging() {
        var bc2 = this;
        bc2.messaging = {};
        bc2.SERVICE_MESSAGING = "messaging";
        bc2.messaging.OPERATION_DELETE_MESSAGES = "DELETE_MESSAGES";
        bc2.messaging.OPERATION_GET_MESSAGE_BOXES = "GET_MESSAGE_BOXES";
        bc2.messaging.OPERATION_GET_MESSAGE_COUNTS = "GET_MESSAGE_COUNTS";
        bc2.messaging.OPERATION_GET_MESSAGES = "GET_MESSAGES";
        bc2.messaging.OPERATION_GET_MESSAGES_PAGE = "GET_MESSAGES_PAGE";
        bc2.messaging.OPERATION_GET_MESSAGES_PAGE_OFFSET = "GET_MESSAGES_PAGE_OFFSET";
        bc2.messaging.OPERATION_MARK_MESSAGES_READ = "MARK_MESSAGES_READ";
        bc2.messaging.OPERATION_SEND_MESSAGE = "SEND_MESSAGE";
        bc2.messaging.OPERATION_SEND_MESSAGE_SIMPLE = "SEND_MESSAGE_SIMPLE";
        bc2.messaging.deleteMessages = function(msgbox, msgIds, callback) {
          var message = {
            msgbox,
            msgIds
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MESSAGING,
            operation: bc2.messaging.OPERATION_DELETE_MESSAGES,
            data: message,
            callback
          });
        };
        bc2.messaging.getMessageboxes = function(callback) {
          var message = {};
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MESSAGING,
            operation: bc2.messaging.OPERATION_GET_MESSAGE_BOXES,
            data: message,
            callback
          });
        };
        bc2.messaging.getMessageCounts = function(callback) {
          var message = {};
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MESSAGING,
            operation: bc2.messaging.OPERATION_GET_MESSAGE_COUNTS,
            data: message,
            callback
          });
        };
        bc2.messaging.getMessages = function(msgbox, msgIds, markMessageRead, callback) {
          var message = {
            msgbox,
            msgIds,
            markMessageRead
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MESSAGING,
            operation: bc2.messaging.OPERATION_GET_MESSAGES,
            data: message,
            callback
          });
        };
        bc2.messaging.getMessagesPage = function(context, callback) {
          var message = {
            context
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MESSAGING,
            operation: bc2.messaging.OPERATION_GET_MESSAGES_PAGE,
            data: message,
            callback
          });
        };
        bc2.messaging.getMessagesPageOffset = function(context, pageOffset, callback) {
          var message = {
            context,
            pageOffset
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MESSAGING,
            operation: bc2.messaging.OPERATION_GET_MESSAGES_PAGE_OFFSET,
            data: message,
            callback
          });
        };
        bc2.messaging.sendMessage = function(toProfileIds, content, callback) {
          var message = {
            toProfileIds,
            contentJson: content
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MESSAGING,
            operation: bc2.messaging.OPERATION_SEND_MESSAGE,
            data: message,
            callback
          });
        };
        bc2.messaging.sendMessageSimple = function(toProfileIds, messageText, callback) {
          var message = {
            toProfileIds,
            text: messageText
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MESSAGING,
            operation: bc2.messaging.OPERATION_SEND_MESSAGE_SIMPLE,
            data: message,
            callback
          });
        };
        bc2.messaging.markMessagesRead = function(msgbox, msgIds, callback) {
          var message = {
            msgbox,
            msgIds
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_MESSAGING,
            operation: bc2.messaging.OPERATION_MARK_MESSAGES_READ,
            data: message,
            callback
          });
        };
      }
      BCMessaging.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCOneWayMatch() {
        var bc2 = this;
        bc2.oneWayMatch = {};
        bc2.SERVICE_ONE_WAY_MATCH = "onewayMatch";
        bc2.oneWayMatch.OPERATION_START_MATCH = "START_MATCH";
        bc2.oneWayMatch.OPERATION_CANCEL_MATCH = "CANCEL_MATCH";
        bc2.oneWayMatch.OPERATION_COMPLETE_MATCH = "COMPLETE_MATCH";
        bc2.oneWayMatch.startMatch = function(otherPlayerId, rangeDelta, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ONE_WAY_MATCH,
            operation: bc2.oneWayMatch.OPERATION_START_MATCH,
            data: {
              playerId: otherPlayerId,
              rangeDelta
            },
            callback
          });
        };
        bc2.oneWayMatch.cancelMatch = function(playbackStreamId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ONE_WAY_MATCH,
            operation: bc2.oneWayMatch.OPERATION_CANCEL_MATCH,
            data: {
              playbackStreamId
            },
            callback
          });
        };
        bc2.oneWayMatch.completeMatch = function(playbackStreamId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_ONE_WAY_MATCH,
            operation: bc2.oneWayMatch.OPERATION_COMPLETE_MATCH,
            data: {
              playbackStreamId
            },
            callback
          });
        };
      }
      BCOneWayMatch.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCPlaybackStream() {
        var bc2 = this;
        bc2.playbackStream = {};
        bc2.SERVICE_PLAYBACK_STREAM = "playbackStream";
        bc2.playbackStream.OPERATION_START_STREAM = "START_STREAM";
        bc2.playbackStream.OPERATION_READ_STREAM = "READ_STREAM";
        bc2.playbackStream.OPERATION_END_STREAM = "END_STREAM";
        bc2.playbackStream.OPERATION_DELETE_STREAM = "DELETE_STREAM";
        bc2.playbackStream.OPERATION_ADD_EVENT = "ADD_EVENT";
        bc2.playbackStream.OPERATION_GET_STREAM_SUMMARIES_FOR_INITIATING_PLAYER = "GET_STREAM_SUMMARIES_FOR_INITIATING_PLAYER";
        bc2.playbackStream.OPERATION_GET_STREAM_SUMMARIES_FOR_TARGET_PLAYER = "GET_STREAM_SUMMARIES_FOR_TARGET_PLAYER";
        bc2.playbackStream.OPERATION_GET_RECENT_STREAMS_FOR_INITIATING_PLAYER = "GET_RECENT_STREAMS_FOR_INITIATING_PLAYER";
        bc2.playbackStream.OPERATION_GET_RECENT_STREAMS_FOR_TARGET_PLAYER = "GET_RECENT_STREAMS_FOR_TARGET_PLAYER";
        bc2.playbackStream.OPERATION_PROTECT_STREAM_UNTIL = "PROTECT_STREAM_UNTIL";
        bc2.playbackStream.startStream = function(targetPlayerId, includeSharedData, callback) {
          var message = {
            targetPlayerId,
            includeSharedData
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYBACK_STREAM,
            operation: bc2.playbackStream.OPERATION_START_STREAM,
            data: message,
            callback
          });
        };
        bc2.playbackStream.readStream = function(playbackStreamId, callback) {
          var message = {
            playbackStreamId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYBACK_STREAM,
            operation: bc2.playbackStream.OPERATION_READ_STREAM,
            data: message,
            callback
          });
        };
        bc2.playbackStream.endStream = function(playbackStreamId, callback) {
          var message = {
            playbackStreamId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYBACK_STREAM,
            operation: bc2.playbackStream.OPERATION_END_STREAM,
            data: message,
            callback
          });
        };
        bc2.playbackStream.deleteStream = function(playbackStreamId, callback) {
          var message = {
            playbackStreamId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYBACK_STREAM,
            operation: bc2.playbackStream.OPERATION_DELETE_STREAM,
            data: message,
            callback
          });
        };
        bc2.playbackStream.addEvent = function(playbackStreamId, eventData, summary, callback) {
          var message = {
            playbackStreamId,
            eventData,
            summary
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYBACK_STREAM,
            operation: bc2.playbackStream.OPERATION_ADD_EVENT,
            data: message,
            callback
          });
        };
        bc2.playbackStream.getRecentStreamsForInitiatingPlayer = function(initiatingPlayerId, maxNumStreams, callback) {
          var message = {
            initiatingPlayerId,
            maxNumStreams
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYBACK_STREAM,
            operation: bc2.playbackStream.OPERATION_GET_RECENT_STREAMS_FOR_INITIATING_PLAYER,
            data: message,
            callback
          });
        };
        bc2.playbackStream.getRecentStreamsForTargetPlayer = function(targetPlayerId, maxNumStreams, callback) {
          var message = {
            targetPlayerId,
            maxNumStreams
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYBACK_STREAM,
            operation: bc2.playbackStream.OPERATION_GET_RECENT_STREAMS_FOR_TARGET_PLAYER,
            data: message,
            callback
          });
        };
        bc2.playbackStream.protectStreamUntil = function(playbackStreamId, numDays, callback) {
          var message = {
            playbackStreamId,
            numDays
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYBACK_STREAM,
            operation: bc2.playbackStream.OPERATION_PROTECT_STREAM_UNTIL,
            data: message,
            callback
          });
        };
      }
      BCPlaybackStream.apply(
        window.brainCloudClient = window.brainCloudClient || {}
      );
      function BCPlayerState() {
        var bc2 = this;
        bc2.playerState = {};
        bc2.SERVICE_PLAYERSTATE = "playerState";
        bc2.playerState.OPERATION_SEND = "SEND";
        bc2.playerState.OPERATION_UPDATE_EVENT_DATA = "UPDATE_EVENT_DATA";
        bc2.playerState.OPERATION_DELETE_INCOMING = "DELETE_INCOMING";
        bc2.playerState.OPERATION_DELETE_SENT = "DELETE_SENT";
        bc2.playerState.OPERATION_FULL_PLAYER_RESET = "FULL_PLAYER_RESET";
        bc2.playerState.OPERATION_GAME_DATA_RESET = "GAME_DATA_RESET";
        bc2.playerState.OPERATION_UPDATE_SUMMARY = "UPDATE_SUMMARY";
        bc2.playerState.OPERATION_READ_FRIENDS = "READ_FRIENDS";
        bc2.playerState.OPERATION_READ_FRIEND_PLAYER_STATE = "READ_FRIEND_PLAYER_STATE";
        bc2.playerState.OPERATION_UPDATE_ATTRIBUTES = "UPDATE_ATTRIBUTES";
        bc2.playerState.OPERATION_REMOVE_ATTRIBUTES = "REMOVE_ATTRIBUTES";
        bc2.playerState.OPERATION_GET_ATTRIBUTES = "GET_ATTRIBUTES";
        bc2.playerState.OPERATION_UPDATE_PICTURE_URL = "UPDATE_PICTURE_URL";
        bc2.playerState.OPERATION_UPDATE_CONTACT_EMAIL = "UPDATE_CONTACT_EMAIL";
        bc2.playerState.OPERATION_READ = "READ";
        bc2.playerState.OPERATION_UPDATE_NAME = "UPDATE_NAME";
        bc2.playerState.OPERATION_LOGOUT = "LOGOUT";
        bc2.playerState.OPERATION_CLEAR_USER_STATUS = "CLEAR_USER_STATUS";
        bc2.playerState.OPERATION_EXTEND_USER_STATUS = "EXTEND_USER_STATUS";
        bc2.playerState.OPERATION_GET_USER_STATUS = "GET_USER_STATUS";
        bc2.playerState.OPERATION_SET_USER_STATUS = "SET_USER_STATUS";
        bc2.playerState.OPERATION_UPDATE_TIME_ZONE_OFFSET = "UPDATE_TIMEZONE_OFFSET";
        bc2.playerState.OPERATION_UPDATE_LANGUAGE_CODE = "UPDATE_LANGUAGE_CODE";
        bc2.playerState.deleteUser = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_FULL_PLAYER_RESET,
            callback
          });
        };
        bc2.playerState.getAttributes = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_GET_ATTRIBUTES,
            callback
          });
        };
        bc2.playerState.logout = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_LOGOUT,
            callback
          });
        };
        bc2.playerState.readUserState = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_READ,
            callback
          });
        };
        bc2.playerState.removeAttributes = function(attributes, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_REMOVE_ATTRIBUTES,
            data: {
              attributes
            },
            callback
          });
        };
        bc2.playerState.updateTimeZoneOffset = function(timeZoneOffset, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_UPDATE_TIME_ZONE_OFFSET,
            data: {
              timeZoneOffset
            },
            callback
          });
        };
        bc2.playerState.updateLanguageCode = function(languageCode, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_UPDATE_LANGUAGE_CODE,
            data: {
              languageCode
            },
            callback
          });
        };
        bc2.playerState.resetUser = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_GAME_DATA_RESET,
            callback
          });
        };
        bc2.playerState.updateAttributes = function(attributes, wipeExisting, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_UPDATE_ATTRIBUTES,
            data: {
              attributes,
              wipeExisting
            },
            callback
          });
        };
        bc2.playerState.updateUserName = function(name, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_UPDATE_NAME,
            data: {
              playerName: name
            },
            callback
          });
        };
        bc2.playerState.updateSummaryFriendData = function(summaryFriendData, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_UPDATE_SUMMARY,
            data: {
              summaryFriendData
            },
            callback
          });
        };
        bc2.playerState.updateUserPictureUrl = function(pictureUrl, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_UPDATE_PICTURE_URL,
            data: {
              playerPictureUrl: pictureUrl
            },
            callback
          });
        };
        bc2.playerState.updateContactEmail = function(contactEmail, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_UPDATE_CONTACT_EMAIL,
            data: {
              contactEmail
            },
            callback
          });
        };
        bc2.playerState.clearUserStatus = function(statusName, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_CLEAR_USER_STATUS,
            data: {
              statusName
            },
            callback
          });
        };
        bc2.playerState.extendUserStatus = function(statusName, additionalSecs, details, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_EXTEND_USER_STATUS,
            data: {
              statusName,
              additionalSecs,
              details
            },
            callback
          });
        };
        bc2.playerState.getUserStatus = function(statusName, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_GET_USER_STATUS,
            data: {
              statusName
            },
            callback
          });
        };
        bc2.playerState.setUserStatus = function(statusName, durationSecs, details, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYERSTATE,
            operation: bc2.playerState.OPERATION_SET_USER_STATUS,
            data: {
              statusName,
              durationSecs,
              details
            },
            callback
          });
        };
      }
      BCPlayerState.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCPlayerStatisticsEvent() {
        var bc2 = this;
        bc2.playerStatisticsEvent = {};
        bc2.SERVICE_PLAYER_STATISTICS_EVENT = "playerStatisticsEvent";
        bc2.playerStatisticsEvent.OPERATION_TRIGGER = "TRIGGER";
        bc2.playerStatisticsEvent.OPERATION_TRIGGER_MULTIPLE = "TRIGGER_MULTIPLE";
        bc2.playerStatisticsEvent.triggerStatsEvent = function(eventName, eventMultiplier, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYER_STATISTICS_EVENT,
            operation: bc2.playerStatisticsEvent.OPERATION_TRIGGER,
            data: {
              eventName,
              eventMultiplier
            },
            callback
          });
        };
        bc2.playerStatisticsEvent.triggerStatsEvents = function(events, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYER_STATISTICS_EVENT,
            operation: bc2.playerStatisticsEvent.OPERATION_TRIGGER_MULTIPLE,
            data: {
              events
            },
            callback
          });
        };
      }
      BCPlayerStatisticsEvent.apply(
        window.brainCloudClient = window.brainCloudClient || {}
      );
      function BCPlayerStatistics() {
        var bc2 = this;
        bc2.playerStatistics = {};
        bc2.SERVICE_PLAYER_STATISTICS = "playerStatistics";
        bc2.playerStatistics.READ = "READ";
        bc2.playerStatistics.READ_SUBSET = "READ_SUBSET";
        bc2.playerStatistics.READ_SHARED = "READ_SHARED";
        bc2.playerStatistics.READ_FOR_CATEGORY = "READ_FOR_CATEGORY";
        bc2.playerStatistics.RESET = "RESET";
        bc2.playerStatistics.UPDATE = "UPDATE";
        bc2.playerStatistics.UPDATE_INCREMENT = "UPDATE_INCREMENT";
        bc2.playerStatistics.UPDATE_SET_MINIMUM = "UPDATE_SET_MINIMUM";
        bc2.playerStatistics.UPDATE_INCREMENT_TO_MAXIMUM = "UPDATE_INCREMENT_TO_MAXIMUM";
        bc2.playerStatistics.OPERATION_PROCESS_STATISTICS = "PROCESS_STATISTICS";
        bc2.playerStatistics.OPERATION_READ_NEXT_XPLEVEL = "READ_NEXT_XPLEVEL";
        bc2.playerStatistics.OPERATION_SET_XPPOINTS = "SET_XPPOINTS";
        bc2.playerStatistics.getNextExperienceLevel = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYER_STATISTICS,
            operation: bc2.playerStatistics.OPERATION_READ_NEXT_XPLEVEL,
            callback
          });
        };
        bc2.playerStatistics.incrementExperiencePoints = function(xp, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYER_STATISTICS,
            operation: bc2.playerStatistics.UPDATE,
            data: {
              xp_points: xp
            },
            callback
          });
        };
        bc2.playerStatistics.incrementUserStats = function(stats, xp, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYER_STATISTICS,
            operation: bc2.playerStatistics.UPDATE,
            data: {
              statistics: stats,
              xp_points: xp
            },
            callback
          });
        };
        bc2.playerStatistics.readAllUserStats = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYER_STATISTICS,
            operation: bc2.playerStatistics.READ,
            callback
          });
        };
        bc2.playerStatistics.readUserStatsSubset = function(subset, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYER_STATISTICS,
            operation: bc2.playerStatistics.READ_SUBSET,
            data: {
              statistics: subset
            },
            callback
          });
        };
        bc2.playerStatistics.readUserStatsForCategory = function(category, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYER_STATISTICS,
            operation: bc2.playerStatistics.READ_FOR_CATEGORY,
            data: {
              category
            },
            callback
          });
        };
        bc2.playerStatistics.resetAllUserStats = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYER_STATISTICS,
            operation: bc2.playerStatistics.RESET,
            callback
          });
        };
        bc2.playerStatistics.setExperiencePoints = function(xp, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYER_STATISTICS,
            operation: bc2.playerStatistics.OPERATION_SET_XPPOINTS,
            data: {
              xp_points: xp
            },
            callback
          });
        };
        bc2.playerStatistics.processStatistics = function(stats, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PLAYER_STATISTICS,
            operation: bc2.globalStatistics.OPERATION_PROCESS_STATISTICS,
            data: {
              statistics: stats
            },
            callback
          });
        };
      }
      BCPlayerStatistics.apply(
        window.brainCloudClient = window.brainCloudClient || {}
      );
      function BCPresence() {
        var bc2 = this;
        bc2.presence = {};
        bc2.SERVICE_PRESENCE = "presence";
        bc2.presence.OPERATION_FORCE_PUSH = "FORCE_PUSH";
        bc2.presence.OPERATION_GET_PRESENCE_OF_FRIENDS = "GET_PRESENCE_OF_FRIENDS";
        bc2.presence.OPERATION_GET_PRESENCE_OF_GROUP = "GET_PRESENCE_OF_GROUP";
        bc2.presence.OPERATION_GET_PRESENCE_OF_USERS = "GET_PRESENCE_OF_USERS";
        bc2.presence.OPERATION_REGISTER_LISTENERS_FOR_FRIENDS = "REGISTER_LISTENERS_FOR_FRIENDS";
        bc2.presence.OPERATION_REGISTER_LISTENERS_FOR_GROUP = "REGISTER_LISTENERS_FOR_GROUP";
        bc2.presence.OPERATION_REGISTER_LISTENERS_FOR_PROFILES = "REGISTER_LISTENERS_FOR_PROFILES";
        bc2.presence.OPERATION_SET_VISIBILITY = "SET_VISIBILITY";
        bc2.presence.OPERATION_STOP_LISTENING = "STOP_LISTENING";
        bc2.presence.OPERATION_UPDATE_ACTIVITY = "UPDATE_ACTIVITY";
        bc2.presence.forcePush = function(callback) {
          var message = null;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PRESENCE,
            operation: bc2.presence.OPERATION_FORCE_PUSH,
            data: message,
            callback
          });
        };
        bc2.presence.getPresenceOfFriends = function(platform, includeOffline, callback) {
          var message = {
            platform,
            includeOffline
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PRESENCE,
            operation: bc2.presence.OPERATION_GET_PRESENCE_OF_FRIENDS,
            data: message,
            callback
          });
        };
        bc2.presence.getPresenceOfGroup = function(groupId, includeOffline, callback) {
          var message = {
            groupId,
            includeOffline
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PRESENCE,
            operation: bc2.presence.OPERATION_GET_PRESENCE_OF_GROUP,
            data: message,
            callback
          });
        };
        bc2.presence.getPresenceOfUsers = function(profileIds, includeOffline, callback) {
          var message = {
            profileIds,
            includeOffline
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PRESENCE,
            operation: bc2.presence.OPERATION_GET_PRESENCE_OF_USERS,
            data: message,
            callback
          });
        };
        bc2.presence.registerListenersForFriends = function(platform, bidirectional, callback) {
          var message = {
            platform,
            bidirectional
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PRESENCE,
            operation: bc2.presence.OPERATION_REGISTER_LISTENERS_FOR_FRIENDS,
            data: message,
            callback
          });
        };
        bc2.presence.registerListenersForGroup = function(groupId, bidirectional, callback) {
          var message = {
            groupId,
            bidirectional
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PRESENCE,
            operation: bc2.presence.OPERATION_REGISTER_LISTENERS_FOR_GROUP,
            data: message,
            callback
          });
        };
        bc2.presence.registerListenersForProfiles = function(profileIds, bidriectional, callback) {
          var message = {
            profileIds,
            bidriectional
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PRESENCE,
            operation: bc2.presence.OPERATION_REGISTER_LISTENERS_FOR_PROFILES,
            data: message,
            callback
          });
        };
        bc2.presence.setVisibility = function(visible, callback) {
          var message = {
            visible
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PRESENCE,
            operation: bc2.presence.OPERATION_SET_VISIBILITY,
            data: message,
            callback
          });
        };
        bc2.presence.stopListening = function(callback) {
          var message = {};
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PRESENCE,
            operation: bc2.presence.OPERATION_STOP_LISTENING,
            data: message,
            callback
          });
        };
        bc2.presence.updateActivity = function(activity, callback) {
          var message = {
            activity
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PRESENCE,
            operation: bc2.presence.OPERATION_UPDATE_ACTIVITY,
            data: message,
            callback
          });
        };
      }
      BCPresence.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCProfanity() {
        var bc2 = this;
        bc2.profanity = {};
        bc2.SERVICE_PROFANITY = "profanity";
        bc2.profanity.OPERATION_PROFANITY_CHECK = "PROFANITY_CHECK";
        bc2.profanity.OPERATION_PROFANITY_REPLACE_TEXT = "PROFANITY_REPLACE_TEXT";
        bc2.profanity.OPERATION_PROFANITY_IDENTIFY_BAD_WORDS = "PROFANITY_IDENTIFY_BAD_WORDS";
        bc2.profanity.profanityCheck = function(text, languages, flagEmail, flagPhone, flagUrls, callback) {
          var data = {};
          data["text"] = text;
          if (languages != null) {
            data["languages"] = languages;
          }
          data["flagEmail"] = flagEmail;
          data["flagPhone"] = flagPhone;
          data["flagUrls"] = flagUrls;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PROFANITY,
            operation: bc2.profanity.OPERATION_PROFANITY_CHECK,
            data,
            callback
          });
        };
        bc2.profanity.profanityReplaceText = function(text, replaceSymbol, languages, flagEmail, flagPhone, flagUrls, callback) {
          var data = {};
          data["text"] = text;
          data["replaceSymbol"] = replaceSymbol;
          if (languages != null) {
            data["languages"] = languages;
          }
          data["flagEmail"] = flagEmail;
          data["flagPhone"] = flagPhone;
          data["flagUrls"] = flagUrls;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PROFANITY,
            operation: bc2.profanity.OPERATION_PROFANITY_REPLACE_TEXT,
            data,
            callback
          });
        };
        bc2.profanity.profanityIdentifyBadWords = function(text, languages, flagEmail, flagPhone, flagUrls, callback) {
          var data = {};
          data["text"] = text;
          if (languages != null) {
            data["languages"] = languages;
          }
          data["flagEmail"] = flagEmail;
          data["flagPhone"] = flagPhone;
          data["flagUrls"] = flagUrls;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PROFANITY,
            operation: bc2.profanity.OPERATION_PROFANITY_IDENTIFY_BAD_WORDS,
            data,
            callback
          });
        };
      }
      BCProfanity.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCPushNotifications() {
        var bc2 = this;
        bc2.pushNotification = {};
        bc2.SERVICE_PUSH_NOTIFICATION = "pushNotification";
        bc2.pushNotification.OPERATION_DEREGISTER_ALL = "DEREGISTER_ALL";
        bc2.pushNotification.OPERATION_DEREGISTER = "DEREGISTER";
        bc2.pushNotification.OPERATION_SEND_SIMPLE = "SEND_SIMPLE";
        bc2.pushNotification.OPERATION_SEND_RICH = "SEND_RICH";
        bc2.pushNotification.OPERATION_SEND_RAW = "SEND_RAW";
        bc2.pushNotification.OPERATION_SEND_RAW_TO_GROUP = "SEND_RAW_TO_GROUP";
        bc2.pushNotification.OPERATION_SEND_RAW_BATCH = "SEND_RAW_BATCH";
        bc2.pushNotification.OPERATION_REGISTER = "REGISTER";
        bc2.pushNotification.OPERATION_SEND_NORMALIZED_TO_GROUP = "SEND_NORMALIZED_TO_GROUP";
        bc2.pushNotification.OPERATION_SEND_TEMPLATED_TO_GROUP = "SEND_TEMPLATED_TO_GROUP";
        bc2.pushNotification.OPERATION_SEND_NORMALIZED = "SEND_NORMALIZED";
        bc2.pushNotification.OPERATION_SEND_NORMALIZED_BATCH = "SEND_NORMALIZED_BATCH";
        bc2.pushNotification.OPERATION_SCHEDULED_RICH = "SCHEDULE_RICH_NOTIFICATION";
        bc2.pushNotification.OPERATION_SCHEDULED_NORMALIZED = "SCHEDULE_NORMALIZED_NOTIFICATION";
        bc2.pushNotification.OPERATION_SCHEDULED_RAW = "SCHEDULE_RAW_NOTIFICATION";
        bc2.pushNotification.deregisterAllPushNotificationDeviceTokens = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_DEREGISTER_ALL,
            data: {},
            callback
          });
        };
        bc2.pushNotification.deregisterPushNotificationDeviceToken = function(deviceType, deviceToken, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_DEREGISTER,
            data: {
              deviceType,
              deviceToken
            },
            callback
          });
        };
        bc2.pushNotification.registerPushNotificationDeviceToken = function(deviceType, deviceToken, callback) {
          var STATUS_CODE = 400;
          if (!deviceToken || deviceToken.trim().length === 0) {
            var errorJson = JSON.stringify({
              status: STATUS_CODE,
              reason_code: bc2.INVALID_DEVICE_TOKEN,
              message: "Invalid device token: " + deviceToken
            });
            bc2.brainCloudManager.debugLog(
              "Push notification token not registered - empty/null tokens are invalid"
            );
            if (callback) {
              callback(errorJson);
            }
            return;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_REGISTER,
            data: {
              deviceType,
              deviceToken
            },
            callback
          });
        };
        bc2.pushNotification.sendSimplePushNotification = function(toProfileId, message, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SEND_SIMPLE,
            data: {
              toPlayerId: toProfileId,
              message
            },
            callback
          });
        };
        bc2.pushNotification.sendRichPushNotification = function(toProfileId, notificationTemplateId, callback) {
          bc2.pushNotification.sendRichPushNotificationWithParams(
            toProfileId,
            notificationTemplateId,
            null,
            callback
          );
        };
        bc2.pushNotification.sendRichPushNotificationWithParams = function(toProfileId, notificationTemplateId, substitutionJson, callback) {
          var data = {
            toPlayerId: toProfileId,
            notificationTemplateId
          };
          if (substitutionJson) {
            data.substitutions = substitutionJson;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SEND_RICH,
            data,
            callback
          });
        };
        bc2.pushNotification.sendTemplatedPushNotificationToGroup = function(groupId, notificationTemplateId, substitutionJson, callback) {
          var data = {
            groupId,
            notificationTemplateId
          };
          if (substitutionJson) data.substitutions = substitutionJson;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SEND_TEMPLATED_TO_GROUP,
            data,
            callback
          });
        };
        bc2.pushNotification.sendNormalizedPushNotificationToGroup = function(groupId, alertContentJson, customDataJson, callback) {
          var data = {
            groupId,
            alertContent: alertContentJson
          };
          if (customDataJson) data.customData = customDataJson;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SEND_NORMALIZED_TO_GROUP,
            data,
            callback
          });
        };
        bc2.pushNotification.scheduleRawPushNotificationUTC = function(profileId, fcmContent, iosContent, facebookContent, startTime, callback) {
          var data = {
            profileId,
            startDateUTC: startTime
          };
          if (fcmContent) data.fcmContent = fcmContent;
          if (iosContent) data.iosContent = iosContent;
          if (facebookContent) data.facebookContent = facebookContent;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SCHEDULED_RAW,
            data,
            callback
          });
        };
        bc2.pushNotification.scheduleRawPushNotificationMinutes = function(profileId, fcmContent, iosContent, facebookContent, minutesFromNow, callback) {
          var data = {
            profileId,
            minutesFromNow
          };
          if (fcmContent) data.fcmContent = fcmContent;
          if (iosContent) data.iosContent = iosContent;
          if (facebookContent) data.facebookContent = facebookContent;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SCHEDULED_RAW,
            data,
            callback
          });
        };
        bc2.pushNotification.sendRawPushNotification = function(toProfileId, fcmContent, iosContent, facebookContent, callback) {
          var data = {
            toPlayerId: toProfileId
          };
          if (fcmContent) data.fcmContent = fcmContent;
          if (iosContent) data.iosContent = iosContent;
          if (facebookContent) data.facebookContent = facebookContent;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SEND_RAW,
            data,
            callback
          });
        };
        bc2.pushNotification.sendRawPushNotificationBatch = function(profileIds, fcmContent, iosContent, facebookContent, callback) {
          var data = {
            profileIds
          };
          if (fcmContent) data.fcmContent = fcmContent;
          if (iosContent) data.iosContent = iosContent;
          if (facebookContent) data.facebookContent = facebookContent;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SEND_RAW_BATCH,
            data,
            callback
          });
        };
        bc2.pushNotification.sendRawPushNotificationToGroup = function(groupId, fcmContent, iosContent, facebookContent, callback) {
          var data = {
            groupId
          };
          if (fcmContent) data.fcmContent = fcmContent;
          if (iosContent) data.iosContent = iosContent;
          if (facebookContent) data.facebookContent = facebookContent;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SEND_RAW_TO_GROUP,
            data,
            callback
          });
        };
        bc2.pushNotification.scheduleNormalizedPushNotificationUTC = function(profileId, alertContentJson, customDataJson, startTime, callback) {
          var data = {
            profileId,
            alertContent: alertContentJson,
            startDateUTC: startTime
          };
          if (customDataJson) {
            data.customData = customDataJson;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SCHEDULED_NORMALIZED,
            data,
            callback
          });
        };
        bc2.pushNotification.scheduleNormalizedPushNotificationMinutes = function(profileId, alertContentJson, customDataJson, minutesFromNow, callback) {
          var data = {
            profileId,
            alertContent: alertContentJson,
            minutesFromNow
          };
          if (customDataJson) {
            data.customData = customDataJson;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SCHEDULED_NORMALIZED,
            data,
            callback
          });
        };
        bc2.pushNotification.scheduleRichPushNotificationUTC = function(profileId, notificationTemplateId, substitutionJson, startTime, callback) {
          var data = {
            profileId,
            notificationTemplateId,
            startDateUTC: startTime
          };
          if (substitutionJson) {
            data.substitutions = substitutionJson;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SCHEDULED_RICH,
            data,
            callback
          });
        };
        bc2.pushNotification.scheduleRichPushNotificationMinutes = function(profileId, notificationTemplateId, substitutionJson, minutesFromNow, callback) {
          var data = {
            profileId,
            notificationTemplateId,
            minutesFromNow
          };
          if (substitutionJson) {
            data.substitutions = substitutionJson;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SCHEDULED_RICH,
            data,
            callback
          });
        };
        bc2.pushNotification.sendNormalizedPushNotification = function(toProfileId, alertContentJson, customDataJson, callback) {
          var data = {
            toPlayerId: toProfileId,
            alertContent: alertContentJson
          };
          if (customDataJson) data.customData = customDataJson;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SEND_NORMALIZED,
            data,
            callback
          });
        };
        bc2.pushNotification.sendNormalizedPushNotificationBatch = function(profileIds, alertContentJson, customDataJson, callback) {
          var data = {
            profileIds,
            alertContent: alertContentJson
          };
          if (customDataJson) data.customData = customDataJson;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_PUSH_NOTIFICATION,
            operation: bc2.pushNotification.OPERATION_SEND_NORMALIZED_BATCH,
            data,
            callback
          });
        };
      }
      BCPushNotifications.apply(
        window.brainCloudClient = window.brainCloudClient || {}
      );
      function BCReasonCodes() {
        var bc2 = this;
        bc2.reasonCodes = {};
        bc2.reasonCodes.NO_REASON_CODE = 0;
        bc2.reasonCodes.INVALID_NOTIFICATION = 20200;
        bc2.reasonCodes.INVALID_REQUEST = 40001;
        bc2.reasonCodes.CREATING_FACEBOOK_MEMORY = 40200;
        bc2.reasonCodes.SWITCHING_FACEBOOK_MEMORY = 40201;
        bc2.reasonCodes.MERGING_MEMORY = 40202;
        bc2.reasonCodes.RECREATING_ANONYMOUS_MEMORY = 40203;
        bc2.reasonCodes.MOVING_ANONYMOUS_MEMORY = 40204;
        bc2.reasonCodes.LOGIN_SECURITY_ERROR = 40205;
        bc2.reasonCodes.MISSING_IDENTITY_ERROR = 40206;
        bc2.reasonCodes.SWITCHING_PROFILES = 40207;
        bc2.reasonCodes.MISSING_PROFILE_ERROR = 40208;
        bc2.reasonCodes.SECURITY_ERROR = 40209;
        bc2.reasonCodes.DOWNGRADING_TO_ANONYMOUS_ERROR = 40210;
        bc2.reasonCodes.DUPLICATE_IDENTITY_TYPE = 40211;
        bc2.reasonCodes.MERGE_PROFILES = 40212;
        bc2.reasonCodes.INVALID_PROPERTY_NAME = 40213;
        bc2.reasonCodes.EMAIL_NOT_VALIDATED = 40214;
        bc2.reasonCodes.DATABASE_ERROR = 40215;
        bc2.reasonCodes.PROPERTY_NOT_OVERRIDEABLE = 40216;
        bc2.reasonCodes.UNKNOWN_AUTH_ERROR = 40217;
        bc2.reasonCodes.DATABASE_INPUT_TOO_LARGE_ERROR = 40218;
        bc2.reasonCodes.MISSING_APP_EMAIL_ACCOUNT = 40219;
        bc2.reasonCodes.DATABASE_DUP_KEY_ERROR = 40220;
        bc2.reasonCodes.EMAIL_NOT_VALID = 40221;
        bc2.reasonCodes.UNABLE_TO_GET_FRIENDS_FROM_FACEBOOK = 40300;
        bc2.reasonCodes.BAD_SIGNATURE = 40301;
        bc2.reasonCodes.UNABLE_TO_VALIDATE_PLAYER = 40302;
        bc2.reasonCodes.PLAYER_SESSION_EXPIRED = 40303;
        bc2.reasonCodes.NO_SESSION = 40304;
        bc2.reasonCodes.PLAYER_SESSION_MISMATCH = 40305;
        bc2.reasonCodes.OPERATION_REQUIRES_A_SESSION = 40306;
        bc2.reasonCodes.TOKEN_DOES_NOT_MATCH_USER = 40307;
        bc2.reasonCodes.MANUAL_REDIRECT = 40308;
        bc2.reasonCodes.EVENT_CAN_ONLY_SEND_TO_FRIEND_OR_SELF = 40309;
        bc2.reasonCodes.NOT_FRIENDS = 40310;
        bc2.reasonCodes.VC_BALANCE_CANNOT_BE_SPECIFIED = 40311;
        bc2.reasonCodes.VC_LIMIT_EXCEEDED = 40312;
        bc2.reasonCodes.UNABLE_TO_GET_MY_DATA_FROM_FACEBOOK = 40313;
        bc2.reasonCodes.TLS_VERSION_INVALID = 40314;
        bc2.reasonCodes.INVALID_AUTHENTICATION_TYPE = 40315;
        bc2.reasonCodes.INVALID_GAME_ID = 40316;
        bc2.reasonCodes.APPLE_TRANS_ID_ALREADY_CLAIMED = 40317;
        bc2.reasonCodes.CLIENT_VERSION_NOT_SUPPORTED = 40318;
        bc2.reasonCodes.BRAINCLOUD_VERSION_NOT_SUPPORTED = 40319;
        bc2.reasonCodes.PLATFORM_NOT_SUPPORTED = 40320;
        bc2.reasonCodes.INVALID_PLAYER_STATISTICS_EVENT_NAME = 40321;
        bc2.reasonCodes.GAME_VERSION_NOT_SUPPORTED = 40322;
        bc2.reasonCodes.BAD_REFERENCE_DATA = 40324;
        bc2.reasonCodes.MISSING_OAUTH_TOKEN = 40325;
        bc2.reasonCodes.MISSING_OAUTH_VERIFIER = 40326;
        bc2.reasonCodes.MISSING_OAUTH_TOKEN_SECRET = 40327;
        bc2.reasonCodes.MISSING_TWEET = 40328;
        bc2.reasonCodes.FACEBOOK_PAYMENT_ID_ALREADY_PROCESSED = 40329;
        bc2.reasonCodes.DISABLED_GAME = 40330;
        bc2.reasonCodes.MATCH_MAKING_DISABLED = 40331;
        bc2.reasonCodes.UPDATE_FAILED = 40332;
        bc2.reasonCodes.INVALID_OPERATION = 40333;
        bc2.reasonCodes.MATCH_RANGE_ERROR = 40334;
        bc2.reasonCodes.PLAYER_IN_MATCH = 40335;
        bc2.reasonCodes.MATCH_PLAYER_SHIELDED = 40336;
        bc2.reasonCodes.MATCH_PLAYER_MISSING = 40337;
        bc2.reasonCodes.MATCH_PLAYER_LOGGED_IN = 40338;
        bc2.reasonCodes.INVALID_ITEM_ID = 40339;
        bc2.reasonCodes.MISSING_PRICE = 40340;
        bc2.reasonCodes.MISSING_USER_INFO = 40341;
        bc2.reasonCodes.MISSING_STEAM_RESPONSE = 40342;
        bc2.reasonCodes.MISSING_STEAM_TRANSACTION = 40343;
        bc2.reasonCodes.ENTITY_VERSION_MISMATCH = 40344;
        bc2.reasonCodes.MISSING_RECORD = 40345;
        bc2.reasonCodes.INSUFFICIENT_PERMISSIONS = 40346;
        bc2.reasonCodes.INVALID_DATABASE_FIELD_NAME = 40347;
        bc2.reasonCodes.MISSING_IN_QUERY = 40347;
        bc2.reasonCodes.RECORD_EXPIRED = 40348;
        bc2.reasonCodes.INVALID_WHERE = 40349;
        bc2.reasonCodes.S3_ERROR = 40350;
        bc2.reasonCodes.INVALID_ATTRIBUTES = 40351;
        bc2.reasonCodes.IMPORT_MISSING_GAME_DATA = 40352;
        bc2.reasonCodes.IMPORT_SCHEMA_VERSION_TOO_OLD = 40353;
        bc2.reasonCodes.IMPORT_MISSING_DIVISION_SETS = 40354;
        bc2.reasonCodes.IMPORT_SCHEMA_VERSION_INVALID = 40355;
        bc2.reasonCodes.PLAYER_SESSION_LOGGED_OUT = 40356;
        bc2.reasonCodes.API_HOOK_SCRIPT_ERROR = 40357;
        bc2.reasonCodes.MISSING_REQUIRED_PARAMETER = 40358;
        bc2.reasonCodes.INVALID_PARAMETER_TYPE = 40359;
        bc2.reasonCodes.INVALID_IDENTITY_TYPE = 40360;
        bc2.reasonCodes.EMAIL_SEND_ERROR = 40361;
        bc2.reasonCodes.CHILD_ENTITY_PARTIAL_UPDATE_INVALID_DATA = 40362;
        bc2.reasonCodes.MISSING_SCRIPT = 40363;
        bc2.reasonCodes.SCRIPT_SECURITY_ERROR = 40364;
        bc2.reasonCodes.SERVER_SESSION_EXPIRED = 40365;
        bc2.reasonCodes.STREAM_DOES_NOT_EXIST = 40366;
        bc2.reasonCodes.STREAM_DOES_NOT_EXIT = 40366;
        bc2.reasonCodes.STREAM_ACCESS_ERROR = 40367;
        bc2.reasonCodes.STREAM_COMPLETE = 40368;
        bc2.reasonCodes.INVALID_STATISTIC_NAME = 40369;
        bc2.reasonCodes.INVALID_HTTP_REQUEST = 40370;
        bc2.reasonCodes.GAME_LIMIT_REACHED = 40371;
        bc2.reasonCodes.GAME_RUNSTATE_DISABLED = 40372;
        bc2.reasonCodes.INVALID_COMPANY_ID = 40373;
        bc2.reasonCodes.INVALID_PLAYER_ID = 40374;
        bc2.reasonCodes.INVALID_TEMPLATE_ID = 40375;
        bc2.reasonCodes.MINIMUM_SEARCH_INPUT = 40376;
        bc2.reasonCodes.MISSING_GAME_PARENT = 40377;
        bc2.reasonCodes.GAME_PARENT_MISMATCH = 40378;
        bc2.reasonCodes.CHILD_PLAYER_MISSING = 40379;
        bc2.reasonCodes.MISSING_PLAYER_PARENT = 40380;
        bc2.reasonCodes.PLAYER_PARENT_MISMATCH = 40381;
        bc2.reasonCodes.MISSING_PLAYER_ID = 40382;
        bc2.reasonCodes.DECODE_CONTEXT = 40383;
        bc2.reasonCodes.INVALID_QUERY_CONTEXT = 40384;
        bc2.reasonCodes.INVALID_AMOUNT = 40385;
        bc2.reasonCodes.GROUP_MEMBER_NOT_FOUND = 40385;
        bc2.reasonCodes.INVALID_SORT = 40386;
        bc2.reasonCodes.GAME_NOT_FOUND = 40387;
        bc2.reasonCodes.GAMES_NOT_IN_SAME_COMPANY = 40388;
        bc2.reasonCodes.IMPORT_NO_PARENT_ASSIGNED = 40389;
        bc2.reasonCodes.IMPORT_PARENT_CURRENCIES_MISMATCH = 40390;
        bc2.reasonCodes.INVALID_SUBSTITUION_ENTRY = 40391;
        bc2.reasonCodes.INVALID_TEMPLATE_STRING = 40392;
        bc2.reasonCodes.TEMPLATE_SUBSTITUTION_ERROR = 40393;
        bc2.reasonCodes.INVALID_OPPONENTS = 40394;
        bc2.reasonCodes.REDEMPTION_CODE_NOT_FOUND = 40395;
        bc2.reasonCodes.REDEMPTION_CODE_VERSION_MISMATCH = 40396;
        bc2.reasonCodes.REDEMPTION_CODE_ACTIVE = 40397;
        bc2.reasonCodes.REDEMPTION_CODE_NOT_ACTIVE = 40398;
        bc2.reasonCodes.REDEMPTION_CODE_TYPE_NOT_FOUND = 40399;
        bc2.reasonCodes.REDEMPTION_CODE_INVALID = 40400;
        bc2.reasonCodes.REDEMPTION_CODE_REDEEMED = 40401;
        bc2.reasonCodes.REDEMPTION_CODE_REDEEMED_BY_SELF = 40402;
        bc2.reasonCodes.REDEMPTION_CODE_REDEEMED_BY_OTHER = 40403;
        bc2.reasonCodes.SCRIPT_EMPTY = 40404;
        bc2.reasonCodes.ITUNES_COMMUNICATION_ERROR = 40405;
        bc2.reasonCodes.ITUNES_NO_RESPONSE = 40406;
        bc2.reasonCodes.ITUNES_RESPONSE_NOT_OK = 40407;
        bc2.reasonCodes.JSON_PARSING_ERROR = 40408;
        bc2.reasonCodes.ITUNES_NULL_RESPONSE = 40409;
        bc2.reasonCodes.ITUNES_RESPONSE_WITH_NULL_STATUS = 40410;
        bc2.reasonCodes.ITUNES_STATUS_BAD_JSON_RECEIPT = 40411;
        bc2.reasonCodes.ITUNES_STATUS_BAD_RECEIPT = 40412;
        bc2.reasonCodes.ITUNES_STATUS_RECEIPT_NOT_AUTHENTICATED = 40413;
        bc2.reasonCodes.ITUNES_STATUS_BAD_SHARED_SECRET = 40414;
        bc2.reasonCodes.ITUNES_STATUS_RECEIPT_SERVER_UNAVAILABLE = 40415;
        bc2.reasonCodes.ITUNES_RECEIPT_MISSING_ITUNES_PRODUCT_ID = 40416;
        bc2.reasonCodes.PRODUCT_NOT_FOUND_FOR_ITUNES_PRODUCT_ID = 40417;
        bc2.reasonCodes.DATA_STREAM_EVENTS_NOT_ENABLED = 40418;
        bc2.reasonCodes.INVALID_DEVICE_TOKEN = 40419;
        bc2.reasonCodes.ERROR_DELETING_DEVICE_TOKEN = 40420;
        bc2.reasonCodes.WEBPURIFY_NOT_CONFIGURED = 40421;
        bc2.reasonCodes.WEBPURIFY_EXCEPTION = 40422;
        bc2.reasonCodes.WEBPURIFY_FAILURE = 40423;
        bc2.reasonCodes.WEBPURIFY_NOT_ENABLED = 40424;
        bc2.reasonCodes.NAME_CONTAINS_PROFANITY = 40425;
        bc2.reasonCodes.NULL_SESSION = 40426;
        bc2.reasonCodes.PURCHASE_ALREADY_VERIFIED = 40427;
        bc2.reasonCodes.GOOGLE_IAP_NOT_CONFIGURED = 40428;
        bc2.reasonCodes.UPLOAD_FILE_TOO_LARGE = 40429;
        bc2.reasonCodes.FILE_ALREADY_EXISTS = 40430;
        bc2.reasonCodes.CLOUD_STORAGE_SERVICE_ERROR = 40431;
        bc2.reasonCodes.FILE_DOES_NOT_EXIST = 40432;
        bc2.reasonCodes.UPLOAD_ID_MISSING = 40433;
        bc2.reasonCodes.UPLOAD_JOB_MISSING = 40434;
        bc2.reasonCodes.UPLOAD_JOB_EXPIRED = 40435;
        bc2.reasonCodes.UPLOADER_EXCEPTION = 40436;
        bc2.reasonCodes.UPLOADER_FILESIZE_MISMATCH = 40437;
        bc2.reasonCodes.PUSH_NOTIFICATIONS_NOT_CONFIGURED = 40438;
        bc2.reasonCodes.MATCHMAKING_FILTER_SCRIPT_FAILURE = 40439;
        bc2.reasonCodes.ACCOUNT_ALREADY_EXISTS = 40440;
        bc2.reasonCodes.PROFILE_ALREADY_EXISTS = 40441;
        bc2.reasonCodes.MISSING_NOTIFICATION_BODY = 40442;
        bc2.reasonCodes.INVALID_SERVICE_CODE = 40443;
        bc2.reasonCodes.IP_ADDRESS_BLOCKED = 40444;
        bc2.reasonCodes.UNAPPROVED_SERVICE_CODE = 40445;
        bc2.reasonCodes.PROFILE_NOT_FOUND = 40446;
        bc2.reasonCodes.ENTITY_NOT_SHARED = 40447;
        bc2.reasonCodes.SELF_FRIEND = 40448;
        bc2.reasonCodes.PARSE_NOT_CONFIGURED = 40449;
        bc2.reasonCodes.PARSE_NOT_ENABLED = 40450;
        bc2.reasonCodes.PARSE_REQUEST_ERROR = 40451;
        bc2.reasonCodes.GROUP_CANNOT_ADD_OWNER = 40452;
        bc2.reasonCodes.NOT_GROUP_MEMBER = 40453;
        bc2.reasonCodes.INVALID_GROUP_ROLE = 40454;
        bc2.reasonCodes.GROUP_OWNER_DELETE = 40455;
        bc2.reasonCodes.NOT_INVITED_GROUP_MEMBER = 40456;
        bc2.reasonCodes.GROUP_IS_FULL = 40457;
        bc2.reasonCodes.GROUP_OWNER_CANNOT_LEAVE = 40458;
        bc2.reasonCodes.INVALID_INCREMENT_VALUE = 40459;
        bc2.reasonCodes.GROUP_VERSION_MISMATCH = 40460;
        bc2.reasonCodes.GROUP_ENTITY_VERSION_MISMATCH = 40461;
        bc2.reasonCodes.INVALID_GROUP_ID = 40462;
        bc2.reasonCodes.INVALID_FIELD_NAME = 40463;
        bc2.reasonCodes.UNSUPPORTED_AUTH_TYPE = 40464;
        bc2.reasonCodes.CLOUDCODE_JOB_NOT_FOUND = 40465;
        bc2.reasonCodes.CLOUDCODE_JOB_NOT_SCHEDULED = 40466;
        bc2.reasonCodes.GROUP_TYPE_NOT_FOUND = 40467;
        bc2.reasonCodes.MATCHING_GROUPS_NOT_FOUND = 40468;
        bc2.reasonCodes.GENERATE_CDN_URL_ERROR = 40469;
        bc2.reasonCodes.INVALID_PROFILE_IDS = 40470;
        bc2.reasonCodes.MAX_PROFILE_IDS_EXCEEDED = 40471;
        bc2.reasonCodes.PROFILE_ID_MISMATCH = 40472;
        bc2.reasonCodes.LEADERBOARD_DOESNOT_EXIST = 40473;
        bc2.reasonCodes.APP_LICENSING_EXCEEDED = 40474;
        bc2.reasonCodes.SENDGRID_NOT_INSTALLED = 40475;
        bc2.reasonCodes.SENDGRID_EMAIL_SEND_ERROR = 40476;
        bc2.reasonCodes.SENDGRID_NOT_ENABLED_FOR_APP = 40477;
        bc2.reasonCodes.SENDGRID_GET_TEMPLATES_ERROR = 40478;
        bc2.reasonCodes.SENDGRID_INVALID_API_KEY = 40479;
        bc2.reasonCodes.EMAIL_SERVICE_NOT_CONFIGURED = 40480;
        bc2.reasonCodes.INVALID_EMAIL_TEMPLATE_TYPE = 40481;
        bc2.reasonCodes.SENDGRID_KEY_EMPTY_OR_NULL = 40482;
        bc2.reasonCodes.BODY_TEMPLATE_CANNOT_COEXIST = 40483;
        bc2.reasonCodes.SUBSTITUTION_BODY_CANNOT_COEXIST = 40484;
        bc2.reasonCodes.INVALID_FROM_ADDRESS = 40485;
        bc2.reasonCodes.INVALID_FROM_NAME = 40486;
        bc2.reasonCodes.INVALID_REPLY_TO_ADDRESS = 40487;
        bc2.reasonCodes.INVALID_REPLY_TO_NAME = 40488;
        bc2.reasonCodes.FROM_NAME_WITHOUT_FROM_ADDRESS = 40489;
        bc2.reasonCodes.REPLY_TO_NAME_WITHOUT_REPLY_TO_ADDRESS = 40490;
        bc2.reasonCodes.CURRENCY_SECURITY_ERROR = 40491;
        bc2.reasonCodes.INVALID_PEER_CODE = 40492;
        bc2.reasonCodes.PEER_NO_LONGER_EXISTS = 40493;
        bc2.reasonCodes.CANNOT_MODIFY_TOURNAMENT_WITH_LEADERBOARD_SERVICE = 40494;
        bc2.reasonCodes.NO_TOURNAMENT_ASSOCIATED_WITH_LEADERBOARD = 40495;
        bc2.reasonCodes.TOURNAMENT_NOT_ASSOCIATED_WITH_LEADERBOARD = 40496;
        bc2.reasonCodes.PLAYER_ALREADY_TOURNAMENT_FOR_LEADERBOARD = 40497;
        bc2.reasonCodes.PLAYER_EARLY_FOR_JOINING_TOURNAMENT = 40498;
        bc2.reasonCodes.NO_LEADERBOARD_FOUND = 40499;
        bc2.reasonCodes.PLAYER_NOT_IN_TIME_RANGE_FOR_POSTSCORE_TOURNAMENT = 40500;
        bc2.reasonCodes.LEADERBOARD_ID_BAD = 40501;
        bc2.reasonCodes.SCORE_INPUT_BAD = 40502;
        bc2.reasonCodes.ROUND_STARTED_EPOCH_INPUT_BAD = 40503;
        bc2.reasonCodes.TOURNAMENT_CODE_INPUT_BAD = 40504;
        bc2.reasonCodes.PLAYER_NOT_ENROLLED_IN_TOURNAMENT = 40505;
        bc2.reasonCodes.LEADERBOARD_VERSION_ID_INVALID = 40506;
        bc2.reasonCodes.NOT_ENOUGH_BALANCE_TO_JOIN_TOURNAMENT = 40507;
        bc2.reasonCodes.PARENT_ALREADY_ATTACHED = 40508;
        bc2.reasonCodes.PEER_ALREADY_ATTACHED = 40509;
        bc2.reasonCodes.IDENTITY_NOT_ATTACHED_WITH_PARENT = 40510;
        bc2.reasonCodes.IDENTITY_NOT_ATTACHED_WITH_PEER = 40511;
        bc2.reasonCodes.LEADERBOARD_SCORE_UPDATE_ERROR = 40512;
        bc2.reasonCodes.ERROR_CLAIMING_REWARD = 40513;
        bc2.reasonCodes.NOT_ENOUGH_PARENT_BALANCE_TO_JOIN_TOURNAMENT = 40514;
        bc2.reasonCodes.NOT_ENOUGH_PEER_BALANCE_TO_JOIN_TOURNAMENT = 40515;
        bc2.reasonCodes.PLAYER_LATE_FOR_JOINING_TOURNAMENT = 40516;
        bc2.reasonCodes.VIEWING_REWARD_FOR_NON_PROCESSED_TOURNAMENTS = 40517;
        bc2.reasonCodes.NO_REWARD_ASSOCIATED_WITH_LEADERBOARD = 40518;
        bc2.reasonCodes.PROFILE_PEER_NOT_FOUND = 40519;
        bc2.reasonCodes.LEADERBOARD_IN_ACTIVE_STATE = 40520;
        bc2.reasonCodes.LEADERBOARD_IN_CALCULATING_STATE = 40521;
        bc2.reasonCodes.TOURNAMENT_RESULT_PROCESSING_FAILED = 40522;
        bc2.reasonCodes.TOURNAMENT_REWARDS_ALREADY_CLAIMED = 40523;
        bc2.reasonCodes.NO_TOURNAMENT_FOUND = 40524;
        bc2.reasonCodes.UNEXPECTED_ERROR_RANK_ZERO_AFTER_PROCESSING = 40525;
        bc2.reasonCodes.UNEXPECTED_ERROR_DELETING_TOURNAMENT_LEADERBOARD_SCORE = 40526;
        bc2.reasonCodes.INVALID_RUN_STATE = 40527;
        bc2.reasonCodes.LEADERBOARD_SCORE_DOESNOT_EXIST = 40528;
        bc2.reasonCodes.INITIAL_SCORE_NULL = 40529;
        bc2.reasonCodes.TOURNAMENT_NOTIFICATIONS_PROCESSING_FAILED = 40530;
        bc2.reasonCodes.ACL_NOT_READABLE = 40531;
        bc2.reasonCodes.INVALID_OWNER_ID = 40532;
        bc2.reasonCodes.IMPORT_MISSING_PEERS_DATA = 40533;
        bc2.reasonCodes.INVALID_CREDENTIAL = 40534;
        bc2.reasonCodes.GLOBAL_ENTITY_SECURITY_ERROR = 40535;
        bc2.reasonCodes.LEADERBOARD_SECURITY_ERROR = 40536;
        bc2.reasonCodes.NOT_A_SYSTEM_ENTITY = 40537;
        bc2.reasonCodes.CONTROLLER_ERROR = 40538;
        bc2.reasonCodes.EVENT_MISSING = 40539;
        bc2.reasonCodes.INVALID_XP_LEVEL = 40540;
        bc2.reasonCodes.INVALID_ITUNES_ID = 40541;
        bc2.reasonCodes.IMPORT_ERROR = 40542;
        bc2.reasonCodes.INVALID_ENTITY_TYPE = 40543;
        bc2.reasonCodes.FORM_ERROR = 40544;
        bc2.reasonCodes.INVALID_PARENT = 40545;
        bc2.reasonCodes.INVALID_CURRENCY = 40546;
        bc2.reasonCodes.INVALID_THRESHHOLD = 40547;
        bc2.reasonCodes.MATCH_ALREADY_EXISTS = 40548;
        bc2.reasonCodes.FRIEND_NOT_FOUND = 40549;
        bc2.reasonCodes.MATCH_NOT_FOUND = 40550;
        bc2.reasonCodes.MATCH_COMPLETE = 40551;
        bc2.reasonCodes.MATCH_NOT_STARTED = 40552;
        bc2.reasonCodes.MATCH_EXPIRED = 40553;
        bc2.reasonCodes.PLAYER_NOT_IN_MATCH = 40554;
        bc2.reasonCodes.INVALID_MATCH_VERSION = 40555;
        bc2.reasonCodes.INVALID_TURN_VERSION = 40556;
        bc2.reasonCodes.INVALID_DEVICE_TYPE = 40557;
        bc2.reasonCodes.DUPLICATE_ENTITY = 40558;
        bc2.reasonCodes.DUPLICATE_EVENT = 40559;
        bc2.reasonCodes.INVALID_LEADERBOARD_COUNT = 40560;
        bc2.reasonCodes.DUPLICATE_LEADERBOARD = 40561;
        bc2.reasonCodes.MICROSOFT_ERROR = 40562;
        bc2.reasonCodes.DUPLICATE_TOURNAMENT = 40563;
        bc2.reasonCodes.CREATE_SYSTEM_ENTITY_FAILED = 40564;
        bc2.reasonCodes.INVALID_MAX_NUM_STREAMS = 40565;
        bc2.reasonCodes.INVALID_PACKET_ID = 40566;
        bc2.reasonCodes.HOOK_ERROR = 40567;
        bc2.reasonCodes.INVALID_STREAM_ID = 40568;
        bc2.reasonCodes.INVALID_SCAN_CODE = 40569;
        bc2.reasonCodes.NO_CUSTOM_ENTITY_CONFIG_FOUND = 40570;
        bc2.reasonCodes.NO_CUSTOM_ENTITY_FOUND = 40571;
        bc2.reasonCodes.CLOUD_STORAGE_ERROR = 40572;
        bc2.reasonCodes.NO_CUSTOM_FIELD_CONFIG_FOUND = 40573;
        bc2.reasonCodes.MISSING_CUSTOM_ENTITY_QUERY = 40574;
        bc2.reasonCodes.INVALID_CUSTOM_ENTITY_JSON_WHERE = 40575;
        bc2.reasonCodes.INVALID_CUSTOM_ENTITY_JSON_FIELDS = 40576;
        bc2.reasonCodes.ENTITY_ID_NOT_CONFIGURED = 40577;
        bc2.reasonCodes.UNCONFIGURED_CUSTOM_FIELD_ERROR = 40578;
        bc2.reasonCodes.CUSTOM_ENTITY_SECURITY_ERROR = 40579;
        bc2.reasonCodes.CUSTOM_ENTITY_PARTIAL_UPDATE_INVALID_DATA = 40580;
        bc2.reasonCodes.TOURNAMENT_PLAY_HAS_NOT_STARTED = 40581;
        bc2.reasonCodes.TOURNAMENT_PLAY_HAS_ENDED = 40582;
        bc2.reasonCodes.NEW_CREDENTIAL_IN_USE = 40583;
        bc2.reasonCodes.OLD_CREDENTIAL_NOT_OWNED = 40584;
        bc2.reasonCodes.CLOUD_CODE_SECURITY_ERROR = 40585;
        bc2.reasonCodes.RTT_SERVER_NOT_FOUND = 40586;
        bc2.reasonCodes.RTT_CLIENT_NOT_FOUND = 40587;
        bc2.reasonCodes.NO_RTT_SERVERS_AVAILABLE = 40588;
        bc2.reasonCodes.PROFILE_SESSION_MISMATCH = 40589;
        bc2.reasonCodes.WAITING_FOR_ON_DEMAND_TOURNAMENT_TO_START = 40590;
        bc2.reasonCodes.CDN_URLS_NOT_SUPPORTED = 40591;
        bc2.reasonCodes.CLOUD_CONTAINER_ERROR = 40592;
        bc2.reasonCodes.MESSAGING_FEATURE_NOT_CONFIGURED = 40593;
        bc2.reasonCodes.CHAT_FEATURE_NOT_CONFIGURED = 40594;
        bc2.reasonCodes.MESSAGE_NOT_FOUND = 40595;
        bc2.reasonCodes.COLLECTION_CREATE_DISABLED = 40596;
        bc2.reasonCodes.LEADERBAORD_COLLECTION_CREATE_DISABLED = 40597;
        bc2.reasonCodes.MESSAGE_VERSION_MISMATCH = 40598;
        bc2.reasonCodes.MESSAGEBOX_VERSION_MISMATCH = 40599;
        bc2.reasonCodes.MESSAGE_TOO_LARGE = 40600;
        bc2.reasonCodes.FEATURE_NOT_ENABLED = 40601;
        bc2.reasonCodes.CHANNEL_NOT_FOUND = 40603;
        bc2.reasonCodes.MALFORMED_FORM_DATA = 40604;
        bc2.reasonCodes.MISSING_LAST_PACKET_RESPONSE = 40605;
        bc2.reasonCodes.PACKET_IN_PROGRESS = 40606;
        bc2.reasonCodes.LOBBY_MEMBER_NOT_FOUND = 40607;
        bc2.reasonCodes.LOBBY_TEAM_NOT_FOUND = 40608;
        bc2.reasonCodes.LOBBY_ENTRY_QUEUE_MEMBER_NOT_FOUND = 40609;
        bc2.reasonCodes.INVALID_HEADER_APP_ID = 40610;
        bc2.reasonCodes.LOBBY_TYPE_NOT_FOUND = 40611;
        bc2.reasonCodes.LOBBY_TEAM_FULL = 40612;
        bc2.reasonCodes.LOBBY_NOT_FOUND = 40613;
        bc2.reasonCodes.MESSAGE_CONTENT_INVALID_JSON = 40614;
        bc2.reasonCodes.RTT_FEATURE_NOT_CONFIGURED = 40615;
        bc2.reasonCodes.CLOUD_CODE_ONLY_METHOD = 40616;
        bc2.reasonCodes.MESSAGE_FROM_JSON_ID_MUST_BE_NULL = 40617;
        bc2.reasonCodes.MESSAGE_FROM_JSON_NAME_MANDATORY = 40618;
        bc2.reasonCodes.INVALID_LOBBY_STEP_ALIGNMENT = 40619;
        bc2.reasonCodes.INVALID_LOBBY_STEP_STRATEGY = 40620;
        bc2.reasonCodes.MESSAGING_MAX_RECIPIENTS_EXCEEDED = 40621;
        bc2.reasonCodes.LOBBY_FEATURE_NOT_CONFIGURED = 40622;
        bc2.reasonCodes.TOO_MANY_USERS_FOR_TEAM = 40623;
        bc2.reasonCodes.TOO_MANY_USERS_FOR_LOBBY_TYPE = 40624;
        bc2.reasonCodes.DIVISION_SET_DOESNOT_EXIST = 40625;
        bc2.reasonCodes.LOBBY_CONFIG_NOT_FOUND = 40626;
        bc2.reasonCodes.PRESENCE_NOT_INITIALIZED = 40627;
        bc2.reasonCodes.PRESENCE_FEATURE_NOT_CONFIGURED = 40628;
        bc2.reasonCodes.PLAYER_ALREADY_IN_ACTIVE_DIVISION_SET = 40629;
        bc2.reasonCodes.TOURNAMENT_CODE_MISSING = 40630;
        bc2.reasonCodes.ERROR_ASSIGNING_DIVISION_SET_INSTANCE = 40631;
        bc2.reasonCodes.LEADERBOARD_NOT_DIVISION_SET_INSTANCE = 40632;
        bc2.reasonCodes.DIVISION_SET_SCHEDULING_TYPE_DOES_NOT_EXIST = 40633;
        bc2.reasonCodes.PRESENCE_ACTIVITY_NOT_ENABLED = 40634;
        bc2.reasonCodes.PRESENCE_REALTIME_NOT_ENABLED = 40635;
        bc2.reasonCodes.DIVISION_SET_MAX_SIZE_REACHED = 40636;
        bc2.reasonCodes.DIVISION_SET_INFO_ERROR = 40637;
        bc2.reasonCodes.DIVISION_SET_API_MUST_BE_USED = 40638;
        bc2.reasonCodes.API_CALL_REJECTED = 40639;
        bc2.reasonCodes.LEADERBOARD_TOURNAMENT_TEMPLATE_ONLY = 40640;
        bc2.reasonCodes.INVALID_TOURNAMENT_JOB_ID = 40641;
        bc2.reasonCodes.LEADERBOARD_ROTATION_ERROR = 40642;
        bc2.reasonCodes.CLOUD_COMPUTING_ERROR = 40643;
        bc2.reasonCodes.DOCKER_ERROR = 40644;
        bc2.reasonCodes.ROOM_SERVER_HOST_NOT_FOUND = 40645;
        bc2.reasonCodes.INVALID_ATTACHMENT_DATA = 40646;
        bc2.reasonCodes.SCRIPT_PARSING_ERROR = 40647;
        bc2.reasonCodes.INVALID_LOBBY_STEP_RANGES = 40648;
        bc2.reasonCodes.LOG_IN_LOG_ERROR = 40649;
        bc2.reasonCodes.CACHE_OBJECT_TOO_LARGE = 40650;
        bc2.reasonCodes.IDENTIFY_DORMANT_USERS_FEATURE_NOT_CONFIGURED = 40651;
        bc2.reasonCodes.USER_PURGE_NOTICE_NOT_CONFIGURED = 40652;
        bc2.reasonCodes.INVALID_CX_ID = 40653;
        bc2.reasonCodes.TOO_MANY_CACHE_OBJECTS = 40654;
        bc2.reasonCodes.HOSTING_NOT_ENABLED = 40655;
        bc2.reasonCodes.UNSUPPORTED_GROUP_LEADERBOARD_OPERATION = 40656;
        bc2.reasonCodes.INVALID_PLAYER = 40657;
        bc2.reasonCodes.TOO_MANY_LISTENERS = 40658;
        bc2.reasonCodes.CREATE_FAILED = 40659;
        bc2.reasonCodes.INVALID_PARAMETER_VALUE = 40660;
        bc2.reasonCodes.ITEM_VERSION_MISMATCH = 40661;
        bc2.reasonCodes.ITEM_PUBLISH_ERROR = 40662;
        bc2.reasonCodes.ITEM_NOT_FOUND = 40663;
        bc2.reasonCodes.ITEM_NO_USES = 40664;
        bc2.reasonCodes.ITEM_CREATE_ERROR = 40665;
        bc2.reasonCodes.ITEM_COOL_DOWN = 40666;
        bc2.reasonCodes.TASK_STATE_NOT_FOUND = 40667;
        bc2.reasonCodes.ITEM_UPDATE_ERROR = 40668;
        bc2.reasonCodes.ITEM_DELETE_ERROR = 40669;
        bc2.reasonCodes.ITEM_INVALID_VALUE = 40670;
        bc2.reasonCodes.ITEM_SELL_OR_PURCHASE_REVERSAL_ERROR = 40671;
        bc2.reasonCodes.ITEM_GIFTED = 40672;
        bc2.reasonCodes.MISSING_APP_CONTEXT = 40673;
        bc2.reasonCodes.PUBLIC_KEY_IN_USE = 40674;
        bc2.reasonCodes.CUSTOM_ENTITY_NOT_FOUND = 40675;
        bc2.reasonCodes.ITEM_GIFTING_ERROR = 40676;
        bc2.reasonCodes.ITEM_NOT_AVAILABLE_ON_BLOCKCHAIN = 40677;
        bc2.reasonCodes.MISSING_BLOCKCHAIN_INTEGRATION = 40678;
        bc2.reasonCodes.MISSING_BLOCKCHAIN_USER_IDENTITY = 40679;
        bc2.reasonCodes.STACKABLE_ITEMS_NOT_PERMITTED_ON_BLOCKCHAIN = 40680;
        bc2.reasonCodes.BLOCKCHAIN_PUBLISH_IN_PROGRESS = 40681;
        bc2.reasonCodes.JWT_VERIFY_ERROR = 40682;
        bc2.reasonCodes.USER_ALREADY_EXISTS = 40683;
        bc2.reasonCodes.INVALID_EXT_AUTH_TYPE = 40684;
        bc2.reasonCodes.CUSTOM_ENTITY_INDEX_ERROR = 40685;
        bc2.reasonCodes.CUSTOM_ENTITY_UPDATE_FIELDS_ERROR = 40686;
        bc2.reasonCodes.INVALID_LOBBY_STEP_ALGOS = 40687;
        bc2.reasonCodes.INVALID_COMPOUND_RANGES = 40688;
        bc2.reasonCodes.MISSING_COMPOUND_RANGES = 40689;
        bc2.reasonCodes.MISSING_PING_DATA = 40690;
        bc2.reasonCodes.INVALID_PING_STEP_ALGO = 40691;
        bc2.reasonCodes.GROUP_NOT_FOUND = 40692;
        bc2.reasonCodes.SCRIPT_UPDATE_FAILED = 40693;
        bc2.reasonCodes.CUSTOM_ENTITY_REPLACE_ERROR = 40694;
        bc2.reasonCodes.CUSTOM_ENTITY_TYPE_IMPORT_ERROR = 40695;
        bc2.reasonCodes.CUSTOM_ENTITY_IMPORT_WARNING = 40696;
        bc2.reasonCodes.IDENTIFY_DORMANT_USERS_FOR_EXPORT_NOT_CONFIGURED = 40697;
        bc2.reasonCodes.IDENTIFY_DORMANT_USERS_FOR_EXPORT_ERROR = 40698;
        bc2.reasonCodes.UPDATE_SINGLETON_FAILED = 40699;
        bc2.reasonCodes.INVALID_STORE_ID = 40700;
        bc2.reasonCodes.METHOD_DEPRECATED = 40701;
        bc2.reasonCodes.INVALID_BILLING_PROVIDER_ID = 40702;
        bc2.reasonCodes.INVALID_STORE_DATA = 40703;
        bc2.reasonCodes.USER_FILE_MISSING = 40704;
        bc2.reasonCodes.GLOBAL_FILE_EXISTS = 40705;
        bc2.reasonCodes.INVALID_FILE_NAME = 40706;
        bc2.reasonCodes.FILE_TREE_VERSION_MISMATCH = 40707;
        bc2.reasonCodes.FILE_TREE_FOLDER_MISSING = 40708;
        bc2.reasonCodes.FOLDER_ALREADY_EXISTS = 40709;
        bc2.reasonCodes.INVALID_TREE_ID = 40710;
        bc2.reasonCodes.FILE_VERSION_MISMATCH = 40711;
        bc2.reasonCodes.INVALID_FOLDER_PATH = 40712;
        bc2.reasonCodes.FILENAME_MISMATCH = 40713;
        bc2.reasonCodes.FOLDERPATH_MISMATCH = 40714;
        bc2.reasonCodes.INVALID_CHARS_IN_STRING = 40715;
        bc2.reasonCodes.FOLDER_NOT_EMPTY = 40716;
        bc2.reasonCodes.INVALID_IMAGE_URL = 40717;
        bc2.reasonCodes.UNABLE_TO_UPDATE_PRICE = 40718;
        bc2.reasonCodes.UNABLE_TO_DELETE_PRICE = 40718;
        bc2.reasonCodes.WRONG_JOB_TYPE = 40719;
        bc2.reasonCodes.CLOUDCODE_JOB_NOT_RUNNING = 40720;
        bc2.reasonCodes.SCRIPT_HAS_DEPENDENCIES = 40721;
        bc2.reasonCodes.PEER_SERVICE_NOT_PUBLISHED = 40722;
        bc2.reasonCodes.MISSING_FOLDER_NAME = 40723;
        bc2.reasonCodes.UPLOLAD_IN_PROGRESS = 40724;
        bc2.reasonCodes.REFRESH_IN_PROGRESS = 40725;
        bc2.reasonCodes.REFRESH_INTERRUPTED = 40726;
        bc2.reasonCodes.GAMELIFT_ERROR = 40727;
        bc2.reasonCodes.GAMELIFT_LAUNCH_ERROR = 40728;
        bc2.reasonCodes.MAX_HOSTED_SERVERS_REACHED = 40729;
        bc2.reasonCodes.DUPLICATE_PACKET_ID = 40730;
        bc2.reasonCodes.FEATURE_NOT_SUPPORTED_BY_BILLING_PLAN = 40731;
        bc2.reasonCodes.FEATURE_CONFIGURATION_FAILURE = 40732;
        bc2.reasonCodes.IMPORT_MISSING_ENTRY = 40733;
        bc2.reasonCodes.PENDING_MEMBER_REQUEST_NOT_FOUND = 40734;
        bc2.reasonCodes.EVENT_TO_PROFILE_IDS_SIZE_EXCEEDS_MAXIMUM = 40735;
        bc2.reasonCodes.INVALID_CC_AND_BCC_EMAIL_ADDRESS = 40736;
        bc2.reasonCodes.ROOM_SERVER_RATE_LIMIT = 40737;
        bc2.reasonCodes.EDGEGAP_ERROR = 40738;
        bc2.reasonCodes.PORTAL_SESSION_EXPIRED = 40739;
        bc2.reasonCodes.NO_FRIENDS_FOUND = 40740;
        bc2.reasonCodes.PRODUCT_TRANSACTION_NOT_FOUND = 40741;
        bc2.reasonCodes.ITEM_DEF_NOT_FOUND = 40742;
        bc2.reasonCodes.ITEM_DEF_HAS_DEPENDENCIES = 40743;
        bc2.reasonCodes.TRANSFER_JOB_IDLE_TIMEOUT = 40744;
        bc2.reasonCodes.GROUP_MEMBER_ACL_MORE_RESTRICTIVE_THAN_OTHER = 40745;
        bc2.reasonCodes.GROUP_MEMBER_ACL_MUST_BE_READ_WRITE_FOR_UNOWNED_ENTITY = 40746;
        bc2.reasonCodes.GROUP_MEMBER_ACL_REQUIRED = 40747;
        bc2.reasonCodes.GROUP_TYPE_MAX_MEMBERS_EXCEEDED = 40748;
        bc2.reasonCodes.GROUP_ADD_MEMBER_EXISTS_DIFF_ROLE_ATTRIBS = 40749;
        bc2.reasonCodes.REDEMPTION_IN_PROGRESS = 40750;
        bc2.reasonCodes.REDEMPTION_FAILED = 40751;
        bc2.reasonCodes.REDEMPTION_FAILED_MAX_RETRIES = 40752;
        bc2.reasonCodes.REDEMPTION_CODE_TYPE_DISABLED = 40753;
        bc2.reasonCodes.INVALID_SCAN_CODE_FOR_TYPE = 40754;
        bc2.reasonCodes.REDEMPTION_CODE_TYPE_MISMATCH = 40755;
        bc2.reasonCodes.REDEMPTION_CODE_SCRIPT_FAILURE = 40756;
        bc2.reasonCodes.REDEMPTION_OF_CUSTOM_CODE_FAILED = 40757;
        bc2.reasonCodes.REDEMPTION_CODE_NOT_IN_PROGRESS = 40758;
        bc2.reasonCodes.REDEMPTION_CODE_ATTEMPT_ERROR = 40759;
        bc2.reasonCodes.REDEMPTION_CODE_ATTEMPT_MISMATCH = 40760;
        bc2.reasonCodes.REDEMPTION_CODE_ASYNC_BAD_RESPONSE = 40761;
        bc2.reasonCodes.REDEMPTION_CODE_BY_ID_NOT_FOUND = 40762;
        bc2.reasonCodes.REDEMPTION_CODE_ATTEMPTED_BY_REDEEMED_BY_MISMATCH = 40763;
        bc2.reasonCodes.REDEMPTION_CODE_ATTEMPT_DATA_INVALID = 40764;
        bc2.reasonCodes.REDEMPTION_CODE_MAX_FAILED_EXCEEDED_FOR_USER = 40765;
        bc2.reasonCodes.REDEMPTION_CODE_BLOCKCHAIN_PROXY_ERROR = 40766;
        bc2.reasonCodes.REDEMPTION_CODE_TYPE_NOT_ASYNC = 40767;
        bc2.reasonCodes.REDEMPTION_CODE_ASYNC_PROCESSING_TIMEOUT = 40768;
        bc2.reasonCodes.CODE_TYPE_SCAN_CODE_MISMATCH_FOR_MULTI_USE_CODE = 40769;
        bc2.reasonCodes.DUPLICATE_DIVISION_SET_CONFIG = 40770;
        bc2.reasonCodes.DIVISION_SET_INSTANCE_LEADERBOARDS_STILL_EXIST = 40771;
        bc2.reasonCodes.SINGLETON_ALREADY_EXISTS_FOR_USER = 40772;
        bc2.reasonCodes.CUSTOM_ENTITY_INCREMENT_SINGLETON_DATA_ERROR = 40773;
        bc2.reasonCodes.CUSTOM_ENTITY_COLLECTIONS_MAX_EXCEEDED = 40774;
        bc2.reasonCodes.REDEMPTION_CODE_TYPE_CODE_USE_ERROR = 40775;
        bc2.reasonCodes.MULTI_USE_CODE_REDEMPTION_ATTEMPTED_BEFORE_START = 40776;
        bc2.reasonCodes.MULTI_USE_CODE_REDEMPTION_ATTEMPTED_AFTER_END = 40777;
        bc2.reasonCodes.MULTI_USE_CODE_MAX_REDEMPTIONS_REACHED = 40778;
        bc2.reasonCodes.REDEMPTION_CODE_TYPE_MUST_BE_SINGLE_USE = 40779;
        bc2.reasonCodes.IMPORT_PRECONDITION_ERROR = 40780;
        bc2.reasonCodes.INVALID_SCAN_CODE_LENGTH = 40781;
        bc2.reasonCodes.REDEMPTION_FAILED_MAX_RETRIES_FOR_USER = 40782;
        bc2.reasonCodes.SINGLE_USE_CODE_REDEMPTION_ATTEMPTED_OUTSIDE_TIMEFRAME = 40783;
        bc2.reasonCodes.PRODUCT_DELETE_ERROR = 40784;
        bc2.reasonCodes.INVALID_QUANTITY = 40785;
        bc2.reasonCodes.PRODUCT_NOT_FOUND = 40786;
        bc2.reasonCodes.PRODUCT_ALREADY_PURCHASED = 40787;
        bc2.reasonCodes.BAD_LOGIN_ATTEMPTS_MAX_EXCEEDED = 40788;
        bc2.reasonCodes.INVALID_SCRIPT_CONTEXT = 40789;
        bc2.reasonCodes.USER_BLOCKED = 40790;
        bc2.reasonCodes.NEWRELIC_ERROR = 40791;
        bc2.reasonCodes.ITEM_IMAGE_EXISTS = 40792;
        bc2.reasonCodes.INVALID_SEGMENT_ID_LIST = 40793;
        bc2.reasonCodes.I3D_ERROR = 40794;
        bc2.reasonCodes.INVALID_START_TIME = 40795;
        bc2.reasonCodes.ITEM_TYPE_NOT_APPLICABLE = 40796;
        bc2.reasonCodes.ITEM_PURCHASE_LIST_PRICE_DISABLED = 40797;
        bc2.reasonCodes.BUNDLE_DEF_INVALID = 40798;
        bc2.reasonCodes.REQUEST_FAILED = 40801;
        bc2.reasonCodes.RESET_QUESTS_FAILED = 40802;
        bc2.reasonCodes.RESET_ALL_QUESTS_AND_MILESTONES_FAILED = 40803;
        bc2.reasonCodes.MILESTONE_NOT_FOUND = 40804;
        bc2.reasonCodes.MILESTONE_CREATE_ERROR = 40805;
        bc2.reasonCodes.MILESTONE_UPDATE_ERROR = 40806;
        bc2.reasonCodes.MILESTONE_DELETE_ERROR = 40807;
        bc2.reasonCodes.MILESTONE_VERSION_ERROR = 40808;
        bc2.reasonCodes.QUEST_NOT_FOUND = 40809;
        bc2.reasonCodes.QUEST_CREATE_ERROR = 40810;
        bc2.reasonCodes.QUEST_UPDATE_ERROR = 40811;
        bc2.reasonCodes.QUEST_DELETE_ERROR = 40812;
        bc2.reasonCodes.QUEST_VERSION_ERROR = 40813;
        bc2.reasonCodes.QUEST_ADD_MILESTONE_ERROR = 40814;
        bc2.reasonCodes.QUEST_DELETE_MILESTONE_ERROR = 40815;
        bc2.reasonCodes.QUEST_REORDER_MILESTONES_ERROR = 40816;
        bc2.reasonCodes.MILESTONE_HAS_DEPENDENCIES = 40817;
        bc2.reasonCodes.ACHIEVEMENT_HAS_DEPENDENCIES = 40818;
        bc2.reasonCodes.PROMOTION_NOT_FOUND = 40820;
        bc2.reasonCodes.VERSION_MISMATCH = 40821;
        bc2.reasonCodes.UNSUPPORTED_CRITERIA_FOR_SHARDED_COLLECTIONS = 40822;
        bc2.reasonCodes.USER_RATE_LIMIT_EXCEEDED = 40823;
        bc2.reasonCodes.PROMOTION_CONFIG_INCOMPLETE = 40824;
        bc2.reasonCodes.STEAM_ERROR = 40830;
        bc2.reasonCodes.AZURE_AD_NOT_CONFIGURED = 40831;
        bc2.reasonCodes.INVALID_LEADERBOARD_TOURNAMENT_SETTING = 40840;
        bc2.reasonCodes.LEADERBOARD_EDIT_TOURNAMENT_SETTINGS_ERROR = 40841;
        bc2.reasonCodes.LEADERBOARD_SCORES_EXIST = 40842;
        bc2.reasonCodes.TOURNAMENT_SCORES_EXIST = 40843;
        bc2.reasonCodes.LEADERBOARD_DBVERSION_MISMATCH = 40844;
        bc2.reasonCodes.LEADERBOARD_API_DOES_NOT_APPLY = 40845;
        bc2.reasonCodes.LEADERBOARD_EXPIRED = 40846;
        bc2.reasonCodes.LEADERBOARD_DELETE_ERROR = 40847;
        bc2.reasonCodes.LEADERBOARD_CHANGES_IN_PROGRESS = 40848;
        bc2.reasonCodes.LEADERBOARD_ROTATION_EXIT_PROCESSING_ERROR = 40849;
        bc2.reasonCodes.LEADERBOARD_ENTRY_COUNTS_PROCESSING_ERROR = 40850;
        bc2.reasonCodes.LEADERBOARD_ENTRIES_COUNT_ALL_ERROR = 40851;
        bc2.reasonCodes.MISSING_CONFIG = 40900;
        bc2.reasonCodes.INVALID_SAML_RESP = 40901;
        bc2.reasonCodes.MISSING_PAGE_NAME = 40902;
        bc2.reasonCodes.INVALID_PAGE_NAME = 40903;
        bc2.reasonCodes.MALFORMED_RELAY_STATE = 40904;
        bc2.reasonCodes.INVALID_RESPONSE_ID = 40905;
        bc2.reasonCodes.LOGOUT_ERROR = 40906;
        bc2.reasonCodes.SCRIPT_EXISTS = 40907;
        bc2.reasonCodes.SCRIPT_DUPLICATE_EXISTS = 40908;
        bc2.reasonCodes.INVALID_UPLOAD_EXTENSION = 40909;
        bc2.reasonCodes.SCRIPT_TIMEOUT_ERROR = 40910;
        bc2.reasonCodes.SCRIPT_RHINO_ERROR = 40911;
        bc2.reasonCodes.SCRIPT_JAVA_ERROR = 40912;
        bc2.reasonCodes.CONFIG_BACKUP_PREVIEW_ERROR = 40913;
        bc2.reasonCodes.GROUP_FILE_EXISTS = 40950;
        bc2.reasonCodes.OTHER_USER_ACL_REQUIRED = 40951;
        bc2.reasonCodes.GROUP_MEMBER_ACCESS_INVALID = 40952;
        bc2.reasonCodes.REUSED_PACKET_ID = 40953;
        bc2.reasonCodes.SEGMENT_REFRESH_RUNNING = 41e4;
        bc2.reasonCodes.REFRESH_JOB_ALREADY_TRIGGERED = 410001;
        bc2.reasonCodes.ROOM_SERVER_LAUNCH_FAILURE = 41001;
        bc2.reasonCodes.ROOM_SERVER_UPDATE_LOCK_TIMEOUT = 41002;
        bc2.reasonCodes.ROOM_SERVER_CREATE_LOCK_TIMEOUT = 41003;
        bc2.reasonCodes.NO_TWITTER_CONSUMER_KEY = 500001;
        bc2.reasonCodes.NO_TWITTER_CONSUMER_SECRET = 500002;
        bc2.reasonCodes.INVALID_CONFIGURATION = 500003;
        bc2.reasonCodes.ERROR_GETTING_REQUEST_TOKEN = 500004;
        bc2.reasonCodes.ERROR_GETTING_ACCESS_TOKEN = 500005;
        bc2.reasonCodes.TWITTER_AUTH_ERROR = 500006;
        bc2.reasonCodes.TWITTER_ERROR = 500007;
        bc2.reasonCodes.FACEBOOK_ERROR = 500010;
        bc2.reasonCodes.FACEBOOK_SECRET_MISMATCH = 500011;
        bc2.reasonCodes.FACEBOOK_AUTHENTICATION_ERROR = 500012;
        bc2.reasonCodes.FACEBOOK_APPLICATION_TOKEN_REQUEST_ERROR = 500013;
        bc2.reasonCodes.FACEBOOK_BAD_APPLICATION_TOKEN_SIGNATURE = 500014;
        bc2.reasonCodes.UNSUPPORTED_SOCIAL_PLATFORM_CODE = 500020;
        bc2.reasonCodes.PLAYER_LAST_PURCHASED_AT_ERROR = 500021;
        bc2.reasonCodes.PRODUCT_TRANSACTIONS_SUMMARY_BY_DATE_AND_TYPE_ERROR = 500022;
        bc2.reasonCodes.PRODUCT_TRANSACTIONS_SUMMARY_BY_DATE_AND_ITEM_ERROR = 500023;
        bc2.reasonCodes.ITEM_PURCHASES_ANALYTICS_SUMMARY_ERROR = 500024;
        bc2.reasonCodes.PRODUCT_TRANSACTIONS_PROMOTION_SUMMARY_FOR_ITEM_ERROR = 500025;
        bc2.reasonCodes.PRODUCT_TRANSACTIONS_PROMOTION_SUMMARY_FOR_ITEM_DAYS_ERROR = 500026;
        bc2.reasonCodes.PRODUCT_TRANSACTIONS_SUMMARY_BY_ITEM_ERROR = 500027;
        bc2.reasonCodes.SCAN_PURCHASES_AND_TOTAL_REVENUE_ALL_TIME = 500028;
        bc2.reasonCodes.PRODUCT_TRANSACTIONS_STATS_BY_COUNTRY_ERROR = 500029;
        bc2.reasonCodes.USERS_BY_COUNTRY_STATS_ERROR = 500030;
        bc2.reasonCodes.USERS_BY_LANGUAGE_STATS_ERROR = 500031;
        bc2.reasonCodes.PRODUCT_TRANSACTIONS_SUMMARY_BY_APP_STORE_ERROR = 500032;
        bc2.reasonCodes.USERS_WITH_SINGLE_FIELD_PROJECTION_ERROR = 500033;
        bc2.reasonCodes.SCRIPT_USAGE_FOR_RANGE_ERROR = 500034;
        bc2.reasonCodes.PRODUCT_TRANSACTION_SPENDERS_BY_STORE = 500035;
        bc2.reasonCodes.REAL_AND_MOCK_PURCHASE_COUNTS_FOR_PRODUCT = 500036;
        bc2.reasonCodes.MEMCACHED_TIMEOUT = 503e3;
        bc2.reasonCodes.NOT_TEAM_ADMIN = 55e4;
        bc2.reasonCodes.NO_TEAM_ACCESS = 550001;
        bc2.reasonCodes.MISSING_COMPANY_RECORD = 550002;
        bc2.reasonCodes.TEAM_MEMBER_NOT_FOUND = 550003;
        bc2.reasonCodes.TEAM_MEMBER_NOT_ENABLED = 550004;
        bc2.reasonCodes.TEAM_MEMBER_NOT_ACTIVE = 550005;
        bc2.reasonCodes.TEAM_MEMBER_LOCKED = 550006;
        bc2.reasonCodes.INVALID_PASSWORD = 550007;
        bc2.reasonCodes.TOKEN_INVALID = 550008;
        bc2.reasonCodes.TOKEN_EXPIRED = 550009;
        bc2.reasonCodes.APP_NOT_FOUND = 550010;
        bc2.reasonCodes.TEMPLATE_GAME_NOT_FOUND = 550011;
        bc2.reasonCodes.INVALID_TEMPLATE_GAME_TEAM = 550012;
        bc2.reasonCodes.BASIC_AUTH_FAILURE = 550013;
        bc2.reasonCodes.EMAIL_MISMATCH = 550014;
        bc2.reasonCodes.EMAIL_ID_NOT_FOUND = 550015;
        bc2.reasonCodes.INVALID_AUTH_TYPE = 550016;
        bc2.reasonCodes.APIKEY_EXPIRED = 550017;
        bc2.reasonCodes.APIKEY_NOT_TEAM_SCOPE = 550018;
        bc2.reasonCodes.INVALID_API_KEY = 550019;
        bc2.reasonCodes.TEAM_ADMIN_API_DISABLED = 550020;
        bc2.reasonCodes.TEAM_ADMIN_AUTH_FAILURE = 550021;
        bc2.reasonCodes.INVALID_PASSWORD_CONTENT = 550022;
        bc2.reasonCodes.INVALID_APP_ACCESS = 550023;
        bc2.reasonCodes.INVALID_TEAM_ID = 550024;
        bc2.reasonCodes.TEAM_APPS_CHART_STATS = 550025;
        bc2.reasonCodes.MONGO_DB_EXCEPTION = 600001;
        bc2.reasonCodes.CONCURRENT_LOCK_ERROR = 600002;
        bc2.reasonCodes.USER_EXPORT_ERROR = 600003;
        bc2.reasonCodes.POST_SCORE_ON_BEHALF_OF_ERROR = 600004;
        bc2.reasonCodes.INVALID_USER_STATUS = 600005;
        bc2.reasonCodes.SLACK_WEBHOOK_SEND_ERROR = 600006;
        bc2.reasonCodes.SLACK_NOT_ENABLED_FOR_APP = 600007;
        bc2.reasonCodes.ERROR_AQUIRING_LOBBY_LOCK = 600008;
        bc2.reasonCodes.ERROR_SETTING_NEW_LOBBY_OWNER = 600009;
        bc2.reasonCodes.ERROR_SWITCHING_TEAMS = 600010;
        bc2.reasonCodes.DEPLOY_FAILED = 600011;
        bc2.reasonCodes.IMPORT_EXPORT_TASK_IN_PROGRESS = 600012;
        bc2.reasonCodes.BACKUP_REFERENCE_DATA_FAILED = 600013;
        bc2.reasonCodes.BUILDER_API_KEY_NOT_FOUND = 60100;
        bc2.reasonCodes.BUILDER_API_INVALID_KEY_SCOPE = 60101;
        bc2.reasonCodes.BUILDER_API_UPDATED_AT_MISMATCH = 60102;
        bc2.reasonCodes.BUILDER_API_TEAM_NAME_MISMATCH = 60103;
        bc2.reasonCodes.BUILDER_API_TEAM_HAS_APPS = 60104;
        bc2.reasonCodes.BUILDER_API_UNEXPECTED_EXCEPTION = 60105;
        bc2.reasonCodes.BUILDER_API_PARTIAL_TEAM_DELETION = 60106;
        bc2.reasonCodes.BUILDER_API_APP_DELETED = 60107;
        bc2.reasonCodes.BUILDER_API_APP_DISABLED = 60108;
        bc2.reasonCodes.BUILDER_API_APP_IS_LIVE = 60109;
        bc2.reasonCodes.BUILDER_API_APP_SUSPENDED = 60110;
        bc2.reasonCodes.BUILDER_API_CREATED_AT_MISMATCH = 60111;
        bc2.reasonCodes.PLAYSTATION_NETWORK_ERROR = 60200;
        bc2.reasonCodes.EMAIL_CC_MAX_SIZE_EXCEEDED = 60201;
        bc2.reasonCodes.EMAIL_BCC_MAX_SIZE_EXCEEDED = 60202;
        bc2.reasonCodes.INVALID_DATE_FORMAT = 60203;
        bc2.reasonCodes.TEAM_USAGE_REPORT_ERROR = 60204;
        bc2.reasonCodes.GLOBAL_PROPERTY_MAX_SIZE_EXCEEDED = 60205;
        bc2.reasonCodes.RTT_LEFT_BY_CHOICE = 8e4;
        bc2.reasonCodes.LEFT_BY_CHOICE = 8e4;
        bc2.reasonCodes.RTT_EVICTED = 80001;
        bc2.reasonCodes.EVICTED = 80001;
        bc2.reasonCodes.RTT_LOST_CONNECTION = 80002;
        bc2.reasonCodes.LOST_CONNECTION = 80002;
        bc2.reasonCodes.RTT_TIMEOUT = 80100;
        bc2.reasonCodes.TIMEOUT = 80100;
        bc2.reasonCodes.RTT_ROOM_READY = 80101;
        bc2.reasonCodes.ROOM_READY = 80101;
        bc2.reasonCodes.RTT_ROOM_CANCELLED = 80102;
        bc2.reasonCodes.ROOM_CANCELLED = 80102;
        bc2.reasonCodes.RTT_ERROR_ASSIGNING_ROOM = 80103;
        bc2.reasonCodes.ERROR_ASSIGNING_ROOM = 80103;
        bc2.reasonCodes.RTT_ERROR_LAUNCHING_ROOM = 80104;
        bc2.reasonCodes.ERROR_LAUNCHING_ROOM = 80104;
        bc2.reasonCodes.RTT_BY_REQUEST = 80105;
        bc2.reasonCodes.BY_REQUEST = 80105;
        bc2.reasonCodes.ROOM_READY_TIMEOUT = 80106;
        bc2.reasonCodes.NO_ROOM_SERVER_CONFIGURED = 80109;
        bc2.reasonCodes.RTT_NO_LOBBIES_FOUND = 80200;
        bc2.reasonCodes.NO_LOBBIES_FOUND = 80200;
        bc2.reasonCodes.RTT_FIND_REQUEST_CANCELLED = 80201;
        bc2.reasonCodes.FIND_REQUEST_CANCELLED = 80201;
        bc2.reasonCodes.CLIENT_NETWORK_ERROR_TIMEOUT = 90001;
        bc2.reasonCodes.CLIENT_UPLOAD_FILE_CANCELLED = 90100;
        bc2.reasonCodes.CLIENT_UPLOAD_FILE_TIMED_OUT = 90101;
        bc2.reasonCodes.CLIENT_UPLOAD_FILE_UNKNOWN = 90102;
        bc2.reasonCodes.CLIENT_DISABLED = 90200;
      }
      BCReasonCodes.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCRedemptionCodes() {
        var bc2 = this;
        bc2.redemptionCode = {};
        bc2.SERVICE_REDEMPTION_CODE = "redemptionCode";
        bc2.redemptionCode.OPERATION_REDEEM_CODE = "REDEEM_CODE";
        bc2.redemptionCode.OPERATION_GET_REDEEMED_CODES = "GET_REDEEMED_CODES";
        bc2.redemptionCode.redeemCode = function(scanCode, codeType, jsonCustomRedemptionInfo, callback) {
          var data = {
            scanCode,
            codeType
          };
          if (jsonCustomRedemptionInfo) {
            data.customRedemptionInfo = jsonCustomRedemptionInfo;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_REDEMPTION_CODE,
            operation: bc2.redemptionCode.OPERATION_REDEEM_CODE,
            data,
            callback
          });
        };
        bc2.redemptionCode.getRedeemedCodes = function(codeType, callback) {
          var data = {};
          if (codeType) {
            data.codeType = codeType;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_REDEMPTION_CODE,
            operation: bc2.redemptionCode.OPERATION_GET_REDEEMED_CODES,
            data,
            callback
          });
        };
      }
      BCRedemptionCodes.apply(
        window.brainCloudClient = window.brainCloudClient || {}
      );
      function BCRelay() {
        var bc2 = this;
        bc2.relay = {};
        bc2.SERVICE_RELAY = "relay";
        bc2.relay.TO_ALL_PLAYERS = 1099511627775;
        bc2.relay.CHANNEL_HIGH_PRIORITY_1 = 0;
        bc2.relay.CHANNEL_HIGH_PRIORITY_2 = 1;
        bc2.relay.CHANNEL_NORMAL_PRIORITY = 2;
        bc2.relay.CHANNEL_LOW_PRIORITY = 3;
        bc2.relay.connect = function(options, success, failure) {
          bc2.brainCloudRelayComms.connect(options, success, failure);
        };
        bc2.relay.disconnect = function() {
          bc2.brainCloudRelayComms.disconnect();
        };
        bc2.relay.endMatch = function(json) {
          bc2.brainCloudRelayComms.endMatch(json);
        };
        bc2.relay.isConnected = function() {
          return bc2.brainCloudRelayComms.isConnected;
        };
        bc2.relay.getPing = function() {
          return bc2.brainCloudRelayComms.ping;
        };
        bc2.relay.setPingInterval = function(interval) {
          bc2.brainCloudRelayComms.setPingInterval(interval);
        };
        bc2.relay.getOwnerProfileId = function() {
          return bc2.brainCloudRelayComms.getOwnerProfileId();
        };
        bc2.relay.getOwnerCxId = function() {
          return bc2.brainCloudRelayComms.getOwnerCxId();
        };
        bc2.relay.getProfileIdForNetId = function(netId) {
          return bc2.brainCloudRelayComms.getProfileIdForNetId(netId);
        };
        bc2.relay.getCxIdForNetId = function(netId) {
          return bc2.brainCloudRelayComms.getCxIdForNetId(netId);
        };
        bc2.relay.getNetIdForProfileId = function(profileId) {
          return bc2.brainCloudRelayComms.getNetIdForProfileId(profileId);
        };
        bc2.relay.getNetIdForCxId = function(cxId) {
          return bc2.brainCloudRelayComms.getNetIdForCxId(cxId);
        };
        bc2.relay.registerRelayCallback = function(callback) {
          bc2.brainCloudRelayComms.registerRelayCallback(callback);
        };
        bc2.relay.deregisterRelayCallback = function() {
          bc2.brainCloudRelayComms.deregisterRelayCallback();
        };
        bc2.relay.registerSystemCallback = function(callback) {
          bc2.brainCloudRelayComms.registerSystemCallback(callback);
        };
        bc2.relay.deregisterSystemCallback = function() {
          bc2.brainCloudRelayComms.deregisterSystemCallback();
        };
        bc2.relay.send = function(data, toNetId, reliable, ordered, channel) {
          if (toNetId == bc2.relay.TO_ALL_PLAYERS) {
            bc2.relay.sendToAll(data, reliable, ordered, channel);
          } else {
            var playerMask = Math.pow(2, toNetId);
            bc2.brainCloudRelayComms.sendRelay(
              data,
              playerMask,
              reliable,
              ordered,
              channel
            );
          }
        };
        bc2.relay.sendToPlayers = function(data, playerMask, reliable, ordered, channel) {
          bc2.brainCloudRelayComms.sendRelay(
            data,
            playerMask,
            reliable,
            ordered,
            channel
          );
        };
        bc2.relay.sendToAll = function(data, reliable, ordered, channel) {
          var myProfileId = bc2.authentication.profileId;
          var myNetId = bc2.relay.getNetIdForProfileId(myProfileId);
          var myBit = Math.pow(2, myNetId);
          var playerMask = bc2.relay.TO_ALL_PLAYERS - myBit;
          bc2.brainCloudRelayComms.sendRelay(
            data,
            playerMask,
            reliable,
            ordered,
            channel
          );
        };
      }
      BCRelay.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCRTT() {
        var bc2 = this;
        bc2.rttService = {};
        bc2.SERVICE_RTT = "rttRegistration";
        bc2.rttService.OPERATION_REQUEST_CLIENT_CONNECTION = "REQUEST_CLIENT_CONNECTION";
        bc2.rttService.SERVICE_EVENT = "event";
        bc2.rttService.SERVICE_CHAT = "chat";
        bc2.rttService.SERVICE_LOBBY = "lobby";
        bc2.rttService.SERVICE_MESSAGING = "messaging";
        bc2.rttService.SERVICE_PRESENCE = "presence";
        bc2.rttService.SERVICE_USER_ITEMS = "userItems";
        bc2.rttService.enableRTT = function(success, failure) {
          bc2.brainCloudRttComms.enableRTT(success, failure);
        };
        bc2.rttService.disableRTT = function() {
          bc2.brainCloudRttComms.disableRTT();
        };
        bc2.rttService.isRTTEnabled = function() {
          return bc2.brainCloudRttComms.isRTTEnabled();
        };
        bc2.rttService.getConnectionStatus = function() {
          return bc2.brainCloudRttComms.getConnectionStatus();
        };
        bc2.rttService.getRTTConnectionId = function() {
          return bc2.brainCloudRttComms.getRTTConnectionId();
        };
        bc2.rttService.registerRTTEventCallback = function(callback) {
          bc2.brainCloudRttComms.registerRTTCallback(
            bc2.rttService.SERVICE_EVENT,
            callback
          );
        };
        bc2.rttService.deregisterRTTEventCallback = function() {
          bc2.brainCloudRttComms.deregisterRTTCallback(bc2.rttService.SERVICE_EVENT);
        };
        bc2.rttService.registerRTTChatCallback = function(callback) {
          bc2.brainCloudRttComms.registerRTTCallback(
            bc2.rttService.SERVICE_CHAT,
            callback
          );
        };
        bc2.rttService.deregisterRTTChatCallback = function() {
          bc2.brainCloudRttComms.deregisterRTTCallback(bc2.rttService.SERVICE_CHAT);
        };
        bc2.rttService.registerRTTMessagingCallback = function(callback) {
          bc2.brainCloudRttComms.registerRTTCallback(
            bc2.rttService.SERVICE_MESSAGING,
            callback
          );
        };
        bc2.rttService.deregisterRTTMessagingCallback = function() {
          bc2.brainCloudRttComms.deregisterRTTCallback(bc2.rttService.SERVICE_MESSAGING);
        };
        bc2.rttService.registerRTTLobbyCallback = function(callback) {
          bc2.brainCloudRttComms.registerRTTCallback(
            bc2.rttService.SERVICE_LOBBY,
            callback
          );
        };
        bc2.rttService.deregisterRTTLobbyCallback = function() {
          bc2.brainCloudRttComms.deregisterRTTCallback(bc2.rttService.SERVICE_LOBBY);
        };
        bc2.rttService.registerRTTPresenceCallback = function(callback) {
          bc2.brainCloudRttComms.registerRTTCallback(
            bc2.rttService.SERVICE_PRESENCE,
            callback
          );
        };
        bc2.rttService.deregisterRTTPresenceCallback = function() {
          bc2.brainCloudRttComms.deregisterRTTCallback(bc2.rttService.SERVICE_PRESENCE);
        };
        bc2.rttService.registerRTTBlockchainRefresh = function(callback) {
          bc2.brainCloudRttComms.registerRTTCallback(
            bc2.rttService.SERVICE_USER_INVENTORY_MANAGEMENT,
            callback
          );
        };
        bc2.rttService.deregisterRTTBlockchainCallback = function() {
          bc2.brainCloudRttComms.deregisterRTTCallback(
            bc2.rttService.SERVICE_USER_INVENTORY_MANAGEMENT
          );
        };
        bc2.rttService.deregisterAllRTTCallbacks = function() {
          bc2.brainCloudRttComms.deregisterAllRTTCallbacks();
        };
        bc2.rttService.requestClientConnection = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_RTT,
            operation: bc2.rttService.OPERATION_REQUEST_CLIENT_CONNECTION,
            data: {},
            callback
          });
        };
      }
      BCRTT.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCS3Handler() {
        var bc2 = this;
        bc2.s3Handling = {};
        bc2.SERVICE_S3HANDLING = "s3Handling";
        bc2.s3Handling.OPERATION_GET_FILE_LIST = "GET_FILE_LIST";
        bc2.s3Handling.OPERATION_GET_UPDATED_FILES = "GET_UPDATED_FILES";
        bc2.s3Handling.OPERATION_GET_CDN_URL = "GET_CDN_URL";
        bc2.s3Handling.getUpdatedFiles = function(category, fileDetails, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_S3HANDLING,
            operation: bc2.s3Handling.OPERATION_GET_UPDATED_FILES,
            data: {
              category,
              fileDetails
            },
            callback
          });
        };
        bc2.s3Handling.getFileList = function(category, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_S3HANDLING,
            operation: bc2.s3Handling.OPERATION_GET_FILE_LIST,
            data: {
              category
            },
            callback
          });
        };
        bc2.s3Handling.getCDNUrl = function(fileId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_S3HANDLING,
            operation: bc2.s3Handling.OPERATION_GET_CDN_URL,
            data: {
              fileId
            },
            callback
          });
        };
      }
      BCS3Handler.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCScript() {
        var bc2 = this;
        bc2.script = {};
        bc2.SERVICE_SCRIPT = "script";
        bc2.script.OPERATION_RUN = "RUN";
        bc2.script.OPERATION_SCHEDULE_CLOUD_SCRIPT = "SCHEDULE_CLOUD_SCRIPT";
        bc2.script.OPERATION_RUN_PARENT_SCRIPT = "RUN_PARENT_SCRIPT";
        bc2.script.OPERATION_CANCEL_SCHEDULED_SCRIPT = "CANCEL_SCHEDULED_SCRIPT";
        bc2.script.OPERATION_GET_SCHEDULED_CLOUD_SCRIPTS = "GET_SCHEDULED_CLOUD_SCRIPTS";
        bc2.script.OPERATION_GET_RUNNING_OR_QUEUED_CLOUD_SCRIPTS = "GET_RUNNING_OR_QUEUED_CLOUD_SCRIPTS";
        bc2.script.OPERATION_RUN_PEER_SCRIPT = "RUN_PEER_SCRIPT";
        bc2.script.OPERATION_RUN_PEER_SCRIPT_ASYNC = "RUN_PEER_SCRIPT_ASYNC";
        bc2.script.runScript = function(scriptName, scriptData, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_SCRIPT,
            operation: bc2.script.OPERATION_RUN,
            data: {
              scriptName,
              scriptData
            },
            callback
          });
        };
        bc2.script.scheduleRunScriptMillisUTC = function(scriptName, scriptData, startDateInUTC, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_SCRIPT,
            operation: bc2.script.OPERATION_SCHEDULE_CLOUD_SCRIPT,
            data: {
              scriptName,
              scriptData,
              startDateUTC: startDateInUTC
            },
            callback
          });
        };
        bc2.script.scheduleRunScriptMinutes = function(scriptName, scriptData, minutesFromNow, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_SCRIPT,
            operation: bc2.script.OPERATION_SCHEDULE_CLOUD_SCRIPT,
            data: {
              scriptName,
              scriptData,
              minutesFromNow
            },
            callback
          });
        };
        bc2.script.runParentScript = function(scriptName, scriptData, parentLevel, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_SCRIPT,
            operation: bc2.script.OPERATION_RUN_PARENT_SCRIPT,
            data: {
              scriptName,
              scriptData,
              parentLevel
            },
            callback
          });
        };
        bc2.script.cancelScheduledScript = function(jobId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_SCRIPT,
            operation: bc2.script.OPERATION_CANCEL_SCHEDULED_SCRIPT,
            data: {
              jobId
            },
            callback
          });
        };
        bc2.script.getRunningOrQueuedCloudScripts = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_SCRIPT,
            operation: bc2.script.OPERATION_GET_RUNNING_OR_QUEUED_CLOUD_SCRIPTS,
            callback
          });
        };
        bc2.script.getScheduledCloudScripts = function(startDateInUTC, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_SCRIPT,
            operation: bc2.script.OPERATION_GET_SCHEDULED_CLOUD_SCRIPTS,
            data: {
              startDateUTC: startDateInUTC.getTime()
            },
            callback
          });
        };
        bc2.script.runPeerScript = function(scriptName, scriptData, peer, callback) {
          var message = {
            scriptName,
            peer
          };
          if (scriptData) message.scriptData = scriptData;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_SCRIPT,
            operation: bc2.script.OPERATION_RUN_PEER_SCRIPT,
            data: message,
            callback
          });
        };
        bc2.script.runPeerScriptAsync = function(scriptName, scriptData, peer, callback) {
          var message = {
            scriptName,
            peer
          };
          if (scriptData) message.scriptData = scriptData;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_SCRIPT,
            operation: bc2.script.OPERATION_RUN_PEER_SCRIPT_ASYNC,
            data: message,
            callback
          });
        };
      }
      BCScript.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCSocialLeaderboard() {
        var bc2 = this;
        bc2.socialLeaderboard = {};
        bc2.SERVICE_LEADERBOARD = "leaderboard";
        bc2.socialLeaderboard.OPERATION_POST_SCORE = "POST_SCORE";
        bc2.socialLeaderboard.OPERATION_POST_SCORE_DYNAMIC = "POST_SCORE_DYNAMIC";
        bc2.socialLeaderboard.OPERATION_POST_SCORE_DYNAMIC_USING_CONFIG = "POST_SCORE_DYNAMIC_USING_CONFIG";
        bc2.socialLeaderboard.OPERATION_RESET = "RESET";
        bc2.socialLeaderboard.OPERATION_GET_SOCIAL_LEADERBOARD = "GET_SOCIAL_LEADERBOARD";
        bc2.socialLeaderboard.OPERATION_GET_SOCIAL_LEADERBOARD_IF_EXISTS = "GET_SOCIAL_LEADERBOARD_IF_EXISTS";
        bc2.socialLeaderboard.OPERATION_GET_SOCIAL_LEADERBOARD_BY_VERSION = "GET_SOCIAL_LEADERBOARD_BY_VERSION";
        bc2.socialLeaderboard.OPERATION_GET_SOCIAL_LEADERBOARD_BY_VERSION_IF_EXISTS = "GET_SOCIAL_LEADERBOARD_BY_VERSION_IF_EXISTS";
        bc2.socialLeaderboard.OPERATION_GET_MULTI_SOCIAL_LEADERBOARD = "GET_MULTI_SOCIAL_LEADERBOARD";
        bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_PAGE = "GET_GLOBAL_LEADERBOARD_PAGE";
        bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_PAGE_IF_EXISTS = "GET_GLOBAL_LEADERBOARD_PAGE_IF_EXISTS";
        bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_VIEW = "GET_GLOBAL_LEADERBOARD_VIEW";
        bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_VIEW_IF_EXISTS = "GET_GLOBAL_LEADERBOARD_VIEW_IF_EXISTS";
        bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_VERSIONS = "GET_GLOBAL_LEADERBOARD_VERSIONS";
        bc2.socialLeaderboard.OPERATION_GET_GROUP_SOCIAL_LEADERBOARD = "GET_GROUP_SOCIAL_LEADERBOARD";
        bc2.socialLeaderboard.OPERATION_GET_GROUP_SOCIAL_LEADERBOARD_BY_VERSION = "GET_GROUP_SOCIAL_LEADERBOARD_BY_VERSION";
        bc2.socialLeaderboard.OPERATION_GET_PLAYERS_SOCIAL_LEADERBOARD = "GET_PLAYERS_SOCIAL_LEADERBOARD";
        bc2.socialLeaderboard.OPERATION_GET_PLAYERS_SOCIAL_LEADERBOARD_IF_EXISTS = "GET_PLAYERS_SOCIAL_LEADERBOARD_IF_EXISTS";
        bc2.socialLeaderboard.OPERATION_GET_PLAYERS_SOCIAL_LEADERBOARD_BY_VERSION = "GET_PLAYERS_SOCIAL_LEADERBOARD_BY_VERSION";
        bc2.socialLeaderboard.OPERATION_GET_PLAYERS_SOCIAL_LEADERBOARD_BY_VERSION_IF_EXISTS = "GET_PLAYERS_SOCIAL_LEADERBOARD_BY_VERSION_IF_EXISTS";
        bc2.socialLeaderboard.OPERATION_LIST_ALL_LEADERBOARDS = "LIST_ALL_LEADERBOARDS";
        bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_ENTRY_COUNT = "GET_GLOBAL_LEADERBOARD_ENTRY_COUNT";
        bc2.socialLeaderboard.OPERATION_REMOVE_PLAYER_SCORE = "REMOVE_PLAYER_SCORE";
        bc2.socialLeaderboard.OPERATION_GET_PLAYER_SCORE = "GET_PLAYER_SCORE";
        bc2.socialLeaderboard.OPERATION_GET_PLAYER_SCORES = "GET_PLAYER_SCORES";
        bc2.socialLeaderboard.OPERATION_GET_PLAYER_SCORES_FROM_LEADERBOARDS = "GET_PLAYER_SCORES_FROM_LEADERBOARDS";
        bc2.socialLeaderboard.OPERATION_POST_GROUP_SCORE = "POST_GROUP_SCORE";
        bc2.socialLeaderboard.OPERATION_REMOVE_GROUP_SCORE = "REMOVE_GROUP_SCORE";
        bc2.socialLeaderboard.OPERATION_GET_GROUP_LEADERBOARD_VIEW = "GET_GROUP_LEADERBOARD_VIEW";
        bc2.socialLeaderboard.OPERATION_GET_GROUP_LEADERBOARD_VIEW_BY_VERSION = "GET_GROUP_LEADERBOARD_VIEW_BY_VERSION";
        bc2.socialLeaderboard.OPERATION_POST_SCORE_TO_DYNAMIC_GROUP_LEADERBOARD = "POST_GROUP_SCORE_DYNAMIC";
        bc2.socialLeaderboard.OPERATION_POST_SCORE_TO_DYNAMIC_GROUP_LEADERBOARD_USING_CONFIG = "POST_GROUP_SCORE_DYNAMIC_USING_CONFIG";
        bc2.socialLeaderboard.leaderboardType = Object.freeze({
          HIGH_VALUE: "HIGH_VALUE",
          CUMULATIVE: "CUMULATIVE",
          LAST_VALUE: "LAST_VALUE",
          LOW_VALUE: "LOW_VALUE"
        });
        bc2.socialLeaderboard.rotationType = Object.freeze({
          NEVER: "NEVER",
          DAILY: "DAILY",
          WEEKLY: "WEEKLY",
          MONTHLY: "MONTHLY",
          YEARLY: "YEARLY"
        });
        bc2.socialLeaderboard.fetchType = Object.freeze({
          HIGHEST_RANKED: "HIGHEST_RANKED"
        });
        bc2.socialLeaderboard.sortOrder = Object.freeze({
          HIGH_TO_LOW: "HIGH_TO_LOW",
          LOW_TO_HIGH: "LOW_TO_HIGH"
        });
        bc2.socialLeaderboard.getGlobalLeaderboardPage = function(leaderboardId, sortOrder, startIndex, endIndex, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_PAGE,
            data: {
              leaderboardId,
              sort: sortOrder,
              startIndex,
              endIndex
            },
            callback
          });
        };
        bc2.socialLeaderboard.getGlobalLeaderboardPageIfExists = function(leaderboardId, sortOrder, startIndex, endIndex, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_PAGE_IF_EXISTS,
            data: {
              leaderboardId,
              sort: sortOrder,
              startIndex,
              endIndex
            },
            callback
          });
        };
        bc2.socialLeaderboard.getGlobalLeaderboardPageByVersion = function(leaderboardId, sortOrder, startIndex, endIndex, versionId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_PAGE,
            data: {
              leaderboardId,
              sort: sortOrder,
              startIndex,
              endIndex,
              versionId
            },
            callback
          });
        };
        bc2.socialLeaderboard.getGlobalLeaderboardPageByVersionIfExists = function(leaderboardId, sortOrder, startIndex, endIndex, versionId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_PAGE_IF_EXISTS,
            data: {
              leaderboardId,
              sort: sortOrder,
              startIndex,
              endIndex,
              versionId
            },
            callback
          });
        };
        bc2.socialLeaderboard.getGlobalLeaderboardView = function(leaderboardId, sortOrder, beforeCount, afterCount, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_VIEW,
            data: {
              leaderboardId,
              sort: sortOrder,
              beforeCount,
              afterCount
            },
            callback
          });
        };
        bc2.socialLeaderboard.getGlobalLeaderboardViewIfExists = function(leaderboardId, sortOrder, beforeCount, afterCount, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_VIEW_IF_EXISTS,
            data: {
              leaderboardId,
              sort: sortOrder,
              beforeCount,
              afterCount
            },
            callback
          });
        };
        bc2.socialLeaderboard.getGlobalLeaderboardViewByVersion = function(leaderboardId, sortOrder, beforeCount, afterCount, versionId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_VIEW,
            data: {
              leaderboardId,
              sort: sortOrder,
              beforeCount,
              afterCount,
              versionId
            },
            callback
          });
        };
        bc2.socialLeaderboard.getGlobalLeaderboardViewByVersionIfExists = function(leaderboardId, sortOrder, beforeCount, afterCount, versionId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_VIEW_IF_EXISTS,
            data: {
              leaderboardId,
              sort: sortOrder,
              beforeCount,
              afterCount,
              versionId
            },
            callback
          });
        };
        bc2.socialLeaderboard.getGlobalLeaderboardEntryCount = function(leaderboardId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_ENTRY_COUNT,
            data: {
              leaderboardId
            },
            callback
          });
        };
        bc2.socialLeaderboard.getGlobalLeaderboardEntryCountByVersion = function(leaderboardId, versionId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_ENTRY_COUNT,
            data: {
              leaderboardId,
              versionId
            },
            callback
          });
        };
        bc2.socialLeaderboard.getSocialLeaderboard = function(leaderboardId, replaceName, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_SOCIAL_LEADERBOARD,
            data: {
              leaderboardId,
              replaceName
            },
            callback
          });
        };
        bc2.socialLeaderboard.getSocialLeaderboardIfExists = function(leaderboardId, replaceName, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_SOCIAL_LEADERBOARD_IF_EXISTS,
            data: {
              leaderboardId,
              replaceName
            },
            callback
          });
        };
        bc2.socialLeaderboard.getSocialLeaderboardByVersion = function(leaderboardId, replaceName, versionId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_SOCIAL_LEADERBOARD_BY_VERSION,
            data: {
              leaderboardId,
              replaceName,
              versionId
            },
            callback
          });
        };
        bc2.socialLeaderboard.getSocialLeaderboardByVersionIfExists = function(leaderboardId, replaceName, versionId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_SOCIAL_LEADERBOARD_BY_VERSION_IF_EXISTS,
            data: {
              leaderboardId,
              replaceName,
              versionId
            },
            callback
          });
        };
        bc2.socialLeaderboard.getMultiSocialLeaderboard = function(leaderboardIds, leaderboardResultCount, replaceName, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_MULTI_SOCIAL_LEADERBOARD,
            data: {
              leaderboardIds,
              leaderboardResultCount,
              replaceName
            },
            callback
          });
        };
        bc2.socialLeaderboard.getGlobalLeaderboardVersions = function(leaderboardId, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GLOBAL_LEADERBOARD_VERSIONS,
            data: {
              leaderboardId
            },
            callback
          });
        };
        bc2.socialLeaderboard.postScoreToLeaderboard = function(leaderboardId, score, otherData, callback) {
          var message = {
            leaderboardId,
            score
          };
          if (otherData) {
            message["data"] = otherData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_POST_SCORE,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.postScoreToDynamicLeaderboardUTC = function(leaderboardName, score, data, leaderboardType, rotationType, rotationReset, retainedCount, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_POST_SCORE_DYNAMIC,
            data: {
              leaderboardId: leaderboardName,
              score,
              data,
              leaderboardType,
              rotationType,
              rotationResetTime: rotationReset.getTime().toFixed(0),
              retainedCount
            },
            callback
          });
        };
        bc2.socialLeaderboard.postScoreToDynamicLeaderboardUsingConfig = function(leaderboardId, score, scoreData, configJson, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_POST_SCORE_DYNAMIC_USING_CONFIG,
            data: {
              leaderboardId,
              score,
              scoreData,
              configJson
            },
            callback
          });
        };
        bc2.socialLeaderboard.postScoreToDynamicLeaderboardDaysUTC = function(leaderboardName, score, data, leaderboardType, rotationReset, retainedCount, numDaysToRotate, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_POST_SCORE_DYNAMIC,
            data: {
              leaderboardId: leaderboardName,
              score,
              data,
              leaderboardType,
              rotationType: "DAYS",
              rotationResetTime: rotationReset.getTime().toFixed(0),
              retainedCount,
              numDaysToRotate
            },
            callback
          });
        };
        bc2.socialLeaderboard.postScoreToDynamicGroupLeaderboardDaysUTC = function(leaderboardId, groupId, score, data, leaderboardType, rotationReset, retainedCount, numDaysToRotate, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_POST_SCORE_TO_DYNAMIC_GROUP_LEADERBOARD,
            data: {
              leaderboardId,
              groupId,
              score,
              data,
              leaderboardType,
              rotationType: "DAYS",
              rotationResetTime: rotationReset.getTime().toFixed(0),
              retainedCount,
              numDaysToRotate
            },
            callback
          });
        };
        bc2.socialLeaderboard.postScoreToDynamicGroupLeaderboardUsingConfig = function(leaderboardId, groupId, score, scoreData, configJson, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_POST_SCORE_TO_DYNAMIC_GROUP_LEADERBOARD_USING_CONFIG,
            data: {
              leaderboardId,
              groupId,
              score,
              scoreData,
              configJson
            },
            callback
          });
        };
        bc2.socialLeaderboard.getGroupSocialLeaderboard = function(leaderboardId, groupId, callback) {
          var message = {
            leaderboardId,
            groupId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GROUP_SOCIAL_LEADERBOARD,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.getGroupSocialLeaderboardByVersion = function(leaderboardId, groupId, versionId, callback) {
          var message = {
            leaderboardId,
            groupId,
            versionId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GROUP_SOCIAL_LEADERBOARD_BY_VERSION,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.getPlayersSocialLeaderboard = function(leaderboardId, profileIds, callback) {
          var message = {
            leaderboardId,
            profileIds
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_PLAYERS_SOCIAL_LEADERBOARD,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.getPlayersSocialLeaderboardIfExists = function(leaderboardId, profileIds, callback) {
          var message = {
            leaderboardId,
            profileIds
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_PLAYERS_SOCIAL_LEADERBOARD_IF_EXISTS,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.getPlayersSocialLeaderboardByVersion = function(leaderboardId, profileIds, versionId, callback) {
          var message = {
            leaderboardId,
            profileIds,
            versionId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_PLAYERS_SOCIAL_LEADERBOARD_BY_VERSION,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.getPlayersSocialLeaderboardByVersionIfExists = function(leaderboardId, profileIds, versionId, callback) {
          var message = {
            leaderboardId,
            profileIds,
            versionId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_PLAYERS_SOCIAL_LEADERBOARD_BY_VERSION_IF_EXISTS,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.listAllLeaderboards = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_LIST_ALL_LEADERBOARDS,
            data: null,
            callback
          });
        };
        bc2.socialLeaderboard.removePlayerScore = function(leaderboardId, versionId, callback) {
          var message = {
            leaderboardId,
            versionId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_REMOVE_PLAYER_SCORE,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.getPlayerScore = function(leaderboardId, versionId, callback) {
          var message = {
            leaderboardId,
            versionId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_PLAYER_SCORE,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.getPlayerScores = function(leaderboardId, versionId, maxResults, callback) {
          var message = {
            leaderboardId,
            versionId,
            maxResults
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_PLAYER_SCORES,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.getPlayerScoresFromLeaderboards = function(leaderboardIds, callback) {
          var message = {
            leaderboardIds
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_PLAYER_SCORES_FROM_LEADERBOARDS,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.postScoreToGroupLeaderboard = function(leaderboardId, groupId, score, otherData, callback) {
          var message = {
            leaderboardId,
            groupId,
            score
          };
          if (otherData) {
            message["data"] = otherData;
          }
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_POST_GROUP_SCORE,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.removeGroupScore = function(leaderboardId, groupId, versionId, callback) {
          var message = {
            leaderboardId,
            groupId,
            versionId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_REMOVE_GROUP_SCORE,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.getGroupLeaderboardView = function(leaderboardId, groupId, sort, beforeCount, afterCount, callback) {
          var message = {
            leaderboardId,
            groupId,
            sort,
            beforeCount,
            afterCount
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GROUP_LEADERBOARD_VIEW,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.getGroupLeaderboardViewByVersion = function(leaderboardId, groupId, versionId, sort, beforeCount, afterCount, callback) {
          var message = {
            leaderboardId,
            groupId,
            versionId,
            sort,
            beforeCount,
            afterCount
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_GET_GROUP_LEADERBOARD_VIEW,
            data: message,
            callback
          });
        };
        bc2.socialLeaderboard.postScoreToDynamicGroupLeaderboardUTC = function(leaderboardId, groupId, score, data, leaderboardType, rotationType, rotationResetTime, retainedCount, callback) {
          var message = {
            leaderboardId,
            groupId,
            score,
            data,
            leaderboardType,
            rotationType,
            rotationResetTime,
            retainedCount
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_LEADERBOARD,
            operation: bc2.socialLeaderboard.OPERATION_POST_SCORE_TO_DYNAMIC_GROUP_LEADERBOARD,
            data: message,
            callback
          });
        };
      }
      BCSocialLeaderboard.apply(
        window.brainCloudClient = window.brainCloudClient || {}
      );
      function BCStatusCodes() {
        var bc2 = this;
        bc2.statusCodes = {};
        bc2.statusCodes.OK = 200;
        bc2.statusCodes.BAD_REQUEST = 400;
        bc2.statusCodes.FORBIDDEN = 403;
        bc2.statusCodes.INTERNAL_SERVER_ERROR = 500;
        bc2.statusCodes.CLIENT_NETWORK_ERROR = 900;
      }
      BCStatusCodes.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCTimeUtils() {
        var bc2 = this;
        bc2.timeUtils = {};
        bc2.timeUtils.UTCDateTimeToUTCMillis = function(utcDate) {
          return utcDate.getTime();
        };
        bc2.timeUtils.UTCMillisToUTCDateTime = function(utcMillis) {
          return new Date(utcMillis);
        };
      }
      BCTimeUtils.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCTime() {
        var bc2 = this;
        bc2.time = {};
        bc2.SERVICE_TIME = "time";
        bc2.time.OPERATION_READ = "READ";
        bc2.time.readServerTime = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TIME,
            operation: bc2.time.OPERATION_READ,
            data: {},
            callback
          });
        };
      }
      BCTime.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCTournament() {
        var bc2 = this;
        bc2.tournament = {};
        bc2.SERVICE_TOURNAMENT = "tournament";
        bc2.tournament.OPERATION_CLAIM_TOURNAMENT_REWARD = "CLAIM_TOURNAMENT_REWARD";
        bc2.tournament.OPERATION_GET_DIVISION_INFO = "GET_DIVISION_INFO";
        bc2.tournament.OPERATION_GET_GROUP_DIVISION_INFO = "GET_GROUP_DIVISION_INFO";
        bc2.tournament.OPERATION_GET_GROUP_DIVISIONS = "GET_GROUP_DIVISIONS";
        bc2.tournament.OPERATION_GET_GROUP_TOURNAMENT_STATUS = "GET_GROUP_TOURNAMENT_STATUS";
        bc2.tournament.OPERATION_GET_MY_DIVISIONS = "GET_MY_DIVISIONS";
        bc2.tournament.OPERATION_GET_TOURNAMENT_STATUS = "GET_TOURNAMENT_STATUS";
        bc2.tournament.OPERATION_JOIN_DIVISION = "JOIN_DIVISION";
        bc2.tournament.OPERATION_JOIN_GROUP_DIVISION = "JOIN_GROUP_DIVISION";
        bc2.tournament.OPERATION_JOIN_GROUP_TOURNAMENT = "JOIN_GROUP_TOURNAMENT";
        bc2.tournament.OPERATION_JOIN_TOURNAMENT = "JOIN_TOURNAMENT";
        bc2.tournament.OPERATION_LEAVE_DIVISION_INSTANCE = "LEAVE_DIVISION_INSTANCE";
        bc2.tournament.OPERATION_LEAVE_GROUP_DIVISION_INSTANCE = "LEAVE_GROUP_DIVISION_INSTANCE";
        bc2.tournament.OPERATION_LEAVE_GROUP_TOURNAMENT = "LEAVE_GROUP_TOURNAMENT";
        bc2.tournament.OPERATION_POST_GROUP_TOURNAMENT_SCORE = "POST_GROUP_TOURNAMENT_SCORE";
        bc2.tournament.OPERATION_POST_GROUP_TOURNAMENT_SCORE_WITH_RESULTS = "POST_GROUP_TOURNAMENT_SCORE_WITH_RESULTS";
        bc2.tournament.OPERATION_LEAVE_TOURNAMENT = "LEAVE_TOURNAMENT";
        bc2.tournament.OPERATION_POST_TOURNAMENT_SCORE = "POST_TOURNAMENT_SCORE";
        bc2.tournament.OPERATION_POST_TOURNAMENT_SCORE_WITH_RESULTS = "POST_TOURNAMENT_SCORE_WITH_RESULTS";
        bc2.tournament.OPERATION_VIEW_CURRENT_REWARD = "VIEW_CURRENT_REWARD";
        bc2.tournament.OPERATION_VIEW_REWARD = "VIEW_REWARD";
        bc2.tournament.claimTournamentReward = function(leaderboardId, versionId, callback) {
          var message = {
            leaderboardId,
            versionId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_CLAIM_TOURNAMENT_REWARD,
            data: message,
            callback
          });
        };
        bc2.tournament.getDivisionInfo = function(divSetId, callback) {
          var message = {
            divSetId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_GET_DIVISION_INFO,
            data: message,
            callback
          });
        };
        bc2.tournament.getGroupDivisionInfo = function(divSetId, groupId, callback) {
          var message = {
            divSetId,
            groupId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_GET_GROUP_DIVISION_INFO,
            data: message,
            callback
          });
        };
        bc2.tournament.getGroupDivisions = function(groupId, callback) {
          var message = {
            groupId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_GET_GROUP_DIVISIONS,
            data: message,
            callback
          });
        };
        bc2.tournament.getGroupTournamentStatus = function(leaderboardId, groupId, versionId, callback) {
          var message = {
            leaderboardId,
            groupId,
            versionId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_GET_GROUP_TOURNAMENT_STATUS,
            data: message,
            callback
          });
        };
        bc2.tournament.getMyDivisions = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_GET_MY_DIVISIONS,
            data: null,
            callback
          });
        };
        bc2.tournament.getTournamentStatus = function(leaderboardId, versionId, callback) {
          var message = {
            leaderboardId,
            versionId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_GET_TOURNAMENT_STATUS,
            data: message,
            callback
          });
        };
        bc2.tournament.joinDivision = function(divSetId, tournamentCode, initialScore, callback) {
          var message = {
            divSetId,
            tournamentCode,
            initialScore
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_JOIN_DIVISION,
            data: message,
            callback
          });
        };
        bc2.tournament.joinGroupDivision = function(divSetId, tournamentCode, groupId, initialScore, callback) {
          var message = {
            divSetId,
            tournamentCode,
            groupId,
            initialScore
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_JOIN_GROUP_DIVISION,
            data: message,
            callback
          });
        };
        bc2.tournament.joinGroupTournament = function(leaderboardId, tournamentCode, groupId, initialScore, callback) {
          var message = {
            leaderboardId,
            tournamentCode,
            groupId,
            initialScore
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_JOIN_GROUP_TOURNAMENT,
            data: message,
            callback
          });
        };
        bc2.tournament.joinTournament = function(leaderboardId, tournamentCode, initialScore, callback) {
          var message = {
            leaderboardId,
            tournamentCode,
            initialScore
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_JOIN_TOURNAMENT,
            data: message,
            callback
          });
        };
        bc2.tournament.leaveDivisionInstance = function(leaderboardId, callback) {
          var message = {
            leaderboardId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_LEAVE_DIVISION_INSTANCE,
            data: message,
            callback
          });
        };
        bc2.tournament.leaveGroupDivisionInstance = function(leaderboardId, groupId, callback) {
          var message = {
            leaderboardId,
            groupId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_LEAVE_GROUP_DIVISION_INSTANCE,
            data: message,
            callback
          });
        };
        bc2.tournament.leaveGroupTournament = function(leaderboardId, groupId, callback) {
          var message = {
            leaderboardId,
            groupId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_LEAVE_GROUP_TOURNAMENT,
            data: message,
            callback
          });
        };
        bc2.tournament.leaveTournament = function(leaderboardId, callback) {
          var message = {
            leaderboardId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_LEAVE_TOURNAMENT,
            data: message,
            callback
          });
        };
        bc2.tournament.postGroupTournamentScore = function(leaderboardId, groupId, score, data, roundStartedEpoch, callback) {
          var message = {
            leaderboardId,
            groupId,
            score,
            roundStartedEpoch
          };
          if (data) message.data = data;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_POST_GROUP_TOURNAMENT_SCORE,
            data: message,
            callback
          });
        };
        bc2.tournament.postGroupTournamentScoreWithResults = function(leaderboardId, groupId, score, data, roundStartedEpoch, sort, beforeCount, afterCount, initialScore, callback) {
          var message = {
            leaderboardId,
            groupId,
            score,
            roundStartedEpoch,
            sort,
            beforeCount,
            afterCount,
            initialScore
          };
          if (data) message.data = data;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_POST_GROUP_TOURNAMENT_SCORE_WITH_RESULTS,
            data: message,
            callback
          });
        };
        bc2.tournament.postTournamentScoreUTC = function(leaderboardId, score, data, roundStartedTime, callback) {
          var message = {
            leaderboardId,
            score,
            roundStartedEpoch: roundStartedTime.getTime()
          };
          if (data) message.data = data;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_POST_TOURNAMENT_SCORE,
            data: message,
            callback
          });
        };
        bc2.tournament.postTournamentScoreWithResultsUTC = function(leaderboardId, score, data, roundStartedTime, sort, beforeCount, afterCount, initialScore, callback) {
          var message = {
            leaderboardId,
            score,
            roundStartedEpoch: roundStartedTime.getTime(),
            sort,
            beforeCount,
            afterCount,
            initialScore
          };
          if (data) message.data = data;
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_POST_TOURNAMENT_SCORE_WITH_RESULTS,
            data: message,
            callback
          });
        };
        bc2.tournament.viewCurrentReward = function(leaderboardId, callback) {
          var message = {
            leaderboardId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_VIEW_CURRENT_REWARD,
            data: message,
            callback
          });
        };
        bc2.tournament.viewReward = function(leaderboardId, versionId, callback) {
          var message = {
            leaderboardId,
            versionId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_TOURNAMENT,
            operation: bc2.tournament.OPERATION_VIEW_REWARD,
            data: message,
            callback
          });
        };
      }
      BCTournament.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCUserItems() {
        var bc2 = this;
        bc2.userItems = {};
        bc2.SERVICE_USER_ITEMS = "userItems";
        bc2.userItems.OPERATION_AWARD_USER_ITEM = "AWARD_USER_ITEM";
        bc2.userItems.OPERATION_DROP_USER_ITEM = "DROP_USER_ITEM";
        bc2.userItems.OPERATION_GET_ITEM_PROMOTION_DETAILS = "GET_ITEM_PROMOTION_DETAILS";
        bc2.userItems.OPERATION_GET_ITEMS_ON_PROMOTION = "GET_ITEMS_ON_PROMOTION";
        bc2.userItems.OPERATION_GET_USER_INVENTORY_PAGE = "GET_USER_ITEMS_PAGE";
        bc2.userItems.OPERATION_GET_USER_INVENTORY_PAGE_OFFSET = "GET_USER_ITEMS_PAGE_OFFSET";
        bc2.userItems.OPERATION_GET_USER_ITEM = "GET_USER_ITEM";
        bc2.userItems.OPERATION_GIVE_USER_ITEM_TO = "GIVE_USER_ITEM_TO";
        bc2.userItems.OPERATION_OPEN_BUNDLE = "OPEN_BUNDLE";
        bc2.userItems.OPERATION_PUBLISH_USER_ITEM_TO_BLOCKCHAIN = "PUBLISH_USER_ITEM_TO_BLOCKCHAIN";
        bc2.userItems.OPERATION_PURCHASE_USER_ITEM = "PURCHASE_USER_ITEM";
        bc2.userItems.OPERATION_RECEIVE_USER_ITEM_FROM = "RECEIVE_USER_ITEM_FROM";
        bc2.userItems.OPERATION_REFRESH_BLOCKCHAIN_USER_ITEMS = "REFRESH_BLOCKCHAIN_USER_ITEMS";
        bc2.userItems.OPERATION_REMOVE_USER_ITEM_FROM_BLOCKCHAIN = "REMOVE_USER_ITEM_FROM_BLOCKCHAIN";
        bc2.userItems.OPERATION_SELL_USER_ITEM = "SELL_USER_ITEM";
        bc2.userItems.OPERATION_UPDATE_USER_ITEM_DATA = "UPDATE_USER_ITEM_DATA";
        bc2.userItems.OPERATION_USE_USER_ITEM = "USE_USER_ITEM";
        bc2.userItems.awardUserItem = function(defId, quantity, includeDef, callback) {
          var message = {
            defId,
            quantity,
            includeDef
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_AWARD_USER_ITEM,
            data: message,
            callback
          });
        };
        bc2.userItems.awardUserItemWithOptions = function(defId, quantity, includeDef, optionsJson, callback) {
          var message = {
            defId,
            quantity,
            includeDef,
            optionsJson
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_AWARD_USER_ITEM,
            data: message,
            callback
          });
        };
        bc2.userItems.dropUserItem = function(itemId, quantity, includeDef, callback) {
          var message = {
            itemId,
            quantity,
            includeDef
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_DROP_USER_ITEM,
            data: message,
            callback
          });
        };
        bc2.userItems.getItemsOnPromotion = function(shopId, includeDef, includePromotionDetails, optionsJson, callback) {
          var message = {
            shopId,
            includeDef,
            includePromotionDetails,
            optionsJson
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_GET_ITEMS_ON_PROMOTION,
            data: message,
            callback
          });
        };
        bc2.userItems.getItemPromotionDetails = function(defId, shopId, includeDef, includePromotionDetails, callback) {
          var message = {
            defId,
            shopId,
            includeDef,
            includePromotionDetails
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_GET_ITEM_PROMOTION_DETAILS,
            data: message,
            callback
          });
        };
        bc2.userItems.getUserItemsPage = function(context, includeDef, callback) {
          var message = {
            context,
            includeDef
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_GET_USER_INVENTORY_PAGE,
            data: message,
            callback
          });
        };
        bc2.userItems.getUserItemsPageOffset = function(context, pageOffset, includeDef, callback) {
          var message = {
            context,
            pageOffset,
            includeDef
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_GET_USER_INVENTORY_PAGE_OFFSET,
            data: message,
            callback
          });
        };
        bc2.userItems.getUserItem = function(itemId, includeDef, callback) {
          var message = {
            itemId,
            includeDef
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_GET_USER_ITEM,
            data: message,
            callback
          });
        };
        bc2.userItems.giveUserItemTo = function(profileId, itemId, version, quantity, immediate, callback) {
          var message = {
            profileId,
            itemId,
            version,
            quantity,
            immediate
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_GIVE_USER_ITEM_TO,
            data: message,
            callback
          });
        };
        bc2.userItems.openBundle = function(itemId, version, quantity, includeDef, optionsJson, callback) {
          var message = {
            itemId,
            version,
            quantity,
            includeDef,
            optionsJson
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_OPEN_BUNDLE,
            data: message,
            callback
          });
        };
        bc2.userItems.purchaseUserItem = function(defId, quantity, shopId, includeDef, callback) {
          var message = {
            defId,
            quantity,
            shopId,
            includeDef
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_PURCHASE_USER_ITEM,
            data: message,
            callback
          });
        };
        bc2.userItems.purchaseUserItemWithOptions = function(defId, quantity, shopId, includeDef, optionsJson, callback) {
          var message = {
            defId,
            quantity,
            shopId,
            includeDef,
            optionsJson
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_PURCHASE_USER_ITEM,
            data: message,
            callback
          });
        };
        bc2.userItems.receiveUserItemFrom = function(profileId, itemId, callback) {
          var message = {
            profileId,
            itemId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_RECEIVE_USER_ITEM_FROM,
            data: message,
            callback
          });
        };
        bc2.userItems.sellUserItem = function(itemId, version, quantity, shopId, includeDef, callback) {
          var message = {
            itemId,
            version,
            quantity,
            shopId,
            includeDef
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_SELL_USER_ITEM,
            data: message,
            callback
          });
        };
        bc2.userItems.updateUserItemData = function(itemId, version, newItemData, callback) {
          var data = {
            itemId,
            version,
            newItemData
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_UPDATE_USER_ITEM_DATA,
            data,
            callback
          });
        };
        bc2.userItems.useUserItem = function(itemId, version, newItemData, includeDef, callback) {
          var data = {
            itemId,
            version,
            newItemData,
            includeDef
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_USE_USER_ITEM,
            data,
            callback
          });
        };
        bc2.userItems.publishUserItemToBlockchain = function(itemId, version, callback) {
          var data = {
            itemId,
            version
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_PUBLISH_USER_ITEM_TO_BLOCKCHAIN,
            data,
            callback
          });
        };
        bc2.userItems.refreshBlockchainUserItems = function(callback) {
          var data = {};
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_REFRESH_BLOCKCHAIN_USER_ITEMS,
            data,
            callback
          });
        };
        bc2.userItems.removeUserItemFromBlockchain = function(itemId, version, callback) {
          var data = {
            itemId,
            version
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_USER_ITEMS,
            operation: bc2.userItems.OPERATION_REMOVE_USER_ITEM_FROM_BLOCKCHAIN,
            data,
            callback
          });
        };
      }
      BCUserItems.apply(window.brainCloudClient = window.brainCloudClient || {});
      function BCVirtualCurrency() {
        var bc2 = this;
        bc2.virtualCurrency = {};
        bc2.SERVICE_VIRTUAL_CURRENCY = "virtualCurrency";
        bc2.virtualCurrency.OPERATION_GET_CURRENCY = "GET_PLAYER_VC";
        bc2.virtualCurrency.OPERATION_GET_PARENT_CURRENCY = "GET_PARENT_VC";
        bc2.virtualCurrency.OPERATION_GET_PEER_CURRENCY = "GET_PEER_VC";
        bc2.virtualCurrency.OPERATION_RESET_PLAYER_VC = "RESET_PLAYER_VC";
        bc2.virtualCurrency.OPERATION_AWARD_VC = "AWARD_VC";
        bc2.virtualCurrency.OPERATION_CONSUME_PLAYER_VC = "CONSUME_VC";
        bc2.virtualCurrency.getCurrency = function(vcId, callback) {
          var message = {
            vcId
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_VIRTUAL_CURRENCY,
            operation: bc2.virtualCurrency.OPERATION_GET_CURRENCY,
            data: message,
            callback
          });
        };
        bc2.virtualCurrency.getParentCurrency = function(vcId, levelName, callback) {
          var message = {
            vcId,
            levelName
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_VIRTUAL_CURRENCY,
            operation: bc2.virtualCurrency.OPERATION_GET_PARENT_CURRENCY,
            data: message,
            callback
          });
        };
        bc2.virtualCurrency.getPeerCurrency = function(vcId, peerCode, callback) {
          var message = {
            vcId,
            peerCode
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_VIRTUAL_CURRENCY,
            operation: bc2.virtualCurrency.OPERATION_GET_PEER_CURRENCY,
            data: message,
            callback
          });
        };
        bc2.virtualCurrency.awardCurrency = function(vcId, vcAmount, callback) {
          var message = {
            vcId,
            vcAmount
          };
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_VIRTUAL_CURRENCY,
            operation: bc2.virtualCurrency.OPERATION_AWARD_VC,
            data: message,
            callback
          });
        };
        bc2.virtualCurrency.consumeCurrency = function(vcId, vcAmount, callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_VIRTUAL_CURRENCY,
            operation: bc2.virtualCurrency.OPERATION_CONSUME_PLAYER_VC,
            data: {
              vcId,
              vcAmount
            },
            callback
          });
        };
        bc2.virtualCurrency.resetCurrency = function(callback) {
          bc2.brainCloudManager.sendRequest({
            service: bc2.SERVICE_VIRTUAL_CURRENCY,
            operation: bc2.virtualCurrency.OPERATION_RESET_PLAYER_VC,
            callback
          });
        };
      }
      BCVirtualCurrency.apply(
        window.brainCloudClient = window.brainCloudClient || {}
      );
      function BrainCloudClient() {
        var bcc = this;
        bcc.name = "BrainCloudClient";
        bcc.appVersion = "1.0";
        if (window.brainCloudClient !== bcc) {
          BCAbTest.apply(bcc);
          BCAsyncMatch.apply(bcc);
          BCAuthentication.apply(bcc);
          BCChat.apply(bcc);
          BCDataStream.apply(bcc);
          BCEntity.apply(bcc);
          BCEvents.apply(bcc);
          BCFile.apply(bcc);
          BCFriend.apply(bcc);
          BCGamification.apply(bcc);
          BCGlobalApp.apply(bcc);
          BCGlobalStatistics.apply(bcc);
          BCGlobalEntity.apply(bcc);
          BCGroupFile.apply(bcc);
          BCGroup.apply(bcc);
          BCIdentity.apply(bcc);
          BCItemCatalog.apply(bcc);
          BCUserItems.apply(bcc);
          BCLobby.apply(bcc);
          BCMail.apply(bcc);
          BCMatchMaking.apply(bcc);
          BCMessaging.apply(bcc);
          BCOneWayMatch.apply(bcc);
          BCPlaybackStream.apply(bcc);
          BCPlayerState.apply(bcc);
          BCPlayerStatistics.apply(bcc);
          BCPlayerStatisticsEvent.apply(bcc);
          BCPresence.apply(bcc);
          BCVirtualCurrency.apply(bcc);
          BCAppStore.apply(bcc);
          BCProfanity.apply(bcc);
          BCPushNotifications.apply(bcc);
          BCReasonCodes.apply(bcc);
          BCRedemptionCodes.apply(bcc);
          BCRelay.apply(bcc);
          BCRTT.apply(bcc);
          BCS3Handler.apply(bcc);
          BCScript.apply(bcc);
          BCSocialLeaderboard.apply(bcc);
          BCStatusCodes.apply(bcc);
          BCTime.apply(bcc);
          BCTournament.apply(bcc);
          BCGlobalFile.apply(bcc);
          BCCustomEntity.apply(bcc);
          BCBlockchain.apply(bcc);
          BCCampaign.apply(bcc);
          BCTimeUtils.apply(bcc);
          bcc.brainCloudManager = new BrainCloudManager();
          bcc.brainCloudRttComms = new BrainCloudRttComms(this);
          bcc.brainCloudRelayComms = new BrainCloudRelayComms(this);
          bcc.brainCloudManager.abtests = bcc.abtests;
          bcc.brainCloudManager.asyncMatch = bcc.asyncMatch;
          bcc.brainCloudManager.authentication = bcc.authentication;
          bcc.brainCloudManager.chat = bcc.chat;
          bcc.brainCloudManager.dataStream = bcc.dataStream;
          bcc.brainCloudManager.entity = bcc.entity;
          bcc.brainCloudManager.event = bcc.event;
          bcc.brainCloudManager.file = bcc.file;
          bcc.brainCloudManager.friend = bcc.friend;
          bcc.brainCloudManager.gamification = bcc.gamification;
          bcc.brainCloudManager.globalApp = bcc.globalApp;
          bcc.brainCloudManager.globalStatistics = bcc.globalStatistics;
          bcc.brainCloudManager.globalEntity = bcc.globalEntity;
          bcc.brainCloudManager.groupFile = bcc.groupFile;
          bcc.brainCloudManager.group = bcc.group;
          bcc.brainCloudManager.identity = bcc.identity;
          bcc.brainCloudManager.lobby = bcc.lobby;
          bcc.brainCloudManager.mail = bcc.mail;
          bcc.brainCloudManager.matchMaking = bcc.matchMaking;
          bcc.brainCloudManager.messaging = bcc.messaging;
          bcc.brainCloudManager.oneWayMatch = bcc.oneWayMatch;
          bcc.brainCloudManager.playbackStream = bcc.playbackStream;
          bcc.brainCloudManager.playerState = bcc.playerState;
          bcc.brainCloudManager.playerStatistics = bcc.playerStatistics;
          bcc.brainCloudManager.playerStatisticsEvent = bcc.playerStatisticsEvent;
          bcc.brainCloudManager.presence = bcc.precense;
          bcc.brainCloudManager.virtualCurrency = bcc.virtualCurrency;
          bcc.brainCloudManager.appStore = bcc.appStore;
          bcc.brainCloudManager.profanity = bcc.profanity;
          bcc.brainCloudManager.pushNotification = bcc.pushNotification;
          bcc.brainCloudManager.reasonCodes = bcc.reasonCodes;
          bcc.brainCloudManager.redemptionCode = bcc.redemptionCode;
          bcc.brainCloudManager.relay = bcc.relay;
          bcc.brainCloudManager.rttService = bcc.rttService;
          bcc.brainCloudManager.s3Handling = bcc.s3Handling;
          bcc.brainCloudManager.script = bcc.script;
          bcc.brainCloudManager.socialLeaderboard = bcc.socialLeaderboard;
          bcc.brainCloudManager.statusCodes = bcc.statusCodes;
          bcc.brainCloudManager.time = bcc.time;
          bcc.brainCloudManager.tournament = bcc.tournament;
          bcc.brainCloudManager.globalFile = bcc.globalFile;
          bcc.brainCloudManager.itemCatalog = bcc.itemCatalog;
          bcc.brainCloudManager.userItems = bcc.userItems;
          bcc.brainCloudManager.customEntity = bcc.customEntity;
          bcc.brainCloudManager.blockchain = bcc.blockchain;
          bcc.brainCloudManager.campaign = bcc.campaign;
          bcc.brainCloudManager.timeUtils = bcc.timeUtils;
          bcc.brainCloudRttComms.rtt = bcc.rtt;
          bcc.brainCloudRttComms.brainCloudClient = bcc;
          bcc.brainCloudRelayComms.brainCloudClient = bcc;
        } else {
          bcc.brainCloudManager = window.brainCloudManager = window.brainCloudManager || {};
          bcc.brainCloudRttComms = window.brainCloudRttComms = window.brainCloudRttComms || {};
          bcc.brainCloudRelayComms = window.brainCloudRelayComms = window.brainCloudRelayComms || {};
          bcc.brainCloudClient = window.brainCloudClient = window.brainCloudClient || {};
          bcc.brainCloudManager.abtests = bcc.brainCloudClient.abtests = bcc.brainCloudClient.abtests || {};
          bcc.brainCloudManager.asyncMatch = bcc.brainCloudClient.asyncMatch = bcc.brainCloudClient.asyncMatch || {};
          bcc.brainCloudManager.authentication = bcc.brainCloudClient.authentication = bcc.brainCloudClient.authentication || {};
          bcc.brainCloudManager.chat = bcc.brainCloudClient.chat = bcc.brainCloudClient.chat || {};
          bcc.brainCloudManager.dataStream = bcc.brainCloudClient.dataStream = bcc.brainCloudClient.dataStream || {};
          bcc.brainCloudManager.entity = bcc.brainCloudClient.entity = bcc.brainCloudClient.entity || {};
          bcc.brainCloudManager.event = bcc.brainCloudClient.event = bcc.brainCloudClient.event || {};
          bcc.brainCloudManager.file = bcc.brainCloudClient.file = bcc.brainCloudClient.file || {};
          bcc.brainCloudManager.friend = bcc.brainCloudClient.friend = bcc.brainCloudClient.friend || {};
          bcc.brainCloudManager.gamification = bcc.brainCloudClient.gamification = bcc.brainCloudClient.gamification || {};
          bcc.brainCloudManager.globalApp = bcc.brainCloudClient.globalApp = bcc.brainCloudClient.globalApp || {};
          bcc.brainCloudManager.globalStatistics = bcc.brainCloudClient.globalStatistics = bcc.brainCloudClient.globalStatistics || {};
          bcc.brainCloudManager.globalEntity = bcc.brainCloudClient.globalEntity = bcc.brainCloudClient.globalEntity || {};
          bcc.brainCloudManager.groupFile = bcc.brainCloudClient.groupFile = bcc.brainCloudClient.groupFile || {};
          bcc.brainCloudManager.group = bcc.brainCloudClient.group = bcc.brainCloudClient.group || {};
          bcc.brainCloudManager.identity = bcc.brainCloudClient.identity = bcc.brainCloudClient.identity || {};
          bcc.brainCloudManager.lobby = bcc.brainCloudClient.lobby = bcc.brainCloudClient.lobby || {};
          bcc.brainCloudManager.mail = bcc.brainCloudClient.mail = bcc.brainCloudClient.mail || {};
          bcc.brainCloudManager.matchMaking = bcc.brainCloudClient.matchMaking = bcc.brainCloudClient.matchMaking || {};
          bcc.brainCloudManager.messaging = bcc.brainCloudClient.messaging = bcc.brainCloudClient.messaging || {};
          bcc.brainCloudManager.oneWayMatch = bcc.brainCloudClient.oneWayMatch = bcc.brainCloudClient.oneWayMatch || {};
          bcc.brainCloudManager.playbackStream = bcc.brainCloudClient.playbackStream = bcc.brainCloudClient.playbackStream || {};
          bcc.brainCloudManager.playerState = bcc.brainCloudClient.playerState = bcc.brainCloudClient.playerState || {};
          bcc.brainCloudManager.playerStatistics = bcc.brainCloudClient.playerStatistics = bcc.brainCloudClient.playerStatistics || {};
          bcc.brainCloudManager.playerStatisticsEvent = bcc.brainCloudClient.playerStatisticsEvent = bcc.brainCloudClient.playerStatisticsEvent || {};
          bcc.brainCloudManager.presence = bcc.brainCloudClient.presence = bcc.brainCloudClient.presence || {};
          bcc.brainCloudManager.virtualCurrency = bcc.brainCloudClient.virtualCurrency = bcc.brainCloudClient.virtualCurrency || {};
          bcc.brainCloudManager.appStore = bcc.brainCloudClient.appStore = bcc.brainCloudClient.appStore || {};
          bcc.brainCloudManager.profanity = bcc.brainCloudClient.profanity = bcc.brainCloudClient.profanity || {};
          bcc.brainCloudManager.pushNotification = bcc.brainCloudClient.pushNotification = bcc.brainCloudClient.pushNotification || {};
          bcc.brainCloudManager.reasonCodes = bcc.brainCloudClient.reasonCodes = bcc.brainCloudClient.reasonCodes || {};
          bcc.brainCloudManager.redemptionCode = bcc.brainCloudClient.redemptionCode = bcc.brainCloudClient.redemptionCode || {};
          bcc.brainCloudManager.relay = bcc.brainCloudClient.relay = bcc.brainCloudClient.relay || {};
          bcc.brainCloudManager.rttService = bcc.brainCloudClient.rttService = bcc.brainCloudClient.rttService || {};
          bcc.brainCloudManager.s3Handling = bcc.brainCloudClient.s3Handling = bcc.brainCloudClient.s3Handling || {};
          bcc.brainCloudManager.script = bcc.brainCloudClient.script = bcc.brainCloudClient.script || {};
          bcc.brainCloudManager.socialLeaderboard = bcc.brainCloudClient.socialLeaderboard = bcc.brainCloudClient.socialLeaderboard || {};
          bcc.brainCloudManager.leaderboard = bcc.brainCloudManager.socialLeaderboard;
          bcc.brainCloudManager.statusCodes = bcc.brainCloudClient.statusCodes = bcc.brainCloudClient.statusCodes || {};
          bcc.brainCloudManager.time = bcc.brainCloudClient.time = bcc.brainCloudClient.time || {};
          bcc.brainCloudManager.tournament = bcc.brainCloudClient.tournament = bcc.brainCloudClient.tournament || {};
          bcc.brainCloudManager.globalFile = bcc.brainCloudClient.globalFile = bcc.brainCloudClient.globalFile || {};
          bcc.brainCloudManager.itemCatalog = bcc.brainCloudClient.itemCatalog = bcc.brainCloudClient.itemCatalog || {};
          bcc.brainCloudManager.userItems = bcc.brainCloudClient.userItems = bcc.brainCloudClient.userItems || {};
          bcc.brainCloudManager.customEntity = bcc.brainCloudClient.customEntity = bcc.brainCloudClient.customEntity || {};
          bcc.brainCloudManager.blockchain = bcc.brainCloudClient.blockchain = bcc.brainCloudClient.blockchain || {};
          bcc.brainCloudManager.campaign = bcc.brainCloudClient.campaign = bcc.brainCloudClient.campaign || {};
          bcc.brainCloudManager.timeUtils = bcc.brainCloudClient.timeUtils = bcc.brainCloudClient.timeUtils || {};
          bcc.brainCloudRttComms.rtt = bcc.brainCloudClient.rtt = bcc.brainCloudClient.rtt || {};
          bcc.brainCloudRttComms.brainCloudClient = bcc;
          bcc.brainCloudRelayComms.brainCloudClient = bcc;
        }
        bcc.version = "6.0.0";
        bcc.countryCode;
        bcc.languageCode;
        bcc.enableCompression = function(compressionEnabled) {
          bcc.enableCompressedRequests(compressionEnabled);
          bcc.enableCompressedResponses(compressionEnabled);
        };
        bcc.enableCompressedRequests = function(compressedRequestsEnabled) {
          bcc.brainCloudManager._compressionEnabled = compressedRequestsEnabled;
        };
        bcc.enableCompressedResponses = function(compressedResponsesEnabled) {
          bcc.authentication.compressResponses = compressedResponsesEnabled;
        };
        bcc.initialize = function(appId, secret, appVersion, serverUrl) {
          bcc.resetCommunication();
          function isBlank(str) {
            return !str || /^\s*$/.test(str);
          }
          var error = null;
          if (isBlank(secret)) error = "secret was null or empty";
          else if (isBlank(appId)) error = "appId was null or empty";
          else if (isBlank(appVersion)) error = "appVersion was null or empty";
          if (error != null) {
            console.log("ERROR | Failed to initialize brainCloud - " + error);
            return;
          }
          bcc.appVersion = appVersion;
          bcc.brainCloudManager.initialize(appId, secret, appVersion);
          if (!isBlank(serverUrl)) {
            bcc.setServerUrl(serverUrl);
          }
        };
        bcc.initializeWithApps = function(defaultAppId, secretMap, appVersion, serverUrl) {
          bcc.resetCommunication();
          function isBlank(str) {
            return !str || /^\s*$/.test(str);
          }
          var appId = defaultAppId;
          var secret = secretMap[appId];
          var error = null;
          if (isBlank(secret)) error = "secret was null or empty";
          else if (isBlank(appId)) error = "appId was null or empty";
          else if (isBlank(appVersion)) error = "appVersion was null or empty";
          if (error != null) {
            console.log("ERROR | Failed to initialize brainCloud - " + error);
            return;
          }
          bcc.appVersion = appVersion;
          bcc.brainCloudManager.initializeWithApps(
            defaultAppId,
            secretMap,
            appVersion
          );
          if (!isBlank(serverUrl)) {
            bcc.setServerUrl(serverUrl);
          }
        };
        bcc.initializeIdentity = function(profileId, anonymousId) {
          bcc.authentication.initialize(profileId, anonymousId);
        };
        bcc.setServerUrl = function(serverUrl) {
          bcc.brainCloudManager.setServerUrl(serverUrl);
        };
        bcc.getAppId = function() {
          return bcc.brainCloudManager.getAppId();
        };
        bcc.getAppVersion = function() {
          return bcc.appVersion;
        };
        bcc.getProfileId = function() {
          return bcc.authentication.profileId;
        };
        bcc.getSessionId = function() {
          return bcc.brainCloudManager.getSessionId();
        };
        bcc.getRTTConnectionId = function() {
          return bcc.brainCloudRttComms.getRTTConnectionId();
        };
        bcc.registerEventCallback = function(eventCallback) {
          bcc.brainCloudManager.registerEventCallback(eventCallback);
        };
        bcc.deregisterEventCallback = function() {
          bcc.brainCloudManager.deregisterEventCallback();
        };
        bcc.registerAutoReconnectCallback = function(autoReconnectCallback) {
          bcc.brainCloudManager.registerAutoReconnectCallback(autoReconnectCallback);
        };
        bcc.deregisterAutoReconnectCallback = function() {
          bcc.brainCloudManager.deregisterAutoReconnectCallback();
        };
        bcc.registerRewardCallback = function(rewardCallback) {
          bcc.brainCloudManager.registerRewardCallback(rewardCallback);
        };
        bcc.deregisterRewardCallback = function() {
          bcc.brainCloudManager.deregisterRewardCallback();
        };
        bcc.registerGlobalErrorCallback = function(errorCallback) {
          bcc.brainCloudManager.setErrorCallback(errorCallback);
        };
        bcc.enableLogging = function(enableLogging) {
          bcc.brainCloudManager.setDebugEnabled(enableLogging);
          bcc.brainCloudRttComms.setDebugEnabled(enableLogging);
          bcc.brainCloudRelayComms.setDebugEnabled(enableLogging);
        };
        bcc.setDebugEnabled = function(debugEnabled) {
          bcc.brainCloudManager.setDebugEnabled(debugEnabled);
          bcc.brainCloudRttComms.setDebugEnabled(debugEnabled);
          bcc.brainCloudRelayComms.setDebugEnabled(debugEnabled);
        };
        bcc.isInitialized = function() {
          return bcc.brainCloudManager.isInitialized();
        };
        bcc.isAuthenticated = function() {
          return bcc.brainCloudManager.isAuthenticated();
        };
        bcc.resetCommunication = function() {
          bcc.authentication.profileId = "";
          bcc.brainCloudManager.resetCommunication();
          bcc.brainCloudRttComms.disableRTT();
          bcc.brainCloudRelayComms.disconnect();
        };
        bcc.insertEndOfMessageBundleMarker = function() {
          var message = {
            operation: "END_BUNDLE_MARKER"
          };
          bcc.brainCloudManager.sendRequest(message);
        };
        bcc.overrideCountryCode = function(countryCode) {
          bcc.countryCode = countryCode;
        };
        bcc.overrideLanguageCode = function(languageCode) {
          bcc.languageCode = languageCode;
        };
        bcc.heartbeat = function(callback) {
          bcc.brainCloudManager.sendRequest({
            service: "heartbeat",
            operation: "READ",
            callback
          });
        };
        bcc.stopHeartBeat = function() {
          bcc.brainCloudManager.stopHeartBeat();
        };
        bcc.startHeartBeat = function() {
          bcc.brainCloudManager.startHeartBeat();
        };
      }
      BrainCloudClient.apply(
        window.brainCloudClient = window.brainCloudClient || {}
      );
      function BrainCloudRelayComms(_client) {
        var bcr = this;
        var Buffer2 = require_buffer().Buffer;
        bcr.CONTROL_BYTES_SIZE = 1;
        bcr.MAX_PLAYERS = 40;
        bcr.INVALID_NET_ID = bcr.MAX_PLAYERS;
        bcr.CL2RS_CONNECT = 0;
        bcr.CL2RS_DISCONNECT = 1;
        bcr.CL2RS_RELAY = 2;
        bcr.CL2RS_ACK = 3;
        bcr.CL2RS_PING = 4;
        bcr.CL2RS_RSMG_ACK = 5;
        bcr.CL2RS_ENDMATCH = 6;
        bcr.RS2CL_RSMG = 0;
        bcr.RS2CL_DISCONNECT = 1;
        bcr.RS2CL_RELAY = 2;
        bcr.RS2CL_ACK = 3;
        bcr.RS2CL_PONG = 4;
        bcr.RELIABLE_BIT = 32768;
        bcr.ORDERED_BIT = 16384;
        bcr.m_client = _client;
        bcr.name = "BrainCloudRelayComms";
        bcr.isConnected = false;
        bcr._cxId = null;
        bcr._ownerCxId = null;
        bcr._netIdToCxId = {};
        bcr._cxIdToNetId = {};
        bcr._debugEnabled = false;
        bcr._netId = bcr.INVALID_NET_ID;
        bcr._systemCallback = null;
        bcr._relayCallback = null;
        bcr._pingIntervalSeconds = 1;
        bcr._pingIntervalId = null;
        bcr._pingInFlight = false;
        bcr._pingTime = null;
        bcr._sendPacketId = {};
        bcr.ping = 999;
        bcr.endMatchRequested = false;
        bcr.setDebugEnabled = function(debugEnabled) {
          bcr._debugEnabled = debugEnabled;
        };
        bcr.getOwnerCxId = function() {
          return bcr._ownerCxId;
        };
        bcr.getCxIdForNetId = function(netId) {
          if (!bcr._netIdToCxId.hasOwnProperty(netId)) return null;
          return bcr._netIdToCxId[netId];
        };
        bcr.getNetIdForCxId = function(cxId) {
          if (!bcr._cxIdToNetId.hasOwnProperty(cxId)) return bcr.INVALID_NET_ID;
          return bcr._cxIdToNetId[cxId];
        };
        bcr.getProfileIdForNetId = function(netId) {
          var cxId = bcr.getCxIdForNetId(netId);
          if (cxId == null) return null;
          return cxId.split(":")[1];
        };
        bcr.getNetIdForProfileId = function(profileId) {
          for (var cxId in bcr._cxIdToNetId) {
            if (profileId === cxId.split(":")[1]) return bcr.getNetIdForCxId(cxId);
          }
          return bcr.INVALID_NET_ID;
        };
        bcr.connect = function(options, success, failure) {
          if (bcr.isConnected) {
            bcr.disconnect();
          }
          var ssl = options.ssl ? options.ssl : false;
          var host = options.host;
          var port = options.port;
          var passcode = options.passcode;
          var lobbyId = options.lobbyId;
          bcr.endMatchRequested = false;
          bcr.isConnected = false;
          bcr.connectCallback = {
            success,
            failure
          };
          bcr.connectInfo = {
            passcode,
            lobbyId
          };
          if (!host || !port || !passcode || !lobbyId) {
            setTimeout(function() {
              if (bcr.connectCallback.failure) {
                bcr.connectCallback.failure("Invalid arguments");
              }
            }, 0);
            return;
          }
          if (!bcr.m_client.isAuthenticated()) {
            if (bcr.connectCallback.failure) {
              bcr.connectCallback.failure("Invalid Session - Must be authenticated before connecting to Relay Server.");
            }
            if (bcr._debugEnabled) {
              console.log("The user is not currently authenticated - cannot connect to Relay Server.");
            }
            return;
          }
          var uri = (ssl ? "wss://" : "ws://") + host + ":" + port;
          bcr.socket = new WebSocket(uri);
          bcr.socket.addEventListener("error", bcr.onSocketError);
          bcr.socket.addEventListener("close", bcr.onSocketClose);
          bcr.socket.addEventListener("open", bcr.onSocketOpen);
          bcr.socket.addEventListener("message", bcr.onSocketMessage);
        };
        bcr.disconnect = function() {
          bcr.stopPing();
          if (!bcr.endMatchRequested) {
            if (bcr.socket) {
              bcr.socket.removeEventListener("error", bcr.onSocketError);
              bcr.socket.removeEventListener("close", bcr.onSocketClose);
              bcr.socket.removeEventListener("open", bcr.onSocketOpen);
              bcr.socket.removeEventListener("message", bcr.onSocketMessage);
              bcr.socket.close();
              bcr.socket = null;
            }
          }
          bcr.isConnected = false;
          bcr._sendPacketId = {};
          bcr._netIdToProfileId = {};
          bcr._profileIdToNetId = {};
          bcr.ping = 999;
        };
        bcr.endMatch = function(json) {
          if (bcr.isConnected) {
            var payload = {
              jsonPayload: json
            };
            bcr.sendJson(bcr.CL2RS_ENDMATCH, payload);
            bcr.endMatchRequested = true;
          }
        };
        bcr.registerRelayCallback = function(callback) {
          bcr._relayCallback = callback;
        };
        bcr.deregisterRelayCallback = function() {
          bcr._relayCallback = null;
        };
        bcr.registerSystemCallback = function(callback) {
          bcr._systemCallback = callback;
        };
        bcr.deregisterSystemCallback = function() {
          bcr._systemCallback = null;
        };
        bcr.setPingInterval = function(interval) {
          if (interval > 999) {
            bc.brainCloudManager.debugLog(
              "Warning: setPingInterval value should be in seconds. Values greater than 999 are automatically converted to seconds."
            );
            bcr._pingIntervalSeconds = interval / 1e3;
          } else {
            bcr._pingIntervalSeconds = interval;
          }
          if (bcr.isConnected) {
            bcr.stopPing();
            bcr.startPing();
          }
        };
        bcr.getOwnerProfileId = function() {
          return bcr._ownerCxId.spit(":")[1];
        };
        bcr.stopPing = function() {
          if (bcr._pingIntervalId) {
            clearInterval(bcr._pingIntervalId);
            bcr._pingIntervalId = null;
          }
          bcr._pingInFlight = false;
        };
        bcr.startPing = function() {
          bcr.stopPing();
          bcr._pingIntervalId = setInterval(function() {
            if (!bcr._pingInFlight) {
              bcr.sendPing();
            }
          }, bcr._pingIntervalSeconds);
        };
        bcr.onSocketError = function(e) {
          bcr.disconnect();
          if (bcr.connectCallback.failure) {
            bcr.connectCallback.failure("Relay error: " + e.toString());
          }
        };
        bcr.onSocketClose = function(e) {
          bcr.disconnect();
          if (bcr.connectCallback.failure) {
            if (!bcr.endMatchRequested) {
              bcr.connectCallback.failure("Relay Connection closed");
            }
          }
        };
        bcr.onSocketOpen = function(e) {
          console.log("Relay WebSocket connection established");
          var payload = {
            lobbyId: bcr.connectInfo.lobbyId,
            cxId: bcr.m_client.rttService.getRTTConnectionId(),
            passcode: bcr.connectInfo.passcode,
            version: bcr.m_client.version
          };
          bcr.sendJson(bcr.CL2RS_CONNECT, payload);
        };
        bcr.onSocketMessage = function(e) {
          var processResult = function(data) {
            console.log("Typeof data = " + typeof data);
            var buffer = Buffer2.from(data);
            if (data.length < 3) {
              bcr.disconnect();
              if (bcr.connectCallback.failure) {
                bcr.connectCallback.failure(
                  "Relay Recv Error: packet cannot be smaller than 3 bytes"
                );
              }
              return;
            }
            bcr.onRecv(buffer);
          };
          if (typeof FileReader !== "undefined") {
            var reader = new FileReader();
            reader.onload = function() {
              processResult(reader.result);
            };
            reader.readAsArrayBuffer(e.data);
          } else {
            processResult(e.data);
          }
        };
        bcr.sendJson = function(netId, json) {
          bcr.sendText(netId, JSON.stringify(json));
        };
        bcr.sendText = function(netId, text) {
          var buffer = Buffer2.alloc(text.length + 3);
          buffer.writeUInt16BE(text.length + 3, 0);
          buffer.writeUInt8(netId, 2);
          buffer.write(text, 3, text.length);
          bcr.socket.send(buffer);
          if (bcr._debugEnabled) {
            console.log("RELAY SEND: " + text);
          }
        };
        bcr.sendRelay = function(data, playerMask, reliable, ordered, channel) {
          if (!bcr.isConnected) return;
          var rh = 0;
          if (reliable) rh += bcr.RELIABLE_BIT;
          if (ordered) rh += bcr.ORDERED_BIT;
          rh += channel * 4096;
          var invertedPlayerMask = 0;
          var mask = 1;
          var playerMaskPart0 = playerMask / 4294967296 & 4294967295;
          var playerMaskPart1 = playerMask & 4294967295;
          for (var i2 = 0; i2 < 40; ++i2) {
            var invertedMask = Math.pow(2, 40 - i2 - 1);
            var maskPart0 = mask / 4294967296 & 4294967295;
            var maskPart1 = mask & 4294967295;
            if ((playerMaskPart0 & maskPart0) != 0 || (playerMaskPart1 & maskPart1) != 0) {
              invertedPlayerMask += invertedMask;
            }
            mask *= 2;
          }
          playerMaskPart0 = invertedPlayerMask * 256 / 4294967296 & 65535;
          playerMaskPart1 = invertedPlayerMask * 256 & 4294967040;
          var p0 = rh;
          var p1 = playerMaskPart0 & 65535;
          var p2 = playerMaskPart1 / 65536 & 65535;
          var p3 = playerMaskPart1 & 65535;
          if (!bcr._sendPacketId.hasOwnProperty(p0)) bcr._sendPacketId[p0] = {};
          if (!bcr._sendPacketId[p0].hasOwnProperty(p1))
            bcr._sendPacketId[p0][p1] = {};
          if (!bcr._sendPacketId[p0][p1].hasOwnProperty(p2))
            bcr._sendPacketId[p0][p1][p2] = {};
          if (!bcr._sendPacketId[p0][p1][p2].hasOwnProperty(p3))
            bcr._sendPacketId[p0][p1][p2][p3] = 0;
          var packetId = bcr._sendPacketId[p0][p1][p2][p3];
          rh += packetId;
          var buffer = Buffer2.alloc(data.length + 11);
          buffer.writeUInt16BE(data.length + 11, 0);
          buffer.writeUInt8(bcr.CL2RS_RELAY, 2);
          buffer.writeUInt16BE(rh, 3);
          buffer.writeUInt16BE(p1, 5);
          buffer.writeUInt16BE(p2, 7);
          buffer.writeUInt16BE(p3, 9);
          buffer.set(data, 11);
          bcr.socket.send(buffer);
          packetId = packetId + 1 & 4095;
          bcr._sendPacketId[p0][p1][p2][p3] = packetId;
        };
        bcr.sendPing = function() {
          if (bcr._debugEnabled) {
            console.log("RELAY SEND PING: " + bcr.ping);
          }
          bcr._pingInFlight = true;
          bcr._pingTime = (/* @__PURE__ */ new Date()).getTime();
          var buffer = Buffer2.alloc(5);
          buffer.writeUInt16BE(5, 0);
          buffer.writeUInt8(bcr.CL2RS_PING, 2);
          buffer.writeUInt16BE(bcr.ping, 3);
          bcr.socket.send(buffer);
        };
        bcr.send = function(netId, data) {
          if (!(netId < MAX_PLAYERS && netId >= 0 || netId == bc.relay.TO_ALL_PLAYERS)) {
            if (bcr.connectCallback.failure) {
              bcr.connectCallback.failure("Relay Error: Invalid NetId " + netId);
            }
            return;
          }
          if (data.length > 1024) {
            if (bcr.connectCallback.failure) {
              bcr.connectCallback.failure(
                "Relay Error: Packet too big " + data.length + " > max 1024"
              );
            }
            return;
          }
          var buffer = Buffer2.alloc(data.length + 3);
          buffer.writeUInt16BE(data.length + 3, 0);
          buffer.writeUInt8(netId, 2);
          buffer.set(data, 3);
          bcr.socket.send(buffer);
        };
        bcr.onRecv = function(buffer) {
          var size = buffer.readUInt16BE(0);
          var controlByte = buffer.readUInt8(2);
          if (controlByte == bcr.RS2CL_RSMG) {
            bcr.onRSMG(buffer);
          } else if (controlByte == bcr.RS2CL_PONG) {
            if (bcr._pingInFlight) {
              bcr._pingInFlight = false;
              bcr.ping = Math.min(999, (/* @__PURE__ */ new Date()).getTime() - bcr._pingTime);
            }
            if (bcr._debugEnabled) {
              console.log("RELAY RECV PONG: " + bcr.ping);
            }
          } else if (controlByte == bcr.RS2CL_ACK) {
          } else if (controlByte == bcr.RS2CL_RELAY) {
            var netId = buffer.readUInt8(10);
            if (bcr._debugEnabled) {
              console.log("RELAY RECV from netId: " + netId + " size: " + size);
            }
            if (bcr._relayCallback) {
              bcr._relayCallback(netId, buffer.slice(11));
            }
          } else {
            bcr.disconnect();
            if (bcr.connectCallback.failure) {
              bcr.connectCallback.failure(
                "Relay Recv Error: Unknown controlByte: " + controlByte
              );
            }
          }
        };
        bcr.onRSMG = function(buffer) {
          var str = buffer.slice(5).toString("utf8");
          if (bcr._debugEnabled) {
            console.log("RELAY RECV RSMG: " + str);
          }
          var json = JSON.parse(str);
          switch (json.op) {
            case "CONNECT": {
              bcr._netIdToCxId[json.netId] = json.cxId;
              bcr._cxIdToNetId[json.cxId] = json.netId;
              if (json.cxId == _client.rttService.getRTTConnectionId()) {
                if (!bcr.isConnected) {
                  bcr._netId = json.netId;
                  bcr._ownerCxId = json.ownerCxId;
                  bcr.isConnected = true;
                  bcr.startPing();
                  if (bcr.connectCallback.success) {
                    bcr.connectCallback.success(json);
                  }
                }
              }
              break;
            }
            case "NET_ID": {
              bcr._netIdToCxId[json.netId] = json.cxId;
              bcr._cxIdToNetId[json.cxId] = json.netId;
              break;
            }
            case "MIGRATE_OWNER": {
              bcr._ownerId = json.cxId;
              break;
            }
            case "END_MATCH": {
              bcr.endMatchRequested = true;
              bcr.disconnect();
              break;
            }
          }
          if (bcr._systemCallback) {
            bcr._systemCallback(json);
          }
        };
      }
      BrainCloudRelayComms.apply(
        window.brainCloudRelayComms = window.brainCloudRelayComms || {}
      );
      var DEFAULT_RTT_HEARTBEAT;
      var disconnectedWithReason = false;
      var disconnectMessage = null;
      function getBrowserName() {
        var isOpera = !!window.opr && !!opr.addons || !!window.opera || typeof navigator !== "undefined" && navigator.userAgent.indexOf(" OPR/") >= 0;
        var isFirefox = typeof InstallTrigger !== "undefined";
        var isSafari = /constructor/i.test(window.HTMLElement) || function(p) {
          return p.toString() === "[object SafariRemoteNotification]";
        }(
          !window["safari"] || typeof safari !== "undefined" && safari.pushNotification
        );
        var isIE = typeof document !== "undefined" && !!document.documentMode;
        var isEdge = !isIE && !!window.StyleMedia;
        var isChrome = !!window.chrome && !!window.chrome.webstore;
        var isBlink = (isChrome || isOpera) && !!window.CSS;
        if (isOpera) return "opera";
        if (isFirefox) return "firefox";
        if (isSafari) return "safari";
        if (isIE) return "ie";
        if (isEdge) return "edge";
        if (isChrome) return "chrome";
        if (isBlink) return "blink";
        return null;
      }
      function BrainCloudRttComms(m_client) {
        var bcrtt = this;
        bcrtt.RTTConnectionStatus = {
          CONNECTED: "Connected",
          DISCONNECTED: "Disconnected",
          CONNECTING: "Connecting",
          DISCONNECTING: "Disconnecting"
        };
        bcrtt.m_client = m_client;
        bcrtt.name = "BrainCloudRttComms";
        bcrtt.socket = null;
        bcrtt.heartbeatId = null;
        bcrtt._rttConnectionStatus = bcrtt.RTTConnectionStatus.DISCONNECTED;
        bcrtt.auth = {};
        bcrtt.callbacks = {};
        bcrtt._debugEnabled = false;
        bcrtt.connectionId = null;
        bcrtt.setDebugEnabled = function(debugEnabled) {
          bcrtt._debugEnabled = debugEnabled;
        };
        bcrtt.getRTTConnectionId = function() {
          return bcrtt.connectionId;
        };
        bcrtt.getConnectionStatus = function() {
          return bcrtt._rttConnectionStatus;
        };
        bcrtt.connect = function(host, port, auth, ssl) {
          bcrtt._rttConnectionStatus = bcrtt.RTTConnectionStatus.CONNECTING;
          bcrtt.auth = auth;
          var uri = (ssl ? "wss://" : "ws://") + host + ":" + port;
          if (bcrtt.auth) {
            uri += "?";
            var count = 0;
            for (var key in bcrtt.auth) {
              if (count > 0) {
                uri += "&";
              }
              uri += key + "=" + bcrtt.auth[key];
              ++count;
            }
          }
          bcrtt.socket = new WebSocket(uri);
          bcrtt.socket.addEventListener("error", bcrtt.onSocketError);
          bcrtt.socket.addEventListener("close", bcrtt.onSocketClose);
          bcrtt.socket.addEventListener("open", bcrtt.onSocketOpen);
          bcrtt.socket.addEventListener("message", bcrtt.onSocketMessage);
        };
        bcrtt.onSocketError = function(e) {
          if (bcrtt.isRTTEnabled()) {
            bcrtt.connectCallback.failure("error");
          }
          bcrtt.disableRTT();
        };
        bcrtt.onSocketClose = function(e) {
          if (bcrtt.isRTTEnabled()) {
            bcrtt.connectCallback.failure("close");
          }
          bcrtt.disableRTT();
          if (disconnectedWithReason == true) {
            console.log("RTT:Disconnect" + JSON.stringify(disconnectMessage));
          }
        };
        bcrtt.onSocketOpen = function(e) {
          if (bcrtt.isRTTEnabled()) {
            if (bcrtt._debugEnabled) {
              console.log("WebSocket connection established");
            }
            var request = {
              operation: "CONNECT",
              service: "rtt",
              data: {
                appId: bcrtt.brainCloudClient.getAppId(),
                profileId: bcrtt.brainCloudClient.getProfileId(),
                sessionId: bcrtt.brainCloudClient.getSessionId(),
                system: {
                  protocol: "ws",
                  platform: "WEB"
                }
              }
            };
            var browserName = getBrowserName();
            if (browserName) {
              request.data.system.browser = browserName;
            }
            request.data.auth = bcrtt.auth;
            if (bcrtt._debugEnabled) {
              console.log("WS SEND: " + JSON.stringify(request));
            }
            bcrtt.socket.send(JSON.stringify(request));
          }
        };
        bcrtt.onSocketMessage = function(e) {
          if (bcrtt.isRTTEnabled()) {
            var processResult = function(result2) {
              if (result2.service == "rtt") {
                if (bcrtt._debugEnabled) {
                  console.log("WS RECV: " + JSON.stringify(result2));
                }
                if (result2.operation == "CONNECT") {
                  bcrtt.connectionId = result2.data.cxId;
                  DEFAULT_RTT_HEARTBEAT = result2.data.heartbeatSeconds;
                  bcrtt.startHeartbeat();
                  bcrtt.connectCallback.success(result2);
                } else if (result2.operation == "DISCONNECT") {
                  disconnectedWithReason = true;
                  disconnectMessage = {
                    severity: "ERROR",
                    reason: result2.data.reason,
                    reasonCode: result2.data.reasonCode,
                    data: null
                  };
                }
              } else {
                bcrtt.onRecv(result2);
              }
            };
            if (typeof e.data === "string") {
              processResult(e.data);
            } else if (typeof FileReader !== "undefined") {
              var reader = new FileReader();
              reader.onload = function() {
                var parsed2 = {};
                try {
                  parsed2 = JSON.parse(reader.result);
                } catch (e2) {
                  console.log("WS RECV: " + reader.result);
                  parsed2 = JSON.parse(reader.result);
                }
                processResult(parsed2);
              };
              reader.readAsText(e.data);
            } else {
              var parsed = {};
              try {
                parsed = JSON.parse(e.data);
              } catch (e2) {
                console.log("WS RECV: " + e2.data);
                parsed = JSON.parse(e2.data);
              }
              processResult(parsed);
            }
          }
        };
        bcrtt.startHeartbeat = function() {
          if (!bcrtt.heartbeatId) {
            bcrtt.heartbeatId = setInterval(function() {
              var request = {
                operation: "HEARTBEAT",
                service: "rtt",
                data: null
              };
              if (bcrtt._debugEnabled) {
                console.log("WS SEND: " + JSON.stringify(request));
              }
              bcrtt.socket.send(JSON.stringify(request));
            }, 1e3 * DEFAULT_RTT_HEARTBEAT);
          }
        };
        bcrtt.onRecv = function(result2) {
          if (bcrtt._debugEnabled) {
            console.log("WS RECV: " + JSON.stringify(result2));
          }
          if (bcrtt.callbacks[result2.service]) {
            bcrtt.callbacks[result2.service](result2);
          }
        };
        bcrtt.enableRTT = function(success, failure) {
          disconnectedWithReason = false;
          if (bcrtt.isRTTEnabled() || bcrtt._rttConnectionStatus == bcrtt.RTTConnectionStatus.CONNECTING) {
            return;
          } else {
            bcrtt.connectCallback = {
              success,
              failure
            };
            if (!bcrtt.m_client.isAuthenticated()) {
              if (bcrtt.connectCallback.failure) {
                bcrtt.connectCallback.failure("Invalid Session - Must be authenticated before enabling RTT.");
              }
              if (bcrtt._debugEnabled) {
                console.log("The user is not currently authenticated - cannot enable RTT.");
              }
              return;
            }
            bcrtt._rttConnectionStatus = bcrtt.RTTConnectionStatus.CONNECTING;
            m_client.rttService.requestClientConnection(function(result2) {
              if (bcrtt._debugEnabled) {
                console.log(result2);
              }
              if (result2.status == 200) {
                for (var i2 = 0; i2 < result2.data.endpoints.length; ++i2) {
                  var endpoint = result2.data.endpoints[i2];
                  if (endpoint.protocol === "ws") {
                    bcrtt.connect(
                      endpoint.host,
                      endpoint.port,
                      result2.data.auth,
                      endpoint.ssl
                    );
                    bcrtt._rttConnectionStatus = bcrtt.RTTConnectionStatus.CONNECTED;
                    return;
                  }
                }
                result2.status = 0;
                result2.status_message = "WebSocket endpoint missing";
                bcrtt._rttConnectionStatus = bcrtt.RTTConnectionStatus.DISCONNECTED;
                bcrtt.connectCallback.failure(result2);
              } else {
                bcrtt._rttConnectionStatus = bcrtt.RTTConnectionStatus.DISCONNECTED;
                bcrtt.connectCallback.failure(result2);
              }
            });
          }
        };
        bcrtt.disableRTT = function() {
          if (!bcrtt.isRTTEnabled() || bcrtt._rttConnectionStatus == bcrtt.RTTConnectionStatus.DISCONNECTING) {
            return;
          } else {
            bcrtt._rttConnectionStatus = bcrtt.RTTConnectionStatus.DISCONNECTING;
            if (bcrtt.heartbeatId) {
              clearInterval(bcrtt.heartbeatId);
              bcrtt.heartbeatId = null;
            }
            if (bcrtt.socket) {
              bcrtt.socket.removeEventListener("error", bcrtt.onSocketError);
              bcrtt.socket.removeEventListener("close", bcrtt.onSocketClose);
              bcrtt.socket.removeEventListener("open", bcrtt.onSocketOpen);
              bcrtt.socket.removeEventListener("message", bcrtt.onSocketMessage);
              bcrtt.socket.close();
              bcrtt.socket = null;
            }
            bcrtt._rttConnectionStatus = bcrtt.RTTConnectionStatus.DISCONNECTED;
          }
        };
        bcrtt.isRTTEnabled = function() {
          return bcrtt._rttConnectionStatus == bcrtt.RTTConnectionStatus.CONNECTED;
        };
        bcrtt.registerRTTCallback = function(serviceName, callback) {
          bcrtt.callbacks[serviceName] = callback;
        };
        bcrtt.deregisterRTTCallback = function(serviceName) {
          bcrtt.callbacks[serviceName] = null;
        };
        bcrtt.deregisterAllRTTCallbacks = function() {
          bcrtt.callbacks = {};
        };
      }
      BrainCloudRttComms.apply(
        window.brainCloudRttComms = window.brainCloudRttComms || {}
      );
      var getIdentitiesCallback = null;
      function BrainCloudWrapper(wrapperName) {
        var bcw = this;
        bcw.name = "BrainCloudWrapper";
        if (window.brainCloudWrapper !== bcw) {
          bcw.brainCloudClient = new BrainCloudClient(wrapperName);
          bcw.abtests = bcw.brainCloudClient.abtests;
          bcw.asyncMatch = bcw.brainCloudClient.asyncMatch;
          bcw.chat = bcw.brainCloudClient.chat;
          bcw.dataStream = bcw.brainCloudClient.dataStream;
          bcw.entity = bcw.brainCloudClient.entity;
          bcw.event = bcw.brainCloudClient.event;
          bcw.file = bcw.brainCloudClient.file;
          bcw.friend = bcw.brainCloudClient.friend;
          bcw.gamification = bcw.brainCloudClient.gamification;
          bcw.globalApp = bcw.brainCloudClient.globalApp;
          bcw.globalStatistics = bcw.brainCloudClient.globalStatistics;
          bcw.globalEntity = bcw.brainCloudClient.globalEntity;
          bcw.groupFile = bcw.brainCloudClient.groupFile;
          bcw.group = bcw.brainCloudClient.group;
          bcw.identity = bcw.brainCloudClient.identity;
          bcw.lobby = bcw.brainCloudClient.lobby;
          bcw.mail = bcw.brainCloudClient.mail;
          bcw.matchMaking = bcw.brainCloudClient.matchMaking;
          bcw.messaging = bcw.brainCloudClient.messaging;
          bcw.oneWayMatch = bcw.brainCloudClient.oneWayMatch;
          bcw.playbackStream = bcw.brainCloudClient.playbackStream;
          bcw.playerState = bcw.brainCloudClient.playerState;
          bcw.playerStatistics = bcw.brainCloudClient.playerStatistics;
          bcw.playerStatisticsEvent = bcw.brainCloudClient.playerStatisticsEvent;
          bcw.presence = bcw.brainCloudClient.presence;
          bcw.virtualCurrency = bcw.brainCloudClient.virtualCurrency;
          bcw.appStore = bcw.brainCloudClient.appStore;
          bcw.profanity = bcw.brainCloudClient.profanity;
          bcw.pushNotification = bcw.brainCloudClient.pushNotification;
          bcw.reasonCodes = bcw.brainCloudClient.reasonCodes;
          bcw.redemptionCode = bcw.brainCloudClient.redemptionCode;
          bcw.relay = bcw.brainCloudClient.relay;
          bcw.rttService = bcw.brainCloudClient.rttService;
          bcw.s3Handling = bcw.brainCloudClient.s3Handling;
          bcw.script = bcw.brainCloudClient.script;
          bcw.socialLeaderboard = bcw.brainCloudClient.socialLeaderboard;
          bcw.leaderboard = bcw.socialLeaderboard;
          bcw.statusCodes = bcw.brainCloudClient.statusCodes;
          bcw.time = bcw.brainCloudClient.time;
          bcw.tournament = bcw.brainCloudClient.tournament;
          bcw.globalFile = bcw.brainCloudClient.globalFile;
          bcw.itemCatalog = bcw.brainCloudClient.itemCatalog;
          bcw.userItems = bcw.brainCloudClient.userItems;
          bcw.customEntity = bcw.brainCloudClient.customEntity;
          bcw.blockchain = bcw.brainCloudClient.blockchain;
          bcw.campaign = bcw.brainCloudClient.campaign;
          bcw.timeUtils = bcw.brainCloudClient.timeUtils;
          bcw.brainCloudManager = bcw.brainCloudClient.brainCloudManager = bcw.brainCloudClient.brainCloudManager || {};
        } else {
          bcw.brainCloudManager = window.brainCloudManager = window.brainCloudManager || {};
          bcw.brainCloudClient = window.brainCloudClient = window.brainCloudClient || {};
        }
        bcw.wrapperName = wrapperName === void 0 ? "" : wrapperName;
        bcw._alwaysAllowProfileSwitch = true;
        bcw.initializeParams = {
          appId: "",
          secretKey: "",
          appVersion: "",
          serverUrl: "",
          secretMap: null
        };
        bcw._initializeIdentity = function(isAnonymousAuth) {
          var profileId = bcw.getStoredProfileId();
          var anonymousId = bcw.getStoredAnonymousId();
          if (profileId == null) {
            profileId = "";
          }
          if (anonymousId == null) {
            anonymousId = "";
          }
          if (anonymousId == "" || profileId == "") {
            anonymousId = bcw.brainCloudClient.authentication.generateAnonymousId();
            profileId = "";
            bcw.setStoredAnonymousId(anonymousId);
            bcw.setStoredProfileId(profileId);
          }
          var profileIdToAuthenticateWith = profileId;
          if (!isAnonymousAuth && bcw._alwaysAllowProfileSwitch) {
            profileIdToAuthenticateWith = "";
          }
          bcw.brainCloudClient.initializeIdentity(
            profileIdToAuthenticateWith,
            anonymousId
          );
        };
        bcw._authResponseHandler = function(responseHandler, result2) {
          if (result2.status == 202 && result2.reason_code == bcw.reasonCodes.MANUAL_REDIRECT) {
            bcw.initializeParams.serverUrl = result2.redirect_url ? result2.redirect_url : bcw.initializeParams.serverUrl;
            var newAppId = result2.redirect_appid ? result2.redirect_appid : null;
            if (bcw.initializeParams.secretMap == null) {
              if (newAppId != null) bcw.initializeParams.appId = newAppId;
              bcw.brainCloudClient.initialize(
                bcw.initializeParams.appId,
                bcw.initializeParams.secretKey,
                bcw.initializeParams.appVersion,
                bcw.initializeParams.serverUrl
              );
            } else {
              bcw.brainCloudClient.initializeWithApps(
                bcw.initializeParams.appId,
                bcw.initializeParams.secretMap,
                bcw.initializeParams.appVersion,
                bcw.initializeParams.serverUrl
              );
            }
            bcw._initializeIdentity(true);
            bcw.brainCloudClient.authentication.retryPreviousAuthenticate(
              responseHandler
            );
            return;
          }
          if (result2.status == 200) {
            var profileId = result2.data.profileId;
            bcw.setStoredProfileId(profileId);
            var sessionId = result2.data.sessionId;
            bcw.setStoredSessionId(sessionId);
          }
          if (bcw._debugEnabled) {
            console.log("Updated saved profileId to " + profileId);
          }
          responseHandler(result2);
        };
        bcw.initialize = function(appId, secret, appVersion, serverUrl) {
          bcw.initializeParams = {
            appId,
            secretKey: secret,
            appVersion,
            serverUrl: serverUrl || "",
            secretMap: null
          };
          bcw.brainCloudClient.initialize(appId, secret, appVersion, serverUrl);
        };
        bcw.initializeWithApps = function(defaultAppId, secretMap, appVersion, serverUrl) {
          bcw.initializeParams = {
            appId: defaultAppId,
            secretKey: "",
            appVersion,
            serverUrl: serverUrl || "",
            secretMap
          };
          bcw.brainCloudClient.initializeWithApps(defaultAppId, secretMap, appVersion, serverUrl);
        };
        bcw.getStoredAnonymousId = function() {
          var prefix = wrapperName === "" ? "" : wrapperName + ".";
          return localStorage.getItem(prefix + "anonymousId");
        };
        bcw.setStoredAnonymousId = function(anonymousId) {
          var prefix = wrapperName === "" ? "" : wrapperName + ".";
          localStorage.setItem(prefix + "anonymousId", anonymousId);
        };
        bcw.resetStoredAnonymousId = function() {
          bcw.setStoredAnonymousId("");
        };
        bcw.getStoredProfileId = function() {
          var prefix = wrapperName === "" ? "" : wrapperName + ".";
          return localStorage.getItem(prefix + "profileId");
        };
        bcw.setStoredProfileId = function(profileId) {
          var prefix = wrapperName === "" ? "" : wrapperName + ".";
          localStorage.setItem(prefix + "profileId", profileId);
        };
        bcw.resetStoredProfileId = function() {
          bcw.setStoredProfileId("");
        };
        bcw.getStoredSessionId = function() {
          var prefix = wrapperName === "" ? "" : wrapperName + ".";
          return localStorage.getItem(prefix + "sessionId");
        };
        bcw.setStoredSessionId = function(sessionId) {
          var prefix = wrapperName === "" ? "" : wrapperName + ".";
          localStorage.setItem(prefix + "sessionId", sessionId);
        };
        bcw.resetStoredSessionId = function() {
          bcw.setStoredSessionId("");
        };
        bcw.getAlwaysAllowProfileSwitch = function() {
          return bcw._alwaysAllowProfileSwitch;
        };
        bcw.setAlwaysAllowProfileSwitch = function(alwaysAllow) {
          bcw._alwaysAllowProfileSwitch = alwaysAllow;
        };
        bcw.authenticateAnonymous = function(responseHandler) {
          bcw._initializeIdentity(true);
          bcw.brainCloudClient.authentication.authenticateAnonymous(
            true,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.authenticateEmailPassword = function(email, password, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          bcw.brainCloudClient.authentication.authenticateEmailPassword(
            email,
            password,
            forceCreate,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.authenticateExternal = function(userId, token, externalAuthName, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          bcw.brainCloudClient.authentication.authenticateExternal(
            userId,
            token,
            externalAuthName,
            forceCreate,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.authenticateFacebook = function(facebookId, facebookToken, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          bcw.brainCloudClient.authentication.authenticateFacebook(
            facebookId,
            facebookToken,
            forceCreate,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.authenticateFacebookLimited = function(facebookLimitedId2, facebookToken, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          bcw.brainCloudClient.authentication.authenticateFacebookLimited(
            facebookLimitedId2,
            facebookToken,
            forceCreate,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.authenticateGameCenter = function(gameCenterId, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          bcw.brainCloudClient.authentication.authenticateGameCenter(
            gameCenterId,
            forceCreate,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.authenticateApple = function(appleUserId, identityToken, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          bcw.brainCloudClient.authentication.authenticateApple(
            appleUserId,
            identityToken,
            forceCreate,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.authenticateUltra = function(ultraUsername, ultraIdToken, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          bcw.brainCloudClient.authentication.authenticateUltra(
            ultraUsername,
            ultraIdToken,
            forceCreate,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.authenticateGoogle = function(googleUserId, serverAuthCode, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          bcw.brainCloudClient.authentication.authenticateGoogle(
            googleUserId,
            serverAuthCode,
            forceCreate,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.authenticateGoogleOpenId = function(googleUserAccountEmail, IdToken, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          bcw.brainCloudClient.authentication.authenticateGoogleOpenId(
            googleUserAccountEmail,
            IdToken,
            forceCreate,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.authenticateSteam = function(userId, sessionTicket, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          bcw.brainCloudClient.authentication.authenticateSteam(
            userId,
            sessionTicket,
            forceCreate,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.authenticateTwitter = function(userId, token, secret, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          bcw.brainCloudClient.authentication.authenticateTwitter(
            userId,
            token,
            secret,
            forceCreate,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.authenticateUniversal = function(userId, userPassword, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          bcw.brainCloudClient.authentication.authenticateUniversal(
            userId,
            userPassword,
            forceCreate,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.authenticateAdvanced = function(authenticationType, ids, forceCreate, extraJson, responseHandler) {
          bcw._initializeIdentity(false);
          bcw.brainCloudClient.authentication.authenticateAdvanced(
            authenticationType,
            ids,
            forceCreate,
            extraJson,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.authenticateHandoff = function(handoffId, securityToken, callback) {
          bcw.brainCloudClient.authentication.authenticateHandoff(
            handoffId,
            securityToken,
            callback
          );
        };
        bcw.authenticateSettopHandoff = function(handoffCode, callback) {
          bcw.brainCloudClient.authentication.authenticateSettopHandoff(
            handoffCode,
            callback
          );
        };
        bcw.smartSwitchAuthenticateEmailPassword = function(email, password, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          authenticationCallback = function() {
            bcw.brainCloudClient.authentication.authenticateEmailPassword(
              email,
              password,
              forceCreate,
              function(result2) {
                bcw._authResponseHandler(responseHandler, result2);
              }
            );
          };
          bcw.brainCloudClient.identity.getIdentities(
            getIdentitiesCallback(authenticationCallback)
          );
        };
        bcw.smartSwitchAuthenticateExternal = function(userId, token, externalAuthName, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          authenticationCallback = function() {
            bcw.brainCloudClient.authentication.authenticateExternal(
              userId,
              token,
              forceCreate,
              function(result2) {
                bcw._authResponseHandler(responseHandler, result2);
              }
            );
          };
          bcw.brainCloudClient.identity.getIdentities(
            getIdentitiesCallback(authenticationCallback)
          );
        };
        bcw.smartSwitchAuthenticateFacebook = function(facebookId, facebookToken, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          authenticationCallback = function() {
            bcw.brainCloudClient.authentication.authenticateFacebook(
              facebookId,
              facebookToken,
              forceCreate,
              function(result2) {
                bcw._authResponseHandler(responseHandler, result2);
              }
            );
          };
          bcw.brainCloudClient.identity.getIdentities(
            getIdentitiesCallback(authenticationCallback)
          );
        };
        bcw.smartSwitchAuthenticateFacebookLimited = function(facebookLimitedId2, facebookToken, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          authenticationCallback = function() {
            bcw.brainCloudClient.authentication.authenticateFacebookLimited(
              facebookLimitedId2,
              facebookToken,
              forceCreate,
              function(result2) {
                bcw._authResponseHandler(responseHandler, result2);
              }
            );
          };
          bcw.brainCloudClient.identity.getIdentities(
            getIdentitiesCallback(authenticationCallback)
          );
        };
        bcw.smartSwitchAuthenticateGameCenter = function(gameCenterId, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          authenticationCallback = function() {
            bcw.brainCloudClient.authentication.authenticateGameCenter(
              gameCenterId,
              forceCreate,
              function(result2) {
                bcw._authResponseHandler(responseHandler, result2);
              }
            );
          };
          bcw.brainCloudClient.identity.getIdentities(
            getIdentitiesCallback(authenticationCallback)
          );
        };
        bcw.smartSwitchAuthenticateGoogle = function(googleId, googleToken, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          authenticationCallback = function() {
            bcw.brainCloudClient.authentication.authenticateGoogle(
              googleId,
              googleToken,
              forceCreate,
              function(result2) {
                bcw._authResponseHandler(responseHandler, result2);
              }
            );
          };
          bcw.brainCloudClient.identity.getIdentities(
            getIdentitiesCallback(authenticationCallback)
          );
        };
        bcw.smartSwitchAuthenticateUltra = function(ultraUsername, ultraIdToken, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          authenticationCallback = function() {
            bcw.brainCloudClient.authentication.authenticateUltra(
              ultraUsername,
              ultraIdToken,
              forceCreate,
              function(result2) {
                bcw._authResponseHandler(responseHandler, result2);
              }
            );
          };
          bcw.brainCloudClient.identity.getIdentities(
            getIdentitiesCallback(authenticationCallback)
          );
        };
        bcw.smartSwitchAuthenticateSteam = function(userId, sessionTicket, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          authenticationCallback = function() {
            bcw.brainCloudClient.authentication.authenticateSteam(
              userId,
              sessionTicket,
              forceCreate,
              function(result2) {
                bcw._authResponseHandler(responseHandler, result2);
              }
            );
          };
          bcw.brainCloudClient.identity.getIdentities(
            getIdentitiesCallback(authenticationCallback)
          );
        };
        bcw.smartSwitchAuthenticateTwitter = function(userId, token, secret, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          authenticationCallback = function() {
            bcw.brainCloudClient.authentication.authenticateTwitter(
              userId,
              token,
              secret,
              forceCreate,
              function(result2) {
                bcw._authResponseHandler(responseHandler, result2);
              }
            );
          };
          bcw.brainCloudClient.identity.getIdentities(
            getIdentitiesCallback(authenticationCallback)
          );
        };
        bcw.smartSwitchAuthenticateUniversal = function(userId, userPassword, forceCreate, responseHandler) {
          bcw._initializeIdentity(false);
          authenticationCallback = function() {
            bcw.brainCloudClient.authentication.authenticateUniversal(
              userId,
              userPassword,
              forceCreate,
              function(result2) {
                bcw._authResponseHandler(responseHandler, result2);
              }
            );
          };
          bcw.brainCloudClient.identity.getIdentities(
            getIdentitiesCallback(authenticationCallback)
          );
        };
        bcw.smartSwitchAuthenticateAdvanced = function(authenticationType, ids, forceCreate, extraJson, responseHandler) {
          bcw._initializeIdentity(false);
          authenticationCallback = function() {
            bcw.brainCloudClient.authentication.authenticateAdvanced(
              authenticationType,
              ids,
              forceCreate,
              extraJson,
              function(result2) {
                bcw._authResponseHandler(responseHandler, result2);
              }
            );
          };
          bcw.brainCloudClient.identity.getIdentities(
            getIdentitiesCallback(authenticationCallback)
          );
        };
        getIdentitiesCallback = function(callback) {
          identitiesCallback = function(response) {
            if (bcw.brainCloudClient.isAuthenticated()) {
              try {
                var identities = JSON.stringify(response.data.identities);
                if (identities === "{}" || identities === "") {
                  bcw.brainCloudClient.playerState.deleteUser(callback);
                } else {
                  bcw.brainCloudClient.playerState.logout(callback);
                }
              } catch (e) {
                bcw.brainCloudClient.playerState.logout(callback);
              }
            } else {
              callback();
            }
          };
          return identitiesCallback;
        };
        bcw.resetEmailPassword = function(email, responseHandler) {
          bcw.brainCloudClient.authentication.resetEmailPassword(
            email,
            responseHandler
          );
        };
        bcw.resetEmailPasswordAdvanced = function(emailAddress, serviceParams, responseHandler) {
          bcw.brainCloudClient.authentication.resetEmailPasswordAdvanced(
            emailAddress,
            serviceParams,
            responseHandler
          );
        };
        bcw.resetEmailPasswordWithExpiry = function(email, tokenTtlInMinutes, responseHandler) {
          bcw.brainCloudClient.authentication.resetEmailPasswordWithExpiry(
            email,
            tokenTtlInMinutes,
            responseHandler
          );
        };
        bcw.resetEmailPasswordAdvancedWithExpiry = function(emailAddress, serviceParams, tokenTtlInMinutes, responseHandler) {
          bcw.brainCloudClient.authentication.resetEmailPasswordAdvancedWithExpiry(
            emailAddress,
            serviceParams,
            tokenTtlInMinutes,
            responseHandler
          );
        };
        bcw.canReconnect = function() {
          if (bcw.getStoredProfileId() === null || bcw.getStoredAnonymousId() === null) {
            return false;
          }
          return bcw.getStoredProfileId().length > 0 && bcw.getStoredAnonymousId().length > 0;
        };
        bcw.reconnect = function(responseHandler) {
          bcw._initializeIdentity(true);
          bcw.brainCloudClient.authentication.authenticateAnonymous(
            false,
            function(result2) {
              bcw._authResponseHandler(responseHandler, result2);
            }
          );
        };
        bcw.enableAutoReconnect = function(autoReconnectEnabled) {
          bcw.brainCloudClient.brainCloudManager._autoReconnectEnabled = autoReconnectEnabled;
        };
        bcw.resetUniversalIdPassword = function(universalId, responseHandler) {
          bcw.brainCloudClient.authentication.resetUniversalIdPassword(
            universalId,
            responseHandler
          );
        };
        bcw.resetUniversalIdPasswordAdvanced = function(universalId, serviceParams, responseHandler) {
          bcw.brainCloudClient.authentication.resetUniversalIdPasswordAdvanced(
            universalId,
            serviceParams,
            responseHandler
          );
        };
        bcw.resetUniversalIdPasswordWithExpiry = function(universalId, tokenTtlInMinutes, responseHandler) {
          bcw.brainCloudClient.authentication.resetUniversalIdPasswordWithExpiry(
            universalId,
            tokenTtlInMinutes,
            responseHandler
          );
        };
        bcw.resetUniversalIdPasswordAdvancedWithExpiry = function(universalId, serviceParams, tokenTtlInMinutes, responseHandler) {
          bcw.brainCloudClient.authentication.resetUniversalIdPasswordAdvancedWithExpiry(
            universalId,
            serviceParams,
            tokenTtlInMinutes,
            responseHandler
          );
        };
        bcw.restoreSession = function(callback) {
          var sessionId = bcw.getStoredSessionId();
          console.log("Attempting to restore session with id: " + sessionId);
          var profileId = bcw.getStoredProfileId();
          var anonymousId = bcw.getStoredAnonymousId();
          bcw.brainCloudClient.initializeIdentity(profileId, anonymousId);
          bcw.brainCloudClient.brainCloudManager._isAuthenticated = true;
          bcw.brainCloudClient.brainCloudManager._packetId = localStorage.getItem("lastPacketId");
          bcw.brainCloudClient.brainCloudManager.setSessionId(sessionId);
          bcw.brainCloudClient.time.readServerTime(function(result2) {
            if (result2.status === 200) {
              bcw.brainCloudClient.playerState.readUserState(callback);
            } else {
              callback(result2);
            }
          });
        };
        bcw.logout = function(forgetUser, responseHandler) {
          if (forgetUser) {
            bcw.resetStoredProfileId();
          }
          bcw.brainCloudClient.playerState.logout(responseHandler);
        };
        bcw.logoutOnApplicationClose = function(forgetUser) {
          if (forgetUser) {
            bcw.resetStoredProfileId();
          }
          var messages = JSON.stringify({
            messages: [
              {
                service: bcw.brainCloudClient.SERVICE_PLAYERSTATE,
                operation: bcw.brainCloudClient.playerState.OPERATION_LOGOUT
              }
            ],
            gameId: bcw.brainCloudClient.brainCloudManager._appId,
            sessionId: bcw.brainCloudClient.brainCloudManager._sessionId,
            packetId: bcw.brainCloudClient.brainCloudManager._packetId++
          });
          var sig = CryptoJS.MD5(
            messages + bcw.brainCloudClient.brainCloudManager._secret
          );
          bcw.brainCloudClient.brainCloudManager._packetId++;
          fetch(bcw.brainCloudClient.brainCloudManager._dispatcherUrl, {
            method: "POST",
            keepalive: true,
            headers: {
              "Content-Type": "application/json",
              "X-APPID": bcw.brainCloudClient.brainCloudManager._appId,
              "X-SIG": sig
            },
            body: messages
          });
        };
        bcw.runScriptAndLogoutOnApplicationClose = function(forgetUser, scriptName, jsonString) {
          if (forgetUser) {
            bcw.resetStoredProfileId();
          }
          var messages = JSON.stringify({
            messages: [
              {
                service: bcw.brainCloudClient.SERVICE_SCRIPT,
                operation: bcw.brainCloudClient.script.OPERATION_RUN,
                data: {
                  scriptName,
                  scriptData: jsonString
                }
              },
              {
                service: bcw.brainCloudClient.SERVICE_PLAYERSTATE,
                operation: bcw.brainCloudClient.playerState.OPERATION_LOGOUT
              }
            ],
            gameId: bcw.brainCloudClient.brainCloudManager._appId,
            sessionId: bcw.brainCloudClient.brainCloudManager._sessionId,
            packetId: bcw.brainCloudClient.brainCloudManager._packetId++
          });
          var sig = CryptoJS.MD5(
            messages + bcw.brainCloudClient.brainCloudManager._secret
          );
          bcw.brainCloudClient.brainCloudManager._packetId++;
          fetch(bcw.brainCloudClient.brainCloudManager._dispatcherUrl, {
            method: "POST",
            keepalive: true,
            headers: {
              "Content-Type": "application/json",
              "X-APPID": bcw.brainCloudClient.brainCloudManager._appId,
              "X-SIG": sig
            },
            body: messages
          });
        };
      }
      BrainCloudWrapper.apply(
        window.brainCloudWrapper = window.brainCloudWrapper || {}
      );
      exports.BrainCloudWrapper = BrainCloudWrapper;
      exports.BrainCloudClient = BrainCloudClient;
    }
  });
  return require_brainCloudClient_concat();
})();
/*! Bundled license information:

crypto-js/ripemd160.js:
  (** @preserve
  	(c) 2012 by Cédric Mesnil. All rights reserved.
  
  	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
  
  	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
  	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
  
  	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  	*)

crypto-js/mode-ctr-gladman.js:
  (** @preserve
   * Counter block mode compatible with  Dr Brian Gladman fileenc.c
   * derived from CryptoJS.mode.CTR
   * Jan Hruby jhruby.web@gmail.com
   *)

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
if(typeof window!=="undefined"){window.BrainCloudWrapper=brainCloud.BrainCloudWrapper;window.BrainCloudClient=brainCloud.BrainCloudClient;}
