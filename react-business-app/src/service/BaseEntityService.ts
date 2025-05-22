import type {IResultObject} from "@/types/IResultObject";
import {BaseService} from "./BaseService";
import {useBaseContext} from "@/context/BaseContext";

export abstract class BaseEntityService<TEntity> extends BaseService {

    private store = useBaseContext();

    getStore() {
        return this.store;
    }

    protected constructor(protected basePath: string) {
        super();
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
}
