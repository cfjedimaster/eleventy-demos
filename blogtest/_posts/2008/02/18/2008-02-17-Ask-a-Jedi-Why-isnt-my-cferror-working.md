---
layout: post
title: "Ask a Jedi: Why isn't my cferror working?"
date: "2008-02-18T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/18/Ask-a-Jedi-Why-isnt-my-cferror-working
guid: 2656
---

Steve asks:

<blockquote>
<p>
Huge problem I have: custom Error Handling in CF 8 doesn't work whatever I do. I use a simple Application.cfm: 

&lt;cferror type="exception"
template="ErrorException.cfm" mailto="info@mysite.com"&gt;

ErrorException.cfm exists and is NOT empty

The template generating the error is index.cfm:<br />
&lt;cfoutput&gt;#i#

Is there any other setting I have to enable/disable in CF Admin for this to work? I still get the default CF error message, nothing custom.
</p>
</blockquote>

What you have is a compiler error, or a syntax error. Consider the normal CF execution process. You request index.cfm. CF takes your ColdFusion and compiles it into Java. In your case, you have a syntax error. CF can't run your code at all - therefore - error handling can't handle it at all. The only fix for your template is to remove the syntax error. If you then ran your file and "i" was never defined, you would correctly see your error template run.

If I may be so bold (yes, I'll do), you should check out my guide on error handling:

<a href="http://www.raymondcamden.com/index.cfm/2007/12/5/The-Complete-Guide-to-Adding-Error-Handling-to-Your-ColdFusion-Application">The Complete Guide to Adding Error Handling to Your ColdFusion Application</a>. It's guaranteed to be more exciting than filing taxes!