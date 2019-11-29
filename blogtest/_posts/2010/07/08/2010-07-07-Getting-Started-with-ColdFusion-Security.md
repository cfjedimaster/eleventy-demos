---
layout: post
title: "Getting Started with ColdFusion Security"
date: "2010-07-08T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/08/Getting-Started-with-ColdFusion-Security
guid: 3871
---

<img src="https://static.raymondcamden.com/images/cfjedi/security.jpg" align="left" style="margin-right: 10px"/> A reader just asked:

<blockquote>
Hello, I am Brazilian and I am starting to develop with ColdFusion. I would like some tips on how to develop with security, my applications, so you never have problems. Thanks.
<br/>
</blockquote>

That's a pretty huge question. Before I start to delve into some answers, I think it is absolutely critical that you <b>never</b> assume you will not have problems. You <b>will always</b> have problems. You can - however - work very hard to mitigate and minimize your problems as much as possible. When it comes to security, there is absolutely no "silver bullet" that you can do once and simply move on from. Security is an ongoing, ever present concern. 

With that out of the way, here are some resources that I think can help you. I encourage my readers to add to this list. 

<ul>
<li>First, check the <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Admin/WSc3ff6d0ea77859461172e0811cbf364104-7ff2.html">Administering Security</a> chapter of the online guide <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Admin/index.html">Configuring and Administering Adobe ColdFusion 9 </a>. This is part of the thousands of pages of free documentation for ColdFusion 9.
<li>You can then check <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSc3ff6d0ea77859461172e0811cbec22c24-7e34.html">Securing Applications</a>. This is part of the <a href="http://help.adobe.com/en_US/ColdFusion/9.0/Developing/index.html">Developing Adobe ColdFusion 9 Applications</a> online book.
<li>The most complete resource, and again, <b>100% free</b>, is the PDF <a href="http://www.adobe.com/products/coldfusion/whitepapers/pdf/91025512_cf9_lockdownguide_wp_ue.pdf">Adobe ColdFusion 9 Server Lockdown Guide</a>. It's pretty intense, but it gives a great blueprint for locking <b>everything</b> down on your server. 
<li>That last guide was created by Pete Freitag, whose company also runs the online tool, <a href="http://hackmycf.com/">Hack My CF</a>. This will perform various network requests against your server looking for vulnerabilities. Oh - and this too is 100% free. 
<li>You should also keep track of security bulletins issue by Adobe. You can find them here: <a href="http://www.adobe.com/support/security/#coldfusion">http://www.adobe.com/support/security/#coldfusion</a>
<li>Fancy a recorded presentation? Check out the recording of Jason Dean on <a href="http://adobechats.adobe.acrobat.com/p90448467/">ColdFusion Application Security</a>. Free too. 
<li>Finally, I'll mention my own little guide, <a href="http://www.raymondcamden.com/coldfusionsecuritychecklist.cfm">ColdFusion Security Checklist</a>. It hasn't been updated for a while, but it's another resource you can consider as well.
</ul>