
const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {


  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: "weather", 
    functionsDir: "./netlify/functions/"
  });

  eleventyConfig.addFilter("doRay", function(input) {
    return "ray " + input;
  })

};