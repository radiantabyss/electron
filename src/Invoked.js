let self = {
    data: {},

    all() {
        return self.data;
    },

    get(param) {
        return self.data[param];
    },
};

export default self;
