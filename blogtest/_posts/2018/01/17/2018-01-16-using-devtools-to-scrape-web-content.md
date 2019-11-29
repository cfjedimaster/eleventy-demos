---
layout: post
title: "Using DevTools to Scrape Web Content"
date: "2018-01-17"
categories: [development]
tags: [javascript]
banner_image: 
permalink: /2018/01/17/using-devtools-to-scrape-web-content
---

So yesterday I [blogged](https://www.raymondcamden.com/2018/01/16/generating-random-cure-song-titles/) a demo that was - by my own admission - somewhat silly and not really worth your time to read. However, I was thinking later that there was one particular aspect of how I built that demo that may be actually be useful. 

While I was creating the demo, I needed to get a list of all the songs the Cure recorded. I found this quickly enough on [Wikipedia](https://en.wikipedia.org/wiki/Category:The_Cure_songs):

![Screen shot of Wikipedia page](https://static.raymondcamden.com/images/2018/1/dtcure1.jpg)

So there's only 67 songs there - in theory I could have typed that in about 5 minutes. But why do something by hand when you can use code?!?!?

I began by right clicking on the first link and selecting "Inspect Element." (As a quick FYI, I'm using Firefox for this, but everything I'm showing should work in every modern browser. And shoot - I just tested and it's not supported in Edge. Tsk tsk.)

![Screen shot of devtools focused on the link tag](https://static.raymondcamden.com/images/2018/1/dtcure2.jpg)

It may be a bit hard to see in the screen shot, but I noticed two things here. First, the link used a `title` attribute with the name of the song. Second, I noticed there was a div named `mw-category` that appeared to "wrap" all the links. I figured this out by mousing over the div in the Inspector panel and noticing the highlight above.

![Screen shot of devtools showing the div highlighted](https://static.raymondcamden.com/images/2018/1/dtcure3.jpg)

Cool. So now I switched to the Console. For my first command, I wanted to grab all the links within that div:

	links = document.querySelectorAll('.mw-category a');

When it was done, I tested to see if it seemed right by checking the length:

![Confirming I got the right data](https://static.raymondcamden.com/images/2018/1/dtcure4.jpg)

Notice how I got 67 items and it matches what the Wikipedia page says as well. Cool! So, now I've got a [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) of data that I can iterate over like an array. (It *isn't* an array, but I can use it as such.) So first I made a new array:

	titles = [];

And then I populated it:

	links.forEach((a) => titles.push(a.title));

And when done, I took a quick look to ensure it seemed ok:

![Testing the titles value](https://static.raymondcamden.com/images/2018/1/dtcure5.jpg)

Cool! And for the final operation, I simply copied it to my clipboard using:

	copy(titles)

This is the only part that is not supported by Edge. Hopefully they add that soon. The end result is a string version of the array I was able to drop right into my editor and go to town with. 

If any of the following didn't make sense, I've created a quick video showing the process I went through.

<iframe width="560" height="315" src="https://www.youtube.com/embed/NsJ_xAOaPus?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>