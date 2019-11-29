---
layout: post
title: "Using ColdFusion Ajax libraries on a remote server"
date: "2009-12-14T18:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/14/Using-ColdFusion-Ajax-libraries-on-a-remote-server
guid: 3648
---

Michael asked:

<blockquote>
<p>
So having common JavaScript files "in the cloud" and referencing them in your code as absolute urls is becoming more common. Is there a way to have CF point to the EXT-JS files hosted by a third party?
</p>
</blockquote>

My initial answer to this question was no. I knew that the ajaxImport tag supported a scriptSrc attribute. According to the docs, this specifies a folder, <i>relative to the web root</i>, where the relevant JavaScript files will be loaded. 

On a whim though, I tried a full path:

<code>
&lt;cfajaximport scriptsrc="http://www.cnn.com/foo/" tags="cfwindow" /&gt;
</code>

Surprisingly, this not only didn't throw out an error, it actually worked. By "work" of course I mean it used the URL prefix as I set it:

<code>
script type="text/javascript" src="http://www.cnn.com/foo/ajax/messages/cfmessage.js"&gt;&lt;/script&gt; 
&lt;script type="text/javascript" src="http://www.cnn.com/foo/ajax/package/cfajax.js"&gt;&lt;/script&gt; 
&lt;script type="text/javascript" src="http://www.cnn.com/foo/ajax/yui/yahoo-dom-event/yahoo-dom-event.js"&gt;&lt;/script&gt; 
&lt;script type="text/javascript" src="http://www.cnn.com/foo/ajax/yui/animation/animation-min.js"&gt;&lt;/script&gt; 
&lt;script type="text/javascript" src="http://www.cnn.com/foo/ajax/ext/adapter/yui/ext-yui-adapter.js"&gt;&lt;/script&gt; 
&lt;script type="text/javascript" src="http://www.cnn.com/foo/ajax/ext/ext-all.js"&gt;&lt;/script&gt; 
&lt;script type="text/javascript" src="http://www.cnn.com/foo/ajax/package/cfwindow.js"&gt;&lt;/script&gt; 
&lt;link rel="stylesheet" type="text/css" href="http://www.cnn.com/foo/ajax/resources/ext/css/ext-all.css" /&gt; 
&lt;link rel="stylesheet" type="text/css" href="http://www.cnn.com/foo/ajax/resources/cf/cf.css" /&gt; 
</code>

None of these URLs will actually work, but if they did, it looks as if scriptSrc would be an appropriate way to load them. I tend to get a bit anal about not following the CF docs to the letter of the law, but I can't see any reason why Adobe would <i>stop</i> this behavior.