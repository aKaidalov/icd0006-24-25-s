import type { IDomainId } from "./IDomainId.ts";

export interface IGpsLocation extends IDomainId {
    recordedAt: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number;
    verticalAccuracy: number;
    appUserId: string;
    gpsSessionId: string;
    gpsLocationTypeId: string;
}
