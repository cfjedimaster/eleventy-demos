---
layout: post
title: "A highly unusual ColdFusion arguments error"
date: "2013-02-26T20:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2013/02/26/A-highly-unusual-ColdFusion-arguments-error
guid: 4866
---

This one is weird. I don't mean kinda weird. I mean bat-crap insane what-the-hell type weird. Earlier today Jeremy Tan sent me some code that acted a bit odd. Let's take a look at it.
<!--more-->
<script src="https://gist.github.com/cfjedimaster/5044052.js"></script>

In the code snippet above, you can see some data being passed to a CFC within a transaction. Note - there are no actual database calls here, but that doesn't matter. The CFC is simply doing a dump of the Arguments scope:

<script src="https://gist.github.com/cfjedimaster/5044061.js"></script>

Now let's look at the output. There should be 6 dumps from the set() call and one in the middle for test2.

<img src="https://static.raymondcamden.com/images/screenshot71.png" />

Um... ok. We have 8 dumps. We <i>don't</i> have the dump of test2. Also note the third dump,  which should have "Bob in line 2", has it as 9. Oh, and even better, i is 2, not 3. 

Things get weirder if we simplify. I commented out everything but the last two calls:

<script src="https://gist.github.com/cfjedimaster/5044091.js"></script>

<img src="https://static.raymondcamden.com/images/screenshot72.png" />

Yep, three dumps. Here is where things get even more weird. Jeremy found that if he simply stopped using named arguments and switched to ordered ones, everything worked fine.

If there was a bug with the data being displayed (oh wait, there is that too), then I'd maybe think it made sense. Again, as a bug. But the <i>additional</i> calls just don't make sense at all.

Obviously this is could be really bad for anyone doing CFC calls inside a transaction. You can find Jeremy's forum post on the topic here: <a href="http://forums.adobe.com/thread/1159446">Weird transaction issue with implicit struct (and possible array)</a>. I've also asked him to fill out a bug report and post the link here.