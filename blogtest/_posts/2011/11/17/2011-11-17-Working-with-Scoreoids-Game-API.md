---
layout: post
title: "Working with Scoreoid's Game API"
date: "2011-11-17T13:11:00+06:00"
categories: [coldfusion,html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/11/17/Working-with-Scoreoids-Game-API
guid: 4437
---

<b>Edited on February 26, 2012:</b> Scoreoid has recently gone through an API update. The demo here will no longer work, but the changes are not huge. I got my own local copy running well. If anyone wants an updated ColdFusion wrapper, please let me know.

<p>

This morning I checked out Jesse Freeman's <a href="http://codewarmup.jessefreeman.com/2011/11/17/create-a-leaderboard-with-scoreoid/">daily 'Code Warmup'</a> and discovered a new service called <a href="http://www.scoreoid.net/">Scoreoid</a>. Scoreoid is a free service that provides basic game stat management, specifically it allows you to offload the chore of tracking scores, players, achievements, and game stats. You may ask why you would even need to bother with that. Those tasks wouldn't be too difficult with a server-side language like ColdFusion. But for folks developing mobile games, being able to skip the server completely is <i>very</i> compelling. And as much as I love to write server side code all day, offloading tasks to someone dedicated to it is almost always worth taking a look at. You can see a full list of <a href="http://www.scoreoid.net/features/">features</a> on the site itself. Did I mentioned it was free? Yep - I got my email confirmation two minutes after signing up. They will soon be offering a Pro version of the service which will cost money.  Oddly you have to sign up and administer your games at their <a href="http://www.scoreoid.com">dot com</a> site. So you go to .net for your docs and .com for your console. Once I figured that out though it was smooth sailing. The API is very easy to use and supports both XML and JSON responses.
<!--more-->
<p/>

To test the service out, I decided to build a very simple game. I called it OCD RPG. The game would track one basic stat, a score, and based on that assign a score. It begins by simply prompting for a username:

<p/>

<img src="https://static.raymondcamden.com/images/ScreenClip227.png" />

<p/>

After entering your username, the game screen is presented.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip228.png" />

<p/>

To play the game, you just click the button. That's it. 

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip229.png" />

<p/>

Let's take a quick look a the code behind this. The code here really isn't terribly relevant, but I want to show the initial state so you can see how I mark it up later to make use of Scoreoid's API. 

<p/>

First, the HTML:

<p/>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	
	&lt;head&gt;
	&lt;title&gt;OCD RPG&lt;/title&gt;
	&lt;link rel="stylesheet" href="bootstrap.min.css"&gt;
	&lt;script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script type="text/javascript" src="game.js"&gt;&lt;/script&gt;
	&lt;script&gt;
	var game = new gameOb();
	//used for animation duration so I can set it SUPER low during testing
	var animDur = 500;
	$(document).ready(function() {

		function drawGameStats() {
			$("#scoreSpan").text(game.score);
			$("#levelSpan").text(game.level);
		}
		
		$("#mainGameButton").click(function() {
			game.addScore();
			drawGameStats();
			$("#logContainer").prepend(game.randomLog()+"&lt;br/&gt;");
		});
		
		$("#mainForm").submit(function(e) {
			$("#introButton").trigger("click");
			e.preventDefault();
		});
		
		$("#introButton").click(function() {
			var username = $.trim($("#username").val());
			if(username == '') {
				$("#username").parent().addClass("error");				
				return;
			} else {
				$("#username").parent().removeClass("error");
				game.init(username);
				console.log("Let's get this thing started - user is "+username);	
				$("#introDiv").fadeOut(animDur, function() {
					$("#gameContainer").fadeIn(animDur,function() {% raw %}{ drawGameStats(); }{% endraw %});
				});
			}
		});
		
	})
	&lt;/script&gt;
	&lt;style&gt;
	#mainGameButton {
		padding: 20px;
		width: 400px;	
	}
	
	#logContainer {
		height: 200px;
		overflow:auto;
		border-style:solid;
		border-width:thin;
	}
	&lt;/style&gt;
	&lt;/head&gt;
	
	&lt;body&gt;

		&lt;div class="container"&gt;

		
			&lt;div id="introDiv"&gt;
				&lt;h1&gt;Welcome to OCD RPG&lt;/h1&gt;
				&lt;p&gt;
					To begin, please enter your username. This will be used to uniquely identify you on our high score list.
				&lt;/p&gt;
				&lt;form id="mainForm"&gt;
					&lt;fieldset&gt;
					&lt;div class="clearfix "&gt;
						&lt;input type="text" id="username" placeholder="Username" class="xlarge" size="30"&gt;
						&lt;input type="button" id="introButton" value="Start Game" class="btn primary"&gt;
					&lt;/div&gt;
					&lt;/fieldset&gt;

				&lt;/form&gt;
				
			&lt;/div&gt;

			&lt;div id="gameContainer" style="display:none"&gt;
				&lt;h1&gt;Game On!&lt;/h1&gt;
				&lt;p&gt;
				&lt;b&gt;Score:&lt;/b&gt; &lt;span id="scoreSpan"&gt;&lt;/span&gt;
				&lt;/p&gt;
				&lt;p&gt;
				&lt;b&gt;Level:&lt;/b&gt; &lt;span id="levelSpan"&gt;&lt;/span&gt;
				&lt;/p&gt;
				&lt;button id="mainGameButton" class="btn"&gt;CLICK ME FOR HAPPY ADVENTURE TIME!&lt;/button&gt;
				&lt;h2&gt;Log&lt;/h2&gt;
				&lt;div id="logContainer"&gt;&lt;/div&gt;
			&lt;/div&gt;
			
		&lt;/div&gt;
		
				
	&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

