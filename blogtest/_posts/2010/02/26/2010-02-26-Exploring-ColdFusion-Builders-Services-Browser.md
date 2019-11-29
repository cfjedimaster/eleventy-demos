---
layout: post
title: "Exploring ColdFusion Builder's Services Browser"
date: "2010-02-26T13:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/02/26/Exploring-ColdFusion-Builders-Services-Browser
guid: 3735
---

Today I thought I'd take a look at ColdFusion Builder feature I had not paid much attention to - the Services Browser. The Services Browser has a couple of interesting functions in it that you might find pretty darn useful. Let's take a look at a sample view first:

<p/>
<!--more-->
<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-02-26 at 12.16.28 PM.png" title="Services Browser window" />
<p/>

As you can see, the Services Browser primary role is to list all the CFCs defined for a server. It creates a package base listing of each CFC. You can expand a package to see individual CFCs, and then expand a CFC to see the physical file path (which oddly you can't use as a quick way to open the file) and then each method.
<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-02-26 at 12.18.33 PM.png" title="One particular CFC." />
<p/>

Notice right away this is much more detailed then the outline view. You can see a list of arguments as well as a return type. If you expand the method itself you see details on the arguments:
<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-02-26 at 12.20.39 PM.png" />
<p/>

Another important difference between this and the Outline view is that the Services view is <b>not</b> tied to your current page. So if you want to work on test.cfm and see test.cfc, you would use the Services panel. 
<p/>

You also have some code writing options available. Right clicking on a CFC gives you the option to insert a CFObject or createObject. Here is an example of that:
<p/>

<code>
&lt;cfobject 
	 name="base" 
	 component="collyba.services.base" /&gt;
createObject("component", "collyba.services.base").init()
</code>

<p/>

You can also right click on a particular method and select to insert a cfinvoke or createObject. Here is an example of that:

<p/>

<code>
&lt;cfinvoke 
	component="collyba.services.chatService" 
	method="createNewChatRoom"  
	returnVariable="chatService" &gt;
	&lt;cfinvokeargument name="service" value="" /&gt;
	&lt;cfinvokeargument name="roomname" value="" /&gt;
&lt;/cfinvoke&gt;
createObject("component", "collyba.services.chatService").createNewChatRoom(service, roomname);
</code>

<p/>

On top of the Services view are some interesting buttons:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-02-26 at 12.24.38 PM.png" title="Buttons, buttons, and more buttons" />

<p/>

The first button simply shows or hides "system" CFCs. It isn't entirely clear what they mean by that, but when I toggled it it simply hid CFCs under cfdocs and CFIDE. The ones next to it are more interesting. They allow you to toggle visibility based on access type. This could be a great way to just show remote methods for example. 

<p/>

Last but not least I want to point out two more buttons on the upper right side of the view:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-02-26 at 12.31.23 PM.png" title="Show CFCs/Web Services" />

<p/>

This button let's you toggle between CFCs and web services. Once you switch to web services, you will be presented with an empty view. There will be two red buttons (kinda surprised - red typically implies an error) for adding and removing web service URLs. I don't know about you, but I can probably read Klingon better than I could read WSDL. Here is a sample from NOAA:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-02-26 at 12.36.59 PM.png" title="Only the Borg read WSDL" />

<p/>

Pretty handy, right? As a final FYI, I've added a new <a href="http://www.raymondcamden.com/index.cfm/ColdFusion-Builder">ColdFusion Builder</a> category to my blog. I've added my older CFB-related entries to it and will be using this category from now on. I'd also love to get questions/suggestions/etc for future CFB related topics.