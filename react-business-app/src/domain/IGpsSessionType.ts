import type {IDomainId} from "./IDomainId.ts";

export interface IGpsSessionType extends IDomainId{
    name: string;
    description: string;
    paceMin: number;
    paceMax: number;
}
