"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const kennzeichen_1 = __importDefault(require("./kennzeichen"));
const isLetter = function (character) {
    return character.toLowerCase() !== character.toUpperCase();
};
const isDigit = function (character) {
    return Boolean(character.trim()) && character.charCodeAt(0) * 0 === 0;
};
const alternativePrefixes = {
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
class PlateNumber {
    constructor(registrationCommunity, alphanumeric, numeric, isElectricVehicle) {
        this.registrationCommunity = registrationCommunity;
        this.alphanumeric = alphanumeric;
        this.numeric = numeric;
        this.suffix = isElectricVehicle ? 'E' : '';
    }
    static parse(str) {
        if (arguments.length === 0) {
            throw new Error('Arguments missing');
        }
        if (str === undefined || str === null) {
            return undefined;
        }
        let parseString = str.trim().toUpperCase();
        let isElectricVehicle = false;
        if (parseString.endsWith('E')) {
            isElectricVehicle = true;
            parseString = parseString.substring(0, parseString.length - 1).trim();
        }
        let community = '';
        let alphanumeric = '';
        let numeric = '';
        let j = 0;
        for (let i = 0; i < parseString.length; i++) {
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
                switch (parseString[i]) {
                    case ' ':
                    case '-':
                    case '.':
                        continue;
                }
                if (isLetter(parseString[i])) {
                    j = 2;
                } else if (isDigit(parseString[i])) {
                    j = 4;
                }
            }
            if (j === 2) {

                if (isLetter(parseString[i])) {
                    alphanumeric += parseString[i];
                    continue;
                }
                j = 3;
            }
            if (j === 3) {
                switch (parseString[i]) {
                    case ' ':
                    case '-':
                    case '.':
                        continue;
                }
                if (isDigit(parseString[i])) {
                    j = 4;
                }
            }
            if (j === 4) {
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
        const numericValue = parseInt(numeric, 0);
        if (isNaN(numericValue)) {
            throw new Error('Invalid plate number');
        }
        if (!alphanumeric || alphanumeric === '') {
            if (numericValue > 999999) {
                throw new Error('Invalid plate number');
            }
        } else {
            if (numericValue > 9999) {
                throw new Error('Invalid plate number');
            }
        }
        if (alternativePrefixes[community]) {
            community = alternativePrefixes[community];
        }
        let registrationCommunity = kennzeichen_1.default[community];
        if (!registrationCommunity) {
            registrationCommunity = {
                id: community,
                community,
                state: {
                    shortCut: 'XX',
                    name: 'Unbekannt'
                }
            };
        }
        return new PlateNumber(registrationCommunity, alphanumeric, numericValue, isElectricVehicle);
    }
    toString() {
        if(this.alphanumeric){
            return `${this.registrationCommunity.id}-${this.alphanumeric} ${this.numeric}${this.suffix}`;
        }
        else{
            return `${this.registrationCommunity.id}-${this.numeric}${this.suffix}`;
        }
    }
}
