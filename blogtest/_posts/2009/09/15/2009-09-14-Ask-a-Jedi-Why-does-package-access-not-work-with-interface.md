---
layout: post
title: "Ask a Jedi: Why does package access not work with interface?"
date: "2009-09-15T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/15/Ask-a-Jedi-Why-does-package-access-not-work-with-interface
guid: 3526
---

Max wrote in with an interesting question involving ColdFusion Components and Interfaces:

<blockquote>
I just ran into an issue with ColdFusion interfaces. I'm working on a major project, and to ensure security we've set  access="package" on all DAO's. This guarantees that only the other components in the dao-folder can access the database, which is just what we want. In an attempt to create more consistent code, we've decided to let all our DAO's implement an interface, IDAO.cfc. When doing so, we quickly learned that CF8 does not approve of  access="package" in an interface.
<br/><br/>
"Attribute validation error for the CFFUNCTION tag. The value of the ACCESS attribute is invalid. Functions in an interface cannot have PACKAGE access value"
<br/><br/>
What's even worse is that it doesn't help to remove the accces="" from the interface, then it complains of a missmatch in access rights. The result of this is that we must either make all our DAO's public, or skip the interface. Is there a work-around for this? Have you encountered the problem before?
</blockquote>

Well, no, I had not seen it. I've used interfaces in ActionScript before... just a bit... but never in ColdFusion. He sent over a bit of code to help me verify this and I confirmed it. So now the question was why.
<!--more-->
My understanding of interfaces was always that they provided a contract. In other words, anybody who implements me must follow this pattern of methods. In my mind, this made no assumptions about what should be allowed in terms of access types. Therefore, saying that you can't use package, or private, made no sense to me. 

I asked around and got nicely school on this by <a href="http://www.infoaccelerator.net/">Andrew Powell</a>, <a href="http://cdscott.blogspot.com/">Chris Scott</a>, and <a href="http://www.mischefamily.com/nathan/">Nathan Mische</a>. (Very happy we have some super-intelligent folks in this community!) Turns out my main issue was that I had a half-formed concept of what an interface really is. Chris shared this quote from Wikipedia, and I've bolded the part that cleared things up for me:

<blockquote>
Interface generally refers to an abstraction that an entity provides
of itself to the <b>outside</b>. This separates the methods of <b>external
communication</b> from internal operation (for example two different
functions written in C language have the same interface if they have
the same arrangements of arguments and the same type of return value,
but the function body may be implemented in different way), and allows
it to be internally modified without affecting the way <b>outside</b>
entities interact with it, as well as provide multiple abstractions of
itself. It may also provide a means of translation between entities
which do not speak the same language, such as between a human and a
computer. Because interfaces are a form of indirection, some
additional overhead is incurred versus direct communication.
</blockquote>

As you can see - I've bolded all the references to external-ness (not a real word there, but go with me). The interface is meant to create a contract for <b>external</b> uses of things that implement it. In that context, private methods make no sense at all. And to be clear, a CFC that implements an interface can have private methods, you just can't have them in the interface itself. Light bulb moment for myself there.

Does this make sense? I hope so as it has definitely cleared up things for me. I'll also point out that this particular rule for interfaces in ColdFusion <i>is</i> actually <a href="http://livedocs.adobe.com/coldfusion/8/htmldocs/Tags_i_09.html">documented</a>. Thanks Nathan for digging up that link.