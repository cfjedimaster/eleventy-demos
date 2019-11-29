---
layout: post
title: "Frameworks Conference: Leveraging ColdSpring To Make Better Applications - Kurt Wiersma"
date: "2007-02-02T09:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/02/Frameworks-Conference-Leveraging-ColdSpring-To-Make-Better-Applications-Kurt-Wiersma
guid: 1812
---

ColdSpring is something I've been meaning to look at for quite some time, so I was very interested in this presentation from Kurt. As before - pardon any randomness/scatteredness of the notes.

Kurt described CF almost like a box of legos - holding all of your components. 

Life before CS - lots of createObjects, manual services, difficult testing.  His old code (which looks a lot like most of mine), contains numerous createObject type calls. After CS - his code now uses get/set so that needed CFCs are passed in.

Main point of CS: make configuration and dependencies of CFCs easier to manage. CS enables dependency injection (Inversion of Control). Unlike the factory (see my <a href="http://ray.camdenfamily.com/index.cfm/2007/2/2/Frameworks-Conference-Intro-to-Object-Factories--Rob-Gonda">earlier post</a>), my CFC has the things it needs passed to it.

Interesting - so CS uses an XML file to describe all the CFCs and what they need. But - CS is smart enough to actually look at your CFC and if it sees the right methods, it knows what to do anyway. Kurt made the point though that it is nicer to keep the XML there anyway so you can see what is going on. 

By default CS will create singletons (just think of this as a single instance of a CFC, not multiple instances). 

Another big aspect of CS is AOP (Aspect-Oriented Programming). Allows you to generate remotely accessible objects (think support for Flash Remoting). Plugins available for Fusebox, Mach-II, Model-Glue. It can also integrate with a factory. Configured via XML. I if I get it - it looks like there is a style of CFC you can use that will work with CS and provide the remote API and connection to core CFCs. Don't think I got it completely yet but it looked interesting. AOP is useful for security, caching, logging, via remote methods. Basically allowing a remote API and being able to intercept and do stuff before/after the method is called. 

Summary: After this presentation and the object factories one by Rob Gonda, I'm more than convinced I have to change how I'm creating my CFCs in my applications.