You can see two basic blocks of layout. One handles the initial name prompt and the second the main game screen. The JavaScript file is included below..

<p>

<code>
var gameOb = function() {
	
	var MESSAGES = [
	"You looted gold pieces from the dragon's guest house.",
	[deleted for space]
	"If you hold CTRL while clicking, you get extra points. Honest."
	];
	
	this.init = function(user) {
		this.username = user;
		this.score = 0;
		this.level = 1;
	}
	
	this.addScore = function() {
		//add 1-10 points
		this.score += this.randRange(5,25)*(Math.ceil(this.level/2));
		console.log("need "+this.calculateExperiencePoints(this.level+1)+" for next level");
		if(this.score &gt; this.calculateExperiencePoints(this.level+1)) {
			this.level++;
		}
	}
	
	//https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Math/random
	this.randRange = function(min,max) {
		return Math.floor(Math.random() * (max - min) + min);	
	}
	
	
	//All experience level code credit Jesse Freeman - http://codewarmup.jessefreeman.com/2011/11/07/create-a-rpg-style-exp-progress-bar/#comments
	this.calculateExperiencePoints = function(level) {
		return (level * (level + 1)) * 100;
	}

	this.randomLog = function() {
		return MESSAGES[this.randRange(0,MESSAGES.length)];
	}
}
</code>

<p>

As the game is rather simple, the only really interesting part is the experience point/level calculator. I used code (well, converted code) Jess Freeman created for an earlier code warmup. I'm treating score essentially like XP, but for naming purposes the game has a score and level property. You can demo this game here:

<p>

<a href="http://coldfusionjedi.com/demos/2011/nov/17/">http://coldfusionjedi.com/demos/2011/nov/17/</a>

<p>

Ok, so let's talk Scoreoid. First off, you want to take a look at their <a href="http://wiki.scoreoid.net/">wiki</a> to get an idea as to how their API works. You have methods to get basic game stats, score stats, and player stats. I realized rather quickly that my game doesn't really have a score per se. It's not like a game of pong where you play, hit a score, and the game ends. Like most RPGs, it just... goes. Therefore I decided <i>not</i> to make use of the Score API. Instead, I decided I'd use the <a href="http://wiki.scoreoid.net/category/api/player/">Player API</a>. This API allows you to add/edit/delete players. Player objects are confined to basic game stats. You can't add ad hoc properties. But the fields supported should cover most gaming needs. 

<p>

I decided I'd make my game do two things:

<p>

