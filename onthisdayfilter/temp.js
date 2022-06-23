/*
A quick script to change my posts to something more appropriate for this demo, 
specifically modifying the peramalink.
*/


// https://coderrocketfuel.com/article/recursively-list-all-the-files-in-a-directory-using-node-js
const fs = require("fs")
const path = require("path")

const getAllFiles = function(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
    }
  })

  return arrayOfFiles
}

let files = getAllFiles('./src/posts');
//files = files.slice(0,10);
console.log(`fix ${files.length} files.`);

files.forEach(f => {
	let contents = fs.readFileSync(f,'utf8');
	// permalink: /2018/01/05/another-example-of-vuejs-and-vuex-an-api-wrapper
	contents = contents.replace(/permalink: (.+)/, "permalink: $1.html");
	fs.writeFileSync(f, contents);
});
