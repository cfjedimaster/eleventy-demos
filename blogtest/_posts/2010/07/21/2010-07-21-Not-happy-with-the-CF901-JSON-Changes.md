---
layout: post
title: "Not happy with the CF901 JSON Changes?"
date: "2010-07-21T19:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/21/Not-happy-with-the-CF901-JSON-Changes
guid: 3886
---

In my post on the <a href="http://www.raymondcamden.com/index.cfm/2010/7/13/ColdFusion-901-Released">ColdFusion 901 release</a>, more than one user commented that they weren't happy with the changes to JSON serialization in 901. According to the docs, the idea was that numbers wouldn't be converted to floats. Specifically, 10 would not become 10.0. Also, values that had a leading 0, like 007, would not lose their zeros and would become strings: "007". It appears though as if <i>all</i> of these values are turning into strings. So 10 becomes "10". This is contrary to what the docs say will happen. I disagreed with how serious this was, but to be honest, I really don't see any reason why the number needs to be quoted. Reader Patrick logged bug <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html?#bugId=83638">83638</a>. If you agree that the behavior should be fixed, than please add your <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html?#bugId=83638">vote</a>. (And remember to click the Subscribe button to be notified of updates.) I just added my own vote.