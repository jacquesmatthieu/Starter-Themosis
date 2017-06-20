module.exports = function (templateParams) {
    const publicPath = '{{ fn(\'get_template_directory_uri\') }}/';

    let mainPath       = '',
        chunks         = templateParams.compilation.chunks;

    chunks.forEach(chunk => {
        if (chunk.name === 'main') {
            chunk.files.forEach(chunkFile => {
                if (chunkFile.indexOf('css/main') !== -1 && chunkFile.endsWith('.css')) {
                    mainPath = publicPath + chunkFile;
                    return false;
                }
            });
        }
    });

    return `<link rel="stylesheet" href="${mainPath}" />`;
};