---
layout: post
title: "Frameworks Conference: Designing Framework-Agnostic Models with CFCs - Brian Kotek"
date: "2007-02-02T11:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/02/Frameworks-Conference-Designing-FrameworkAgnostic-Models-with-CFCs-Brian-Kotek
guid: 1813
---

I was pretty intrigued by this session title as I always thought the model was separated from the framework by default. He began the presentation by showing a few examples of the model leaking into the controller. His first example showed a query inside the controller that should have been in the model. (Makes sense.) He then flipped it and showed an example where the event object (his example was in Mach-II but could have been applied to Model-Glue) was passed to the model, ie:
<!--more-->
<code>
foo = someModelCFC.someMethod(arguments.event);
</code>

Obviously this would tie the model to the event object specific to the framework. 

So good examples, and things I would hope folks would get anyway, but now that I'm a bit more used to MVC I may be assuming too much. ;) 

He then talked about the need for a service layer. This helps provide a stable API to the model. To be honest, I'm not quite sure I agree with this. Right now my controller talks to the model, but the model has no communication to the controller. So I don't see how providing a service layer is going to help. It almost feels like an API to an API. (Of course, now that I think about it, a factory is almost the same - an abstraction for CFCs that are also an abstraction.) I guess I feel like if I switch frameworks, I'm going to have to rewrite my controller anyway - not my model. So having this service layer doesn't seem to help. Instead of me doing model.foo(), I'm doing service.foo(), but I'm still writing a new controller anyway. I'm going to think about this more. (Along with all the other stuff this conference is making me reconsider.)

Ah! He just showed something very interesting - an abstraction of his views to support multiple frameworks. He does this by simply breaking up his view like so:

<code>
code specific to get stuff for the framework

cfinclude ....
</code>

Very interesting. This too seems like a bit too much - but I like the approach. (Ok, that sounds like I said I didn't like it and did - sorry. :)

Summary: Very interesting presentation, and I definitely think this was one of the best. (I'm saying that a lot - which I think speaks well for the conference.) I'm not quite sure I agree with everything here - but it is definitely something to think about.