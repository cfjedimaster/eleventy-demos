---
layout: post
title: "Ask a Jedi: Having CFCHART Links in a new window"
date: "2008-03-11T13:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/03/11/Ask-a-Jedi-Having-CFCHART-Links-in-a-new-window
guid: 2702
---

Dez asks:

<blockquote>
<p>
I have a chart that I want to link to another application in order to drill down further.  Do you know how to setup the links within a chart to open into a new window.
</p>
</blockquote>

Turns out this is rather trivial, and even explained in the docs. CFCHART takes a URL attribute. You can supply a URL to hit along with 3 custom variables: $ITEMLABEL$, $SERIESLABEL$, and $VALUE$. When clicked, the code will translate these three variables based on where you click. What you may not realize is that you can easily use a JavaScript URL:

<code>
&lt;cfchart url="javascript:newWin('$ITEMLABEL$','$SERIESLABEL$','$VALUE$')"&gt;
</code>

In this example, each click will result in a call to newWin, passing the values along:

<code>
&lt;script&gt;
function newWin(itemlabel,serieslabel,value) { 
	alert(itemlabel + ' ' + serieslabel + ' ' + value);
}
&lt;/script&gt;
</code>

In my sample above I just alerted the values, but you could easily open a new window. Or use one of the new ColdFusion 8 Ajax features to load detailed information inside a cfdiv.