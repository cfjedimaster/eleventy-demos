---
layout: post
title: "Chasing down a whitespace issue"
date: "2008-01-28T21:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/28/Chasing-down-a-whitespace-issue
guid: 2618
---

This is a blog entry that will/may have a few parts. A user just sent this in, and it seems like a mystery, so I'll try to keep my readers updated as things progress. Jennifer asks:

<blockquote>
<p>
I am trying to suppress whitespace in a script that I inherited
that generates a .ps report from database info.  I have tried everything (I do not have access to CF Administrator, but I've tried all the in code solutions) and it still won't go away! I have put cfsilent everywhere I possibly can, enabled cfoutput only, reset my content, cfprocessingdirective... the whole
shebang. However, whitespace is still everywhere and is turning a 1497k file into a 1696k file AFTER everything I have implemented! Is there anyway you can help or wisdom that you can impart?
</p>
</blockquote>

Well, first off, let's go over the list of places you may have forgotten to trim whitespace. I think you got them all, and the cfcontent with a reset should have done it anyway, but it won't hurt to review.

If your site uses an Application.cfm file, you want to ensure no whitespace is generated. You can do this with a cfsilent around the whole file, which I find to be a bit icky, or use the cfsetting tag, both on the very top (above comments!) and on the very bottom.

If you use Application.cfc, you have a few more places to check. First add output="false" to your top cfcomponent tag. Then look into all your onXStart methods (onApplicationStart, onSessionStart, onRequestStart), and ensure output is false there as well.

Lastly, look at the template that generates the PS report. Does it call any custom tags? Call any CFCs? If so, any of those calls can generate whitespace. You can check each of those files, or surround them with cfsilent. 

Now - you mentioned that you were serving your file up and you had preceded with a cfcontent/reset. You should know that that will clear any whitespace <i>before</i> your final output. It won't remove whitespace <i>inside</i> your output. 

So look at your output. Do you have a lot of whitespace between elements? 

If any of my readers have other ideas, chime in, and hopefully Jennifer will post an update.