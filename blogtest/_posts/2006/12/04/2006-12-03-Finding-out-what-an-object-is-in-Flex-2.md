---
layout: post
title: "Finding out what an object is in Flex 2"
date: "2006-12-04T11:12:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2006/12/04/Finding-out-what-an-object-is-in-Flex-2
guid: 1690
---

So I was preparing a small article on Flex/Flash Remoting and Error Handling and I wanted to check the docs for the fault object. For the life of me though I couldn't remember what the full name/class of the fault object was. I'm sure I missed something obvious in Flex Builder, but I wanted to know if there was a way (in general) to take an object and return it's class name. Thanks to Chafic Kazoun of Adobe for the answer: Use flash.utils.getQualifiedClassName().

<code>
Alert.show(flash.utils.getQualifiedClassName(someobject),"What is someobject?");
</code>

See more about flash.utils at the <a href="http://livedocs.macromedia.com/flex/2/langref/flash/utils/package-detail.html">livedocs page</a>. Chafic also suggested these related functions: 

flash.utils.getDefinitionByName<br>
flash.utils.getQualifiedSuperclassName<br>