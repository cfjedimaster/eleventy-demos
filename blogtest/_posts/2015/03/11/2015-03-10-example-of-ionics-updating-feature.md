---
layout: post
title: "Example of Ionic's Updating Feature"
date: "2015-03-11T09:20:13+06:00"
categories: [javascript,mobile]
tags: [ionic]
banner_image: 
permalink: /2015/03/11/example-of-ionics-updating-feature
guid: 5814
---

Ok, so this will be a pretty short post, and the main gist is, "It works as advertised", but I had not had a chance to actually test this until recently and I was pretty darn impressed with how smoothly it worked so I thought I'd share.

<!--more-->

If you use Ionic, you know that they update pretty frequently, and you may want to update your project to the latest framework bits. Turns out there is an <strong>incredibly</strong> easy way to do this. Just go into your Ionic project and run <code>ionic lib</code>:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/ionic1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/ionic1.png" alt="ionic1" width="850" height="132" class="alignnone size-full wp-image-5815" /></a>

It reports on the version of Ionic used in a project versus the latest release. Then to update, you do <code>ionic lib update</code>:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/ionic2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/ionic2.png" alt="ionic2" width="850" height="178" class="alignnone size-full wp-image-5816" /></a>

Confirm you want to do the update, and then just stand back. The CLI will grab the bits and take care of everything. I'd <i>kill</i> for this within other projects. Just for completeness sake, this is what you get when the library you're testing is already up to date.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/ionic3.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/ionic3.png" alt="ionic3" width="850" height="113" class="alignnone size-full wp-image-5817" /></a>