---
layout: post
title: "ColdFusion Newbie Contest - Entry 2"
date: "2007-05-19T23:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/19/ColdFusion-Newbie-Contest-Entry-2
guid: 2052
---

<img src="http://ray.camdenfamily.com/demos/contest6/sheep1.jpg" align="left" hspace="10"> Ok, I have to admit. I'm completely impressed by the first two entries in my <a href="http://ray.camdenfamily.com/index.cfm/2007/4/16/ColdFusion-Newbie-Contest-Announced--Monster-Maker">newbie ColdFusion contest</a>. 
First we had <a href="http://ray.camdenfamily.com/index.cfm/2007/5/17/ColdFusion-Newbie-Contest--Entry-1">Goth Boy</a>, and now we have magical fluffy sheep by Joel Watson. Talk about variety. The design is also really well done.
As dark and depressing as Goth Boy was, this entry is, well, fluffy. I think I'm going to let my kid take a turn or two at this entry and see what he thinks. Unfortunately I am unable to run a demo of this game on my server. It uses
MySQL and while I'm slowly moving most of my developer to MySQL, this box does not have it installed. I've included a few screen shots so you can get an idea for the game and you can download the code below.

<more />


You begin by creating a new pet. You are allowed to give it both a name and a gender. As far as I could tell the gender choice didn't make much of a difference. You are then presented with a rather well designed instruction
page. At the end of the instructions you select a sheep and start to play. One of the first things I noticed was an security warning. I had not seen one of those since the last time I had run a Java applet so I was definitely 
wondering what was going on. Turns out Joel used the <a href="http://www.cfquickdocs.com/?getDoc=cfslider">cfslider</a> tag! Go ahead - view that link. Have you ever seen that tag before? I mean I knew it existed but I don't
think I've actually seen anyone <b>use</b> it! I didn't even know how to use it at first. I noticed sometimes the applets didn't work quite well, but in general it was ok. Another problem was that the stats you see on the sheep
didn't seem to mesh up with what I had seen in the instructions. So for example, the instructions mentioned giving love and exercise to your sheep, but the game uses Prozac pills and toys. Another surprise is that the games moves in real time. That isn't a bad thing per se - but obviously it made my testing a bit shorter. (Although I plan on checking up on my sheep over the next few days and see what happens.)

Now lets jump into the code. My first problem is a minor one, and isn't ColdFusion related, but I don't like the fact that he didn't create an index file for the application. There should have been one page used for the home page
that would let me work on a new sheep or jump to the instructions. Very minor - but just something to keep in mind. 

<img src="http://ray.camdenfamily.com/demos/contest6/sheep2.jpg" align="left" hspace="10">

My next problem was in his Application.cfm file:

<code>
&lt;cfapplication name="fluffysheep" sessionmanagement="Yes"&gt;
&lt;cfset request.dsn = "mysqlcf_fluffysheep"&gt;
</code>

See the request variable? I'm not sure why he used this instead of an application variable. I've used request variables for two reasons. First was to get around locking - but that was in the "Old Scary Days" of ColdFusion 5 and earlier. The 
second reason was if I needed to make use of UDFs and custom tags. The request scope is a nice place to store UDFs and make them accessible anywhere in the application. As far as I know this is <b>not</b> what Joel did, so I would
not have used this variable. It is a very small and picky point, but just something I'd point out in a code review.

His new sheep code is pretty simple so I won't talk about that. The instructions.cfm file has a few problems I think should be pointed out. First - when a user is done reading the instructions and wants to start playing with his sheep, this
code is run:

<code>
&lt;cfif isDefined("FORM.startProgram")&gt;
	&lt;cflocation url="fluffysheep.cfm?petID=#FORM.petname#"&gt;
&lt;/cfif&gt;
</code>

But there is no validation for a) does form.petname exist or b) is it a valid number. Never trust variables that can be changed by the user! Moving on down...

