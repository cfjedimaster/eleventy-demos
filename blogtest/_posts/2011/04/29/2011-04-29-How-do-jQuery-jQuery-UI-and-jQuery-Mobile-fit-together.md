---
layout: post
title: "How do jQuery, jQuery UI, and jQuery Mobile fit together?"
date: "2011-04-29T11:04:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2011/04/29/How-do-jQuery-jQuery-UI-and-jQuery-Mobile-fit-together
guid: 4214
---

A few minutes ago @BradLawryk asked me on Twitter what the difference between jQuery and jQuery Mobile  was. Are they the same thing? Do they work together? Etc. I thought it might make sense to quickly explain how jQuery, jQuery UI, and jQuery Mobile relate to each other. This is my opinion of course so please feel free to chime in.

At a basic level, jQuery is a JavaScript library that enables you to quickly perform common tasks. I like to describe jQuery as a way to find stuff on a page, load stuff via Ajax, and then work with that stuff. That's a gross simplification, but to me, that's what jQuery provides for me. You can find out more at <a href="http://jquery.com/">jquery.com</a>.

jQuery UI is a library that works with jQuery. Any jQuery UI page is going to load jQuery first. jQuery UI provides support for widgets and user interaction (think drag and drop for example). You do <b>not</b> have to use jQuery UI to do widgets. In fact, there are about 5 billion jQuery plugins for various widgets. (Give or take a few billion.) Personally I always go to jQuery UI first just because it's easiest and I like the way it does things. You can find out more at <a href="http://jqueryui.com">jqueryui.com</a>.

jQuery Mobile is a library that works with jQuery. Any jQuery Mobile site is going to load jQuery first. jQuery Mobiles makes it easy to create a mobile-optimized version of your web site. You can find out more at <a href="http://jquerymobile.com">jquerymobile.com</a>. Like jQuery UI, there are other alternatives to building mobile friendly sites with jQuery. Frankly though I've yet to see anything as friendly as jQuery Mobile. I'd go as far to say you can build something nice in jQuery Mobile even if you've never written a line of jQuery or JavaScript.

That's it. Obviously there's a lot to all of the above, but I just wanted to write something short and sweet that helps clarify the relationship between these 3 tools.