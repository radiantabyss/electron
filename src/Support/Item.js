let self = {
	patch(item, data) {
		return self.setKeys(item, Object.keys(data), Object.values(data));
	},

    setKey(item, key, value) {
        return self.setKeys(item, key, value);
    },

    setKeys(item, keys, values) {
        let not_empty = window.handleEmpty(item);
        if ( not_empty !== true ) {
            item = {};
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

        for ( let i = 0; i < keys.length; i++ ) {
            item[keys[i]] = values[i];
        }

        return {...item};
    },

	removeEmptyKeys(item) {
		let new_item = Array.isArray(item) ? [] : {};
        let count = Array.isArray(item) ? item.length : Object.keys(item).length;
		for ( let i = 0; i < count; i++ ) {
            let index = Array.isArray(item) ? i : Object.keys(item)[i];

            if ( item[index] !== '' ) {
                new_item[index] = item[index];
            }
        }

        return new_item;
	},

    deleteKeys(item, keys) {
		for ( let key of keys ) {
	        delete item[key];
		}

		return {...item};
    },

    deleteKey(item, key) {
		return self.deleteKeys(item, [key]);
    },
};

export default self;
