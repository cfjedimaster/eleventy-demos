---
layout: post
title: "ColdFusion 8 Image functions and text size"
date: "2008-01-16T15:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/16/ColdFusion-8-Image-functions-and-text-size
guid: 2597
---

One of the things that I've been curious about for a while now is if there was a way to determine the <i>graphical</i> size of text when drawing in ColdFusion 8. Why would you need to care about that? While ColdFusion 8 lets you easily draw text on an image, there is no easy way to center it. In order to center it, you need to know the size of the text. Today in CF-TALK this issue came up in a <a href="http://www.houseoffusion.com/groups/cf-talk/thread.cfm/threadid:54828#296562">thread</a>.
<!--more-->
A user named C S (not sure of his real name) provided the following code which works just dandy:

<code>
&lt;cfscript&gt;
  buffered = ImageGetBufferedImage(theColdFusionImage);
  context = buffered.getGraphics().getFontRenderContext();
  Font = createObject("java", "java.awt.Font");
  // font name, style and size
  textFont = Font.init( "Arial", Font.ITALIC, javacast("int", 15));
  textLayout = createObject("java", "java.awt.font.TextLayout").init( text, textFont, context);
  textBounds = textLayout.getBounds();
  dimen.width = textBounds.getWidth();
  dimen.height = textBounds.getHeight();
&lt;/cfscript&gt;

&lt;cfdump var="#dimen#"&gt;
</code>

Ben Nadel then chimed in and pointed out a <a href="http://www.bennadel.com/blog/977-ColdFusion-8-ImageDrawTextArea-Inspired-By-Barney-Boisvert-.htm">cool blog entry</a> where he describes how you can take a text string, provide a bounding box, and his UDF will wrap the text correctly within the box. His work was inspired by yet another <a href="http://www.barneyb.com/barneyblog/2007/09/27/wednesday-contest-solution-pt-1/">blog post</a> by Barney Boisvert.

With me so far? ;) So the issue of centering text now becomes simple. When you draw text, the X and Y represent the bottom left corner of the text block. So to center, you simply place the X at: Canvas Width/2 - Text Width/2. Height is the reverse: Canvas Height/2 + Text Height/2. 

Here is a complete example. If you change the text, it should re-center accordingly.

<code>
&lt;cfset canvas = imageNew("",500,500,"rgb","yellow")&gt;
&lt;cfset text = "Paris Hilton kicks butt!"&gt;

&lt;cfscript&gt;
  buffered = ImageGetBufferedImage(canvas);
  context = buffered.getGraphics().getFontRenderContext();
  Font = createObject("java", "java.awt.Font");
  // font name, style and size
  textFont = Font.init( "Arial-Black", Font.ITALIC, javacast("int", 15));
  textLayout = createObject("java", "java.awt.font.TextLayout").init( text, textFont, context);
  textBounds = textLayout.getBounds();
  dimen.width = textBounds.getWidth();
  dimen.height = textBounds.getHeight();
&lt;/cfscript&gt;

&lt;cfdump var="#dimen#"&gt;

&lt;!--- 
when drawing text, you specify X, Y as the bottom left corner.
So we need to position ourselves at Total Height / 2 + Height of Text / 2
---&gt;
&lt;cfset attr = {% raw %}{ font="Arial-Black", size="15", style="italic"}{% endraw %}&gt;
&lt;cfset newx = (canvas.width/2 - dimen.width/2)&gt;
&lt;cfset newy = (canvas.height/2 + dimen.height/2)&gt;
&lt;cfset imageSetDrawingColor(canvas,"black")&gt;
&lt;cfset imageDrawText(canvas,text, newx, newy, attr)&gt;

&lt;cfimage action="writeToBrowser" source="#canvas#"&gt;
</code>

There <i>is</i> a reason for all of this that I'll explain later in the week (for my Friday contest probably).