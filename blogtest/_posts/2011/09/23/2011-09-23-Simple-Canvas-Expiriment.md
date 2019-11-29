---
layout: post
title: "Simple Canvas Experiment"
date: "2011-09-23T18:09:00+06:00"
categories: [html5]
tags: []
banner_image: 
permalink: /2011/09/23/Simple-Canvas-Expiriment
guid: 4372
---

I've been giving the HTML5 Canvas tag a bit of a hard time. It's not that I'm against the feature in general, I just don't think <i>most</i> of the example use cases are actually practical. I love coding for coding's sake as much as anyone else. But if you are trying to sell me on using a feature, I need to see some examples of how I'd actually use the tag on a real web site. I think Canvas works great for charting, but I've been trying to come up with additional examples of where it could be practical. Unfortunately, this is probably not a <i>really</i> practical example. But, it was fun to right, so being Friday afternoon I'm invoking my right to spend some time learning something by writing some code that will probably never be used.

<p/>
<!--more-->
For my example, I wanted to build code that would create a grid. I've been looking at grids quite a bit lately as my wife is in College Algebra. She is doing a lot of work with linear equations and graphing, and I thought it might be interesting to write some Canvas code that would generate a grid and then allow me to plot arbitrary points. I'll share the entire template (and a demo will be linked to at the end) and go over the code bit by bit.

<p/>

<code>
&lt;html&gt;
	
&lt;head&gt;
&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function() {

	var plot = $("#plot")[0];
	var canvasWidth = plot.width;
	var canvasHeight = plot.height;
	var canvas = plot.getContext("2d");
	var tickWidth = "";
	var radius="";
	
	console.log("My plot is "+canvasWidth+" wide by "+canvasHeight+" high");
	
	//Given a value N which represents how many hashes to max on the axis, I draw
	//a grid with N hashes on each side of the axis
	function drawGrid(n) {

		//tick width is how far between hashes
		tickWidth = canvasWidth/(n*2);
		//tick length is how big to make it
		var tickLength = canvasHeight/40;
		//radius, which is used later, is also based on size
		radius = canvasWidth/100;
		
		console.log("Tick width is "+tickWidth);

		//y axis
		canvas.moveTo(canvasWidth/2,0);
		canvas.lineTo(canvasWidth/2, canvasHeight);		
		canvas.stroke();

		//x axis
		canvas.moveTo(0, canvasHeight/2);
		canvas.lineTo(canvasWidth, canvasHeight/2);
		canvas.stroke();
		
		//now for the ticks on the y-axis, yes, 
		//we end up 'drawing over' the x-axis one
		canvas.beginPath();
		canvas.moveTo(canvasWidth/2, 0);
		
		for(var i=1; i&lt;(n*2); i++) {
			console.log(i+ " Moving to "+(canvasWidth/2-tickLength)+","+(i*tickWidth));
			canvas.moveTo(canvasWidth/2-tickLength, i*tickWidth);
			canvas.lineTo(canvasWidth/2+tickLength, i*tickWidth);

			canvas.stroke();
		} 

		//now for the ticks on the x-axis, yes, 
		//we end up 'drawing over' the y-axis one
		canvas.beginPath();
		canvas.moveTo(0, canvasHeight/2);
		
		for(var i=1; i&lt;(n*2); i++) {
			console.log(i+ " Moving to "+(i*tickWidth)+","+(canvasHeight/2-tickLength));
			canvas.moveTo(i*tickWidth,canvasHeight/2-tickLength);
			canvas.lineTo(i*tickWidth,canvasHeight/2+tickLength);

			canvas.stroke();
		} 
		
			
	}
	
	function drawPoint(point) {
		var x = point[0];
		var y = point[1]; 
		console.log("going to draw point "+x+","+y);
		canvas.beginPath();
		canvas.arc(canvasWidth/2+(x*tickWidth), canvasHeight/2-(y*tickWidth), radius, 0, Math.PI * 2, false);
		canvas.closePath();
		canvas.stroke();
		canvas.fill();
		
	}

	drawGrid(10);
	//initial data points
	var points = [
		[1,2],
		[2,4],
		[-2,6],
		[2,1],
		[-4,-4]
		];
		
	$.each(points, function(n,point) {
		drawPoint(point);
	});
})
&lt;/script&gt;
&lt;style&gt;
	canvas {
		background-color:ghostwhite;
	}
&lt;/style&gt;	
&lt;/head&gt;

&lt;body&gt;
	
	&lt;canvas id="plot" width="500" height="500"&gt;&lt;/canvas&gt;
	
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

I decided to use jQuery for this even though I really didn't make heavy use of it. I think I have a grand total of one selector and the each() operator. If this were production code I'd not use jQuery just for that. That being said, jQuery makes everything a little more awesome. Like unicorns and rainbows. So why <i>not</i> include it? 

<p>

On top of my code I've got a few variables I'll be using throughout. You can see where I create a canvas object (basically by taking the canvas tag and grabbing the 2d context). I remember the size of the canvas tag and have a few other variables that will be setup later on.

<p>

The first big function, drawGrid, handles drawing the X and Y axis as well as the hash marks. In general this is just simple math. The size of my "ticks" are based on the total height and sized to what I thought looked nice. You can see I set up my radius value here too. This will be used later on when drawing points. 

<p>

The drawPoint method simply handles inverting a simple X,Y coordinate to the right position for a Canvas element. Canvas treats the upper left corner as 0,0, so once again math is used to treat 0,0 as the center of the grid. I also need to handle "shifting" over based on the tickWidth value I created earlier. Once I've done that it's a simple matter of drawing a complete arc. 

<p>

After this code I've got the calls to setup my grid and create some sample data. Finally I loop over each point and plot it. The main block of functionality could be packaged up into a real Grid object. I'll be honest though. I'm still wrapping my head around JavaScript encapsulation so I'll be coming back to it later. Anyway, click the Demo button below for - well - the demo.

<p>

<a href="http://www.raymondcamden.com/demos/sep232011/canvas_test.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>