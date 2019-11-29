---
layout: post
title: "Using Alexa to Mess with Your Kids, Because Why Not?"
date: "2018-12-13"
categories: ["development"]
tags: ["alexa","webtask"]
banner_image: /images/banners/santaslist.jpg
permalink: /2018/12/13/using-alexa-to-mess-with-your-kids-because-why-not
---

As you can tell, I'm on somewhat of an Alexa thing lately (["Adding Ice Bear to Alexa, Because Why Not?"](https://www.raymondcamden.com/2018/11/28/adding-ice-bear-to-alexa-because-why-not)), mainly because now I've gotten it to a point where I can deploy an (admittedly simple) skill in about thirty minutes. Also, certification seems to have gotten quite a bit simpler too. That could also be tied to me building incredibly simple skills but I'm not going to complain. For today's <strike>waste of time</strike>incredibly useful Alexa example, I've built a little skill for the sole purpose of messing with my kids during this wonderful Christmas season.

My skill, "Santa's List", lets you ask if your child is on the naughty or nice list. The "mess with" aspect comes from the fact that it always answers in the affirmative. If your kid is acting up, you simply ask if they are on the naughty list. If they are being the little angels that you know they are, then you ask if they are on the nice list.

In order for this to work, you need to build a skill that uses "slots". Slots are variables within your phrases. So for example:

	Is Carol on the nice list?
	Is Jacob on the naughty list?
	Is Weston on the naughty list?
	Is Jane on the nice list?

In all four examples, only two things changed - the name of the child and the type of list. Let's talk about names. As a programmer, do I have to specify what names are? Nope! Alexa supports a crap ton of built-in slot types that match various different types of words, including names. You simply set up your skill to listen for a particular type of slot and Alexa will handle figuring it out. Your code then simply gets a name. 

What's *really* cool about this is that if you use a date slot, it will convert stuff like "tomorrow", "next Monday", etc, into real date objects. It really makes your code a heck of a lot simpler.

You can see all the different slot types at the [reference docs](https://developer.amazon.com/docs/custom-skills/slot-type-reference.html) but just know that nearly every "broad" category of variable has already been covered and is ready for you to use.

What about naughty and nice? For cases where Alexa doesn't have a built-in slot, you can simply create a custom one and list out the options. Mine only had two so it wasn't difficult to do. Here is a screenshot from the Alexa developer console - you can see my two slots here, each with a name and type.

<img src="https://static.raymondcamden.com/images/2018/12/sl1.jpg" alt="Alexa Slot Types developer console" class="imgborder imgcenter">

After defining my slots, I can then use them in my sample utterances. Remember that a skill has intents, which are the broad ways of talking to it, and the sample utterances describe those intents. My skill only has one intent (ignoring the built-in ones), so I simply added that one intent and wrote a set of utterances.

<img src="https://static.raymondcamden.com/images/2018/12/sl2.jpg" alt="My intent showing sample utterances" class="imgborder imgcenter">

All that was left now was the code. Here's the complete code for the skill, hosted on [Webtask](https://webtask.io/). 

```js
const NICE = [
  "Of course $NAME is on the nice list!",
  "Yes, $NAME is on the nice list!",
  "I'm happy to say that $NAME is on the nice list.",
  "$NAME is definitely on the nice list!"
];

const NAUGHTY = [
  "Unfortunately $NAME is on the naughty list.",
  "$NAME has been a bit naughty lately and is on the naughtly list sad to say.",
  "I'm sorry to say that $NAME is on the naughty list.",
  "Sadly, $NAME is on the naughty list."
]

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
function getQuote() {
  return quotes[getRandomInt(0, quotes.length - 1)];
}
*/

/**
* @param context {WebtaskContext}
*/
module.exports = function(context, cb) {
  
  console.log('santaList called');
  console.log(context.body.request);

  let req = context.body.request;

  if(req.type === 'LaunchRequest') {
    
   let response = {
      "version": "1.0",
      "response" :{
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "PlainText",
          "text": 'Ask Santa\'s List if your child is on the naughty or nice list!'
          }
        }
    };
    
    cb(null, response);

  }
  
  if(req.intent && req.intent.name === 'CheckList') {
    let name = req.intent.slots.Name.value;
    let list = req.intent.slots.List.value;
    
    let text;
    
    if(list === 'nice') {
      text = NICE[getRandomInt(0, NICE.length - 1)];
    } else {
      text = NAUGHTY[getRandomInt(0, NAUGHTY.length - 1)];
    }
    
    text = text.replace('$NAME', name);
    
    let response = {
      "version": "1.0",
      "response" :{
        "shouldEndSession": true,
        "outputSpeech": {
          "type": "PlainText",
          "text": text
          }
        }
    };
    
    cb(null, response);

  };
  
  
};
```

In general, the code breaks down into two main actions depending on the intent. The first one, `LaunchRequest`, handles people who just do "Alexa, open Santa's List", and I use it to provide help on how to use it. The second is where the fun comes in. Alexa will convert both the name, and naughty or nice selection, into code that's passed into my intent. You can see me accessing them via `intent.slots.Name.value` or `intent.slots.List.value`. I then select from a list of random strings and do a string replacement from `$NAME` to the actual name passed to the skill. 

What I like about this is that when I think of new responses, I can edit this code (via my browser, Webtask has an incredible online editor) and just write it, save it, and I'm done. There's nothing I need to do on the Alexa side at all. This is neat but it also brings up one of the negatives about Alexa development. If you do screw up your server-side code, you'll never know unless you log in to the portal and check for yourself. Alexa doesn't have any way of pinging you when things go wrong.

Not that I think it helps any, but you can browse the Amazon page for the skill [here](https://www.amazon.com/Raymond-Camden-Santas-List/dp/B07L9S81JJ). Let me know what you think and try building your own Alexa integration!

<i>Header photo by <a href="https://unsplash.com/photos/e3PvFOt5XjM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Chun Yeung Lam</a> on Unsplash</i>

