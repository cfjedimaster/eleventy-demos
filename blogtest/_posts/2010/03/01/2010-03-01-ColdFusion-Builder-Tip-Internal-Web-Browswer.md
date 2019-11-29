---
layout: post
title: "ColdFusion Builder Tip - Internal Web Browser"
date: "2010-03-01T13:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/03/01/ColdFusion-Builder-Tip-Internal-Web-Browswer
guid: 3737
---

Ok, so this is another tip that is more Eclipse than ColdFusion Builder, but I thought I'd share it anyway. (I'm assuming a lot of people who will be using CFBuilder will be new to Eclipse as well!) I've mentioned before how I like to use <a href="http://www.raymondcamden.com/index.cfm/2009/11/25/Quick-TailView-Tip">TailView</a> when debugging. I find it especially useful in MVC applications with a lot of moving parts in each request. I've also demonstrated how I use <a href="http://www.coldfusionjedi.com/index.cfm/2009/11/19/Quick-Tip--CFLOG-and-JSON">JSON and CFLOG</a> to record complex data to a log file. While that works ok, sometimes I really need to use a proper CFDUMP to see what I'm working with. In those cases, I'll cfdump to a file (with format="html"):
<p/>
<code>
&lt;cfdump var="#url#" output="/Users/ray/Desktop/test.html" format="html"&gt;
</code>
<p/>
What I'll then do is open it in my browser and reload a few times while I tweak the code. Today, on a whim, I tried the Internal Web Browser view. This is different (as far as I know) from the preview in the editor pane. That view is something I don't use too often. Why? Because I normally really need to see both code <i>and</i> result at the same time. The Internal Web Browser though is a separate panel that acts like a browser. In the screen shot below, I've opened this view and pointed it to the test file on my desktop. As I work, I reload to get the latest dump:
<p/>
<img src="https://static.raymondcamden.com/images/cfjedi/cfbweb.png" title="Internal Web Browser FTW" />
<p/>
Useful? Maybe. In this particular case it was helpful to me. I was working on an issue within a loop inside cfchart. The dumps helped me track the data being supplied to the chart and where it was going wrong.