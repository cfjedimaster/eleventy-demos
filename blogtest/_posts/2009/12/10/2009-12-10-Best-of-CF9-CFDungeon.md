---
layout: post
title: "Best of CF9: CFDungeon"
date: "2009-12-10T22:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/10/Best-of-CF9-CFDungeon
guid: 3641
---

<img src="https://static.raymondcamden.com/images/cfjedi/bestcfcontest1.jpg" title="Best of ColdFusion 9" align="left" style="margin-right:5px;margin-bottom:5px"/> Time for the next Best of ColdFusion 9 Entry - CFDungeon by Budd Wright. When I saw this entry came in, I decided to be selfish and keep it to myself. I love building games and I knew this entry would be cool. I wasn't prepared for just <i>how</i> cool it is. Ok - so what is it exactly? CFDungeon is an old school text based game. By that I mean everything in the game is textual. To play the game, you enter more commands. So for example, to walk from one place to another you type "north". If you can move north, then the game will tell you about the new location. Text-based games have a long history in computer entertainment, and I played <b>many</b> of them growing up. Some even approached art. (If you ever get a chance to play "A Mind Forever Voyaging" then you will see what I mean.) These games made up for their lack of fancy graphics with prose that was descriptive, engaging, and sometimes downright hilarious. Budd Wright has managed to recreate this in ColdFusion. And wait - this is where it really gets cool. Not only did he build a text-based game in ColdFusion 9 - he built it so you can easily write your own adventures, easily extend the parser, and oh yeah, he did it using <b>freaking Excel files</b> for data. That's stupid.... stupid cool. 
<p>
<img src="https://static.raymondcamden.com/images/cfjedi/Picture 343.png" />
<p>
When the game begins, you go through a simple character creation process. You have the choice between three different classes: Warrior, Thief, and Accountant. (Yes, Accountant.) After you've created your character you can then choose between two different quests. Both adventures are defines in a separate XLS file. The file defines the rooms, actors, objects, and other quest data. You should be able to build your own quest simply by following the pattern defined in the existing files. 
<p>
I recommend playing the Old Hat quest. It's simple - can be done in 20 minutes or so - and really has the feel of an old Zork game. Some of the writing is just funny as heck. So for example:
<p>
<img src="https://static.raymondcamden.com/images/cfjedi/Picture 417.png" />
<p>
And then...
<p>
<img src="https://static.raymondcamden.com/images/cfjedi/Picture 59.png" />
<p>
Or even better...
<p>
<img src="https://static.raymondcamden.com/images/cfjedi/Picture 74.png" />
<p>
And this was the absolute best:
<p>
<img src="https://static.raymondcamden.com/images/cfjedi/Picture 63.png" />
<p>
So far I've just talked about the game itself (because, frankly, it was so damn fun), but the code itself is pretty darn sweet. It makes use of 100% script based CFCs, which I know not everyone likes, but I'm definitely in the "pro script" camp myself. I saw a few small things I'd probably change. He uses a method called writeLog which matches a built in function in ColdFusion 9. He got it work by scoping it but I'd urge folks to stay away from built in names.
<p>
His most critical mistake... and again... this has happened a few times already in this contest (!) is the use of \ in path names. Anyone not on Windows wants to do a search for "xls" to find all the paths and changes \ to /. 
<p>
Another issue - and we can debate how critical this is - is the use of Application scoped components within his components. So for example, within inputHandler.cfc, you see this:
<p>
<code>
// Clear the last response
Application.components.modules[ Session.module.name ].ClearResponse();

// Pass the input to the appropriate module handler
Application.components.modules[ Session.module.name ].ReceiveInput( input );
</code>
<p>
While this works, it creates a dependancy to an Application location that may change in the future. This is exactly where something like ColdSpring can give you a hand. 
<p>
Outside of that though - it's very good stuff. I'm just blown away. This is incredibly impressive and one of the coolest things I've seen ever. Would I deploy a production application that makes use of Excel sheets for data? Heck no. But you could drop a database in here in probably half an hour. Of course, you then actually lose some of the ease of updating (until you build an administrator).
<p>
I really, really, really like this entry. Great job Budd!<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcfdungeon%{% endraw %}2Ezip'>Download attached file.</a></p>