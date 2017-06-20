import settings from '../helpers/settings';
import {debounce} from '../helpers/utils';

let app = {

    ANIMALS: [],
    $app: null,
    app: null,

    init() {
        this.ANIMALS = ['Jellyfish', 'Koala', 'Penguins'];
        this.$app = settings.get('$app');
        this.app = settings.get('app');

        // A bit of Array.prototype.find
        console.info(this.ANIMALS.find(this.findPenguins));

        // A bit of Mutation Observer API
        this.observeContentAttributeChange();

        // A bit of JS media query
        let mq = window.matchMedia('(max-width: 800px)');
        this.toggleContentClass(mq);
        mq.addListener(this.toggleContentClass.bind(this));

        // Example use of a utility function
        const windowResize = debounce(this.windowResize.bind(this), 500);
        settings.get('$win').on('resize', windowResize);
    },

    findPenguins(element) {
        return element.indexOf('Penguins') !== -1;
    },

    toggleContentClass(mql) {
        if (mql.matches) {
            this.$app.addClass('app__main--tablet');
        } else {
            this.$app.removeClass('app__main--tablet');
        }
    },

    observeContentAttributeChange() {
        let observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes') {
                    console.info(`√ APP :: "${mutation.attributeName}" attribute has changed...`);
                }
            });
        });

        observer.observe(this.app, {
            attributes: true,
            childList: false,
            characterData: false
        });
    },

    windowResize() {
        console.info('√ APP :: window resize...');
    }
};

export default app;
