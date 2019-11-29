---
layout: post
title: "Clearing individual files/folders from ColdFusion template's cache"
date: "2008-06-19T17:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/06/19/Clearing-individual-filesfolders-from-ColdFusion-templates-cache
guid: 2890
---

A little bit ago I sat in the session "End to End Performance Tuning", which was a great session. One of the tips mentioned was the use of trusted cache on production systems. One of the problems with this though is that you need to clear the template cache for each and every little change. What folks tend to forget is that the Admin API has support to clear individual files. I <a href="http://www.raymondcamden.com/index.cfm/2007/6/7/ColdFusion-8-Admin-API-and-Trusted-Cache">blogged</a> about this last year (at CFUN I think) and wrote up a quick little script to show an example of it. This came up again during the session so I thought I'd work a bit on the script and make it a bit more presentable in the ColdFusion Admin. 

Take the script attached to this template and put it in your ColdFusion Administrator folder. Put it in a subfolder named anything you want, I used cacheclearer. Then edit custommenu.xml to add a link:

<code>
&lt;menuitem href="cacheclearer/" target="content"&gt;Cache Clearer&lt;/menuitem&gt;
</code>

Then hit up your Admin and you can run the utility. You can enter a CFM/CFC to clear or a folder and all CFM/CFCs under it will be clearer.

<img src="https://static.raymondcamden.com/images/cfjedi/cacheclearer.png" width="400"><p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcacheclearer%{% endraw %}2Ezip'>Download attached file.</a></p>