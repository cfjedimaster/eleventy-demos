---
layout: post
title: "ColdFusion Newbie Contest - Entry 8"
date: "2007-06-06T22:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/06/06/ColdFusion-Newbie-Contest-Entry-8
guid: 2098
---

Welcome to the 8th entry in the <a href="http://www.raymondcamden.com/index.cfm/2007/4/16/ColdFusion-Newbie-Contest-Announced--Monster-Maker">ColdFusion Newbie</a> contest. This is one of three remaining entries. At the end I'll be recapping the entries, talking about what I saw (both good and bad) and announcing the winners. (Did I say winners? Yes I did. I may have more than one prize to share.) As I'm getting close to wrapping up, I'd like to encourage folks to speak up and let me know what they think of these entries. Also feel free to <a href="http://www.coldfusionjedi.com/contact.cfm">contact</a> me and tell me what you think of the contest.
<!--more-->
So without further ado - lets talk about entry 8, created by Rob Makowski. This one has no name either so I'll be calling it Creature again. It uses an Access database for storage so I'll be pointing folks to a download again and not hosting an online demo. 

The game did not seem to work well for me. The creature would sometimes die on the second turn after creating a creature. Because of this I didn't play it very much since there just didn't seem like there was much to do. But I did some interesting points in the code I thought I'd point out.

First off - once again I see an odd use of request variables. Consider the Application.cfm file:

<code>
&lt;!--- Application Name ---&gt;
&lt;cfapplication name="MonsterApp" sessionmanagement="Yes" clientmanagement="yes" sessiontimeout="20"&gt;
&lt;cfparam name="Session.UserName" default=""&gt;
&lt;cfparam name="Session.Password" default=""&gt;
&lt;cfset Request.MainDSN = "creature"&gt;
</code>

Ok it isn't odd per se - but if he is starting an Application here, why not use Application.MainDSN again? I have to ask (and this is for all my newbies in the crowd), where are you guys seeing so much use of the Request scope for what (normally I'd say) should be Application scoped variables.

Another issue I see is how he handled forcing a login. The index.cfm file (which I'm happy to see he has) has one line:

<code>
&lt;cflocation url="login.cfm"&gt;
</code>

So I get the idea here. If the user just came in to the site, make him login. But the big problem with this though is that a person may not request the index.cfm file (or no file) first. 

Now he does have code to handle that. He has a file named header.cfm that checks for login status. If you aren't logged in it pushes you to the login page. All secured pages include this header.

Now this works. Don't get me wrong. But I think it's worrisome in a few ways. First off - to a new developer looking at the code (like me!), it should be more obvious what pages are secured and what are not. Secondly - this system of including a file depends on you remembering to include the header. 

Imagine a page that is "Print View" for an article. The print view may not use the standard header, and therefore may not be secured. 

This is why we typically use onRequestStart or Application.cfm checks. By having it one place we <i>know</i> ColdFusion will run, we can be more secure that our files will be truly locked down.

Moving on to a new problem. One thing I saw in a few different forms was code like the following (pseudo-code):

<code>
&lt;cfquery&gt;
select x from foo
&lt;/cfquery&gt;

&lt;cfset x++&gt;

&lt;cfquery&gt;
update foo set x = #x#
&lt;/cfquery&gt;
</code>

While this works, it isn't single threaded or within a transaction and could lead to incorrect data. It is a heck of a lot easier to just do this:

<code>
update foo
set x = x + 1
</code>

So outside of that I saw the common 'missing var scope' mistake. I was <b>very</b> happy to see cfqueryparam being used. It wasn't used everywhere - but he did use it in some places. Good thinking there. Get in the habit of always using it and don't forget it. (And did you know that ColdFusion 8 allows you to use both query caching and queryparam now?)

So - comments anyone?<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcfcontest%{% endraw %}2Ezip'>Download attached file.</a></p>