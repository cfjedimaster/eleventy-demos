---
layout: post
title: "Ask a Jedi: Moving to ColdFusion"
date: "2007-11-08T10:11:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/11/08/Ask-a-Jedi-Moving-to-ColdFusion
guid: 2463
---

This email just makes me happy all over. I'm always thrilled to hear about someone moving to ColdFusion. One of his questions involved hosts, so I figured it was a good one to share. Ola asks...

<blockquote>
<p>
I
have been following your blog since the launch of CF8 and have grown interested in moving to CF for my website projects. I am still unsure if this is the right platform for my kind of work since most of my clients are small companies that I usually recommend shared hosting service to. In the past I have used PHP, but I really love the ease of use and learning curve of CF. I am also considering Ruby on Rails. I use a lot of the adobe products and have started playing with FLEX which seems to have the best integration with CF.
</p>
</blockquote>

You certainly won't get any arguments from me here. I have respect for PHP and Ruby, but I definitely think you can't beat ColdFusion for ease of use and RAD - and it is <i>definitely</i> a great way to serve up content for Flex or AIR apps. I've yet to see a language that does this type of work quite as easy as ColdFusion. 

<blockquote>
<p>
My concerns are first finding hosting companies for my clients. 
</p>
</blockquote>

There are plenty of CF hosts out there. I don't personally recommend any - just because I don't feel right doing so w/o being an actual customer. But for my clients I've worked with Host My Site and CrystalTech. Both seem to be good. Point is though - there are definitely plenty of hosts out there offering CF. Oh - I did use CFXHosting in the past. They were good too. I now host with someone who prefers to remain anonymous as they aren't quite ready to sell hosting just yet. I'm sure everyone of my readers has an opinion on hosting, but let's just say that you have options, and plenty of them. Check out <a href="http://www.forta.com/cf/isp/">Ben's list</a>.


<blockquote>
<p>
Second I prefer to write clean semantic XHTML, code in textmate/dreamwever and would like to know if CF tag generated code as in CF Form does not introduce deprecated code into my markup. Please advise. I would like to embrace one platform for the kind of work I do but, unsure CF is right for the non enterprise web design business space I work in.
</p>
</blockquote>

First off - only a subset of ColdFusion's tags actually generate output. That number grew in ColdFusion 8 with the introduction of the Ajaxy-UI tags, but in general, you are responsible for your own output. ColdFusion will not help or hurt your output being XHTML, clean, etc. For the tags that <i>do</i> generate output - if you don't like what they output - then don't use them. Simple as that. As cool as the new Ajax tabs are, if you feel the output isn't good, then you can certainly find another tab solution from <a href="http://labs.adobe.com/technologies/spry">another framework</a>. You specifically mentioned CFForm. I personally don't use that very often. I've used it a bit more now with CF8's Ajax stuff, but just to get the async posting feature, not for any layout type stuff. And I certainly do <b>not</b> recommend Flash Forms to anyone now (use Flex!).