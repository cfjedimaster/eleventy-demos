---
layout: post
title: "Ask a Jedi: XML Forms, CFSELECT, and Value Issues"
date: "2005-08-24T12:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/24/Ask-a-Jedi-XML-Forms-CFSELECT-and-Value-Issues
guid: 723
---

Kevin Smith (I don't suppose you are the "Clerks" guy?) asked the following question about XML forms and CFSELECT:

<blockquote>
I have a simple XML form having a simple cfselect statement like:

&lt;cfselect<br>
name = "employeeid"<br>
size = "15" multiple="no"&gt;<br>
<br>
&lt;option value = "676765"&gt;Option 1&lt;/option&gt;<br>
&lt;option value = "3333"&gt;Option 2&lt;/option&gt;<br>
&lt;/cfselect&gt;<br>


When you view the generated code or submit the form, the form value is the option text ('Option 1' instead of '676765'). Any Ideas what I am doing wrong?
</blockquote>

Turns out there is a bug in XML forms in the current version of ColdFusion MX7. I spoke with <a href="http://www.mikenimer.com/">Mike Nimer</a> and he confirmed this was fixed in the next release of ColdFusion.

Luckily, Mike also provided a very simple fix. To make the form work now, you need to remove the spaces between the = character and the value. See below:

<div class="code"><FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value = <FONT COLOR=BLUE>"676765"</FONT>&gt;</FONT></FONT>Bad Option<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT></div>

to

<div class="code"><FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"3333"</FONT>&gt;</FONT></FONT>Good Option<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT></div>