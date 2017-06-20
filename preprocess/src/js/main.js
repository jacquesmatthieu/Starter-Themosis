//import '../scss/main';

// Import config

import loadPolyfills from './helpers/polyfiller';
import settings from './helpers/settings';
import parsr from './helpers/parsr'; 

loadPolyfills(() => {

    // Set some settings...
    settings.set('debug', true);
    settings.set('$container', $('#maz-container'));
    settings.set('$app', $('#app'));
    settings.set('app', document.getElementById('app'));

    // Start Joris' parser
    parsr.start(() => console.info('√ Modules parsing done!'));
});
