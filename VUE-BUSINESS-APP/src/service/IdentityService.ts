import {BaseService} from "./BaseService.ts";
import type {IResultObject} from "../types/IResultObject.ts";
import type {ILoginDto} from "../types/ILoginDto.ts";

export abstract class IdentityService extends BaseService{

    static async login(email: string, password: string): Promise<IResultObject<ILoginDto>> {
        const url = '/Account/Login';
        try {
            const loginData = {
                email,
                password,
            }

            const response = await this.axios.post<ILoginDto>(url, loginData);

            console.log('login response', response);

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
