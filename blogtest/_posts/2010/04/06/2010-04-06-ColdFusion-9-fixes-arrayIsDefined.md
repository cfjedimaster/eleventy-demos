---
layout: post
title: "ColdFusion 9 fixes arrayIsDefined"
date: "2010-04-06T11:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/04/06/ColdFusion-9-fixes-arrayIsDefined
guid: 3772
---

I coulda sworn I had blogged this earlier but it didn't show up on my search. This just came up in a meeting at work so I thought I'd share. ColdFusion 8 added the arrayIsDefined function. As you can probably guess it let's you check to see if an array has a value at a certain position. However, it had one pretty silly drawback. If your array was had a size of 10 and you checked position 11, you would get an error. Therefore to <i>really</i> check to see if a certain array position existed, you had to use this:
<p>
<code>
&lt;!--- assume array is called arr and N is the position you want to check ---&gt;
&lt;cfif arrayLen(arr) gte n and arrayIsDefined(arr, n)&gt;
</code>
<p>
ColdFusion 9 though fixes this. So your code can just be:
<p>

<code>
&lt;!--- assume array is called arr and N is the position you want to check ---&gt;
&lt;cfif arrayIsDefined(arr, n)&gt;
</code>

<p>

Oddly, the docs for <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7ed3.html">arrayIsDefined</a> still insist that you must stay within the bounds of the array. I'm filing a comment now.