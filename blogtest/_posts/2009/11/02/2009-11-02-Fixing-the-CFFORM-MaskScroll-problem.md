---
layout: post
title: "Fixing the CFFORM Mask/Scroll problem"
date: "2009-11-02T18:11:00+06:00"
categories: [coldfusion,javascript]
tags: []
banner_image: 
permalink: /2009/11/02/Fixing-the-CFFORM-MaskScroll-problem
guid: 3585
---

Dave asks:

<blockquote>
I have a question regarding <cfinput> masks.
<br/><br/>
I'm using <cfform> which includes a few phone number entry fields. I'm applying a mask of "999-999-9999" (since it's all US phone numbers).  The resulting HTML includes a CF generated script that focuses the cursor on any fields that contain a mask in order to apply it to the initial value.
<br/><br/>
Is there a way to disable this but retain the mask?  My client is saying that the page "jumps" to the phone number fields instead of loading at the top of the page.
</blockquote>
<!--more-->
I wasn't quite sure what Dave meant, but I saw it quickly enough when I whipped up this demo:

<code>
&lt;h1&gt;Ray&lt;/h1&gt;
&lt;cfoutput&gt;#repeatString("&lt;br/&gt;",120)#&lt;/cfoutput&gt;

&lt;cfform name="form"&gt;
Telephone: &lt;cfinput type="text" name="tel" mask="999-999-9999"&gt;
&lt;/cfform&gt;
</code>

So this is a bit contrived, but it definitely shows the issue. On load, you will be scrolled down to the telephone. When I viewed source I could see the focus() calls added by CFFORM. From what I saw, if I were to have multiple fields with masks, I would probably end up at the lowest possible form field. 

My fix was simple - and it seemed to work ok. I simply ran code on page load to scroll back to the top:

<code>
&lt;html&gt;
&lt;head&gt;
&lt;script&gt;
function init() {
	window.scrollTo(0,0)
}
&lt;/script&gt;
&lt;/head&gt;

&lt;body onload="init()"&gt;
&lt;h1&gt;Ray&lt;/h1&gt;
&lt;cfoutput&gt;#repeatString("&lt;br/&gt;",120)#&lt;/cfoutput&gt;

&lt;cfform name="form"&gt;
Telephone: &lt;cfinput type="text" name="tel" mask="999-999-9999"&gt;
&lt;/cfform&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

I thought this would result in a 'jump' effect, but it seemed to just load and stay on top for me (FireFox 3.5).