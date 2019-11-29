---
layout: post
title: "Building an HTML5 Comic Book Reader - in 2018"
date: "2018-02-28"
categories: [html5,javascript,jquery]
tags: []
banner_image: /images/banners/comicbooks2018.jpg
permalink: /2018/02/28/building-an-html5-comic-book-reader-in-2018
---

Nearly six years ago I [created a demo](https://www.raymondcamden.com/2012/05/29/Building-an-HTML5-Comic-Book-Reader/) of a web-based comic book reader. For those of you who aren't comic book readers, you may not be aware that there are a few standard file formats for digital comics. Way back in 2012 I built a JavaScript-based parser to work with those formats, well one of them, and it actually worked well:

<img src="https://static.raymondcamden.com/images/ScreenClip90.png">

Comic books are typically stored in two file formats - CBR and CBZ. CBRs are simply RAR files and CBZs are zips. CBR seems to be much more common, but at the time I wrote the demo I was unable to find any JavaScript library that handled them. 

Another thing I did back then was use the FileSystem API to handle storing images. This was only supported by Chrome and is now deprecated. If you want to store binary data, you should make use of IndexedDB which now supports binary data well.

I decided to take a look into how I could update this code and was surprised to find an excellent library that handles both zips and rars. Heck, it even handles tar files. [uncompress.js](https://github.com/workhorsy/uncompress.js) worked well for my demo despite a lack of documentation. The author does provide multiple examples though. By piecing together various examples and just generally messing around, I got the new version working. 

It now works well in Firefox and Chrome, and is *hella* fast. I didn't update it to Vue, or upgrade the old jQuery or Bootstrap, but that could be done by someone wanting to file a PR. 

If you want to test it out, point your browser here: http://cfjedimaster.github.io/HTML5ComicBookReader/index.html

The source code can be found here: https://github.com/cfjedimaster/HTML5ComicBookReader/

I won't share all the code here as it is a lot of DOM manipulation (and again, Vue would make this much prettier), but here is the main method fired when a file is dropped onto the DOM.

```js
function handleFile(file) {
	console.log('try to parse '+file.name);

	images = []; 
	curPanel = 0;
	$("#comicImg").attr("src","");
	$("#buttonArea").hide();

	archiveOpenFile(file, null, function(archive, err) {
		if (archive) {

	    	var modalString = 'Parsed the CBZ - Saving Images. This takes a <b>long</b> time!';
	    	$("#statusModalText").html(modalString);
			$("#statusModal").modal({% raw %}{keyboard:false}{% endraw %});

			console.info('Uncompressing ' + archive.archive_type + ' ...');
			// filter archive entries to files
			let imageArchive = archive.entries.filter(e => {
				return e.is_file;
			});

			imageArchive.forEach(entry => {

				entry.readData(function(data, err) {
					let url = URL.createObjectURL(new Blob([data]));
					images.push(url);

					var perc = Math.floor(images.length/archive.entries.length*100);
					var pString = `
						Processing images.
						<div class="progress progress-striped active">
						<div class="bar" style="width: ${% raw %}{perc}{% endraw %}%;"></div>
						</div>
					`;
					$("#statusModalText").html(pString);
					if(imageArchive.length === images.length) {
						$("#statusModal").modal("hide");
						$("#buttonArea").show();
						drawPanel(0);
					}					
				});
			});


		} else {
			console.error(err);
			doError(err);
		}
	});

}
```

The really crucial part is `archiveOpenFile`. That handles recognizing the type and figuring out the details. You get an archive object that contains data about all the entries. I filter that to files and then create image URLs for all the images. 

And honestly that's it. I'm sure a lot of improvements could be made still, but I was pretty shocked by how well this worked and how darn fast it was. Anyway, enjoy!

<i>Header photo by <a href="https://unsplash.com/photos/ydHrpfgJNPo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Lena Orig</a> on Unsplash</i>