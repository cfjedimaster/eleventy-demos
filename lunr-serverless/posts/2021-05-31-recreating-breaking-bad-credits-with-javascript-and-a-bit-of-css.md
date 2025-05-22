---
layout: post
title: "Recreating Breaking Bad Credits with JavaScript (and a bit of CSS)"
date: "2021-05-31T18:00:00"
categories: ["javascript"]
tags: "post"
description: Using JavaScript to mimic Breaking Bad's credit effects
---

I try to exercise every week day (although with today being a holiday I gave myself a pass). In order to make the exercise a bit more palatable, I'll watch a good show while I'm exercising. The best shows are those that are an hour long on TV since they are typically right at forty-five minutes with commercials removed. Forty-five minutes is my target workout length so that works out great. Currently I'm rewatching "Breaking Bad", an incredibly good show I've watched before but am enjoying all over again. 

One of the signature things of the show is their credits. I don't mean the short opening sequence, but rather the credits shown at the bottom in the beginning of the show. For each person's name, they attempt to replace part of the name with a matching element's symbol. They keep the case of the symbol and apply a green color to it. Here's an example:

<p>
<img src="https://static.raymondcamden.com/images/2021/05/bbcredits.jpg" alt="Shot from the opening of Breaking Bad" class="lazyload imgborder imgcenter">
</p>

Because I was bored, and because it wasn't necessarily useful, I took a stab at seeing if I could build this in JavaScript (with a bit of CSS of course). 

I began by googling for "periodic table json" and found a GitHub project with the elements in JSON format: <https://github.com/Bowserinator/Periodic-Table-JSON/blob/master/PeriodicTableJSON.json> This JSON file had a lot of data I didn't need, so I copied it to my [RunJS](https://runjs.app/) application. If you haven't tried RunJS, it's a great "scratch pad" for JavaScript. It even supports npm modules. 

Anyway, I used RunJS to do a few things. First, I knew I only needed the symbols, nothing more. So I wrote code to iterate over the array of elements and return a new array of just the symbols. Next, I figured that the effect would be better when it could replace a two character symbol versus a one character symbol. (At the time, I wasn't aware of the three character symbol for Ununennium.) I used a quick array sort to order the array of symbols longest to shortest. This then gave me an array of just symbols sorted in a more preferable manner. 

Then I wrote up the function. All it does is take an input name, the list of elements, and the name of a CSS class to apply to matches. Here's how I wrote it:

```js
function bbString(input, className, elements) {
	// loop through elements and once we find ONE match, return
	let lcaseInput = input.toLowerCase();
	for(let i=0; i<elements.length; i++) {
		let elem = elements[i];
		let match = lcaseInput.indexOf(elem.toLowerCase());
		if(match >= 0) {
			return input.substring(0, match) + `<span class="${className}">` + elem + "</span>" + input.substring(match + elem.length);
		}
	}
	return input;
}
```

Most likely this could be written in fewer lines and with more "I can pass the Google interview test" coolness, but it worked. I then used the [Random User Generator](https://randomuser.me/) to spit out a hundred users, copied that into RunJS again and used it to return just an array of names. For fun, I then added mine on top. (I also removed a few names that used non-Roman letters to keep things simpler.) Here's how it looks:

<p>
<img src="https://static.raymondcamden.com/images/2021/05/bb2.jpg" alt="Example output showing matched elements replaced with green text" class="lazyload imgborder imgcenter">
</p>

And that's it. Here's a CodePen if you want to play with yourself. Enjoy!

<p class="codepen" data-height="400" data-theme-id="dark" data-default-tab="js,result" data-user="cfjedimaster" data-slug-hash="OJpxQvj" style="height: 400px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Breaking Bad CSS">
  <span>See the Pen <a href="https://codepen.io/cfjedimaster/pen/OJpxQvj">
  Breaking Bad CSS</a> by Raymond Camden (<a href="https://codepen.io/cfjedimaster">@cfjedimaster</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>