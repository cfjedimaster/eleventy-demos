---
layout: post
title: "Numeric HTML fields, keyboards, and zip codes"
date: "2012-09-20T23:09:00+06:00"
categories: [html5,mobile]
tags: []
banner_image: 
permalink: /2012/09/20/Numeric-HTML-fields-keyboards-and-zip-codes
guid: 4735
---

Just a quick tip I want to share with folks. I had a simple form field that included two fields for zip codes. Both used type="number". While testing in iOS6, I discovered that when I entered 02180 as a zip code, Safari "fixed" it by removing the 0 in front. Ok, I guess that makes sense, but it obviously wasn't helpful. 

I switched the type to text and it fixed that issue, but it meant the keyboard display reverted to the normal text-based layout. Not a huge issue, but when I complained on Twitter, a few users chimed in with ideas. 

Peter Daams (@daamsie) suggested this: &lt;input type="text" pattern="[0-9]*"&gt;

I didn't think it was worthwhile to try this as it would still use the text keyboard. Or so I thought. Peter suggested trying it anyway so I did. 

Surprisingly - iOS actually showed the numeric keyboard. I'm not sure why - but it almost seems as if it realized that the pattern filter in place was - essentially - numbers only. 

Unfortunately, it did not work the same in Android. Peter suggested type="tel" as another workaround, but I left it as is. I find this behavior interesting though and I wanted to put this out there in case others had noticed it as well.