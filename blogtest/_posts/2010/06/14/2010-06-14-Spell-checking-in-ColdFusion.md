---
layout: post
title: "Spell checking in ColdFusion?"
date: "2010-06-14T16:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/06/14/Spell-checking-in-ColdFusion
guid: 3846
---

Last week a reader asked me about spell checking and ColdFusion. To be honest, I haven't really thought about it much. Firefox has provided support for spell checking for a good year now (probably more?) and I just kinda got used to it always being there. However, as a computer user I may be more tuned to it then the casual visitor. Also, the browser doesn't really provide any additional capabilities above simply adding the red squiggly lines to your text boxes. There may be times when you want a completely non-interactive spell check. Perhaps after importing a PDF for example. I did a tiny bit of Googling around to see what options were out there.
<!--more-->
The first thing I found was an old CFX by Ben Forta, CFX_Spell. However, the link didn't seem to go to a valid location anymore. 

The second thing I found was a like to an article in (I'm not going to name the magazine as the publisher is in cohorts with the devil). This article spoke about <a href="http://jazzy.sourceforge.net/">Jazzy</a>, an open source Java application for spell checking. 

Finally I found a solution by Foundeo (where community member <a href="http://www.petefreitag.com/">Pete Freitag</a> works) called, simply, <a href="http://foundeo.com/spell-checker/">Spell Checker</a>. The docs seem to imply (or did to me) that this is a solution only intended  for client side applications, but after speaking with Pete he did confirm you can use it completely server side as well.

So my question is - can anyone speak to any of the above solutions, or suggest their own?