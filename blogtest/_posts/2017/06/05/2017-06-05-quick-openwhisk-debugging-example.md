---
layout: post
title: "Quick OpenWhisk Debugging Example"
date: "2017-06-05T10:54:00-07:00"
categories: [serverless]
tags: [openwhisk]
banner_image: 
permalink: /2017/06/05/quick-openwhisk-debugging-example
---

Let me start off by saying that this is *not* a post about debugging serverless with OpenWhisk. I want to write something up on that at a good high/broad level. Rather I want to share a quick example since something I wrote broke recently and I thought it would be a good "real world" use case of something going wrong, how I looked into it, and how I corrected it. I think debugging/monitoring is one of the most crucial aspects of a serverless platform, and something OpenWhisk itself needs some help on, but again, I'll save that for a later post.

A few days ago I blogged about a new serverless project called Serverless Superman (["Building the Serverless Superman"](https://www.raymondcamden.com/2017/05/19/building-the-serverless-superman/)) This was a "kinda" simple little project where on a timed basis I'd look for tweets with the word "serverless", pick one by random, and then tweet it from the @serverlesssuper account after replacing the word "serverless" with "superman". I think it's going great so far:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Superman computing takes another step forward <a href="https://t.co/sKBnOJa7Q5">https://t.co/sKBnOJa7Q5</a></p>&mdash; Serverless Superman (@serverlesssuper) <a href="https://twitter.com/serverlesssuper/status/871713268066156545">June 5, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

If by "great" we mean silly and pointless of course. So, what went wrong?

First - I noticed something was wrong when I didn't see Serverless Superman in my "serverless" search column in my Twitter client. I had set it up to tweet once every ten minutes (assuming it could find a tweet in the past ten minutes) and after looking at the account's Twitter page, I noted it had been quiet for a few days. Unfortunately, OpenWhisk doesn't (currently) support any way to let you know if an action is having problems, and I have some thoughts on that, but as I said in the beginning, I'll discuss that more later.

So at this point, I need to had to figure out what went wrong. My app only used two services - OpenWhisk and Twitter. It is absolutely reasonable to think that Twitter could be down (it happens), but as I was looking at a few *days* of downtime (and I could visually verify Twitter was working) I knew that wasn't the case.

I then thought about how my app worked. Without going into too much detail (again, you can read the [post](https://www.raymondcamden.com/2017/05/19/building-the-serverless-superman/) on how I built it), I know I had:

* A trigger to handle doing "stuff" on a CRON-basis
* A rule to handle associating the trigger with an action
* A sequence that was my action for the rule
* All the component aspects of that sequence: Get tweets about serverless, find one, change it, then tweet it. (And while I'm only listing three things there, it's actually a set of *5* actions total.)

I began with the trigger. I fetched the activations for the trigger like so:

	wsk activation list serverless_superman_trigger

This returned my most recent activations filtered by the name:

![Activation list](https://static.raymondcamden.com/images/2017/6/owdebug1.jpg)

First thing you notice - there isn't a lot of information here. There's already an open bug to add a bit more detail here, most importantly, the date associated with each activation. I knew that it was sorted with the most recent on top, so I copied and pasted that into the CLI:

	wsk activation get 0d4ba8daaeeb4e609cb28f042c06defa

Which returns:

<pre><code class="language-javascript">{
    "namespace": "rcamden@us.ibm.com_My Space",
    "name": "serverless_superman_trigger",
    "version": "0.0.1",
    "subject": "rcamden@us.ibm.com",
    "activationId": "0d4ba8daaeeb4e609cb28f042c06defa",
    "start": 1496680201084,
    "end": 0,
    "duration": 0,
    "response": {
        "status": "success",
        "statusCode": 0,
        "success": true,
        "result": {
            "payload": ""
        }
    },
    "logs": [],
    "annotations": [],
    "publish": false
}
</code></pre>

Right away I see the trigger was a success, but I wasn't really concerned about it being successful. Literally all it has to do is run to be a success. What I needed was the *time* it ran. Unfortunately this is returned in a "seconds since epoch" format. I hopped over to [EpochConverter](https://www.epochconverter.com/) to get a real value. As a quick aside, if you actually do that for the sample above it will report a time from today, well "today" being relative to when I wrote this blog entry. Obviously the activations I was worried about were back when the thing died, and was dead. The important thing to note is that it was "current", in other words, some value in the past ten minutes.

Ok, so the trigger is fine. To be honest, I hate working with CRON as the syntax confuses the heck out of me, and that's why I wanted to ensure it was still firing. 

Alright - so next I checked activations on the rule. Again, I didn't expect anything but successes here and I wanted to confirm it. I ran:

	wsk activation list serverless_superman_rule

I then copied and pasted the activation ID for the most recent instance. Here is the result - and again - I didn't really expect much here:

<pre><code class="language-javascript">{
    "namespace": "rcamden@us.ibm.com_My Space",
    "name": "serverless_superman_rule",
    "version": "0.0.1",
    "subject": "rcamden@us.ibm.com",
    "activationId": "46dc063bdd9b4227816d1269d71abd30",
    "cause": "6446d29202854cdaa92c024b88ebdfed",
    "start": 1496249400358,
    "end": 0,
    "duration": 0,
    "response": {
        "status": "success",
        "statusCode": 0,
        "success": true
    },
    "logs": [],
    "annotations": [],
    "publish": false
}
</code></pre>

So - next was to look for activations of the action tied to the trigger/rule. Again, I used the CLI:

	wsk activation list dotweet

As another quick aside, dotweet is actually in a package, but it is kind of a pain right now to filter by package/action. I got the most recent activation, and voila - my issue!

<pre><code class="language-javascript">{
    "status": "application error",
    "statusCode": 0,
    "success": false,
    "result": {
        "error": [
            {
                "code": 261,
                "message": "Application cannot perform write actions. Contact Twitter Platform Operations through https://support.twitter.
com/forms/platform"
            }
        ]
    }
}
</code></pre>

Boom! My issue. (Well, the first clue.) In case you're curious, that's just a subset of the activation record. The CLI supports filtering, and I just discovered that while writing this blog post. I got that result above by doing:

	wsk activation get 9e72e78649c4458d8aa1e10a85a38077 response

As you can see above, Twitter was blocking my account from Tweeting. I logged onto the site, checked the developer portal, and saw that - yep - I was being blocked. Unfortunately Twitter wasn't very verbose about *why* I was blocked. I guessed that maybe I was simply tweeting too much. I filled out the "I'm sorry" form (not really called that) and was surprised to see I got a response within ten minutes. My app was re-enabled and all I had to do was update my trigger with a new schedule (now once every 30 minutes). 

Ok, so, as I said, that's just an example of how I debugged an issue and got to my fix. I'll be blogging about this topic more later in the month as I wrap my head around the issue a bit deeper. As always, I'm curious what folks think, what their experience is with debugging serverless apps, and any questions they may have. Just drop me a comment below!