---
layout: post
title: "Another bug with queryExecute - Threads"
date: "2014-10-09T12:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/10/09/Another-bug-with-queryExecute-Threads
guid: 5330
---

<p>
Wow, not a good morning for one of my favorite new features of ColdFusion 11. This morning I <a href="http://www.raymondcamden.com/2014/10/9/Bug-with-queryExecute--use-with-caution">reported</a> on a bug found with queryExecute by a user on StackOverflow. I did some more digging and found that if you use queryExecute inside a thread, it returns an undefined value. Here is a simple test case:
</p>
<!--more-->
<pre><code class="language-markup">&lt;cfscript&gt;
	
	data = querynew(&quot;id&quot;, &quot;varchar&quot;, [{% raw %}{id:&quot;a&quot;}{% endraw %}, {% raw %}{id:&quot;b&quot;}{% endraw %}]);
	
	cfthread(name=&quot;d1&quot;) {
		thread.result = queryExecute(&quot;select * from data&quot;, {% raw %}{}, {dbtype:&quot;query&quot;}{% endraw %});
	}
	cfthread(name=&quot;d2&quot;) {
		var result = queryExecute(&quot;select sleep(2), title from tblblogentries limit 0,1&quot;, {% raw %}{}, {datasource:&quot;myblog&quot;}{% endraw %});
		thread.foo = 1;
		thread.result = result;
	}
	cfthread(action=&quot;join&quot;,name=&quot;d1,d2&quot;);
	writedump(cfthread);
&lt;&#x2F;cfscript&gt;

&lt;cfdump var=&quot;#variables#&quot; showudfs=&quot;false&quot; &gt;
</code></pre>

<p>
In the code above I'm running two threads that use queryExecute. In the first thread the value of result is undefined. In the second thread it throws an error because result is not defined.
</p>

<p>
So, you can't use queryExecute inside a thread call. I've reported this here: <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3836820">https://bugbase.adobe.com/index.cfm?event=bug&id=3836820</a>.
</p>