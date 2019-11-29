---
layout: post
title: "ColdFusion 8 is bringing the web counter back!"
date: "2008-02-08T13:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/02/08/coldfusion-8-is-bringing-the-web-counter-back
guid: 2641
---

<img src="https://static.raymondcamden.com/images/cfjedi/jt.jpg" align="left" style="margin-right: 10px;margin-bottom: 10px"> Justin Timberlake may be a <i>little</i> more popular than ColdFusion for bringing sexy back, but let me share how ColdFusion 8 is bringing the web counter back. What's the web counter?

Back in the "old" days, your web site wasn't truly a web site until it had a web counter. This little graphical doodad would show you how many visitors had hit your web site. Here is an example:

<img src="https://static.raymondcamden.com/images/cfjedi/Picture%2018.png">

You would paste once of these bad boys on your site and reload your page watching the numbers go up. And if the number actually went up twice in one hit - holy smokes - that means someone else actually hit your web page!

Various services were set up to serve up these counters, and some, like <a href="http://www.sitemeter.com/">Site Meter</a> are still around.

For fun, I decided to try to build one of these myself. I began by creating a simple CFC to handle storing and retrieving counter information. I didn't want to bother with a database and instead just relied on the Server scope. Yes, this means the stats won't really count, but this is all just for fun anyway. Here is what I started off with:

<code>
&lt;cffunction name="init" access="public" returnType="counter" output="false"&gt;
	&lt;cfset initData()&gt;
	&lt;cfreturn this&gt;
&lt;/cffunction&gt;

&lt;cffunction name="initData" access="public" returnType="void" output="false"&gt;
	&lt;!--- setup initial data store. ---&gt;
	&lt;cfif not structKeyExists(server, "counter")&gt;
		&lt;cfset server.counter = structNew()&gt;
	&lt;/cfif&gt;
&lt;/cffunction&gt;

&lt;cffunction name="getCount" access="public" returnType="numeric" output="false"&gt;
	&lt;cfargument name="client" type="string" required="true"&gt;
	
	&lt;cfif not structKeyExists(server.counter, arguments.client)&gt;
		&lt;cfset server.counter[arguments.client] = 0&gt;
	&lt;/cfif&gt;
	
	&lt;cfreturn ++server.counter[arguments.client]&gt;
&lt;/cffunction&gt;
</code>

I should have a few CFLOCKs in there, but again, I wanted to keep it simple. The code will accept any "client" variable which represents the counter. When requested, I use ++X form to both increase the value and return the increased value. (Boy do I love the new syntax features in ColdFusion 8!) I tested this code by itself before adding the image stuff to ensure everything worked fine.

Next I created a method that would generate an image. "Real" hit counters give you multiple options for sizes, counter styles, etc., but I kept mine simple. You can provide an optional background and text color only. I hard coded sizes that I thought made sense. The only complex part was handling the positioning of the numbers. I <a href="http://www.raymondcamden.com/index.cfm/2008/1/16/ColdFusion-8-Image-functions-and-text-size">blogged</a> about how to handle this a few weeks ago. I haven't yet had a chance to add this to <a href="http://imageutils.riaforge.org/">ImageUtils</a> (the project Ben and I started to wrap up common image tasks) but will get to that soon. Here is the code for the function to return the counter image:

