---
layout: post
title: "Rebuilding a Flex Mobile App as an Alexa Skill"
date: "2017-10-04T10:20:00-07:00"
categories: [development,serverless]
tags: [alexa,openwhisk]
banner_image: 
permalink: /2017/10/04/rebuilding-a-flex-mobile-app-as-an-alexa-skill
---

Many, *many* moons ago I created a ridiculous Flex Mobile app called [TBS Horoscope](https://www.raymondcamden.com/2011/08/28/Latest-Nook-App-TBS-Horoscope/). This was for the Nook platform, eventually moved to Amazon Android App store (where it still sits actually) and one of my few commercial apps. The app was fairly simple. It generated a fake horoscope when an astrological sign was requested and persisted it for the day. That way it would be a bit more "realistic". 

I thought it would be fun to rebuild this for the Amazon Alexa. So I did it. Because I have a great job and I'm very lucky. Before I talk about how I built it, here's a video of it in action.

<blockquote class="twitter-video" data-lang="en"><p lang="en" dir="ltr">New Alexa skill - driven by <a href="https://twitter.com/openwhisk?ref_src=twsrc{% raw %}%5Etfw">@openwhisk</a> of course. Previously a Flex Mobile app. <a href="https://t.co/8uloEMRPi4">pic.twitter.com/8uloEMRPi4</a></p>&mdash; Raymond Camden (@raymondcamden) <a href="https://twitter.com/raymondcamden/status/915591923037016064?ref_src=twsrc%{% endraw %}5Etfw">October 4, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Ok, so how did I build this? I began by creating a service just for the horoscope generation itself. Initially this was going to be its own OpenWhisk action, but I ran into some issues where that wouldn't make sense. I'll explain why later. Here's the code.

<pre><code class="language-javascript">const signs = [&quot;Aries&quot;,&quot;Taurus&quot;,&quot;Gemini&quot;,&quot;Cancer&quot;,&quot;Leo&quot;,&quot;Virgo&quot;,&quot;Libra&quot;,&quot;Scorpio&quot;,&quot;Sagittarius&quot;,&quot;Capricorn&quot;,&quot;Aquarius&quot;,&quot;Pisces&quot;];

function getAdjective() {
	return adjectives[randRange(0,adjectives.length-1)];
}

function getNoun() {
	return nouns[randRange(0,nouns.length-1)];
}

function getSign() {
	return signs[randRange(0,signs.length-1)];
}


function getFinancialString() {
	let options = [
		&quot;Today is a good day to invest. Stock prices will change. &quot;,
		&quot;Today is a bad day to invest. Stock prices will change. &quot;,
		&quot;Investments are a good idea today. Spend wisely before the &quot; + getAdjective() + &quot; &quot; + getNoun() + &quot; turns your luck! &quot;,
		&quot;Save your pennies! Your &quot; + getNoun() + &quot; is not a safe investment today. &quot;,
		&quot;Consider selling your &quot; + getNoun() + &quot; for a good return today. &quot;,
		&quot;You can buy a lottery ticket or a &quot; + getNoun() + &quot;. Either is a good investment. &quot;
	];
	return options[randRange(1,options.length-1)];
}

function getRomanticString() {
	let options = [
		&quot;Follow your heart like you would follow a &quot;+getAdjective() + &quot; &quot; + getNoun() + &quot;. It won&#x27;t lead you astray. &quot;,
		&quot;You will fall in love with a &quot; + getSign() + &quot; but they are in love with their &quot; + getNoun() + &quot;. &quot;,
		&quot;Romance is not in your future today. Avoid it like a &quot; + getAdjective() + &quot; &quot; + getNoun() + &quot;. &quot;,
		&quot;Romance is blossoming like a &quot; + getAdjective() + &quot; &quot; + getNoun() + &quot;! &quot;,
		&quot;Avoid romantic engagements today. Wait for a sign - it will resemble a &quot; +getAdjective() + &quot; &quot; + getNoun() + &quot;. &quot;,
		&quot;Love is in the air. Unfortunately not the air you will be breathing. &quot;
	];
	return options[randRange(1,options.length-1)];
}

function getRandomString() {
	var options = [
		&quot;Avoid talking to a &quot; + getSign() + &quot; today. They will vex you and bring you a &quot; + getNoun() + &quot;. &quot;,
		&quot;Spend time talking to a &quot; + getSign() + &quot; today. They think you are a &quot; + getNoun() + &quot;! &quot;,
		&quot;Dont listen to people who give you vague advice about life or your &quot; + getNoun() + &quot;. &quot;,
		&quot;Today you need to practice your patience. And your piano. &quot;,
		&quot;Meet new people today. Show them your &quot; + getNoun() + &quot;. &quot;,
		&quot;Your spirits are high today - but watch our for a &quot; + getAdjective() + &quot; &quot; + getNoun() + &quot;. &quot;,
		&quot;Your sign is in the third phase today. This is important. &quot;,
		&quot;Your sign is in the second phase today. This is critical. &quot;,
		&quot;Something big is going to happen today. Or tomorrow. &quot;,
		&quot;Something something you&#x27;re special and important something something.&quot; ,
		&quot;A &quot; + getAdjective() + &quot; &quot; + getNoun() + &quot; will give you important advice today. &quot;,
		&quot;A &quot; + getAdjective() + &quot; &quot; + getNoun() + &quot; has it out for you today. &quot;,
		&quot;Last Tuesday was a good day. Today - not so much. &quot;,
		&quot;On the next full moon, it will be full. &quot;,
		&quot;Today is a bad day for work - instead focus on your &quot; + getNoun() + &quot;. &quot;,
		&quot;Today is a good day for work - but don&#x27;t forget your &quot; + getNoun() + &quot;. &quot;,
		&quot;A dark stranger will enter your life. They will have a &quot; + getAdjective() + &quot; &quot; + getNoun() + &quot;. &quot;
	];
	return options[randRange(1,options.length-1)];
}

function randRange(minNum, maxNum) {
	return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

let nouns, adjectives;

function create(args) {

	&#x2F;&#x2F;see if we have a cache noun list
	if(!nouns) {
		nouns = require(&#x27;.&#x2F;nouns&#x27;);
	}
	if(!adjectives) {
		adjectives = require(&#x27;.&#x2F;adjectives&#x27;);
	}

	let horoscope = &quot;&quot;;
	horoscope += getRandomString();
	horoscope += getFinancialString();
	horoscope += getRomanticString();
	horoscope += &quot;\n\n&quot;;
	horoscope += &quot;Your lucky numbers are &quot; + randRange(1,10) + &quot;, &quot; + randRange(1,10) + &quot;, and &quot; + getNoun() + &quot;.&quot;;
	return horoscope;

}

exports.create = create;
</code></pre>

A horoscope is generated by combining a few random strings. I realized many horoscopes focused on money and love, hence the specific functions for them. To make things *super* random, I used a noun list with over 4500 words and an adjective list nearly 1000 words long. I had to convert these to JSON files as I didn't know how to read text files in an OpenWhisk action. ([Now I do.](https://www.raymondcamden.com/2017/10/02/reading-a-text-file-on-openwhisk/)) If you're curious, I actually copied the entire word list into my clipboard, pasted it into Chrome Dev tools with backticks before and after, then converted it into an array. Finally I did `copy(s)` to copy it back to my clipboard and then I saved it to the file system.

Oh - and rewriting ActionScript to JavaScript was simple as heck - all I did mainly was remove the types. That made me feel a bit sad and I thought about maybe using TypeScript for my code, but I'd have to transpile it before sending it to OpenWhisk and I didn't want to worry about that.

So that's that. The Alexa part is pretty simple. Once again I'll say I'm *not* happy with how I write my skills. It works. It isn't difficult. I just think I can do better.

<pre><code class="language-javascript">function main(args) {


	if(args.request.type === &#x27;IntentRequest&#x27; &amp;&amp; ((args.request.intent.name === &#x27;AMAZON.StopIntent&#x27;) || (args.request.intent.name === &#x27;AMAZON.CancelIntent&#x27;))) {
		let response = {
		&quot;version&quot;: &quot;1.0&quot;,
		&quot;response&quot; :{
			&quot;shouldEndSession&quot;: true,
			&quot;outputSpeech&quot;: {
				&quot;type&quot;: &quot;PlainText&quot;,
				&quot;text&quot;: &quot;Bye!&quot;
				}
			}
		}

		return {% raw %}{response:response}{% endraw %};
	}

	&#x2F;&#x2F;Default response object
	let response = {
		&quot;version&quot;:&quot;1.0&quot;,
		&quot;response&quot;:{
			&quot;outputSpeech&quot;: {
				&quot;type&quot;:&quot;PlainText&quot;
			},
			&quot;shouldEndSession&quot;:true
		}
	};
	
	&#x2F;&#x2F;treat launch like help
	let intent;
	if(args.request.type === &#x27;LaunchRequest&#x27;) {
		intent = &#x27;AMAZON.HelpIntent&#x27;;
	} else {
		intent = args.request.intent.name;
	}

	&#x2F;&#x2F; two options, help or do horo
	if(intent === &quot;AMAZON.HelpIntent&quot;) {
		
		response.response.outputSpeech.text = &quot;I give you a completely scientifically driven, 100% accurate horoscope. Honest.&quot;;
	
	} else {
		let horoscope = require(&#x27;.&#x2F;getHoroscope&#x27;).create();
		response.response.outputSpeech.text  = horoscope;
		&#x2F;&#x2F;console.log(&#x27;Response is &#x27;+JSON.stringify(response));
	}

	return response;

}

exports.main = main;
</code></pre>

Basically this boils down to two things - help and the horoscope. You'll notice I don't actually persist the horoscope for the day. I was going to make this skill be a bit more advanced. It would ask you for your sign if you didn't give it, and heck, even let you give it a birthday and it would tell you your sign. I'd then persist the horoscope in Cloudant and everyone (of the same sign) would get the same horoscope.

Then I remember horoscopes are bull shit and this is for fun and as a user, I'd rather have it just always be random. 

So you might be wondering - where's the skill verification stuff? Back in August I [released](https://www.raymondcamden.com/2017/08/18/an-openwhisk-package-for-alexa-verification/) a package for that so you no longer have to write the code yourself. 

Given that my Alexa skill action is called tbshoroscope/doHoroscope, I made my public API like so:

<pre><code class="language-javascript">wsk action update tbshoroscope/getHoroscope --sequence "/rcamden@us.ibm.com_My Space/alexa/verifier",tbshoroscope/doHoroscope --web raw</code></pre>

I then grabbed the URL (`wsk action get tbshoroscope/getHoroscope --url`) and supplied that to Amazon. I'm currently waiting for verification from Amazon and when it goes live, you'll be able to find it via its skill name, "TBS Horoscope". Note - the name may change as "TBS" is a television channel here. Also, if they find a bug, obviously the code may change a bit too. If the name changes, I'll add a comment below so please check it, and if the code changes, the GitHub repo will always have the latest. You can find this demo here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/tbshoroscope