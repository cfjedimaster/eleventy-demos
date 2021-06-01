---
layout: post
title: "Building a Twitter Bot in Pipedream"
date: "2020-04-02"
categories: ["serverless"]
tags: ["javascript","pipedream"]
banner_image: /images/banners/rah.jpg
permalink: /2020/04/02/building-a-twitter-bot-in-pipedream
description: Building a Twitter Bot in the Pipedream platform
---

A few days ago I [posted](https://www.raymondcamden.com/2020/03/28/a-look-at-pipedream) about the [Pipedream](https://pipedream.com/) platform and I've had a chance now to play with it a bit more and I'm even more impressed with it now then when I started. I decided to build (yet another) Twitter bot that shares random information. This time it's [@randomgijoe](https://twitter.com/randomgijoe), a bot that shares random GI Joe characters from the "RAH" ("Real American Hero") universe. Here's an example:

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">Name: Voltar<br>Speciality: Field commander<br>Link: <a href="https://t.co/1Igpw6t1fL">https://t.co/1Igpw6t1fL</a> <a href="https://t.co/Y0PJyppFnO">pic.twitter.com/Y0PJyppFnO</a></p>&mdash; randomjoe (@randomgijoe) <a href="https://twitter.com/randomgijoe/status/1245515657103446016?ref_src=twsrc%5Etfw">April 2, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

I did this by parsing information from the [GI Joe](https://gijoe.fandom.com/wiki/Joepedia_-_The_G.I._Joe_Wiki) wikipedia site and implementing it on Pipedream's platform. I'm going to share how I built it, but be aware that roughly <strong><u>95% of the work</u></strong> was involved in getting my random character. The aspects that pertain to Pipedream were incredibly simple - which is what you want in a platform. Also, I once again want to thank [Dylan Sather](https://twitter.com/DylanSather) and Tod Sacerdoti for their help.  

## Creating My Tweet

So as I said in the beginning, most of my work for this bot was in creating the actual content for the tweet. Wikis using the Wikia platform (which I'm not sure how to exactly link to) share an API that makes it simple to perform calls against the content of the site itself. For my bot, I wanted to do this:

1) Get a random page in a category.
2) Use the characters name, specialty, and picture in a tweet.
   
The first part was easy as it's a standard URL that looks like so:

	https://gijoe.fandom.com/wiki/Special:RandomInCategory/CATEGORY

For my bot, I wanted to focus on the RAH (Real American Hero) category so my URL looked like so: <https://gijoe.fandom.com/wiki/Special:RandomInCategory/A_Real_American_Hero_characters>. If you click that link, you'll end up on a random page within that category.

So step one was - request that URL and look at the request to see where I was redirect. I've never done that before with node-fetch, but it ended up being simple:

```js
const fetch = require('node-fetch');
const randomURL = 'https://gijoe.fandom.com/wiki/Special:RandomInCategory/A_Real_American_Hero_characters';

async function getRandomCharacter() {
	return await fetch(randomURL + '?format=json', {redirect:'manual'})
	.then(res => {
		let header = res.headers.raw();
		return header.location[0].split('/').pop();
	});
}
```

Specifically using `redirect:'manual'` lets me look at the headers and see where it redirected me to. This will be a URL with a page value at the end that I pop out. So a call to this may return something like: [`Decimator`](https://gijoe.fandom.com/wiki/Decimator). 

Easy. The next step is to get the content of the page. The Wikia API lets you get both the rendered page or the original wiki source. I needed the original wiki source, so I wrote this function:

```js
async function getPageData(page) {
	let resp =  await fetch(apiURL + `?action=parse&page=${page}&format=json&prop=wikitext`);
	let data = await resp.json();
	return { 
		title: data.parse.title, 
		wikitext: data.parse.wikitext['*']
	};
	
}
```

I simplify the result a bit by looking for the title and wikitext. Again, sooooo simple, right? Now came the fun part. And by fun part, I mean the part that made me reconsider what I was doing.

I noticed that the random characters shared something in common. They all had a box on the right:

<img data-src="https://static.raymondcamden.com/images/2020/04/rah1.png" alt="RAH character example" class="lazyload imgborder imgcenter">

I noticed "Specialty" in the box and thought that would be nice information for the tweet. I had originally considered the first sentence of the main text, but I figured name, specialty, and an image would be enough. When I looked at the wiki text, I could see the box inline with the rest of the code. Here's a sample:
{% raw %}
	{{Chardisambig|Shipwreck}}

	:''Shipwreck is a [[G.I. Joe Team|G.I. Joe]] character from the [[A Real American Hero]] and [[G.I. Joe vs. Cobra]] series.'
	'
	{{Joe character_infobox
	|imageBG=
	|image=[[File:Shipwreck_RAH.jpg|250px|center]]
	|name=Shipwreck
	|hidep=
	|realname=Hector X. Delgado
	|birthplace=Chula Vista, California
	|gender=Male
	|alias=
	|hidem=
	|branch=US Navy
	|graderank=Chief Petty Officer (E-7)
	|sernumber=
	|specialty=Sailor; [[Wikipedia:United States Navy SEALs|S.E.A.L.]]; Gunner's mate; Machinist
	|training=Naval Gunnery School; [[Wikipedia:United States Naval Special Warfare Command|S.E.A.L. School]]
	|weapon=[[Wikipedia:M16 rifle|M-16]]; [[Wikipedia:M14 rifle|M-14]]; [[Wikipedia:M2 Browning machine gun|Browning .50 cal]];
	20mm Oerliken anti-aircraft gun; [[Wikipedia:M1911 pistol|M1911A1]]
	|hideo=
	|factions=*[[G.I. Joe Team]]
	|subteams=
	|1stcomic=[[Hydrofoil|''G.I. Joe'' #40]]
	|1sttoon=
	}}
	'''Shipwreck''' has earned a reputation as being one of the more rambunctious members of the [[G.I. Joe Team]]. It's not tha
	t he is in any way disobedient or disrespectful of higher up officers. His arrogant, brash personality and stereotypical sai
	lor attitude has gotten him in trouble so many times. He prefers to take up his own actions and fight the enemy in his own w
	ay. He also has a reputation for telling tall tales and for his poor culinary skills. It seems he is the only one who can st
	omach his own cooking. His superiors have had enough and shipped him to Navy S.E.A.L. School in the hopes the training there
	would make him a better man. It made him better alright... a better fighter only.
{% endraw %}

Notice this block: {% raw %}{{Joe character_infobox ... }}{% endraw %}. You can see that inside it, we have formatted data in the form, |key=value. Here is where things got weird. Yes, wiki's have an API. But when authors write content, they don't always follow a standard format. One of the things I found right away was that the infobox had different styles with different names. That made my code get and parse the box a bit complex. Here's what I came up with.

{% raw %}
```js
/* 
Looks for the infobox code and parses it into fields, also prepares image.
Tries to deal with the different forms of infobox
*/
function getInfoBox(str) {
	let matches = str.match(/{{.*?[_ ]character[_ ]infobox[.\s\S]*?}}/);
	if(!matches) {
		//hopefully the only alternative
		matches = str.match(/{{Character_infobox[.\s\S]*?}}/);
	}
	
	if(!matches) return;
	if(matches[0]) {
		let box = matches[0];
		box = box.replace(/{{.*?[_ ]character[_ ]infobox[\s\S]/,'');
		box = box.replace(/{{Character_infobox[\s\S]/,'');
		box = box.replace(/}}/,'');
		let parts = box.split('\n');
		let result = {};
		parts.forEach(p => {
			if(p.indexOf("|") === 0) {
				let [key,value] = p.split('=');
				key = key.replace('|','');
				if(key && value) result[key] = value;
			}
		});
		/*
		look for image as a key, and it may be: [[File:Marvel-Mainframe.jpg|270px]]'
		*/
		if(result.image) {
			let [file] = result.image.split('|');
			if(file.indexOf('File:') > 0 || file.indexOf('Image:') > 0) {
				file = file.replace('[[File:','');
				file = file.replace('[[Image:','');
				file = file.replace(']]','');
				result.image = file;
			}
		}
		/*
		possibly fix speciality:
		"Sailor; [[Wikipedia:United States Navy SEALs|S.E.A.L.]]; Gunner's mate; Machinist
		In this case, we'll just take the first part
		*/
		if(result.specialty.indexOf(';') > 0) {
			result.specialty = result.specialty.split(';')[0];
		}

		return result;
	}
}
```
{% endraw %}

If you look at the very beginning of this function, you'll notice I was not able to come up with one regex to handle every case I found. I did get it covering every test I ran, but I'm not 100% convinced this will work all the time. For a silly bot though, I was ok. Also note I do a bit of extra work on the image and specialty values. 

I still wasn't done though. The image value was just a file name, like foo.jpg, not a "real" URL. I had to use *another* API call to translate it into a URL I could use:

```js
async function getImageURL(f) {
	let url = `https://gijoe.fandom.com/api.php?action=query&titles=Image:${f}&prop=imageinfo&iiprop=url&format=json`;
	let result = await fetch(url);
	let data = await result.json();
	if(data && data.query && data.query.pages) {
		//result is an object with one random key
		let keys = Object.keys(data.query.pages);
		let image = data.query.pages[keys[0]];
		return image.imageinfo[0].url;
	}
}
```

I did all of this in a Node script that I could run locally as a way of quickly testing. My test looked like so:

```js
let char = await getRandomCharacter();
console.log(`Char=${char}`);
let page = await getPageData(char);
let box = getInfoBox(page.wikitext);
console.log(box);
let pic = await getImageURL(box.image);

let url = `https://gijoe.fandom.com/wiki/${char}`;
console.log(pic);
```

Finally, let me just say that this is absolutely some brittle code. I could make it better, but in my testing it seemed to work well. This morning I noticed a bug in specialty where some wiki text got through, but I may just ignore it for now.

## Setting up the Pipedream Workflow

Now for the fun part. My Pipedream workflow ended up like so:

* Use a Cron trigger (once an hour)
* Use a Node.js script to get my Joe character (everything above)
* Use a Node.js script to generate the text for my tweet
* Use a Pipedream action to upload my photo
* Use a Pipedream action to make the tweet

Let's break this down. The first step is done, I basically just copied and pasted, but in order to share my data out of the step I modified my code to write to the `this` scope. This makes it available in later steps:

```js
let char = await getRandomCharacter();
let page = await getPageData(char);
this.box = getInfoBox(page.wikitext);
//console.log(this.box);
this.pic = await getImageURL(this.box.image);
this.url = `https://gijoe.fandom.com/wiki/${char}`;
```

The second step just forms my tweet text:

```js
async (event, steps) => {
	this.text = `
	Name: ${steps.getjoe.box.name}
	Speciality: ${steps.getjoe.box.specialty}
	Link: ${steps.getjoe.url}
	`;
}
```

My third step was based on a brand new action Dylan from Pipedream created and shared, `upload_media_to_twitter`. When it comes to tweets with media, Twitter requires you to upload the image first, which gives you an ID value, that you can then use in your tweet. So in Pipedream I added the step and told it to use the value from the first step:

<img data-src="https://static.raymondcamden.com/images/2020/04/rah2.png" alt="Pipedream upload to media step" class="lazyload imgborder imgcenter">

The output of this will be an ID value that can then be used to generate the tweet:

<img data-src="https://static.raymondcamden.com/images/2020/04/rah3.png" alt="Last step - making the tweet" class="lazyload imgborder imgcenter">

And that's it. I apologize if I sound like I'm repeating myself, but I freaking love that most of my work was in creating my text and using the wikia API. The actual "now tweet this at a schedule" part was trivial. And heck, if I wanted to change this to a daily email, or even a SMS message, I can reuse my step in another workflow. I love it! 

You can look at the entire Pipedream workflow here: <https://pipedream.com/@raymondcamden/random-gi-joe-p_jmCpWe>. Notice the "COPY" button top of the workflow and if you want, click it to fork the code and play with it yourself!
