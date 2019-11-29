---
layout: post
title: "Best of CF9: MailClient"
date: "2010-01-17T14:01:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2010/01/17/Best-of-CF9-MailClient
guid: 3684
---

<img src="https://static.raymondcamden.com/images/cfjedi/bestcfcontest1.jpg" title="Best of ColdFusion 9" a style="float:left;margin-right:5px;margin-bottom:5px"/> Today's Best of ColdFusion 9 entry is the second to last entry. Slowly but surely we're getting there. One more and it will be time to judge! Today's entry comes from Adam Tuttle. Hits entry is entitled MailClient. It's a simple entry so the review won't be too long, but it's got a lot of interesting bits to it I think folks will want to take a closer look at. Before getting started, ensure you read the following.

<br clear="left">
<!--more-->
1) This is a Flex 4 project. I first tried to import this into FlexBuilder but when I saw the telltale signs of Flex 4 (lots of namespaces ;) I switched to my Flash Builder beta. You can download the beta <a href="http://labs.adobe.com/technologies/flashbuilder4/">here</a>. I've talked a bit about Flex 4 before. I have <b>not</b> been keeping up with recent developments but hope to get a bit more into it this summer. 

2) This entry makes use of CFaaS. I believe this is the first entry in the series to do so (but if I'm wrong, forgive me). CFaaS is something that - initially - I was kind of "meh" on in terms of ColdFusion 9. After learning it for my presentation for RIAUnleashed though I grew to appreciate it a bit more. (In fact, I've submitted some fixes/updates back to Adobe.) 

Because of CFaaS usage, be sure to create a user with the following credentials: flexUser, flexPass. You want to give this user access to the Pop service, and ensure 127.0.0.1 is listed in the Allowed IP page. 

3) Once you've got the Flash Builder project created, you will see an error about the services SWC file. This is because it points to Adam's server. Remove that in your Library and then re-add your own copy from your ColdFusion CFIDE/scripts folder. 

One done, you should be able to run it as is. If everything worked ok, you'll get a nice little AIR window.

<img src="https://static.raymondcamden.com/images/cfjedi/Screenshotjan17.png" title="The Mail Window" />

As you can see, this is a simple mail reader. It makes use of the CFaaS Pop service. It's using a 'throw away' account Adam set up, but you can modify the account details by editing MailController.as. It doesn't send yet, but it does show a simple example of reading mail via CFaaS. I'll also point out it makes use of <a href="http://swizframework.org/">Swiz</a>. I've fallen behind on recent updates to Swiz, but I <b>cannot stress enough</b> how darn helpful Swiz was in my Flex development. It's the number one thing I recommend for people who have gotten past the "Hello World" Flex development. 

Finally - for a good review from the author himself, you can watch this cool video he set up. I'm using S3 to serve it up, so let me know if it doesn't work for you.

<a href="http://s3.coldfusionjedi.com/mailclient.mov">http://s3.coldfusionjedi.com/mailclient.mov</a><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FFG%{% endraw %}2DMailClient{% raw %}%2DCFaaS%{% endraw %}2Ezip'>Download attached file.</a></p>