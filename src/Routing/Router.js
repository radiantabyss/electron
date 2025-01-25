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

//load route files
const loadModules = async () => {
    global.Actions = await Actions();

	let app_path = app.getAppPath().replace(/\\/g, '/');
    const files = get_files_recursive(`${app_path}/src/Routes`);
    for ( let i = 0; i < files.length; i++ ) {
        global.__electron_route_file = path.basename(files[i]).replace(/\.js$/, '');

        if ( !RouteFiles[__electron_route_file] ) {
            RouteFiles[__electron_route_file] = [];
        }

        const module_path = `file://${files[i]}`;
        await import(module_path);
    }
}

export default async () => {
    // let runMiddleware = await Middleware();
    await loadModules();

    let Router = {
        addRoute(Route) {
            ipcMain.handle(Route.path, async (event, args) => {
                return await Route.component.run(args, event);
            });
        },
    };

    return { Router, RouteFiles };
};
