import type {IResultObject} from "../types/IResultObject.ts";
import {BaseService} from "./BaseService";
import {useUserDataStore} from "../stores/userDataStore.ts";

export abstract class BaseEntityService<TEntity> extends BaseService {

    private store = useUserDataStore();

    protected constructor(private basePath: string) {
        super();
    }

     async getAllAsync(): Promise<IResultObject<TEntity>> {
         try {
            const response = await BaseService.axios.get<TEntity>(this.basePath);

            console.log('getAll response', response);

            if (response.status <= 300) {
                return {data: response.data};
            }
            return {
                errors: [(response.status.toString() + " " + response.statusText).trim()],
            };
        } catch (error) {
            console.log('error: ', (error as Error).message);
            return {
                errors: [JSON.stringify(error)],
            };
        }
    }

    //GpsSession -> name: string, description: string, gpsSessionTypeId: string
    async addAsync(entity: TEntity): Promise<IResultObject<TEntity>> {
        try {
            let options = {};
            if (this.store.jwt) {
                options = {
                    headers: {
                        Authorization: `Bearer ${this.store.jwt}`,
                    }
                }
            }
            const response = await BaseService.axios.post<TEntity>(this.basePath, entity, options);

            console.log('post response', response);

            if (response.status <= 300) {
                return {data: response.data};
            }
            return {
                errors: [(response.status.toString() + " " + response.statusText).trim()],
            };
        } catch (error) {
            console.log('error: ', (error as Error).message);
            return {
                errors: [JSON.stringify(error)],
            };
        }
    }
}
