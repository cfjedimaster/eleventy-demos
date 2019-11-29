---
layout: post
title: "Adding Ice Bear to Alexa, Because Why Not?"
date: "2018-11-28"
categories: ["development"]
tags: ["alexa","webtask"]
banner_image: /images/banners/Ice_bear.jpg
permalink: /2018/11/28/adding-ice-bear-to-alexa-because-why-not
---

Before I begin, let me stress that this is not a post meant to introduce you to Amazon Alexa development. I've got a [series of blog posts](https://www.raymondcamden.com/tags/alexa/) talking about Alexa development and I plan to create an updated tutorial early next year. Instead, I simply wanted to share a simple skill I built a week or so ago - purely for fun - as a way of demonstrating how easy it is to do. As a reminder, you can build *any skill you want* for your Alexa devices and do not have to release them to the public. That means you can build crazy, dumb, strictly personal stuff for your own devices. As an example, I've got a skill for my Alexa devices that allows me to ask Carol whose fault it is. Because honestly, look at this face, it can't be her fault, right?

<img src="https://static.raymondcamden.com/images/2018/11/carol_glasses.jpg" alt="Carol being a bad ass" class="imgborder imgcenter">

All the skill does is simply pick from a random list of her siblings, Obama, and Trump. 

Yes, stupid, but it made her happy as hell and the point is - I think it's dang cool that you can hack on Alexa devices like this. Last time I checked you *still* couldn't do this with Google Home devices and that's why mine has been mostly ignored. 

Alright, so on to Ice Bear. Who, or what, is Ice Bear? Ice Bear is a character from the "We Bare Bears" show.

<img src="https://static.raymondcamden.com/images/2018/11/wbb.jpg" alt="We Bare Bears image" class="imgborder imgcenter">

This is a children's show that - like many of them nowadays - can be pretty fun for adults too. (Or adults who still play with Star Wars toys.) Ice Bear is one of three bears and speaks in the third person. For example...

<img src="https://static.raymondcamden.com/images/2018/11/icebear.jpg" alt="All Ice Bear's friends are future enemies." class="imgborder imgcenter">

It probably doesn't translate well here, but in the show it is funny as hell. I thought it would be cool to build an Alexa skill that would select a random Ice Bear quote. Here's how I built it.

First, I Googled for "ice bear quotes", and not surprisingly, found a [wiki page](http://webarebears.wikia.com/wiki/Ice_Bear/Quotes) containing a list of them. I then inspected one of the quotes to look at the DOM:

<img src="https://static.raymondcamden.com/images/2018/11/dom1.jpg" alt="DOM inspection of a web page" class="imgborder imgcenter">

I've called out two things in particular in the screen shot above. You can see the main quote is a simple `P` element. But then I noticed that it was wrapped in a table with class `cquote`. Cool. So I switched to my console and entered:

```js
quotes = document.querySelectorAll('table.cquote p')
```

The CSS selector there should match the `P` tags inside the tables. It returned a NodeList of 133 items, which seemed correct to me. But now I needed to get the text. I created a new empty array (again, all of this is in my browser console):

```js
let q = []
```

And then loop over `quotes` to get the textual content.

```js
quotes.forEach(quote => q.push(quote.textContent))
```

I ran a quick test to see:

<img src="https://static.raymondcamden.com/images/2018/11/dom2.jpg" alt="Sample output from checking a quote." class="imgborder imgcenter">

Cool. So the extra line break at the end bothered me a bit. I fixed that with a regex:

```js
q = q.map(quote => quote.replace(/\n/,''))
```

Note I'm using hipster JavaScript fat arrow functions here and Google totally should have hired me despite my sucky Sudoku solution tester. The final step was to get this data out of the browser. Luckily, you can copy to the clipboard via the console:

```js
copy(q)
```

Woot. Ok, I've got an array of quotes. Now to write the server side code. I created a new [Webtask](https://webtask.io), my current favorite serverless platform, and whipped up the following:

```js
const quotes = ["Ice Bear meant to do that.", "Ice Bear wants justice.", "Ice Bear has a conspiracy theory.", "Ice Bear wants lattè.", "Ice Bear wants to move in.", "Ice Bear bought these legally.", ];


/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getQuote() {
  return quotes[getRandomInt(0, quotes.length - 1)];
}

/**
* @param context {WebtaskContext}
*/
module.exports = function(context, cb) {
  
  var response = {
    "version": "1.0",
    "response" :{
      "shouldEndSession": true,
      "outputSpeech": {
        "type": "PlainText",
        "text": getQuote()
        }
      }
  };
    
  cb(null, response);

};
```

Note that the `quotes` variable above is heavily truncated for this post. All my code does is random select a quote and then output the correct JSON response for Alexa. Again, I'm not going to go into detail about working with Alexa, but for *very* simple skills like mine, this was all that was required. I went into the Alexa development portal, created my new skill, and set up the one intent it needed to operate. Intents are like broad categories of communication with your skill. For example, when you go to Starbucks and speak to the person behind the counter, in general your conversations are limited to ordering and asking about the menu. You can think of that as two intents - "Order" and "Menu". Each intent will have a set of sample utterances which are basically ways to express the intent. You do not have to list every single possible iteration but the more you do, the more flexible your skill is. Here's a screen shot to give you an idea of the interface.

<img src="https://static.raymondcamden.com/images/2018/11/alexa1.jpg" alt="Alexa dev portal interface" class="imgborder imgcenter">

I then had to point it to the URL of my webtask, and for my own purposes, that was all I needed to do. But for the hell of it, I decided to attempt to release it publicly. There's a number of things you have to do to release an Alexa skill publicly, one of involves adding a complex layer of security to your skill. Luckily you can do that in a few seconds via the method I described here: [Using Alexa with Webtasks](https://goextend.io/blog/using-alexa-with-webtask). 

Normally my "release" process is - I submit the skill - Amazon finds bugs - and I repeat. It is a painful process at times, but the Amazon reviewers do a *damn* good job of giving you *very* explicit steps to recreate the bugs they found. In this case, I actually passed on the first try. (Surely they missed something.) If you've got an Alexa-powered device, you can ask her right now: "Alexa, ask ice bear for a quote." You can also visit the "product" page here: <https://www.amazon.com/Raymond-Camden-Ice-Bear/dp/B07KJN4K13>. I'm kinda surprised no one had claimed "ice bear" as an invocation name, but I guess I got lucky. 

Anyway, I hope this is interesting, and if you have any questions about what I did, just add a comment below. 

<img src="https://static.raymondcamden.com/images/2018/11/icebearcomments.jpg" alt="Ice Bear Loves Comments" class="imgborder imgcenter">
