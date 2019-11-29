---
layout: post
title: "Using JavaScript, IndexedDB to cheat at WordBrain"
date: "2015-07-17T08:45:09+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2015/07/17/using-javascript-indexeddb-to-cheat-at-wordbrain
guid: 6417
---

Warning - what follows is a complete waste of time. Do not spend time reading this blog post. Still here? Of course you are. For the past few days I've been addicted to a cool little game called <a href="https://play.google.com/store/apps/details?id=se.maginteractive.wordbrain">WordBrain</a>. It is a simple idea. You're presented with a grid of letters and must find two words within it by drawing a 'path' from one letter to the next. I like word games, but oddly have never really played any on my mobile devices before. Now I know why - they're incredibly addictive. While playing a few days ago I found myself stuck on one particular puzzle. 

<!--more-->

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/device1mod.png" alt="device1mod" width="422" height="750" class="aligncenter size-full wp-image-6418" />

I've obscured the hints in case you want to try to figure it out yourself before reading on. The obscured area though does provide you with a clue. You get the length of each word. In this case, the first word is five letters long and the second one is four letter.

One thing you run into very early in the game is that there will almost always be valid words that don't match. So looking at the puzzle above you'll see FONT, PINT, PITA, and possibly more words. They are valid, but not what the puzzle wants. 

As I stared at this puzzle and got more and more frustrated, I naturally thought - I bet I could cheat at this! I'm absolutely pro-cheating in games. Heck, I <i>learned</i> to program because I wanted to cheat. I figured out hex so I could edit my Bard's Tale characters (and it worked, so hah). 

Given that we know the length of a word, and we can figure out a 'path' through the grid, and assuming we can find an English word list, in theory, it should be possible to figure out all the possible words, right?

Heck yes! 

I began by finding a good English word list: <a href="http://dreamsteep.com/downloads/word-games-and-wordsmith-utilities/120-the-english-open-word-list-eowl.html">The English Open Word List</a>. The web site describes the data like so:

<blockquote>
The EOWL currently contains about 128,985 words. To make EOWL more usable for computer word games there are no words longer than 10 letters, and no proper nouns or words requiring diacritical symbols, hyphens, or apostrophes.
</blockquote>

Sounds perfect, right? The source data consists of one file per letter, so I combined them into one big text file with a word per line:

<pre><code class="language-markup">aa
aah
aal
aalii
aardvark
aardvarks
aardwolf
aardwolves
aargh
aarrghh
aasvogel
aasvogels
and so one for a long, long, time
</code></pre>

While some of the words were a bit questionable (like that last one), I figured it would be a good source set. I didn't want to keep all of this data in memory, so I decided I'd used IndexedDB to store the words. Here is how the application starts up:

<pre><code class="language-javascript">//globals
var db;
var $wordLength;
var $wordGrid;

