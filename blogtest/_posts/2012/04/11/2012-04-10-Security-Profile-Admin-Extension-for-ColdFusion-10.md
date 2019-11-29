---
layout: post
title: "Security Profile Admin Extension for ColdFusion 10"
date: "2012-04-11T10:04:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/04/11/Security-Profile-Admin-Extension-for-ColdFusion-10
guid: 4586
---

The Adobe engineers are hard at work fixing bugs and preparing ColdFusion 10 for its final release. One of the interesting features that landed <i>after</i> the initial public release is a "Secure Profile" during installation. (<b>Edit:</b> Shilpi Khariwal just added a <a href="http://www.shilpikhariwal.com/2012/04/coldfusion-10-presents-secure-profile.html">blog post</a> on this new feature!) While installing ColdFusion, users can select to enable a Secure Profile that modifies around 20 default settings to help lock down the server. To be clear, <b>this is not meant to be a one size fits all type solution nor is it meant to imply you can never worry about security again</b>. Instead - it is simply meant to help guide people into a more secure production server.
<!--more-->
<p>

This new feature is only available during installation. I thought it might be interesting to create a one page report tool covering those security options set up during installation. I wasn't able to get every single one (a few options are not available yet via the Admin API), but my report covers 17 settings. For each one it tells you your setting and the recommended setting. Good values are marked in green - bad values in red (or a red variant - I had design help by Rachel Lehman). Here's a screen shot:

<a href="http://www.raymondcamden.com/images/ScreenClip69.png"><img src="https://static.raymondcamden.com/images/ScreenClip_small.png" border="0" /></a>

Click the shot to embiggen (it's a word - AICN says so) and I apologize for not having a fancy jQuery-based lightbox setup. 

Some of the features checked are:

<ul>
<li>Robust exceptions
<li>Allowed SQL operations in DSNs
<li>RDS being enabled
<li>and more!
</ul>

To install, read <a href="http://www.raymondcamden.com/page.cfm/Guide-to-ColdFusion-Administrator-Extensions">my guide</a> on CF Admin extensions and - of course - use ColdFusion 10. This could easily be modified to work in ColdFusion 9 with a few IF checks here and there. The bits may be found at the Github repo (I'll add it to RIAForge once ColdFusion 10 is officially released.)

<a href="https://github.com/cfjedimaster/ColdFusion-Security-Profile">https://github.com/cfjedimaster/ColdFusion-Security-Profile</a>