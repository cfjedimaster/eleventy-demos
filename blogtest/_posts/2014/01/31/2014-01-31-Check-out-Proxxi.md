---
layout: post
title: "Check out Proxxi"
date: "2014-01-31T12:01:00+06:00"
categories: [mobile]
tags: []
banner_image: 
permalink: /2014/01/31/Check-out-Proxxi
guid: 5142
---

<p>
Proxxi is a neat little social networking app built by my coworkers <a href="http://gregsramblings.com/">Greg Wilson</a> and <a href="http://coenraets.org/">Christophe Coenraets</a>. Instead of the traditional friend/acquaintance based network, Proxxi focuses on connecting you to people via location. So for example, I could create a message saying that a particular restaurant is overcrowded and has a long wait time. People in my area would see the message whether they knew me or not.
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/p1.jpg" />
</p>

<p>
The technology stack behind the app is interesting. It uses:
</p>

<ul>
<li>PhoneGap</li>
<li>Backbone.js</li>
<li>Require.js</li>
<li>Topcoat (for UI)</li>
<li>CloudFront and S3</li>
<li>MongoDB</li>
<li>Node and Express</li>
<li>EC2</li>
</ul>

<p>
You can read more about the stack over at <a href="http://coenraets.org/blog/2014/01/proxxi-a-proximity-based-social-app/">Christophe's blog</a>.
</p>

<p>
<img src="https://static.raymondcamden.com/images/p2.jpg" />
</p>

<p>
Also behind the scenes is a fascinating mail relay system using Mailgun. Proxxi allows you to communicate via email in a 100% anonymous manner (much like Craigslist if I remember right). I've tested this with Greg and Christophe and it works <i>really</i> well. I've bugged Greg to blog about the details as I think it would be of interest to folks building mobile applications.
</p>

<p>
Of course the app is free to check out and available for both Android and iOS. Also, you can download it and play with it <strong>without</strong> having to register, which I wish more apps would allow.
</p>

<p>
<a href="https://itunes.apple.com/us/app/proxxi/id784581176?mt=8"><img border="0" src="http://www.proxxi.com/images/ios-store.png"></a> &nbsp; &nbsp; 
<a href="https://play.google.com/store/apps/details?id=com.proxxi.proxxi"><img border="0" src="http://www.proxxi.com/images/android-store.png"></a>
</p>