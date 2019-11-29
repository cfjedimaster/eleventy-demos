---
layout: post
title: "Using argumentCollection with AJAX calls - about ajaxProxy"
date: "2010-12-07T10:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/12/07/Using-argumentCollection-with-AJAX-calls-about-ajaxProxy
guid: 4044
---

Just a quick note. A few weeks back I <a href="http://www.raymondcamden.com/index.cfm/2010/11/1/Using-argumentCollection-with-AJAX-calls-to-ColdFusion-Components">blogged</a> about argumentCollection works with CFCs over Ajax. <a href="http://www.stephenduncanjr.com/">Stephan Duncan Jr</a> was the smart guy who taught me that. Last night another reader ran into something a bit similar to this - however in this case it is not working correctly. To put it simply, if you use cfajaxproxy to create a proxy JavaScript class for a CFC, argumentCollection does not work. Any attempt to use it, for example, myproxy.foo(argumentCollection=ob), results in argumentCollection being passed in as whatever is defined as the first argument to the foo method. If this type of functionality is critical to you, then skip cfajaxproxy and do it 'native' with jQuery or some other (not as sexy) JavaScript framework.