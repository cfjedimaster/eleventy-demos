---
layout: post
title: "Latest Nook App - TBS Horoscope"
date: "2011-08-28T09:08:00+06:00"
categories: [flex,mobile]
tags: []
banner_image: 
permalink: /2011/08/28/Latest-Nook-App-TBS-Horoscope
guid: 4344
---

A week or so ago I shared my <a href="http://www.raymondcamden.com/2011/08/19/Thoughts-on-developing-for-the-Nook">thoughts</a> on developing for the NookColor. Today I'm happy to say my second Nook app is available on the market. The turn around time for this app was <i>much</i> quicker than before. I had the idea for it last Sunday. By Monday night it was almost done. Tuesday I submitted my metadata and it was approved in a couple hours. I then submitted the application and it was approved by Friday. I checked Friday and it wasn't in the store yet, but as of this morning it's there. I'm pretty sure it was out Saturday as I'm seeing a few sales already.
<!--more-->
<p/>

<!-- Begin NOOK App Badge : TBS Horoscope --><a href="https://nookdeveloper.barnesandnoble.com/tools/dev/linkManager/2940043858320" target="_new"><img src="https://nookdeveloper.barnesandnoble.com/tools/dev/badge/2940043858320" alt="NOOK App : TBS Horoscope" /></a><!-- End NOOK App Badge -->

<p/>

TBS Horoscope is mainly a joke horoscope generator. Unlike serious horoscope programs (ahem), this one creates horoscopes entirely randomly. Here's the initial screen.

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip165.png" />

<p/>

The icons there are scrollable. You can also see the background image I <a href="http://www.coldfusionjedi.com/index.cfm/2011/8/24/Using-a-background-with-a-Flex-Mobile-project">blogged about</a> before. Once you select the sign you get a horoscope:

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip167.png" />
<p/>

Yeah - that's crazy - again - unlike real, scientific horoscopes out there. (Ahem again.) One thing that's kind of interesting is the persistence. I generate a random horoscope per sign per day. If you click on Aries twice it will be the same until the next day. Here's the snippet that handles that:

<p/>

<pre><code class="language-javascript">
protected function getHoroscope(date:Date):String {
	//A repeat of the above, but in theory, you could run the app for a while
	var today:Date = new Date();
	var dateString:String = (today.month+1) + "/" + today.date + "/" + today.fullYear;

	//See if we have one in the db
	var stmt:SQLStatement = new SQLStatement();
	stmt.sqlConnection = sqlConnection;
	
	stmt.text = "select horoscope from horoscopes where sign = :sign and date = :datestr";
	stmt.parameters[":sign"] = data.sign.name;
	stmt.parameters[":datestr"] = dateString;
	stmt.execute();
	var res:SQLResult = stmt.getResult();

	if(!res.data) {
		var newHoroscope:String = horoscopeGenerator.generateHoroscope();

		var insStmt:SQLStatement = new SQLStatement();
		insStmt.sqlConnection = sqlConnection;
		insStmt.text = "insert into horoscopes(sign,horoscope,date) " + 
						"values(:sign,:horoscope,:datestr)";
		insStmt.parameters[":sign"] = data.sign.name;
		insStmt.parameters[":horoscope"] = newHoroscope;
		insStmt.parameters[":datestr"] = dateString;
		
		insStmt.execute();

		return newHoroscope;
	} else {
		return res.data[0].horoscope;
	}
}
</code></pre>

<p/>

I'm using AIR's SQLite support to handle checking for an existing horoscope (I could probably cache that but it executes so fast I don't think it would be worth it) in the database. If it doesn't exist, I generate the random one and store it. In case you're curious, here's the entire ActionScript class for the horoscope generator. It's not terribly intelligent, but was fun as heck to write.

<p/>

<pre><code class="language-javascript">
package model {

	public class HoroscopeGenerator {

		private var adjectives:Array = ["forgetful","scary","red","blue","green","yellow","orange","brown","smelly","left handed","right handed","smart","dumb",
									"blue haired","red haired","tall","short","fat","thin","remote","close","skinny","wide","high","low"];
		private var nouns:Array = ["mouse","wig","radio","computer","cat","dog","duck","desk","piece of paper","bird","werewolf","vampire","ghost",
									"dart board","chair","television","egg","table","book","phone","pillow","cactus","rose","hat","airplane"];
		
		public function HoroscopeGenerator() {
		}

		private function getAdjective():String {
			return adjectives[randRange(0,adjectives.length-1)];
		}

		private function getFinancialString():String {
			var options:Array = [
				"Today is a good day to invest. Stock prices will change. ",
				"Today is a bad day to invest. Stock prices will change. ",
				"Investments are a good idea today. Spend wisely before the " + getAdjective() + " " + getNoun() + " turns your luck! ",
				"Save your pennies! Your " + getNoun() + " is not a safe investment today. ",
				"You can buy a lottery ticket or a " + getNoun() + ". Either is a good investment. "
			];
			return options[randRange(1,options.length-1)];
		}
		

		private function getNoun():String {
			return nouns[randRange(0,nouns.length-1)];
		}

		private function getRomanticString():String {
			var options:Array = [
				"Follow your heart like you would follow a "+getAdjective() + " " + getNoun() + ". It won't lead you astray. ",
				"Romance is not in your future today. Avoid it like a " + getAdjective() + " " + getNoun() + ". ",
				"Romance is blossoming like a " + getAdjective() + " " + getNoun() + "! ",
				"Avoid romantic engagements today. Wait for a sign - it will resemble a " +getAdjective() + " " + getNoun() + ". ",
				"Love is in the air. Unfortunately not the air you will be breathing. "
			];
			return options[randRange(1,options.length-1)];
		}

		private function getRandomString():String {
			var options:Array = [
				"Today you need to practice your patience. And your piano. ",
				"Meet new people today. Show them your " + getNoun() + ". ",
				"Your spirits are high today - but watch our for a " + getAdjective() + " " + getNoun() + ". ",
				"Your sign is in the third phase today. This is important. ",
				"Your sign is in the second phase today. This is critical. ",
				"Something big is going to happen today. Or tomorrow. ",
				"A " + getAdjective() + " " + getNoun() + " will give you important advice today. ",
				"A " + getAdjective() + " " + getNoun() + " has it out for you today. ",
				"Last Tuesday was a good day. Today - not so much. ",
				"A dark stranger will enter your life. They will have a " + getAdjective() + " " + getNoun() + ". "
			];
			return options[randRange(1,options.length-1)];
		}
		
		public function generateHoroscope():String {
			var horoscope:String = "";
			horoscope += getRandomString();
			horoscope += getFinancialString();
			horoscope += getRomanticString();
			horoscope += "\n\n";
			horoscope += "Your lucky numbers are " + randRange(1,10) + ", " + randRange(1,10) + ", and " + getNoun() + ".";
			return horoscope;
		}
	
		//credit: http://snipplr.com/view/7326/
		private function randRange(minNum:Number, maxNum:Number):Number {
			return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
		}
		
	}
}
</code></pre>

<p>

So folks - if you have a Nook and 99 cents to spare, check it out. (<a href="http://search.barnesandnoble.com/TBS-Horoscope/Raymond-Camden/e/2940043858320">Direct Link</a>) I'd especially love it if you would rate it up a bit against some anonymous person who gave it one star. It's easily a two star app, right???