import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import tree_kill from 'tree-kill';
import { BrowserWindow } from 'electron';

let self = {
    dmp(text) {
        console.log(text);
    },

    handleEmpty(items) {
        if ( items === false ) {
            return false;
        }

        if ( items === null ) {
            return null;
        }

        if ( Array.isArray(items) && !items.length ) {
            return [];
        }

        if ( !Array.isArray(items) && !Object.keys(items).length ) {
            return {};
        }

        return true;
    },

    array_unique(arr) {
        return [...new Set(arr)];
    },

    async custom_logger(e) {
        if ( typeof e == 'object' ) {
            e = e.toString();
        }

        let path = `${APP_PATH}/error.log`;
        await fs.ensureFile(path);

        let date = new Date();
        let timestamp = `${date.getFullYear()}-${Str.leading_zero(date.getMonth() + 1)}-${Str.leading_zero(date.getDate())}`+
            ` ${Str.leading_zero(date.getHours())}:${Str.leading_zero(date.getMinutes())}`;

        await fs.appendFile(path, `[${timestamp}] ${e}`);
    },

    decode_json(string) {
        if ( typeof string == 'string') {
            return JSON.parse(string);
        }

        return string;
    },

    encode_json(array, null_if_empty = true, return_empty_array = true) {
        if ( typeof array == 'string' ) {
            return array;
        }

        if ( array === null ) {
            return null_if_empty ? null : JSON.stringify(return_empty_array ? [] : {});
        }
        else if ( Array.isArray(array) && !array.length ) {
            return null_if_empty ? null : JSON.stringify([]);
        }
        else if ( array == '{}' ) {
            return null_if_empty ? null : JSON.stringify({});
        }

        return JSON.stringify(array, (key, value) => (typeof value === "string" && value !== '' && !isNaN(value) ? Number(value) : value));
    },

    ipc_send(event, args, win = null) {
        //if window is not passed then send to main window
        if ( !win ) {
            win = BrowserWindow.getFocusedWindow() || MAIN_WINDOW;
        }

        //if there is no window to send to, stop
        if ( !win ) {
            return;
        }

        win.send(event, args);
    },

    get_files_recursive(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        const files = entries.flatMap((entry) => {
            const fullPath = path.join(dir, entry.name);
            return entry.isDirectory() ? self.get_files_recursive(fullPath) : fullPath;
        });

        return files.filter(file => file.endsWith('.js'));
    },

    async is_folder_empty(path) {
        if ( !await fs.exists(path) ) {
            return true;
        }

        try {
            const files = await fs.readdir(path);
            return files.length === 0;
        }
        catch (error) {
            throw error;
        }
    },

    exec_promise(command, options = {}) {
        return new Promise((resolve, reject) => {
            exec(command, options, (error, stdout, stderr) => {
                if (error) {
                    return reject(error);
                }

                resolve({ stdout, stderr });
            });
        });
    },

    tree_kill_promise(pid, signal = 'SIGINT') {
        return new Promise((resolve, reject) => {
            tree_kill(pid, signal, (err) => {
                if ( err ) {
                    return reject(err);
                }
                resolve();
            });
        });
    },
};

export default self;
