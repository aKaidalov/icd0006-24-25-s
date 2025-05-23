import {BaseEntityService} from "./BaseEntityService.ts";
import type {
    IGpsSession,
    IGpsSessionResponse,
    IGpsSessionUpdateRequest
} from "../domain/IGpsSession.ts";
import type {IResultObject} from "../types/IResultObject.ts";
import {BaseService} from "./BaseService.ts";
import type {IGpsSessionRequest} from "../domain/IGpsSessionRequest.ts";

export class GpsSessionService extends BaseEntityService<IGpsSession> {

    constructor() {
        super('GpsSessions');
    }

    //GpsSession -> name: string, description: string, gpsSessionTypeId: string
    async addSessionAsync(entity: IGpsSessionRequest): Promise<IResultObject<IGpsSessionResponse>> {
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
            const response = await BaseService.axios.post<IGpsSessionResponse>(this.basePath, entity, options);

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

    async updateSessionAsync(id: string, entity: IGpsSessionUpdateRequest) {
        const url = `${this.basePath}/${id}`;
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
            const response = await BaseService.axios.put(url, entity, options);

            console.log('update response', response);

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
