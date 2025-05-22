import {BaseEntityService} from "./BaseEntityService";
import type {IGpsSession} from "@/domain/IGpsSession";
import {IGpsSessionCreateRequest} from "@/domain/IGpsSessionRequest";
import {IResultObject} from "@/types/IResultObject";
import {IGpsSessionCreateResponse} from "@/domain/IGpsSessionResponse";
import {BaseService} from "@/service/BaseService";

export class GpsSessionService extends BaseEntityService<IGpsSession> {

    constructor() {
        super('GpsSessions');
    }

    //GpsSession -> name: string, description: string, gpsSessionTypeId: string
    async addAsync(entity: IGpsSessionCreateRequest): Promise<IResultObject<IGpsSessionCreateResponse>> {
        try {
            const jwt = this.getStore().jwt
            let options = {};
            if (jwt) {
                options = {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    }
                }
            }
            const response = await BaseService.axios.post<IGpsSessionCreateResponse>(this.basePath, entity, options);

            console.log('post response', response);

            if (response.status <= 300) {
                return {data: response.data};
            }
            return {
                errors: [(response.status.toString() + " " + response.statusText).trim()],
            };
        } catch (error: any) {
            console.log('error: ', error.response?.data);
            return {
                errors: [error.response?.data?.errors || 'Unknown error -> view logs']
            };
        }
    }
}
