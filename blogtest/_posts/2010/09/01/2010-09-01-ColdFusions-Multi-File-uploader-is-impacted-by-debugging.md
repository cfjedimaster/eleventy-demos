---
layout: post
title: "ColdFusion's Multi File uploader is impacted by debugging"
date: "2010-09-01T15:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/09/01/ColdFusions-Multi-File-uploader-is-impacted-by-debugging
guid: 3930
---

Ok, so this probably falls into the realm of "Obvious", but both myself and a reader were surprised by this. Credit for it goes to John Pansewicz. He pinged me earlier this week saying that ColdFusion 9's multi file uploader failed to work for him. No matter what he uploaded he got a bad result. I tried the same code on my machine and saw nothing wrong. Then John figured out that it was ColdFusion debugging breaking the response. Again - obvious - but I tend to only worry about debugging when running against CFCs and Ajax applications. The multi file uploader is a Flash application and it just didn't occur to me that I had to be concerned about it. However - if you look at the docs for the feature (see <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSc3ff6d0ea77859461172e0811cbec22c24-7a01.html#WSe9cbe5cf462523a0fe521c212308a43ca3-7fff">here</a>) you can see that JSON must be output to the control for it to know how the files were processed. Anything that breaks that JSON (including ColdFusion debugging) will make the control think the files had an error during the upload.

Finally - don't forget that you can turn off debugging on a request by request basis. Don't think you must completely turn off the feature if you have one bit of JSON in your local project. Just make use of the cfsetting tag to disable it for that particular request.