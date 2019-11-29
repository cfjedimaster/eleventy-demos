---
layout: post
title: "Ask a Jedi: jQuery versus Spry..."
date: "2008-06-28T11:06:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2008/06/28/Ask-a-Jedi-jQuery-versus-Spry
guid: 2903
---

Michael asks:

<blockquote>
<p>
I'm hoping you can give me some good Jedi counsel on this one.  My question is, should I learn jQuery or Spry?  To my inexperienced eye these appear to be competing technologies; if they aren't and I'm comparing apples to oranges then I apologize.  I know you're a big fan of Spry, but I've been
hearing a lot about jQuery lately.  For example, at CFUNITED I spoke with a number of people about this and they all recommended learning jQuery over Spry.
</p>
</blockquote>
<!--more-->
Good question. Before I answer, let me be clear about my experience with both since that obviously colors my opinions. I've been using Spry for close to two years now. Spry was my 'gateway drug' back into the world of JavaScript. I had avoided it for years due to all the crap you had to deal with in terms of supporting multiple browsers. 

I picked up jQuery about two months ago. My first real experience was in rewriting the Ajax functionality of <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a>. CFB wasn't using Spry. It uses ColdFusion 8's built in Ajax functionality. I've continued to play with jQuery since then but certainly would not consider myself as knowledgeable in it as I am with Spry.

So with that said - here is what I think.

I find Spry to be extremely easy to pick up and use. It has a practicality that reminds me a lot of ColdFusion. When it comes to getting data, specifically tabular data (which is something we work with quite a bit) and displaying it on screen, Spry shines. It's a bit like how ColdFusion makes hitting the database and displaying data extremely easy. Sure ColdFusion does a thousand other things, but I'd probably use ColdFusion even if it only had cfquery and cfoutput. 

Spry has other features as well. UI functions and effects. But it's main focus is on getting data and letting you work with it.

I find jQuery to be not as easy to pick up. However, I think I'm in the minority in that respect. I feel like jQuery can be a bit hard to read at times with it's use of chaining. By that I mean you will see many examples like this:

something.hide("quick").move("slowly").dance("aluringly").somelastaction("end")

And while that is "cool", my brain just finds that a bit hard to process. You do <b>not</b> have to write jQuery that way. But when I was first picking it up, that's the method I seemed to see quite a bit. For me - being very rusty to JavaScript, this just wasn't a friendly introduction. I kinda feel like jQuery is going to be easier for folks with JavaScript experience already. (To be clear, I did have quite a few years of JS experience - I just let it get rusty.) 

That being said - I'm finding jQuery to be more powerful in other areas. Or if not more powerful, just simpler to use. So for example, being able to quickly load some content into a div seems easier in jQuery, now that I've gotten over the initial hump. I also like the effects in jQuery a bit better. 

The amount of plugins - something jQuery folks brag about - to me isn't always such a good thing. It seems like if you want a good tab controller, you need to pick from 500 plugins. The jQuery UI project though is working on improving that - which I think is critical for jQuery's success. As a new user, I don't want to have to pick a tab plugin. I just want the best of breed. I can appreciate that jQuery will let me pick other plugins, but as a new user, make it simple for me please.

Before I ramble on even more, let me try to summarize. Spry is definitely easier to pick up, and if your main goal is to simply get data via Ajax and display/sort/filter, then Spry would be your best. If you are going beyond that, and perhaps have prior JavaScript experience already, then jQuery would be better. I know I'm trying to focus my attention on it now as it certainly does <b>not</b> hurt to learn both. A good programmer needs more than one tool in their belt.