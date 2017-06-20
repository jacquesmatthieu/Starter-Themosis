module.exports = function (templateParams) {
    const publicPath = 'fn(\'get_template_directory_uri\')',
          twigRoot   = '{{ root }}/';

    let manifest       = '',
        vendorPath     = '',
        mainPath       = '',
        manifestPath   = '',
        chunksManifest = {},
        assets         = templateParams.compilation.assets,
        chunks         = templateParams.compilation.chunks;

    for (let asset in assets) {
        if (assets.hasOwnProperty(asset)) {
            if (manifest.length === 0 && asset.indexOf('js/manifest.') !== -1 && asset.endsWith('.js') && assets[asset]['_value']) {
                manifest = assets[asset]['_value'];
            }
        }
    }

    chunks.forEach(chunk => {
        const chunkPath = chunk.files[0];
        chunksManifest[chunk.id] = twigRoot + chunkPath;
        if (chunkPath.indexOf('js/vendor') !== -1) {
            vendorPath = twigRoot + chunkPath;
            return true;
        }
        if (chunkPath.indexOf('js/main') !== -1) {
            mainPath = twigRoot + chunkPath;
            return true;
        }
        if (chunkPath.indexOf('js/manifest') !== -1) {
            manifestPath = twigRoot + chunkPath;
            return true;
        }
    });

    return `
{% set root = ${publicPath} %}
<script>
    //<![CDATA[
    window.webpackManifest=${JSON.stringify(chunksManifest) + ';'}
    //]]>
    ${manifest}
</script>${manifest.length === 0 ? `\n<script src="${manifestPath}"></script>` : ''}
<script src="${vendorPath}"></script>
<script src="${mainPath}"></script>`;
};
