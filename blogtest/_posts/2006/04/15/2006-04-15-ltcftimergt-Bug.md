---
layout: post
title: "<cftimer> Bug"
date: "2006-04-15T15:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/04/15/ltcftimergt-Bug
guid: 1215
---

I ran into a little bug today with <a href="http://www.techfeed.net/cfQuickDocs/?cftimer">cftimer</a>. I was using the inline mode which is supposed to report the time right where the code was ran. However, nothing showed up. 

On a whim, I turned of the enablecfoutputonly setting and it started working. I turned it back on, wrapped cftimer in cfoutput tags, and it worked as well.

Turns out cftimer doesn't always output. Other tags, like cfdump, will always show their output, even if inside an enablecfoutputonly=true and no cfoutput tags. This makes sense if you think about it. Any cf tag that generates output should be treated just like a cfoutput block. 

I reported the bug. Don't forget that you can report bugs as well. Just go here: <a href="http://www.macromedia.com/go/wish">http://www.macromedia.com/go/wish</a>. I can say from personal experience that Adobe <i>does</i> read the bug entries.