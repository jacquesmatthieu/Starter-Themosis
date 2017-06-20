import settings from '../helpers/settings';

let parsr = {

    start (callback) {

        let arrayOfModules    = [],
            modulesToPreserve = [],
            modulesToImport   = [];

        // Parse data-modules in the DOM
        [].forEach.call(
                document.body.querySelectorAll('[data-modules]'),
                el => {
                    const listModules   = el.getAttribute('data-modules').replace(' ', '').split(','),
                          modulesLength = listModules.length;

                    // Loop on all modules retrieve
                    for (let i = 0; i < modulesLength; i++) {
                        if (listModules[i] !== '') {
                            // Prevent multiple instance in the same page (use init and destroy once per page)
                            // Init and destroy method parse DOM and is available for multiple instance
                            if (arrayOfModules.indexOf(listModules[i]) === -1) {

                                arrayOfModules.push(listModules[i]);

                                modulesToImport.push(import('../' + listModules[i]).then(module => {
                                    module.default.init();
                                    if (settings.get('debug')) {
                                        console.info(`√ ${listModules[i]} :: init`);
                                    }
                                    // Remove data-attributes to clean DOM
                                    el.removeAttribute('data-modules');
                                }).catch((error) => console.error('An error occured while loading module...', error)));
                            }
                        }
                    }
                }
        );

        // Keep specific modules
        for (let j = arrayOfModules.length - 1; j >= 0; j--) {
            for (let k = 0, lengthModulesToPreserve = modulesToPreserve.length; k < lengthModulesToPreserve; k++) {
                if (arrayOfModules[j] === modulesToPreserve[k]) {
                    arrayOfModules.splice(j, 1);
                }
            }
        }
        settings.set('modulesToDestroy', arrayOfModules);

        // If parsr detect callback function, call the function after all Promises have completed
        if (typeof callback !== 'undefined') {
            Promise.all(modulesToImport).then(callback);
        }
    }

};

export default parsr;
