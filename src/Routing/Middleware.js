// MIDDLEWARE IS NOT USED AT THE MOMENT
//
//
//
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let Middleware = {};
let folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src/Middleware');

const loadModules = async () => {
    const files = get_files_recursive(folder);

    for ( let i = 0; i < files.length; i++ ) {
        let split = files[i].split('/');
        let name = split[split.length - 1].replace('.js', '').replace('Middleware', '');
        const module_path = `file://${files[i]}`;
        const module = await import(module_path);
        Middleware[name] = module.default;
    }
}

let runMiddleware = async (to, from, i = 0) => {
    //reached end, then everything passed
    if ( i == to.meta.middleware.length ) {
        return;
    }

    //middleware doesnt exist
    if ( !Middleware[to.meta.middleware[i]] ) {
        throw new Error(`${to.meta.middleware[i]} Middleware not found.`);
    }

    //run middleware
    await Middleware[to.meta.middleware[i]](to, from);
    await runMiddleware(to, from, i + 1);
}

export default async () => {
    await loadModules();

    return async (to, from) => {
        if ( !to.meta || !to.meta.middleware ) {
            return;
        }

        return runMiddleware(to, from);
    };
}
