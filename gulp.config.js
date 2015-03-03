module.exports = function() {
    var client = './client/';
    var server = './server/';
    var clientApp = client + 'app/';
    var report = './report/';
    var root = './';
    var specRunnerFile = 'specs.html';
    var temp = './.tmp/';
    var assets = './client/assets/';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: true})['js'];

    var config = {
        /**
         * File paths
         */
        // all javascript that we want to vet
        alljs: './client/**/*.js',
        build: './build/',
        client: client,
        css: temp + 'styles',
        fonts: [
            './bower_components/font-awesome/fonts/**/*.*',
            './bower_components/bootstrap-sass/assets/fonts/**/*.*'
        ],
        html: client + '**/*.html',
        templates: clientApp + '**/*.tpl.html',
        images: assets + 'images/**/*.*',
        index: client + 'index.html',
        // app js, with no specs
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        jsOrder: [
            '**/app.module.js',
            '**/*.module.js',
            '**/*.js'
        ],
        sass: client + 'styles/styles.scss',
        report: report,
        assets: assets,
        root: root,
        server: server,
        source: 'client/',
        temp: temp,

        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },
        /**
         * browser sync
         */
        browserReloadDelay: 1000,
        /**
         * plato
         */
        plato: {js: clientApp + '**/*.js'},

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                root: 'app/',
                standAlone: false,
            }
        },

        /**
         * Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '..'
        },
        packages: [
            './package.json',
            './bower.json'
        ],

        /**
         * specs.html, our HTML spec runner
         */
        specRunner: client + specRunnerFile,
        specRunnerFile: specRunnerFile,

        /**
         * The sequence of the injections into specs.html:
         *  1 testlibraries
         *      mocha setup
         *  2 bower
         *  3 js
         *  4 spechelpers
         *  5 specs
         *  6 templates
         */
        testlibraries: [
            'node_modules/mocha/mocha.js',
            'node_modules/chai/chai.js',
            'node_modules/mocha-clean/index.js',
            'node_modules/sinon-chai/lib/sinon-chai.js'
        ],
        specHelpers: [root + 'tests/**/*.js'],
        specs: [clientApp + '**/*.spec.js'],
        serverIntegrationSpecs: [root + '/tests/server-integration/**/*.spec.js'],

        /**
         * Node settings
         */
        nodeServer: './server/server.js',
        defaultPort: '9000'
    };

    /**
     * wiredep and bower settings
     */
    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    /**
     * karma settings
     */
    config.karma = getKarmaOptions();

    return config;

    ////////////////

    function getKarmaOptions() {
        var options = {
            files: [].concat(
                bowerFiles,
                config.specHelpers,
                clientApp + '**/*.module.js',
                clientApp + '**/*.js',
                temp + config.templateCache.file,
                config.serverIntegrationSpecs
            ),
            exclude: [],
            coverage: {
                dir: report + 'coverage',
                reporters: [
                    // reporters not supporting the `file` property
                    {type: 'html', subdir: 'report-html'},
                    {type: 'lcov', subdir: 'report-lcov'},
                    // reporters supporting the `file` property, use `subdir` to directly
                    // output them in the `dir` directory.
                    // omit `file` to output to the console.
                    // {type: 'cobertura', subdir: '.', file: 'cobertura.txt'},
                    // {type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt'},
                    // {type: 'teamcity', subdir: '.', file: 'teamcity.txt'},
                    //{type: 'text'}, //, subdir: '.', file: 'text.txt'},
                    {type: 'text-summary'} //, subdir: '.', file: 'text-summary.txt'}
                ]
            },
            preprocessors: {}
        };
        options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
        return options;
    }
};
