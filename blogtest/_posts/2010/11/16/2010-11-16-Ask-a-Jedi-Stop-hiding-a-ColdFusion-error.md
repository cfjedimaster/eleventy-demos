---
layout: post
title: "Ask a Jedi: Stop hiding a ColdFusion error"
date: "2010-11-16T17:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/11/16/Ask-a-Jedi-Stop-hiding-a-ColdFusion-error
guid: 4015
---

I've blogged many times before about the need for proper error handling. (See the <a href="https://www.raymondcamden.com//2007/12/05/The-Complete-Guide-to-Adding-Error-Handling-to-Your-ColdFusion-Application">guide</a>) for more information.) But this week a reader came to me with an interesting problem. His ColdFusion site was throwing an error of some kind, but all he saw was a 'nice' error page, and not the real error. Basically, he needed to "roll back" the error handling so he could determine the real nature of the bug. These are the steps I walked him through including the 'final' issue that ended up being the main culprit.
<!--more-->
Step one - if the error is happening on a certain page, like foo.cfm, open up foo.cfm and see if a try/catch is suppressing the error. If so, you can either remove the try/catch tags themselves, or inside your cfcatch do a quick cfdump on the exception information. 

Step two - check to see if error handling was enabled in an Application.cfm file. Remember that ColdFusion will look for this file in the current folder and any folder above it. You need to look for that (or an Application.cfc file) in ever folder until you hit web root. (Note that in ColdFusion 9 you can limit how far 'up' the server will look.) When you find that file, search for a cferror tag. This will tell ColdFusion to run a template when an error occurs. If the Application.cfm cfincludes anything else, check those files as well.

Step two and a half - repeating the same logic above, look for an Application.cfc file. Application.cfc files can have both a cferror tag <i>and</i> an onError function. If you see them - comment them out.

Step three - You can define an error handler within your ColdFusion Administrator that applies globally. This one has tripped me up before. You will find it in the Settings page under "Site-wide Error Handler."

Step four - If you get an error, but not all the information you want (like a line number), then ensure that you enable Robust Exception Information. I'm normally warning people to turn off this setting, but in development you almost always want it turned on.

So... I thought that was it but unfortunately he still couldn't see his error. All he saw was:

<blockquote>
500 - Internal server error.
There is a problem with the resource you are looking for, and it cannot be displayed.
</blockquote>

Then something occurred to me. Back in the ColdFusion Administrator I asked him if he had <b>Enable HTTP status codes</b> turned on. Guess what? He did. What he was seeing was an IIS error handler. Once he turned that off he started getting his "naked" ColdFusion errors again.