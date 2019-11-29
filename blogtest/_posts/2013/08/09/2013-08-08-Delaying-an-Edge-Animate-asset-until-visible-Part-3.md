---
layout: post
title: "Delaying an Edge Animate asset until visible - Part 3"
date: "2013-08-09T09:08:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2013/08/09/Delaying-an-Edge-Animate-asset-until-visible-Part-3
guid: 5003
---

Surprisingly, my blog posts (see the Related Entries section below) on <a href="http://html.adobe.com/edge/animate/">Edge Animate</a> and delaying animations were much more popular than I thought. In the comments section folks came up with some interesting questions and discussions about the techniques I presented. One of them was rather fascinating - and like all good questions - led to some interesting code.
<!--more-->
A reader had created a vertically large animation. The animation was more than large enough to require scrolling to see the entire thing. What he wanted to then was to have <i>internal</i> items, i.e. animations inside the core animation, that would delay their animation until visible.

In order to demo this, I created a new Edge Animate animation and edited the stage to be very large vertically. I then created a Symbol and defined an animation on the symbol itself. Lastly, I set the autoplay to false.

<img src="https://static.raymondcamden.com/images/Screenshot_8_9_13_8_17_AM.png" />

So... now came the interesting part. I assumed I could do something similar to my previous entries. Wait for the element to be visible and then start the animation.

I began by working with the creationComplete event. I should point out that symbols have their own events as well. <strong>I'm not convinced I know what best to use here.</strong> I assumed that that the creationComplete on the stage made the most sense since to me, it meant that <strong>everything</strong> was ready. I then wrote code to get my symbol and used the same logic as before:

<script src="https://gist.github.com/cfjedimaster/6193538.js"></script>

Pardon the somewhat wonky spacing there. If you read the previous entries then you know isScrolledIntoView is a utility function I included to see if the DOM item was visible.

Here is where things broke down. My item was being reported as <strong>always</strong> in view, even when it certainly was not! I added some logging, and discovered that when the web page loaded, my symbol had a "page x" and "page y" of 0,0! 

And then things got crazy. For the heck of it, I added a setTimeout call for one second. When I did that and reported the position of my symbol, it was correct.

What. The. Heck. (And that's not what I said. ;)

Luckily I've got friends in high places. I spoke a bit with Josh Hatwich, a principal scientist on the Edge Animate team, and he suggested checking the display property of the symbol. When I did that, I found that my symbol had a display value of none initially, and then block in my setTimeout. This is why the positioning was so screwy.

What he recommended then was a simple fix - force the display property on the item and then check if it is visible. Here is the version I went with - there is only one line different:

<script src="https://gist.github.com/cfjedimaster/6193556.js"></script>

And this works. (There is a demo link at the bottom.) Speaking more with Josh, he agreed that this use case may need some additional help from the JS API to work better in the future. So please note that what you see here may be better handled in a future EA update. I've included a zip of my code - but know that the .an file is not working correctly. I'm looking into that as well. 

When you view this demo, you'll see a very tall pink box. In theory, you will not see a yellow box. When you scroll down and you see it, it should begin to move to the right. Please be sure you are sitting. My design skills are so incredible you may fall to the ground and I do not wish to be the cause of any physical damage.

<a href="http://raymondcamden.com/demos/2013/aug/9_2/Untitled-1.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FArchive31%{% endraw %}2Ezip'>Download attached file.</a></p>