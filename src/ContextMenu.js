import { app } from 'electron';
import contextMenu from 'electron-context-menu';

let ContextMenuActions = {};

//load context menu files
const loadModules = async () => {
	let app_path = app.getAppPath().replace(/\\/g, '/');
    const files = get_files_recursive(`${app_path}/src/ContextMenu`);

    for ( let i = 0; i < files.length; i++ ) {
        let split = files[i]
            .replace(/\\/g, '/')
            .replace(`${app_path}/src/ContextMenu`, '')
            .split('/');

        let name = split[split.length - 1].replace('.js', '');
        const module_path = `file://${files[i]}`;
        const module = await import(module_path);
        ContextMenuActions[name] = module.default;
    }
}

export default async (list) => {
    await loadModules();

    contextMenu({
        menu: (actions, parameters, win) => {
			let items = [];

            for ( let item of list ) {
				if ( item === '' ) {
					items.push(actions.separator());
					continue;
				}

				if ( !ContextMenuActions[item] ) {
					throw `Context Menu Action ${item} not found.`;
				}

				items.push(ContextMenuActions[item](win));
            }

            return items;
        },
    });
};
