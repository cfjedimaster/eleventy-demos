---
layout: post
title: "Frameworks Conference: CFCs ARE the Framework, by Steve Nelson"
date: "2007-02-01T13:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/01/Frameworks-Conference-CFCs-ARE-the-Framework-by-Steve-Nelson
guid: 1810
---

CFCs ARE the Framework, by Steve Nelson

As before - excuse the scattered nature of this review as I'm writing while listening.

Talking about the rise of frameworks in the CF community. He asks if frameworks are necessary, and they are, and he makes
the good point that which one you use isn't as important as ensuring the entire team is using the same framework. (Definitely ditto that.)
<!--more-->
What Steve likes: MVC and Teamwork.
 
What he doesn't like: Using XML. He describes it as two languages doing the same thing. (I definitely disagree here. But more on that later.)

He doesn't like the core files in most frameworks. Says it adds complexity and you have to rely on other people's code. 

So what about CFCs simply managing themselves? So first - he uses Application.cfc to store a whole crap load of components in the Application scope. (In the onApplicationStart of course.) He separates his CFCs into model, view, and controller CFCs. He parses the controller and method to call from the URL. (So if foo.doit, the controller is foo, and the method is doit.) Then he invokes the component/method.

The controller CFC is very simple - just shells out to the model or view depending on the method being run.

He uses includes in his CFC methods which led to a lovely debate. I (along with Sean, Doug, others) argued that this was bad since it made it easier to have var scope issues. Steve made the point that the whole var scope thing was an Adobe bug, and while I agree that var scoping is a pain, it doesn't mean we can ignore it. 

So all in all - it seems like this whole thing is simply an organization to his CFCs. I guess I get that - and it is better than not using any organization at all - but as a whole, I don't think I would use this approach. I don't see a particular URL for his framework, but here is Steve's blog: <a href="http://www.webapper.net/">http://www.webapper.net/</a>. (I just noticed that he mentions on his blog that the code will be released later.)

One quick note - Steve did show a nice little trick. He has a cflocation abstraction that, when in development, can show debug information and a link to the URL. In production it just runs the cflocation. That's not a bad little development tool.

p.s. Steve says to look at <a href="http://labs.webapper.net">http://labs.webapper.net</a>.