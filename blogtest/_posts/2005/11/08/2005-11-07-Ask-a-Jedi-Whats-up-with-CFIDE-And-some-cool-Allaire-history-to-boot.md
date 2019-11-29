---
layout: post
title: "Ask a Jedi: What's up with \"CFIDE\"? (And some cool Allaire history to boot!)"
date: "2005-11-08T11:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/11/08/Ask-a-Jedi-Whats-up-with-CFIDE-And-some-cool-Allaire-history-to-boot
guid: 905
---

So here is a fun question:

<blockquote>
Why is the CFIDE directory called CFIDE?
</blockquote>

To be honest, I had no idea. I pinged <a href="http://www.dcooper.org">Damon Cooper</a> and got a <i>very</i> interesting response:

<blockquote>
Good one :)  

Tom Jordahl and I did a quick comparison of mental notes, and to the
best of our "collective recollection", here's a bit of the history
behind it:

Back before Allaire acquired the Homesite product from Nick Bradbury, a
fully web-based ColdFusion administration AND development experience was
envisioned.  It was to use a combination of client-side Java and
ColdFusion server-side code.  The "/CFIDE" (or "ColdFusion Integrated
Development Environment") directory was the designated location for this
administrator and development environment.

Around ColdFusion 3.0, the CF Administrator shipped as a CF-based
application for the first time, and RDS support came a bit later.

There was actually a prototype around somewhere, apparently (that was
rumored to be tucked away in Patrick Muzila's desk drawer by the time I
joined in Jan 1998) of the Java applet-based development environment,
but it never shipped with the product.  The RDS-based file browser Java
applet, however, did ship as part of the Administrator, and is still
used in the Administrator (for better or worse!) even today, using the
"/CFIDE" directory. 

For a number of reasons (not the least of which was the fact that
client-side Java had it's share of issues), the web-based development
environment was dropped in favor of what became ColdFusion Studio, based
on the Bradbury Homesite product and code-base, which made a lot more
sense, as a native desktop IDE with built-in RDS support.  

This was a good call (IMO), but since those days the "/CFIDE" directory
has persisted, and has become the default web-accessible location for
Flash Form styles and themes, CF7 XML Form "skins" and layouts, Admin
API, CFC Utils, debugging templates, Getting Started base (if
installed), etc.

It has caused a bit of grief along the way, being case-sensitive on
Unix, needs to be web-accessible in hosted environments for Flash Forms
and the old CFFORM applets to work, etc, etc, but it's likely there to
stay now, I think :)

(HINT: For a little "blast from the distant past", check out the
contents of your {% raw %}{webroot}{% endraw %}\CFIDE\classes\images directory, especially
"cflogo.gif")

Damon
</blockquote>

Cool story! For those who are curious, here is cflogo.gif (copyrighted by Macromedia, yada yada yada):

<img src="http://ray.camdenfamily.com/images/cflogo.gif">