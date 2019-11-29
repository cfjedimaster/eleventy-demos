---
layout: post
title: "BlogCFC Security Issue for Apache Users"
date: "2006-01-22T17:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/01/22/BlogCFC-Security-Issue-for-Apache-Users
guid: 1046
---

So, all of this attention to BlogCFC has let me do a bit of digging. While I know others (or one person anyway) believes I'm perfect. I am not. Here is a great example. On Apache servers, if the ORG folder is under web root, you can view the INI file that defines BlogCFC behaviour. In general, most of the stuff in this file isn't a security risk - but one pair of settings defines the mail username and password to use when connecting to the local mail server. 

Again - in IIS - this seems to be protected by default. (Wow, imagine that.) In Apache it is exposed. You can get around this by simply using a .htaccess file to block access to the INI file.

Don't feel comfortable with .htacces? For a few versions now BlogCFC has let you pass configuration information in as a structure. To do this, simply create a structure that mimics the ini file and pass it to the creation code in the Application.cfm file. Feel free to ping me.

What will I do to handle this in the future? I'll switch to the method I used on later applications - an XML file wrapped inside a CFM page.