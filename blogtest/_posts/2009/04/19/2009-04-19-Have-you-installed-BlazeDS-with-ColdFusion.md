---
layout: post
title: "Have you installed BlazeDS with ColdFusion?"
date: "2009-04-19T12:04:00+06:00"
categories: [coldfusion,flex]
tags: []
banner_image: 
permalink: /2009/04/19/Have-you-installed-BlazeDS-with-ColdFusion
guid: 3321
---

I'm trying to get BlazeDS working with ColdFusion. I plan to eventually do it to a Windows server, but for now, I'm working locally on my Mac. I have no need for Livecycle to work, I'm happy with completely changing it to BlazeDS. I was happy to find a complete install guide for Blaze and CF <a href="http://opensource.adobe.com/wiki/display/blazeds/Installation+Guide?showComments=false#InstallationGuide-IntegratingBlazeDSwithaColdFusion8installation">here</a>.

However, I got tripped up on step 7:

<blockquote>
<p>
Set up the configuration files for BlazeDS. You can copy the set of configuration files from the BlazeDS ZIP file (not the WAR file). Copy the following files in resources/ColdFusion to ColdFusion8/wwwroot/WEB-INF/flex:
</p>
</blockquote>

While nice and clear, I only read the first sentence. I had downloaded the binary package of BlazeDS and wasn't quite sure what they meant by "ZIP file (not the WAR file)". I plainly saw the 4 config files from the JAR, so I just used those. Of course, nothing ColdFusion-wise existed in those configs, and when I tried to do a simple remoting call, it failed.

If you download the <b>source</b> version of BlazeDS instead, you will have the folder mentioned in the instructions and your config will work perfectly. I tend to avoid source distributions because I assume they will make me build the source into binaries, but from what I can see, the source version <i>also</i> includes the JARs anyway.

I hope this helps people as it definitely tripped me up at first.