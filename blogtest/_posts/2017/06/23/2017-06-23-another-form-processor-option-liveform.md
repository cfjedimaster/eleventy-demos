---
layout: post
title: "Another Form Processor Option - LiveForm"
date: "2017-06-23T08:41:00-07:00"
categories: [static sites]
tags: []
banner_image: 
permalink: /2017/06/23/another-form-processor-option-liveform
---

As a proponent of static site generators, one of the things I keep an eye out for are services that work well with them and provide functionality you lose after going static. Probably the most important of these are form handlers. Just being able to build a simple contact form can be incredibly helpful. On my site I use [Formspree](https://formspree.io/) and in the past I've used [FormKeep](https://formkeep.com/). Today I'm going to quickly review another new service, [LiveForm](https://liveformhq.com/).

![LiveForm](https://static.raymondcamden.com/images/2017/6/lf1.jpg)

LiveForm has a pretty impressive set of features:

* reCAPTCHA support
* Webhooks
* The ability to notify multiple people at once (ie, don't just email X)
* Askismet
* A read-only API
* CSV export

And best of all - file uploads. 

About the only thing really missing (compared to Formspree/FormKeep) is the ability to specify a custom subject for the message.

To begin using it, you have to register first, but then you simply create a new form. This is done by just giving it a name.

<img src="https://static.raymondcamden.com/images/2017/6/lf2.jpg" class="imgborder" title="LiveForm">

You're then dropped into a simple admin for the form that begins with boilerplate text you can copy for a new form or just the form tag itself if you have an existing form.

<img src="https://static.raymondcamden.com/images/2017/6/lf3.jpg" class="imgborder" title="LiveForm">

At that point, things pretty much work as expected. You can specify a redirect URL by using a hidden form field, otherwise you end up on a generic LiveForm page. The UI to view messages is nice and provides a bit of metadata about the submission (browser, IP, and time).

<img src="https://static.raymondcamden.com/images/2017/6/lf4.jpg" class="imgborder" title="LiveForm">

The email reports are nicely formatted too:

<img src="https://static.raymondcamden.com/images/2017/6/lf5.jpg" class="imgborder" title="LiveForm">

Notice that this submission had a file attached to it, and LiveForm treats images differently (it displays them). If you upload something else, like a .exe (yes, I tried), you get a link to the file on S3. 

And that's basically it. Like I said, I think the killer feature here is file uploads. The API is real cool as well. Their blog has a [great example](http://blog.liveformhq.com/2016/11/27/creating-an-imgur-clone-using-github-pages-and-liveform/) of using it along with image uploads. 

[Pricing](https://liveformhq.com/pricing) seems pretty reasonable, and best of all, *nothing* is removed on the lower plans. All you get is fewer forms. The highest tier, at 19 bucks a month, gives you 50 of them. The lowest tier ($3), gives you 5. But in all cases, there are no limits on the number of submissions or your use of the features. That's really darn compelling.

Anyway - check it out - and as always - if you have any experience with the product, let me know in a comment below.