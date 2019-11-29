---
layout: post
title: "BlogCFC Updated"
date: "2006-01-22T21:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/22/BlogCFC-Updated
guid: 1047
---

After finding a <a href="http://ray.camdenfamily.com/index.cfm/2006/1/22/BlogCFC-Security-Issue-for-Apache-Users">security issue</a> with Apache and the INI file, I've released an update that addresses this. BlogCFC now uses  blog.ini.cfm. I know - big change? Well along with an Application.cfm under the org folder, it should now be impossible to view the INI file remotely. It still uses the same format, so at most folks will need to do is rename the ini file, copy over the CFC file and the application file, and reinit to double check.

Also - I was convinced (by people smarter than myself) to stop releasing so many updates without changing the version number. I'm now using a minor version. This minor version will <i>always</i> change, period. To see if you are running the very latest, you can compare the result of getVersion from your blog with the download pod on the <a href="http://ray.camdenfamily.com/projects/blogcfc">project page</a>.

Enjoy.