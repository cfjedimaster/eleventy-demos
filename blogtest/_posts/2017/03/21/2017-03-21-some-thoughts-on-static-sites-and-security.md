---
layout: post
title: "Some Thoughts on Static Sites and Security"
date: "2017-03-21T10:34:00-07:00"
categories: [static sites]
tags: []
banner_image: /images/banners/sss.jpg
permalink: /2017/03/21/some-thoughts-on-static-sites-and-security
---

I've been chewing on this blog post for a little while now and while I'm waiting for a keynote to start I thought I'd spend some time to write it up. Let me preface this blog entry by making it very clear: I am not a security expert. I think I have a good handle on security issues at the level every developer should, but it is not my primary role, so take the following with a grain of salt. And while I *always* say this, please be sure to comment with suggestions and corrections on this topic.

Let's begin by defining the "security space" I'm discussing here. I have a site, let's say this site, and I want to ensure that:

* no one can modify the content here
* no one can access anything I do not want them too

Never, ever, put security in the corner
---

Static sites sound like they would be much safer, or at least somewhat more safe, than other deployment options. And I think that's right (for the reasons I'll lay out below). But you never, *never*, simply skip considering security. Every single project should have security review/checking/etc as part of the process from day one. Period. It always needs to be part of the conversation between developers and clients and an integral part of the development process. Period.

Are static sites safer?
---
By removing the app server from the equation, the potential vulnerabilities are greatly reduced. Every app server has had security issues of some sort over time, requiring the developer to ensure they've properly updated, patched, and locked down the proper settings. Flat files simply don't need this.

Also - many app servers rely on some form of persistence, whether that be a NoSQL solution like Cloudant or a traditional database like MySQL. Removing them from the equation means no SQL injection attacks or other database leaks.

But...

You have to host your site, right? If the client puts those simple, flat files on an Apache server configured to run PHP then you're still running in an environment where an attack can happen. 

For this site, I used [Netlify](https://www.netlify.com/) and [Amazon S3](https://aws.amazon.com/s3/). I trust the engineers behind these services much more than I trust myself, but I have to be aware of their services and pay attention to any security issues that may be found on them. The same would apply for GitHub too.  

Speaking of GitHub, my site's public content is driven by checkins to my GitHub repo. If my credentials were hacked then that would be a vector to change the contents here. 

So yeah - I've removed ColdFusion, PHP, Mongo, etc from the equation, but I'm certainly *not* at 0% risk. 

Dynamic Aspects
---

Many static sites actually contain quite a few dynamic aspects. I've blogged about, and presented on, adding dynamic aspects back to static sites via services like Disqus and Formspee, both options are in use here. If someone were to find a way to attack Disqus than that would impact me as well. Ditto for my form processing service. Every one of these services I add back to a static site is yet another thing I've got to keep tabs on.

More reading
---

So those are my thoughts. I think - obviously - you can also do things like adding https, and I found a great article that covers those details here: [Which security measures make sense for a static web site?](https://security.stackexchange.com/questions/142496/which-security-measures-make-sense-for-a-static-web-site)

I'd love to hear from people working with static sites in terms of what steps they are taking when it comes to security. Do you have a checklist? What do you look for? Let me know in the comments below!

As a final note, don't forget that if you want to learn about static sites in general, the book I wrote with Brian Rinaldi was just released. I may be biased, but I think it's pretty great: [Working with Static Sites](http://shop.oreilly.com/product/0636920051879.do)