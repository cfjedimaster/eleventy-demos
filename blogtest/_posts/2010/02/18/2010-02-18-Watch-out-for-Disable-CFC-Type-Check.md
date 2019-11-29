---
layout: post
title: "Watch out for \"Disable CFC Type Check\""
date: "2010-02-18T13:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/18/Watch-out-for-Disable-CFC-Type-Check
guid: 3724
---

Ok, I know this sounds crazy, but yesterday I encountered a bug. What makes this more crazy is that the code worked locally on a development machine but not production. Now I know that hasn't happened to any of my readers, but it actually  happened to me twice in the past 24 hours, and in both cases it was the same issue - although expressed in slightly different ways. 

The code in question was a very simple CFC method:

<code>
remote boolean doX(numerid x) {
    return x &gt; 1;
}
</code>

That isn't the <i>exact</i> code I had, but if you look closely you can probably see the bug already. I was using the CFC method in a simple Ajax application (<a href="http://www.raymondcamden.com/index.cfm/2010/2/18/A-Simple-Class-SchedulingConflict-Handler-built-with-ColdFusion-and-jQuery">this one...</a>) and everything worked fine on my local server. Once I pushed the code to production, though, I got an error about my argument not being of type numerid. 

Numerid? WTF?

Yep - I had typoed (or as I call it, pull a Zoid) numeric. So why did it work locally? One of the options in the ColdFusion Administrator is <b>Disable CFC Type Check</b>, which is explained as: When checked, UDF arguments of CFC type is not validated. The arguments are treated as type "ANY". Use this setting in a production environment only.

Right away you can see one mistake. The setting clearly says it should only be enabled in production. I don't even remember turning it on but I guess I did. Now this is where things get interesting. When it comes to UDF arguments, the type you specify can be anything you want, but if you specify a value that is <b>not</b> on the list of defined types (like numeric, string, etc) that ColdFusion assumes you mean a CFC type. In my case, numerid ended up, to ColdFusion, implying some CFC named "numerid.cfc". Because I had "Disable CFC Type Check" on, it ended up being Any, which means I could pass anything I wanted to it - CFC or not.

Ok, so to be clear - that isn't a bug in ColdFusion. That was definitely my fault. But this is the first time that setting has tripped me up like that. Of course, to make things fun, I tripped over this exact same issue <i>again</i> today, this time in regards to ORM. I had used this code in a persistent entity:

<code>
type="nvarchar(10)"
</code>

What I had meant to do was

<code>
sqltype="nvarchar(10)"
</code>

Type in cfproperty refers to the same list of types we use with UDF arguments. Once again - since I had picked an unknown value, CF assumed I meant a CFC, and because I had the "Disable CFC Type Check" setting on, it just plain worked for me.