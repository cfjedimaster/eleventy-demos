---
layout: post
title: "Checking for updates to tags/functions in ColdFusion 9"
date: "2009-11-04T18:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/11/04/Checking-for-updates-to-tagsfunctions-in-ColdFusion-9
guid: 3590
---

Just a quick tip here. If you want to find out what changed in ColdFusion 9 at a tag/function level, there are three places you need to check. All of these may be found within the CFML Reference.

1) The first place is the listing of <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSe9cbe5cf462523a0dd03b2c1223a399518-8000.html">new tags</a> and <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WS890819DC-DE4D-4b24-A237-6E3483E9D6A1.html">new functions</a>. This one is kind of obvious.

2) The second place is the <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec17576-7fef.html">Tag changes since ColdFusion 5</a> and <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec1a60c-7ffa.html">Function changes since ColdFusion 5</a> pages. This provides a list of all changes since ColdFusion 5. In my opinion, that's a bit much. Adobe should probably limit this to the previous past two versions. But in general, this is another place where you can find out about updates.

3) Finally - there is a third place. Unfortunately, the "Tag/Function changes..." pages do not have a complete history/listing of all changes. A good example of this is the <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7adc.html">cfgridcolumn</a> tag. Notice how it has a History section? Notice how ColdFusion 9 added a bunch of new types? This was news to me until earlier today when Sam Farmer twittered about the date format. What this means is - it may make sense to run through <i>all</i> of the tags and functions and check the history section for things you may have missed. 

Unfortunately, even this isn't quite enough. The <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7ef7.html">cfdump</a> page does document the new abort attribute, but it isn't listed in the History nor in the "Tag changes..." page.

<b>Edit:</b> Note - sometimes in the History field, the ColdFusion 9 stuff is at the <b>bottom</b>, not the top of the history!