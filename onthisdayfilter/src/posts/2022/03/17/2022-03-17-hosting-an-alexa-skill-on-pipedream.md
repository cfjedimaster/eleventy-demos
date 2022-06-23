---
layout: post
title: "Hosting an Alexa Skill on Pipedream"
date: "2022-03-17T18:00:00"
categories: ["serverless"]
tags: ["pipedream","alexa"]
banner_image: /images/banners/alexa.jpg
permalink: /2022/03/17/hosting-an-alexa-skill-on-pipedream.html
description: Steps needed to run an Alexa skill on the Pipedream platform
---

I've been a big fan of the [Amazon Alexa developer](https://developer.amazon.com/en-US/alexa/alexa-skills-kit/start) experience for a few years now. I haven't done any active skill (what they call apps) in a while, but I thought I'd take a quick look at what's required to host a skill on [Pipedream](https://pipedream.com). While this won't be a "How to build an Alexa skill" post, I will share a bit of background information about the process, because honestly it's pretty dang cool.

## Alexa Skills - The 60 Second Overview

Alright, so at a high level, an Alexa skill involves the following parts:

* First is the invocation name, how you 'start' your skill. When you say, "Alexa, ask foo about goo", foo is the invocation name. 
* Skills have intents, which are the broad categories of what people can do with your skill. When you go iinto a coffee shop, you will probably only do two things - ask what's on the menu, and make an order. Those would be your intents.
* Intents have utterances, which are examples of intents. You do *not* have to enumerate every single possible version of a way to do execute an intent, but the more you do, the better Alexa is at routing input. So for example, I may use the following utterances for orders: "I'd like to order a coffee.", "I want a coffee.", "Give me a coffee now!". 

All of the above is part of the metadata for your skill (and not everything to be clear), but you can also specify an endpoint. This is where your code comes in. Obviously, Alexa pushes you to Lambda, but you do not have to use Lambda. Most of my testing with Alexa was on OpenWhisk. 

The code is fairly simple to write for the most part. Every request is a JSON object describing the intent as well as any variable data. So for example, when you define an "order" intent, Alexa will figure out *what* you are ordering and pass that as data. You don't have to do any parsing of the original text at all, Alexa handles all of that for you. You literally write code that a) recognizes the intent, b) gets the arguments, and c) does whatever makes sense for the logic. 

The best part of developing for Alexa though is that you can create "personal" skills. These are skills that only work on your own devices. I had a lot of fun building <strike>stupid</strike>totally serious skills for myself and my family. Last time I checked, Google did not allow this for their voice assistant. Well they did, but every use of the code had a "test" message that pretty much ruined the experience. Maybe that's gone now and if so, let me know.

## Alexa on Pipedream

Ok, so let's talk about hosting a skill on Pipedream. First off, since you need a URL for Alexa to hit, you'll want to create your workflow with the HTTP trigger. This will give you the URL you need to provide to Alexa. Here's the important bit. When you add your endpoint in the Alexa console, ensure you select: "My development endpoint is a sub-domain of a domain that has a wildcard certificate from a certificate authority"

<p>
<img data-src="https://static.raymondcamden.com/images/2022/03/a1.jpg" alt="Screenshot showing the endpoint URL and proper setting" class="lazyload imgborder imgcenter">
</p>

What follows next is how I built my workflow. These specifics could be changed based on your preferences. I try to have small concrete things in individual Pipedream steps, but Pipedream is fine with one big code step too if you want. So first I built a step that simply got the intent out from the request object.

```js
async (event, steps) => {
	this.intent = event.body.request.intent.name;
	if(event.body.request.type == 'LaunchRequest') this.intent = 'AMAZON.HelpIntent';
}
```

This was in a step named `steps.determineintent` which meant later in my code I could check `steps.determineintent.intent`. That's not much shorter than the original, but it felt right. My test skill didn't use any arguments but I'd probably use the same step to get those args out as well. Basically, I'm thinking of this as a "Alexa sent me this big JSON, let me break it down into the parts I care about" type step. The second line there handles the case where a person says, "ask alexa foo", basically opening a skill with no other input. My thinking here is to treat it like a help request.

Next, I added a few steps to handle required/default intents in Alexa skills. As part of the certification process (which again, is only required if you go live), your skill has to respond to a 'launch' request (ie, just opening it up, see the text), a 'help' request, and an 'end' one. 

As I said above, I treated the launch request the same as help, which obviously wouldn't always work but was fine for me. So here is the step for that:

```js
async (event, steps) => {

	if(steps.determineintent.intent !== 'AMAZON.HelpIntent') return;

	var response = {
	"version": "1.0",
	"response" :{
		"shouldEndSession": true,
		"outputSpeech": {
			"type": "PlainText",
			"text": "I give you a completely scientifically driven, 100% accurate horoscope. Honest."
		}
	}
	}

	await $respond({
		status:200,
		immediate:true,
		body:response
	});
	$end();
}
```

At the time I'm writing this, Pipedream doesn't have a concept of conditional logic for steps, so instead I simply leave the current step via a return statement. Alexa responses are JSON packets, and while they can get pretty complex, above you see a simple example of one. 

My next step handles both canceling and stopping:

```js
async (event, steps) => {
	if(!(steps.determineintent.intent === 'AMAZON.StopIntent' || steps.determineintent.intent === 'AMAZON.CancelIntent')) return;

	var response = {
	"version": "1.0",
	"response" :{
		"shouldEndSession": true,
		"outputSpeech": {
			"type": "PlainText",
			"text": "Bye!"
		}
	}
	}

	await $respond({
		status:200,
		immediate:true,
		body:response
	});
	$end();
}
```

And then finally, I added the logic of my skill. In this case, I rebuilt a stupid horoscope simulator I converted from an old Flex Mobile app (["Rebuilding a Flex Mobile App as an Alexa Skill"](https://www.raymondcamden.com/2017/10/04/rebuilding-a-flex-mobile-app-as-an-alexa-skill)). I'll share the code, but note it really doesn't matter. The code you would use would match your business logic (but won't be as cool):

```js
async (event, steps) => {
const { generateSlug } = await import('random-word-slugs');

const signs = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

function getAdjective() {
	return generateSlug(1, { 
    partsOfSpeech:['adjective'], 
    format: 'lower' })
}

function getNoun() {
	return generateSlug(1, { 
    partsOfSpeech:['noun'], 
    format: 'lower' })
}

function getSign() {
	return signs[randRange(0,signs.length-1)];
}


function getFinancialString() {
	let options = [
		"Today is a good day to invest. Stock prices will change. ",
		"Today is a bad day to invest. Stock prices will change. ",
		"Investments are a good idea today. Spend wisely before the " + getAdjective() + " " + getNoun() + " turns your luck! ",
		"Save your pennies! Your " + getNoun() + " is not a safe investment today. ",
		"Consider selling your " + getNoun() + " for a good return today. ",
		"You can buy a lottery ticket or a " + getNoun() + ". Either is a good investment. "
	];
	return options[randRange(1,options.length-1)];
}

function getRomanticString() {
	let options = [
		"Follow your heart like you would follow a "+getAdjective() + " " + getNoun() + ". It won't lead you astray. ",
		"You will fall in love with a " + getSign() + " but they are in love with their " + getNoun() + ". ",
		"Romance is not in your future today. Avoid it like a " + getAdjective() + " " + getNoun() + ". ",
		"Romance is blossoming like a " + getAdjective() + " " + getNoun() + "! ",
		"Avoid romantic engagements today. Wait for a sign - it will resemble a " +getAdjective() + " " + getNoun() + ". ",
		"Love is in the air. Unfortunately not the air you will be breathing. "
	];
	return options[randRange(1,options.length-1)];
}

function getRandomString() {
	var options = [
		"Avoid talking to a " + getSign() + " today. They will vex you and bring you a " + getNoun() + ". ",
		"Spend time talking to a " + getSign() + " today. They think you are a " + getNoun() + "! ",
		"Dont listen to people who give you vague advice about life or your " + getNoun() + ". ",
		"Today you need to practice your patience. And your piano. ",
		"Meet new people today. Show them your " + getNoun() + ". ",
		"Your spirits are high today - but watch our for a " + getAdjective() + " " + getNoun() + ". ",
		"Your sign is in the third phase today. This is important. ",
		"Your sign is in the second phase today. This is critical. ",
		"Something big is going to happen today. Or tomorrow. ",
		"Something something you're special and important something something." ,
		"A " + getAdjective() + " " + getNoun() + " will give you important advice today. ",
		"A " + getAdjective() + " " + getNoun() + " has it out for you today. ",
		"Last Tuesday was a good day. Today - not so much. ",
		"On the next full moon, it will be full. ",
		"Today is a bad day for work - instead focus on your " + getNoun() + ". ",
		"Today is a good day for work - but don't forget your " + getNoun() + ". ",
		"A dark stranger will enter your life. They will have a " + getAdjective() + " " + getNoun() + ". "
	];
	return options[randRange(1,options.length-1)];
}

function randRange(minNum, maxNum) {
	return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}


let horoscope = `
${getRandomString()} ${getFinancialString()} ${getRandomString()}
Your lucky numbers are ${randRange(1,10)}, ${randRange(1,10)}, and ${getNoun()}.
`;
	
var response = {
    "version": "1.0",
    "response" :{
      "shouldEndSession": true,
      "outputSpeech": {
        "type": "PlainText",
        "text": horoscope
        }
      }
  }

  await $respond({
		status:200,
		immediate:true,
		body:response
  })
}
```

Here's some example outputs:

"On the next full moon, it will be full. Investments are a good idea today. Spend wisely before the late pager turns your luck! Spend time talking to a Leo today. They think you are a coat! Your lucky numbers are 4, 8, and motorcycle."

"A dark stranger will enter your life. They will have a millions mouse. Investments are a good idea today. Spend wisely before the appetizing optician turns your luck! A tight hairdresser has it out for you today. Your lucky numbers are 4, 7, and diamond."

"A yellow umbrella has it out for you today. Investments are a good idea today. Spend wisely before the easy monkey turns your luck! On the next full moon, it will be full. Your lucky numbers are 3, 8, and belgium."

The final step isn't technically required for testing, but will be if you go into production. For released skills, Alexa requires you to verify the caller. In other words, it wants your skill to only respond to verified Alexa calls. This verification process is a bit insane, but luckily, there's a npm module for it!

So you will need to have a step *right* after the HTTP trigger for verification:

```js
async (event, steps) => {
	import verifier from 'alexa-verifier'

	let signaturechainurl = event.headers["signaturecertchainurl"];
	let signature = event.headers["signature"];
	let body = event.body;

	try {
		await verifier(signaturechainurl, signature, JSON.stringify(body));
	} catch(e) {
		console.log(JSON.stringify(e));
		$end("Failed verification.")
	}
```

You can have this step in while testing and it works fine so you might as well include it even if you aren't going to release the skill publicly.

## Show Me the Code!

If you want to see this yourself, view the workflow here: <https://pipedream.com/@raymondcamden/pipedream-alexa-test-1-p_7NCBJpG>. You can fork it to your own Pipedream account and use it as a basis for building your own skill. As always, if you do end up using something I helped you with, I'd love to know!

Photo by <a href="https://unsplash.com/@andresurena?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Andres Urena</a> on <a href="https://unsplash.com/s/photos/alexa?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  