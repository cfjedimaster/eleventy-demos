---
layout: post
title: "First stab at my Flex homework"
date: "2006-11-21T21:11:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2006/11/21/First-stab-at-my-Flex-homework
guid: 1667
---

The first version of my <a href="http://ray.camdenfamily.com/index.cfm/2006/11/21/My-Thanksgiving-Flex-Homework">Flex homework</a> is done. You can view it here: 

<a href="http://ray.camdenfamily.com/demos/flexsec/SimpleRemotingTest.html">http://ray.camdenfamily.com/demos/flexsec/SimpleRemotingTest.html</a>

Ignore the "SimpleRemotingTest" name - it was an empty project I modified for this task. So what does this version support and how did I do it?

First off - I learned how to use States in Flex 2. I have to be honest. States really confuse me. I kind of looked at States like pages. I had assumed states would work a bit like so: (And again, this is NOT real Flex code - just what I expected.)

<code>
&lt;mx:State name="alpha"&gt;
controls in here that are visible when alpha is turned on
&lt;/mx:State&gt;
&lt;mx:State name="beta"&gt;
controls in here that are visible when bet is turned on
&lt;/mx:State&gt;
</code>

In other words - I assumed that an inactive state would simply set all the fields inside it to invisible. That is not the case. Switching to a state runs a set of <i>actions</i>. You can add controls, remove controls, and change the properties of controls. This just feels weird to me - but I think I've gotten the hang of a it a bit.

If you view my <a href="http://ray.camdenfamily.com/demos/flexsec/SimpleRemotingTest.html">example</a>, you will notice that you can enter anything for the username and password, and when you hit the button - the logon panel goes away and some text shows up on screen. Here is the code I used:

<code>
&lt;mx:states&gt;
	&lt;mx:State name="login"&gt;
			
	&lt;/mx:State&gt;
		
	&lt;mx:State name="default"&gt;
		&lt;mx:RemoveChild target="{% raw %}{loginStage}{% endraw %}" /&gt;
		&lt;mx:SetProperty target="{% raw %}{mainStage}{% endraw %}" name="visible" value="true"/&gt;
	&lt;/mx:State&gt;
		
&lt;/mx:states&gt;
</code>

The login state represents my default state. This worked out of the box but made me nervous. I added this to my Application tag: currentState="login". This ensured that my login state is always the default. 
Now take a look at the default state. I guess that name is kind of bad - but for me it meant the default version of the application <i>after</i> you have logged in. Kind of like the home page of a protected web site. Inside this tag I do two things. I first remove the loginStage element using the RemoveChild tag. I had wrapped my login panel with an hbox I named loginStage, where stage seemed like a good way to refer to a "block" of items. I then use the SetProperty tag to change my hidden stage to visible.

I had some help from Ben Forta on this. He yelled at me (ok, he didn't yell, he just repeated a few times) to actually use design mode. I really need to get it through my head: <b>Design mode in Flex Builder 2 does NOT suck!</b>. Not only does it not suck - it is really useful. How did I figure out how to show mainStage? I switched to design mode. Selected the default state. Found my hidden mainStage HBox in the Outline, and changed the visible property. When I returned to code view my SetProperty was done for me.

If you want to see the full source to what I built, just right click and select View Source on the <a href="http://ray.camdenfamily.com/demos/flexsec/SimpleRemotingTest.html">demo</a>. 

As a preview for the next entry - I've already figured out that I could have done this better <i>without</i> states (thanks to people smarter than me). In the next entry I'll be removing them completely - but I am happy I finally "get it!"