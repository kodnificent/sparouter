const {src, dest, watch, series, parallel,task} = require("gulp");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const sourceMaps = require ("gulp-sourcemaps");
//const eslint = require("gulp-eslint");
const del = require("del");
//const runSequence = require("run-sequence");
const rename = require("gulp-rename");

function js(cb){
    src("src/**/*.js")
        .pipe(sourceMaps.init())
        .pipe(babel({
            //plugins: "babel-plugin-transform-remove-console"
        }))
        .pipe(uglify())
        .pipe(rename(path=>{
            path.extname = ".min.js";
        }))
        .pipe(sourceMaps.write("."))
        .pipe(dest("dist"));
    cb();
}

function estransform(cb){
    src("src/**/*.js")
        .pipe(sourceMaps.init())
        .pipe(babel())
        .pipe(sourceMaps.write("."))
        .pipe(dest("dist"));
    cb();
};

function clean_build(cb){
    del.sync("dist/*");
    cb();
};

task("build", series(clean_build, js));

task("dev", ()=>{
    watch("src/**/*", {ignoreInitial: false}, estransform);
});