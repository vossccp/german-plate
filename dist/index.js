"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var kennzeichen_json_1 = __importDefault(require("./kennzeichen.json"));
var isLetter = function (character) {
    return character.toLowerCase() !== character.toUpperCase();
};
var isDigit = function (character) {
    return Boolean(character.trim()) && character.charCodeAt(0) * 0 === 0;
};
var endsWith = function (str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
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
var PlateNumber = /** @class */ (function () {
    function PlateNumber(registrationCommunity, alphanumeric, numeric, isElectricVehicle) {
        this.registrationCommunity = registrationCommunity;
        this.alphanumeric = alphanumeric;
        this.numeric = numeric;
        this.suffix = isElectricVehicle ? 'E' : '';
    }
    PlateNumber.parse = function (str) {
        if (arguments.length === 0) {
            throw new Error('Arguments missing');
        }
        if (str === undefined || str === null) {
            throw new Error('Arguments must be defined');
        }
        var parseString = str.trim().toUpperCase();
        var isElectricVehicle = false;
        if (endsWith(parseString, 'E')) {
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
                }
                else {
                    if (!alphanumeric) {
                        continue;
                    }
                    j = 2;
                }
            }
            if (j === 2) {
                if (isDigit(parseString[i])) {
                    numeric += parseString[i];
                }
                else {
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
        // @ts-ignore
        var registrationCommunity = kennzeichen_json_1.default[community];
        if (!registrationCommunity) {
            registrationCommunity = {
                id: community,
                community: community,
                state: {
                    shortCut: 'XX',
                    name: 'Unbekannt'
                }
            };
        }
        return new PlateNumber(registrationCommunity, alphanumeric, numericValue, isElectricVehicle);
    };
    PlateNumber.prototype.toString = function () {
        return this.registrationCommunity.id + "-" + this.alphanumeric + " " + this.numeric + this.suffix;
    };
    return PlateNumber;
}());
exports.PlateNumber = PlateNumber;
// For CommonJS default export support
module.exports = PlateNumber;
module.exports.default = PlateNumber;
