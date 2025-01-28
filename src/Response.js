let self = {
    success(data) {
        return data;
    },

    error(error) {
        if ( Array.isArray(error) ) {
            error = error.join('\n');
        }

        throw error;
    },
}

export default self;
