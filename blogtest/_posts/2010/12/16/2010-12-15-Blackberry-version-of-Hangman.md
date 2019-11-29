---
layout: post
title: "Blackberry version of Hangman"
date: "2010-12-16T08:12:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2010/12/16/Blackberry-version-of-Hangman
guid: 4055
---

Many months ago, I wrote a simple version of <a href="http://insideria.com/2009/11/jquery-and-air---moving-from-w-2.html">Hangman</a> as a desktop Adobe AIR application. It was built using HTML and jQuery and supported a one thousand word database of word choices. This week I looked into porting the application to the Blackberry Playbook. This is what I came up with.
<!--more-->
<p/>

First - I had assumed the port would be simple. The game itself is trivial so I wasn't expecting much trouble. Then something occurred to me. My desktop application listened for key presses to handle letter guesses. As far as I know, that type of setup doesn't make sense on a mobile device. Sure you can get 'keyboard' input, but from what I know it can only be done by using a form field of some sort. To get around this I decided to simply use buttons. Here is an example:

<p/>


<img src="https://static.raymondcamden.com/images/ScreenClipwon.png" />

<p/>

As you can see, the buttons look rather nice. I don't have a physical Playbook yet (no one does outside of RIM I guess), but it looks like it would work well. I'm not happy with "Z" hanging there by itself and would <i>love</i> some suggestions on how it could be improved. I built out this "keyboard" by hand:

<p/>

<code>
&lt;s:TileGroup id="tileLayoutView" requestedColumnCount="5" click="letterButtonClicked(event)"&gt;
	&lt;s:Button id="btnA" label="A" /&gt;
	&lt;s:Button id="btnB" label="B" /&gt;
	&lt;s:Button id="btnC" label="C" /&gt;
(I deleted some lines here.)
	&lt;s:Button id="btnX" label="X" /&gt;
	&lt;s:Button id="btnY" label="Y" /&gt;
	&lt;s:Button id="btnZ" label="Z" /&gt;
&lt;/s:TileGroup&gt;
</code>

<p/>

