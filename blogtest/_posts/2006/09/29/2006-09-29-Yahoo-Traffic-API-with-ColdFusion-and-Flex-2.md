---
layout: post
title: "Yahoo Traffic API with ColdFusion and Flex 2"
date: "2006-09-29T13:09:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2006/09/29/Yahoo-Traffic-API-with-ColdFusion-and-Flex-2
guid: 1565
---

I've talked before about how much I love Flex 2. While I still have trouble remembering the syntax and API at times, I love how it is just as RAD as ColdFusion. How RAD is it? I tend to wake up pretty early. This morning I had a good hour before the kids woke up for school. In that time I took my <a href="http://ray.camdenfamily.com/index.cfm/2006/9/28/Yahoo-Traffic-Example">Yahoo Traffic API</a> sample and turned it into a quick little CFC. I then built the UI you see below. It is a bit big so you may need to increase your resolution a bit. As always - don't hate me because my UI skills suck.
<!--more-->
<script src="/js/AC_OETags.js" language="javascript"></script>
<script language="JavaScript" type="text/javascript">
	AC_FL_RunContent(
		"src", "/demos/yahootraffic/bin/yahootraffic",
		"width", "600",
		"height", "725",
		"align", "middle",
		"id", "yahootraffic",
		"quality", "high",
		"bgcolor", "#869ca7",
		"name", "yahootraffic",
			"allowScriptAccess","sameDomain",
		"type", "application/x-shockwave-flash",
		"pluginspage", "http://www.adobe.com/go/getflashplayer"
	);
// -->
</script>

This is one hour of work folks. I've attached the source to this blog entry. As with my other demos, I changed the app ID used in the CFC. That should really be passed in by Flex. I also didn't make the image sizes for maps configurable via the client, but hey, it was a quick demo!<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fyahootraffic%{% endraw %}2Ezip'>Download attached file.</a></p>