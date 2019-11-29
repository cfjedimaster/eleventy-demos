---
layout: post
title: "Apollo isn't just Flash/Flex"
date: "2007-03-23T16:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/03/23/Apollo-isnt-just-FlashFlex
guid: 1921
---

Want to play with Apollo but don't want to use/learn Flash or Flex? Check out the demo, Fresh on the <a href="http://labs.adobe.com/wiki/index.php/Apollo:Applications:Samples">Apollo samples</a> page. This thing is amazing. It is a 100% HTML/JS/AJAX Apollo application with not a lick of Flash in it. A <i>very</i> good example of what can be done with the platform. I must find more time to play with Apollo.

One thing I was curious about was how HTML apps in Apollo get access to all the nice things the framework gives us - like file system access. Turns out you can access the API via JavaScript like it was part of the browser itself. As an example (and I'm ripping this right from the pocket guide), this is how you can play an MP3:

<code>
urlReq = new runtime.flash.net.URLRequest("test.mp3");
sound = new runtime.flash.media.Sound(urlReq);
sound.play();
</code>

I think next week I'll whip up a pure HTML demo. I've been thinking of building an application just to interface with CFLib.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Cwebsites{% raw %}%5Cdev%{% endraw %}2Ecamdenfamily{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FFresh%{% endraw %}2Ejpg'>Download attached file.</a></p>