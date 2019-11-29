---
layout: post
title: "You want some RIAForge source? You got some RIAForge source!"
date: "2007-07-12T00:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/11/You-want-some-RIAForge-source-You-got-some-RIAForge-source
guid: 2189
---

Folks have been <strike>bugging</strike>asking me about sharing the source to <a href="http://www.riaforge.org">RIAForge</a> for a while now, and I've finally gotten to packaging it up. You can download it via the Download link below. Before you download though, please read the following notes.
<!--more-->
First off - one of the reasons I was hesitant to share the code was because - like most people - I had cut a few corners here and there. I tried to document where I did that so I'd come back later and fix it, but, don't expect this to be the prettiest code you've ever seen come from me. A good example of this is the admin authentication. It's hard coded. (And yes, I changed the username/password in the code I provided here.) 

This is a Model-Glue application. It makes very minor use of Reactor. 

The application uses MySQL. I included the table scripts in a file named ao.sql.

The site assumes your have a web server that responses to www.yoursite.com and *.yoursite.com. Look at how Application.cfm looks at the cgi.server_name variable and rewrites the event. This is simple - but I was rather proud of it. 

The site makes use of a modified version of BlogCFC, LighthousePro, and Canvas. The main modifications were support for dynamic settings based on the request, all of which were rolled back into the products themselves. This is why BlogCFC can easily support a "Blogger.com" style setup. 

I'll be happy to answer questions about the code, but I cannot support the codebase as a real "project" per se. Right now I just don't have the bandwidth. So if you do use this code, please note that I cannot provide support for it. (Well, that's a lie. Most folks know I'm a sucker for a call for help, but in general, the answer will be no.) That being said - a <b>lot</b> of time went into this code, so if you do use it, I ask that you visit the <a href="http://www.amazon.com/o/registry/2TCL1D08EZEYE">wishlist</a> and give it some loving.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Friaforge%{% endraw %}2Ezip'>Download attached file.</a></p>