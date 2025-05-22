export interface IGpsSessionCreateRequest {
    name: string;
    description: string;
    recordedAt: string;
    paceMin: number;
    paceMax: number;
    gpsSessionTypeId: string;
}
