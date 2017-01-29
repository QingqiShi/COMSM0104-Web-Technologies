module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'curl-dir': {
            './test': [
                'http://localhost:8080/index.html'
            ]
        },
      
        htmllint: {
            all: ["test/index.html"]
        },

        clean: 
            ['./test/**']
    });

    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-html');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['curl-dir', 'htmllint', 'clean']);

};