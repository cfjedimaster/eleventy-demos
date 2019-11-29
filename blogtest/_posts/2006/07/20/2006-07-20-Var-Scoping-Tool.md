---
layout: post
title: "Var Scoping Tool"
date: "2006-07-20T16:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/07/20/Var-Scoping-Tool
guid: 1415
---

So, pre-MX my big thing was locking. Post MX (really, CF5) my big "let me get all anal" thing is var scoping. As you have heard me say time after time on this blog, if you forget to var scope, you will end up in big trouble. (That's right, big trouble. Human sacrifice, dogs and cats living together - mass hysteria.)

Mike Schierberl has released a cool new tool to help solve that problem, the <a href="http://www.schierberl.com/varScoper/">varScoper</a>. This tool lets you examine your source code for potentially missing var statements. It will return a report of all the possible matches. 

Whats cool about this tool is that it even found mistakes in my code. Not to say I'm perfect - but I know I definitely look out for it and I still missed things. There is an online <a href="http://www.schierberl.com/varScoper/examples/varScoper.cfm">demo</a> which uses a copy of BlogCFC as one of it's samples. It found a few false positives, but it found some real issues as well. (Fixed in the latest release!)