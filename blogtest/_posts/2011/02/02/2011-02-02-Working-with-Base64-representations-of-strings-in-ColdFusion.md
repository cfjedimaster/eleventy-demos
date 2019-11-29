---
layout: post
title: "Working with Base64 representations of strings in ColdFusion"
date: "2011-02-02T13:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/02/02/Working-with-Base64-representations-of-strings-in-ColdFusion
guid: 4104
---

Kevin pinged me earlier today with an interesting issue. He had a Base64 representation of data. Base64 is usually used to create a string representation of binary data. But did you know that you can also Base64 encode string data? In his case it was being used in some PHP code to encode layout for a blog theme. He needed to get to the original code but wasn't sure how to do that in ColdFusion. Here is what I came up with. First, start off with your Base64 string. (Note - in the code template below I'm going to add a few spaces just to make it wrap better. )

<p>

<code>
&lt;cfset b64 = 'Pz4gPC9kaXY+PCEtLSBlbmQgcGFnZSAtLT4NCgo8ZGl2I GlkPSJmb290ZXItd3JhcCI+DQoKCTxkaXYgaWQ9ImZvb3RlciIgY2xhc3 M9ImNsZWFyZml4Ij4NCgkNCgkJPHAgaWQ9ImxlZ2FsIj5Db3B5cmlnaHQ gJmNvcHk7IDIwM DggPGEgaHJlZj0iPD8gYmxvZ2lu Zm8oJ3VybCcpOyA/PiI+PD8gYmxvZ2luZm8oJ25h bWUnKTsgPz48 L2E+DQoJCSZidWxsOyA8P3BocCBpZihpc19ob21lKCkpIDogPz48YSBocmVmPSJodHRwOi8vd29yZHByZXNz dGhlbWVzYmFzZS5jb20vIiB0aXRsZT0iV29yZHByZXNzIHRlbXBsYXRlcyI+V2 9yZHByZXNzIHRlbXBsYX RlczwvYT48P3BocCBlbmRpZjsgPz4NCgkNCgk8L2R pdj4NCgk8P3BocCB3cF9mb290ZXIoKTsgPz4NCgo8L2Rpdj48IS0tIGVuZCBm b290ZXItd3Jhc CAtLT4NCgoNCjwvYm9keT4NCjwvaHRtbD4gPD8='&gt;
</code>

<p>

Ok - so now what? ColdFusion provides a toBase64 function but no "from"Base64. There is a toString function, but since Base64 is <i>already</i> a string, running toString on it doesn't do anything. However, we can convert this into binary data using toBinary:

<p>

<code>
&lt;cfset f = ToBinary(b64)&gt;
</code>

<p>

And now we have a binary representation of the Base64 string. But how do we view it? If you try to output f you will get an error. But now is the time where toString helps out:

<p>

<code>
&lt;cfset z = toString(f)&gt;
&lt;cfoutput&gt;
#htmleditformat(z)#
&lt;/cfoutput&gt;
</code>

<p>

And when output we get:

<p>

<code>
?&gt; &lt;/div&gt;&lt;!-- end page --&gt; &lt;div id="footer-wrap"&gt; &lt;div id="footer" class="clearfix"&gt; &lt;p id="legal"&gt;Copyright &copy; 2008 &lt;a href="&lt;? bloginfo('url'); ?&gt;"&gt;&lt;? bloginfo('name'); ?&gt;&lt;/a&gt; &bull; &lt;?php if(is_home()) : ?&gt;&lt;a href="http://wordpressthemesbase.com/" title="Wordpress templates"&gt;Wordpress templates&lt;/a&gt;&lt;?php endif; ?&gt; &lt;/div&gt; &lt;?php wp_footer(); ?&gt; &lt;/div&gt;&lt;!-- end footer-wrap --&gt; &lt;/body&gt; &lt;/html&gt; &lt;?
</code>

<p>

Wow that PHP code looks awesome! Anyway - I hope this helps others. This is the first I've seen of Base64 versions of strings. It seems to be used as a way to obfuscate the code. I've also heard that apparently this has been used to hack Wordpress themes as well.