---
layout: post
title: "Serverless IoT for Enterprise Light Bulb Demos"
date: "2018-04-11"
categories: [serverless]
tags: [webtask]
banner_image: /images/banners/lightbulb.jpg
permalink: /2018/04/11/serverless-iot-for-enterprise-light-bulb-demos
---

Before I start, let me state a quick warning. No, this is not an Enterprise demo. Yes, it does involve a light bulb. This post was inspired by Burke Holland's post yesterday on his own light bulb/serverless demo ([Displaying the Weather With Serverless and Colors](https://css-tricks.com/displaying-the-weather-with-serverless-and-colors/)). No, my post is not as cool as his, but yes, I'll share a picture from my office which I *know* is far cooler.

A few months ago I was given a [LB100](https://www.tp-link.com/us/products/details/cat-5609_LB100.html) "Smart Wi-Fi LED Light Bulb" as a speaker gift. Out of the box it has great Alexa integration. As lame as it sounds, walking into my office and saying, "Computer, office light on", is a small thrill every day. And yes, I say it in this guy's voice:

![I'm like Picard, but with more hair.](https://static.raymondcamden.com/images/2018/04/makeitso.jpg)

While Alexa integration is nice and all, I was curious if there was a proper API for the device. While there seems to be no official, documented API (a strike against it imo), I found not one, but two npm packages for it:

* [tplink-lightbulb](https://www.npmjs.com/package/tplink-lightbulb)
* [tplink-smarthome-api](https://www.npmjs.com/package/tplink-smarthome-api)

I found the first one to be a bit easier so I stuck with it. It's both a CLI as well as a package you can use in your code. In order to use it, you need to figure out the IP address of your bulb. The mobile app that you use to setup the device reports the MAC address so I had to check my router to get the IP: 10.0.1.5.

My own particular bulb doesn't have many features. It doesn't support color for example. But it can be dimmed. So for my first test, I wrote this little script.

```js
const TPLSmartDevice = require('tplink-lightbulb');

const light = new TPLSmartDevice('10.0.1.5')
light.power(true, 5000, {
	'brightness':100
})
.then(status => {
console.log(status);
})
.catch(e => console.error(e));
```

The second argument, `5000`, simply refers to how long the bulb should take to change brightness. I ran it - and - voila - it got dark. I got a little bit excited about that. Just a little. But of course, this would be far cooler if it was serverless, right?

I popped over to [Webtask.io](https://webtask.io) and created a new empty function. I added the npm module my original script used and came up with this little beauty:

```js
'use strict';

const TPLSmartDevice = require('tplink-lightbulb');

/**
* @param context {% raw %}{WebtaskContext}{% endraw %}
*/
module.exports = function(context, cb) {

  const light = new TPLSmartDevice(context.secrets.ipaddress)

  light.power(true, 2000, {% raw %}{ 'brightness':0}{% endraw %});
  setTimeout(() => {
    light.power(true, 2000, {% raw %}{ 'brightness':100}{% endraw %})
    .then(status => {
      cb(null, {% raw %}{status:status}{% endraw %});
    });
  },2100);
  
};
```

So what's with the nesting and timeouts and so forth? While the light API has a callback, it represents the successful call out to the hardware. It does *not* represent the end of an operation, which in this case is 2000ms along with other network delays. Therefore I used the callback of the "dim" operation (setting `brightness` to 0) to set up a timeout for *a bit more* then my first duration to kick off another call to brighten the bulb up again.

Yes - this could be written better. I got some great support from the creator of the tplink-lightbulb package ([David Konsumer](https://github.com/konsumer)) and he wrote it in a much sexier fashion (although reversed):

```js
import TPLSmartDevice from 'tplink-lightbulb'

// wait delay ms to resolve
const later = delay => new Promise(resolve => setTimeout(resolve, delay))

const light = new TPLSmartDevice('10.0.0.200')

const main = async () => {
  await light.power(true, 1000, {% raw %}{brightness: 100}{% endraw %})
  await delay(1000)
  await light.power(true, 1000, {% raw %}{brightness: 0}{% endraw %})
}
main()
```

See folks, this is why I don't pass Google interviews! My version was almost ready, except I had to open a port. Yes, I opened a port on my network.

![OMG](https://static.raymondcamden.com/images/2018/04/jb.jpg)

Believe it or not, it actually was this dramatic as I had to figure out the port and Apple's clunky interface for their router.

But it was so worth it. I copied the URL out of the webtask editor and set it as the webhook for one of my GitHub repos. For the hell of it, I also set it as a Netlify hook (my host) to run when a build is complete. Now, whenever one of those events occurs, my light will dim and get bright again as a nice, passive notification.

I tried to take a video of it, but while it looked perfectly fine in real life, the video just didn't do it justice. Therefore I created a really horrible animated gif out of it:

![OMG](https://static.raymondcamden.com/images/2018/04/badvid.gif)

I apologize for that.