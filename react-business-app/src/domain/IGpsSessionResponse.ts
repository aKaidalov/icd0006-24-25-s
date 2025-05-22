import {IDomainId} from "@/domain/IDomainId";

export interface IGpsSessionCreateResponse extends IDomainId{
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
