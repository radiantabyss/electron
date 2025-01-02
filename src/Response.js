let self = {
    success(data) {
        return data;
    },

    error(error) {
        throw error;
    },
}

export default self;
