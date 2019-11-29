---
layout: post
title: "Quick - look at the dumb mistake on ColdFusionBloggers.org"
date: "2007-08-01T10:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/08/01/Quick-look-at-the-dumb-mistake-on-ColdFusionBloggersorg
guid: 2242
---

Thanks to Todd Sharp, I discovered I made a pretty dumb mistake on <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers.org</a>. I almost didn't blog this as it is so much a beginners type mistake, but if I forgot, I figured other people can to. (That's me - making dumb mistakes so you guys look smarter. You're welcome! ;)

If you go to the site and go to the 2nd or 3rd page, you will see an entry title: Bold Text and Opacity Issue. Then every entry below that will look faded.

Why? I forgot one of the basic rules. When displaying content that could have HTML embedded in it, you need to use <a href="http://www.cfquickdocs.com/?getDoc=HTMLEditFormat">htmlEditFormat</a>. 

Nice one there, Ray. Anyway, I'll leave the bug in there for another hour or so before I fix it. In case it's fixed before you read this, here is a screen shot. (Someone save this and post it to my site next time my ego gets away with me.)


<img src="https://static.raymondcamden.com/images/cfbloggers.png">