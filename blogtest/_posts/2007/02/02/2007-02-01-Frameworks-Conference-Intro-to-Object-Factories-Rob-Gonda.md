---
layout: post
title: "Frameworks Conference: Intro to Object Factories - Rob Gonda"
date: "2007-02-02T08:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/02/02/Frameworks-Conference-Intro-to-Object-Factories-Rob-Gonda
guid: 1811
---

Talked about how developers moved to using CFCs and ended up with "The Big Object." (Take a look at BlogCFC.) 
Other problems you can get into with CFCs include:
<!--more-->
Who creates the object? Who inits it? What is required to init a CFC? In other words, if component A makes an instance of component B and the requirements for creating B changes, you now have multiple places to update it.<br>
What about the relationships between objects?<br>
What if you move stuff?<br>
Unit testing - how do you unit test A if it depends on B? 

Here is where design patterns can help us out. The pattern covered is the Object Factory. 

It handles created objects. One place to create objects. All objects need the factory (so its passed to all objects)

Inversion of Control (IoC) takes it farther. Dependency Injection - this is a form of IoC. Again - it is about moving the responsibility of creating objects from N components to 1 component. 3 types of DI: setter, constructor, and interface-based injection. 

ColdSpring - this is an IoC framework. Allows for CFC dependency injection. Borrows XML syntax from Spring (but is not a real port).

Rob used Galleon as a good example of how the factory can help approve code, and I couldn't agree more. 

Very, very darn good presentation by Rob. I'm going to try to build an object factory for my readers next week to show a good example.