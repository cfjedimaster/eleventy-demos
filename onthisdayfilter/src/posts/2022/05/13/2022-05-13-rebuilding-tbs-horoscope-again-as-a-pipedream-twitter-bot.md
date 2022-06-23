---
layout: post
title: "Rebuilding TBS Horoscope (Again) as a Pipedream Twitter Bot"
date: "2022-05-13T18:00:00"
categories: ["severless"]
tags: ["pipedream"]
banner_image: /images/banners/tarot.jpg
permalink: /2022/05/13/rebuilding-tbs-horoscope-again-as-a-pipedream-twitter-bot.html
description: An updated version of my TBS Horoscope app - now as a Twitter bot built with the Pipedream service
---

I've got a problem. Honestly, I do. I keep building stupid Twitter bots. But - I can honestly say that this time - like many times - I kinda did something cool and learned something, and that makes it worthwhile, right? So what did I do this time? 

Many years ago, almost eleven actually, I built a [TBS Horoscope](https://www.raymondcamden.com/2011/08/28/Latest-Nook-App-TBS-Horoscope/) application. This application created completely fake and silly horoscopes (the TBS stands for total bull pucky) and made use of Flex Mobile. Remember that? Even better - it was built for the [NookColor](https://en.wikipedia.org/wiki/Nook_Color). 

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/tbs1.jpg" alt="Remember this thing?" class="lazyload imgcenter">
</p>

I miss Flex Mobile as it was a pretty fun platform to build with. Not to be outdone though - a few years later, I then rebuilt it as an [Alexa skill](https://www.raymondcamden.com/2017/10/04/rebuilding-a-flex-mobile-app-as-an-alexa-skill). I built this using the [OpenWhisk](https://openwhisk.apache.org/) platform which was one of the easiest to use serverless platforms at the time. 

Apparently, at some time I also uploaded it to the [Amazon app store](https://www.amazon.com/Raymond-Camden-TBS-Horoscope/dp/B006E53WPK/ref=sr_1_1?crid=18PPC7W5DJD5P&keywords=tbs+horoscope&qid=1652473255&s=mobile-apps&sprefix=tbs+horoscope%2Cmobile-apps%2C76&sr=1-1) for 99 cents. I don't think I'll be retiring anytime soon. 

This morning I decided to see how quickly I could get it running as a Twitter bot. This was done for no special reason and certainly not due to rumors that a certain billionaire was having second thoughts about his purchase of a social network due to the number of fake accounts it had on it. Honest. Would this face lie to you?

<p>
<img data-src="https://static.raymondcamden.com/images/2022/05/tbs2.jpg" alt="Innocent cat is innocent." class="lazyload imgborder imgcenter">
</p>

As I've shown here a few times now, the process of building a Twitter bot on Pipedream is a few simple steps:

* Figure out what account will be tweeting. Normally this is a new one so make yourself a new account. Twitter requires email addresses for accounts and I usually just go with the "plus" addressing trick on Gmail. 
* Create a workflow on Twitter that is schedule-based (assuming you want a bot to simply tweet on a schedule, you can build bots that look for keywords or activate on other conditions). 
* Figure out what you're going to tweet
* Send the tweet (this is done by Pipedream - you don't need to code it at all)

In the above, literally, the only code you write is that second to the last step. So for me, this involved taking the code I had written previously to generate random, senseless horoscopes (unlike real horoscopes which are totally sensible) and then output them. Here's how that code looked.

```js
import { generateSlug } from 'random-word-slugs'

const signs = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

function getAdjective() {
  return generateSlug(1, {
    partsOfSpeech:['adjective']
  });
}

function getNoun() {
  return generateSlug(1, {
    partsOfSpeech:['noun']
  });
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
        "Something something you're special and important something something. " ,
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

function getHoroscope() {
  let horoscope = `${getSign()}: 
${getRandomString()}${getFinancialString()}${getRomanticString()}

Your lucky numbers are ${randRange(1,10)}, ${randRange(1,10)} and ${getNoun()}.`;
  return horoscope;
}
```

Here are a few examples:

<blockquote>
Gemini:<br/>
A dark stranger will enter your life. They will have a defeated island. You can buy a lottery ticket or a restaurant. Either is a good investment. Romance is blossoming like a sticky book! 

Your lucky numbers are 3, 9 and toddler.
</blockquote>

And then...

<blockquote>
Aquarius: <br/>
Your sign is in the second phase today. This is critical. Consider selling your byte for a good return today. Avoid romantic engagements today. Wait for a sign - it will resemble a magnificent analyst. 

Your lucky numbers are 5, 4 and grandmother.
</blockquote>

And finally...

<blockquote>
Aries:<br/>
A melodic boy will give you important advice today. You can buy a lottery ticket or a denmark. Either is a good investment. You will fall in love with a Sagittarius but they are in love with their spoon. 

Your lucky numbers are 3, 6 and insect.
</blockquote>

Ok, so the code above is the logic for generating a tweet message. Initially, I just returned it as is... and then I realized something. My horoscopes may be too long. On a whim, I tried this in the excellent [RunJS](https://runjs.app/):

```js
let bad = 0;
for(let x=0;x<1000;x++) {
  let h = getHoroscope();
  if(h.length > 280) bad++;
}
console.log('i got '+bad + ' bad items');
```

In my test, I saw between 30 to 50 strings that were too long. That's not *too* bad, and I thought... maybe I could simply loop until I got one that wasn't too long? Then I had a not-quite-as-smart thought - what if I just tried a few more times?

```js
let bad = 0;
for(let x=0;x<1000;x++) {
  let h = getHoroscope();
  if(h.length > 280) h = getHoroscope();
  if(h.length > 280) h = getHoroscope();
  if(h.length > 280) bad++;
}
console.log('i got '+bad + ' bad items');
```

That is lame as you know what - but guess what? In my testing, the number of bad results went down to zero. 

So back in Pipedream, my code step does this:

```js
export default defineComponent({
  async run({ steps, $ }) {

    let horoscope = getHoroscope();
    /*
    So, sometimes a horoscope is too big. If it is, we will try one more time and then just give up
    because this is just a stupid bot. Or heck, let's try 3 times total.
    */
    if(horoscope.length > 280) horoscope = getHoroscope();
    if(horoscope.length > 280) horoscope = getHoroscope();
    // I give up. It wasn't meant to be.
    if(horoscope.length > 280) $.flow.exit('I couldnt create a short enough horoscope and life is meaningless...');

    return horoscope;
  },
})
```

Here's an example tweet:

<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">Leo: <br>Your spirits are high today - but watch our for a powerful hydrogen. Today is a bad day to invest. Stock prices will change. Love is in the air. Unfortunately not the air you will be breathing. <br><br>Your lucky numers are 4, 10 and parrot.</p>&mdash; TBS Horoscope (@tbshoroscope) <a href="https://twitter.com/tbshoroscope/status/1525211000508665858?ref_src=twsrc%5Etfw">May 13, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

If you like it, give ole [TBS Horoscope](https://twitter.com/tbshoroscope) a follow, and thanks for reading this far!
