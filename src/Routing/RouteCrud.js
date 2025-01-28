let self = {
    run(domain) {
        domain = domain.replace(/\\/g, '.').replace(/\//g, '.');
        let prefix = Str.kebab(domain).replace(/\./g, '/');

        Route.get(`/${prefix}`, `${domain}/ListAction`, [], '', false);
        Route.get(`/${prefix}/single/{id}`, `${domain}/SingleAction`, [], '', false);
        Route.post(`/${prefix}/create`, `${domain}/CreateAction`, [], '', false);
        Route.get(`/${prefix}/edit/{id}`, `${domain}/EditAction`, [], '', false);
        Route.post(`/${prefix}/update/{id}`, `${domain}/UpdateAction`, [], '', false);
        Route.post(`/${prefix}/patch/{id}`, `${domain}/PatchAction`, [], '', false);
        Route.get(`/${prefix}/delete/{id}`, `${domain}/DeleteAction`, [], '', false);
        Route.get(`/${prefix}/search`, `${domain}/SearchAction`, [], '', false);
    }
}

export default self;
