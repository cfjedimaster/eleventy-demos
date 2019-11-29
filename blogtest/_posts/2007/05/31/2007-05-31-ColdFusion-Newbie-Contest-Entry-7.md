---
layout: post
title: "ColdFusion Newbie Contest - Entry 7"
date: "2007-05-31T23:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/31/ColdFusion-Newbie-Contest-Entry-7
guid: 2080
---

Welcome to the 7th entry in the <a href="http://ray.camdenfamily.com/index.cfm/2007/4/16/ColdFusion-Newbie-Contest-Announced--Monster-Maker">ColdFusion Newbie Contest</a>. The entries just keep getting more and more interesting. I've got about 3 more after this so I'm hoping to wrap this series by next week. Today's entry is from Jonathon Stierman and his coworker Nicholas. I'm not quite sure if it was just Nicholas though.
<!--more-->
Take a look at the design. I know I keep saying it - but I'm really shocked at the design level of some of these entries. I know I wasn't doing design this week back in the day. Oh - and I'm not doing it this well now either. 

This one can run as a demo - check it out <a href="http://ray.camdenfamily.com/demos/contest6/camdencontest/">here</a>. 

First off - notice on the game display that the top portion, the pie charts, are actually built with ColdFusion's charting. That is one of the most unique uses of charting I have ever seen. Sometimes I forget how powerful and useful the charting is in ColdFusion. 

I also found his creature a heck of a lot easier to keep happy. That right there earns him brownie points. (But I'm pretty tired today so I wanted something easy!)

Now that I've praised it is time to complain. First off - his code made use of multiple paths that were hard coded. I counted about three variables that broke down on my machine because my paths did not match his. This isn't the first entry to do this - but the point is critical. 

In my case - the situation was a bit more radical. He developed on Windows. I ran it on a Mac. But even if you never have to switch operating systems, it is certainly possible that you might have to move from c:\websites\yoursite to d:\hosts\yoursite.com\wwwroot.

If you had to do this right now - would your code break? It is something to consider. 

Like other projects - this one too doesn't do quite enough validation. A good example is in index.cfm:

<code>
&lt;cfif isDefined("form.submitted")&gt;
	&lt;!---CREATE THE MONSTER WITH THE NAME ENTERED---&gt;
	&lt;cfset form.imagePath = "stock/creatures/"&form.imagePath /&gt;
</code>

Note that he doesn't check that form.imagepath actually exists. 

I liked how he put his main displays into a folder named displays. It reminds me a lot of Model-Glue views. 

Another thing I like is that he documented exactly what each action did to the creatures stats:

<code>
&lt;!---
Feed ( hunger++ )
Pet ( affect happiness++ and sanity+ )
Fetch ( affects happiness+++ )
Cuddle ( affect happiness+ and sanity++ )
Groom ( affect sanity+++)
---&gt;
</code>

I think maybe one other entry did this. This is very helpful for debugging and just QAing the project in general.

As for his CFC - he uses a CFC similar to an earlier entry - part bean - part generic handler. It is an interesting mix and now that I've seen it twice - it makes me wonder why folks are mixing two concepts like that into one CFC? I'm not saying it is horrible - just interesting.

Oh - and he forgot to var scope at places. I know - folks are tired of me saying that. But I won't keep reminding folks about our friend the var scope.

Ok - download the code folks and share your thoughts please!<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FCamdenContest%{% endraw %}2Ezip'>Download attached file.</a></p>