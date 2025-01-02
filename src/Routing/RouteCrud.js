let self = {
    run(domain) {
        domain = domain.replace(/\\/g, '.').replace(/\//g, '.');
        let prefix = Str.kebab(domain).replace(/\./g, '/');

        Route.get(`/${prefix}`, `${domain}.ListAction`, [], '', false);
        Route.get(`/${prefix}/new/{id?}`, `${domain}.NewAction`, [], '', false);
        Route.get(`/${prefix}/edit/{id}`, `${domain}.EditAction`, [], '', false);
        Route.get(`/${prefix}/single/{id}`, `${domain}.SingleAction`, [], '', false);
    }
}

export default self;
