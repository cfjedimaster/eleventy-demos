---
layout: post
title: "Soundings 3 - Preview and Live Demo"
date: "2008-12-15T22:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/12/15/Soundings-3-Preview-and-Live-Demo
guid: 3149
---

I'm happy to announce the release, well, the beta release, of the 3rd version of Soundings, my ColdFusion-based survey application. You can download it now from SVN (<a href="http://svn.riaforge.org/soundings">http://svn.riaforge.org/soundings</a>). My plan is to let folks test it out and if things work well, issue a formal release next week. Be sure to read the release notes and note that the docs have not yet been updated. So with that being said, what's new, and how can you test it?

The first change is to the security system. The administrator now has two kinds of users - administrators and survey creators. As you can guess, survey creators just have the ability to work with surveys and questions. All surveys they create belong to them and they can't see surveys belong to other users. This means the administrator can set up accounts for various users and let them create their own surveys.

You can now create templates. Templates are simply a header and footer. Surveys can chose to use a template. This means you won't see the lovely blue skin wrapping your survey. It also means multiple people at one organization can skin their survey as they see fit. Along with this, surveys can also be hidden from the main list of public surveys on the non-protected web page. 

Surveys can be embedded on a web page. I hope this works. It seems to. Here is an example:

<b>I removed the live demo due to it not being set up on my new server.</b>

Reporting has been updated. The main update here is the addition of date filters. For a busy survey this lets you generate quicker results by limiting the amount of days checked. I also fixed a few small bugs in the same area as well.

A few notes. I have not run VarScoper on the code yet. I ran into a few missing var statements while working for v3, so I plan on doing a formal check right before the final release. Secondly, if you want to test Soundings v3, I'll be happy to give you an account on the demo install here. Just shoot me an email via the contact form. I will not promise the demo version will stay up forever, but I hope to have an alternative that is a bit more permanent early next year.