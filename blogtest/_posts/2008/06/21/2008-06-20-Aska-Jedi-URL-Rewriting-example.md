---
layout: post
title: "Ask a  Jedi: URL Rewriting example"
date: "2008-06-21T08:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/21/Aska-Jedi-URL-Rewriting-example
guid: 2893
---

Shane asks:

<blockquote>
<p>
Appreciate all your posts on the isapi URL rewrite component however I am unable to find any information online pertaining to what I want to do with it.

I'd like to accomplish the http://www.site.com/user URL which myspace and flickr have. where /user would be user.cfm?user=shane or whatever.

I'd rather avoid using the onMissingTemplate hack and use the rewriter for this, I've been fiddling for a while.
</p>
</blockquote>
<!--more-->
Before I begin - note that what I say here pertains to both IIS rewriting as well as Apache rewriting. So to begin with, the rule in question is rather simple. All you want to do is replace /X with /user.cfm?user=X. I used this rule in Apache:

<code>
RewriteRule ^/([A-Za-z0-9]+)$ /user.cfm?user=$1 [PT]
</code>

This may not be the best rule but it seemed to work well for me. Basically it matches /anynumberletter(end of url). It then forwards the request to user.cfm and appends the value of anynumberofletter to the url scope.

I believe in taking baby steps, so this is what I wrote for user.cfm:

<code>
&lt;cfdump var="#url#"&gt;
</code>

I did some quick tests and ensure the URL scope was being set right. 

Now at this point what you do is really dependent on your application. If we assume usernames are unique (I certainly hope so), you want to look up the user record based on the username. Once you have that, you can do whatever you want of course. Greet the user by name, show their favorite background color, or whatever. While not using URL Rewriting, RIAForge does this with it's *.riaforge.org url syntax. (You can download the code base for RIAForge <a href="http://www.raymondcamden.com/index.cfm/2007/7/11/You-want-some-RIAForge-source-You-got-some-RIAForge-source">here</a>.)  Another example of this is CFLib. It uses the form: http://www.cflib.org/udf/isemail. You can download the code base for that as well (from this <a href="http://www.coldfusionjedi.com/index.cfm/2008/6/10/More-on-CFLib-update-Transfer-specifics">entry</a>). 

I hope this answers your question.