After a suggestion by Joe Rinehart I tried using a Datagroup, but ran into issues updating the UI controls on the inside. (I'll happily go into details about the issues i ran into if anyone wants to hear more.) 

<p/>

Outside of that the other big change was how the application was laid out. I don't have CSS, but frankly Flex's layout controls are a lot easier for me to work with. Not to offend anyone's delicate sensibilities but laying stuff out in a Flex application reminds me of tables. Using CSS reminds me more of visiting a sadistic dentist. Sorry. Anyway, let me share the code. Here is the initial view which simply sets up the database connection:

<p/>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:MobileApplication xmlns:fx="http://ns.adobe.com/mxml/2009" 
					 xmlns:s="library://ns.adobe.com/flex/spark" firstView="views.HangmanHome" initialize="init()"&gt;
	&lt;fx:Declarations&gt;
		&lt;!-- Place non-visual elements (e.g., services, value objects) here --&gt;
	&lt;/fx:Declarations&gt;
	
	&lt;fx:Script&gt;
	&lt;![CDATA[
	protected var dbConnection:SQLConnection = new SQLConnection;
		
	private function init():void {
		var dbFile:File = File.applicationDirectory.resolvePath("install/words.db");
		dbConnection.open(dbFile);		
		navigator.firstViewData = {% raw %}{dbCon:dbConnection}{% endraw %};
	}
			
	]]&gt;
	&lt;/fx:Script&gt;

&lt;/s:MobileApplication&gt;
</code>

<p/>

Here is the main view where of the logic occurs. Note that one feature I did not port was updating the game history. I figured that was pretty trivial and I'd add it later if I wanted.

<p/>

<code>

&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;s:View xmlns:fx="http://ns.adobe.com/mxml/2009" 
		xmlns:s="library://ns.adobe.com/flex/spark" 
		title="Hangman" xmlns:mx="library://ns.adobe.com/flex/mx" viewActivate="init(event)"&gt;
	&lt;fx:Declarations&gt;
		&lt;!-- Place non-visual elements (e.g., services, value objects) here --&gt;
	&lt;/fx:Declarations&gt;

	&lt;fx:Style&gt;
	@namespace s "library://ns.adobe.com/flex/spark";
	@namespace mx "library://ns.adobe.com/flex/mx";
		
	#blankWord {
		font-size:70px;
		font-weight: bold;
	}
	
	#gameStatus {
		font-weight: bold;
	}
	&lt;/fx:Style&gt;
	
	&lt;fx:Script&gt;
	&lt;![CDATA[
	import model.Game;
		
	import mx.collections.ArrayCollection;
	import mx.core.IVisualElement;
	
	import spark.components.BorderContainer;

	private var game:Game;
		
	[Embed (source="images/Hangman-1.png" )]
	public static const H1:Class;
	[Embed (source="images/Hangman-2.png" )]
	public static const H2:Class;
	[Embed (source="images/Hangman-3.png" )]
	public static const H3:Class;
	[Embed (source="images/Hangman-4.png" )]
	public static const H4:Class;
	[Embed (source="images/Hangman-5.png" )]
	public static const H5:Class;
	[Embed (source="images/Hangman-6.png" )]
	public static const H6:Class;
	[Embed (source="images/Hangman-7.png" )]
	public static const H7:Class;
	[Embed (source="images/Hangman-8.png" )]
	public static const H8:Class;
	[Embed (source="images/Hangman-9.png" )]
	public static const H9:Class;
	[Embed (source="images/Hangman-10.png" )]
	public static const H10:Class;
				
	private function init(event:Event):void {
		trace('init in view called');
		initGame();
	}	

		
	private function letterButtonClicked( event : Event ):void {
		if(!game.isGameOver()) {
			var button : Button = event.target as Button;
			if(button) {
				trace("clicked: " + button.label);
				game.pickLetter(button.label);
				button.enabled = false;
				drawWord();
				drawHangman();
				if(game.isGameOver()) {
					handleGameOver();				
				}
			}
		}
	}

	private function initGame():void {

		gameStatus.text = "";
		newGameButton.visible = false;
		for(var i:int=65; i&lt;91; i++) {
			var s:String = String.fromCharCode(i);
			trace(s);
			this["btn"+s].enabled=true;
		}
		
		game = new Game();
		
		//begin by picking a word
		game.setChosenWord(pickRandomWord());
		
		//draws the blank/letters
		drawWord();
		
		//draws the hangman 
		drawHangman();
	}

	private function drawHangman():void {
		var misses:int = game.getMisses();
		if(misses == 0) hangmanImage.source = null;
		else {
			hangmanImage.source = HangmanHome["H"+(misses+1)];
		}
	}

	private function drawWord():void {
		blankWord.text = game.drawWord();
	}

	private function handleGameOver():void {
		if(game.playerWon()) {
			gameStatus.text = "Congratulations, you won the game!";			
		} else {
			gameStatus.text = "Sorry, but you lost the game!";
		}
		newGameButton.visible = true;
	}

	private function pickRandomWord():String {
		var sql:SQLStatement = new SQLStatement();
		sql.text = "select word from words order by random() limit 1";
		sql.sqlConnection = data.dbCon;
		sql.execute();
		var sqlResult:SQLResult = sql.getResult();
		trace('random word is '+sqlResult.data[0].word);
		return sqlResult.data[0].word.toUpperCase();
		
	}
	]]&gt;
	&lt;/fx:Script&gt;
	&lt;s:actionContent&gt;
		&lt;s:Button height="100%" label="Exit" click="NativeApplication.nativeApplication.exit()" /&gt;
	&lt;/s:actionContent&gt;

	&lt;s:layout&gt;
		&lt;s:HorizontalLayout paddingTop="10" paddingLeft="10" paddingRight="10" gap="10"/&gt;
	&lt;/s:layout&gt;
		
	&lt;s:TileGroup id="tileLayoutView" requestedColumnCount="5" click="letterButtonClicked(event)"&gt;
		&lt;s:Button id="btnA" label="A" /&gt;
		&lt;s:Button id="btnB" label="B" /&gt;
		&lt;s:Button id="btnC" label="C" /&gt;
		&lt;s:Button id="btnD" label="D" /&gt;
		&lt;s:Button id="btnE" label="E" /&gt;
		&lt;s:Button id="btnF" label="F" /&gt;
		&lt;s:Button id="btnG" label="G" /&gt;
		&lt;s:Button id="btnH" label="H" /&gt;
		&lt;s:Button id="btnI" label="I" /&gt;
		&lt;s:Button id="btnJ" label="J" /&gt;
		&lt;s:Button id="btnK" label="K" /&gt;
		&lt;s:Button id="btnL" label="L" /&gt;
		&lt;s:Button id="btnM" label="M" /&gt;
		&lt;s:Button id="btnN" label="N" /&gt;
		&lt;s:Button id="btnO" label="O" /&gt;
		&lt;s:Button id="btnP" label="P" /&gt;
		&lt;s:Button id="btnQ" label="Q" /&gt;
		&lt;s:Button id="btnR" label="R" /&gt;
		&lt;s:Button id="btnS" label="S" /&gt;
		&lt;s:Button id="btnT" label="T" /&gt;
		&lt;s:Button id="btnU" label="U" /&gt;
		&lt;s:Button id="btnV" label="V" /&gt;
		&lt;s:Button id="btnW" label="W" /&gt;
		&lt;s:Button id="btnX" label="X" /&gt;
		&lt;s:Button id="btnY" label="Y" /&gt;
		&lt;s:Button id="btnZ" label="Z" /&gt;
	&lt;/s:TileGroup&gt;

	&lt;!-- block 2 is a v block, top row is pic + instruction block, row 2 is word --&gt;
	&lt;s:VGroup width="67{% raw %}%" height="100%{% endraw %}"&gt;
		
		&lt;s:HGroup width="100{% raw %}%" height="80%{% endraw %}" horizontalAlign="center"&gt;

			&lt;!-- hangman goes here --&gt;
			&lt;s:Image id="hangmanImage"  width="50%" /&gt;
			
			&lt;!-- nstructions, status,e tc --&gt;
			&lt;s:VGroup id="rightGroup" width="50%" paddingLeft="5" paddingRight="5" gap="10"&gt;
				
				&lt;s:Label width="100%" text="To begin, simply type the letter you would like to guess. Right answers will help reveal the mystery word. Wrong answers will lead to your untimely demise!" /&gt;
				&lt;s:Label id="gameStatus" width="100%" /&gt;
				&lt;s:Button id="newGameButton" label="New Game" visible="false" click="initGame()" /&gt;
			&lt;/s:VGroup&gt;
	
		&lt;/s:HGroup&gt;
	
		&lt;s:Label id="blankWord" width="100%" /&gt;	

	&lt;/s:VGroup&gt;
		
