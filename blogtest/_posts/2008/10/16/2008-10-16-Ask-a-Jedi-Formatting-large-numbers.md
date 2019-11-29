---
layout: post
title: "Ask a Jedi: Formatting large numbers"
date: "2008-10-16T22:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/10/16/Ask-a-Jedi-Formatting-large-numbers
guid: 3056
---

This wasn't technically a 'Ask a Jedi' question but was posted to my <a href="http://www.raymondcamden.com/forums/messages.cfm?threadid=07898188-19B9-E658-9D6661C09F2AF2F6">forums</a>. The question was - how can we convert numbers into smaller versions? The examples given by the user were:

123,000 to 123K<br />
123,000,000 to 123M<br />
123,000,000,000 to 123B<br />

I checked <a href="http://www.cflib.org">CFlib</a> of course, and the closest thing I found was <a href="http://www.cflib.org/udf/ByteConvert">ByteConvert</a>. I played around a bit and came up with the following UDF:
<!--more-->
<code>
&lt;cfscript&gt;
function formatKMB(x) {
	if(x &lt; 1000) return x;
	if(x &gt;= 1000 && x &lt; 1000000) {
    	x = x/1000;
        x = round(x);
        return x & "K";
    }
    if(x &gt;= 1000000 && x &lt; 1000000000) {
    	x = x/1000000;
        x = round(x);
        return x & "M";
    }
    if(x &gt;= 1000000000 && x &lt; 1000000000000) {
    	x = x/1000000000;
        x = round(x);
        return x & "B";
    }
	return x;
}
&lt;/cfscript&gt;
</code>

It's probably a bit more verbose then it needs to be but it handles numbers in the thousands (Ks), millions (Ms), and billions (Bs). I wrote up a quick test to see if it worked:

<code>
&lt;cfset tests = "900,1002,1932,123000,432000,1000000,92000000,102000000000,2321903211"&gt;
&lt;cfloop index="t" list="#tests#"&gt;
	&lt;cfoutput&gt;
    #t#=#formatKMB(t)#&lt;br /&gt;
    &lt;/cfoutput&gt;
&lt;/cfloop&gt;
</code>

I'll post this to CFLib a bit later. First I'm going to remove the CF8 stuff (&lt;, &gt;) so it will work CF5 and higher.