---
layout: post
title: "Ask a Jedi: Dynamic expires with an image via ColdFusion"
date: "2009-01-13T15:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/01/13/Ask-a-Jedi-Dynamic-expires-with-an-image-via-ColdFusion
guid: 3193
---

George asks:

<blockquote>
<p>
Hi Ray, I have a question.  I am doing a site which is using CSS at the moment.  I am interested in stopping IE7 from doing a roundtrip to the server every time to see if my images have changed.  This causes a flash everytime you click from link to link even though the background image has not changed.  Do, you think this PHP solution could be modified for ColdFusion and IIS: <a href="http://www.explainth.at/en/tricks/flickfix.shtml">http://www.explainth.at/en/tricks/flickfix.shtml</a>
</p>
</blockquote>

Boy, am I the only happy to not be using Internet Explorer anymore?
<!--more-->
If you follow the link in the question above, it details a simple modification that can be made to Apache using .htaccess. George is on IIS and wants to know if he can mimic the solution provided in PHP. First off, do know you can set expiration headers in IIS as well. I've done that for this blog and for RIAForge as well. (And it did seem to make things quite a bit zippier!) 

That being said, if you wanted to do it via ColdFusion, it is as simple a matter as using the cfheader tag. Here is a trivial example with a hard coded expiration in 2019:

<code>
&lt;cfheader name="Expires" value="Fri, 11 Jan 2019 20:19:44 GMT"&gt;
&lt;cfset lynn = imageRead(expandPath("./presentations/cfspry/lynn.jpg"))&gt;
&lt;cfcontent type="image/jpg" variable="#imageGetBlob(lynn)#"&gt;
</code>

I don't have IE here to check, but I did confirm that Firebug saw the header when the image was requested.