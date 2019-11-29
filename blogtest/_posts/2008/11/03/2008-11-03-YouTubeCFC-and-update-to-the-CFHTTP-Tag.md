---
layout: post
title: "YouTubeCFC and update to the CFHTTP Tag"
date: "2008-11-03T17:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/11/03/YouTubeCFC-and-update-to-the-CFHTTP-Tag
guid: 3079
---

For a while now the <a href="http://youtubecfc.riaforge.org">YouTubeCFC</a> component has not been able to upload videos to YouTube. While it worked fine when initially released, some engineer at YouTube decided to tighten up some code some place and that change revealed a bug with ColdFusion and CFHTTP when doing multipart form posts.

To fix this bug, Adobe has released a <a href="http://kb.adobe.com/selfservice/viewContent.do?externalId=kb406660">hot fix</a> that actually adds a new attribute to the cfhttp tag (great, the WACK is now out of date): multiparttype

Here is an example of it in use in my CFC:

<code>
&lt;cfhttp url="#theurl#" method="post" result="result" multiparttype="related"&gt;
</code>

If you try to use the CFC without the hotfix, you will get an attribute validation error for the tag. The hotfix also includes a fix for ColdFusion 7. I want to give a big thank you to Adobe's Michael Collins and the other engineers who worked with me to get this corrected. (Well basically I complained, they fixed, and I tested, so the work was all them!) 

The CFC had a bit of cleanup as well. I'm finally getting comfortable with the "Google way" of thinking when it comes to their APIs.