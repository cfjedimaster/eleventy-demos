---
layout: post
title: "Avoid Zero (or super short) Application Timeouts"
date: "2014-08-08T17:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/08/08/Avoid-Zero-or-super-short-Application-Timeouts
guid: 5283
---

<p>
So here's a doozy for you. Over the past week or so I exchanged emails with a reader who was having an odd issue with ColdFusion mappings. Specifically the code he wrote to actually use the mappings would fail to work if he used application specific mappings. Switching to mappings defined on the server fixed it.
</p>
<!--more-->
<p>
After I failed to notice it (and you can guess what's coming up based on the title of the entry), user BKBK on the Adobe forums pointed out that he had a 0-length application timeout: <code>this.applicationTimeout = createTimeSpan(0,0,0,0);</code>. Basically the application, and its settings, including the application mappings, timed out before his code could use it. 
</p>

<p>
Why did he have it in the first place? He wanted a simple way to reload the Application on every request. For that I'd simply use a hook in your onRequestStart to run onApplicationStart():
</p>

<pre><code class="language-javascript">function onRequestStart(string req) {
  onApplicationStart();
}</code></pre>

<p>
To be clear, this is <b>not</b> really reloading the application. It is just manually running your onApplicationStart method which is - 99% of the time - probably want you want. (During testing anyway, not in production.) You can also wrap that with a simple <code>if(structKeyExists(url, "init"))</code> block as well.
</p>