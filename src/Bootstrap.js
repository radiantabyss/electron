import Helpers from './Support/Helpers.js';
import Str from './Support/Str.js';
import Model from './Model.js';
import Request from './Request.js';
import Response from './Response.js';

export default async () => {
    //helpers
    for ( let key in Helpers ) {
        global[key] = Helpers[key];
    }

    global.Str = Str;
    global.Model = await Model();
    global.Request = Request;
    global.Response = Response;
};
