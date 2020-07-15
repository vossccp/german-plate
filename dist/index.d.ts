interface RegistrationCommunity {
    id: string;
    community: string;
    state: {
        shortCut?: string;
        name: string;
    };
}

export default class PlateNumber {
    static parse(str: string | null): PlateNumber;

    registrationCommunity: RegistrationCommunity;
    alphanumeric: string;
    numeric: number;
    suffix: string;

    constructor(registrationCommunity: RegistrationCommunity, alphanumeric: string, numeric: number, isElectricVehicle: boolean);

    toString(): string;
}
