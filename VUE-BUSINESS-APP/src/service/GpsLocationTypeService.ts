import type {IGpsLocationType} from "../domain/IGpsLocationType.ts";
import {BaseEntityService} from "./BaseEntityService.ts";

export class GpsLocationTypeService extends BaseEntityService<IGpsLocationType>{
    constructor() {
        super('GpsLocationTypes');
    }
}
