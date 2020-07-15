interface RegistrationCommunity {
    id: string;
    community: string;
    state: {
        shortCut?: string;
        name: string;
    };
}
export declare class PlateNumber {
    static parse(str: string | null): PlateNumber | undefined;
    registrationCommunity: RegistrationCommunity;
    alphanumeric: string;
    numeric: number;
    suffix: string;
    constructor(registrationCommunity: RegistrationCommunity, alphanumeric: string, numeric: number, isElectricVehicle: boolean);
    toString(): string;
}
export {};
