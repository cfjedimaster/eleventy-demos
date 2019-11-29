---
layout: post
title: "Using a background with a Flex Mobile project"
date: "2011-08-24T13:08:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2011/08/24/Using-a-background-with-a-Flex-Mobile-project
guid: 4338
---

Earlier this week I started work on a new NookColor app (already done and submitted). One of the minor design elements I wanted was a simple background using a graphic. I had assumed this would be a simple matter. It's already easy to set a background color. However this turned out to be slightly more complex than I imagined. What follows is an example of how it can be done. Credit for this goes to <a href="http://blogs.adobe.com/jasonsj/">Jason San Jose</a> and <a href="http://devgirl.org/">Holly Schinsky</a>. Please note that part of this blog entry is my understanding of what's going on and there is a strong possibility I could be wrong. Any mistakes - blame me. If it's perfect - thank them. ;)

<p/>
<!--more-->
Let's start off with a super simple Flex Mobile application. I've got a view based application with one view. Here's the top level Application.

<p/>

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:ViewNavigatorApplication xmlns:fx="http://ns.adobe.com/mxml/2009" 
							xmlns:s="library://ns.adobe.com/flex/spark" firstView="views.BGTestHomeView"&gt;
	&lt;fx:Declarations&gt;
		&lt;!-- Place non-visual elements (e.g., services, value objects) here --&gt;
	&lt;/fx:Declarations&gt;
&lt;/s:ViewNavigatorApplication&gt;
</code>

<p/>

And here is my view: 

<p/>

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="HomeView"&gt;
	&lt;fx:Declarations&gt;
		&lt;!-- Place non-visual elements (e.g., services, value objects) here --&gt;
	&lt;/fx:Declarations&gt;
	
	&lt;s:VGroup horizontalAlign="center" paddingTop="10" paddingLeft="10" paddingRight="10" paddingBottom="10" width="100{% raw %}%" height="100%{% endraw %}" verticalAlign="middle"&gt;
		&lt;s:Label text="Mobile Apps Rule!" width="75%" fontSize="50" textAlign="center"  /&gt;		
	&lt;/s:VGroup&gt;
	
&lt;/s:View&gt;
</code>

<p>

Which produces the lovely...

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip160.png" />

<p>

Now - if I want to add a background color, I can do so in two places - either the root app (ViewNavigatorApplication) or the view. Putting it in the root will only work for a brief second. You can see the background color for a second right before the view loads. So let's just put it in the view.

<p>

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="HomeView" backgroundColor="blue"&gt;
	&lt;fx:Declarations&gt;
		&lt;!-- Place non-visual elements (e.g., services, value objects) here --&gt;
	&lt;/fx:Declarations&gt;
	
	&lt;s:VGroup horizontalAlign="center" paddingTop="10" paddingLeft="10" paddingRight="10" paddingBottom="10" width="100{% raw %}%" height="100%{% endraw %}" verticalAlign="middle"&gt;
		&lt;s:Label text="Mobile Apps Rule!" width="75%" fontSize="50" color="white" textAlign="center"  /&gt;		
	&lt;/s:VGroup&gt;
	
&lt;/s:View&gt;
</code>

<p>

Note the addition of "blue" to the View as well as the white color for the label. This creates this awesomely pretty view:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip161.png" />

<p>

Ok. So when I first discovered this, I assumed that there was probably some other argument, like backgroundImage or some such, that would just as easy. Unfortunately that's not the case. Some Googling turned up a few blog posts talking about how to do it for Flex 4 apps in general. The recommendation was to create a skin for the application as a whole. You can do this in pure ActionScript or MXML. Here's my attempt with MXML.

<p>

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:ViewNavigatorApplication xmlns:fx="http://ns.adobe.com/mxml/2009" 
							xmlns:s="library://ns.adobe.com/flex/spark" firstView="views.BGTestHomeView" skinClass="skins.myAppSkin"&gt;
	&lt;fx:Declarations&gt;
		&lt;!-- Place non-visual elements (e.g., services, value objects) here --&gt;
	&lt;/fx:Declarations&gt;
&lt;/s:ViewNavigatorApplication&gt;
</code>

<p>

Note the change here - I've added skinClass. Let's look at that file.

<p>

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:Skin name="CustomApplicationSkin"
		xmlns:fx="http://ns.adobe.com/mxml/2009"
		xmlns:s="library://ns.adobe.com/flex/spark"
		 &gt;

	&lt;fx:Metadata&gt;
		&lt;![CDATA[ 
		[HostComponent("BGTest")]
		]]&gt;
	&lt;/fx:Metadata&gt; 
	
	&lt;s:states&gt;
		&lt;s:State name="normal" /&gt;
		&lt;s:State name="disabled" /&gt;
	&lt;/s:states&gt;
	
	&lt;s:BitmapImage width="100{% raw %}%" height="100%{% endraw %}" source="@Embed('/images/grass.jpg')"/&gt;
	
	&lt;s:Group id="contentGroup" width="100{% raw %}%" height="100%{% endraw %}" minWidth="0" minHeight="0" /&gt;
	
	&lt;s:ViewNavigator id="navigator" width="100{% raw %}%" height="100%{% endraw %}" /&gt;

&lt;/s:Skin&gt;
</code>

<p>

At first I kind of thought of the skin file like a CSS sheet, where I'd specify just what I wanted to change. But - it's more like a "skeleton" or outline for your entire application. Notice I included the viewNavigator in there. And my content group. This is - from what I understand - the default way the mobile application would be laid out anyway. So my modification then was to simply include the image. End of story, right? Not exactly.

<p>

Turns out this "works", but the View ends up covering the background picture. This is where Jason's tip came in. If we go into our view and set the alpha of the background like so:

<p>

<code>
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="HomeView" backgroundAlpha="0"&gt;
</code>

<p>

We allow the content to show the background behind it. Here's the complete view. I added a black background to the label as well.

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" title="HomeView" backgroundAlpha="0"&gt;
	&lt;fx:Declarations&gt;
		&lt;!-- Place non-visual elements (e.g., services, value objects) here --&gt;
	&lt;/fx:Declarations&gt;
	
	&lt;s:VGroup horizontalAlign="center" paddingTop="10" paddingLeft="10" paddingRight="10" paddingBottom="10" width="100{% raw %}%" height="100%{% endraw %}" verticalAlign="middle"&gt;
		&lt;s:Label text="Mobile Apps Rule!" width="75%" fontSize="50" color="white" textAlign="center" backgroundColor="black"  /&gt;		
	&lt;/s:VGroup&gt;
	
&lt;/s:View&gt;
</code>

<p>

And the result:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip162.png" />

<p>

Awesome. I bet you didn't know I was such a good designer, did you? As I said, this solution may not be 100% accurate across all situations, and there may be other ways of doing this, but I hope this is helpful to others.