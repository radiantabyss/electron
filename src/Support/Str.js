let self = {
    /*helpers from https://github.com/validatorjs/validator.js*/
    ltrim(str, chars) {
        const pattern = chars ? new RegExp(`^[${chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+`, 'g') : /^\s+/g;
        return `${str}`.replace(pattern, '');
    },

    rtrim(str, chars) {
        const pattern = chars ? new RegExp(`[${chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+$`, 'g') : /(\s)+$/g;
        return `${str}`.replace(pattern, '');
    },

    trim(str, chars) {
        return self.rtrim(self.ltrim(`${str}`, chars), chars);
    },
    /*end helpers from https://github.com/validatorjs/validator.js*/

    urlencode(str) {
        return encodeURIComponent(str);
    },

    slug(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaaeeeeiiiioooouuuunc------";

        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    },

    dash(str) {
        return str.split('').map((letter, idx) => {
            return letter.toUpperCase() === letter
            ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
            : letter;
        }).join('');
    },

    snake(string) {
        return string
            .replace(/\s+(?=\d)/g, '')
            .replace(/\s+/g, '_')
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .toLowerCase();
    },

    camel(str) {
        return str.replace(/-/g, ' ').replace(/_/g, ' ').replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,function(s) {
            return s.toUpperCase();
        }).replace(/\s+/g, '');
    },

    pascal(str) {
        return `${str}`
            .toLowerCase()
            .replace(new RegExp(/[-_]+/, 'g'), ' ')
            .replace(new RegExp(/[^\w\s]/, 'g'), '')
            .replace(new RegExp(/\s+(.)(\w*)/, 'g'), ($1, $2, $3) => `${$2.toUpperCase() + $3}`)
            .replace(new RegExp(/\w/), s => s.toUpperCase());
    },

    kebab(str) {
        return `${str}`.replace(/([a-z])([A-Z])/g, "$1-$2")
            .replace(/[\s_]+/g, '-')
            .toLowerCase();
    },

    camel2space(str) {
        if ( !str ) {
            return '';
        }

        return str.split('').map((letter, idx) => {
            return letter.toUpperCase() === letter
            ? `${idx !== 0 ? ' ' : ''}${letter}`
            : letter;
        }).join('');
    },

    ucfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    ucwords(str) {
        if ( !str ) {
            str = '';
        }

        //ensure string
        str = str + '';

        return str.replace(/-/g, ' ').replace(/_/g, ' ').replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,function(s) {
            return s.toUpperCase();
        });
    },

    ordinal_suffix(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }

        return i + "th";
    },

    number_to_month(number) {
        let months = {
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December',
        };

        return months[`${number}`.replace(/^0/, '')];
    },

    nl2br(str) {
        if ( !str || !str.length ) {
            return '';
        }

        return str.replace(/(\r\n|\n\r|\r|\n)/g, '<br/>' + '$1');
    },

    strip_tags(str) {
        var div = document.createElement("div");
        div.innerHTML = str;
        var text = div.textContent || div.innerText || "";
        return text;
    },

    ensure_https(string) {
        if (!string.match(/^[a-zA-Z]+:\/\//)) {
            string = 'https://' + string;
        }

        return string;
    },

    add_commas(number) {
        if ( number === undefined || number === null ) {
            return '';
        }

        number = parseFloat(number).toFixed(2).toLocaleString('en-US');

        return number;
    },

    leading_zero(number) {
        return number < 10 ? `0${number}` : number;
    },

    to_percetange(number) {
        if ( number === undefined || !number ) {
            return '0%';
        }

        return (number / 10)+'%';
    },

    plural(str) {
        if ( str.match(/y$/) ) {
            return str.replace(/y$/, 'ies');
        }

        if ( str.match(/s$/) ) {
            return `${str}es`;
        }

        return `${str}s`;
    },

    truncate(str, length) {
        if (str.length > length) {
            return str.slice(0, length) + '...';
        }

        return str;
    },
}

export default self;
