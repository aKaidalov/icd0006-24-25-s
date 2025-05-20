import {BaseEntityService} from "./BaseEntityService.ts";
import type {IGpsLocation} from "../domain/IGpsLocation.ts";
import {BaseService} from "./BaseService.ts";
import type {IResultObject} from "../types/IResultObject.ts";

export class GpsLocationService extends BaseEntityService<IGpsLocation> {

    constructor() {
        super('GpsLocations');
    }

    async getLocationsBySessionId(gpsSessionId: string): Promise<IResultObject<IGpsLocation[]>> {
        try {
            const response = await BaseService.axios.get<IGpsLocation[]>(
                `GpsLocations/Session/${gpsSessionId}`
            );

            if (response.status <= 300) {
                return { data: response.data };
            }

            return {
                errors: [`${response.status} ${response.statusText}`],
            };
        } catch (error: any) {
            return {
                errors: [error.response?.data?.errors || 'Unknown error'],
            };
        }
    }

    async addBulkLocationsAsync(locations: Partial<IGpsLocation>[], sessionId: string): Promise<IResultObject<any>> {
        try {
            const jwt = super.getStore().jwt
            let options = {};
            if (jwt) {
                options = {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    }
                }
            }

            const response = await BaseService.axios.post(`/GpsLocations/bulk/${sessionId}`, locations, options);

            if (response.status <= 300) {
                return { data: response.data };
            }

            return {
                errors: [`${response.status} ${response.statusText}`],
            };
        } catch (error: any) {
            return {
                errors: [error.response?.data?.errors || 'Unknown error'],
            };
        }
    }


}
