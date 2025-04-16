const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .js('resources/js/kanban/Kanban.js', 'public/js')
    .js('resources/js/kanban/config/jkanban.js', 'public/js')
    .js('resources/js/kanban/config/jkanban.min.js', 'public/js')
    .js('resources/js/knowledge/index-student.js', 'public/js')
    .js('resources/js/knowledge/knowledge-student-create.js', 'public/js')
    .js('resources/js/knowledge/knowledge-student-details.js', 'public/js')
    .js('resources/js/knowledge/questionnary.js', 'public/js')
    .js('resources/js/kanban/index-admin.js', 'public/js')
    .css('resources/css/kanban/jkanban.css', 'public/css')
    .css('resources/css/kanban/jkanban.min.css', 'public/css')
    .css('resources/css/knowledge/custom-knowledge.css', 'public/css')
    .css('resources/css/knowledge/questionnary.css', 'public/css')
    .sass('resources/scss/app.scss', 'public/css', [
        //
    ]);
