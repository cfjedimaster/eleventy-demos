---
layout: post
title: "Cross-Domain AJAX calls using ColdFusion"
date: "2008-03-07T09:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/07/CrossDomain-AJAX-calls-using-ColdFusion
guid: 2695
---

This is something I've mentioned in the past, but earlier in the week I was reading an article from <a href="http://www.dzone.com">DZone</a> (which by the way is a <b>darn</b> good tech aggregator and even includes a <a href="http://coldfusion.dzone.com/">ColdFusion Zone</a>) about doing <a href="http://www.phpfour.com/blog/2008/03/06/cross-domain-ajax-using-php/">cross-domain AJAX calls in PHP</a>. It was a good article, and I thought it would be nice to quickly summarize the issue for ColdFusion developers as well. (And take this as a friendly hint for someone to submit the URL to Dzone. :)
<!--more-->
So let's quickly review what in the heck we are talking about. When you make a HTTP request via AJAX, you have to make a request to a URL in the same domain. So an HTML file at foo.com can't use AJAX to hit a resource on goo.com. (One of the cool things about AIR is that you don't have to worry about that.)

The solution (both what I suggest and what PHP Four suggests on their <a href="http://www.phpfour.com/blog/2008/03/06/cross-domain-ajax-using-php/">article</a>) is to make use of a server-side proxy. You pass information to this proxy (Hey, I want to hit url X) and the proxy makes the request for you. It then returns the data back to the browser. Let's look at a simple example.

For my JavaScript code I'm using Spry to make a simple request and output part of the response:

<code>
&lt;script src="/spryjs/SpryData.js"&gt;&lt;/script&gt;
&lt;script&gt;
function handleResult(r) {
	var resp = r.xhRequest.responseText;
	alert(resp.substring(0,250));
}

Spry.Utils.loadURL("GET","http://www.cnn.com",true,handleResult);
&lt;/script&gt;
</code>

If you run this in your browser you get nothing back in the response as the remote URL is blocked. (Unless you happen to run this at CNN. Where news happens.)

We can bypass this limitation by calling our proxy, like so:

<code>
Spry.Utils.loadURL("GET","proxy.cfm?urltarget="+escape('http://www.cnn.com'),true,handleResult);
</code>

Notice now I hit a local CFM file, proxy.cfm. I pass the requested URL along as a url variable, urltarget. Let's take a look at this script.

<code>
&lt;cfparam name="url.urltarget" default=""&gt;
&lt;cfset req = cgi.request_method&gt;

&lt;!--- if req is post, force them to have FORM fields ---&gt;
&lt;cfif req is "post" and structIsEmpty(form)&gt;
	&lt;cfset req = "get"&gt;
&lt;/cfif&gt;

&lt;cfif len(url.urltarget)&gt;
	&lt;cfhttp url="#url.urltarget#" method="#req#"&gt;
	&lt;cfif req is "post"&gt;
		&lt;cfloop item="f" collection="#form#"&gt;
			&lt;cfhttpparam type="formfield" name="#f#" value="#form[f]#"&gt;
		&lt;/cfloop&gt;
	&lt;/cfif&gt;
	&lt;/cfhttp&gt;
	
	&lt;cfoutput&gt;#trim(cfhttp.fileContent)#&lt;/cfoutput&gt;
&lt;/cfif&gt;
</code>

So what's going on here? I first param url.urltarget to ensure it exists. I then check the request method. If the value is not post, it is get (technically more versions are allowed), but for POST requests, I only want to really do a post if I was sent form data. 

I then simply perform a CFHTTP. Note that if my request was POST, I loop over the form structure and we send that form data to the remote URL. Lastly I just output the result.

In case your curious, you can do posts via Spry of course:

<code>
Spry.Utils.loadURL("POST","proxy.cfm?urltarget="+escape('http://localhost/test3.cfm'),true,handleResult, {% raw %}{postData:"x=2&y=3",headers:{ "Content-Type":"application/x-www-form-urlencoded"}{% endraw %}});
</code>

This does a POST with form.x and form.y as my values. Lastly, as is noted on the <a href="http://www.phpfour.com/blog/2008/03/06/cross-domain-ajax-using-php/">php article</a>, you probably want to look at caching the results to help performance. I'll post a followup later today with an example of this. It's an interesting issue as you have to cache based both on request type and request data. Although you may want to skip caching for form posts altogether.