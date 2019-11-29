---
layout: post
title: "ScriptProtect \"Gotcha\""
date: "2005-09-14T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/14/ScriptProtect-Gotcha
guid: 774
---

As I was preparing for my <a href="http://www.macromedia.com/cfusion/event/index.cfm?event=detail&id=288085&loc=en_us">presentation</a> today, I was playing a bit with the new scriptProtect feature of ColdFusion MX7. I turned the option on, performed a test, and was puzzled when scriptProtect didn't actually do anything. Thinking that maybe my Application.cfc was cached, I restarted ColdFusion, but nothing changed.

I checked the docs (always a good idea) and realized I had made a very simple mistake. ScriptProtect expects three possible values. Either "all", "none", or a list of ColdFusion scopes to protect. I had done this:

<div class="code"><FONT COLOR=MAROON>&lt;cfset this.scriptProtect = true&gt;</FONT></div>

To me, this just seemed like the natural way to turn on script protection. However, not only did it <b>not</b> work, it never threw an error either. To me, this is a bit dangerous. I had expected my site to be protected, but it wasn't since I had supplied the wrong value. I would normally expect ColdFusion to throw an error, <i>especially</i> with something security related like this. Watch out for it folks!