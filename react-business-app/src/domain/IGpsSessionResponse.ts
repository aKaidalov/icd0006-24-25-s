import {IDomainId} from "@/domain/IDomainId";

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

export interface IGpsSession extends IBaseGpsSession {
    gpsSessionType: string;
    gpsLocationsCount: number;
    userFirstLastName: string;
}

export interface IGpsSessionResponse extends IBaseGpsSession{
    gpsSessionTypeId: string;
    appUserId: string;
}
