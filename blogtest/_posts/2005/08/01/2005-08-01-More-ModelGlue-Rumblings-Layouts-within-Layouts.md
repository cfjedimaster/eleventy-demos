---
layout: post
title: "More Model-Glue Rumblings... Layouts within Layouts"
date: "2005-08-01T12:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/01/More-ModelGlue-Rumblings-Layouts-within-Layouts
guid: 659
---

As I continue to work on the new version of CFLib (and I promise this week I'll put the beta version up so folks can look at, and laugh at, my mistakes), I wanted to tackle a new problem that I was a bit unsure of how to handle.

Take a quick look at <a href="http://www.cflib.org">CFLib</a>. Notice the layout doesn't change as you go from page to page. This layout was easily put into a view in the MG version. But notice the "pods" in the right hand section. By "pod" I mean each little box. This part confused me a bit. How could I get these guys into my layout?
<!--more-->
I had already moved my layout to an event by itself:

<div class="code"><FONT COLOR=NAVY>&lt;event-handler name=<FONT COLOR=BLUE>"Layout"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;views&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"main"</FONT> template=<FONT COLOR=BLUE>"layout.main.cfm"</FONT> /&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;/views&gt;</FONT><br>
<FONT COLOR=NAVY>&lt;/event-handler&gt;</FONT></div>

This layout template simply checked the viewCollection for a value called body. Each of my events used "body" when doing their views. How then would I add in my pod? MG lets you stack views, allowing the later views to include the content from the earlier views. So if I wanted to simply include the HTML for the pods, it would be rather simple. I'd just add a new include tag. 

However - I wanted to abstract the pod view as well. This turned out to be rather simple:

<div class="code"><FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"podbody"</FONT> template=<FONT COLOR=BLUE>"dsp.searchpod.cfm"</FONT> /&gt;</FONT></FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"pod"</FONT> template=<FONT COLOR=BLUE>"layout.pod.cfm"</FONT>&gt;</FONT></FONT></div>

My search pod, for now, was rather simple:

<div class="code"><FONT COLOR=MAROON>&lt;cfset viewState.setValue(<FONT COLOR=BLUE>"podtitle"</FONT>,<FONT COLOR=BLUE>"Search CFLib.org"</FONT>)&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><br>
This is the search pod.<br>
<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT></div>

Note the use of the viewState to set my title. This let me pass a title to my pod. So far so good. My pod view code had HTML and this:

<code>
<cfif viewCollection.exists("podbody")>
  #viewCollection.getView("podbody")#
</cfif>

Everything ran fine until I added another pod:

<div class="code"><FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"podbody"</FONT> template=<FONT COLOR=BLUE>"dsp.searchpod.cfm"</FONT> /&gt;</FONT></FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"searchpod"</FONT> template=<FONT COLOR=BLUE>"layout.pod.cfm"</FONT> /&gt;</FONT></FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"podbody"</FONT> template=<FONT COLOR=BLUE>"dsp.logonpod.cfm"</FONT> /&gt;</FONT></FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"logonpod"</FONT> template=<FONT COLOR=BLUE>"layout.pod.cfm"</FONT> /&gt;</FONT></FONT></div>

The first thing I forgot was the views with the same name will overwrite each other. So my 2 podbody tags would not work. The first thing I did was give better names to my two pods, "searchpodcontent" and "logonpodcontent". However, my view for th epod was still checking for "podbody". How could I tell my view what viewCollection to use? I then remembered that I could pass an argument to my views. I switched to this:

<div class="code"><FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"searchpodcontent"</FONT> template=<FONT COLOR=BLUE>"dsp.searchpod.cfm"</FONT> /&gt;</FONT></FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"searchpod"</FONT> template=<FONT COLOR=BLUE>"layout.pod.cfm"</FONT>&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;value name=<FONT COLOR=BLUE>"podcontent"</FONT> value=<FONT COLOR=BLUE>"searchpodcontent"</FONT> /&gt;</FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/include&gt;</FONT></FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"logonpodcontent"</FONT> template=<FONT COLOR=BLUE>"dsp.logonpod.cfm"</FONT> /&gt;</FONT></FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"logonpod"</FONT> template=<FONT COLOR=BLUE>"layout.pod.cfm"</FONT>&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;value name=<FONT COLOR=BLUE>"podcontent"</FONT> value=<FONT COLOR=BLUE>"logonpodcontent"</FONT> /&gt;</FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/include&gt;</FONT></FONT></div>

With me so far? My pod layout would simply check the viewState to get the name of the content to load:

<div class="code"><FONT COLOR=MAROON>&lt;cfset contentName = viewState.getValue(<FONT COLOR=BLUE>"podcontent"</FONT>)&gt;</FONT><br>
(lines of html and junk)<br>
<FONT COLOR=MAROON>&lt;cfif viewCollection.exists(contentName)&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;  #viewCollection.getView(contentName)#<br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT></div>

So far so good. However, now I had a new problem. Both pods rendered. But the second pod had the right title and the wrong content. Turns out - I was thinking of the VALUE tag as an argument to a UDF - where it's really meant to set a value in the viewState data structure. Therefore, the value wasn't unique. All I had to was tweak the value tag to pass overwrite="true". And a big thank you to Joe R. for pointing that out to me. Here is the final version of the event from my MG xml file:

<div class="code"><FONT COLOR=NAVY>&lt;event-handler name=<FONT COLOR=BLUE>"Layout"</FONT>&gt;</FONT><br>
<FONT COLOR=NAVY>&lt;views&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"searchpodcontent"</FONT> template=<FONT COLOR=BLUE>"dsp.searchpod.cfm"</FONT> /&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"searchpod"</FONT> template=<FONT COLOR=BLUE>"layout.pod.cfm"</FONT>&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;value name=<FONT COLOR=BLUE>"podcontent"</FONT> value=<FONT COLOR=BLUE>"searchpodcontent"</FONT> /&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/include&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"logonpodcontent"</FONT> template=<FONT COLOR=BLUE>"dsp.logonpod.cfm"</FONT> /&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"logonpod"</FONT> template=<FONT COLOR=BLUE>"layout.pod.cfm"</FONT>&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY>&lt;value name=<FONT COLOR=BLUE>"podcontent"</FONT> value=<FONT COLOR=BLUE>"logonpodcontent"</FONT> overwrite=<FONT COLOR=BLUE>"true"</FONT>/&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/include&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;include name=<FONT COLOR=BLUE>"main"</FONT> template=<FONT COLOR=BLUE>"layout.main.cfm"</FONT> /&gt;</FONT></FONT><br>
<FONT COLOR=NAVY>&lt;/views&gt;</FONT><br>
<FONT COLOR=NAVY>&lt;/event-handler&gt;</FONT></div>

Now - some MG experts out there are yelling, "No Ray, there is a better way!" One of the things I love about ColdFusion is that there is <i>always</i> a better way. I've had a few suggestions sent to me, and later today I'll blog about them.