module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'curl-dir': {
            './test': [
                'http://localhost:8080/index.html',
                'http://localhost:8080/browse.html',
                'http://localhost:8080/game.html',
                'http://localhost:8080/about.html'
            ]
        },

        htmllint: {
            all: [
                "test/index.html",
                "test/browse.html",
                "test/game.html",
                "test/about.html"
            ]
        },

        clean:
            ['./test/**']
    });

    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-html');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['curl-dir', 'htmllint', 'clean']);

};
