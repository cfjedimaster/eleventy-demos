---
layout: post
title: "ColdFusion Function IsValid Bug"
date: "2005-07-31T17:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/07/31/ColdFusion-Function-IsValid-Bug
guid: 657
---

The following information was sent to me by Baz (he didn't send a last name, so for now I'm assuming he is an eccentric rock star looking to change careers and become a web developer). As you know, or may not know, CFMX7 added a cool new function called <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000534.htm">isValid()</a>. isValid lets you do all kinds of nice checking on strings. For example:

<div class="code"><FONT COLOR=MAROON>&lt;cfif not isValid(<FONT COLOR=BLUE>"email"</FONT>, form.email)&gt;</FONT><br>
  <FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>Enter a valid email address, you wanker!<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfif&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;cfif not isValid(<FONT COLOR=BLUE>"ssn"</FONT>, form.ssn)&gt;</FONT><br>
  <FONT COLOR=MAROON>&lt;cfoutput&gt;</FONT>Yes, I know social security won't be around when<br>
you retire, but you must still enter a valid SSN!<FONT COLOR=MAROON>&lt;/cfoutput&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfide&gt;</FONT></div>

The two examples above show logic that would have been possible only with complex regex checks in the past. As you can imagine, the style above is somewhat simpler.

One of the isValid checks is for integers. An integer is a positive or negative whole number. So 42 is an integer, but 3.14159. What Baz discovered, however, was that the integer check was a bit too loose. Consider these four checks:

isValid("Integer","500,000")<br>
isValid("Integer","500,0")<br>
isValid("Integer","$500,000")<br>
isValid("Integer","$500,000$")<br>

Looking at the code above, I'd assume they would all return false. However - all four evaluate to true! Now - as we all know, ColdFusion is a bit loose when it comes to variables. That's part of the whole RAD aspect, and frankly I don't want to start a thread on that being good or not. That being said, I think both Baz and I agree that the assumption is that isValid would be more strict. It is certainly strict when doing a numeric check. 

So if you do want to verify that a value is a proper integer, what do you do? I suggested a regex check:

isValid("regex", "101", "^-{% raw %}{0,1}{% endraw %}[1-9]+[\d]*")

while Baz suggested a two-thronged approach:

isNumeric(OrderID) AND isValid("Integer",OrderID)

Personally, I like mine better, but who doesn't like their own code. Certainly the second one is probably a bit easier to read. 

p.s. I've already logged a bug on this.