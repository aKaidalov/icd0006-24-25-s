import type {IDomainId} from "./IDomainId.ts";

export interface IGpsSession extends IDomainId {
    name: string;
    description: string;
    recordedAt: string;
    duration: number;
    speed: number;
    distance: number;
    climb: number;
    descent: number;
    paceMin: number;
    paceMax: number;
    gpsSessionType: string;
    gpsLocationsCount: number;
    userFirstLastName: string;
}

export interface IBaseGpsSession extends IDomainId {
    name: string;
    description: string;
    recordedAt: string;
    duration: number;
    speed: number;
    distance: number;
    climb: number;
    descent: number;
    paceMin: number;
    paceMax: number;
}

export interface IGpsSessionCreateRequest extends IBaseGpsSession {
    gpsSessionType: string;
    gpsLocationsCount: number;
    userFirstLastName: string;
}

export interface IGpsSessionUpdateRequest {
    id: string;
    name: string;
    description: string;
    recordedAt: string;
    paceMin: number;
    paceMax: number;
    gpsSessionTypeId: string;
}


//
// export interface IGpsSessionRequest {
//     name: string;
//     description: string;
//     gpsSessionTypeId: string;
//     recordedAt: string;
//     paceMin: number;
//     paceMax: number;
// }

export interface IGpsSessionResponse extends IBaseGpsSession{
    gpsSessionTypeId: string;
    appUserId: string;
}
