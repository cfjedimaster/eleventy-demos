---
layout: post
title: "Some Advice for a Web Developer Learning New Skills"
date: "2016-11-09T08:07:00-07:00"
categories: [development]
tags: []
banner_image: 
permalink: /2016/11/09/some-advice-for-a-web-developer-learning-new-skills
---

One of the things I'm constantly telling people is that I love it when I get questions. Sometimes they aren't things I can help with and sometimes they are a bit too complex to handle over email, but every now and then I get a great one that leads to a good discussion. Yesterday I got one of those emails and I want to share it with my readers.

<blockquote>
<p>
I'm about to start a season of building some new web sites, web applications and mobile applications, and I want to build with modern practices and not what I learned 10 years ago. 
</p>

<p>
What do you think I should invest in learning and using?
</p>

<p>
As I have researched, here are a few things I’ve been seeing and considering...
</p>

<p>
Firebase<br/>
Node.js<br/>
Angular.js<br/>
Foundation CSS Framework<br/>
and/or<br/>
Bourbon/Neat<br/>
Ionic<br/>
</p>

<p>
It seems like you're a fan of Node and Ionic.
</p>

<p>
The applications I built with CF all used CFCs for the data interactions and for APIs for our mobile apps. I really liked how clean all that worked. I really liked how easy it was for CFOUTPUT to loop over a query. Most apps I created used CF Mail to send mail and occasionally used cfpop to get mails. 
I also use the Scheduled Tasks and Application.cfc.
</p>

<p>
So another question is, can Node do all these types of things as well? Or are there technologies you recommend for doing them?
</p>
</blockquote>

I want to split his question into two main discussions. First, let's focus on "What do you think I should invest in learning and using?" 

What do you learn and when?
---

The list of technologies he shared was interesting. Heck, it even included a few items I had never heard of (Bourbon and Neat). The number one advice I can give to people hoping to become better web developers is to *not* get too focused on all the different libraries and utilities out there. Yes - there is a JavaScript library for every single need out there. Cool. But forget about it. Looking at that list above, you need to realize what each of them solves and decide if you need help with that. 

If you don't have a particular problem, you don't need to worry about it. 

For me, problems tend to come in two areas. The first is organization. Most of my JavaScript starts off as small enhancements to a simple HTML page. Validate a form. Load some crap via Ajax. Etc. As things grow larger, managing your one large monolithic JavaScript file becomes more and more of a chore. At that point, recognizing the tools that can help you manage that code can be extremely helpful. 

Does that mean using a framework like Angular? Maybe. It could also be as simple as splitting up that large JavaScript file into smaller bits using something like the [module pattern](https://www.raymondcamden.com/2013/03/22/JavaScript-Design-Patterns-The-Module-Pattern/). 

The second area than is simply handling one particular problem, like CSV parsing, and honestly, all I do at that point is Google for "javascript csv" and pick a solution that looks to be well documented and supported. 

I talk about this a lot more in my article for Telerik, [Leveling Up Your JavaScript](http://developer.telerik.com/featured/leveling-up-your-javascript/). 

Just remember - you can keep it simple. You don't have to learn it all today. Baby steps are completely ok and take it one task at a time.

About that Node thing...
---

So now let's address his later point about Node and how it compares to ColdFusion. When I first started using Node, it was *definitely* a bit harder to get into than ColdFusion. With ColdFusion, if I wanted to try out some random feature, like HTTP calls for example, I'd add a test.cfm file and write up a quick test. For Node, that was a bit harder to do. 

Part of the issue is that I was 'stuck' in ColdFusion mindset where I felt like I needed my test script under a web server. That's because for a vast majority of ColdFusion's lifetime, there was no way to run scripts from the command line. With Node, that isn't an issue. You may forget that when learning. If you want to test HTTP with Node, don't worry about setting up a proper "web app" with Express, just write a simple script and test it from the command line. 

Everything you mentioned (looping over a query, using mail, scheduled tasks), all have multiple different solutions in Node. Yes you will need to look them up. While CF just gives you them, using Node forces you to actually find a solution and add it. But you will quickly learn to appreciate not being locked down to one solution and having the freedom to pick a library that works best for you.

At the end of the day, the shear size of the Node community is one of the biggest benefits. I'm not going to say ColdFusion is dying, but the fact is that there is a lot more activity within the Node community than CF.

![Google Trends](https://static.raymondcamden.com/images/2016/11/nodecf.png)

I'd recommend *all* ColdFusion developers learn Node. You don't have to abandon ColdFusion, but it is a great skill to add to your toolset and improve your hirability going forward.

Final Thoughts
---

It can be scary for someone who has been focused on one small world (like ColdFusion) who is now looking to become a better web developer. I definitely understand that. But it is an absolutely *awesome* time to be a web developer as well. Our tools and options have never been better. The Web, as a platform, has never been better.