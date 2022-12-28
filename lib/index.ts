import plateNumbers from "./kennzeichen.json";

const isLetter = function (character: string) {
    return character.toLowerCase() !== character.toUpperCase();
};

const isDigit = function (character: string) {
    return Boolean(character.trim()) && character.charCodeAt(0) * 0 === 0;
};

const endsWith = function (str: string, suffix: string) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

interface RegistrationCommunity {
    id: string
    community: string
    state: {
        shortCut?: string
        name: string
    }
}

const alternativePrefixes: { [key: string]: string } = {
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

export class PlateNumber {

    static parse(str: string | null) {
        if (arguments.length === 0) {
            throw new Error('Arguments missing');
        }

        if (str === undefined || str === null) {
            throw new Error('Arguments must be defined');
        }

        let parseString = str.trim().toUpperCase();
        let isElectricVehicle = false;

        if (endsWith(parseString, 'E')) {
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

        // @ts-ignore
        let registrationCommunity: RegistrationCommunity = plateNumbers[community];
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

        return new PlateNumber(
            registrationCommunity,
            alphanumeric,
            numericValue,
            isElectricVehicle
        );
    }

    registrationCommunity: RegistrationCommunity
    alphanumeric: string
    numeric: number
    suffix: string

    constructor(registrationCommunity: RegistrationCommunity, alphanumeric: string, numeric: number, isElectricVehicle: boolean) {
        this.registrationCommunity = registrationCommunity;
        this.alphanumeric = alphanumeric;
        this.numeric = numeric;
        this.suffix = isElectricVehicle ? 'E' : '';
    }

    toString() {
        if (this.alphanumeric) {
            return `${this.registrationCommunity.id}-${this.alphanumeric} ${this.numeric}${this.suffix}`;
        } else {
            return `${this.registrationCommunity.id}-${this.numeric}${this.suffix}`;
        }
    }
}

// For CommonJS default export support
module.exports = PlateNumber;
module.exports.default = PlateNumber;

