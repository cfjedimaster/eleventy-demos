---
layout: post
title: "Ask a Jedi: Organizing user uploads"
date: "2006-12-28T09:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/28/Ask-a-Jedi-Organizing-user-uploads
guid: 1738
---

I haven't done the "Ask a Jedi" thing for a while, but it is time for it to return. For those who don't remember what this is - it is simply me responding to user questions on the blog. As a general warning, if you email me with a question, I may respond on the blog instead of email, so be sure to check both. (Although I never share the full name of the person who wrote me.)

So with that said, Kevin had this interesting question:

<blockquote>
Is it at all practical to create a user folder for each user? I know the server can handle 100's of millions of files / folders. 

What is the best (or a best) way to organize user data? I want to try to keep each users content as separate as
possible. I've done in the past where each user created gets a folder also, and it worked well. This prevents file name conflicts with other users that want to use the same filename too.
</blockquote>
<!--more-->
Well, normally I wouldn't make one folder per user. I'd use CFFILE's ability to make a unique file name on upload. That would mean you could put all files in one folder and the names won't conflict. CFFILE gives you access to the original name, so in the database you simply store both.

Now - since you have a <i>lot</i> of users, then you may run into an issue. The OS does have an upper limit. I forget what it is - but it may be like 25k files per folder. Let's just use that as an estimate. At 25k, then obviously you can hit the limit quickly.

So in that case you may want to use subfolders for each user. One option would be to simply use the user primary key (if it is a number). So your upload folder could be:

/uploads/9/

for userID=9. However - the same upper limit also applies to folders as well. 

Another option would be to create a catalog based on username. By catalog I mean a series of folders based on the letters in the username. So the username cfjedimaster would have this folder:

/uploads/c/cfjedimaster

or

/uploads/c/cf/cfjedimaster

This will reduce the number of folders needed. Obviously you want to decide ahead of time since changing the system later on could be a problem.

You didn't ask - but here are a few other things I'd watch out for. Number one is security. If you are letting folks upload files, you want to be real careful what they are allowed to send. You probably do not want to upload uploads of ColdFusion files. Don't just watch out for CFM files. Do you know if your server is configured to run PHP? You would want to block that as well.

I'd also strongly recommend watching your disk space as well. This could be done with a simple scheduled task that sends an email with the current free space.