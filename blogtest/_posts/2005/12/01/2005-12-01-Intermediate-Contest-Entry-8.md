---
layout: post
title: "Intermediate Contest Entry 8"
date: "2005-12-01T23:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/12/01/Intermediate-Contest-Entry-8
guid: 949
---

Welcome to the eighth entry in the <a href="http://ray.camdenfamily.com/index.cfm/2005/10/30/Intermediate-ColdFusion-Contest">Intermediate ColdFusion Contest</a>. The earlier entries may be found at the end of this post. Today's entry is from Scott Johnson. Before reading on, please check his application <a href="http://ray.camdenfamily.com/demos/contest2/sjohnson/bj/blackjack.cfm">here</a>. You can download his code from the download link at the bottom. Please respect the copyright of the creator.
<!--more-->
Wow. I like Flash Forms - but I was amazed at this one. I was certain he was using a normal Flash file, but I noticed the loader looked just like a normal Flash Form. I opened up the code and saw that I was right - Flash Forms. Now - to be honest - he is pushing things a bit. He uses Flash Remoting and certainly that is the kind of thing that may not work in future versions of ColdFusion. 

I am absolutely in love with this Flash Form - but due to the size - I'm going to suggest people download the zip and check out the file there. Not only does he use remoting, he employs some custom styles as well. 

So with all that raving - now I'm going to nit pick. First off, his application.cfm file looks like so: (Note that I had to modify the appPath variable for my server.)

<code>
&lt;cfapplication sessionmanagement="true" name="BlackJack"&gt;

&lt;!--- PLayers starting amount of money is set ---&gt;
&lt;cfset APPLICATION.startAmount = 1000&gt;
&lt;!--- Set the path that the application resides in, with respect to the host ---&gt;

&lt;cfset APPLICATION.appPath = "sjohnson.bj"&gt;

&lt;!--- if there is no blackjack cfc or if init variable is defined, create a new instance ---&gt;
&lt;cfif NOT IsDefined("SESSION.BlackJack") OR IsDefined("URL.init")&gt;
	&lt;cfobject component="components.BlackJack" name="SESSION.BlackJack"&gt;
	&lt;!--- initialize the cfc ---&gt;
	&lt;cfset SESSION.BlackJack.Init()&gt;
&lt;/cfif&gt;
</code>

He correctly caches his session variable, but doesn't do the same for his application variables. Therefore, every hit will recreate both startAmount and appPath in the Application scope. Not a horrible mistake - but something he should address. 

Oh - and he didn't var scope. Getting tired of me saying that yet?

One last note. I had to modify the darn appPath variable everytime I moved the code. Can anyone think of a good way to create a "dot" path from the current folder? 

Earlier Entries:
<ul>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/29/Intermediate-Contest-Entry-7">Entry 7</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/28/Intermediate-Contest-Entry-6">Entry 6</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/23/Intermediate-Contest-Entry-4">Entry 5</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/21/Intermediate-Contest-Entry-4">Entry 4</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/18/Intermedia-Contest-Entry-3">Entry 3</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/17/Intermediate-Contest-Entry-2">Entry 2</a>
<li><a href="http://ray.camdenfamily.com/index.cfm/2005/11/16/Intermediate-Contest-Entry-1">Entry 1</a>
</ul><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Ccamdenfamily%{% endraw %}5Csource{% raw %}%5Cmorpheus%{% endraw %}5Cblog{% raw %}%5Cenclosures%{% endraw %}2Fbj%2Ezip'>Download attached file.</a></p>