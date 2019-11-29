---
layout: post
title: "Question for Readers: Flex alignment with textarea controls"
date: "2009-02-23T12:02:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2009/02/23/Question-for-Readers-Flex-alignment-with-textarea-controls
guid: 3249
---

Here is an odd one for you. Consider the following Flex code:

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:Application xmlns:mx="http://www.adobe.com/2006/mxml" layout="vertical" horizontalAlign="left"&gt;
	
	&lt;mx:VBox paddingLeft="10" paddingRight="10" width="80%"&gt;
		
		&lt;mx:Label text="First Label"  /&gt;
		&lt;mx:TextArea borderColor="#ff0000" borderThickness="3"/&gt;
		&lt;mx:Label text="Second Label" /&gt;

	&lt;/mx:VBox&gt;
	
&lt;/mx:Application&gt;
</code>

You would expect 3 items to show up, left aligned, in a VBox, and you get that of course, but the textarea is <i>very</i> slightly more to the left than the two labels. Check out this screen shot where I placed another window directly above the left edge of the text:

<img src="https://static.raymondcamden.com/images//Picture 141.png">

Notice the red border is very slightly smaller than the other ones. If I remove the borderColor and set borderThickness to 0, it is still there:

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 221.png">

It almost seems as if Flex is aligning by the text of the TextArea control. In other words, when I typed in there it seemed as if that was the 'line' Flex used to line up all 3 controls, as opposed to the 'chrome' of the TextArea.

So am I seeing things, or is that what really is happening? And if so, is there where to align it by the chrome, not the text?