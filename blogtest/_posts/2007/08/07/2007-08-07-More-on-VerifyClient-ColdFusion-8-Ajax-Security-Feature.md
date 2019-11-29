---
layout: post
title: "More on VerifyClient - ColdFusion 8 Ajax Security Feature"
date: "2007-08-07T12:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/07/More-on-VerifyClient-ColdFusion-8-Ajax-Security-Feature
guid: 2257
---

A couple of days ago I wrote a blog entry on ColdFusion 8's Ajax security features:

<a href="http://www.raymondcamden.com/index.cfm/2007/7/31/ColdFusion-8-Ajax-Security-Features">ColdFusion 8 Ajax Security Features</a>

I did some more playing around with verifyClient and wanted to share a few interesting tidbits.

First - verifyClient runs where you put it in your file. Ok, that sounds obvious, but you want to remember to put it on top of your file. If you have...

<code>
&lt;cfset doSomethingSecure()&gt;
&lt;cfset verifyClient()&gt;
</code>

Then your doSomethingSecure() <i>will</i> run before the security check is made. Again - this is probably obvious, but you want to keep it in mind. As an interesting example, you can try/catch the check and log non-Ajax requests:

<code>
&lt;cfoutput&gt;hi, #cgi.query_string#&lt;/cfoutput&gt;

&lt;cftry&gt;
	&lt;cfset verifyClient()&gt;
	&lt;cfcatch&gt;
	&lt;cflog file="ajaxsec" text="Requested ajax page in non ajax fashion"&gt;
	&lt;cfrethrow&gt;
	&lt;/cfcatch&gt;
&lt;/cftry&gt;

&lt;p&gt;
got past the VC
&lt;/p&gt;
</code>

Notice the use of cfrethrow. This ensures the error gets fired again after I've done my log.

Now for the second item to note. I wanted to investigate a bit how secure the test is. The first thing I did was build a page using the code above as test.cfm. I then built test2.cfm as:

<code>
&lt;cfdiv bind="url:test.cfm" /&gt;
</code>

I ran the code in Firefox and noted that it ran as expected. I then used Firebug to check out the HTTP request. It looked like so (I'm adding a space between the url params to help it wrap better):

http://localhost/test.cfm?_cf_containerId=cf_div1186500510058 &_cf_nodebug=true&_cf_nocache=true &_cf_clientid=143760EA10A0D8188ACF5DB88765663E &_cf_rc=0

So on a whim, I copied the URL and pasted it into a new tab.  And it worked! That was surprising. I pasted the same URL into Safari and got the error I got before. I then pointed Safari at test2.cfm. I noticed that test.cfm was loaded with the same URL, but a different _cf_clientid. (There is no Firebug for Safari, so I just modified test.cfm to output the cgi.query_string.) I pasted this URL into Safari and it worked fine as well.

So the take away from this is - verifyClient will only be secure if a user does a "proper" Ajax request first. After that they can request the URL directly as long as their session is active. Considering the nature of HTTP in general I think this is fine, but wanted to be sure people were aware.