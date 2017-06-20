// Promise polyfill (IE fix)
import Bluebird from 'bluebird';
Bluebird.config({warnings: false});
global.Promise = Bluebird;

const availablePolyfills = [
    {
        name: 'Object.assign',
        test: () => typeof Object.assign !== 'function',
        load: () => {
            return new Promise((resolve, reject) => {
                import('core-js/fn/object/assign').then(module => resolve(module)).catch(err => reject(err));
            });
        }
    },
    {
        name: 'HTMLElement.classList',
        test: () => typeof document !== 'undefined' && !('classList' in document.createElement('a')),
        load: () => {
            return new Promise((resolve, reject) => {
                import('./polyfills/class-list').then(module => resolve(module)).catch(err => reject(err));
            });
        }
    },
    {
        name: 'Array.forEach',
        test: () => typeof Array.prototype.forEach !== 'function',
        load: () => {
            return new Promise((resolve, reject) => {
                import('core-js/fn/array/for-each').then(module => resolve(module)).catch(err => reject(err));
            });
        }
    },
    {
        name: 'Array.find',
        test: () => typeof Array.prototype.find !== 'function',
        load: () => {
            return new Promise((resolve, reject) => {
                import('core-js/fn/array/find').then(module => resolve(module)).catch(err => reject(err));
            });
        }
    },
    {
        name: 'Array.from',
        test: () => typeof Array.prototype.from !== 'function',
        load: () => {
            return new Promise((resolve, reject) => {
                import('core-js/fn/array/from').then(module => resolve(module)).catch(err => reject(err));
            });
        }
    },
    {
        name: 'window.MutationObserver',
        test: () => !(window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver),
        load: () => {
            return new Promise((resolve, reject) => {
                import('mutationobserver-shim').then(module => resolve(module)).catch(err => reject(err));
            });
        }
    }
];

export default function loadPolyfills(initialize) {
    if (availablePolyfills.some(polyfill => polyfill.test())) {
        let polyfillFns = [];

        availablePolyfills.forEach(polyfill => {
            if (polyfill.test()) {
                console.info('Loading ' + polyfill.name + ' polyfill...');
                polyfillFns.push(polyfill.load());
            }
        });

        Promise.all(polyfillFns).then(() => initialize());
    } else {
        initialize();
    }
}
