---
layout: post
title: "Ask a Jedi: Using Sleep ok?"
date: "2007-10-15T11:10:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2007/10/15/Ask-a-Jedi-Using-Sleep-ok
guid: 2413
---

Danny asks a question about locking and sleep in his ColdFusion/Flex application:

<blockquote>
I'm wondering if it is good practice to use java.lang.Thread.sleep().  I have a Flex App uploads image files (in a loop) to a CF Server.  In brief, I am Reading, Uploading, Deleting images all within short times of each other, so there is a chance my Delete will fail because my
Flex App may still be reading the image, thus locking it.

I decided to just call a Sleep(20000) before I called Delete.  With 3 files, my Flex App was seemless.  But when I tried 6 files, my Flex App stalled a bit.

Maybe it is because I am just using the Developer version of ColdFusion, but is calling all these Sleep threads causing ColdFusion to block my Flex App or something?  Is this the right way to go about this?
</blockquote>

I'll start by reminding folks that in ColdFusion 8, you have no need to go to Java, you can just use Sleep() natively as part of the application.

So I think you can see the nature of your problem. You are trying to solve your locking problem by waiting - and while it works for short sets of files, it isn't working for more. You can certainly just double the number in your Sleep call, and that <i>may</i> work, but you will never be certain.

You want to watch out for code like this. I think we've all done it. Call it "Hail Mary" code. Code you think might work - but you aren't sure. You shouldn't write it - but I know I have in the past. 

I'd recommend another solution. If I read right, it sounds like the only problem you have is deleting. Why not simply use a scheduled task? It can run hourly and use cfdirectory to find images that are more than 60 minutes old and delete them. In theory, they could still be locked so you want to be sure to try/catch the delete call.