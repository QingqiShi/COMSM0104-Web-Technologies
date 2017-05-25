module.exports = function(grunt) {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'curl-dir': {
            './test': [
                'https://localhost:8080/index.html',
                'https://localhost:8080/browse.html',
                'https://localhost:8080/game.html',
                'https://localhost:8080/about.html'
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
