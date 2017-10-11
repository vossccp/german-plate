'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var plateNumbers = require('./kennzeichen');

var isLetter = function isLetter(character) {
  return character.toLowerCase() !== character.toUpperCase();
};

var isDigit = function isDigit(character) {
  return Boolean(character.trim()) && character * 0 === 0;
};

var alternativePrefixes = {
  AOE: 'AÖ',
  BOE: 'BÖ',
  BUED: 'BÜD',
  BUER: 'BÜR',
  BUES: 'BÜS',
  BUEZ: 'BÜZ',
  DUEW: 'DÜW',
  FLOE: 'FLÖ',
  FUE: 'FÜ',
  FUES: 'FÜS',
  GOE: 'GÖ',
  GUE: 'GÜ',
  HMUE: 'HMÜ',
  HOES: 'HÖS',
  HUEN: 'HÜN',
  JUEL: 'JÜL',
  KOEN: 'KÖN',
  KOET: 'KÖT',
  KOEZ: 'KÖZ',
  KUEN: 'KÜN',
  LOE: 'LÖ',
  LOEB: 'LÖB',
  LUED: 'LÜD',
  LUEN: 'LÜN',
  MUE: 'MÜ',
  MUEB: 'MÜB',
  MUEL: 'MÜL',
  MUEN: 'MÜN',
  MUER: 'MÜR',
  NOE: 'NÖ',
  NRUE: 'NRÜ',
  OEHR: 'ÖHR',
  PLOE: 'PLÖ',
  PRUE: 'PRÜ',
  RUED: 'RÜD',
  RUEG: 'RÜG',
  RUES: 'RÜS',
  SAEK: 'SÄG',
  SLUE: 'SLÜ',
  SOEM: 'SÖM',
  SUEW: 'SÜW',
  TOEL: 'TÖL',
  TOEN: 'TÖN',
  TUE: 'TÜ',
  UEB: 'ÜB',
  WUE: 'WÜ',
  WUEM: 'WÜM'
};

var PlateNumber = function () {
  function PlateNumber(registrationCommunity, alphanumeric, numeric, isElectricVehicle) {
    _classCallCheck(this, PlateNumber);

    this.registrationCommunity = registrationCommunity;
    this.alphanumeric = alphanumeric;
    this.numeric = numeric;
    this.suffix = isElectricVehicle ? 'E' : '';
  }

  _createClass(PlateNumber, [{
    key: 'toString',
    value: function toString() {
      return this.registrationCommunity.id + '-' + this.alphanumeric + ' ' + this.numeric + this.suffix;
    }
  }]);

  return PlateNumber;
}();

PlateNumber.parse = function (str) {
  if (arguments.length === 0) {
    throw new Error('Arguments missing');
  }

  if (str === undefined || str === null) {
    return undefined;
  }

  var parseString = str.trim().toUpperCase();
  var isElectricVehicle = false;

  if (parseString.endsWith('E')) {
    isElectricVehicle = true;
    parseString = parseString.substring(0, parseString.length - 1).trim();
  }

  var community = '';
  var alphanumeric = '';
  var numeric = '';

  var j = 0;

  for (var i = 0; i < parseString.length; i++) {
    if (j === 0) {
      switch (parseString[i]) {
        case ' ':
        case '-':
        case '.':
          j += 1;
          continue;
        default:
          community += parseString[i];
          continue;
      }
    }

    if (j === 1) {
      if (isLetter(parseString[i])) {
        alphanumeric += parseString[i];
      } else {
        if (!alphanumeric) {
          continue;
        }
        j = 2;
      }
    }
    if (j === 2) {
      if (isDigit(parseString[i])) {
        numeric += parseString[i];
      } else {
        switch (parseString[i]) {
          case ' ':
          case '-':
          case '.':
            continue;
          default:
            throw new Error('Invalid plate number');
        }
      }
    }
  }

  var numericValue = parseInt(numeric, 0);

  if (alphanumeric === '') {
    throw new Error('Invalid plate number');
  }

  if (isNaN(numericValue)) {
    throw new Error('Invalid plate number');
  }

  if (numericValue > 9999) {
    throw new Error('Invalid plate number');
  }

  if (alternativePrefixes[community]) {
    community = alternativePrefixes[community];
  }

  var registrationCommunity = plateNumbers[community];

  if (!registrationCommunity) {
    throw new Error('Unknown registration communitity ' + community);
  }

  return new PlateNumber(registrationCommunity, alphanumeric, numericValue, isElectricVehicle);
};

module.exports = PlateNumber;