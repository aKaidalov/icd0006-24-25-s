import {BaseEntityService} from "./BaseEntityService";
import type {IGpsSession} from "@/domain/IGpsSession";

export class GpsSessionService extends BaseEntityService<IGpsSession> {

    constructor() {
        super('GpsSessions');
    }
}
