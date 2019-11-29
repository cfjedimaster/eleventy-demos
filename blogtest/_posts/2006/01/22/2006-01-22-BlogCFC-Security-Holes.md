---
layout: post
title: "BlogCFC Security Holes"
date: "2006-01-22T14:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/22/BlogCFC-Security-Holes
guid: 1045
---

Well, I was doing my best to ignore the personal attacks from Mr. Horn. However, today he pointed out "security holes" in BlogCFC. I want to make sure my users are aware that not one single thing he pointed out was true. I'm sure he wrote his post in attempt to help others, and not as a personal attack. I'm sure he isn't the one behind all the foul mouthed blog comments recently. Anyway, let's take a look at what he says:

<blockquote>
Anyone who wants to gain access to YOUR Blog (assuming you are STUPID enough to actually use BlogCFC) simply by using the built-in HACKER's interface as-designed by the original author "Ray Camden".
</blockquote>

Err.... why is my name in quotes? Am I a concept now? Am I a movement? Anyway...

<blockquote>
I have been working on locking-down my Blog and I am STUPID enough to use BlogCFC and wouldn't you know it... Somebody has been hacking into my Blog as Admin placing unwanted TackBacks into my Blog.
</blockquote>

The fact that Trackbacks() shows up on your blog implies that you did not read the manual. The docs cleary say the proper way to turn off trackbacks is to use the allowtrackbacks option in the blog.ini file. I'd be willing to bet Mr. Horn simply added a cfabort to the trackbacks.cfm file - and probably after the form submission. Therefore nothing is stopping the form submission. 

<blockquote>
(1). The file named blog.cfc was coded with a lot of <cffunction> definitions that allow "remote" access. Why ? Because coding CFC functions this way allows for remote access such as a HACKER might wish to use to gain access to someone else's Blog as Admin. There is no reason to code CFC functions this way otherwise.
</blockquote>

"Remote" does not equal "Hacker." Remote access can be a security risk if you are not careful. If you actually looked at the code you would have noticed two things:

a) The items that add, delete, or modify blog entries have the roles attribute. Even if you run these methods remotely you will be blocked since you are not in the admin role. 

b) BlogCFC doesn't work remotely. This is a bug - but is something I've ignored since folks haven't asked for it. It won't work since all the settings (DSN, etc) are set in the INIT method. Therefore, BlogCFC only works locally when used as the result of a createObject. 

<blockquote>
(2). The file named blog.cfc was code to allow anyone who has access using (1) to SPOOF as Admin because the Administrative functions do NOT disallow access when the user is not in the Administrative Role. This means anyone who has the source code can SPOOF as Admin to do anything they desire in your Blog.
</blockquote>

Um. So the fact that I used a file named blog.cfc is a security hole? Not quite sure about that. Every single admin function (adding, editing, deleting content) requires the admin role. If you do not believe this, please try to hack my blog. Go ahead. Hey, maybe you <b>will</b> find something. Great. I'll fix it, and will be sure the fix goes into source and is released. I will <b>not</b> charge people for it.

<blockquote>
(3). Even when the GUI has been locked-down a HACKER who has the source code for BlogCFC can still gain access to YOUR Blog to do whatever they desire.
</blockquote>

Go ahead. You have access. Be my guest. I do not pretend to be perfect. I am far from perfect. Look at my "big" releases and how quickly I follow them up with fixes. That being said, I am fairly certain this blog cannot be hacked. 

<blockquote>
(4). Ray Camden designed BlogCFC in this manner to allow him or his supporters to control every single site that uses BlogCFC remotely. If you wish to deny this then look at the source code very carefully and then YOU decide on your own.
</blockquote>

Also - aliens landed in Roswell, Bigfoot roams the forests, and Bush actually won the election. (Sorry, couldn't resist.) You are absolutely right - BlogCFC is all part of my plan to take over the world. 

<blockquote>
(5). This IS the problem with Open Source Code - it is far too wasy for the Author to quietly code-in backdoors and spoofing channels others can use to gain access to whatever they wish.
</blockquote>

Um - right - since the code is open and can be read like anyone. Didn't you encrypt the mods you made to BlogCFC?

I will refuse to make this argument personal. You may attack me as much as you want. If anyone has any questions about Mr. Horn's allegations, please comment here. If anyone finds a security hole, please let me know and I will get it fixed and patched asap. Maybe then we can move on?