/**
 * Default: Gulpfile for deploy-able dCacheView
 */
var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var bower = require('gulp-bower');

var maven = require('gulp-maven-deploy');
var zip = require('gulp-zip');

gulp.task('bower', function() {
    return bower();
});

gulp.task('copy-index', function() {
    return gulp.src([
        'src/index.html'
    ], {
        base: ''
    })
        .pipe(gulp.dest('./target'));
});

gulp.task('copy-webcomponents', function() {
    return gulp.src([
        './src/bower_components/webcomponentsjs/webcomponents-lite.min.js'
    ], {
        base: ''
    })
        .pipe(gulp.dest('./target/bower_components/webcomponentsjs'));
});

gulp.task('copy-css', function() {
    return gulp.src([
        'src/styles/main.css'
    ], {
        base: ''
    })
        .pipe(gulp.dest('./target/styles'));
});

gulp.task('copy-script', function() {
    return gulp.src([
        'src/scripts/dv.js'
    ], {
        base: ''
    })
        .pipe(gulp.dest('./target/scripts'));
});

gulp.task('vulcanize', function() {
    return gulp.src('src/elements/elements.html')
        .pipe(vulcanize({
            stripComments: true,
            inlineScripts: true,
            inlineCss: true
        }))
        .pipe(gulp.dest('./target/elements'));
});

gulp.task('deploy-local', function(){
    gulp.src('./target')
        .pipe(zip('dcache-view.jar'))
        .pipe(maven.install({
            'groupId': 'org.dcache'
        }))
});

//Task for deploying to a Maven proxy
/*gulp.task('deploy', function(){
    gulp.src('.')
        .pipe(zip('dcache-view.jar'))
        .pipe(maven.deploy({
            'groupId': 'org.dcache',
            'repositories': [{
                'id': 'some-repo-id',
                'url': 'http://some-repo/url'
            }]
        }))
});*/

gulp.task('build', ['copy-index', 'copy-css', 'copy-script', 'copy-webcomponents', 'vulcanize']);

gulp.task('default', ['bower', 'build'], function () {
    gulp.start('deploy-local');
    //gulp.start('deploy');
});