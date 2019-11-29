---
layout: post
title: "When does it make sense to \"mess\" with your search engine?"
date: "2007-12-13T09:12:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2007/12/13/When-does-it-make-sense-to-mess-with-your-search-engine
guid: 2539
---

For most folks, their search engine is a black box. They write the code using either a SQL statement, a Verity search, or perhaps handing it off to Google, and that's it. But this isn't always a good idea. This week I had two examples of this.

The first is at <a href="http://www.adobe.com">Adobe.com</a>. While a lot of people have talked about the new UI (frankly I don't think I'm qualified to talk about UI, or CSS, or design, you get the picture), I want to talk about their search engine. If you search for ColdFusion, you end up <a href="http://www.adobe.com/cfusion/search/index.cfm?loc=en_us&term=coldfusion">here</a>. In case the results change, here is a screen shot:

<img src="https://static.raymondcamden.com/images/Picture 7.png">

Notice that ColdFusion 6 comes before ColdFusion 8. Also notice a Buy Now link for 6, but not 8. I'm not pointing this out as a bad thing for ColdFusion, or as a huge mistake on Adobe's part, but is a great example of how search pages may not return what you want. I searched for Flash and Photoshop. Both of them had the main product page as the first result. Flex's first result was the support center. That's better than showing an old version, but I'd probably want to ensure all my products show the main product page (with a buy link) for the first result.

The second example I have is a client I can't link to - but had a similar issue. They were using Verity for their search, and found that most users would search for their product names using X Y, where their real product was named XY. Verity treated X Y as a phrase, so the results weren't great. My work was to simply do a rewrite based on their main products.

Ok so what's my point? Here are a few things I'd like people to think about (and comment on):

<ul>
<li>Outside of basic testing, and formatting, have you actually <i>used</i> your search engine? Have you searched for your products, which, for a business, is critical?
<li>If your search engine isn't returning what you want, what methods have you done to correct it? For my client it was a simple matter of "munging" the search string a bit. Have others done this? Or have you perhaps modified the result set?
<li>Lastly, how often do you look over search stats? Do you even keep search stats? Keeping a list of top ten search results is nice - but do you actually test those search results to see what your visitors are seeing?
</ul>