---
layout: post
title: "Ask a Jedi: Flash, ColdFusion and FIle Uploads"
date: "2008-04-10T16:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/10/Ask-a-Jedi-Flash-ColdFusion-and-FIle-Uploads
guid: 2765
---

Asa asks an interesting question. I wasn't going to answer as Flash isn't my area really, but I had an idea and I figured I'd suggest it. Please feel free to correct me if this is dumb. Anyway, here is the question:

<blockquote>
<p>
I'm trying to make a file unloader using Flash & ColdFusion. I have a flash file embedded on a page that let's the user select a file, which is then posted to a ColdFusion page for upload. The problem is that the Flash player doesn't post
cookies on file uploads, so the ColdFusion page that's getting posted to is under a new session. Is there a way to append the cfid to the url and have ColdFusion use that session instead of making a new one?
</p>
</blockquote>

So I was a bit surprised by this. I can't imagine why Flash would not do a 'normal' request and pass along the cookies. That being said - I think I know a way to do this. When you generate your HTML code to embed the Flash SWF, you can pass along the session.urltoken value via flash vars. The Flash app could read this and use it when it does its POST.

Right? 

Any Flash users out there want to chime in? (I'm sure I must have at least <i>one</i> Flash guy reading the blog. He probably sits next to the one Photoshop guy reading my blog. ;)