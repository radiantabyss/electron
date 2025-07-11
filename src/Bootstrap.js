import Request from './Request.js';
import Response from './Response.js';
import Invoked from './Invoked.js';
import Validator from './Validator.js';

import Helpers from './Support/Helpers.js';
import Item from './Support/Item.js';
import Items from './Support/Items.js';
import Str from './Support/Str.js';

export default () => {
    //helpers
    for ( let key in Helpers ) {
        global[key] = Helpers[key];
    }

    global.Item = Item;
    global.Items = Items;
    global.Str = Str;

    global.Request = Request;
    global.Response = Response;
    global.Invoked = Invoked;
    global.Validator = Validator;
};
