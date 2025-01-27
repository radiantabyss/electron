import * as ValidatorJS from 'validatorjs';

let self = {
    make(data, rules, messages) {
        //format messages
        let formatted_messages = {};
        for ( let key in messages ) {
            let split = key.split('.');
            let pop = Array.from(split);
            pop.pop();
            formatted_messages[`${split[split.length - 1]}.${pop.join('.')}`] = messages[key];
        }

        let validator = new ValidatorJS(data, rules, formatted_messages);

        return {
            passes() {
                return validator.passes();
            },
            messages() {
                return Object.values(validator.errors.all());
            },
        };
    }
}

export default self;
