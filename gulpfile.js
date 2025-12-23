const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const sync = require("browser-sync").create();
const replace = require("gulp-replace");
const citiesConfig = require("./cities-config");

// Clean
const clean = () => {
  return del("build");
};

// Функция для обработки стилей для конкретного города
const stylesForCity = (city) => {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest(`build/${city.code}/css`))
    .pipe(sync.stream());
};

// Функция для обработки скриптов для конкретного города
const scriptsForCity = (city) => {
  return gulp
    .src("source/js/script.js")
    .pipe(replace(/{{CITY_NAME}}/g, city.name))
    .pipe(replace(/{{CITY_CODE}}/g, city.code))
    .pipe(replace(/{{CITY_CASE}}/g, city.case))
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest(`build/${city.code}/js`))
    .pipe(sync.stream());
};

// Функция для обработки HTML для конкретного города
const htmlForCity = (city) => {
  return gulp
    .src(["source/**/*.html", "!source/statji/**"]) // ИСКЛЮЧАЕМ HTML из statji
    .pipe(replace(/{{CITY_NAME}}/g, city.name))
    .pipe(replace(/{{CITY_CODE}}/g, city.code))
    .pipe(replace(/{{CITY_CASE}}/g, city.case))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(`build/${city.code}`));
};

// Копирование ресурсов для конкретного города
const copyForCity = (city) => {
  return gulp
    .src(
      [
        "source/fonts/*.{woff2,woff}",
        "source/*.ico",
        "source/img/**/*.svg",
        "!source/img/icons/*.svg",
        "!source/statji/**", // ИСКЛЮЧАЕМ всю папку statji
      ],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest(`build/${city.code}`));
};

// Оптимизация изображений для города
const optimizeImagesForCity = (city) => {
  return gulp
    .src(["source/img/**/*.{png,jpg,svg,jpeg}", "!source/statji/**"]) // ИСКЛЮЧАЕМ statji
    .pipe(
      imagemin([
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo(),
      ])
    )
    .pipe(gulp.dest(`build/${city.code}/img`));
};

// WebP для города
const createWebpForCity = (city) => {
  return gulp
    .src(["source/img/**/*.{jpg,png,jpeg}", "!source/statji/**"]) // ИСКЛЮЧАЕМ statji
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest(`build/${city.code}/img`));
};

// Sprite для города
const spriteForCity = (city) => {
  return gulp
    .src("source/img/icons/*.svg")
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(`build/${city.code}/img`));
};

// Основные задачи для каждого города
const processCity = (city) => {
  return gulp.series(
    (done) => {
      console.log(`Обработка города: ${city.name}`);
      done();
    },
    gulp.parallel(
      () => stylesForCity(city),
      () => scriptsForCity(city),
      () => htmlForCity(city),
      () => copyForCity(city),
      () => optimizeImagesForCity(city),
      () => createWebpForCity(city),
      () => spriteForCity(city)
    )
  );
};

// Создаем отдельные задачи для каждого города
citiesConfig.forEach((city) => {
  gulp.task(`build-${city.code}`, processCity(city));
});

// Основная сборка для всех городов
const buildAllCities = gulp.series(
  clean,
  gulp.parallel(...citiesConfig.map((city) => `build-${city.code}`))
);

// Server для разработки (первый город по умолчанию)
const server = (done) => {
  const defaultCity = citiesConfig[0].code;
  sync.init({
    server: {
      baseDir: `build/${defaultCity}`,
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Watcher для разработки
const watcher = () => {
  const defaultCity = citiesConfig[0].code;
  gulp.watch("source/sass/**/*.scss", gulp.series(`build-${defaultCity}`));
  gulp.watch("source/js/script.js", gulp.series(`build-${defaultCity}`));
  gulp.watch(
    ["source/**/*.html", "!source/statji/**"],
    gulp.series(`build-${defaultCity}`)
  );
};

// Reload
const reload = (done) => {
  sync.reload();
  done();
};

// Экспорты
exports.clean = clean;
exports.build = buildAllCities;

// Default task (для разработки - первый город)
exports.default = gulp.series(
  `build-${citiesConfig[0].code}`,
  gulp.series(server, watcher)
);
