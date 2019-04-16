var gulp = require("gulp");
var uglify = require("gulp-uglify");
var babel = require("gulp-babel");
var sourceMaps = require ("gulp-sourcemaps");
var eslint = require("gulp-eslint");
var del = require("del");
var runSequence = require("run-sequence");

gulp.task("dev", ()=>{
    gulp.start("estransform");
    gulp.start("watch");
});

gulp.task("build", (cb)=>{
    return runSequence(
        "clean:build",
        "js",
        cb
    );
});

gulp.task("js", ()=>{
    return gulp.src("src/**/*.js")
        .pipe(sourceMaps.init())
        .pipe(uglify())
        .pipe(sourceMaps.write("."))
        .pipe(gulp.dest("dist"));
});

gulp.task("estransform",()=>{
    return gulp.src("src/**/*.js")
        //.pipe(eslint())
        .pipe(babel({
            presets:["babel-preset-env"]
        }))
})

gulp.task("clean:build", ()=>{
    return del.sync("dist/*");
}); 

gulp.task("watch", ()=>{
    return gulp.watch("dist/**/*.js", ["estransform"])
});