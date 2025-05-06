import type {IGpsLocationType} from "../domain/IGpsLocationType.ts";
import type {IResultObject} from "../types/IResultObject.ts";
import {BaseService} from "./BaseService.ts";

export abstract class GpsLocationTypeService extends BaseService{

    static async getAllAsync(): Promise<IResultObject<IGpsLocationType[]>> {
        const url = "/GpsLocationTypes";
        try {
            const response = await this.axios.get<IGpsLocationType[]>(url);

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

}
