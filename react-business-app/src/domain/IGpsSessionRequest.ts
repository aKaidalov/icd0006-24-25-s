import {IDomainId} from "@/domain/IDomainId";

export interface IGpsSessionCreateRequest extends IDomainId{
    name: string;
    description: string;
    recordedAt: string;
    paceMin: number;
    paceMax: number;
    gpsSessionTypeId: string;
}
