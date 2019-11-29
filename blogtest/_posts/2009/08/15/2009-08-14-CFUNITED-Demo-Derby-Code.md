---
layout: post
title: "CFUNITED Demo Derby Code"
date: "2009-08-15T08:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/15/CFUNITED-Demo-Derby-Code
guid: 3488
---

Yesterday at CFUNITED I presented some more (useless) code concerning mazes and ColdFusion. I've blogged on this a few times already, but I decided to play around with it a bit more. For the derby, I demonstrated code that generated mazes in a slightly different way than I've had before. I've shown outputting mazes with text. I've shown outputting mazes with graphics. But this version puts one more little spin on it - old school style:

<img src="https://static.raymondcamden.com/images/Picture 181.png" />

What you are seeing here is a text based description of a maze stored in the session scope. This is done by first figuring out what directions are allowed based on your current position in the maze:

<code>
public function getExits(numeric x, numeric y) {
	var exits = "";
	//handle west possible
	if(variables.mazedata.maze[arguments.y][arguments.x-1] == 0) exits = listAppend(exits, "west"); 
	//handle east possible
	if(variables.mazedata.maze[arguments.y][arguments.x+1] == 0) exits = listAppend(exits, "east"); 
	//handle north possible
	if(variables.mazedata.maze[arguments.y-1][arguments.x] == 0) exits = listAppend(exits, "north"); 
	//handle south possible
	if(variables.mazedata.maze[arguments.y+1][arguments.x] == 0) exits = listAppend(exits, "south"); 
	return exits;
}
</code>

This then is used by a simple function to describe the current room. All rooms in the maze have the exact same look - it is only the exits that change:

<code>
function describePosition(numeric x, numeric y) {
	//better not be a wall or you are dead
	var exits = getExits(arguments.x,arguments.y);
	var s = "You are in a dark and dusty maze.&lt;br/&gt;&lt;br/&gt;";
	var i = "";

	//Ok, I'm using pos with 0,0 in upper left				
	if(listLen(exits) is 1) {
		s &= "There is one exit to the #exits#.";
	} else {
		s &= "There are exits to the ";
		for(i=1; i &lt;= listLen(exits); i++) {
			s &= listGetAt(exits, i);
			if(i &lt; listLen(exits)-1) s&= ", ";
			else if (i == listLen(exits)-1) s&= " and ";
			//else if (listLen(exists) is 2 and i is 1) s
		}
	}		
			
	return s;
}	
</code>

Movement is done by simply checking your current position against valid exits. Also note that I allow for shorthand versions of movements (e for east, etc):

<code>
public function move(string dir, numeric x, numeric y) {
	var pos = {% raw %}{x=arguments.x,y=arguments.y}{% endraw %};
	if(dir == "e") dir="east";
	if(dir == "w") dir="west";
	if(dir == "s") dir="south";
	if(dir == "n") dir="north";
		
	if(listFindNoCase(getExits(x,y), dir)) {
		if(dir == "east") pos.x++;
		if(dir == "south") pos.y++;
		if(dir == "west") pos.x--;
		if(dir == "north") pos.y--;
	}
	return pos;
}
</code>

Totally useless - and totally fun - and yes - I have inklings for other maze demos to try as well. I've attached the code (including the Grue version) but note that it is ColdFusion 9 only.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Farchive%{% endraw %}2D2%2Ezip'>Download attached file.</a></p>