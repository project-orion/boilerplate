'use strict'

const del = require('del')
const path = require('path')
const fs = require('fs')
const slug = require('slug')

const gulp = require('gulp')
const sequence = require('run-sequence').use(gulp)
const mocha = require('gulp-mocha')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')

const SequelizeAuto = require('sequelize-auto')
const Sequelize = require('sequelize')
const ENV = process.env.NODE_ENV || 'development';
const DB_CONFIG = require('./config').default('database')

const DIST_FOLD = path.join(__dirname, '/dist/')
const CONFIG_FOLD = path.join(__dirname, '/config/')
const SECRET_FOLD = path.join(__dirname, '/secret')
const DATA_FOLD = path.join(__dirname, '/data/')
const MODELS_FOLD = path.join(__dirname, '/models/')
const TESTS_FOLD = path.join(__dirname, '/test/')

const MY_TABLE_ENTRIES = path.join(DATA_FOLD, '/my_table/')



// CONNECTING TO THE DATABASE AND CREATING OUR DB SCHEMA

// Import our database schema and tables:
const schema = require('./data/schema')

const options = {
    logging: false // Change this line if a verbose script is needed.
}

// Creates our models and force-sync them with the database.
// Returns a Promise.
gulp.task('insert-models', () => {
    return schema.sequelize.sync({
        force: true,
        ...options,
    })
})

// Closes our sequelize connection to the database.
gulp.task('disconnect-sequelize', (callback) => {
    schema.sequelize.close()
    callback()
})




// POPULATING THE DB

// All these functions populates some tables of our database
// and return a Promise.

gulp.task('insert-my-table-entries', (callback) => {
    return new Promise((resolve, reject) => {
        return fs.readdir(MY_TABLE_ENTRIES, (err, files) => {
            return err ? reject(err) : resolve(files)
        })
    }).then((files) => {
        return Promise.all(
            files.map((file) => {
                var data = require(path.join(MY_TABLE_ENTRIES, file))

                return schema.TestTablePeople.create(data.attributes, {
                        ...options,
                    })
            })
        )
    })
})

gulp.task('insert-all', (callback) => {
    sequence(
        'insert-models',
        'insert-my-table-entries',
        'disconnect-sequelize',
        callback
    )
})




// TYPESCRIPT MODEL GENERATION

gulp.task('generate-models', (callback) => {
    const sequelizeAuto = new SequelizeAuto(
        DB_CONFIG.database,
        DB_CONFIG.username,
        DB_CONFIG.password,
        {
            host: DB_CONFIG.host,
            dialect: DB_CONFIG.dialect,
            directory: MODELS_FOLD,
            typescript: true,
            ...options,
        }
    )

    sequelizeAuto.run((err) => {
        if (err) throw err
        callback()
    })
})




// TESTS (TRANSPILATION + RUNNING)

var tsTests = ts.createProject(path.join(__dirname, '/tsconfig.json'))

gulp.task('build-tests', () => {
    return tsTests.src()
        .pipe(sourcemaps.init())
        .pipe(tsTests())
        .js
        .pipe(sourcemaps.write('.', {sourceRoot: '../'}))
        .pipe(gulp.dest(DIST_FOLD))
})

gulp.task('run-test-all', ['build-tests', 'copy-config', 'copy-secret', 'copy-config-function', 'copy-model-definition'], () => {
    return gulp.src('.')
        .pipe(mocha())
})




// DEPLOYMENT TASK-GROUP

const submodule = require('gulp-submodule')(gulp)
const server = gulp.submodule('server', {filepath: './server/gulpfile.js'})

gulp.task('deploy', (callback) => {
    sequence(
        'insert-all',
        'clean-all',
        'generate-models',
        'server:clean',
        'server:build',
        'run-test-all',
        callback
    )
})




// GENERIC TASKS

gulp.task('copy-config', () => {
    return gulp.src(CONFIG_FOLD + '/**/*.json')
        .pipe(gulp.dest(path.join(DIST_FOLD, '/config')))
})

gulp.task('copy-secret', () => {
    return gulp.src(SECRET_FOLD + '/**/*.json')
        .pipe(gulp.dest(path.join(DIST_FOLD, '/secret')))
})

gulp.task('copy-config-function', () => {
    return gulp.src(path.join(__dirname, '/config.js'))
        .pipe(gulp.dest(DIST_FOLD))
})

gulp.task('copy-model-definition', () => {
    return gulp.src(DATA_FOLD + '/*.js')
        .pipe(gulp.dest(path.join(DIST_FOLD, '/data')))
})

gulp.task('clean-models', () => {
    return del([MODELS_FOLD])
})

gulp.task('clean-tests', () => {
    return del([DIST_FOLD])
})

gulp.task('clean-all', ['clean-models', 'clean-tests'])
