---
layout: post
title: "Bug with local scope, cfthread, and ColdFusion 9"
date: "2010-05-13T12:05:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/05/13/Bug-with-local-scope-cfthread-and-ColdFusion-9
guid: 3817
---

So this is a weird one. Please note that myself (and the other guys working on this) are still digging in so we may be wrong, but it appears that the use of cfthread in a CFC method, <i>along</i> with the use of local scope, is causing a bug in ColdFusion 9. For an example, see the code below.

<p>
<!--more-->
<code>
&lt;cffunction name="test"&gt;
	&lt;cfset local = structNew()&gt;

	&lt;cfthread name="doogus" action="run"&gt;
	&lt;/cfthread&gt;
	
	&lt;cfquery name="local.foo" datasource="ormtest"&gt;
	select distinct id, name
	from [user]
	&lt;/cfquery&gt;
	&lt;cfdump var="#local#"&gt;
	&lt;cfreturn valueList(local.foo.id)&gt;
&lt;/cffunction&gt;

&lt;cfoutput&gt;#test()# #now()#&lt;/cfoutput&gt;&lt;p&gt;
</code>

<p>

As you can see, I've got a method, test, than runs a thread and then does a query. Notice I use the new local scope so I don't have to var it above. Upon running this, we are seeing an error when we try to use the valueList function. The error states that the parameter passed to valueList is invalid. Even more interesting, the dump shows only arguments. 

<p>

But wait - it gets better. Both myself and Tony Nelson and others confirmed that if you run this code you will get the right result about 40% of the time. Essentially a bit less than half. On those runs, the local scope shows the query and the return runs fine. 

<p>

The fix? Don't use local.whatever. If I switch to var foo = "" and then just use foo instead of local.foo, it works.

<p>

So.... any thoughts on this? I've filed bug <a href="http://cfbugs.adobe.com/cfbugreport/flexbugui/cfbugtracker/main.html#bugId=82861">82861</a> for this.