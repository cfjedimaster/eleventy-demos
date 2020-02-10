const chalk = require('chalk');
const TextLintEngine = require('textlint').TextLintEngine;
const options = {
  rules: ["alex", "no-start-duplicated-conjunction", "terminology"]
};
const engine = new TextLintEngine(options);

module.exports = function(eleventyConfig) {

  eleventyConfig.addLinter("textlinter", async function(content, inputPath, outputPath) {

    // Some rules don't like the HTML
    content = content.replace(/<.*?>/g, '');

    let results = await engine.executeOnText(content);
    //console.log(JSON.stringify(results));
    for(let i=0; i<results.length; i++) {
      for(let x=0; x<results[i].messages.length; x++) {
        let msg = `[${inputPath}] `+results[i].messages[x].message
        console.log(chalk.yellow(msg));
      }
    }

  });

};