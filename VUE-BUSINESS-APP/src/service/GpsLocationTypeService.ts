import axios from "axios";
import type {IGpsLocationType} from "../domain/IGpsLocationType.ts";
import type {IResultObject} from "../types/IResultObject.ts";

export abstract class GpsLocationTypeService {
    protected static axios = axios.create({
        baseURL: 'https://sportmap.akaver.com/api/v1.0/GpsLocationTypes',
        headers: {
            common: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
    })

    static async getAllAsync(): Promise<IResultObject<IGpsLocationType[]>> {
        const url = "";
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
