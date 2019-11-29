---
layout: post
title: "Two ColdFusion Server Monitoring Tips"
date: "2008-05-15T12:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/05/15/Two-ColdFusion-Server-Monitoring-Tips
guid: 2830
---

These are probably well know, but as I'm working on <a href="http://www.riaforge.org">RIAForge</a> a bit today I thought I'd share. Both are thanks to <a href="http://tjordahl.blogspot.com/">Tom Jordhal</a> who, along with <a href="http://www.cfinsider.com">Jason Delmore</a>, is helping debug the issues on the box.

First - in the Alerts section, Email settings, it says that you should supply a recipient's email address. It isn't obvious, but you can supply a list of email addresses here separated by a comma.

Secondly - in the main settings for the Server Monitor, do not forget you can supply aliases. This lets you change

c:\websites\something\more\long\foo.com\index.cfm

to

Paris Hilton Blog home page

An odd aspect to aliases is the Action Parameters portion. This isn't documented anywhere (as far as I know), but you cna supply URL parameters and values. So for example, I could make an alias for

Paris Hilton View Entry

that points to index.cfm and event=view.blogentry

I didn't quite test this yet - but that's how it should work - again - as far as I know.

<b>Edited at 10:22</b><br>

Unfortunately I've found a bug with aliases. If you try to use 2 aliases to the same file, but with different parameters, the SM will only store the last one you use. This makes the alias mostly useless for frameworks. Well, you can still make a generic alias, but you can't do event-specific aliases.

<b>Edited at 10:27</b><br>

Ok, so again, thanks to Tom, I figured the issue with the aliases. You do not provide name=value pairs. Instead, you provide just the name of the URL argument. If you do event for example, then in the SM you will see:

youralias?event=X

which <b>is</b> useful for Model-Glue type sites.