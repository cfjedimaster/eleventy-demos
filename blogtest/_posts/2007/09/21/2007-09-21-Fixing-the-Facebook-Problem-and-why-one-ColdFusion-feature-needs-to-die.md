---
layout: post
title: "Fixing the Facebook Problem, and why one ColdFusion feature needs to die..."
date: "2007-09-21T18:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/21/Fixing-the-Facebook-Problem-and-why-one-ColdFusion-feature-needs-to-die
guid: 2365
---

I spent some time today working with Anthony Webb and <a href="http://www.bennadel.com/blog/recent-blog-entries.htm">Ben Nadel</a> on a rather interesting problem. Anthony was trying to build a Facebook application. (More info may be found at the <a href="http://www.houseoffusion.com/groups/cf-talk/thread.cfm/threadid:53506">cftalk thread</a>.) Facebook's test application sends a form POST to the file you want to respond to it's request. This form POST includes a set of form variables. Here are two of the variables:
<!--more-->
FB_SIG
FB_SIG_TIME

Among other variables as well. The problem was though that he would get an error whenever the POST was made. Why? Well, there is an <i>ancient</i> ColdFusion feature that lets you do form validation with specifically named form fields: 

<a href="http://livedocs.adobe.com/coldfusion/8/htmldocs/help.html?content=validateData_10.html">Validating form fields using hidden form fields</a>

No one uses this feature. Seriously - no one. In fact, the only time you hear it mentioned is when someone accidentally names a form field wrong and trips this validation. When I said in the blog title that this was a feature that needed to die - I was only being partially sarcastic. I hope that ColdFusion 9 will either dump this "feature" or at least let us turn it off with a Application.cfc variable. (I know ColdFusion is all about the backwards compatibility, but come on, it's time to dump this along with parameterExists!)

Ok - so enough ranting. We can't turn it off - so what do we do? Well the first thing I tried was a check in onRequestStart. Nope - even though this is supposedly "before" the request, it isn't before ColdFusion's magical form check. I then tried onRequest. No dice there.

So I knew that there was a cferror tag just for this type of error - so I tried onError. Success! I was able to trap this error and check for a Facebook post and then simply include the file to handle the request:

<code>
&lt;cffunction name="onError" returnType="void" output="true"&gt;
	&lt;cfargument name="exception" required="true"&gt;
	&lt;cfargument name="eventname" type="string" required="true"&gt;
	&lt;!--- look for FB post ---&gt;
	&lt;cfif findNoCase("Form entries are incomplete or invalid", arguments.exception.message)
		and
	      structKeyExists(form, "fb_sig")&gt;
		&lt;cfinclude template="testi.cfm"&gt;
		&lt;cfreturn&gt;
	&lt;/cfif&gt;				
	&lt;cfdump var="#arguments#"&gt;
&lt;/cffunction&gt;
</code>

This worked fine, but was a bit ugly. Here is where Ben Nadel came up with his solution. Apparently if you muck with the Form scope in the Application.cfc constructor, you can fix the problem. Remember that the constructor is any area outside of the methods. So by just adding this for example:

<code>
&lt;cfset structDelete(form, "fb_sig")&gt;
</code>

The problem would go away... along with the form field. I liked this solution better than my onError code, so wrote up a quick UDF that could be called from the constructor area. My thinking was that this would keep your constructor area a bit more tidier.

So now you can add: 

<code>
&lt;cfset fixFacebook()&gt;
</code>

And run the method I wrote. But here is where things got wonky. For my solution I decided to simply rename all form keys from FOO to FOO_X. I didn't need to rename them all, but I figured doing them all would make it simpler. My code though continued to throw the error. I dumped the form scope and saw that all my fields were renamed, but I still got NPEs with the form validation. Freaky.

So I then changed to setting the old form fields to an empty string, and that for some silly reason worked. Here is what I ended up with:

<code>
&lt;cffunction name="fixFacebook" returnType="void" output="false" hint="Attempt to fix a facebook post."&gt;
	&lt;cfset var f = ""&gt;
	&lt;!--- detect if FB is posting to us ---&gt;
	&lt;cfif structIsEmpty(form)&gt;
		&lt;cfreturn&gt;
	&lt;/cfif&gt;
	&lt;!--- check for one key now- maybe check for more later? ---&gt;
	&lt;cfif structKeyExists(form, "FB_SIG")&gt;
		&lt;!--- loop through and rename all to _x ---&gt;
		&lt;cfloop item="f" collection="#form#"&gt;
			&lt;cfset form[f & "_x"] = form[f]&gt;
			&lt;cfset form[f] = ""&gt;
		&lt;/cfloop&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;
</code>

Maybe overkill a bit - but I'm the kind of guy who would probably write a method to cross the street.

Anthony correctly then made all of this a lot simpler with this code snippet, no UDF, but nice and tight and works fine with Facebook:

<code>
&lt;cfif structKeyExists(form, "FB_SIG")&gt;
&lt;cfset form.FB_SIG_FIX = form.FB_SIG&gt;
&lt;cfset form.FB_SIG = ''&gt;
&lt;/cfif&gt; 
</code>

So - anyone writing Facebook applications in ColdFusion yet? I think I may give it a whirl now.

p.s. So I obviously named my title a bit over the top - but this weekend I'll be blogging on something I saw on <a href="http://www.dzone.com">DZone</a> - specifically - what features should be avoided in ColdFusion. Maybe none should be. Maybe you have you own pet peaves. Think about it and be ready to post.