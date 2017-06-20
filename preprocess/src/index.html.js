module.exports = function (templateParams) {
    const publicPath = '';

    const fileNames = {
        main: 'main', // /!\ in webpack.config.js CSS and JS main files have same name (main)
        vendor: 'vendor',
        manifest: 'manifest'
    };

    let manifest         = '',
        cssPath          = '',
        vendorPath       = '',
        mainPath         = '',
        manifestPath     = '',
        chunksManifest   = {},
        {chunks, assets} = templateParams.compilation;

    // Extract manifest file for inline injection
    Object.keys(assets).map(asset => {
        if (asset.indexOf('manifest.') !== -1 && asset.endsWith('.js')) {
            manifest = assets[asset]._value || (assets[asset].children && assets[asset].children[0]._value) || '';
            return false;
        }
    });

    // Generate window.webpackManifest object
    // And extract assets paths for link and script tags
    chunks.forEach(chunk => {
        if (chunk.name !== 'manifest') { // No need to include manifest path into window.webpackManifest
            /* eslint-disable prefer-destructuring */
            chunksManifest[chunk.id] = chunk.files[0];
            /* eslint-enable prefer-destructuring */
        }
        switch (chunk.name) {
        case fileNames.vendor: // Unused if manifest is used
            vendorPath = publicPath + chunk.files.filter(path => path.endsWith('.js'));
            break;
        case fileNames.manifest:
            manifestPath = publicPath + chunk.files.filter(path => path.endsWith('.js'));
            break;
        case fileNames.main:
            chunk.files.map(path => {
                if (path.endsWith('.js')) {
                    mainPath = publicPath + path;
                }
                if (path.endsWith('.css')) {
                    cssPath = publicPath + path;
                }
            });
            break;
        }
    });
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Mazarine Webpack kitstarter</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="author" content="Mazarine Digital">
    <meta name="description" content="Mazarine Webpack starterkit">
    <link rel="shortcut icon" href="favicon.ico">
    <link rel="stylesheet" href="${cssPath}">
</head>
<body>
    <div id="maz-container" class="container">
        <h1>Mazarine Webpack kitstarter</h1>
        <main id="app" class="app__main" role="main" data-modules="modules/app"></main>
    </div>

    <script>
    //<![CDATA[
    window.webpackManifest=${JSON.stringify(chunksManifest) + ';'}
    //]]>
    ${manifest}
    </script>
    ${manifest.length === 0 ? `<script src="${manifestPath}"></script>` : ''}
    <script src="${vendorPath}"></script>
    <script src="${mainPath}"></script>
    
    <!--
    MAZARINE WEBPACK KITSTARTER
    Version ${process.env.PACKAGE_VERSION}
    Build date: ${process.env.BUILD_DATE}
    Build type: ${process.env.NODE_ENV}
    -->
</body>
</html>`;
};