$(document).ready(function() {
	if(!(&quot;indexedDB&quot; in window)) {
		alert(&quot;This will not work for you. Your browser must support IndexedDB.&quot;);	
		return;
	}
	
	$wordLength = $(&quot;#wordLength&quot;);
	$wordGrid = $(&quot;#wordGrid&quot;);
	
	loadDatabase();
		
});

function loadDatabase() {
	var words;

	var openDB = indexedDB.open(&quot;words2&quot;, 1);
	openDB.onupgradeneeded = function(e) {
		
		var thisDB = e.target.result;
		
		if(!thisDB.objectStoreNames.contains(&quot;words&quot;)) {
			var store = thisDB.createObjectStore(&quot;words&quot;, {% raw %}{keyPath:&quot;word&quot;}{% endraw %});
			store.createIndex(&quot;length, word&quot;, [&quot;length&quot;,&quot;word&quot;]);
		}

	}
	
	openDB.onerror = function(e) {
		console.log(&quot;Error opening/setting up db&quot;);
		console.dir(e);	
	}
	
	openDB.onsuccess = function(e) {
		db = e.target.result;
		if(!localStorage[&quot;dataloaded&quot;]) {
			console.log(&quot;begin loading the db, first, we XHR the data.&quot;);
			seedData(startUI);
		} else {
			startUI();
		}
	}
	
	
	var seedData = function(cb) {
		$.get(&quot;allwords.txt&quot;).then(function(res) {
			words = res.split(&quot;\n&quot;);
			console.log(&quot;Going to load &quot;+words.length + &quot; words.&quot;);
		
			console.log(&quot;seeding data&quot;);
			var transaction = db.transaction([&quot;words&quot;], &quot;readwrite&quot;);
			var store = transaction.objectStore(&quot;words&quot;);
			
			for(var i=0;i&lt;words.length;i++) {
				if(i%250 == 0) console.log(&quot;250 done&quot;);
				if(words[i].length &gt; 0) store.add({% raw %}{word:words[i].toLowerCase(),length:words[i].length}{% endraw %});
			}
		
			transaction.onerror = function(e) {
				console.log(&quot;transaction error&quot;);
				console.dir(e);
			}
			
			transaction.oncomplete = function(event) {
				console.log(&quot;I think I'm done now. Yeah probably&quot;);
				localStorage[&quot;dataloaded&quot;] = 1;
				cb();	
			}
		});

	}
}</code></pre>

Taking it from the top, and ignoring globals variables and the such, I start off with a call to open up and setup my IndexedDB. This is fairly boiler plate, but I will point out the compound index was based on an initial idea I had for getting the solution. I ended up not using it. The seedData function just does an XHR and loads the word list. The file is 1.1 megs which is large, but not horribly so, and we only need to load it one time. I loop over the words and store each value in my IndexedDB object store. (And again, I'm storing the length because of some plans I had originally that changed while I was working. I'll detail that in a sec.)

So at this point, I've got a database of words. Now I need to ask the user for the length of the word they want to find and have them input the grid. I could have made something fancy, but I just used form fields:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot15.png" alt="shot1" width="167" height="71" class="aligncenter size-full wp-image-6419 imgborder" />

How in the heck do we solve this? Considering we have a grid, we can iterate over every letter, and find every possible N-lengthed path from there. The game allows a path of any direction and you can't go over a previously used square. My initial thought was this:

<ul>
<li>Start at the upper left and find the paths from there.</li>
<li>We'd have: RF, RN, and RO.</li>
<li>We can search the IDB for words that are N characters long that begin with RF, etc. If any match, then find paths from RF.
</ul>

In theory, using the data above, RF and RN would "die" as possibilities but RO would not. I began to work down this path but had difficulty with the asynch nature. I thought about using promises, but... it just didn't click. To be honest, someone smarter could probably figure it out. I decided to take another approach.

<ul>
<li>For each letter, get all the N length paths possible.</li>
<li>Given a monster list of N length words, check to IDB to see if it is a valid word.</li>
<li>Profit</li>
</ul>

Here is my ugly, incredibly ugly, solution. Note I probably have multiple unused variables and bad practices here. Also, I just output to console. Oh, and I also assume a 3x3 grid. I'm pretty sure I could make the 'find paths' portion handle any square sized grid, but for now, I'm keeping it (somewhat) simple.

<pre><code class="language-javascript">/*
Given position X, and a possibly null history, I return paths you can go
*/
function getPaths(position, size, history) {
	if(!history) history = [];
	var paths = [];
	//console.log('entered getPaths('+position+','+size+',['+history+'])');
	//check all 8 directions

	//up
	if(position &gt; 2 &amp;&amp; history.indexOf(position-3) == -1) {
		var newPath = history.slice(0);
		newPath.push(position-3);
		paths.push(newPath);			
	}

	//ne
	if(position&gt;2 &amp;&amp; position!=5 &amp;&amp; position!=8 &amp;&amp; history.indexOf(position-2) == -1) {
		var newPath = history.slice(0);
		newPath.push(position-2);
		paths.push(newPath);
	}
	
	//e
	if(position!=2 &amp;&amp; position!=5 &amp;&amp; position!=8 &amp;&amp; history.indexOf(position+1) == -1) {
		var newPath = history.slice(0);
		newPath.push(position+1);
		paths.push(newPath);
	}
	
	//se
	if(position&lt;6 &amp;&amp; position!=2 &amp;&amp; position!=5 &amp;&amp; history.indexOf(position+4) == -1) {
		var newPath = history.slice(0);
		newPath.push(position+4);
		paths.push(newPath);
	}
	
	//s
	if(position&lt;6 &amp;&amp; history.indexOf(position+3) == -1) {
		var newPath = history.slice(0);
		newPath.push(position+3);
		paths.push(newPath);
	}
	 
	//sw
	if(position&lt;6 &amp;&amp; position!=3 &amp;&amp; position!=0 &amp;&amp; history.indexOf(position+2) == -1) {
		var newPath = history.slice(0);
		newPath.push(position+2);
		paths.push(newPath);
	}
	
	//w
	if(position!=0 &amp;&amp; position!=3 &amp;&amp; position!=6 &amp;&amp; history.indexOf(position-1) == -1) {
		var newPath = history.slice(0);
		newPath.push(position-1);
		paths.push(newPath);
	}
	
	//nw
	if(position&gt;2 &amp;&amp; position!=3 &amp;&amp; position!=6 &amp;&amp; history.indexOf(position-4) == -1) {
		var newPath = history.slice(0);
		newPath.push(position-4);
		paths.push(newPath);
	}
	
	//console.log('before if, i have '+paths.length+' paths and my size is '+paths[0].length+' and it is '+paths[0]);
	//console.dir(paths);
	if(paths.length &amp;&amp; paths[0].length &lt; size) {
		var newPathResults = [];
		for(var i=0;i&lt;paths.length;i++) {
			var thisPath = paths[i];
			//console.log('inner call with tip '+thisPath[thisPath.length-1]+' size='+size+' thisPath: '+thisPath);
			var newPathsInner = getPaths(thisPath[thisPath.length-1], size, thisPath);
			//console.log('newPathsInner has results len of '+newPathsInner.length);
			for(var x=0;x&lt;newPathsInner.length;x++) {
				newPathResults.push(newPathsInner[x]);
			}
		}
		//console.log(&quot;newPathResults&quot;);
		//console.dir(newPathResults);
		return newPathResults;
	} else {
		//console.log('returning from getPaths with '+JSON.stringify(paths));
		return paths;
	}
}

function getPhrase(path) {
	var grid = $wordGrid.val();
	var gridArray = grid.split(&quot;,&quot;);
	var phrase = &quot;&quot;;
	for(var i=0;i&lt;path.length;i++) {
		phrase += gridArray[path[i]];	
	}
	return phrase;
}

function doSearch() {
	var wordlen = $wordLength.val();
	if(wordlen === '') return;
	wordlen = Number(wordlen);

	var grid = $wordGrid.val();
	/*
	grid is A,B,C,D,E,F,G,H,I
	
	A B C
	D E F
	G H I
	
	Right now we assume 3x3
	*/

	var gridArray = grid.split(&quot;,&quot;);

	var paths = [];
		
	for(var i=0;i&lt;9;i++) {
		var letter = gridArray[i];
		//console.log(&quot;position &quot;+i+&quot; letter &quot;+letter);
		//first, based on position, get initial paths
		var pathsForPos = getPaths(i,wordlen,[i]);
		//console.log(&quot;i found &quot;+pathsForPos.length+&quot; valid paths&quot;);
		for(var x=0;x&lt;pathsForPos.length;x++) {
			paths.push(pathsForPos[x]);
		}
	}
	console.log(&quot;we have &quot;+paths.length+&quot; total words to check&quot;);
	//console.dir(paths);

	//now convert them all to words to check
	var wordsToCheck = [];
	for(var i=0;i&lt;paths.length;i++) {
		wordsToCheck.push(getPhrase(paths[i]).toLowerCase());
	}
	//console.dir(wordsToCheck);

	var wordStore = db.transaction([&quot;words&quot;], &quot;readonly&quot;).objectStore(&quot;words&quot;);  
	var matches = [];
	
	wordsToCheck.forEach(function(word) {
		wordStore.get(word).onsuccess = function(e) {
			if(e.target.result) {
				var word = e.target.result.word;
				if(matches.indexOf(word) == -1) {
					console.log(word);
					matches.push(word);	
				}
			}
			//console.dir(e.target.result);	
		};
	});

}</code></pre>

Got all that? Nice and simple, right? FYI, I could have used a oncomplete for my transaction to tell the user when I'm done, but since I'm simply spitting out to the console, it doesn't matter. Also, since my code fires asynch, my "don't repeat words" code could fail too. Again, using an oncomplete would let me handle that better. Who cares! Let's see the results:

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot22.png" alt="shot2" width="385" height="369" class="aligncenter size-full wp-image-6420 imgborder" />

Woot! Cool, right? I went through the words and then discovered something weird - none of them worked. So... I gave up and used the hints system the game doles out at certain times. I discovered that the 4 letter word was RAF. Obviously that's RAFT, right? But looking at the screen shot, you can see they don't hook up. Then I remembered - when you find a word, the letters disappear and the others 'fall' down. At this point, I kid you not - I immediately saw the 5 letter word. No kidding, I figured it out in seconds. But for the heck of it, I tried my tool: 

<img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/07/shot41.png" alt="shot4" width="258" height="132" class="aligncenter size-full wp-image-6421 imgborder" />

The answer was PIANO. Selecting that left RAFT. And that's that. Want to run it yourself? Keep in mind you'll need an IDB-compatible browser and this code is <i>very</i> brittle. Here it is: <a href="https://static.raymondcamden.com/wordbrainsolver/">https://static.raymondcamden.com/wordbrainsolver/</a>