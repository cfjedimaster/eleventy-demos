---
layout: post
title: "Ask a Jedi: Dynamic Updates for CFMEDIAPLAYER"
date: "2010-05-05T10:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/05/05/Ask-a-Jedi-Dynamic-Updates-for-CFMEDIAPLAYER
guid: 3805
---

Alan asks:
<p>
<blockquote>
I am trying to dynamically populate the source of a cfmediaplayer tag. I can't find any documentation of this on the web.  Is it even possible?
</blockquote>
<!--more-->
<p>
I haven't made much use of <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSE66DB0CD-E16D-49e7-AAEE-F51F9580554E.html">cfmediaplayer</a>. This is one of the new tags in ColdFusion 9 and while it seems to work perfectly fine, I just don't use FLV media that much. That being said I took a quick look at this and came up with a solution.
<p>
First off - this tag does <b>not</b> allow for binding in the source attribute. If it did, my solution would have been a heck of a lot slimmer. But it does have multiple JavaScript API points, one of them being the ability to set the source. Let's take a look at my code. I began by creating a grid with fake data. The idea being that the user would be presented with a list of videos to choose from.
<p>
<code>
&lt;cfset q = queryNew("title,url")&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "title", "Video One")&gt;
&lt;cfset querySetCell(q, "url", "http://www.archives.alabama.gov/video/at0310.flv")&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "title", "Video Two")&gt;
&lt;cfset querySetCell(q, "url", "http://www.archives.alabama.gov/video/at0210.flv")&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "title", "Video Three")&gt;
&lt;cfset querySetCell(q, "url", "http://www.archives.alabama.gov/video/at0110.flv")&gt;

&lt;cfform name="boguswhydoineedaformforthis"&gt;
&lt;cfgrid name="mediafiles" format="html" query="q" selectonload="false"&gt;
	&lt;cfgridcolumn name="url" display="false"&gt;
	&lt;cfgridcolumn name="title" header="Title"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;

&lt;cfmediaplayer name="mediaplayer"&gt;
</code>
<p>
Nothing there should be complicated. Obviously your query would be dynamic, or you would use an Ajax binding for the grid. I needed something quick and simple though. Also take note of the mediaplayer at the bottom. It has a name but no source for now. For the next step, I wanted to notice changes to the selected video in the grid. For that I used:
<p>
<code>
&lt;cfajaxproxy bind="javascript:gridChange({% raw %}{mediafiles.url}{% endraw %})"&gt;
</code>
<p>
This says - when the value of mediafiles (the grid) changes, call a JavaScript function (gridChange) and pass the URL column. Now let's look at that JavaScript:
<p>
<code>

&lt;script&gt;
function gridChange(url) {
	ColdFusion.Mediaplayer.setSource("mediaplayer", url)
}
&lt;/script&gt;
</code>
<p>

And... that's it. Really. Nice and simple. You can see a demo of this <a href="http://www.raymondcamden.com/demos/may52010/test3.cfm">here</a>. Also notice that you the video does not auto play on selection. I tend to hate auto play, but if you wanted to do that as well, you would just add: ColdFusion.Mediaplayer.startPlay(). Oh, one note. Notice the lowercase "p" in Mediaplayer. The docs show it as upper case. Anyway, I hope this is helpful. The entire template is below.

<p>

<code>
&lt;cfset q = queryNew("title,url")&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "title", "Video One")&gt;
&lt;cfset querySetCell(q, "url", "http://www.archives.alabama.gov/video/at0310.flv")&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "title", "Video Two")&gt;
&lt;cfset querySetCell(q, "url", "http://www.archives.alabama.gov/video/at0210.flv")&gt;
&lt;cfset queryAddRow(q)&gt;
&lt;cfset querySetCell(q, "title", "Video Three")&gt;
&lt;cfset querySetCell(q, "url", "http://www.archives.alabama.gov/video/at0110.flv")&gt;

&lt;cfajaxproxy bind="javascript:gridChange({% raw %}{mediafiles.url}{% endraw %})"&gt;

&lt;html&gt;
&lt;head&gt;

&lt;script&gt;
function gridChange(url) {
	ColdFusion.Mediaplayer.setSource("mediaplayer", url)
}
&lt;/script&gt;

&lt;/head&gt;

&lt;body&gt;

&lt;h2&gt;Click to View&lt;/h2&gt;

&lt;cfform name="boguswhydoineedaformforthis"&gt;
&lt;cfgrid name="mediafiles" format="html" query="q" selectonload="false"&gt;
	&lt;cfgridcolumn name="url" display="false"&gt;
	&lt;cfgridcolumn name="title" header="Title"&gt;
&lt;/cfgrid&gt;
&lt;/cfform&gt;

&lt;cfmediaplayer name="mediaplayer"&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>