<ol>
<li>First, it would register the user with Scoreoid. Basically take in the username and add it to their system. I'm not going to bother with passwords, so right now my system isn't secure in <b>any</b> way, but Scoreoid supports storing passwords and user ids and could handle ensuring you don't add the same player twice. Again, I wanted to keep things simple. So when you say your name is Happy Dan, we add you to Scoreoid.
<li>Record your current level. I mentioned players have multiple fields. There's two related to level I care about - current_level and unlocked_levels. I'll explain why I care about unlocked_levels later.
</ol>

<p>

So with that being said, I began by creating a basic scoreoid CFC I could configure with my AP and game ID. I also wrote a function to handle adding the player. Scoreoid will return an error if the player exists, but since I don't care, I just ignore it. 

<p>

<code>
component {

	variables.rooturl = "https://www.scoreoid.com/api/";
	
	public function init(required string api, required string game) {
		variables.api = arguments.api;
		variables.gameid = arguments.game;
		return this;
	}
	
	public function addPlayer(required string username) {
		var result = apiCall("createPlayer", {% raw %}{"username"=arguments.username}{% endraw %});
		//Note - we should throw an error if they do - but for now, meh
	}

	private function apiCall(required string method,struct args) {
		var h = new com.adobe.coldfusion.http();        
        	h.setURL(variables.rooturl & arguments.method);
        	h.setMethod("post");
        	h.addParam(type="formfield", name="api_key", value=variables.api);
        	h.addParam(type="formfield", name="game_id", value=variables.gameid);
        	h.addParam(type="formfield", name="response", value="json");
        	if(structKeyExists(arguments,"args")) {
			for(var key in arguments.args) {
				h.addParam(type="formfield", name=key, value=arguments.args[key]);		
			}		
		}
	        var result = h.send().getPrefix();
        	if(!isJSON(result.fileContent)) throw("Invalid response: #result.fileContent#");
	        return deserializeJSON(result.fileContent);
	}
	
}
</code>

<p>

I created apiCall() to handle running methods against their API in an abstract fashion. You can see how simple this makes the addPlayer call. Since this CFC is going to be cached in the Application scope, I created a new CFC, game, to handle calls from my JavaScript code:

<p>

<code>
component {
	
	remote function registerPlayer(required string username) {
	
		//Ask scoreoid to make the player, we ignore any errors since we aren't doing 'real' auth	        	
		application.scoreoid.addPlayer(arguments.username);
		
	}
	
}
</code>

<p>

That handles adding the user. To store my stats, I created a wrapper for updatePlayerField. Oddly Scoreoid doesn't let you update more than one field at a time, so you have to fire off changes to a player one at a time. Here's the wrapper:

<p>

<code>
public function updatePlayerField(required string username, required string field, required any value) {
	apiCall("updatePlayerField", {% raw %}{"username"=arguments.username, "field"=arguments.field, "value"=arguments.value}{% endraw %});	
}
</code>

<p>

And game.cfc will get a method to handle this:

<p>

<code>
remote function storePlayer(required string username, required numeric score, required numeric level) {
	application.scoreoid.updatePlayerField(arguments.username, "current_level", arguments.level);	
	application.scoreoid.updatePlayerField(arguments.username, "unlocked_levels", arguments.level);	
}
</code>

<p>

Looking at this now - I should make my Scoreoid wrapper allow for N calls. Even though the API doesn't, my wrapper could handle it behind the scenes. So that's the back end changes - how about the front end? I now record the user after you hit the initial button:

<p/>

