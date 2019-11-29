---
layout: post
title: "Bug with ColdFusion 11's Elvis Operator"
date: "2014-09-04T18:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/09/04/Bug-with-ColdFusion-11s-Elvis-Operator
guid: 5300
---

<p>
Ok, snap quiz time, given the following code, and that url.name exists, will the UDF run?
</p>
<!--more-->
<pre><code class="language-javascript">function getfoo() {
	writeoutput("do you see me?");
	return "foo";	
}
	
u2 = encodeForHTML(url.name) ?: getfoo();
</code></pre>

<p>
Ok, time's up. If you said it wouldn't run, because, of course, it doesn't need to, then you would be wrong. Even when url.name exists, getfoo() is executed. Now, in some ways, this is consistent with cfparam's behavior. But to me, that always made sense. When I see this: <code>&lt;cfparam name="url.name" default="#getfoo()#"&gt;</code> - I always figured the compiler had to run getfoo to get the value to cfparam so cfparam could then work. Maybe you don't agree - and that's cool - but it makes sense to me.
</p>

<p>
In the case of the Elvis operator though it does <i>not</i> make sense. As an FYI, both Railo and Groovy ignore the right hand side when they don't need it.
</p>

<p>
Bug: <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3818770">3818770</a>
</p>