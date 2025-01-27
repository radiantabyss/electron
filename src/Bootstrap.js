import Helpers from './Support/Helpers.js';
import Str from './Support/Str.js';
import Request from './Request.js';
import Response from './Response.js';
import Validator from './Validator.js';

export default async () => {
    //helpers
    for ( let key in Helpers ) {
        global[key] = Helpers[key];
    }

    global.Str = Str;
    global.Request = Request;
    global.Response = Response;
    global.Validator = Validator;
};
