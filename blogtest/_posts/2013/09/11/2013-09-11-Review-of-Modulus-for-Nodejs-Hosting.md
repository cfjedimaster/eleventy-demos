---
layout: post
title: "Review of Modulus for Node.js Hosting"
date: "2013-09-11T15:09:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2013/09/11/Review-of-Modulus-for-Nodejs-Hosting
guid: 5035
---

<p>
I'm assuming (hoping at least), that most folks who read my blog entries here have also followed my recent articles on Nettuts+. A few weeks back I wrote about my experience of moving a Node.js site into production (<a href="http://net.tutsplus.com/tutorials/javascript-ajax/going-live-with-node/">"Going Live with Node"</a>).
</p>
<!--more-->
<p>
In that article I spent most of my time talking about <a href="http://www.appfog.com">AppFog</a>. If you haven't read the article, I'll summarize it by saying that once you sign up for an account, you can quickly create an application and then use a command line tool to publish your Node app. That may not sound like a big deal, but to me, this represented one of the final hurdles I had to cross before I shared a Node.js application with others. I think the AppGog service is pretty cool, although I had issues with their support system when I needed it. 
</p>

<p>
I was recently contacted by a representative of <a href="http://modulus.io">Modulus</a>. In some ways they are pretty much in the same business as AppFog. You sign up. You create an application. You can then choose to deploy via command line or file uploads. They are a bit more pricier then AppFog. The lowest level non-free account for AppFog is 20 bucks (you can go cheaper but you can't use a non-branded URL). The lowest level non-free account on Modulus is 15 bucks. But AppFog lets you put up to 8 apps into one account, so if you are looking to serve multiple different domains, AppFog will definitely be cheaper. Perhaps it is more fair to say it is cheaper for someone like me. I'm building a few Node.js apps for fun and learning so I have more of a need for multiple "spaces", but for a traditional company working on one project, it probably isn't going to matter. (And frankly, if you are worried about 5 dollars of hosting cost you have much bigger concerns.)
</p>

<p>
On first glimpse, both AppFog and Modulus were similar enough for me to not feel compelled to move from AppFog and adopt Modulus as my primary Node.js host. Don't get me wrong - Modulus seemed fine, but AppFog had a few apps already and I didn't see a need to move.
</p>

<p>
But then I began to discover some <strong>damn</strong> compelling features. First off - Modulus supports wildcard domains. That means you can match *.foo.com to Modulus. AppFog does not support this. Because of this, I <i>had</i> to use it for <a href="http://www.andkittens.us">AndKittens.us</a>. There is an open request for wildcard support at AppFog but it is still not supported, and I believe (going by memory here, take with grain of salt) that it has been requested now for over a year. My confidence isn't high that this will be supported soon.
</p>

<p>
So that's possibly not a big deal. I needed it for AndKittens.us, but that had special features based on the URL. That's probably not a common use case. Then I noticed the dashboard.
</p>

<p>
I have to admit I did not originally spend much time on their site. I don't like the dark theme. Don't get me wrong - I couldn't design better - but AppFog has a really nice looking dashboard compared to Modulus.
</p>

<p>
AppFog:<br/>
<img src="https://static.raymondcamden.com/images/Screenshot_9_11_13_2_10_PM.png" />
</p>

<p>
Modulus:<br/>
<img src="https://static.raymondcamden.com/images/Screenshot_9_11_13_2_11_PM.png" />
</p>

<p>
Ugly, right? But while both report basic stats, I find the Modulus ones a lot easier to scan. I <i>especially</i> like the embedded log viewer. On a whole, you get roughly the same amount of data, but Modulus goes much deeper in their Metrics panel. (I should note - the <i>amount</i> of data here isn't terribly deep since my site is only getting a few hits.)
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_9_11_13_2_14_PM.png" />
</p>

<p>
A little lower on the same page...<br/>
<img src="https://static.raymondcamden.com/images/Screenshot_9_11_13_2_16_PM.png" />
</p>

<p>
Look at that - per route timings. Now from what I can tell - AppFog can support something similar via add ons - but having this out of the box is incredible. This level of detail is the <strong>biggest</strong> thing I've been missing in Node.js versus ColdFusion. (For those of you reading this who don't know, ColdFusion has a built in debugging service that can provide detail like this.)
</p>

<p>
Even better - yesterday Modulus announced they were adding MongoDB stats. Check this screen shot:<br/>
<img src="https://static.raymondcamden.com/images/mongo2.jpg" />
</p>

<p>
I love the level of detail here. My current app there isn't using any Mongo but this would be extremely useful in a typical application.
</p>

<p>
There are two more features that I think are pretty cool as well:
</p>

<ul>
<li>While you have basic file storage support, you also have cloud storage. While I'm assuming it is just a S3 shim, it essentially lets you use a common root folder alias amongst N machines in a cluster as if they were one basic file system. Again, I'm sure you can find a S3 library to do the same, but I like having this built in.
<li>Modulus lets you define "web hooks" for projects, basically a way to say, "On event X, run this URL". One of those events is project shutdown. I'm not sure if that works for crashes too, but if so, you've got a built in way to let you know when your app craps the bed.
</ul>

<p>
All in all, it feels like Modulus has some incredible features over AppFog. I have to be honest and say I probably won't keep my app running there. <b>This is in no way a reflection of their service.</b> That should be obvious as I've just been praising the heck out of them. But since I pay for hosting on this box, <i>and</i> on AppFog for a few domains, I don't think I'm ready to add a third hosting bill just for AndKittens.us. If I slap some AdSense up there and it can turn a profit I'll keep it. On the flip side, if a client were to come to me and look for a place to host a new app, and if I were using Node.js, I'm pretty darn sure I would go with Modulus. With the better stats and better support, my confidence is much more higher with them than AppFog.
</p>