---
layout: post
title: "Flash Forms and ParagraphFormat"
date: "2006-12-05T14:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/12/05/Flash-Forms-and-ParagraphFormat
guid: 1695
---

A user recently sent in this problem: They noticed that if they paragraphFormatted the result of an HTML textarea, they got nicely formatted results. If they did the same thing with a Flash Form textarea, it didn't work.

The paragraphFormat function is relying on particular character codes to represent the end of a line. I did a quick test where I replaced all chr(13) with 13s, and all chr(10) with 10s. Turns out on the HTML form, my line breaks were chr(13)chr(10). In the Flash Form, they were just chr(13). 

I suggested this simple fix:

<code>
&lt;cfset form.comments2 = replace(form.comments, chr(13), chr(13) & chr(10), "all")&gt;
</code>

And it seemed to do the trick. One word of warning - if I remember right, the character codes you get from a text area are both OS and browser dependent.  This is probably less an issue with Flash Forms however.

p.s. One more reason to not use Flash Forms and just pick up Flex 2. :)