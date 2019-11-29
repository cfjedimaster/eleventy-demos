---
layout: post
title: "Working with MP3s, ID3, and PhoneGap/Cordova"
date: "2015-04-29T17:06:44+06:00"
categories: [development,javascript,mobile]
tags: [cordova]
banner_image: 
permalink: /2015/04/29/working-with-mp3s-id3-and-phonegapcordova
guid: 6084
---

As someone who remembers when MP3s became a de facto standard for audio files (<sup>*</sup>), I'm pretty familiar with the format used to embed metadata within them - <a href="http://id3.org/">ID3</a>. If you've ever wondered how your favorite MP3 player displayed data about your music (artist, album, year, etc.), most likely it came from the ID3 tags embedded in the file. Almost ten years ago I even <a href="http://www.raymondcamden.com/2006/06/13/Reading-MP3-ID3-tags-with-ColdFusion">blogged</a> about parsing them with ColdFusion. I thought it would be interesting to take a look at how ID3 parsing could be done within a PhoneGap/Cordova application.

<!--more-->

For my testing, I decided to use an open source JavaScript ID3 project at GitHub: <a href="https://github.com/aadsm/JavaScript-ID3-Reader">JavaScript-ID3-Reader</a>. My biggest concern was performance. In the ReadMe for the project, they mention that if your web server supports the HTTP Range feature, it will only grab the bits it need. (If I remember right, the ID3 data is all at the end of the MP3 file.) Otherwise it reads in the entire file which - obviously - won't perform well. I decided to give it a shot anyway and see what my results would be.

I decided to test this on my HTC M8. I've got a few MP3s there on my SD card and wrote a quick proof of concept that would scan one hard coded directory. One cool thing about the JavaScript-ID3-Reader is that it supports FileEntry objects and you can get FileEntry objects using Cordova's File plugin. Let's take a look at my first stab at this. I'm sharing just the JavaScript as the HTML is literally just a div block for me to write crap out too. In the next post I'll be adding a proper UI to this.

<pre><code class="language-javascript">document.addEventListener(&quot;deviceready&quot;, init, false);

//A hard coded folder, to keep things simple
var mp3Folder = &quot;Music/Depeche_Mode/101_(1_of_2)/&quot;;
var result;

function init() {


	window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + mp3Folder,
	function(dir) {
			var reader = dir.createReader();
			//read it
			reader.readEntries(function(entries) {
					console.log(&quot;readEntries&quot;);
					console.dir(entries);

					entries.forEach(function(entry) {

						var name = entry.name;
						console.log(name);

						entry.file(function(file) {

							ID3.loadTags(name,function() {
								var tags = ID3.getAllTags(name);
								console.log(&quot;got tags for &quot;+name, tags);
							},{
								dataReader:FileAPIReader(file)
							});

						});


					});

			});

	}, function(err) {

	});

}</code></pre>

Ok, so let's take this from the top. I'm using a Cordova File plugin alias for the SD card. This is an Android only alias but as I said - I'm testing on my phone. Speaking of - I used an app to browse to one particular folder (in this case, disc one of Depeche Mode's excellent live album, 101). Once I convert that path into a directory object, it is then a simple matter of reading the entries from the directory. Once I've got the list of entries, I then loop over them and use the Javascript library's API to get the ID3 tags. If you check their docs, you can see additional options, but for the most part I just wanted all the tags so that what I did. 

This promptly crashed and crapped the bed with an out of memory error. I then figured that the entry.file calls - being async - were running the ID3 parser for multiple mp3 files at the same time. I then rewrote the logic to handle the calls in order. This isn't necessarily pretty, but it worked right away:

<pre><code class="language-javascript">document.addEventListener(&quot;deviceready&quot;, init, false);

//A hard coded folder, to keep things simple
var mp3Folder = &quot;Music/Depeche_Mode/101_(1_of_2)/&quot;;
var result;

function init() {

	result = document.querySelector(&quot;#results&quot;);

	result.innerHTML = &quot;Stand by, parsing MP3s...&lt;br/&gt;&quot;;

	window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + mp3Folder,
	function(dir) {
			var reader = dir.createReader();
			//read it
			reader.readEntries(function(entries) {
					console.log(&quot;readEntries&quot;);
					console.dir(entries);
					result.innerHTML += entries.length + &quot; files to process.&lt;br/&gt;&quot;;

					var data = [];

					var process = function(index, cb) {
						console.log(&quot;doing index &quot;+index);
						var entry = entries[index];
						var name = entry.name;
						entry.file(function(file) {

							ID3.loadTags(entry.name,function() {
								var tags = ID3.getAllTags(name);
								data.push({% raw %}{name:entry.name, tags:tags}{% endraw %});
								console.log(&quot;got tags for &quot;+entry.name, tags);
								result.innerHTML += &quot;*&quot;;
								if(index+1 &lt; entries.length) {
									process(++index, cb);
								} else {
									cb(data);
								}
							},{
								dataReader:FileAPIReader(file)
							});

						});

					};

					process(0, function(data) {
						console.log(&quot;Done processing&quot;);
						console.dir(data);
						//make a simple str to show stuff
						var s = &quot;&quot;;
						for(var i=0; i&lt;data.length; i++) {
							s += &quot;&lt;p&gt;&quot;;
							s += &quot;&lt;b&gt;&quot;+data[i].tags.title+&quot;&lt;/b&gt;&lt;br/&gt;&quot;;
							s += &quot;By &quot;+data[i].tags.artist+&quot;&lt;br/&gt;&quot;;
							s += &quot;Album: &quot;+data[i].tags.album+&quot;&lt;br/&gt;&quot;;
							s += &quot;&lt;/p&gt;&quot;;
						}
						result.innerHTML = s;
					});


			});

	}, function(err) {

	});

}</code></pre>

In this version, I've used a simple counter and made a loop that calls itself until all the entries have processed. I then added simple code that writes out to the DOM the results. 

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/device-2015-04-29-170149.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/device-2015-04-29-170149.png" alt="device-2015-04-29-170149" width="563" height="1000" class="alignnone size-full wp-image-6085" /></a>

So how well does it work? I fired up Chrome Remote Debug and watched it process. I'd say it takes about 1 second for each file to parse. That's not speedy - but you could easily cache these results so you aren't reparsing the MP3 on every request. You could also quickly display the file name (soandso.mp3) until you get the proper title from the ID3 info. That way a user could see the names, play the files, etc and then your code could update the display as it gets them. 

In the next version of this project, I'll be adding an Ionic front end to the code and making it a bit prettier. I'll also make it more generic so it can work on iOS and Android. I'll be sharing the full source code, but I want to complete the second version before I push to my <a href="https://github.com/cfjedimaster/cordova-examples">Cordova Examples</a> repo.

<sup>*</sup> I'm old enough to remember downloading music files in... AIFF format I think... back in 96 or so. I can remember thinking how cool it was (and illegal) that I could download 5-6 meg files of - if I remember right - Journey. Oh, and it took about 15 minutes for these files to download at my college's Sun something or another computer lab. Yeah - I'm old.