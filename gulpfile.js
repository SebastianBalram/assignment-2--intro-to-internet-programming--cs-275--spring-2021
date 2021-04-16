const { src, dest, series, watch } = require(`gulp`);
const htmlValidator = require(`gulp-html`);
const htmlCompressor = require(`gulp-htmlmin`);
const jsLinter = require(`gulp-eslint`);
const babel = require(`gulp-babel`);
const cssLinter = require(`gulp-stylelint`);
const browserSync = require(`browser-sync`);
const reload = browserSync.reload;
const jsCompressor = require(`gulp-uglify`);



let validateHTML = () => {
    return src([`dev/html/*.html`,`dev/**/*.html`]).pipe(htmlValidator());
};

let compressHTML = () => {
    return src([`dev/**/*.html`,`dev/**/*.html`])
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};
let lintCSS = () => {
    return src(`dev/css/*.css`)
        .pipe(cssLinter({
            failAfterError: true,
            reporters: [
                {formatter: `verbose`, console: true}
            ]
        }));
};

let compileCSSForProd = () => {
    return src(`dev/css/style.css`)
        .pipe(sass({
            outputStyle: `compressed`,
            precision: 10
        }).on(`error`, sass.logError))
        .pipe(dest(`prod/css`));
};

let lintJS = () => {
    return src(`dev/js/*.js`)
        .pipe(jsLinter({
            parserOptions: {
                ecmaVersion: 2017,
                sourceType: `module`
            },
            rules: {
                indent: [2, 4, {SwitchCase: 1}],
                quotes: [2, `backtick`],
                semi: [2, `always`],
                'linebreak-style': [2, `unix`],
                'max-len': [1, 85, 4]
            },
            env: {
                es6: true,
                node: true,
                browser: true
            },
            extends: `eslint:recommended`
        }))
        .pipe(jsLinter.formatEach(`compact`, process.stderr));
};
let transpileJSForDev = () => {
    return src(`dev/js/*.js`)
        .pipe(babel())
        .pipe(dest(`temp/scripts`));
};
let transpileJSForProd = () => {
    return src(`dev/js/*.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/js`));
};

async function firefox () {
    browserChoice = `firefox`;
}

let serve = () => {
    browserSync({
        notify: true,
        port: 9000,
        reloadDelay: 50,
        server: {
            baseDir: [
                `dev`
            ]
        }
    });


    watch(`dev/js/*.js`,
        series(lintJS, transpileJSForDev)
    ).on(`change`, reload);

    watch(`dev/css/**/*.scss`,
        series(compileCSSForProd)
    ).on(`change`, reload);

    watch(`dev/**/*.html`,
        series(validateHTML)
    ).on(`change`, reload);

    watch(`dev/img/**/*`).on(`change`, reload);
};

exports.lintCSS=lintCSS;
exports.lintJS = lintJS;
exports.validateHTML = validateHTML;
exports.compressHTML = compressHTML;

exports.transpileJSForDev = transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.build = series(validateHTML, compressHTML,transpileJSForProd);
exports.serve=series(validateHTML,compressHTML,lintCSS,lintJS,serve);
