---
layout: post
title: "I'm not going to tell you to stop using ColdFusion UI tags anymore..."
date: "2014-01-23T10:01:00+06:00"
categories: [coldfusion,html5,javascript]
tags: []
banner_image: 
permalink: /2014/01/23/Im-not-going-to-tell-you-to-stop-using-ColdFusion-UI-tags-anymore
guid: 5136
---

<p>
For a while now, myself (and <i>many</i> others) in the ColdFusion community have been urging, begging, hell, <i>pleading</i> with developers to stop using UI tags in ColdFusion. Things like cfgrid, cfpod, etc, are easy to use, but in general lead to far more trouble than they are worth. I said this back in October of last year:
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/Yoda_Empire_Strikes_Back.png" />
</p>

<blockquote>
CFUI controls are the path to the dark side. CFGRID leads to CFLAYOUT. CFLAYOUT leads to CFPOD. CFPOD leads to suffering.
</blockquote>

<p>
But as the title says, I'm not going to bother anymore. Nope. Instead, myself, <a href="http://cfmlblog.adamcameron.me/">Adam Cameron</a> (and hopefully others) are going to tell you what to use instead.
</p>

<p>
We've launched a new project called <a href="https://github.com/cfjedimaster/ColdFusion-UI-the-Right-Way">ColdFusion UI the Right Way</a>. Yes, that is a pretty opinionated title. But Adam and I are pretty opinionated guys so this is to be expected. The idea is simple. For each of the UI tags we will discuss an alternative. We won't cover how to replace every single aspect of CFGRID (as an example), but instead focus on the high points and give you an idea of how you can go further. Also, each section will include demos you can run locally (with no set up) and a list of other alternatives. We won't be focused on one UI library. Rather, Adam and I (and anyone who contributes) will use whatever they are most familiar with. 
</p>

<p>
Again - the intent is to stop saying "Don't do X" but instead say "Do Y instead" - which I think we can all agree is more helpful.
</p>