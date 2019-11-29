---
layout: post
title: "My OpenWhisk Alexa Skill is Live!"
date: "2017-03-20T16:58:00-07:00"
categories: [serverless]
tags: [openwhisk,alexa]
banner_image: 
permalink: /2017/03/20/my-openwhisk-alexa-skill-is-live
---

I've blogged a few times now about my attempts to build an Alexa Skill with OpenWhisk (<a href="https://www.raymondcamden.com/2017/03/09/an-introduction-to-creating-alexa-skills-with-openwhisk">An Introduction to Creating Alexa Skills with OpenWhisk</a> and <a href="https://www.raymondcamden.com/2017/03/17/creating-alexa-skills-with-openwhisk-part-two">Creating Alexa Skills with OpenWhisk - Part Two</a>) and I'm happy to say today that my skill finally passed certification!

<!--more-->

![Happy Letter of Happiness](https://static.raymondcamden.com/images/2017/3/alexa20a.png)

Alexa Skills have their own product pages and you can see mine here: https://www.amazon.com/dp/B06XP7Q3K3/ref=sr_1_1?s=digital-skills&ie=UTF8&qid=1490026649&sr=1-1&keywords=cat+namer

So - how was the verification process?

Initially - I made mistakes with my sample utterances (a configuration you provide for the skill) and the sample tests I sent to the verification team. Stuff like my skill supporting:

	ask cat namer to give my cat a name

and me saying this would work:

	ask cat namer to give my cat a new name

My brain kinda glossed over the difference there, but it was enough to make it fail verification.

A second issue I had was supporting the "open" event, or basically, someone using my skill without actually asking anything. That's a requirement and your code has to handle it. Basically, I just sniffed for no intent:

<pre><code class="language-javascript">if(!request.intent) request.intent = {% raw %}{name:'randomName'}{% endraw %};
</code></pre>

Your skill, of course, may do something different in that case. 

Finally - and this was the tricky one - I had suggested "foo" for a name prefix (my cat namer supports letting you pass in the first part of the name, it then appends a random name after that). Alexa would translate foo to four though. This is what I got from the verification team:

<blockquote>
User: "Alexa, ask cat namer to give my cat a name that starts with foo"
Skill recognizes it as "Alexa ask cat namer to give my cat a name that starts with four" and responds with "Your random cat is 4 King Dumpster Fire"
</blockquote>

Now to me - that smells like an Alexa issue. The user said "foo", but it heard "four" - I honestly don't know how I'm expected to fix that. But I removed foo from my slot type options, removed it from the suggested type, crossed my fingers and submitted and then it passed. On the Alexa Slack channel, some folks suggested simply resubmitting sometimes worked well. 

All in all - the process wasn't too painful, and I'm working on a new skill now (but as I've got two big trips back to back, it may be a while). If you want to see the full source for my released skill, I've put it up here: https://github.com/cfjedimaster/Serverless-Examples/tree/master/randomcat3

If I can answer any questions about this process, or provide more info on the OpenWhisk side, just ask!