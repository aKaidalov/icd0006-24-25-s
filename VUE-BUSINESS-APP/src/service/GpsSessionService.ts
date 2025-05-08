import {BaseEntityService} from "./BaseEntityService.ts";
import type {IGpsSession} from "../domain/IGpsSession.ts";

export class GpsSessionService extends BaseEntityService<IGpsSession> {
    constructor() {
        super('GpsSessions');
    }
}
