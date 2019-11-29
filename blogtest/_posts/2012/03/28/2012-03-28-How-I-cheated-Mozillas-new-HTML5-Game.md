---
layout: post
title: "How I cheated Mozilla's new HTML5 Game"
date: "2012-03-28T15:03:00+06:00"
categories: [html5,video games]
tags: []
banner_image: 
permalink: /2012/03/28/How-I-cheated-Mozillas-new-HTML5-Game
guid: 4573
---

Disclaimer: I'm not advocating cheating as a good thing. I'm not insinuating that Mozilla's code was somehow lacking (actually the code is pretty kick ass). Nor am I trying to pretend I'm some super hacker. Rather - I thought I'd share how I modified Mozilla's new game to cheat as a way of demonstrating things you have to look out for when coding HTML5-based games. Also - my <i>very first</i> programming experience was pretty similar. I had to learn hex so I could edit my Bard's Tale game saves via a disk editor on my Apple 2e. I figured a legacy as rich as that deserves a rebirth. ;)
<!--more-->
<p>

So first - some context. Yesterday Mozilla announced the launch of <a href="http://browserquest.mozilla.org">Browser Quest</a>. This is a multiplayer online roll playing game. The mechanics aren't terribly complex (non-gamers should give it a try), but it is a pretty cool example of what can be done with HTML5. 

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip55.png" />

<p>

Simply connect to the site, enter a name, cross your fingers (it is a bit overwhelmed right now), and start playing.

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip56.png" />

<p>

What's really cool is that Mozilla has also open sourced the entire game - both the front end client and back-end technology. You can peruse the code here: <a href="https://github.com/mozilla/BrowserQuest">https://github.com/mozilla/BrowserQuest</a>

<p>

I played it for a bit (research!) and noticed right away that they were using LocalStorage. I've got a Chrome extension (<a href="https://chrome.google.com/webstore/detail/bpidlidmmmnapeldonddkjmmjkpeiabi">LocalStorage Monitor</a>) that highlights when a site is using LocalStorage and lets me examine the contents quickly. Here's what I saw on the site:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip57.png" />

<p>

First thing I noticed - my inventory was stored in LocalStorage. That meant I could modify my inventory. After looking at the code, I realized they had a simple list of swords and armors that were ranked by a simple numeric index. If you gave yourself the top weapon/armor, then you would be set. 

<p>

So step one was to pop into console and copy out the value:

<p>

<code>
copy(localStorage["data"])
</code>

<p>

This copied the value (a JSON string) into my clipboard. I pasted it into notepad, and simply edited the two values:

<p>

<code>
{% raw %}{"hasAlreadyPlayed":true,"player":{"name":"Romana","weapon":"goldensword","armor":"goldenarmor","image":"data:image/png;base64,deleted"}{% endraw %},"achievements":{% raw %}{"unlocked":[2,5,11,6],"ratCount":3,"skeletonCount":1,"totalKills":5,"totalDmg":11,"totalRevives":0}{% endraw %}}
</code>

<p>

I took the string, went back into console, and did...

<p>

<code>
localStorage["data"] = (pasted my string here)
</code>

<p>

Reloaded the page, and voila - I'm an Epic Avenger of Mighty Awesomeness:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip58.png" />

<p>

Just to repeat - I'm not trying to diminish anything Mozilla did here. It's a great demo. Just don't forget that localStorage, like any client data, is inherently insecure. 

<p>

p.s. Wondering why you see a 5Tagger character and Romana? Just different tests, that's all.