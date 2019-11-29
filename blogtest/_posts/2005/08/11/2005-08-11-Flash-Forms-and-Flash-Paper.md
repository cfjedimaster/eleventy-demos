---
layout: post
title: "Flash Forms and Flash Paper"
date: "2005-08-11T13:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/08/11/Flash-Forms-and-Flash-Paper
guid: 692
---

This morning I posted about using <a href="http://ray.camdenfamily.com/index.cfm/2005/8/11/Ask-a-Jedi-Can-I-Use-a-PDF-in-a-Flash-Form">PDFs in Flash Forms</a>. The short answer was that it was not possible. On the entry, Simeon mentioned he was working on a way to get Flash Paper into Flash Forms. That was enough to distract me and see if I could build it as well. What's nice is that you can use the same technique I talked about during my series on <a href="http://ray.camdenfamily.com/index.cfm/2005/7/23/Embedded-CFCHART-in-Flash-Forms--Part-3">embedding charts in Flash Forms</a>. Consider the following code sample:

<div class="code"><FONT COLOR=MAROON>&lt;cfdocument format=<FONT COLOR=BLUE>"flashpaper"</FONT> name=<FONT COLOR=BLUE>"fp"</FONT>&gt;</FONT><br>
<FONT COLOR=NAVY>&lt;h1&gt;</FONT>Flash Paper Help<FONT COLOR=NAVY>&lt;/h1&gt;</FONT><br>
<br>
<FONT COLOR=NAVY>&lt;p&gt;</FONT><br>
The following text would normally describe how a person would fill out the form.<br>
It could discuss what the fields mean. Of course, most people don't need help<br>
filling out forms, and if they do, they probably shouldn't be in front of a computer<br>
anyway.<br>
<FONT COLOR=NAVY>&lt;/p&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfdocument&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfset fileName = expandPath(<FONT COLOR=BLUE>"./flashpaper.swf"</FONT>)&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cffile action=<FONT COLOR=BLUE>"write"</FONT> file=<FONT COLOR=BLUE>"#filename#"</FONT> output=<FONT COLOR=BLUE>"#fp#"</FONT>&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfform name=<FONT COLOR=BLUE>"test"</FONT> format=<FONT COLOR=BLUE>"flash"</FONT> width=<FONT COLOR=BLUE>"650"</FONT> height=<FONT COLOR=BLUE>"600"</FONT>&gt;</FONT><br>
<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfformgroup type=<FONT COLOR=BLUE>"tabnavigator"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfformgroup type=<FONT COLOR=BLUE>"page"</FONT> label=<FONT COLOR=BLUE>"Registration Form"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"text"</FONT> name=<FONT COLOR=BLUE>"name"</FONT> label=<FONT COLOR=BLUE>"Name"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"text"</FONT> name=<FONT COLOR=BLUE>"email"</FONT> label=<FONT COLOR=BLUE>"Email"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"text"</FONT> name=<FONT COLOR=BLUE>"age"</FONT> label=<FONT COLOR=BLUE>"Age"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"text"</FONT> name=<FONT COLOR=BLUE>"something"</FONT> label=<FONT COLOR=BLUE>"Something"</FONT> required=<FONT COLOR=BLUE>"true"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfformgroup&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfformgroup type=<FONT COLOR=BLUE>"page"</FONT> label=<FONT COLOR=BLUE>"Help"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfformitem type=<FONT COLOR=BLUE>"html"</FONT> height=<FONT COLOR=BLUE>"500"</FONT> width=<FONT COLOR=BLUE>"600"</FONT>&gt;</FONT><FONT COLOR=NAVY><FONT COLOR=PURPLE>&lt;img src=<FONT COLOR=BLUE>"flashpaper.swf"</FONT> width=<FONT COLOR=BLUE>"500"</FONT> height=<FONT COLOR=BLUE>"600"</FONT>&gt;</FONT></FONT><FONT COLOR=MAROON>&lt;/cfformitem&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfformgroup&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfformgroup&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<br>
<FONT COLOR=MAROON>&lt;/cfform&gt;</FONT></div>

We start off by generating the FlashPaper SWF and storing it into a variable. This data then gets written to a file. Normally you would <b>not</b> want to do this for every request. Once we have the FlashPaper stored, we can then reference it simply by using an IMG tag. In my example, I put the Help documentation in a different tag. The main problem  had with this example was spacing. The IMG tag's width and height attributes didn't seem to be respected by the SWF. I'm sure a reader out there will figure out why...