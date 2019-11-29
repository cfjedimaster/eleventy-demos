---
layout: post
title: "Dynamically changing jQuery Mobile Buttons"
date: "2012-06-26T18:06:00+06:00"
categories: [development,javascript,jquery,mobile]
tags: []
banner_image: 
permalink: /2012/06/26/Dynamically-changing-jQuery-Mobile-Buttons
guid: 4659
---

Filed in the "In case you need to know" department, jQuery Mobile provides a <a href="http://jquerymobile.com/demos/1.1.0/docs/buttons/buttons-options.html">basic API</a> that allows you to modify buttons. This is more useful for creating <i>new</i> buttons, but also has uses for existing buttons. Specifically, I was looking for a way to swap out the theme of a button in a form based on what had been entered. Here is a simple example of this API in action:
<!--more-->
<script src="https://gist.github.com/2999544.js?file=gistfile1.html"></script>

Most of the template is boilerplate jQuery Mobile code. Note though the two buttons in the content section. Both are set to have no theme. Now - look at the JavaScript code at the bottom. I've got a basic click handler (should be touch I suppose) that will iterate over all possible theme values, including no theme specified. The <a href="http://jquerymobile.com/demos/1.1.0/docs/buttons/buttons-options.html">API</a> allows you to tweak pretty much everything, but I'm not sure what else you would change on the fly. Icon perhaps. Anyway, on the off chance someone needs this, here is a demo of the code above.

<a href="http://www.raymondcamden.com/demos/2012/jun/26/test2.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>