---
layout: post
title: "More useless ColdFusion maze code"
date: "2009-08-06T19:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/06/More-useless-ColdFusion-maze-code
guid: 3476
---

Warning - this blog post has nothing worthwhile in it. No line of code in this post will be relevant, productive, mission critical, or "Web 2.0". It <i>was</i> as heck to play with though so if you are still interested, keep reading.
<!--more-->
A few weeks back I <a href="http://www.raymondcamden.com/index.cfm/2009/7/23/Generating-mazes-in-ColdFusion">blogged</a> about how you could use ColdFusion to generate mazes. It worked ok, but I was wondering if I could do something a bit fun with it. For the first time in years I opened up my laptop while on my flight and - miracle of miracles - actually had enough room to type. The first thing I did was take my previous maze code and create a UDF out of it. This UDF took a size in width and height and returned a structure. The structure contained the array of maze data, as well as a new height and width (since the tile based maze is bigger than your original size). Here is the UDF:

<code>
function genMaze(mazewidth, mazeheight) {
	var maze = arrayNew(2);
	var moves = [];
	var width = 2*mazeWidth+1;
	var height = 2*mazeHeight+1;
	var x = "";
	var xPos = 2;
	var yPos = 2;
	var y = "";
	var possibleDirections = "";
	var move = "";
	var back = "";
	var s = {};
	
	for(x=1;x&lt;=height;x++) {
		for(y=1;y&lt;=width;y++){
			maze[x][y]=1;
		}
	}
	
	maze[xPos][yPos]=0;
	moves[1] = yPos+(xPos*width);
	
	while(arrayLen(moves)) {
	
	     possibleDirections = "";
	
	     if(arrayLen(maze) gte xPos+2 && maze[xPos+2][yPos] == 1 && xPos+2!=0 && xPos+2!=height-0){
	          possibleDirections &= "S";
	     }
	
	     if(xpos-2 gt 0 && maze[xPos-2][yPos]==1 && xPos-2!=0 && xPos-2!=height-0){
	          possibleDirections &= "N";
	     }
	     if(ypos-2 gt 0 && maze[xPos][yPos-2]==1 && yPos-2!=0 && yPos-2!=width-0){
	          possibleDirections &= "W";
	     }
	     if(arrayLen(maze[xPos]) gte yPos+2 && maze[xPos][yPos+2]==1 && yPos+2!=0 && yPos+2!=width-0) {
	          possibleDirections &= "E";
	     }
	
	     if(len(possibleDirections)) {
	          move = randRange(1,len(possibleDirections));
	          switch (mid(possibleDirections, move, 1)){
	
	               case "N": maze[xPos-2][yPos]=0;
	                         maze[xPos-1][yPos]=0;
	                         xPos -=2;
	                         break;
	               case "S": maze[xPos+2][yPos]=0;
	                         maze[xPos+1][yPos]=0;
	                         xPos +=2;
	                         break;
	               case "W": maze[xPos][yPos-2]=0;
	                         maze[xPos][yPos-1]=0;
	                         yPos -=2;
	                         break;
	               case "E": maze[xPos][yPos+2]=0;
	                         maze[xPos][yPos+1]=0;
	                         yPos +=2;
	                         break;        
	          }
			  moves[arrayLen(moves)+1] = yPos + (xPos*width);
	     }
	     else {
	          back = moves[arrayLen(moves)];
			  arrayDeleteAt(moves, arrayLen(moves));
			  xPos = fix(back/width);
			  Ypos = back mod width;
	     }
		 
	}
	
	s.maze = maze;
	s.width = width;
	s.height = height;
	return s;
}
</code>

You can generate a maze by just doing:

<code>
&lt;cfset mazedata = genMaze(30,30)&gt;
</code>

So once I had that - I decided to see if I could create a graphical maze. I began by creating a canvas:

<code>
&lt;cfset canvas = imageNew("", 500, 500, "rgb", "white")&gt;
</code>

I then used a bit of math to determine the size of each 'block' (remember that mazedata is the result of the UDF call):

<code>
&lt;cfset sqWidth = canvas.width/mazedata.width&gt;
&lt;cfset sqHeight = canvas.height/mazedata.height&gt;
</code>

Next, I set a drawing color:

<code>
&lt;!--- wall color ---&gt;
&lt;cfset imageSetDrawingColor(canvas, "red")&gt;
</code>

and finally, here is the super complex code to draw the maze:

<code>
&lt;!--- begin to draw ---&gt;
&lt;cfloop index="x" from="1" to="#mazedata.height#"&gt;
	&lt;cfloop index="y" from="1" to="#mazedata.width#"&gt;
		&lt;cfif mazedata.maze[x][y] is 1&gt;
			&lt;!--- draw a sq ---&gt;
			&lt;cfset yPos = (x-1) * sqHeight&gt;
			&lt;cfset xPos = (y-1) * sqWidth&gt;
			&lt;cfset imageDrawRect(canvas, xPos, yPos, sqWidth, sqHeight, true)&gt;			
		&lt;cfelse&gt;
			&lt;!--- do nothing ---&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
&lt;/cfloop&gt;

&lt;cfimage action="writeToBrowser" source="#canvas#"&gt;
</code>

Remember that a 1 in our maze array means a wall. ColdFusion provides a rectangle drawing function for you, so the work is pretty trivial. And the result?

<img src="https://static.raymondcamden.com/images/cfjedi/Picture 179.png" />

Pretty cool I think. It's not super fast, but it only takes about one second. I was going to leave it at that, but then I decided - why not go crazy? Instead of a white canvas, what if we drew on a picture?

<img src="https://static.raymondcamden.com/images/cfjedi/maze2.jpg" />

Then - being the wild and crazy guy I am - I revered the draw logic. Instead of drawing walls, I drew the paths. (Note, this one has a different source image.)

<img src="https://static.raymondcamden.com/images/cfjedi/maze3.jpg" />

Pretty dumb - but it was cool to me. I've included a zip of the modified CFMs.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Farchive23%{% endraw %}2Ezip'>Download attached file.</a></p>