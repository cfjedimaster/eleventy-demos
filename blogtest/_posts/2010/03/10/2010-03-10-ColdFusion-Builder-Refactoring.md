---
layout: post
title: "ColdFusion Builder - Refactoring"
date: "2010-03-10T15:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/03/10/ColdFusion-Builder-Refactoring
guid: 3744
---

I don't know about you - but every time I hear about refactoring in an IDE, I break out in a case of the cold sweats. It's the same way I feel about multi-file search and replace. Sure it's a great feature, but the idea of updating hundreds of files at one time and <i>not</i> screwing up just freaks me out. That being said, I decided to just get over my fears and take a quick look at <a href="http://help.adobe.com/en_US/ColdFusionBuilder/Using/WS0ef8c004658c1089-554789f8121af8f0c8c-7fe9.html">refactoring</a> in ColdFusion Builder. To be honest, I would not have played with this feature at all if I hadn't discovered that it has a preview function. So if the thought of accidentally spreading a typo across a thousand files worries you as well - at least know that you can see exactly what changes will be made before committing to actually modifying your files.
<!--more-->
ColdFusion Builder supports refactoring in two main areas. Let's begin by looking at the first - file renaming. If you right click on a file in your project, you can select Refactor/Rename. In my first experiment with this feature, I tried to rename org/camden/blog/blog.cfc to xxblog.cfc:

<img src="https://static.raymondcamden.com/images/Screen shot 2010-03-10 at 2.12.17 PM.png" title="Refactor a CFC Name" />

I clicked preview and got the following:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-03-10 at 2.13.19 PM.png" title="CFC Refactor Preview" />

As you can see, there is a list of 'tasks' that includes both the file rename and code changes. Notice that it detected that blog.cfc used it's own name in the return of the init method. It correctly knew that it needed to rename the type. Unfortunately, it did not recognize the fact that my Application.cfm file had a createObject pointing to the CFC. So in this case, it wasn't perfect.

I then tried a second test - a rename of my layout.cfm custom tag, which is used in many places:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-03-10 at 2.16.21 PM.png" title="Refactor a CFM" />

This time it seemed to work perfectly. It caught all the files making use of the custom tag. Also note the checkboxes. I could selectively turn off any modification if I see a potential problem. All in all, a pretty cool example! 

The second place you can do refactoring is with UDF/CFC method names. So for example, consider the renderEntry method in BlogCFC. It is the core blog entry rendering method and its called in quite a few places. I opened up blog.cfc in my editor, found renderEdit, right clicked and selected Refactor/Rename again. For my new name I picked renderSexier:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-03-10 at 2.21.05 PM.png" title="Result of refactoring a method" />

Again, it looks to me like it successfully found the uses. Do folks think they would make use of this?