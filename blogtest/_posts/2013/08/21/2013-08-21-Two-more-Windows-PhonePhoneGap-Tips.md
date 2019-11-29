---
layout: post
title: "Two more Windows Phone/PhoneGap Tips"
date: "2013-08-21T17:08:00+06:00"
categories: [html5,mobile]
tags: []
banner_image: 
permalink: /2013/08/21/Two-more-Windows-PhonePhoneGap-Tips
guid: 5015
---

Please note the date of this posting (Aug 21, 2013) - what you are seeing here should be fixed rather soon and is probably not an issue at the time you're reading this. I ran into this last week and wanted to blog it in case others hit the same hurdles.
<!--more-->
First Issue: When you create a new application via the PhoneGap CLI, the default ID includes the word "hello-word". If you then try to build for Windows Phone you will get:

C:\Users\labuser\Desktop\pg3test\test2\platforms\wp8\App.xaml(1,1,1,1): error : x:Class="com.phonegap.hello-world.App" is not valid. 'com.phonegap.hello-world.App' is not a valid fully qualified class name.

This has already been reported (and <a href="https://github.com/phonegap/phonegap-cli/issues/156">fixed</a>), but if you run into this, just add the --id attribute: phonegap create pathtoapp --id "com.camden.helloworld"

Second Issue: If you run your app on the Windows Phone and notice that the deviceready event doesn't fire (the default PG app uses a pretty animation to let you know when this occurs), then the issue is that the index.html is loading phonegap.js. Change the script src to cordova.js and all will be well.