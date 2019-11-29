---
layout: post
title: "How I added https to my blog"
date: "2016-04-15T08:15:00-07:00"
categories: [uncategorized]
tags: []
banner_image: /images/banners/addinghttps.jpg
permalink: /2016/04/15/how-i-added-https-to-my-blog
---

Hopefully you noticed the nice little green icon in the URL bar above:

<!--more-->

![Green lock](https://static.raymondcamden.com/images/2016/04/https1.jpg)

On a whim I decided yesterday afternoon that it was time to switch to https for my blog. It turned out to be a multi-hour task, but all in all, not too terribly difficult. Here is how I did it. To be clear, I may not have done it the *best* way, but this is what worked for me and it seems to be rather stable, so I'm satisfied.

Getting the Certs
---

First I needed to get my certificate. I started with [Let's Encrypt](https://letsencrypt.org/), a free command-line driven tool to generate https certificates. I was a bit worried about this solution for two reasons. First, this warning made me a bit nervous:

<blockquote>
<p>
Let’s Encrypt will issue a limited number of certificates each week.
</p>
</blockquote>

I wasn't necessarily worried about getting the initial certificate, but I was worried about *renewing* that certificate. What if I couldn't get a new certificate in time? Maybe that was a silly thing for me to be worried about, but I just couldn't get over it. 

That tied nicely into my +second+ concern which was the fact that their certs expired every 90 days. Not only would I have to ensure I scheduled time to update the certs, I'd have to worry about actually being able to *get* the cert when it was time.

I did take a stab at using Let's Encrypt, and when I ran into trouble making it work with [Surge](http://surge.sh), I decided to just move on. Let me be absolutely clear - I greatly appreciate what Let's Encrypt is doing here. They should be applauded. I'm sure if I worked on it longer I would have gotten things working, and as I said, my concern over renewing was probably overblown, but ultimately I found [SSLMate](https://sslmate.com/) much easier to use.

SSLMate is also command-line driven, but not free. Each cert costs 16 dollars per year which seemed pretty cheap, especially since my host charges in general are pretty low now. 

Updating the Site
---

Once I had my cert, I simply followed the [Surge docs on SSL](https://surge.sh/help/securing-your-custom-domain-with-ssl) and it worked so quickly I thought it was broken. I had https running fine on my blog (www.raymondcamden.com), but that left one big issue - all of my images are on an Amazon S3 server, static.raymondcamden.com. If you mix https and http assets on the same page, you'll get a warning in your console and you won't get the friendly seal of approval with the pretty little green lock.

Why do I use both S3 and Surge? Well, that's a bit of a long story. Basically Surge has to push my *entire* site whenever I add new content. I've got 5.5K blog entries and a crap ton of media associated with those posts. While Surge is working on a rsync-based approach, right now it is has to push everything. For my blog, that meant an approximately 15 minute deployment when I blogged. Not the end of the world, but a big long. I decided a few weeks back to move my images to S3. This meant another certificate purchase of course.

While S3 supports https natively, it does *not* support it for a custom domain. In order for that to work, you have to use Amazon CloudFront to proxy your bucket and handle the certificate from there. 

It is... complex. Surprisingly so. I used this blog as a guide: [Implementing SSL on Amazon S3 Static Websites](http://knightlab.northwestern.edu/2015/05/21/implementing-ssl-on-amazon-s3-static-websites/). My biggest struggle was the damn command line to upload the certificate. I suppose a simple web-based solution would be crazy (and maybe one exists), but I spent a majority of my time just trying to get one particular command line working.

Once it did, I then found out how slow CloudFront is. It took about 30 minutes for it to properly set up and work correctly, and then I discovered how aggressively it caches content. To be clear, this is expected, and isn't a bug, but it was a surprise. To replace existing content and have it show up immediately, I need to go to my CloudFront console and create an invalidation request. In my test, it took about 15 minutes to replace cached content. Amazon actually recommends just adding a new asset with -1, -2, etc in the name, which feels lame, but has the benefit of working immediately. 

Again - this is all how it is supposed to work, but was part of my learning process in getting things set up.

As a final nit, Surge asks you to do one small mod to your deployment in order to force all http requests to https. Oddly, I didn't seem to need this. I would request the http version and Chrome, Firefox, and Safari all loaded the https version. After speaking with [Brock Whitten](http://sintaxi.com/) on the Surge slack, he mentioned this may just be the default behavior of newer browsers. He checked with curl and http was still served that way. So the final, *final* step was one small change to my build script to tell Surge to push only to https.

Conclusion
---

And that's that. In my informal testing on Twitter, everyone said it was working correctly except for one user who said they saw an issue on an Android device. If anyone else can confirm that, I'd appreciate it. Otherwise, let me know if I can answer anything else about my process by leaving a comment below.