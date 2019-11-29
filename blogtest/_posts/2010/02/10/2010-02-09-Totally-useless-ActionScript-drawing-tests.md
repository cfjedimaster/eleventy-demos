---
layout: post
title: "Totally useless ActionScript drawing tests"
date: "2010-02-10T09:02:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2010/02/10/Totally-useless-ActionScript-drawing-tests
guid: 3715
---

Last night I made time to look at something I've been meaning to check out for years - drawing with ActionScript. While I have absolutely no need for this at all, it's something I've meant to take a look at. I've only looked at a few pages of the <a href="http://livedocs.adobe.com/flex/3/html/help.html?content=Part6_ProgAS_1.html">drawing API</a> so far, but it was enough to do a few experiments in AIR. I began with the recreation of something I wrote once in AppleSoft BASIC, my very first programming language.

<p>

This code simply begins at the top left corner of the screen and draws to the bottom. It then inches down the left side and moves the bottom towards the right. Here is the complete code listing. I have to thank the writers <a href="http://www.actionscript.org/forums/archive/index.php3/t-121971.html">here</a> for helping me get the Shape object onto the Flex screen. (And please - remember - I spent like 5 minutes on this - the code is horrible I'm sure.)

<p>

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:WindowedApplication xmlns:mx="http://www.adobe.com/2006/mxml" layout="absolute" creationComplete="init()"&gt;

	&lt;mx:Script&gt;
	&lt;![CDATA[

	public function init():void {

		var myLine:Shape = new Shape()
		myLine.graphics.lineStyle(1, 0x990000, 1)
		
		for(var i:int=1; i&lt;screen.height; i=i+5) {
			myLine.graphics.moveTo(1, i)
			myLine.graphics.lineTo(1+i, screen.height)
		}
		
		this.rawChildren.addChild(myLine)

		
	}

	]]&gt;
	&lt;/mx:Script&gt;

&lt;/mx:WindowedApplication&gt;
</code>

<p>

Even if you don't know ActionScript, you can probably read that and grok what it is doing. The output - which actually looked much cooler on my Apple 2e's monochrome screen is this:

<p>

<img src="https://static.raymondcamden.com/images/Screen shot 2010-02-10 at 8.12.52 AM.png" />

<p>

I then followed up with something a bit more random:

<p>

<code>
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;mx:WindowedApplication xmlns:mx="http://www.adobe.com/2006/mxml" layout="absolute" creationComplete="init()"&gt;
	
	&lt;mx:Script&gt;
		&lt;![CDATA[
	
			public function init():void {
				drawIt()
			}
			
			public function drawIt():void {
				var myLine:Shape = new Shape()
				myLine.graphics.lineStyle(1, 0x990000, 1)

				var initx:int = 1;
				var inity:int = 1;
				var newx:int;
				var newy:int;
				
				myLine.graphics.moveTo(initx, inity)

				//Draw 20 lines
				for(var i:int=1; i&lt;=20; i++) {
					//pick new position
					newx = Math.round(Math.random() * screen.width)+1;
					newy = Math.round(Math.random() * screen.height)+1;
					myLine.graphics.lineTo(newx, newy)
						
				}
				
				this.rawChildren.addChild(myLine)
				
				
			}
			
		]]&gt;
	&lt;/mx:Script&gt;
	
	&lt;mx:Button label="Redraw" x="1" y="1" click="drawIt()" /&gt;
	
&lt;/mx:WindowedApplication&gt;
</code>

<p>

In this example, I simply draw from one random position to the next. I added a button so I could run it multiple times. 

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2010-02-10 at 8.14.12 AM.png" />

<p>

Awesome, eh? I won't be winning any awards yet. What I need to learn next is: 

<p>

<ul>
<li>When I put the shape onto the Flex screen, I lose access to it. I want to keep working with it, but I'm not sure how.
<li>In the second example, the button ends up getting drawn over. Is there a way to handle z-index?
</ul>