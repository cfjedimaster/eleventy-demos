---
layout: post
title: "Framework One Sample Application - QBall"
date: "2010-02-27T17:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/27/Framework-One-Sample-Application-QBall
guid: 3736
---

I've blogged about <a href="http://fw1.riaforge.org">Framework One</a> (FW/1) a few times before. The more I look at it, the more I grow to like it and appreciate it's way of doing things. I don't prefer it <i>over</i> Model-Glue, but I think it's got a lot going for it, and I think it will appeal to people who may not like Model-Glue. One of the biggest differences between FW/1 and Model-Glue is that almost everything you do in FW/1 is implicit in nature. There is no XML. There is no set of declarations for each event. Instead, the framework will do almost everything for you and save you from writing a lot of code that - for the most part - isn't strictly necessary. This post isn't meant to teach you FW/1 - see the <a href="http://fw1.riaforge.org/wiki/">docs</a> for that. Rather I thought I'd share my experiences (and code!) for my first "real" application. Before I go any further though - please keep in mind: This is my <b>FIRST</b> FW/1 application. Do you remember your first ColdFusion application? Yeah - this is worse. I'm sure Sean and others who have used FW/1 will be able to tear this apart. That being said - I <b>enjoyed</b> writing this, and I <b>enjoyed</b> using the framework. I hope this sample is useful to others in some way.
<!--more-->
<p/>

So what did I build? My application is called QBall. It's based on the recent rise of "Question/Answer" sites like <a href="http://www.stackoverflow.com">Stack Overflow</a>. Basic functionality includes:

<p/>

<ul>
<li>User registration and login. Later on I plan on adding the ability to let you edit your information and see the content you have contributed.
<li>Users can write questions. Questions are open ended blocks of text on any topic. Later on I'd like to add some basic tagging.
<li>Users can write answers to questions.
<li>Users can vote up and vote down answers to show their support.
<li>The user who <i>wrote</i> the question can select an answer as the one they accept as best.
</ul>

<p/>

So as you can see, there really isn't a lot going on here. The home page shows the most recent questions along with their current status:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-02-27 at 2.33.01 PM.png" title="QBall Shot 1" />

<p/>

Here is a screen shot of a new question:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-02-27 at 2.34.14 PM.png" title="QBall Shot 2" />

<p/>

And finally a shot of a question with a few answers:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-02-27 at 2.35.06 PM.png" title="QBall Shot 3" />

<p/>

To use this application you will need the FW/1 framework (of course) which is all of one file. You will also need ColdFusion 9. I made use of script-based CFCs and ORM for all my data entry. Create a virgin database and setup a DSN called "qball" before running the application. After you've done that, it should "just work". If it doesn't, let me know. Actually - one thing that may not work for you is the mapping. I believe the docs typically show an "org" mapping for the FW/1 code. I created a mapping called fw1 instead. Whichever you chose, make note of it in line one in the Application.cfc file:

<p/>

<code>
component extends="fw1.framework" {
</code>

<p/>

Most likely you will need to tweak that. 

<p/>

Ok, so what did I like - and what caused me a bit of trouble? Well for the most part, the thing that took me the longest to wrap my head around was the start/end cycle of controller calls. When you run x.y, FW/1 will look for an execute a startY method in your x controller, then the Y method, then the Y method of the X service, and finally endY back in the X controller. Having just looked over what I wrote I don't think that makes much sense (again, check the docs). That's somewhat different than what I'm used too and it took a little bit to get used to the "flow". Once I did though I didn't have much trouble putting it to use. Another thing that was a bit difficult was handling cases where the implicit actions done by FW/1 weren't exactly what I want.

<p/>

Anyway - download it and check it out.

<p/>

<b>Edited February 28, 7:37 AM:</b> Please note that QBall requires ColdSpring to be installed. I've updated the code to not use x.y.z in the entity relationships. Thanks to Andreas for that. I also fixed the dbdefault for answer.cfc (and again, thank you Andreas).<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fqball1%{% endraw %}2Ezip'>Download attached file.</a></p>