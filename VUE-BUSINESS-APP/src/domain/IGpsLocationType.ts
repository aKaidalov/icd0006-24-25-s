import type {IDomainId} from "./IDomainId.ts";

export interface IGpsLocationType extends IDomainId{
    name: string;
    description: string;
}
