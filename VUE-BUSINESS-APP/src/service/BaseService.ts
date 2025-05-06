import axios from "axios";

export abstract class BaseService {
    protected static axios = axios.create({
        baseURL: 'https://sportmap.akaver.com/api/v1.0/',
        headers: {
            common: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        },
    })
}
