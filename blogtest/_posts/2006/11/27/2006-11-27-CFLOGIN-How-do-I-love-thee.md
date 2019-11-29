---
layout: post
title: "CFLOGIN, How do I love thee..."
date: "2006-11-27T17:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/11/27/CFLOGIN-How-do-I-love-thee
guid: 1678
---

So this weekend, <a href="http://www.brucephillips.name/blog">Bruce Phillips</a> pointed out on my last <a href="http://ray.camdenfamily.com/index.cfm/2006/11/25/Last-build-of-my-Flex-2ColdFusion-Security-Homework">Flex Homework</a> post that he only needed to run the CFLOGIN tag once in his Flex application. My code was running it for every hit in the onRequestStart method.
<!--more-->
So this really bugged me because it was my understanding that ColdFusion had to run the CFLOGIN tag during a request to "enable" Roles Based Security. I knew that ColdFusion would skip the stuff inside - but from what I had remembered, CF had to actually <i>encounter</i> the tag to use Roles Based Security for the test.

But when I tested what Bruce had done in his Flex app, it worked as he had said. I was truly perplexed. Then I did a test:

<code>
&lt;cfapplication name="goobercflogin" sessionManagement="true"&gt;

&lt;cflogin&gt;
	&lt;cfloginuser name="ray2" password="ray" roles="admin"&gt;
&lt;/cflogin&gt;
&lt;cfoutput&gt;#getAuthUser()#&lt;/cfoutput&gt;

&lt;cfif isUserInRole("admin")&gt;
&lt;p&gt;
yes, admin role
&lt;/p&gt;
&lt;/cfif&gt;
</code>

I ran this - and then ran it again with the cflogin block commented out - and it worked just fine. Bruce was definitely right. But then I tried this:

<code>
&lt;cfapplication name="goobercflogin2" sessionManagement="true" loginStorage="session"&gt;

&lt;cflogin&gt;
	&lt;cfloginuser name="ray2" password="ray" roles="admin"&gt;
&lt;/cflogin&gt;


&lt;cfoutput&gt;#getAuthUser()#&lt;/cfoutput&gt;

&lt;cfif isUserInRole("admin")&gt;
&lt;p&gt;
yes, admin role
&lt;/p&gt;
&lt;/cfif&gt;
</code>

Notice the loginStorage? That tells ColdFusion to use the session scope for the authentication. Now in theory, this should ONLY change the storage method for the authentication information. But when you comment out CFLOGIN, you no longer get a value for getAuthUser and the roles check failed.

I'll wrap with one final word: Ugh.