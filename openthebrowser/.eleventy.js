module.exports = function(eleventyConfig) {

 eleventyConfig.setServerOptions({
    module: "@11ty/eleventy-server-browsersync",
    open: true
  })


};