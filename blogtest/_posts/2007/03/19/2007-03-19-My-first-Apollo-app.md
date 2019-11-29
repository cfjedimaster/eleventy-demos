---
layout: post
title: "My first Apollo app"
date: "2007-03-19T15:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/03/19/My-first-Apollo-app
guid: 1903
---

Here is my first little Apollo application. I based it on the <a href="http://blog.everythingflex.com/2007/03/19/html-control/">blog entry</a> written by Rich Tretola. The code is rather simple:

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:ApolloApplication xmlns:mx="http://www.adobe.com/2006/mxml" layout="absolute"&gt;

&lt;mx:VDividedBox width="100{% raw %}%" height="100%{% endraw %}"&gt;
	
	&lt;mx:Panel title="Source" width="100{% raw %}%" height="50%{% endraw %}"&gt;

		&lt;mx:TextArea id="source" width="100{% raw %}%" height="100%{% endraw %}" /&gt;
		
	&lt;/mx:Panel&gt;
	
	&lt;mx:Panel title="HTML" width="100{% raw %}%" height="50%{% endraw %}"&gt;
		
		&lt;mx:HTML id="html" htmlText="{% raw %}{source.text}{% endraw %}" width="100{% raw %}%" height="100%{% endraw %}"/&gt;

	&lt;/mx:Panel&gt;

&lt;/mx:VDividedBox&gt;

&lt;/mx:ApolloApplication&gt;
</code>

All I did was bind an HTML control, part of the Apollo framework, to a text area. This is a handy way to quickly test the HTML support for the control. If you want to play with this, first ensure you have the Apollo runtime, then download the AIR file included on this blog entry.

p.s. My friend Scott told me he had issues downloading the attachment. I'd like to blame him (he is so easy to blame!), but it looks like my web server was blocking the extension. I renamed it to a zip.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FHTMLEditor%{% endraw %}2Eair%2Ezip'>Download attached file.</a></p>