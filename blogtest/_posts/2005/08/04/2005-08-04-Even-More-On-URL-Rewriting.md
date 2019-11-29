---
layout: post
title: "Even More On URL Rewriting"
date: "2005-08-04T13:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/04/Even-More-On-URL-Rewriting
guid: 670
---

I thought it might be helpful if I shared the URL Rewriting rules I built for the <a href="http://mg.cflib.org">Model-Glue version of CFLib</a>. Right now, only two events work, showLibraries and showLibrary. Here are the rules as defined in Apache:

RewriteRule /showLibraries /?event=showLibraries [PT,NC]<br>
RewriteRule /showLibrary/([0-9]+)/(.*) /?event=showLibrary&id=$1 [PT,NC]<br>

This basically means that if 'showLibraries' is found in the URL, it should be rewritten to the right event format for MG. 

The second rule is a bit more complex. The URLS for linking to a library look like so

/showLibrary/9/StrLib

They include the ID and the library name. So my regex simply checks for "showLibrary", a value number, and it ignores the string at the end. 

I had to rewrite the regex a tiny bit for ISAPIRewrite. It uses different flags for one. (In Apache, NC means ignore case. In ISAPIRewrite, the flag is I.) Also, the ? had to be escaped in ISAPIRewrite.