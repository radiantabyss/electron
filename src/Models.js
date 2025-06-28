import { app } from 'electron';
import fs from 'fs';

let Model = {};

//load model files
const loadModules = async () => {
	let app_path = app.getAppPath().replace(/\\/g, '/');

	if ( !fs.existsSync(`${app_path}/app/Models`) ) {
		return;
	}

    const files = get_files_recursive(`${app_path}/app/Models`);

    for ( let i = 0; i < files.length; i++ ) {
        let split = files[i]
            .replace(/\\/g, '/')
            .replace(`${app_path}/app/Models`, '')
            .split('/');

        let name = split[split.length - 1].replace('.js', '');
        const module_path = `file://${files[i]}`;
        const module = await import(module_path);
        Model[name] = module.default;
    }
}

export default async () => {
    await loadModules();
    return Model;
};
