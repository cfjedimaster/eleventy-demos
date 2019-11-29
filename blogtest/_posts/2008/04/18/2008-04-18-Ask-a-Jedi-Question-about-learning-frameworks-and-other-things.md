---
layout: post
title: "Ask a Jedi: Question about learning frameworks (and other things)"
date: "2008-04-18T11:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/18/Ask-a-Jedi-Question-about-learning-frameworks-and-other-things
guid: 2776
---

Henry asks quite a few questions regarding frameworks so I've split up his email into smaller parts.
<!--more-->
<blockquote>
<p>
I am encouraged to ask for your thoughts/suggestion
on the new developments around CF in terms of MVC/Frameworks/ORM's ...

I have been in CF for 7 years now and never had to consider MVC/OO/Frameworks on account of no need/desire by my clients/company. 
</p>
</blockquote>

Well let's be real here. A client is not going to ask you to use a framework. A client is going to ask you to build a site and most likely will assume you will follow best practices when building. Now I have had a few clients specifically request I use a framework, but those are the minority. 

Personally I don't use a framework because a client asks me to. I use a framework because it makes my life a heck of a lot easier as a developer. It also makes it easier to work with others since we have a standard to follow. 

<blockquote>
<p>
Outside of work and in my personal time over the years, I have built a site to promote natural health (works like
non-profit) www.liveherbals.com and is all CF (using the procedural and CustomTags). 

I am wanting to start out with a complete rewrite as a good
project to get back in to the game.

I would love to hear on your thoughts on
which to start with (going from EASY to HARD).

To take it step-wise and with
the limited time on hand, does this look like the right way to go?

1) convert all custom tags to CFC's and Application.cfm to Application.cfc (big change in thoughts)
</p>
</blockquote>

Well you have a couple of issues here. First off - yes, it is a good idea to convert from Application.cfm to Application.cfc. That's a no brainer. Secondly - does it make sense to convert all your custom tags to CFCs? Well, most likely, but there are still a few things that I think custom tags excel at, specifically layout. You can't "wrap" with a CFC. But if you switch to a framework like Model-Glue that will be less of an issue as you treat your layout like a view.

<blockquote>
<p>
2) start with some ORM (Reactor, Transfer or onTap) - which one?<br />
3) ColdSpring - any other options?
</p>
</blockquote>

Ok, I'm going to go out on a limb here, and I think people may disagree with me, and I may change my mind too. I know that very recently I expressed my deep love for ColdSpring and Transfer (Ray and Transfer sitting in a tree, K-I-S-S-I-N-G), but if you are just starting to get into frameworks, you may want to take it simpler. Baby steps. I'd probably suggest getting comfortable with your framework first. Then begin looking at ColdSpring. Then look at Transfer. (Or vice versa.)

Again though - take it slowly. At least for me I feel like if I don't truly get concept A I shouldn't move on to B. 

<blockquote>
<p>
4) FB/MachII/Model Glue/ColdBox - which
one?
</p>
</blockquote>

Luckily that is an easy question. Model-Glue. Period. No one will disagree with me, I promise. 

Seriously though - this is what I experienced. I began with Mach II. It didn't feel right for me. I then tried Model-Glue and loved it. Each framework appeals to different people so you really need to just pick one - give it a try - and see how it feels for you. I'm not saying to stop trying frameworks as soon as you find one that you like, but definitely don't give up if you aren't happy with the first one. (Or just use Model-Glue. Seriously. It's the Bees Knees and every other framework is un-American. But don't quote me on that.)