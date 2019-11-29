---
layout: post
title: "Multi-file search and replace in Eclipse"
date: "2009-03-16T17:03:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2009/03/16/Multifile-search-and-replace-in-Eclipse
guid: 3278
---

Ok, a big thanks goes out to <a href="http://www.boyzoid.com">Scott Stroz</a> for this one. I've been using Eclipse for a while now but never needed to do a multi-file search and replace until last week. Turns out it is rather simple, but I had never really noticed the feature before. I figure a quick blog post may help others, and since I know I'll probably forget in six months, it will help me as well.
<!--more-->
First, select the root folder in Navigator:

<img src="https://static.raymondcamden.com/images//Picture 145.png">

Second, go to Search/File in the navigation menu.

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 226.png">

Enter your text in "Containing text" (I entered UDF). Note the Scope. <b>This is critical.</b> It should have "Selected resources" picked. If it is disabled, it means you didn't click in the Navigator first. This bugs/confuses the heck out of me. If you do 2 multi-file search and replaces, it is easy to forget to click back here. It is like Eclipse 'forgets' you had chosen a folder before. 

Now, instead of hitting Search, click the Replace... button. Obvious, I know, but I swear I had never noticed it before.

Eclipse will now automatically run the search. You will be given a list of results, and the chance to enter your replacement term.

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 320.png">

Just type in the term and hit Replace or Replace All. 

So far this has worked perfectly for me. I did screw up one time and forgot to change the value on the "With" field, but that was entirely user error, and not Eclipse's fault. Also don't forget what I said about clicking back in the Navigator before you do the search.