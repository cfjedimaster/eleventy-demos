---
layout: post
title: "ColdFusion, Solr, and Title Searches - an FYI"
date: "2011-11-30T09:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/11/30/ColdFusion-Solr-and-Title-Searches-an-FYI
guid: 4450
---

This week I worked with a user who was having an interesting issue with Solr-based searches under ColdFusion. He was trying to make use of "boosting", which is a way of saying that a match found in one field should be considered more important than another. So for example, imagine you have a collection of articles. The user searches for N and you want to ensure that if the title includes N it is rated higher. Normally Solr is going to use it's own judgement. It may say, for example, that if N occurs a crap load in the body then it should be rated higher than an article with N in the title. While that logic makes sense, Solr does allow you to weigh different fields higher if you want. Normally the syntax should be something like this:
<!--more-->
<p/>

<code>
#search# OR title:#search#^10
</code>

<p/>

However, in testing with the user, this didn't seem to work consistently. And then I noticed something odd. For our testing, we were using "ColdFusion" as a search string. While I tested I once did "coldfusion" and noticed that a record that should not have been returned wasn't. I hit up my Solr expert, <a href="http://www.iotashan.com/">Shannon Hicks</a> for help. Together we found that the Solr configuration ColdFusion creates sets title as a <b>case sensitive</b> field. That's important to know in general, but certainly impacted our tests here.

<p>

So the fix? I simply had the user employ one of the custom fields as a copy of the title field. Once done we could then do:

<p>

<code>
#search# OR custom1:#search#^10
</code>

<p>

And it worked immediately. I hope this is helpful!