---
layout: post
title: "New site - PopularFollowers.com"
date: "2012-08-20T16:08:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2012/08/20/new-site-popularfollowerscom
guid: 4707
---

Back almost two years ago I <a href="http://www.raymondcamden.com/index.cfm/2010/9/24/Listing-your-Twitter-followers-by-popularity-using-50-lines-of-ColdFusion">posted</a> some sample ColdFusion code that retrieved the followers for a Twitter user and then listed them by the number of followers they had. In other words, it told you who your most important followers were. (Well, "important" being measured by the number of followers a person has. One could argue that isn't the most important metric!)
<!--more-->
I decided I'd rebuild it in HTML and JavaScript. This would let me run the script in a browser and check different accounts. Twitter's API (while it lasts) is pretty simple but doesn't support CORS. That means any time you use it via JavaScript you need to use JSON/P.  That's not difficult either. I whipped up some code, wrote a custom sort on it, and hooked it up to a Handlebars.js template. All in all it was less then 40 lines of code:

<script src="https://gist.github.com/3406871.js?file=gistfile1.js"></script>

Of course - while the code was easy - making it look hot was more work. Luckily, I was contacted by <a href="http://amineftegarie.nl/">Amin Eftegarie</a>. Amin graciously offered to do the design, and pushed me to actually put this code up on a domain and share it with the world. 

You can run this code yourself at <a href="http://popularfollowers.raymondcamden.com">popularfollowers.raymondcamden.com</a>. All the design is credit him. Trust me - my initial version was slightly uglier. ;)

Unfortunately, this solution is probably not as "tight" as I would like. I was never able to properly handle the error case for when a username didn't exist. I can handle errors in general, but I couldn't specifically notice/handle that case. Also - it's pretty easy to hit your personal API limit. I'll consider adding an OAuth type setup... but frankly... it works "good enough" for a toy and I'm satisfied with it as is. It also takes a little while to run. I've got 4.4K or so followers and it takes close to a minute to get them all and sort them out.

Oh - and I discovered that <a href="https://twitter.com/melodythomassco">Melody Thomas Scott</a> follows me. <b>Awesome.</b>


<img src="https://static.raymondcamden.com/images/screenshot23.png" />