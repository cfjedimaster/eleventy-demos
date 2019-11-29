---
layout: post
title: "ColdFusion and Professional Grade Tools"
date: "2011-08-31T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/08/31/ColdFusion-and-Professional-Grade-Tools
guid: 4348
---

Robby sent this to me this morning and I thought it would be something that folks much smarter than I could help discuss:

<blockquote>
I was hoping you or the community could provide some guidance. 
<br/><br/>
I am terribly distraught over the lack of professional grade tools for ColdFusion.  I have used other
languages (C/C++, Java, ASP, Perl, Motorola Assembly, Fortran, Ada, etc.) and they generally have much
more tools available.  I'm not talking about IDEs/editors as I have used combinations of Eclipse, CF Builder,
Notepad++, and Dreamweaver.  I'm thinking more in terms of unit testing, code coverage, static component analysis,
etc.  I don't know how much Adobe wants to push the platform as many in the industry consider it aging or dead, but many developers still use it and don't have a choice to  migrate to anything else but since it is no longer "fashionable", many independant software houses don't want to implement developer tools for it.
<br/><br/>
For example, consider some of the tools here:
<a href="http://www.mccabe.com/iq_developers.htm">http://www.mccabe.com/iq_developers.htm</a>
<br><br/>
I would give my right arm for this support in CF.<br/><br/>
I wasn't sure if you knew of some good tools with CF support.  I'm in reference to commercial grade, not
necessarily community software though in some instances community tools can be of high quality as well.  <a href="http://www.cflib.org">cflib.org</a> has not yielded much unfortunately.

Thoughts?
</blockquote>
<!--more-->
I think you touch upon an interesting topic here. First off - cflib.org was not built to be a tools site. CFLib is simply a large collection of UDFs - quick snippets of code to solve common problems. Basically it's a code sharing site. You are looking for tools that help work <b>with</b> code. That's a completely different thing.

I think in terms of that - you have a few options available to you right now. So for example, unit testing with <a href="http://www.mxunit.org">MXUnit</a>. This is an open source framework for testing. It even provides ANT integration. "Professional" is certainly up for debate, but I'd think MXUnit qualifies. There was also a ColdFusion code coverage project began, but my Google skills have failed me today. Another area where I think things are well represented is in server monitoring. You've got an excellent tool built into ColdFusion itself as well as two powerful tools from the <a href="http://www.fusion-reactor.com/fr/">Intergral</a> folks. 

So that being said - what are the spots folks think are missing? Which should Adobe be helping out with and which should be in the hands on the community?