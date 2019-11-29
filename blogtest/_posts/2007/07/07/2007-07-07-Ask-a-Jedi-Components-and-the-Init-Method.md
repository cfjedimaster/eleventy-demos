---
layout: post
title: "Ask a Jedi: Components and the Init Method"
date: "2007-07-07T17:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/07/Ask-a-Jedi-Components-and-the-Init-Method
guid: 2178
---

Joel asks:

<blockquote>
I did have a particular question about the cfc's lecture,
specifically about the "init" method which you covered.  I am having a difficult time getting my brain around how this works and what relationship it has to other functions in the component. 

For example, lets' say I have 2 simple
methods, getBooks and createBook in my component.  How could I use an init method to make this component perform better/more efficiently? 

As I understand it from the lecture, I could presumably create an instance of the component with init--say in the App.cfc--which would basically make an empty or
generic book in memory.  From here, when I need to deal with the the additional methods (get and create), I could invoke the already created instance (from the init).  Am I getting this right, or is there something I'm missing?
</blockquote>

Let's take a step back as it may make it a bit easier to understand why you would want to use an init method in your CFC. First, imagine that CFC you described above, with two methods. Imagine they both need to work with a datasource. You could imagine both methods than taking an argument for the datasource.

Ok, so far so good. Now imagine they both need to know where a media folder is. Ok, so just add another argument. So now every method in your CFC (which now is just two, but would obviously grow) has 2 additional arguments. This ends up being a lot more work. 

As you know, CFCs have their own variables scopes. There is a private Variables scope and a public This scope. If the CFC itself is persisted, then these variables can store information (like a DSN, a media path, etc), that methods can use. 

So to make your CFC easier to use, you can add a setDataSource and a setMediaPath method. This would let you set up the values that other methods would use. 

Problem solved. But as a pure convenience, it would be nice if you could create your CFC and set up all the values at the same time. That is where the init method comes in. You can think of the init method as simply a way of creating and setting up the CFC for future use. It's like going to the car dealership and asking for a car that has the seat set up correctly and the right radio stations already tuned in. You don't have to do it yourself, it just comes out properly setup. 

Does this make sense?