export interface IGpsSessionCreateRequest {
    name: string;
    description: string;
    gpsSessionTypeId: string;
    recordedAt: string;
    paceMin: number;
    paceMax: number;
}
