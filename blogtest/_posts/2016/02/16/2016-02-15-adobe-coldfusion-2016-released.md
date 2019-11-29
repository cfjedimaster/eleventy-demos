---
layout: post
title: "Adobe ColdFusion 2016 Released"
date: "2016-02-16"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2016/02/16/adobe-coldfusion-2016-released
---

<img src="https://static.raymondcamden.com/images/2016/02/cflogo.jpg" style="float:left;margin-right:10px;margin-bottom:10px">

This morning Adobe released the latest version of ColdFusion, <a href="https://www.adobe.com/products/coldfusion-family.html">Adobe ColdFusion 2016</a>. Yep, they switched from a simple version number to a year, which frankly I prefer so I think this is a good change. This also applies to ColdFusion Builder as well. So what's new and should you upgrade? 

<!--more-->

## The Good(ish)

You can start off by looking at a broad overview of [what's new](https://helpx.adobe.com/coldfusion/whats-new.html#main-pars_imageandtext) in ColdFusion 2016. I won't repeat what's there as you can read it yourself just fine, but will point out that the specific section
on [language enhancements](https://helpx.adobe.com/coldfusion/2016/language-enhancements.html#main-pars_minitoc) may be of interest to developers. The "Safe Navigation" feature can let you simplify your code a bit, but note that the docs for this in the previous link are poorly done. You can now do both ordered and sorted structs, which I know some folks really want. I always thought of structs as inherently unordered, but I understand that adding order/sorts to them are useful in some situations. Unfortunately, the docs don't demonstrate how to use these features in short notation. I haven't typed `structNew` since `{}` was added. I'm also happy to see that you can now disable scope search by adding `searchImplicitScopes=false` to your Application.cfc file. Unfortunately this feature isn't mentioned in the docs and as we can't edit/comment on the docs anymore, hopefully it gets corrected soon. 

In fact, from what I can tell, none of the docs are updated yet. A new function, `valueArray`, is [documented](https://helpx.adobe.com/coldfusion/cfml-reference/coldfusion-functions/functions-t-z/valuearray.html#main-pars_header) but not discoverable in the search. I'm assuming this is just a temporary issue. You can't even find the PDFs for the CF2016 docs. *Update* - I see the new docs now - somewhat. The missing item in App.cfc is still missing. I also heard from an Adobian that this should be cleared up by the end of the day. Let's be blunt though. It is 2016. If you can't schedule a product release with documentation then you are failing at doing your job. This may be totally out of the ColdFusion's team hands - but customers don't care whose fault it is. It is ridiculous, unprofessional, and something that should have been addressed years ago.

For a better list of language enhancements, check out the [New and Changed Functions/Tags](https://helpx.adobe.com/coldfusion/2016/other-enhancements.html#main-pars_text) page. `querySort` and `queryEach` are especially nice additions.

The other big update is the addition of a [CLI](https://helpx.adobe.com/coldfusion/2016/command-line-interface.html#main-pars_minitoc), which is nice too. I can't say how it compares to [CommandBox](https://www.ortussolutions.com/products/commandbox) though which has been available for a while now. At minimum, CommandBox is free and available to people using ColdFusion 11 so there's that.

Another big update is the [API manager](https://helpx.adobe.com/coldfusion/api-manager/features-summary.html#main-pars_text). This is something I didn't get a chance to test (more on that later), but it is a pretty impressive feature, much more than `CFCLIENT` was in my opinion. It provides a large set of features around documenting, handling, analyzing, your APIs. As this is something I'm digging deep into on the Node side, I'm impressed to see ColdFusion support it. There's some good videos on this feature (and others) available [here](https://www.adobe.com/products/coldfusion-enterprise/features.html). Just try to ignore the robo-voice and you'll see what I mean. 

Finally (and to be clear, I'm just calling out some items I think are interesting), ColdFusion Builder 2016 includes a cool little feature called the Security Analyzer. Right from your editor you can get a scan of your code for common security issues. To be clear, this does *not* replace a real, very deep, security analysis of your code. However, I think it could be really useful for getting some of the simpler stuff out of the way before the real/deeper scan is done later. 

![CFB2016](https://static.raymondcamden.com/images/2016/02/cfb2016.gif)

Unfortunately, this feature is tied to your ColdFusion server and only works with ColdFusion Enterprise. I cannot stress enough how much of a mistake I think this is. Yes, you do get 3 copies of CFB 2016 with your purchase, but I can't imagine a ColdFusion team using Enterprise with only three people. I think CFB is worth the price, don't get me wrong, and I say that even though I pretty much despise Eclipse, but I think this upgrade is *not* worth charging for. It should be a free upgrade to CFB. To be clear, *nothing* else changed outside of the syntax library. 

And by the way, if you are not planning on upgrading to CFB2016, you can download the trial and then copy the library definitions to your CFB3 install following the instructions [here](https://www.monkehworks.com/coldfusion-builder-custom-dictionaries/). I did a quick test and can confirm it worked for my copy of CFB3. 

But it just seems insane to me to make a security feature, one that can help ColdFusion as a product in general, is Enterprise only. It was just two months ago that ColdFusion turned up on a [list](http://motherboard.vice.com/read/new-analysis-the-most-hackable-programming-language-is-php-by-a-mile) of insecure languages. *This is not how you fight that perception.* 

## The Bad

I was a member of the Pre Release for ColdFusion 2016. Obviously the details of the PR are under NDA. I do not believe what I'm about to say will break the rules of that NDA. 

I love the ColdFusion community. I even did a [sappy video](http://www.raymondcamden.com/2014/12/15/a-quick-message-for-the-coldfusion-community/) about my love for this community back in 2014. 

In regards to the Adobe ColdFusion team, I know almost everyone on that team and have met them multiple times. I like them. But I cannot describe how deeply disappointed I am in how they behaved on the PR. It got to a point that I had to actively ignore the PR for a month or so because I was so upset, so frustrated, that I felt like I couldn't offer anything positive anymore. 

Why?

* Multiple times builds would be posted with little to no notice to the group, or even release notes. Multiple times members of the PR had to ask for this. That's insane. Release notes aren't "special". That's a basic given for testing a product.

* The bug tracker (specifically, the one used for the PR) would not send notices to the people who filed the bugs. So unless you monitored your own bug, or unless Adobe pinged you back for a comment, you were never notified of an update. This is unacceptable. The bug tracker is a ColdFusion app. It could have been fixed by Adobe in an hour. (Ok, I've not seen the code myself so I'm taking a guess here. But based on my own work on my own bug tracker and having built a similar feature, I've got an idea of how complex it is.) If there wasn't enough time to fix this, then my God, how small is the team and how little concern is there for such basic functionality to *help* the people testing your product - for free. Speaking of bugs, multiple times now, and both on the PR and publicly, I've asked Adobe to share their test suite. When they fix a bug, we assume they write a test for it, and seeing the test we (again, the folks doing this for free) could find issues with how they confirmed the fix. This is something I've never gotten a response on. 

* It was the *norm*, not the exception, for forum posts to be ignored. This is what truly sent me over the edge. Just yesterday I saw a thread created *four* months ago that specifically requested Adobe input and had been ignored. To be fair, not every thread needed Adobe input. And yes - sometimes if Adobe were asked multiple times to chime in they would. But damnit, you shouldn't have to freaking beg to get a response. And again, this isn't "special" - the ColdFusion PR testers aren't "needy", that's basic freaking community management. 

I'll tell you a secret. I'm probably borderline autistic, like a lot of programmers. While I love being on stage, one on one conversations with people, even my friends, is stressful. It's not that I dislike people. I love people. But I stress over holding up my part of the conversation, saying the wrong thing, and, well, every single aspect of the relationship/communication. It's difficult for me and I recognize that. So I've trained myself to try to combat that. If you ask me about my job, I want to answer you and then I want to be quiet. I don't do that. I ask about your job back. I have to force myself to do it, but I know it is the right thing to do. 

If the members of the ColdFusion team suck at community management, and frankly, they all do but Anit, then recognize it and work on it. Force yourself to look at the threads and respond to every single one whether you want to or not. 

What's sad is that I know others will bring this up. I know members of the CF team will promise to improve communication. But we've had this same discussion time and time again. They either need to promote Anit and clone him or hire someone to help because I do not see it improving. Nor will I participate in the next pre release unless things are 100% better.

## Wrap Up

So... should you upgrade? Unless the API manager really sells you on it, I don't think it makes sense to do so. I'm at a point now where I recommend Node for future development, but if you're a ColdFusion shop, then by all means, continue with ColdFusion, but I don't see the 2016 release as being worth the price. You certainly want to wait till a few hot fixes have been released. As for CFB, again, I like CFB, but I wouldn't bother upgrading. If you don't own it, go ahead and buy it, but if you have CFB3, I'd stick with it.

Finally, I'll leave you with a link to Adam's post, which has an epic title: [ColdFusion 2016: Adobe finally abandons CFML](http://blog.adamcameron.me/2016/02/coldfusion-2016-adobe-finally-abandons.html).