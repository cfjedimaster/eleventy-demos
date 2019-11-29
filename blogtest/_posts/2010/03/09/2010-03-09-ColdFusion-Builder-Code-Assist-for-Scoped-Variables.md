---
layout: post
title: "ColdFusion Builder - Code Assist for Scoped Variables"
date: "2010-03-09T13:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2010/03/09/ColdFusion-Builder-Code-Assist-for-Scoped-Variables
guid: 3743
---

Heres an interesting ColdFusion Builder feature you may not be aware of. CFBuilder does a good job providing code assistance for CFCs. So for example, consider the following code snippet:

<code>
&lt;cfset ob = createObject("component", "test")&gt;
&lt;cfoutput&gt;#ob.
</code>

As soon as I hit the dot, CFBuilder introspected my test component and provided the following visual feedback:

<img src="https://static.raymondcamden.com/images/Screen shot 2010-03-09 at 12.38.52 PM.png" title="CFBuilder CFC assist" />

CFBuilder is even smart enough to notice private methods. When I changed my drinkBeer to a private method (which sounds kinda sad), it didn't show up in the drop down. However, most of the time we don't work with CFCs like that. Instead we create them on application start up and store them in the Application scope. Wouldn't it be nice if you could get the same code assistance after typing the application scope version of the CFC? The good news is that you can.

In order to use this feature, you need to go into your project properties. Once you've loaded the project pane, select: "ColdFusion Variable Mappings":

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-03-09 at 12.42.53 PM.png" title="ColdFusion Variable Mappings" />

For my test, I'm working within the BlogCFC project. I'm going to create a mapping between application.blog and the CFC:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-03-09 at 12.44.03 PM.png" title="Adding my variable mapping" />

Once I've done that I can then get code assistance on my application variable:

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-03-09 at 12.45.01 PM.png" title="Code hints for BlogCFC" />

Pretty nifty, eh? As you can guess, setting up these mappings will be a manual process. However, in most projects I'd assume you have a core set of CFCs that act as services. While you may have a large number of components in play, the "core" ones you use will probably be a smaller number. A few minutes of set up and your good to go. One little nit - be sure not to typo. For some reason Adobe included the ability to add and delete mappings, but not to <i>edit</i> them.