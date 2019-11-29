---
layout: post
title: "Ask a Jedi: Caching Results from ColdFusion Tags"
date: "2005-08-09T08:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/09/Ask-a-Jedi-Caching-Results-from-ColdFusion-Tags
guid: 682
---

Jared asks:

<blockquote>
Ray, What is a good way to cache results from CFDIRECTORY LIST? The issue is I'm populating a cftree with results from a cfdirectory and want to cache the results. [Lots of files and dirs] I've been messing around with Ben Forta's example for populating the cftree and wanted to add some caching. What would you suggest?
</blockquote>

The simplest way is to use ColdFusion's built-in persistant scopes! All you need to do is store the result of the cfdirectory call in the Application scope. Here is an example (and let me warn you, I haven't had my first full cup of coffee yet, so watch out for typos):

<div class="code"><FONT COLOR=MAROON>&lt;cfif not isDefined(<FONT COLOR=BLUE>"application.dirlisting"</FONT>)&gt;</FONT><br>
  <FONT COLOR=MAROON>&lt;cfdirectory directory=<FONT COLOR=BLUE>"<A TARGET="_blank" HREF="c:\media">c:\media</A>\mp3s\"</FONT> recurse=<FONT COLOR=BLUE>"yes"</FONT> name=<FONT COLOR=BLUE>"application.dirlisting"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT></div>

The code above simply says, if there is no variable in the application scope called dirlisting, run the cfdirectory tag and store the result in the application scope. Note the use of recurse=yes, a new feature in ColdFusion MX 7. (To be precise, you should know that if two or more people hit this page at the <b>exact</b> same time, it is possible they can both run the cfdirectory tag. Since this doesn't matter for this example, I'm not going to cover locking for now.)

Obviously if the directory is different per person, you could use the Session scope instead of the Application scope. If you are worried about the data staying around too long, you can even add a way to flush the cache:

<div class="code"><FONT COLOR=MAROON>&lt;cfif isDefined(<FONT COLOR=BLUE>"url.flushmycachebaby"</FONT>)&gt;</FONT><br>
  <FONT COLOR=NAVY>&lt;i&gt;</FONT>run cfdirectory again<FONT COLOR=NAVY>&lt;/i&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT></div>