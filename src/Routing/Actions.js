import { app } from 'electron';

let Actions = {};

const loadModules = async () => {
	let app_path = app.getAppPath().replace(/\\/g, '/');
    const files = get_files_recursive(`${app_path}/src/Domains`);

    for ( let i = 0; i < files.length; i++ ) {
        let split = files[i]
            .replace(/\\/g, '/')
            .replace(`${app_path}/src/Domains`, '')
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
