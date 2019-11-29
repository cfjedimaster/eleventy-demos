---
layout: post
title: "Unexpected behavior with Axis2 web services in ColdFusion"
date: "2014-07-10T12:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/07/10/Unexpected-behavior-with-Axis2-web-services-in-ColdFusion
guid: 5263
---

<p>
Credit for this find goes to Steve Seaquist. He and I have been discussing this over email the last few days. Ok, quiz time, look at the following CFC:
</p>
<!--more-->
<pre><code class="language-javascript">component  {

	variables.weird = 0;
	remote numeric function testWeird() {
		variables.weird++;
		return variables.weird;
	}

}</code></pre>

<p>
Imagine you are calling this CFC directly from JavaScript code. As you know, each time you call a CFC remotely, it will be created on the fly. So calling this CFC's testWeird method N times will <strong>always</strong> return 1. However, what happens if you call it as a <i>web service</i>?
</p>

<p>
If you said 1, you would be wrong. Under Axis2, the CFC is now persistent. I have no idea why. But if you make calls to the CFC as a webservice, you will see that the result increments by one every time you do so. I've got no idea what scope this is living in (my first test was early this morning, hours ago), and the only way to clear this is to edit the CFC itself. (Refreshing the WSDL also does it.) If you add <code>wsversion="1"</code> to the component tag it will use the earlier Axis library and act the right way.
</p>

<p>
Perhaps this is some known "feature" of Axis2. I did a bit of Googling but nothing really struck me as relevant. Whether good or bad, this is one of those things I did not expect (neither did Steve) so I'm blogging to warn others.
</p>

<p>
Also, don't use web services. Seriously. Unless someone is holding a gun to your head, just use simple JSON services and don't overcomplicate stuff.
</p>