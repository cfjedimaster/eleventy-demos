---
layout: post
title: "ColdFusion 101: Looping over Months"
date: "2005-09-05T09:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/05/ColdFusion-101-Looping-over-Months
guid: 753
---

A reader asks, "Is it possible to to loop through the remaining months of the current year and then show those in a form select field?" I like this question because a) it is simple and b) it is a nice "real world" type question that people are likely to encounter while working on a web site. Let's take a simpler approach and first show how to make a drop down containing <i>all</i> the months:

<div class="code"><FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;form&gt;</FONT></FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;select name=<FONT COLOR=BLUE>"month"</FONT>&gt;</FONT></FONT><br>
<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"x"</FONT> from=<FONT COLOR=BLUE>"1"</FONT> to=<FONT COLOR=BLUE>"12"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"#x#"</FONT>&gt;</FONT></FONT>#monthAsString(x)#<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/select&gt;</FONT></FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/form&gt;</FONT></FONT></div>

The only real ColdFusion in this form is the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000589.htm">MonthAsString()</a> function. As you can imagine, it takes the number of a month and returns the name of the month. Once again, I could have easily typed out all 12 month names, however, this solution will be automatically localized in non-English environments. To see an example of this, simply add &lt;cfset setLocale("fr_FR")>\&gt; as the line in the code above. 

So, let's now modify the code to work as the reader desired. The logic is - show the <i>remaining</i> months of the year. To me, that means every month after now. It also means that in December, we show nothing. I'll show the code first, then describe it.

<div class="code"><FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;form&gt;</FONT></FONT><br>
<FONT COLOR=MAROON>&lt;cfif month(now()) is<FONT COLOR=BLUE> 12</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;Sorry, but you cannot select a month.<br>
<FONT COLOR=MAROON>&lt;cfelse&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfset startMonth = month(now()) + 1&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;select name=<FONT COLOR=BLUE>"month"</FONT>&gt;</FONT></FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfloop index=<FONT COLOR=BLUE>"x"</FONT> from=<FONT COLOR=BLUE>"#startMonth#"</FONT> to=<FONT COLOR=BLUE>"12"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT><FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;option value=<FONT COLOR=BLUE>"#x#"</FONT>&gt;</FONT></FONT>#monthAsString(x)#<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/option&gt;</FONT></FONT><FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;/cfloop&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/select&gt;</FONT></FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<FONT COLOR=NAVY><FONT COLOR=FF8000>&lt;/form&gt;</FONT></FONT></div>

The first thing of interest here is the &lt;cfif&gt; block. We use the <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000588.htm">Month</a> function to determine if this is December. If so, we output a message to the user. If it isn't December, we create a variable equal to the current month's number plus one. We then slightly modify the &lt;cfloop&gt; to range from that new number to 12. 

p.s. Would you believe spammers are actually using the "Ask a Jedi" form to send me spam? I truly think there is a special place in Hell for these folks.