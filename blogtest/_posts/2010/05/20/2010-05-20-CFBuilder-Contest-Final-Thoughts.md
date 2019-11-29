---
layout: post
title: "CFBuilder Contest: Final Thoughts..."
date: "2010-05-20T19:05:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/05/20/CFBuilder-Contest-Final-Thoughts
guid: 3825
---

<img src="https://static.raymondcamden.com/images/cfjedi/cf_builder_appicon.jpg" align="left" style="margin-right:5px" title="ColdFusion Builder FTW!" /> Another contest has come to an end. I love running these things. It's a lot of work - but in the end - the results are always worth it. We didn't get many entries this time - but the ones we got were interesting, unique, and I think they go a long way to really demonstrating what a powerful platform ColdFusion Builder is. Speaking for myself - I definitely think I learned a few things:
<!--more-->
<ul>
<li>Many extensions (in this contest, mine, etc) don't properly handle all the various ways the IDE can send input to the extension. As an example, an extension built to work on a file may fail if you specify 2 or more files. For people whose extensions work with the project system it is something to check. Ditto for extensions tied to the editor. In one example, I selected no text and just assumed it would work on the complete file. It did not. So I really think we need to look out for these variations and handle them properly.
<li>Many extensions don't go a long way to handling errors nicely. Akbar's AppCore Creator did a <b>darn</b> good job on this. It's the example I'd use going forward.
<li>I've struggled with using the Session scope in the past to maintain state between various "pages" (or panels, steps, etc) in an extension. Looks like I'm the only one since everyone else just made use of the Application scope. It makes sense and it is what I'll do going forward.
</ul>

So - what did other people learn from these entries? Are you more encouraged to write your own extensions? Are you more encouraged to buy the product seeing what can be done? (And as always, if you have any feedback on the contest itself - you can add that as a comment or email me directly.)

Adobe had originally offered 5 prizes - 4 CFBuilder licenses and one CF server license. I got them to agree to give all 5 people CFBuilder, but we need to select one person to be the "grand" prize winner. Normally I do this by dictatorship. That's worked well in the past - but in this case, I think I'll let the readers pick. I've created a simple Google Survey (and yes, I know I can use my own <a href="http://soundings.riaforge.org">Soundings</a> project, but I wanted to see how Google did it and I won't have time to set it up before I travel anyway) where folks can pick the extension they think should be the big winner. Please be fair and try not to cheat too much. 

Finallly - a <b>big thank you</b> to my submitters. I know it is scary to share your code with the public and I definitely appreciate yall doing so. I love you guys. Really. Ok, maybe not. More like a Luke/Leia post-ESB love. 

<iframe src="http://spreadsheets.google.com/embeddedform?formkey=dGJvTzJwb3NJbVVIWXh3X3lwRHJHVEE6MQ" width="760" height="669" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>