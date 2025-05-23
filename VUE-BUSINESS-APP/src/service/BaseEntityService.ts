import type {IResultObject} from "../types/IResultObject.ts";
import {BaseService} from "./BaseService";
import {useUserDataStore} from "../stores/userDataStore.ts";

export abstract class BaseEntityService<TEntity> extends BaseService {

    private store = useUserDataStore();

    getStore() {
        return this.store;
    }

    protected constructor(private basePath: string) {
        super();
    }

     async getAllAsync(): Promise<IResultObject<TEntity[]>> {
         try {
            const response = await BaseService.axios.get<TEntity[]>(this.basePath);

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

    async getFilteredAsync(params: any): Promise<IResultObject<TEntity[]>> {
        try {
            const response = await BaseService.axios.get<TEntity[]>(this.basePath, { params });
            if (response.status <= 300) {
                return { data: response.data };
            }
            return {
                errors: [`${response.status} ${response.statusText}`],
            };
        } catch (error: any) {
            return {
                errors: [error.response?.data?.errors || 'Unknown error']
            };
        }
    }


    async getByIdAsync(id: string): Promise<IResultObject<TEntity>> {
        const url = `${this.basePath}/${id}`;
        try {
            const response = await BaseService.axios.get<TEntity>(url);

            console.log('getById response', response);

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
        } catch (error: any) {
            console.log('error: ', error.response?.data);
            return {
                errors: [error.response?.data?.errors || 'Unknown error -> view logs']
            };
        }
    }

    async updateAsync(id: string, entity: TEntity): Promise<IResultObject<TEntity>> {
        const url = `${this.basePath}/${id}`;
        try {
            let options = {};
            if (this.store.jwt) {
                options = {
                    headers: {
                        Authorization: `Bearer ${this.store.jwt}`,
                    }
                }
            }
            const response = await BaseService.axios.put<TEntity>(url, entity, options);

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

    async deleteAsync(id: string): Promise<IResultObject<TEntity>> {
        const url = `${this.basePath}/${id}`;
        try {
            let options = {};
            if (this.store.jwt) {
                options = {
                    headers: {
                        Authorization: `Bearer ${this.store.jwt}`,
                    }
                }
            }
            const response = await BaseService.axios.delete<TEntity>(url, options);

            console.log('delete response', response);

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

    //TODO: should be found better solution!
    async addLocationAsync(entity: TEntity, sessionId: string): Promise<IResultObject<TEntity>> {
        const url = `${this.basePath}/${sessionId}`;
        try {
            let options = {};
            if (this.store.jwt) {
                options = {
                    headers: {
                        Authorization: `Bearer ${this.store.jwt}`,
                    }
                }
            }
            const response = await BaseService.axios.post<TEntity>(url, entity, options);

            console.log('post Location response', response);

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
