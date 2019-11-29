---
layout: post
title: "Quick FAQs on my applications"
date: "2006-04-11T10:04:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/04/11/Quick-FAQs-on-my-applications
guid: 1202
---

I see a few common question asked about my <a href="http://ray.camdenfamily.com/projects/projects.cfm">applications</a> almost every week, so I thought I'd write a quick post to answer them.

1) The SES URLs aren't working:<br>
Nine times out of ten this can be answered at this URL:

<a href="http://www.macromedia.com/cfusion/knowledgebase/index.cfm?id=2addd247">http://www.macromedia.com/cfusion/knowledgebase/index.cfm?id=2addd247</a>

Although earlier this week the issue came about because a user had used an incorrect setting for "blogURL" in BlogCFC. The docs say (although probably not clearly enough) that the URL <i>must</i> include "index.cfm". If you forget this, it will cause problems.

2) MySQL isn't working right:<br>
Nine times out of ten this is due to using ColdFusion's built-in driver for MySQL instead of the custom one. Steve Erat has an excellent article on how to set this up <a href="http://www.talkingtree.com/blog/index.cfm?mode=entry&entry=25AA9A56-45A6-2844-7A60CF5B3666D010">here</a>. My docs almost never mention that - sorry. I added it to the <a href="http://ray.camdenfamily.com/projects/soundings">Soundings</a> docs in the release last night. 

In case you are wondering - I am not yet testing on MySQL 5, but hope to be soon.

By the way - I'm not complaining - keep the questions coming - but I thought this might help.