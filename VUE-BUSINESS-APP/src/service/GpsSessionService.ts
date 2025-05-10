import {BaseEntityService} from "./BaseEntityService.ts";
import type {IGpsSession} from "../domain/IGpsSession.ts";
// import {useUserDataStore} from "../stores/userDataStore.ts";
// import type {IResultObject} from "../types/IResultObject.ts";
// import {BaseService} from "./BaseService.ts";
// import type {IGpsSessionRequest} from "../domain/IGpsSessionRequest.ts";

export class GpsSessionService extends BaseEntityService<IGpsSession> {

    // private store = useUserDataStore();

    constructor() {
        super('GpsSessions');
    }

    // //name: string, description: string, gpsSessionTypeId: string
    // async addAsync(entity: IGpsSessionRequest): Promise<IResultObject<IGpsSession>> {
    //     try {
    //         let options = {};
    //         if (this.store.jwt) {
    //             options = {
    //                 headers: {
    //                     Authorization: `Bearer ${this.store.jwt}`,
    //                 }
    //             }
    //         }
    //
    //         console.log('sending request:', JSON.stringify(entity));
    //
    //         const response = await BaseService.axios.post<IGpsSession>('GpsSessions', entity, options);
    //
    //         console.log('post response', response);
    //
    //         if (response.status <= 300) {
    //             return {data: response.data};
    //         }
    //         return {
    //             errors: [(response.status.toString() + " " + response.statusText).trim()],
    //         };
    //     } catch (error: any) {
    //         console.log('error: ', error.response?.data);
    //
    //         return {
    //             errors: [error.response?.data?.errors || 'Unknown error']
    //         };
    //     }
    // }
}
