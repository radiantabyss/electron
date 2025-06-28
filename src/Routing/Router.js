import path from 'path';
import { app, ipcMain } from 'electron';

import Actions from './Actions.js';
import Middleware from './Middleware.js';
import RouteFiles from './RouteFiles.js';
import Route from './Route.js';
import RouteCrud from './RouteCrud.js';

global.RouteFiles = RouteFiles;
global.Route = Route;
global.RouteCrud = RouteCrud;

let Routes = [];

//load route files
const loadModules = async () => {
    global.Actions = await Actions();

	let app_path = app.getAppPath().replace(/\\/g, '/');
    const files = get_files_recursive(`${app_path}/app/Routes`);
    for ( let i = 0; i < files.length; i++ ) {
        global.__electron_route_file = path.basename(files[i]).replace(/\.js$/, '');

        if ( !RouteFiles[__electron_route_file] ) {
            RouteFiles[__electron_route_file] = [];
        }

        const module_path = `file://${files[i]}`;
        await import(module_path);
    }
}

const match = async(args, event) => {
    let matched = null;
    let params = [];

    //check for exact matches
    for ( let Route of Routes ) {
        if ( Route.path == args.path && Route.method == args.method ) {
            matched = Route;
            break;
        }
    }

    //check for routes with params
    if ( !matched ) {
        for ( let Route of Routes ) {
            if ( !Route.path.match(/\{.*\}/) ) {
                continue;
            }

            //check if route matches
            let regex_string = Route.path.replace(/\{(.*?)\}/g, '([^\/]*?)') + '\/$';
            let regex = new RegExp(regex_string, 'g');

            //add trailing slash to path for regex
            let path = args.path.replace(/\/$/, '') + '/';
            let match = regex.exec(path);
            if ( !match ) {
                continue;
            }

            //check method
            if ( Route.method != args.method ) {
                continue;
            }

            matched = Route;

            for (let i = 1; i < match.length; i++) {
                params.push(match[i]);
            }

            break;
        }
    }

    Invoked.data = args.payload;
    params.push(event);

    return {
        Route: matched,
        params,
        path: args.path,
        payload: args.payload,
    };
}

export default async () => {
    // let runMiddleware = await Middleware();
    await loadModules();

    //handle route matching
    ipcMain.handle('invoke', async (event, args) => {
        args.payload = JSON.parse(args.payload);

        let matched = await match(args, event);
        if ( !matched.Route ) {
            throw `Route ${matched.path} not found.`;
        }

        return await matched.Route.component.run(...matched.params);
    });

    let Router = {
        addRoute(Route) {
            Routes.push(Route);
        },
    };

    return { Router, RouteFiles };
};
