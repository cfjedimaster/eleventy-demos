---
layout: post
title: "Form analytics with Formatic"
date: "2015-04-07T13:06:54+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2015/04/07/form-analytics-with-formatic
guid: 5968
---

About a month or so ago I wrote a blog post discussing how you could detect when someone left a form (<a href="http://www.raymondcamden.com/2015/03/06/warning-a-user-before-they-leave-a-form">Warning a user before they leave a form</a>). The idea being that you may want to notice/warn/gently nudge a user to complete a form before they try to leave it. One of my readers, Andrew Schwabe, reached out to me and asked if I wanted to demo a new service he is working on, Formatic. 

<!--more-->

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/formatic.ly_logo_med.jpg"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/formatic.ly_logo_med.jpg" alt="formatic.ly_logo_med" width="325" height="94" class="alignnone size-full wp-image-5969" /></a>

Formatic works by adding a simple JavaScript embed to your forms. Once added, you then get deep analytics about how users handle your forms. Let's take a look. (And note - the service was previously launched with another name, xForms. If you see that in the screen shots, that is simply the previous name and will be going away when Formatic publicly launches.) 

You begin by adding your form in the console:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/f11.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/f11.png" alt="f1" width="600" height="227" class="alignnone size-full wp-image-5971" /></a>

This step is actually optional and can be skipped. Next you then have to update your form. It's mainly one JavaScript embed, but you also have to do one minor change to your form tag.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/f2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/f2.png" alt="f2" width="600" height="604" class="alignnone size-full wp-image-5972" /></a>

Once you've done that, you're done and can simply wait for the data to begin rolling in. Here's where Formatic really begins to shine. About three weeks ago I asked folks on Twitter to start hitting my <a href="http://www.raymondcamden.com/demos/2015/mar/20/form.html">test form</a> so I could start collecting data. It wasn't a terribly complex form and I made it clear that I didn't care if they finished the form or not. I just wanted people to hit it and play with it. Because I specifically said I didn't care if people finished it, I'm sure some folks intentionally did not complete the form, so the stats you see below may not be 100% realistic, but what I really want to point out is the complexity/depth of the data. First, let's look at the summary.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/f3.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/f3.png" alt="f3" width="600" height="780" class="alignnone size-full wp-image-5973" /></a>

The Summary view shows form entries for the past three months. Since my form was just for testing there isn't a lot of data here, but you can see that there would - normally - be quite a bit of information here for the time frame. Now let's look at Failed Conversions. This is data about people who didn't successfully complete my form.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/f4a.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/f4a.png" alt="f4a" width="300" height="218" class="alignnone size-medium wp-image-5975" /></a>

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/f4b.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/f4b.png" alt="f4b" width="600" height="727" class="alignnone size-full wp-image-5974" /></a>

Pardon me for being too lazy to stitch the two images above into one shot. The service tells you what field was the last one worked with in failed conversions as well as which one had the most re-entries. Finally you can see just how many people are actually completing the form. To me, this detail is <strong>gold</strong>. You can immediately see which fields may be causing people to give up your form as well as which fields may be the most problematic. 

The next tab, Time Spent, drills down into how much tme is being spent on the form as well as individual form fields.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/f5.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/f5.png" alt="f5" width="800" height="1013" class="alignnone size-full wp-image-5976" /></a>

Next is Form Flows, which describes how people work through your forms:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/f6.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/f6.png" alt="f6" width="600" height="194" class="alignnone size-full wp-image-5977" /></a>

And then finally - Geography:
<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/f7.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/f7.png" alt="f7" width="800" height="1333" class="alignnone size-full wp-image-5978" /></a>

Ok - so by itself - this is an incredible amount of data - and all rather easy to use. However, Formatic actually has something that goes way beyond just stat collecting. As the amount of data it gathers becomes statistically significant, you can actually write code to listen for events within your form. What kind of events? You can notice, for example, when a user is spending more time on a field than the average user. That's freaking cool. Imagine you've got a field that you really want users to fill out but you notice a lot of people have trouble with it. You could add contextual help to that field that only shows up if the user seems to need it. 

All in all, this seems like a service that will definitely be worth your attention. It isn't public yet, but check the <a href="http://formatic.ly/v2/">site</a> to register for a demo. If you end up using it, I'd love to hear what you thought about it and let me know if it helps you solve real problems.