---
layout: post
title: "Ready2Run Open BlueDragon and Web Services"
date: "2009-02-07T18:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/02/07/Ready2Run-Open-BlueDragon-and-Web-Services
guid: 3228
---

I was testing some simple web services code and needed to try it under <a href="http://www.openbluedragon.org">Open BlueDragon</a>. I was <i>very</i> happy to see a 'Ready2Run' install option. I downloaded, unzipped, and entered one command in Terminal and I was up and running. However, I ran into an error when I tried to run code that made a web service request.

<blockquote>
<p>
Unrecognized error code: Failed to compile web service generated client classes for http://eval.sugarondemand.com/secret/soap.php?wsdl. The compiler error messages follow: /Applications/jetty-openbd/webroot_cfmlapps/cfmlWebContext_1/WEB-INF/lib/webservices.jar does not exist and is needed to compile web service type.
</p>
</blockquote>

I searched and I found a few other people with the same problem, but I didn't find any solutions. (I probably gave up too quickly.) I did a quick tweet for help and got some good feedback. The solution is to create a folder under webroot_cfmlapps/cfmlWebContext_1 named WEB-INF. Then make another folder under WEB-INF called libs. I then copied JARs from jetty-openbd/lib/openbd. I copied: jaxrpc.jar, saaj.jar, webservices.jar, and wsdl4.jar. (Basically I copied one jar at a time until the errors went away.)

Anyway, thanks atomi and Joshua Leone for the help!