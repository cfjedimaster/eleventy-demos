---
layout: post
title: "Datalist support in Mobile Chrome"
date: "2014-09-18T07:09:00+06:00"
categories: [html5]
tags: []
banner_image: 
permalink: /2014/09/18/Datalist-support-in-Mobile-Chrome
guid: 5311
---

<p>
iOS8 launched yesterday and it has <i>damn</i> good updates in mobile Safari. I strongly suggest folks read Max Firtman's detailed review here: <a href="http://www.mobilexweb.com/blog/safari-ios8-iphone6-web-developers-designers">iOS 8 and iPhone 6 for web developers and designers: next evolution for Safari and native webapps</a>. One thing missing, however, is support for <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist">datalist controls</a>. I've blogged about them before and I really like how simple they make basic autocomplete controls. I noticed over on the <a href="http://caniuse.com/#search=datalist">CanIuse page for datalist</a> that Android 4.4.3 and higher now support it. Here are some screen shots of it in action. Honestly it looks pretty much as you might expect, but I wanted to see for myself.
</p>
<!--more-->
<p>
In this first screen shot, note there are not any initial indicators that the field will have autocomplete. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot1a.png" class="bthumb" />
</p>

<p>
As soon as you click into the field, a downward triangle UI appears. This provides a hint that the field will autocomplete.
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot2a.png" class="bthumb" />
</p>

<p>
At this point, you can click the triangle for a complete list:
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot3a.png" class="bthumb" />
</p>

<p>
That list is scrollable of course. Typing a few letters provides a shorter version:
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot4a.png" class="bthumb" />
</p>

<p>
So... cool. However - in my testing I did see one instance where the UI of the list was rendered at the top of the viewport - not attached to the control at all. Clicking away and then back on the control corrected it. I'm not sure how bad of an issue that is but keep it in mind. I tried another demo from my blog post on <a href="http://www.raymondcamden.com/2012/6/14/Example-of-a-dynamic-HTML5-datalist-control">dynamic datalist controls</a> and one difference there was that I never got the initial dropdown triangle. However - my control in the demo is initially blank until you begin typing so that makes some sense. 
</p>