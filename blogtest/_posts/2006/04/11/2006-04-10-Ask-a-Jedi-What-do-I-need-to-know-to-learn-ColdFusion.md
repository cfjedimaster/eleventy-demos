---
layout: post
title: "Ask a Jedi: What do I need to know to learn ColdFusion?"
date: "2006-04-11T08:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/11/Ask-a-Jedi-What-do-I-need-to-know-to-learn-ColdFusion
guid: 1201
---

A reader asks:

<blockquote>
Hello Mr. Camden,

I have a quick question for you about learning
ColdFusion. What skill set does one need to have to learn ColdFusion
effectively. Currently I know HTML and CSS, but does one need to know Javascript
or Actionscript in addition?
</blockquote>

Why do I feel weird whenever someone calls me Mr. Camden? Anyway, I would say that at a basic level, you have all that you need. In fact, the HTML is enough. I would say that while you don't need to be an HTML expert, you want to really make sure you understand forms. If there is one thing I've learned in close to 15 years of web development - I'll never stop writing forms. (I can see it now - on my tombstone will be written one thing - &lt;/form&gt;.)

Because ColdFusion is so easy, you don't really need to know a lot coming into it. <b>However</b> - and I'm sure my readers will agree, there are definitely things you should learn to help <i>improve</i> your ColdFusion skills. Here are some of them in no particular order:

<ul>
<li>SQL: SQL is what you use to talk to databases, and it is typically every ColdFusion developers weak spot. It's mine for sure. Writing good SQL can really make a difference when it comes to the performance of your web application. I wish I could recommend a good book or web site, but most typically focus on one database in particular. I know I enjoyed Forta's <a href="http://ray.camdenfamily.com/index.cfm/2006/1/23/MySQL-Crash-Course-Review">MySQL Crash Course</a>, but again, it's just for MySQL. Whatever database you are working with - it would probably make sense to google for effective SQL and tips. 

One more thing to consider - if you find yourself doing any post processing on a query, rewrite it so that processing is done in SQL instead. A classic example is selecting a body from a table and using ColdFusion's left() function to only show a portion of it. This can be done in SQL instead and will result in a) less traffic between the back end and ColdFusion and b) a faster page in general.

<li>Encapsulation: This is basically the concept of code reuse. I'll kinda echo my last hint above: If you find yourself using the same code in more than one file, you need to look into encapsulation. The topic is a bit big for just this one little blog entry, but ColdFusion lets you reuse code in multiple ways, including the use of cfinclude, custom tags, user-defined functions, and coldfusion components. Effective use of encapsulation can take some getting used to - but it is typically the first thing I see newbie ColdFusion developers doing wrong. 

</ul>

So the above lists two basics skills I'd say you <i>need</i> - what about skills I'd <i>recommend</i>?

<ul>
<li>I'd definitely recommend getting into Flex 2. I've always thought Flex was cool, but the price was a bit, um, "scary" for some folks. Flex 2 is free now (except for the IDE, which you don't need to use if you don't want), and the language has had some big improvements. Flex 2 is everything I had hoped Flex 1 would be, so it's the perfect time to get into it if you haven't yet. 
<li>I'd also look into the various ColdFusion frameworks out there. As you know, I prefer <a href="http://www.model-glue.com">Model-Glue</a>, but there are others as well.
<li>You had mentioned CSS, and I would definitely ditto that. While not <i>required</i>, it certainly improves the HTML you generate. 
<li>And lastly - while I'd love to say ColdFusion is the only language out there, it isn't. I'd probably recommend having at least a workable knowledge of another platform, whether it be .Net or Java or PHP. All of those languages have things that are darn nice, even some things I wish ColdFusion would have. While I don't feel that any of them are as nice as ColdFusion, for your own career I can't stress how important it is to add to your skill set. 
</ul>