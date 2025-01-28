let group_middleware = null;

function addRoute(method, path, action, middleware, name, throw_error) {
    if ( !action ) {
        throw `Action missing for ${path}`;
    }

    //get action
    action = action.replace(/\\/g, '.').replace(/\//g, '.');
    let split = action.split('.');
    let namespace = split.slice(0, -1);
    let action_name = name || split[split.length - 1];
    let domain = namespace.length ? Str.slug(namespace[0]) : '';

    if ( namespace.length ) {
        action_name = namespace.join('/') + '/' + action_name;
    }

    let component;
    try {
        component = getAction(Actions, split[split.length - 1], namespace, action_name);
    }
    catch(e) {
        if ( throw_error ) {
            throw `Action ${action_name} doesn't exist.`;
        }
        return;
    }

    RouteFiles[__electron_route_file].push({
        name: action_name,
        component,
        method,
        path,
        meta: {
            domain,
            middleware,
            settings: component.settings ? component.settings : {},
        },
    });
}

function getAction(Actions, name, namespace, action_name) {
    if ( !namespace.length ) {
        let action = Actions[name];

        action.name = action_name.replace(/\\/g, '.');
        return action;
    }

    let first = namespace[0];
    namespace.shift();

    return getAction(Actions[first], name, namespace, action_name);
}

let self = {
    get(path, action, middleware = [], name = '', throw_error = true) {
        if ( group_middleware ) {
            middleware = middleware.concat(group_middleware);
        }

        addRoute('GET', path, action, middleware, name, throw_error);
    },

    post(path, action, middleware = [], name = '', throw_error = true) {
        if ( group_middleware ) {
            middleware = middleware.concat(group_middleware);
        }

        addRoute('POST', path, action, middleware, name, throw_error);
    },

    group(middleware, callback) {
        group_middleware = middleware;
        callback();
        group_middleware = null;
    },
}

export default self;
