---
layout: post
title: "Intermediate Contest Entry 7"
date: "2005-11-29T18:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/29/Intermediate-Contest-Entry-7
guid: 943
---

Welcome to the seventh entry in the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/30/Intermediate-ColdFusion-Contest">Intermediate ColdFusion Contest</a>. The earlier entries may be found at the end of this post. Today's entry is from Jason Fill. Before reading on, please check his application <a href="http://ray.camdenfamily.com/demos/contest2/jfill">here</a>. You can download his code from the download link at the bottom. Please respect the copyright of the creator.
<!--more-->
The first thing I noticed was how the page updated. It was obviously DHTML (or AJAX, or whatever you wanted to call it), so I dug a bit into his code. I'm going to cheat a bit and make my writing a bit easier by quoting his docs from play.cfm:

<blockquote>
As you will see below, the doRequest() function is the main JS function that is called.  
Basically, that function dynamically writes JS code to the page by using the create element method.
So we call a specific function based on what we need to do, for example if the player wants to hit,
we call the playerHit() function which sets the the actual page we want to call, then from within
the playerHit() function we call the doRequest() function to create the element on the page.  When the 
element is created on the page it actually makes the call to the url that we set in the original function
playerHit() and that does the page rendering behind the scenes.  If you look at the template that it calls
playerhit.cfm.  You will see all the code that works behind the scenes to perform the actual player hit.  Then at the bottom of the page you will see 2 additional function calls - updatePlayer() and showTable().
</blockquote>

Very good job on the documentation. (The text above is only a small portion.) This is the JavaScript code he is talking about:

<code>
function doRequest(url){
	// this is the core of all the functions.  It will make the request happen
	// create &lt; script &gt; element
	var js=document.createElement('script');
	// assig n  &lt; script &gt; attributes
	js.setAttribute('language','javascript');
	js.setAttribute('src',url);
	// append element to document tree & send GET request
	document.getElementsByTagName('head')[0].appendChild(js);
}
</code>

I've never seen anything like this so it was pretty interesting. If you take a look at one of the files that serve as a response, you will see that he generates a large string and saves it using cfsavecontent.  He then performs some formatting on it for JavaScript, and updates content on the main page. A bit complex - but I think you have to admit that it shows up nicely. I can say that I find the dealer's turn a bit too quick. I sometimes got confused as to what happened, as it seemed as if while I was reading what he just got dealt, another card would be dealt as well. This was also noticeable when I got 21. The game automatically made me stay, which makes sense, but it just felt a bit weird when playing. From an organizational stand point, I'd probably consider moving the "server" files to another folder, just so it is obvious what files act as "servers" to the JavaScript.

Now for the bugs. I was able to confuse (and break) the application by hitting back after I my bank was empty. The game reported I had (25) in the bank, which I suppose is it's way of reporting negative 25. After I tried to play though it just kind of hung there. 

I also swear I saw the dealer stay once on 16 - but I didn't see it happen again. 

As with many other submissions, his CFC doesn't use var scoping. (Yes, I'm getting to be a bit crazy about it, aren't I?)

Earlier Entries:
<ul>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/28/Intermediate-Contest-Entry-6">Entry 6</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/23/Intermediate-Contest-Entry-4">Entry 5</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/21/Intermediate-Contest-Entry-4">Entry 4</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/18/Intermedia-Contest-Entry-3">Entry 3</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/17/Intermediate-Contest-Entry-2">Entry 2</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/16/Intermediate-Contest-Entry-1">Entry 1</a>
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fjfill%2Ezip'>Download attached file.</a></p>