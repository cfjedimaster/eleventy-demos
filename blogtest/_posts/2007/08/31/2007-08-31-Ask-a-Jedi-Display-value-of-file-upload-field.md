---
layout: post
title: "Ask a Jedi: Display value of file upload field"
date: "2007-08-31T16:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/31/Ask-a-Jedi-Display-value-of-file-upload-field
guid: 2318
---

Jay (my second US gov emailer today) asks:

<blockquote>
I have not done much with this so I am not sure of the best approach currently I am working on a cf7 server and I am uploading files with some code.

My users would like to be able to see the file name they chose below the upload field since the field is not long enough to display all of it at once. 
</blockquote>

My initial response was no - since I know the browser locks down those form file fields. But then I remembered that JavaScript <i>should</i> be able to read the setting. Sure enough, it can:

<code>
&lt;cfform name="foo"&gt;
&lt;cfinput type="file" name="fileone"&gt;
&lt;cfdiv bind="{% raw %}{fileone}{% endraw %}"&gt;
&lt;/cfform&gt;
</code>

Of course, he asked for a CF7 version. Here is a slightly more verbose version that should work in CF7 (or anything really, even languages on their <a href="http://www.php.net">dead bed</a>).

<code>
&lt;script&gt;
function setFilename() {
	var filefield = fileone.value;
	var output = document.getElementById('filename');
	output.innerHTML = filefield;
}
&lt;/script&gt;

&lt;cfform name="foo2"&gt;
&lt;cfinput type="file" name="fileone" onChange="setFilename()"&gt;
&lt;div id="filename"&gt;&lt;/div&gt;
&lt;/cfform&gt;
</code>