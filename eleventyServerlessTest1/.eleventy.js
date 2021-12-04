
const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

module.exports = function(eleventyConfig) {


  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: "serverless", 
    functionsDir: "./netlify/functions/"
  });

  eleventyConfig.addFilter("getWeather", function(input) {
    return "It's hot in  " + input;
  })

};