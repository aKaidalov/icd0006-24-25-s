import {BaseEntityService} from "./BaseEntityService.ts";
import type {IGpsSessionType} from "../domain/IGpsSessionType.ts";

export class GpsSessionTypeService extends BaseEntityService<IGpsSessionType>{
    constructor() {
        super('GpsSessionTypes');
    }
}
