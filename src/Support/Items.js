const self = {
    pluck(items, key = 'id') {
        let plucked = [];
        for (let i = 0; i < items.length; i++) {
            plucked.push(items[i][key]);
        }

        return plucked;
    },

    spread(items) {
        return JSON.parse(JSON.stringify(items));
    },

    keyBy(items, key = 'id') {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        let new_items = {};
        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];
            new_items[items[index][key]] = items[index];
        }

        return new_items;
    },

    groupBy(items, key = 'id') {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        let new_items = Array.isArray(items) ? [] : {};
        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if (typeof new_items[items[index][key]] === 'undefined') {
                new_items[items[index][key]] = [];
            }

            new_items[items[index][key]].push(items[index]);
        }

        return new_items;
    },

    find(items, ids) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return false;
        }

        let single = false;
        if ( !Array.isArray(ids) ) {
            if ( typeof ids === 'string' ) {
                ids = parseInt(ids);
            }

            ids = [ids];
            single = true;
        }

        let new_items = Array.isArray(items) ? [] : {};
        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if ( ids.includes(parseInt(items[index].id)) ) {
                if ( Array.isArray(items) ) {
                    new_items.push(items[index]);
                }
                else {
                    new_items[index] = items[index];
                }
            }
        }

        if ( single ) {
            if ( Array.isArray(new_items) && new_items.length ) {
                return new_items[0];
            }
            else if ( !Array.isArray(new_items) && Object.keys(new_items).length ) {
                return new_items[Object.keys(new_items)[0]];
            }

            return false;
        }

        return new_items;
    },

    findByKey(items, key, value = true, single = false) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return false;
        }

        let new_items = Array.isArray(items) ? [] : {};
        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if ( items[index][key] == value ) {
                if ( Array.isArray(items) ) {
                    new_items.push(items[index]);
                }
                else {
                    new_items[index] = items[index];
                }
            }
        }

        if ( single ) {
            if ( Array.isArray(new_items) && new_items.length ) {
                return new_items[0];
            }
            else if ( !Array.isArray(new_items) && Object.keys(new_items).length ) {
                return new_items[Object.keys(new_items)[0]];
            }

            return false;
        }

        return new_items;
    },

    add(items, item, at_first_position = false) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            items = [];
        }

        if ( at_first_position ) {
            items.unshift(item);
        }
        else {
            items.push(item);
        }

        return items;
    },

    addMany(items, added, at_first_position = false) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            items = [];
        }

        if ( at_first_position ) {
            return added.concat(items);
        }
        else {
            return items.concat(added);
        }
    },

    patch(items, data) {
        if ( !data.id ) {
            throw 'ID is required.';
        }

        let id = data.id;
        delete data.id;

        return self.setKeys(items, id, Object.keys(data), Object.values(data));
    },

    replace(items, item) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        let new_items = Array.isArray(items) ? [] : {};
        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if ( items[index].id == item.id ) {
                new_items[index] = item;
            }
            else {
                new_items[index] = items[index];
            }
        }

        return new_items;
    },

    delete(items, ids) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        if ( !Array.isArray(ids) ) {
            if ( typeof ids === 'string' ) {
                ids = parseInt(ids);
            }

            ids = [ids];
        }

        let new_items = Array.isArray(items) ? [] : {};
        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if ( ids.includes(parseInt(items[index].id)) ) {
                continue;
            }

            if ( Array.isArray(items) ) {
                new_items.push(items[index]);
            }
            else {
                new_items[index] = items[index];
            }
        }

        return new_items;
    },

    deleteByKey(items, key, value) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        let new_items = Array.isArray(items) ? [] : {};
        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if ( items[index][key] != value ) {
                new_items[index] = items[index];
            }
        }

        return new_items;
    },

    setKey(items, id, key, value) {
        return self.setKeys(items, id, key, value);
    },

    setKeys(items, ids, keys, values) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        if ( !Array.isArray(ids) ) {
            if ( typeof ids === 'string' ) {
                ids = parseInt(ids);
            }

            ids = [ids];
        }

        if ( Array.isArray(keys) && !Array.isArray(values) ) {
			let array_values = [];
			for ( let key of keys ) {
				array_values.push(values);
			}
			values = array_values;
        }

        if ( !Array.isArray(keys) ) {
            keys = [keys];
			values = [values];
        }

        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if ( ids.includes(parseInt(items[index].id)) ) {
                for ( let j = 0; j < keys.length; j++ ) {
                    items[i][keys[j]] = values[j];
                }
            }
        }

        return items;
    },

    toggleKey(items, id, key) {
        return self.toggleKeys(items, id, key);
    },

    toggleKeys(items, ids, keys) {
        let not_empty = window.handleEmpty(items);
        if ( not_empty !== true ) {
            return not_empty;
        }

        if ( !Array.isArray(ids) ) {
            if ( typeof ids === 'string' ) {
                ids = parseInt(ids);
            }

            ids = [ids];
        }

        if ( !Array.isArray(keys) ) {
            keys = [keys];
        }

        let count = Array.isArray(items) ? items.length : Object.keys(items).length;
        for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(items) ? i : Object.keys(items)[i];

            if ( ids.includes(parseInt(items[index].id)) ) {
                for ( let j = 0; j < keys.length; j++ ) {
                    items[index][keys[j]] = !items[index][keys[j]];
                }
            }
        }

        return items;
    },

    sort(items, from, to) {
        const copy = [...items];
        const valueToMove = copy.splice(from, 1)[0];
        copy.splice(to, 0, valueToMove);

        return copy;
    },

    next(items, current, key = 'id')  {
        for ( let i = 0; i < items.length; i++ ) {
            if ( items[i][key] == current[key] && i < items.length - 1 ) {
                return items[i + 1];
            }
        }

        return false;
    },

    prev(items, current, key = 'id')  {
        for ( let i = items.length - 1; i >= 0; i-- ) {
            if ( items[i][key] == current[key] && i > 0 ) {
                return items[i - 1];
            }
        }

        return false;
    },
};

global.pluck = self.pluck;
global.spread = self.spread;
global.keyBy = self.keyBy;
global.groupBy = self.groupBy;

export default self;
