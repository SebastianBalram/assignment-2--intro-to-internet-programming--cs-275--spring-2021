const { html, prod, series } = require(`gulp`);
const htmlValidator = require(`gulp-html`);
const htmlCompressor = require(`gulp-htmlmin`);
let validateHTML = () => {
    return html(`html/*.html`)
        .pipe(htmlValidator());
};

let compressHTML = () => {
    return src(`html/*.html`)
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod/`));
};

exports.validateHTML = validateHTML;
exports.compressHTML = compressHTML;
exports.runAll = series(validateHTML,compressHTML);
