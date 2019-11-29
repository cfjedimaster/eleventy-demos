---
layout: post
title: "2 Quick ColdFusion 8 RichText Editor Tips"
date: "2009-05-27T13:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/05/27/2-Quick-ColdFusion-8-RichText-Editor-Tips
guid: 3374
---

A reader sent me a question earlier in the week about adding a custom toolbar to ColdFusion 8's implementation of fckEditor. Just in case you haven't seen this before, fckEditor is a richtext editor that allows people to do basic HTML editor within a web form. My personal opinion is that these things are more trouble than they are worth. 9 times out of 10 the client isn't happy with the result. No big surprise really. HTML is a skill. It's like a client asking for medical equipment so they can do 'quick edits' on their body with hiring a surgeon. Ok, maybe not quite <i>that</i> complex, but really, I just don't like em. (I <i>did</i> like the KTML editor, but unfortunately it was killed off. I wish Adobe had just open sourced it.)
<!--more-->
Sorry for the sidetrack there. So - the tips. It just so happened that the reader had an issue getting his new toolbar to work. He had properly edited the fckconfig.js file, but every time he tried to use the editor he got an error. Imagine this CFML:

<code>
&lt;cfform name="form01"&gt; 
	&lt;cftextarea richtext=true name="text01" toolbar="blacksmokemonster" /&gt; 
	&lt;cfinput type="submit" value="Enter" name="submit01"/&gt; 
&lt;/cfform&gt; 
</code>

As long as blacksmokemonster is defined in the config file, it should work, right? When I first tested, I got this instead:

<img src="https://static.raymondcamden.com/images//Picture 327.png">

Turns out the issue is just caching. Now you may think - why would caching be involved? I bet that - like me - you have browser setup to not cache anything, right? Well even with that, there are cases where the browser still seems to cache. In my inspection of the 'flow' involved in loading the editor, it appears as if JavaScript is used to load HTML that includes code then to load the config JavaScript file. In all those requests it seems like the config file gets cached. I cleared my cache using the <a href="https://addons.mozilla.org/en-US/firefox/addon/60">Web Developer</a> toolbar and the problem went away. What's odd is that after the initial cache clear, I was able to edit my toolbar multiple times and see it reflected without clearing my cache. 

Ok, the second tip. The fckconfig.js file is within the ColdFusion CFIDE folder. You may know that cfform has a scriptsrc attribute which lets you point to another folder to load JavaScript files. You would probably want to work on a copy of the fckconfig.js file instead of messing with the files that ship with ColdFusion. This would be especially important if you plan on using a shared host. What I didn't remember though, and I have <a href="http://www.boyzoid.com">Scott Stroz</a> to thank for reminding me, is that the cftextarea tag has a basepath attribute. It works the same as scriptsrc, but let's you specify a folder just for fckEditor stuff.