<code>
$.post("game.cfc?method=registerPlayer", {% raw %}{username:username}{% endraw %}, function() {
</code>

<p>

And I also register a 'heart beat' that pings the server every few seconds.

<p>

<code>
$.post("game.cfc?method=storePlayer", {% raw %}{username:game.username, score:game.score, level:game.level}{% endraw %});
</code>

<p>

You can demo this version here: <a href="http://coldfusionjedi.com/demos/2011/nov/17/draft2/">http://coldfusionjedi.com/demos/2011/nov/17/draft2/</a>. 

<p>

Right away, let me make sure it's clear to everyone that I know this system can be hacked. Easily. I'm sure folks will. I ask that you don't. But I know folks will. -sigh- With the basics built, I played a bit and went backto the Scoreoid site. Their dashboard includes some very nice reporting tools.

<p>

Here's an example of their basic stats:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip230.png" />

<p>

You can also dig deeper into game stats and see player info as well. Remember earlier when I mentioned I needed to record "unlocked_levels"? When it comes to getting game stats, they only track a subset of player properties. One of them is unlocked_levels. So by tracking that too, I was always to get that data. I wrote wrappers to get top, average, and lowest game stats for a particular game field:

<p>

<code>
public any function getGameAverage(required string field) {
	return apiCall("getGameAverage",{% raw %}{"field"=arguments.field}{% endraw %}).number;	
}

public any function getGameLowest(required string field) {
	return apiCall("getGameLowest",{% raw %}{"field"=arguments.field}{% endraw %}).number;	
}

public any function getGameTop(required string field) {
	return apiCall("getGameTop",{% raw %}{"field"=arguments.field}{% endraw %}).number;	
}
</code>

<p>

And in ColdFusion I could now do:

<p>

<code>
&lt;cfset toplevel = application.scoreoid.getGameTop("unlocked_levels")&gt;
&lt;cfset lowlevel = application.scoreoid.getGameLowest("unlocked_levels")&gt;
&lt;cfset avglevel = application.scoreoid.getGameAverage("unlocked_levels")&gt;
</code>

<p>

I also made a call to get players. You can't sort by unlocked_levels, so I made use of <a href="http://www.cflib.org/udf/quicksort">QuickSort</a> from CFLib. This allowed the creation of a basic stats page: <a href="http://coldfusionjedi.com/demos/2011/nov/17/draft2/stats.cfm">http://coldfusionjedi.com/demos/2011/nov/17/draft2/stats.cfm</a>.

<p>

That's it. Here's my current Scoreoid CFC if anyone wants to run with it. 

<p>

<code>
component {

	variables.rooturl = "https://www.scoreoid.com/api/";
	
	public function init(required string api, required string game) {
		variables.api = arguments.api;
		variables.gameid = arguments.game;
		return this;
	}
	
	public function addPlayer(required string username) {
		var result = apiCall("createPlayer", {% raw %}{"username"=arguments.username}{% endraw %});
		//Note - we should throw an error if they do - but for now, meh
	}

	public any function getGame() {
		return apiCall("getGame")[1].game;	
	}

	public any function getGameAverage(required string field) {
		return apiCall("getGameAverage",{% raw %}{"field"=arguments.field}{% endraw %}).number;	
	}

	public any function getGameLowest(required string field) {
		return apiCall("getGameLowest",{% raw %}{"field"=arguments.field}{% endraw %}).number;	
	}

	public any function getGameTop(required string field) {
		return apiCall("getGameTop",{% raw %}{"field"=arguments.field}{% endraw %}).number;	
	}

	public array function getPlayers() {
		var res = apiCall("getPlayers");
		var result = [];
		for(var i=1; i&lt;=arrayLen(res); i++) {
			arrayAppend(result, res[i].Player);	
		}
		return result;
	}
	
	public function updatePlayerField(required string username, required string field, required any value) {
		apiCall("updatePlayerField", {% raw %}{"username"=arguments.username, "field"=arguments.field, "value"=arguments.value}{% endraw %});	
	}
			
	private function apiCall(required string method,struct args) {
		writelog(file="application", text="#serializejson(arguments)#");
		var h = new com.adobe.coldfusion.http();        
        h.setURL(variables.rooturl & arguments.method);
        h.setMethod("post");
        h.addParam(type="formfield", name="api_key", value=variables.api);
        h.addParam(type="formfield", name="game_id", value=variables.gameid);
        h.addParam(type="formfield", name="response", value="json");
        if(structKeyExists(arguments,"args")) {
			for(var key in arguments.args) {
				h.addParam(type="formfield", name=key, value=arguments.args[key]);		
			}		
		}
        var result = h.send().getPrefix();
        if(!isJSON(result.fileContent)) throw("Invalid response: #result.fileContent#");
        return deserializeJSON(result.fileContent);
	}
	
}
</code>