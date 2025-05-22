import {BaseService} from "@/service/BaseService";
import {IResultObject} from "@/types/IResultObject";
import {ILoginDto} from "@/types/ILoginDto";

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

    static async register(
        email: string,
        password: string,
        firstName: string,
        lastName: string
    ): Promise<IResultObject<ILoginDto>> {
        const url = '/Account/Register';
        try {
            const registerData = {
                email,
                password,
                firstName,
                lastName
            }

            const response = await this.axios.post<ILoginDto>(url, registerData);

            console.log('register response', response);

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
