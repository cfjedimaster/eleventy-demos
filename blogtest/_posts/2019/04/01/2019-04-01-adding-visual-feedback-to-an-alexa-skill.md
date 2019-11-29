---
layout: post
title: "Adding Visual Feedback to an Alexa Skill"
date: "2019-04-01"
categories: ["javascript","serverless"]
tags: ["alexa"]
banner_image: /images/banners/cards.jpg
permalink: /2019/04/01/adding-visual-feedback-to-an-alexa-skill
description: A simple example of adding a card to an Alexa Skill.
---

It's been a while since I've blogged about building Alexa skills, but this weekend I played around with something I've been meaning to take a look at for quite some time - visual results. In case you weren't aware, there are multiple ways of returning visual results with an Alexa skill response. There are multiple Alexa devices that have screens (I've got an Alexa Show and Spot) and whenever you use the Alexa app itself, visual results are displayed there. To be fair, I'd be willing to bet a lot of people aren't even aware of the Alexa app or that it can show previous uses. This is something I've meant to look at for sometime and dang if I wish I had looked at it earlier. You can add simple visual feedback in about five minutes of work!

Note that Alexa devices support *two* kinds of visual feedback. The simplest one, the one I'm covering today, is called a Card. This is supported "everywhere" by which I mean it will always show up in the app even if you are speaking to a device without a display. There's a second method of support called "display templates" for devices that ship with a screen. I'm not covering this today but you can read more about it at the [docs](https://developer.amazon.com/docs/custom-skills/create-skills-for-alexa-enabled-devices-with-a-screen.html). 

Ok, so let's demonstrate how to do this. 

### My Initial Skill

Before I continue on, note that *how* I built the skill is totally not relevant. I think it was kind of neat so I wanted to share, but you can definitely skip on to the next section where I discuss modifying it to add card support. I'll also note that I'm not submitting this one for release by Amazon so you can't test this yourself, but remember that Amazon makes it *super* easy to build and test these skills on your own devices which is awesome! 

My skill is called "My Monster" and it simply selects a random monster from Diablo 3. After giving myself a Nintendo Switch as an early birthday present, I've been playing the heck out of it and have really enjoyed the port. I played quite a bit on the PC and can say that the Switch does an incredible job with it. I don't miss a mouse at all.

There's a great wiki for Diablo at, of course, <https://diablo.fandom.com/wiki/Diablo_Wiki>, and as every wiki has an API, I built some code to parse their data. 

The first thing I did was simply ask for all pages in the "Animals" category. I did this via a simple Postman test at this URL: <https://diablo.fandom.com/api/v1/Articles/List?category=Animals&limit=999999>. This returns a list of pages. You can then get more information about a page by going to <https://diablo.fandom.com/api/v1/Articles/AsSimpleJson?id=36097> where the ID value comes from the initial list in the previous URL. I wrote a quick Node script to get every page and save it to a local JSON file:

```js
const fetch = require('node-fetch');

/*
This array of animals came from hitting:
https://diablo.fandom.com/api/v1/Articles/List?category=Animals&limit=999999
I manually removed "Animals"
No reason to run it again
*/
const animals = require('./animals.json');
//animals.items = animals.items.slice(0,10);

console.log(`Parsing ${animals.items.length} different animals.`);

let data = [];
let calls = [];

animals.items.forEach(a => {
	// its async but it's ok (honest) cuz we add by unique id
	let url = 'https://diablo.fandom.com/api/v1/Articles/AsSimpleJson?id='+a.id;

	let call = new Promise((resolve, reject) => {
		
		fetch(url)
		.then(res => res.json())
		.then(res => {
			/*
			sample output:

			{
		"sections": [
			{
				"title": "Agustin the Marked",
				"level": 1,
				"content": [
					{
						"type": "paragraph",
						"text": "Agustin the Marked, Carrion Scavenger, is a Unique Corvian Hunter found in the Shrouded Moors in Act II of Diablo III. It can be nominated a bounty."
					},
					{
						"type": "paragraph",
						"text": "In combat, it has Electrified, Waller and Mortar affixes."
					}
				],
				"images": [
					{
						"src": "https://vignette.wikia.nocookie.net/diablo/images/6/66/Agustin.jpg/revision/latest/scale-to-width-down/180?cb=20170711163543",
						"caption": ""
					}
				]
			}
		]
			require sections[0], title+level+content+images
			*/
			if(res.sections && res.sections.length >= 1 && res.sections[0].title
			&& res.sections[0].level && res.sections[0].content && res.sections[0].images && res.sections[0].images.length >= 1
			&& res.sections[0].images[0].src) {
				let result = res.sections[0];
				let animal = {
					title:result.title,
					level:result.level
				}

				animal.desc = result.content.reduce((prev, cur) => {
					return prev + '<p>'+cur.text+'</p>';
				}, '');

				animal.image = result.images[0].src;
				data.push(animal);
				resolve(true);
			} else {
				//console.log('skip for '+JSON.stringify(a));
				resolve(true);
			}
		});
	});

	calls.push(call);
});

Promise.all(calls)
.then(() => {
	console.log(data.length + ' animals written to monster.json');
	fs.writeFileSync('./monsters.json', JSON.stringify(data), 'UTF-8');
});
```

Note the awesome use of Promises to run the HTTP calls in parallel and then my epic use of `reduce` to work with the text. Basically my idea was to end up with a set of JSON data I could use "as is" for my skill versus parsing data on the fly for each call. I missed one or two things and could have updated this but left it as is. 

The end result was a big array of monsters - here's part of it.

```js
[
	{"title":"Alabaster Fury", 
	"level":1, 
	"desc":"<p>Alabaster Furies are Unique Whitefur Howlers found in the Grace of Inarius Set Dungeon in Diablo III.</p><p>In combat, they have the Mortar and Missile Dampening affixes, the latter effectively forcing the player to fight them in melee. If allowed to charge, they can bash the player out of close combat, which also interferes with the primary task.</p>", "image":"https://vignette.wikia.nocookie.net/diablo/images/2/2f/AlabasterF.jpg/revision/latest/scale-to-width-down/180?cb=20170715070656"},
	{"title":"Agustin the Marked", 
	"level":1, 
	"desc":"<p>Agustin the Marked, Carrion Scavenger, is a Unique Corvian Hunter found in the Shrouded Moors in Act II of Diablo III. It can be nominated a bounty.</p><p>In combat, it has Electrified, Waller and Mortar affixes.</p>","image":"https://vignette.wikia.nocookie.net/diablo/images/6/66/Agustin.jpg/revision/latest/scale-to-width-down/180?cb=20170711163543"},
	{"title":"Almash the Grizzly", 
	"level":1, 
	"desc":"<p>Almash the Grizzly, The Great Trapper, is a Unique Bogan Trapper found in the Paths of the Drowned in Act V of Diablo III.</p><p>In combat, he has Arcane Enchanted and Jailer affixes, and his ability to hurl traps has a greatly reduced cooldown.</p>","image":"https://vignette.wikia.nocookie.net/diablo/images/d/dc/5_Almash_the_Grizzly_c.jpg/revision/latest/scale-to-width-down/180?cb=20140820200154"}
]
```

Next I built a Webtask.io serverless task to select a random monster and return the result to the Alexa device. Here's the code, with again most of the monsters trimmed out for space.

```js
const monsters = [{"title":"Alabaster Fury","level":1,"desc":"<p>Alabaster Furies are Unique Whitefur Howlers found in the Grace of Inarius Set Dungeon in Diablo III.</p><p>In combat, they have the Mortar and Missile Dampening affixes, the latter effectively forcing the player to fight them in melee. If allowed to charge, they can bash the player out of close combat, which also interferes with the primary task.</p>","image":"https://vignette.wikia.nocookie.net/diablo/images/2/2f/AlabasterF.jpg/revision/latest/scale-to-width-down/180?cb=20170715070656"}];


/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMonster() {
  return monsters[getRandomInt(0, monsters.length - 1)];
}

/**
* @param context {WebtaskContext}
*/
module.exports = function(context, cb) {
  
  let req = context.body.request;

  let monster = getMonster();
  // make a new desc as Alexa won't grok the Ps (or other html)
  // first attempt, set linebreaks for closing P
  let desc = monster.desc.replace(/<\/p>/g,' \n ');
  // now clean up rest
  desc = desc.replace(/<.*?>/g,' ');

  //used for text
  let result = `Your random Diablo monster is ${monster.title}. The Diablo wiki describes it as so: 
${desc}`;
   
  var response = {
    "version": "1.0",
    "response" :{
      "shouldEndSession": true,
      "outputSpeech": {
        "type": "PlainText",
        "text": result
        }
		}
  };
    
  cb(null, response);

};
```

You can see I modify the text a bit. As I said earlier, the script I built to parse and save the data could have been updated so I'm not doing this on the fly. Or heck, I could write another Node script to read in the output and fix it. As I wasn't planning on releasing this skill I didn't worry about it. Here's a sample result via Alexa's testing console.

<img src="https://static.raymondcamden.com/images/2019/04/alexa1.png" alt="An example of the output from running the Alexa skill" class="imgborder imgcenter">

That one's a bit long for a response, but again, I'm just testing. Ok, so how do we add a card to the response? 

First - read the excellent docs! [Include a Card in Your Skill's Response](https://developer.amazon.com/docs/custom-skills/include-a-card-in-your-skills-response.html) There's multiple different types of cards but the easiest is a simple card. You can test it by simply adding the `card` object to your response:

```js
let card = {
	"type": "Simple",
	"title": monster.title,
	"content": desc
};

//stuff...

var response = {
	"version": "1.0",
	"response" :{
		"shouldEndSession": true,
		"outputSpeech": {
			"type": "PlainText",
			"text": result
			},
			"card": card
	}
};
```

In the example above I've added a simple card with a title and the same content as the audio response. This is the returned in the `card` key. Obviously you don't have to do that. You could use the text response as a way to include things that may not make sense over audio. So for example, I can imagine a case where acronyms are included in the text but not the audio:

```text
Alexa says: "I secretly record things for the National Security Agency"
Alexa prints: "I secretly record things for the National Security Agency (NSA)"
```

That's a pretty minor difference but you get the idea. 

Adding an image is pretty easy too. Switch the type to `Standard`, change `content` to `text` (which feels like a dumb change, mainly because I missed it), and then include an `image` object with up to two keys: `smallImageUrl` and `largeImageUrl`. I had the images for each monster already but didn't notice the wiki doing a server-side redirect to the proper image file. I modified my code to handle "guessing" the right URL so this isn't exactly perfect, but here's what I ended up with:

```js
let card = {
	"type": "Standard",
	"title": monster.title,
	"text": desc,
	"image":{
		"largeImageUrl":image
	}
};
```

And that's it! The result:

<img src="https://static.raymondcamden.com/images/2019/04/alexa2.png" alt="An example showing the text and image from the skill" class="imgborder imgcenter">

Here's a pic I took of it running on my Alexa Show. There's a bit of glare - sorry about that.

<img src="https://static.raymondcamden.com/images/2019/04/alexa3.jpg" alt="Example of the result on the Alexa Show" class="imgborder imgcenter">

So not exactly rocket science and in general Alexa development is pretty easy, but I was very impressed by how easy it was to add this feature to my skill. I kinda wished I had done this much earlier. 

<i>Header photo by <a href="https://unsplash.com/photos/9SewS6lowEU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jack Hamilton</a> on Unsplash</i>