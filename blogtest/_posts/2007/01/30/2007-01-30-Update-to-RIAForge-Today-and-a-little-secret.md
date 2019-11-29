---
layout: post
title: "Update to RIAForge Today (and a little secret)"
date: "2007-01-30T15:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/01/30/Update-to-RIAForge-Today-and-a-little-secret
guid: 1805
---

Just a quick note about a change I did to RIAForge this morning. Before I go on however, please note that I can't answer any questions about this, so please do not ask.

So this morning I added screenshots to RIAForge. This means project owners can upload screenshots of their applications to help give people an idea of how their project looks. As an example, check out the screenshots I uploaded for <a href="http://lighthousepro.riaforge.org/index.cfm?event=page.projectscreenshots">
Lighthouse Pro</a>.

Did I do this with a third party extension or funky Java code? Nope, I just used the new &lt;cfimage&gt; tags in Scorpio. (Oh, did I mention RIAForge is running on Scorpio now? You should note that this is NOT allowed and is a violation of the NDA. But I was given special permission by
the ColdFusion team to do this. Otherwise I'd be dead now. Seriously.) I have one tag to read in the uploaded image:

<code>
&lt;cfimage action="read" name="yourimage" source="#ifile#"&gt;
</code>

and another few lines of code to do a quick resize for my thumbnail:

<code>
&lt;!--- create a unique file name ---&gt;
&lt;cfset tfilePath = fileupload.serverdirectory & "/" & replace(createUUID(),"-","_","all") & ".gif"&gt;
&lt;!--- resize proportionally to 125 wide ---&gt; 
&lt;cfset imageResize(yourimage, 125,"")&gt;
&lt;!--- save the sucker ---&gt;
&lt;cfimage action="write" source="#yourimage#" destination="#tfilePath#"&gt;
</code>

Nifty.