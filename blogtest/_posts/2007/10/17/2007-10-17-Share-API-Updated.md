---
layout: post
title: "Share API Updated"
date: "2007-10-17T11:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/10/17/Share-API-Updated
guid: 2419
---

I've updated my Share API code. This is a CFC that integrates with the new Adobe <a href="http://labs.adobe.com/technologies/share/">Share</a> service. My CFC now includes the ability to create and update shares. What doesn't work?

<ul>
<li>Move/Rename is still broken. This is do to an issue in the back end API that Adobe is aware of. It only impacts clients that have to use POST for this operation.
<li>Updating a Share is supposed to allow you to specify people to add or remove. Note the or. However the API currently will throw an error if you don't pass an Add list. Until Adobe fixes that on their side - just be sure to pass an existing name to the Add list.
</ul>

That should be it. Once I can make Move/Rename work, I want to do a bit of cleanup on the code and then I'll post to RIAForge. If you use this CFC, please let me know.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fshare%{% endraw %}2Ecfc1%2Ezip'>Download attached file.</a></p>