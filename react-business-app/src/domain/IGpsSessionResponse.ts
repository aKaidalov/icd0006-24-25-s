import {IDomainId} from "@/domain/IDomainId";

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

export interface IGpsSessionResponse extends IDomainId{
    name: string;
    description: string;
    recordedAt: string; // ISO date string (e.g. "2025-05-22T20:46:06.606Z")
    duration: number;
    speed: number;
    distance: number;
    climb: number;
    descent: number;
    paceMin: number;
    paceMax: number;
    gpsSessionTypeId: string;
    appUserId: string;
}
