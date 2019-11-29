---
layout: post
title: "cfObjective - Scorpio Keynote by Jason Delmore, Product Manager for CF."
date: "2007-05-04T11:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/05/04/cfObjective-Scorpio-Keynote-by-Jason-Delmore-Product-Manager-for-CF
guid: 2001
---

As with my other conference reviews, please forgive the bad grammar, stilted sentences, etc. I'm writing as I listen...

I love it - he started off asking who is on the Scorpio beta - most of us raised our hands, and my buddy Scott made the point that we all just violated the NDA. ;)

CF7 has been very successful (and take that all of you who keep saying CF is going to die). Macromedia was actually surprised by this. Scorpio started initial planning in 2004, real 'work' began in 2005. Took some time to add Flex integration to CF (CF 7.0.2). (Curious why it was 7.0.2 and not 7.5? Adobe wanted the update to be free.) 

Scorpio is about...<br>
Infrastructure<br>
Developers<br>
Experience

Added .Net object support. Exchange Server integration. You can work with mail, contacts, calendar info, tasks. 

System support: New ones include OSX, Visa, Longhorn. At the app server level, adding JBoss support. Added virtualization support (vmware/ms virtual server).

Focus on Developers: 
Enterprise Server Monitoring has gotten a face lift in design for beta 2. You can monitor one server or multiple servers. See in real time which servers are ok and which ones need help. 

Roles based security added to CF administrator. Ie, users can have different rights in the admin. (Although a lot of times I think people wanted access to stuff like mappings, etc, which can be done with per application settings now.)

CFC Interfaces and Serialization added. 

JavaScript style operators (++, &lt;, &gt;, &&, !, etc)

Pass tag attributes as one collection (think attributeCollection for custom tags).

Secure FTP support in CFFTP

FIPS-140 compliant strong crypto (no idea what that is but it sounds cool)

Focus on Experience:

AJAX - JavaScript proxy to simplify CFC working from AJAX. New user interface controls. Uses YUI. Uses Spry as well. 

In his demo he is showing a new function, queryConvertForGrid. Converts a query to a grid. Not sure I can say more. Demo shows a cfgrid with AJAX binding
and format=HTML. 

Displays a pretty HTML based grid and the CF Debugger which is used for AJAX debugging. You turn this on with a url flag. Grid is sortable and you can change the column sizes.

PDF Forms: Prepopulate and extract data from PDF forms. Manipulate existing PDFs. You can merge, rotate, extract, 'everything'. You can create thumbnails of PDF docuemnts. 

On demand presentations. Sweet - Jason said we did this because we could (go Adobe!). 

Image manipulation. 50 new functions. (Won't write a lot of this down as I think this has been covered quite a bit.)

CFFEED added to language. Supports RSS and ATOM. Can consume feedsand return standard queries. Can generate RSS and ATOM. (This is one of my favorite features.)

Reporting (personal note here - I love reports, but haven't really cared for CFREPORT). Changes include big report builder updates. Custom templates.
CSS for styling. Conditional formatting. Reports can be output to HTML and XML. 

Hmm, on a slide for Developers he showed Interactive Debugger. Interesting.

Scorpio is 4 to 5 times faster then CF7. That's right - 4 to 5 times faster. 

New feature announcing right now - CFTHREAD. It WILL be in Scorpio. You can run, join, sleep, terminate threads. You can get thread metadata (elapsed time, error, name, output, priority, starttime, status.)