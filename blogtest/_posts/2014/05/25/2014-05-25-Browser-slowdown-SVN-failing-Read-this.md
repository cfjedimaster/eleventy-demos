---
layout: post
title: "Browser slowdown? SVN failing? Read this."
date: "2014-05-25T12:05:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2014/05/25/Browser-slowdown-SVN-failing-Read-this
guid: 5231
---

<p>
For a few months now, I've experienced an odd issue with Chrome. I'd go to a URL and get nothing but a white screen while something tried to load. Almost always the URL had 'cdn' in it or implied a static server of some type. It was like Chrome had no issue with the main domain, but barfed on the secondary servers that many sites use for their related assets. Even worse, this one request typically caused the page to hang. I'd kill the request, reload, and pretty much always it loaded. If I opened the same URL while Chrome was hanging in Firefox, it always worked there. 
</p>
<!--more-->
<p>
I tried various things - including removing all my extensions - but nothing really worked. I also tried Googling for solutions but could never find something that seemed related to my issue. Finally, something unrelated (or so I thought) happened Friday afternoon. I went to update something via SVN and got an error. Googling for that turned up a few folks complaining about the Web Security module of Cisco AnyConnect. It just so happens that I use that product for my work VPN and I had updated it... a few months back. This then led me to this blog entry: <a href="http://www.thebitguru.com/blog/view/394-Random{% raw %}%20Slowdown%{% endraw %}20of{% raw %}%20Browsers%{% endraw %}20in{% raw %}%20OS%{% endraw %}20X{% raw %}%20Mountain%{% endraw %}20Lion">Random Slowdown of Browsers in OS X Mountain Lion</a>. 
</p>

<p>
I checked - and I had the same errors logged in my console as he did. I did not uninstall though as I needed my VPN software. Luckily one of the commenters said you could remove this part of AnyConnect using this command line: <code>sudo /opt/cisco/anyconnect/bin/websecurity_uninstall.sh</code>
</p>

<p>
This immediately fixed my SVN issue and I have yet to see Chrome hang since doing this.
</p>