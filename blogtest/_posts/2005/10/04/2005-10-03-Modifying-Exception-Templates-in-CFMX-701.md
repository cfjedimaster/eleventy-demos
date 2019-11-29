---
layout: post
title: "Modifying Exception Templates in CFMX 7.0.1"
date: "2005-10-04T10:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/04/Modifying-Exception-Templates-in-CFMX-701
guid: 827
---

A while ago I posted about two techniques to modify your exception template in ColdFusion MX7. The first <a href="http://ray.camdenfamily.com/index.cfm/2005/7/14/More-CFMX-Error-Modifications">technique</a> allowed you to have automatically collapsed stack traces with Firefox, like you do with IE. Unfortunately this didn't make it into 7.0.1, so you will need to reapply the mod if you want to keep using it.
<!--more-->
The second <a href="http://ray.camdenfamily.com/index.cfm/2005/7/12/Help-CF-Help-You">modification</a> was a bit more complicated. For some reason, I tend to make a common mistake pretty often - I'll use a key from a structure where the key doesn't exist. I'm not sure why, but it's something I do. The modification I had created will notice that error, and then dump the keys of the struct. So if you try to use "FOO" where the keys are "GOO,MOO", it will be much more evident.

Well, my mod no longer works in 7.0.1. It seems that "caller", which used to point to the template causing the error, now seems to point to something else in 7.0.1. I could be wrong, but there seems to be no way to get to the template causing the error from the exception template. However, I did notice that the struct itself, the one I tried to use a bad key on, did exist in the error structure. So, I've modified my code a bit, and it seems to work fine now, but as always, use with caution. You will want to add the code block after the dump of attributes.message on lines 118-120. I've included those lines in the code block below.

<code>
            &lt;h1 id="textSection1" style="COLOR: black; FONT: 13pt/15pt verdana"&gt;
            #attributes.message#
            &lt;/h1&gt;
&lt;!--- is struct? ---&gt;
&lt;cfif findNoCase("is undefined in", attributes.message)&gt;
	&lt;cfset theVar = listLast(attributes.message," ")&gt;
	&lt;!--- get rid of period ---&gt;
	&lt;cfset theVar = left(theVar, len(theVar)-1)&gt;
	&lt;!--- container would be the struct we used. ---&gt;
	&lt;cfif structKeyExists(attributes.error, "container") and isStruct(attributes.error.container)&gt;
		&lt;cfset scope = attributes.error.container&gt;
		&lt;cfif not structIsEmpty(scope)&gt;
			Valid keys are: #listSort(structKeyList(scope),"textnocase")#
		&lt;cfelse&gt;
			#theVar# is an empty struct.
		&lt;/cfif&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;			
</code>