---
layout: post
title: "Generating mazes in ColdFusion"
date: "2009-07-23T08:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/23/Generating-mazes-in-ColdFusion
guid: 3460
---

People like Ben Forta may rave about so called "important" ColdFusion features like Excel generation, .Net integration, and PDF Manipulation, but honestly, how important are those features in comparison to something <i>really</i> in demand in today's enterprise market: Maze Generation. I can't tell you how many times clients have asked me to generate mazes for them - sometimes even removing less critical items from the contract like performance tuning and security reviews. So with that in mind, last night I wrote a ColdFusion port of Emanuele Feronato's PHP code to generate mazes. You can find her blog entry <a href="http://www.emanueleferonato.com/2008/12/06/perfect-maze-generation-tile-based-version/">here</a>.
<!--more-->
The port was pretty simple. ColdFusion supports variables with dollar signs in front, but they drive me crazy when I look at them. I mean, would you want code that looks like this?

<code>
&lt;cfoutput&gt;#$x#&lt;/cfoutput&gt;
</code>

So I rewrote her variables to get rid of the dollar signs. I also had to deal with the fact that PHP incorrectly uses 0-based array indexes. (Ok, I know, I know, but go with me here.) PHP also, and this is truly odd, will blissfully ignore you trying to access an index in an array that doesn't exist, like -1. Oh I got warnings, but no real errors. I'm not sure what the logic of that is (maybe PHPs coders can't count? I kid!). With that said, here is the completed code. Again, credit goes to Emanuele. 

<code>
&lt;cfscript&gt;
mazeWidth = 30;
mazeHeight = 30;

maze = arrayNew(2);
moves = [];
width = 2*mazeWidth+1;
height = 2*mazeHeight+1;

for(x=1;x&lt;=height;x++) {
	for(y=1;y&lt;=width;y++){
		maze[x][y]=1;
	}
}

xPos = 2;
yPos = 2;
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

// drawing the maze
writeOutput("&lt;code style='font-size:10px;line-height:8x'&gt;");

for(x=1;x&lt;=height;x++){
     for(y=1;y&lt;=width;y++){
          if(maze[x][y]==1){
			writeOutput("##");
          }
          else {
		  	writeOutput(" ");
          }
     }
	 writeOutput("&lt;br&gt;");
}
writeOutput("</code>");
</cfscript>
</code>

And an example of the output:

<img src="https://static.raymondcamden.com/images/Picture 176.png" />

You can run a demo of this yourself <a href="http://www.coldfusionjedi.com/demos/maze.cfm">here</a>. Note that every reload generates a new and random maze. To be honest, I do have kind of a cool idea of something to do with this, but I'm waiting to see if I can get it done for Demomania at CFUNITED.