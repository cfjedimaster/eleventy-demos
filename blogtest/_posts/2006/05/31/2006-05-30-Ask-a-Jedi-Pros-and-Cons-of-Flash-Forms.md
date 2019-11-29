---
layout: post
title: "Ask a Jedi: Pros and Cons of Flash Forms"
date: "2006-05-31T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/05/31/Ask-a-Jedi-Pros-and-Cons-of-Flash-Forms
guid: 1306
---

Brad asks:

<blockquote>
What are
pros and cons for using flash forms with coldfusion? I would like to try them but I would like to see pros and cons first before I make a decision in using them for an application.
</blockquote>

Since the release of CFMX7, I've changed my mind a bit about Flash Forms. When it first came out, I wanted to use them everywhere. In fact, <a href="http://ray.camdenfamily.com/projects/lhp">Lighthouse Pro</a>, my bug tracker, did just that. I quickly came to realize that this was not working well so I removed them all. Does that mean I don't like the feature? Of course not! I still think it is a cool feature, but I think you need to carefully consider where to use them. Let me try to cover some of the pros and cons (in my opinion):
<!--more-->
<b>Pros:</b><br>
Flash Forms (and Flash/Flex in general) allow for much more powerful form controls then what you get out of the box. Some of what Flash Forms can do can also be done in DHTML, but I dare you to find a system as easy to use as Flash Forms. Consider the simple grid. It takes all of 2 minutes to add to a page and gives you a nice way to present a large table. You get sorting, you get a nice scroll bar, etc. I think the grid is probably my favorite aspect of Flash Forms. 

Another aspect I like about the forms is the layout controls. I hate building forms, and I like how Flash Forms makes this much simpler and let's me forget about tables for a while. (Yes, I know I can build my forms with CSS. I suck at CSS.)

So I think, in general, the pros are the enhanced capabilities of the form (grid controls, calendar controls, etc) along with the ease of use.

<b>Cons:</b><br>
First off - you need to require Flash. I think most folks are ok with that, especially with the penetration of the Flash plugin. 

The biggest con for me though is the overhead. If you build a little 3 field Flash Form you will be really slowing down your page for what should be an extremely quick display. I don't blame Flash Forms for this - but it goes back to what I mentioned before - knowing where to use them. When I used them <i>everywhere</i> for Lighthouse Pro, I was making a mistake. Flash Forms are slower to load. For a complex form, it is more than worth it. For a simple form, you want to use basic HTML.

Lastly - Flash Forms are powerful, but you can't do everything. A lot of times you find yourself "hitting the wall" in what is possible. So you end up with a result that is "almost perfect" and so close to what you want, but not quite there. 

So where do I fit in now? I will continue to use Flash Forms for grids and multi-step forms (like check out processes), but I'm using them a bit less now then when I first started working with CFMX7. I'm also turning my attention a heck of a lot more to Flex 2. In fact, I'm thinking about ways I can build some functionality into a Flex2 app such that it can be controlled via ColdFusion via custom tags. (As always, finding the time is the issue.)

I know my readers will have some pretty varied responses to this, so let me know what you think.