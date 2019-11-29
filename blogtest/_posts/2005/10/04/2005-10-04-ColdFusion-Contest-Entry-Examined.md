---
layout: post
title: "ColdFusion Contest Entry Examined"
date: "2005-10-04T16:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/04/ColdFusion-Contest-Entry-Examined
guid: 828
---

The ColdFusion <a href="http://ray.camdenfamily.com/index.cfm/2005/9/20/Contest-Shall-We-Play-a-Game">contest</a> is now closed, and I am beginning to look at the entries. As I mentioned, I was going to pick the code apart and point out mistakes. This is <i>not</i> to make anyone feel bad or to make people think I don't make mistakes (anyone remember the supreme whopper?), but as readers of my blog know, I love to point out mistakes and issues because I think it helps people learn. Also, I like to point out alternative ways of coding functionality, just in case you don't know such methods exist. So, enough gab, let's get on with it.

The first entry can be viewed <a href="http://ray.camdenfamily.com/demos/contest1/entry1/guessanumber.cfm">here</a>. Play with it a few times before going on to see if you find the same issues I did.
<!--more-->
Now that you have tried it out, let's take a look at the code:

<code>
&lt;cfset VARIABLES.thisPage = GetFileFromPath(GetTemplatePath())&gt;
&lt;cfset VARIABLES.lownumber = 1&gt;
&lt;cfset VARIABLES.topnumber = 100&gt;

&lt;cfparam name="FORM.guess" default=""&gt;
&lt;cfparam name="FORM.guesses" default=""&gt;
&lt;cfparam name="FORM.thenumber" default="#RandRange(lownumber,topnumber)#"&gt;
&lt;cfparam name="VARIABLES.message" default=""&gt;

&lt;cfif FORM.guess IS NOT ""&gt;
	&lt;cfset FORM.guesses = FORM.guesses & FORM.guess & ","&gt;
	&lt;cfif FORM.guess IS FORM.thenumber&gt;
		&lt;cfset VARIABLES.message = "That's it, good job! It took you #ListLen(FORM.guesses)# tries"&gt;
	&lt;cfelse&gt;
		&lt;!--- let's see where the guess is in relation to the number ---&gt;
		&lt;cfif FORM.guess GT FORM.thenumber&gt;
			&lt;cfset VARIABLES.message = "Your guess is too high"&gt;
		&lt;cfelseif FORM.guess LT FORM.thenumber&gt;
			&lt;cfset VARIABLES.message = "Your guess is too low"&gt;
		&lt;/cfif&gt;
	&lt;/cfif&gt;
&lt;/cfif&gt;

&lt;cfoutput&gt;
	I'm thinking of a number between #VARIABLES.lownumber# and #VARIABLES.topnumber#.&lt;br&gt;
	Care to guess what it is?&lt;br&gt;
	&lt;cfif FORM.guess IS NOT ""&gt;
		&lt;b&gt;You guessed #FORM.guess#. #VARIABLES.message#&lt;/b&gt;&lt;br&gt;
		So far you've guessed: #FORM.guesses#
	&lt;/cfif&gt;
	&lt;form action="#thispage#" method="post" style="width: 200px; text-align: right; "&gt;
		&lt;input type="hidden" name="thenumber" value="#FORM.thenumber#"&gt;
		&lt;input type="hidden" name="guesses" value="#FORM.guesses#"&gt;
		I think it's: &lt;input type="text" name="guess" size="3" value="#FORM.guess#"&gt;&lt;br&gt;
		&lt;input type="submit" value="take a guess"&gt;&lt;br&gt;
		&lt;input type="button" value="try again"  onClick="location.href='#thispage#';"&gt;
	&lt;/form&gt;
&lt;/cfoutput&gt;
</code>

There are some interesting techniques in here that beginners should be aware of. First off, note how the author created a variable, thispage, to stand for the current page. He uses that variable later on in the action attribute of the form. This is a <b>great</b> idea, as it means you can rename the file without having to worry about the form action. I will point out one thing I'd change, though. Instead of:

<code>
&lt;cfset VARIABLES.thisPage = GetFileFromPath(GetTemplatePath())&gt;
</code>

I'd use:

<code>
&lt;cfset VARIABLES.thisPage = cgi.script_name&gt;
</code>

This will return a slightly different value. Instead of just "foo.cfm", you will get the full path, "/moo/goo/foo.cfm". Both work of course, but the cgi variable involves a bit less code. 

<b>Edited:</b> Well, it figures that if I wrote a post pointing out mistakes in code, I'd make a mistake myself. Barney points out in the comments that cgi.script_name will have issues on a server with a context root that isn't /. Turns out, the authors solution was better than my solution. 

On a style note (not that I'm a style nazi), I noticed the author used the variables scope prefix, but forgot to use it again in both the form tag, and the "Try Again" button. In general, I do not use specify "Variables" when using the Variables scope, but if you do, you should try to use it consistently. Again, this isn't a huge deal, but something to keep in mind. Let's move on.

Notice what happens when you make a few mistakes? The author tracks your guesses, which is a nice touch, but the string is a bit messed up. Instead of seeing a list like "50, 75", you have "50,75,". Notice the trailing comma? This comes from this line:

<code>
&lt;cfset FORM.guesses = FORM.guesses & FORM.guess & ","&gt;
</code>

What should he have used? The <a href="http://livedocs.macromedia.com/coldfusion/7/htmldocs/00000547.htm#130310">listAppend</a> function:

<code>
&lt;cfset form.guesses = listAppend(form.guesses, form.guess)&gt;
</code>

ListAppend will automatically add the comma (or whatever delimiter) before adding the new entry. 

Another mistake - when the user finally picks the winning number, the "take a guess" button still shows up. This could be fixed by simply checking to see if the user has "won", and if so, hide the button.

So - now lets tackle the <b>bad</b> mistake. Have you guessed it yet? The code the author wrote does not make use of session or other RAM based variables. Instead, it keeps the state of the game in the form itself. That by itself isn't so bad, but the actual winning number is actually in the form. I discussed stuff like this in my last <a href="http://ray.camdenfamily.com/index.cfm/2005/9/14/Macrochat-Recording-and-Downloads">Macrochat</a>. Basically, you can't trust hidden form fields since they really aren't hidden. I don't mean to beat up on the author because security wasn't really important to this contest, but I want to use it as a warning to my readers in general. <b>Always think about security. Never stop. Period!</b> So, with that yelling out of the way (grin), what are some ways he could have gotten around it? Well, the <i>easiest</i> solution would be to move to RAM based variables and store the right answer (along with the guesses) in the Session scope. But let's say, for whatever reason, that isn't an option. There are a couple of things you could do. You could encrypt the value. It would still be visible to the user, but in encrypted form. Encryption is not perfect, but you need to weight the costs and benefits. If this game were for real money, then maybe that solution wouldn't work. But if it was just for fun, than it would be acceptable. Another option - create a UUID, which is a unique number, and store the right answer in a database table. The form would have the UUID, and you would simply look up the answer based on the UUID from the form. If the user changed the value for some reason (yes, Virginia, users can change form values if they want to be nasty), then the lookup would fail. You could log it, or simply generate them a new UUID. Do folks have other ideas?

So, thats it for the first entry. I have 5 or 6 more to go through before I pick a winner. Hopefully they will all be as interesting, and the author should feel proud. These are all "normal" mistakes, not "Oh my god, we hired a muppet" mistakes.