---
layout: post
title: "ColdFusion, Random Numbers, and Time"
date: "2014-03-11T11:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/03/11/ColdFusion-Random-Numbers-and-Time
guid: 5172
---

<p>
A while ago I logged a <a href="https://bugbase.adobe.com/index.cfm?event=bug&id=3335493">bug</a> I had discovered with ColdFusion REST services. I had created a simple REST service that returned a random number between one and one hundred. Nothing too complex, right? But then I noticed something odd. If I called the REST service with a cfhttp call twice, I got the same number back. I had discovered - I thought - a serious caching issue with REST services. Turns out I was wrong.
</p>
<!--more-->
<p>
If you read the comments for the bug, you will see one in particular that stands out:
</p>

<p>
<img src="https://static.raymondcamden.com/images/Screenshot_3_11_14__9_18_AM.png" />
</p>

<p>
I assume this is one of the engineers, although I don't know. It makes sense - kinda - but I certainly didn't know this and I'm willing to bet most folks aren't aware of this either. As a long time computer programmer, I have a vague idea of the intricacies of random number generation. Apparently it involves quantum states, time travel, and zombie kittens. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/ZombieKitten.png" />
</p>

<p>
The person helping out on the comment thread suggested using IBMSecureRandom as an algorithm for the randRange, but according to the docs this is only supported on WebSphere. I used SHA1PRNG and it worked immediately. 
</p>