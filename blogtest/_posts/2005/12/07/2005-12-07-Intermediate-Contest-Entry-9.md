---
layout: post
title: "Intermediate Contest Entry 9"
date: "2005-12-07T16:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/07/Intermediate-Contest-Entry-9
guid: 957
---

Welcome to the ninth entry in the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/30/Intermediate-ColdFusion-Contest">Intermediate ColdFusion Contest</a>. The earlier entries may be found at the end of this post. Today's entry is from Lior Gonda. Before reading on, please check his application <a href="http://ray.camdenfamily.com/demos/contest2/lior/BJ">here</a>. You can download his code from the download link at the bottom. Please respect the copyright of the creator. As with the last contest, it is taking a while to go through the entries, but I hope people are finding this worthwhile. We only have 3 left, so I'm hoping to have a winner Friday night.
<!--more-->
So - I have to say that I really don't like the design. Well - not the design per se - but the colors. I found it very hard to read. Maybe it's just my eyes - but the text of the buttons was very hard to make out. I'd probably consider a backgroud color for the play area while keeping the wood background. This isn't a design contest of course - but still, it bugged me.

While playing, I noticed that there didn't seem to be a way to end the game. I ended up with 5 bucks left, and was stuck. I couldn't bet less then 10, and every button  I hit simply told me I didn't have enough(t) money. (Typo there too.)

Let's take a look at his code. The first thing I saw that bugged me was this from Application.cfm:

<code>
if ( not isDefined('session.com.deck') or isDefined('URL.flush') ) 
	session.com.deck = createObject('component','models.deck').init(1);
</code>

There isn't anything wrong with the structure here, but he uses session.com without defining session.com as a structure. I've <a href="http://ray.camdenfamily.com/index.cfm/2005/10/24/ColdFusion-Contest--Final-Entries">blogged</a> about this before. While CF won't throw an error, I still don't think you should do this.

One thing I did like about his code was the separation of code into a controllers, model, and view folders. Very <a href="http://www.model-glue.com">Model-Glue</a> like. I'm a big fan of this kind of organization and I'm happy to see it in this entry. 

One major gold star for the application - his CFCs are properly var scoped! Although I did notice that hand.cfc, on line 169, had a text string outside the last function. Just a typo - but hey, I noticed it. ;)

That's all I really have to say. Outside of the serious design problems I have, and the betting bug (plus the inability to start a new game), this is a very nice entry I think.

Earlier Entries:
<ul>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/12/1/Intermediate-Contest-Entry-8">Entry 8</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/29/Intermediate-Contest-Entry-7">Entry 7</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/28/Intermediate-Contest-Entry-6">Entry 6</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/23/Intermediate-Contest-Entry-4">Entry 5</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/21/Intermediate-Contest-Entry-4">Entry 4</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/18/Intermedia-Contest-Entry-3">Entry 3</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/17/Intermediate-Contest-Entry-2">Entry 2</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/16/Intermediate-Contest-Entry-1">Entry 1</a>
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Flior%2Ezip'>Download attached file.</a></p>