&lt;/s:View&gt;
</code>

<p>

And finally - the simple Game object I created. 

<p>

<code>
package model {

	public class Game {

		private var _chosenWord:String;
		private var _usedLetters:Object = new Object();
		private var _misses:int = 0;
		
		public function Game() {
		}

		public function drawWord():String {
			var s:String = "";
			for(var i:int=0; i&lt;_chosenWord.length; i++) {
				var thisLetter:String = _chosenWord.substr(i, 1);
				if(_usedLetters[thisLetter]) s+= thisLetter;
				else s+= "-";
			}
			return s;
		}
		
		public function getMisses():int {
			return _misses;
		}
		
		public function isGameOver():Boolean {
			if(_misses == 9 || drawWord() == _chosenWord) return true;
			return false;
		}

		public function pickLetter(s:String):void {
			_usedLetters[s] = 1;
			if(_chosenWord.indexOf(s) == -1) _misses++;
		}

		public function playerWon():Boolean {
			return (isGameOver() && drawWord() == _chosenWord);
		}

		public function setChosenWord(s:String):void {
			_chosenWord = s;
		}

	}

}
</code>

<p/>

And a final screen shot so you can see the result you don't want to see:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenCliplost.png" />

I've attached a zip of the project to the blogentry.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FHangman1%{% endraw %}2Ezip'>Download attached file.</a></p>