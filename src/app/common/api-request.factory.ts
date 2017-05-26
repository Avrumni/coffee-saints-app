import {CALL_API} from 'redux-api-middleware';

export namespace ApiRequestFactory {
    export function get(types: Array<string>, endpoint: string) {
        return {
            [CALL_API]: {
                types,
                endpoint,
                method: 'GET'
            }
        }
    }

    export function put(types: Array<string>, endpoint: string, body?: Object) {
        let bodyContent = bodyTest(body);

        return {
            [CALL_API]: {
                types,
                endpoint,
                method: 'PUT',
                headers: {'Content-Type': bodyContent.contentType},
                body: bodyContent.body
            }
        }
    }

    export function post(types: Array<string>, endpoint: string, body?: Object) {
        let bodyContent = bodyTest(body);

        return {
            [CALL_API]: {
                types,
                endpoint,
                method: 'POST',
                headers: {'Content-Type': bodyContent.contentType},
                body: bodyContent.body
            }
        }
    }

    function bodyTest(rawBody: any){
        let contentType = 'application/json';
        let body;

        if (rawBody !== undefined) {
            body = JSON.stringify(rawBody);
        }

        return {
            contentType,
            body
        }
    }
}