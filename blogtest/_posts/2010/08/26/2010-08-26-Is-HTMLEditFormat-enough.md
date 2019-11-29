---
layout: post
title: "Is HTMLEditFormat enough?"
date: "2010-08-26T14:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/08/26/Is-HTMLEditFormat-enough
guid: 3923
---

Patrick asks:
<p>
<blockquote>
You schooled me on using vars in my cfc to help ratchet up the security. If I used the following code in my cfc that processes my contact form, do you feel like the data would be cleansed and relatively benign? I'm also using cfparams in the page with the form and validating it with jQuery and/or CF server side code (for non Java visitors) as well.
<br/><br/>
&lt;cfargument name="email" type="string" required="yes"&gt;<br/>
&lt;cfargument name="fullname" type="string" required="yes"&gt;<br/>
<br/>
&lt;cfset var elements = structNew()&gt;<br/>
&lt;cfset elements.email = htmlEditFormat(trim(arguments.email))&gt;<br/>
&lt;cfset elements.fullname = htmlEditFormat(trim(arguments.fullname))&gt;<br/>
</blockquote>
<!--more-->
Awesome question - and to be honest - my initial response going to be sure - that's good enough. But I knew there was a bit more to it. I decided to hit up <a href="http://www.petefreitag.com">Pete Freitag</a>. As far as I'm concerned Pete is the leading expert in the area of ColdFusion and security. He had a great response to this that I think makes it very clear that htmlEditFormat may <b>not</b> be enough.

<blockquote>
The answer is, it depends. It depends on where the variables are
outputted. There are 5 different places the variable could be output
on a web page, and each has different encoding methods that are
required.
<br/><br/>
HTML Body: &lt;p&gt;#elements.email#&lt;/p&gt;<br/>
HTML Attribute &lt;a href="mailto:#elements.email#">...&lt;/a&gt;<br/>
JavaScript: &lt;a onclick="doIt(#elements.email#);">.../a&gt; or
&lt;script&gt;var email = #elements.email#&lt;/script&gt;<br/>
CSS: &lt;div style="color:#url.color#" /&gt;<br/>
URL: &lt;a href="page.cfm?email=#elements.email#"&gt;...&lt;/a&gt;<br/>
<br/><br/>
See Slides 56-61 in my presentation Writing Secure CFML:
<a href="http://www.petefreitag.com/item/759.cfm">http://www.petefreitag.com/item/759.cfm</a>
<br/><br/>
So HTMLEditFormat is only considered safe in the HTML Body, in other
contexts such as the HTML Attribute it may allow for XSS (depending on
the quotes of the attribute, and how strict the browser is about
quotes), keep in mind the HTMLEditFormat doesn't escape single quotes
so if you have &lt;div id='#HTMLEditFormat(url.id)#'&gt; you can simply pass
in ?id=1'+onmouseover='badStuff();'
<br/><br/>
The ESAPI is a really good way to encode variables to handle all the
contexts (mentioned in my slides).
</blockquote>

<p>

Excellent response, Pete. As I said, I had an inkling to what the issue was but he spelled it out perfectly. I think most of us consider the HTML Body context, but not the other ones. Handling this then requires a <b>very</b> firm understanding of how your data is actually used.