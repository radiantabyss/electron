let self = {
    run(domain) {
        domain = domain.replace(/\\/g, '.').replace(/\//g, '.');
        let prefix = Str.kebab(domain).replace(/\./g, '/');

        Route.get(`/${prefix}`, `${domain}/ListAction`);
        Route.get(`/${prefix}/single`, `${domain}/SingleAction`);
        Route.post(`/${prefix}/create`, `${domain}/CreateAction`);
        Route.get(`/${prefix}/edit`, `${domain}/EditAction`);
        Route.post(`/${prefix}/update`, `${domain}/UpdateAction`);
        Route.post(`/${prefix}/patch`, `${domain}/PatchAction`);
        Route.get(`/${prefix}/delete`, `${domain}/DeleteAction`);
        Route.get(`/${prefix}/search`, `${domain}/SearchAction`);
    }
}

export default self;