<code>
&lt;cfquery name="Pets" datasource="#request.dsn#"&gt;
	SELECT *
	FROM pets
&lt;/cfquery&gt;
</code>

Using select * is generally considered bad for performance and bad code. Even if it had zero performance impact, I wouldn't use it as it tends to make you forget what columns your retrieving. (My memory tends to be pretty bad 
these days.) FYI, Joel used Spry for the tabs on this page. I have to admit I was pretty impressed. Take a look below. I didn't think the tabs could look that good.

The core of the program runs in fluffysheep.cfm. There were quite a few small things in this that bugged me. The template begins with this line:

<code>
&lt;cfset mypet = #URL.petID#&gt;
</code>

Again - no validation. I don't want to be too hard on Joel though. I find that most sites don't do a great job with this so he shouldn't feel alone. Joel also makes the "overuse of # sign mistake". Consider the line below:

<code>
&lt;cfif isDefined("FORM.newsubmit") AND #FORM.food# EQ 0 AND #FORM.love# EQ 0 AND #FORM.exercise# EQ 0&gt;
</code>

This could be written as:

<code>
&lt;cfif isDefined("FORM.newsubmit") AND FORM.food EQ 0 AND FORM.love EQ 0 AND FORM.exercise EQ 0&gt;
</code>

It doesn't make a real difference to your application, but it just looks nicer. (IMHO) 

This file also does a lot of logic that should be moved into his CFC, petfunctions.cfc. I find it interesting that both of my first two entries seemed to put less in the CFC than I would have. I'm not sure why. Definitely the code
to handle entropy (updating the sheep stats to reflect changes since the application's last run time) could have been done there. Speaking of entropy - in theory that only needed to be run once. That could have been done in
an onApplicationStart in a Application.cfc file. He also coud have used scheduled tasks. Imagine getting an email saying your sheep was starving. Oh! He also could have used the IM gateway. Now <i>that</i> would be pretty
darn cool. (Well, until it got really annoying.)

Another problem in this page. It looks like he copied the same template over from the instructions. He loads the Spry libraries and isn't actually using them. I know we all get a bit spoiled with our high speed connections, but do
try to remember to only load into the client what you really need to.

<img src="http://ray.camdenfamily.com/demos/contest6/sheep3.jpg" align="left" hspace="10">

Now lets take a look at his cfc, petfunctions.cfc. The first thing I'd recommend is adding output="false" to his cfcomponent tag. As we know, ColdFusion loves whitespace, and adding this will help reduce the amount of whitespace
generated. All of his methods need it as well. The worst issue of all though is his lack of var scoping. Not var scoping variables created within a CFC will most likely lead to some <i>very</i> hard ot debug issues. It is extremely
critical that these statements be added to all of the methods that need them. 

Another issue. I noticed he made a variable named now that represents the current time with a particular format. I also notice he made a query named max. Both of these variables are also ColdFusion function names. While this
didn't throw an error for me, I've seen odd things with that in the past. In general I avoid using ColdFusion function names for variables or methods. 

As much as I'm going to ding him for not var scoping, I'm going to give Joel brownie points for using cfqueryparam. It makes me <b>very</b> happy to see a  newbie coder using them. Good job!

Another problem, and I just saw this myself with a client, is the use of HTML comments instead of ColdFusion comments. HTML comments get returned to the browser, and it is possible that something dangerous could
leak out in the comments. Comments are very important for development, but our end users have no need for them. Therefore I almost never use HTML comments. (Although I do use JavaScript comments quite often. I need to stop that.)

Oddly I noticed two methods that have a cflocation and a cfreturn. This is pointless since the cflocation will send you away before the cfreturn runs. Normally the calling code should handle moving the user around. The CFC shouldn't
(normally) be concerned with that.

Ok, so that's all I have. What do others think? (Please remember to be kind!) As I said up top, I'm very impressed by these first two entries!<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ffluffy%{% endraw %}20sheep%2Ezip'>Download attached file.</a></p>