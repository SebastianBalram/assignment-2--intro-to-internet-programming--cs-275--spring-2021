const { src } = require(`gulp`);
let validateHTML = () => {
    return src([`html/*.html`, `html/**/*.html`]).pipe(htmlValidator());
 };
 exports.validateHTML = validateHTML;
