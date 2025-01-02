import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function getFilesRecursively(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = entries.flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory() ? getFilesRecursively(fullPath) : fullPath;
    });

    return files.filter(file => file.endsWith('.js'));
}

let Actions = {};

const loadModules = async () => {
    const files = getFilesRecursively(`${APP_PATH}/src/Domains`);

    for ( let i = 0; i < files.length; i++ ) {
        let split = files[i]
            .replace(/\\/g, '/')
            .replace(`${APP_PATH.replace(/\\/g, '/')}/src/Domains`, '')
            .split('/');

        split.shift();
        let name = split[split.length - 1].replace('.js', '');
        split.pop();
        split.pop();

        if ( !name.match(/Action$/) || name == 'Action' ) {
            continue;
        }

        const module_path = `file://${files[i]}`;
        const module = await import(module_path);
        setNamespace(Actions, name, split, module);
    }
}

function setNamespace(Actions, name, namespace, module) {
    if ( !namespace.length ) {
        Actions[name] = module.default;
        return;
    }

    let first = namespace[0].replace(/-/g, ' ').replace(/_/g, ' ').replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,function(s) {
        return s.toUpperCase();
    }).replace(/ /g, '');

    namespace.shift();

    if ( !Actions[first] ) {
        Actions[first] = {};
    }

    setNamespace(Actions[first], name, namespace, module);
}

export default async () => {
    await loadModules();
    return Actions;
}
