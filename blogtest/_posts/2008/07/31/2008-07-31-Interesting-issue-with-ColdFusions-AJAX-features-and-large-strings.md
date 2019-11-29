---
layout: post
title: "Interesting issue with ColdFusion's AJAX features and large strings"
date: "2008-07-31T15:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/31/Interesting-issue-with-ColdFusions-AJAX-features-and-large-strings
guid: 2950
---

I was speaking with <a href="http://www.alagad.com">Doug Hughes</a> earlier today about an interesting issue he ran into. He had a cfdiv bound to a CFC method like so:
<!--more-->
<code>
&lt;cfdiv bind="cfc:test.getdata()" /&gt;
</code>

Nothing too complex here, just a simple bind. His CFC though returned a large string that just so happened to look like a number as well. Here is an example:

<code>
&lt;cffunction name="getdata" access="remote" returnType="string"&gt;
	&lt;cfreturn "12345678980123456789801234567898012345"&gt;
&lt;/cffunction&gt;
</code>

So far so good. But when he viewed the page, this is what he saw:

<blockquote>
<p>
1.2345678980123456e+37
</p>
</blockquote>

Something in the process was treating the result as a real number and turning it into exponential form. We dug a big and discovered the following tidbits:

1) If you open up Firebug you will clearly see that the conversion to number happens server side. It's the JSON conversion. You can see a simpler example of this with this code:

<code>
&lt;cfset s = "12345678980123456789801234567898012345"&gt;
&lt;cfset encoded = serializeJSON(s)&gt;
&lt;cfoutput&gt;#encoded#&lt;/cfoutput&gt;
</code>

Although this returns a slightly different result:

<blockquote>
<p>
1.2345678980123456E37
</p>
</blockquote>

So the thinking is that since CF is typeless, it's going to translate to JSON as best as it can. I tried to JavaCast thinking maybe I could force the issue, but no go.

2) The solution I proposed was to simply use another bind type:

<code>
&lt;cfdiv bind="url:test.cfc?method=getdata&returnformat=plain" /&gt;
</code>

Note the use of URL to point to the CFC. I have to provide more information (method and a return format), but for me, this worked perfectly. 

3) Unfortunately while this worked great for me, it didn't work for Doug. But personally I blame Doug. He has those shifty eyes ya know. 

Seriously though - I think if you do run into this issue, using the URL format (with the returnFormat) should help. Basically if you see a result that doesn't make sense, you want to look and see if the JSON conversion is to blame.