<code>
&lt;cffunction name="makeCounter" access="public" returnType="any" output="false"&gt;
	&lt;cfargument name="client" type="string" required="true"&gt;
	&lt;cfargument name="bgcolor" type="string" required="false" default="black"&gt;
	&lt;cfargument name="textcolor" type="string" required="false" default="white"&gt;
	
	&lt;!--- get the number ---&gt;
	&lt;cfset var count = getCount(arguments.client)&gt;
	&lt;!--- make the canvas ---&gt;
	&lt;cfset var img = imageNew("", 150, 40, "rgb", arguments.bgcolor)&gt;
	&lt;!--- set the text props ---&gt;
	&lt;cfset var tProps = {% raw %}{ style='bold', size=24, font='Arial-BoldMT' }{% endraw %}&gt;
	
	&lt;cfset var buffered = imageGetBufferedImage(img)&gt;
	&lt;cfset var context = buffered.getGraphics().getFontRenderContext()&gt;
	&lt;cfset var font = createObject("java", "java.awt.Font")&gt;
	&lt;cfset var textFont = Font.init(tProps.font, Font.BOLD, javacast("int", tProps.size))&gt;
	&lt;cfset var textLayout = createObject("java", "java.awt.font.TextLayout").init(javaCast("string",count), textFont, context)&gt;
	&lt;cfset var textBounds = textLayout.getBounds()&gt;
	&lt;cfset var twidth = textBounds.getWidth()&gt;
	&lt;cfset var theight = textBounds.getHeight()&gt;
	&lt;cfset var newx = ""&gt;
	&lt;cfset var newy = ""&gt;
			
	&lt;!--- text color ---&gt;
	&lt;cfset imageSetDrawingColor(img, arguments.textColor)&gt;

	&lt;!--- handle centering crap ---&gt;	
	&lt;!---
	when drawing text, you specify X, Y as the bottom left corner.
	So we need to position ourselves at Total Height / 2 + Height of Text / 2
	---&gt;
	&lt;cfset newx = (img.width/2 - tWidth/2)&gt;
	&lt;cfset newy = (img.height/2 + tHeight/2)&gt;

	&lt;cfset imageDrawText(img, count, newx, newy, tProps)&gt;

	&lt;cfreturn img&gt;
&lt;/cffunction&gt;
</code>

As you can see, more than 50% of the code is just for positioning the darn text, so if I did have that nice UDF handy, the function would have been a heck of a lot slimmer. 

All that's left now is a file to spit out the image. Let's look at how I did that:

<code>
&lt;cfparam name="url.client" default=""&gt;
&lt;cfparam name="url.bgcolor" default=""&gt;
&lt;cfparam name="url.textcolor" default=""&gt;

&lt;cfif not len(url.client)&gt;
	&lt;cfthrow message="You must supply a Client variable in the query string."&gt;
&lt;/cfif&gt;

&lt;cfinvoke component="#application.counter#" method="makeCounter" returnVariable="img"&gt;
	&lt;cfinvokeargument name="client" value="#url.client#"&gt;
	&lt;cfif len(url.bgcolor)&gt;
		&lt;cfinvokeargument name="bgcolor" value="#url.bgcolor#"&gt;
	&lt;/cfif&gt;
	&lt;cfif len(url.textcolor)&gt;
		&lt;cfinvokeargument name="textcolor" value="#url.textcolor#"&gt;
	&lt;/cfif&gt;
&lt;/cfinvoke&gt;

&lt;cfset bos = CreateObject("java","java.io.ByteArrayOutputStream").init()/&gt;
&lt;cfset imageio = CreateObject("java","javax.imageio.ImageIO").write(imagegetbufferedimage(img), "PNG", bos)/&gt;
&lt;cfset bos.close()/&gt;

&lt;cfcontent type="images/gif" variable="#bos.toByteArray()#" reset="true"&gt;
</code>

The code begins with a few cfparams and validation on the client variable. I then call my component and pass in the relevant values. So far so good. Now what the heck is the Java?

ColdFusion 8 has a bug with images created using imageNew that are <b>not</b> based on a 'real' image. If you try to get the binary data from the image, or try to pass it to cfcontent, you will get an image.

<a href="http://www.cfinsider.com/">Jason Delmore</a> of Adobe came up with this solution. It provides an alternate way to get binary data out and then supply it to the cfcontent tag. I'll be adding this to ImageUtils too!

So now that I've gone through all of that, here is a simple counter for the client parishilton:

<!--
<img src="http://www.coldfusionjedi.com/demos/counterservice/image.cfm?client=parishilton">
-->
<i>Sorry, old demos are removed.</i>

The URL I used was http://www.coldfusionjedi.com/demos/counterservice/image.cfm?client=parishilton.

Now let's make it a bit fancier and supply some colors:
<!--
<img src="http://www.coldfusionjedi.com/demos/counterservice/image.cfm?client=parishilton&bgcolor=pink&textcolor=green">

That URL was http://www.coldfusionjedi.com/demos/counterservice/image.cfm?client=parishilton&bgcolor=pink&textcolor=green.
-->
<i>Sorry, old demos are removed.</i>

Note - I ran into a font issue when moving my sample code from my Mac to my Windows machine. The code on the live server is using "Arial Black" for the font instead of the one specified in the code above.

So a total waste of time - but a fun way to spend lunch. Enjoy!