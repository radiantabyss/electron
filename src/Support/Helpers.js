import fs from 'fs';
import path from 'path';
import { BrowserWindow } from 'electron';

let self = {
    dmp(str) {
        console.log(str);
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
