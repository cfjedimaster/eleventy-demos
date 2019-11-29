---
layout: post
title: "XML forms and CFIMAGE"
date: "2008-04-07T17:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/04/07/XML-forms-and-CFIMAGE
guid: 2757
---

I was working with Dan Plesse on an odd issue he had with CF8 Image Captcha's and CFFORM. No matter what he did, he couldn't get the captcha to show up in the form. My first though was a broken CFIDE or some other 'special' folder, but that wasn't the case. If we viewed source on his page, there was no IMG tag at all. I finally got it down to one very simple example:
<!--more-->
<code>
&lt;cfform name="register"
        id="register"
        format="XML"
        skin="blue"
        style="border-left-style:groove; padding:0px; width:auto"
        enctype="multipart/form-data"
        action="&lt;cfoutput&gt;#CGI.script_name#&lt;/cfoutput&gt;"
        method="post"
        &gt;
  &lt;!--- Use cfformgroup to put the first and last names on a single line. ---&gt;

 &lt;cfformgroup type="vertical" label="Step 4 - captcha  "&gt;

    &lt;cfinput type="text" name="captcha_test"  value="" size="7"
label="Enter text that  you see in the image:" /&gt;
&lt;img src="http://images.pcworld.com/images/header/logo_hd.jpg"&gt;

    &lt;cfimage
       action="captcha"
       height="60"
       width="200"
       text="moon pies"
       difficulty="low"
       fonts="verdana,arial,times new roman,courier"
       fontsize="15"   /&gt;

  &lt;/cfformgroup&gt;

&lt;/cfform&gt;
</code>

I finally figured out that the issue was with the format="xml". When I removed that, it worked perfectly.

And then I did something magical. I actually read the docs on XML forms. (This is a feature in ColdFusion I've never used in production, nor have I played with it much.) The docs clearly say that any non-form items will be stripped. To keep them in...

<blockquote>
<p>
ColdFusion does not process inline text or standard HTML tags when it generates an XML form; therefore, you use
the cfformitem tag to add formatted HTML or plain text blocks and any other display elements, such as horizontal
and vertical rules, to your form.
</p>
</blockquote>

So taking the above code, we can fix it right away like so:

<code>
&lt;cfform name="register"
        id="register"
        format="XML"
        skin="blue"
        style="border-left-style:groove; padding:0px; width:auto"
        enctype="multipart/form-data"
        action="&lt;cfoutput&gt;#CGI.script_name#&lt;/cfoutput&gt;"
        method="post"
        &gt;
  &lt;!--- Use cfformgroup to put the first and last names on a single line. ---&gt;

 &lt;cfformgroup type="vertical" label="Step 4 - captcha  "&gt;

    &lt;cfinput type="text" name="captcha_test"  value="" size="7"
label="Enter text that  you see in the image:" /&gt;
&lt;img src="http://images.pcworld.com/images/header/logo_hd.jpg"&gt;

	&lt;cfformitem type="html"&gt;
    &lt;cfimage
       action="captcha"
       height="60"
       width="200"
       text="moon pies"
       difficulty="low"
       fonts="verdana,arial,times new roman,courier"
       fontsize="15"   /&gt;
	&lt;/cfformitem&gt;
	
  &lt;/cfformgroup&gt;

&lt;/cfform&gt;
</code>