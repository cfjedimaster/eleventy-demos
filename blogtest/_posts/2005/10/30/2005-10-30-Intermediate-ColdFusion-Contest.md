---
layout: post
title: "Intermediate ColdFusion Contest!"
date: "2005-10-30T14:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/10/30/Intermediate-ColdFusion-Contest
guid: 883
---

After the success of the first <a href="http://ray.camdenfamily.com/index.cfm/2005/9/20/Contest-Shall-We-Play-a-Game">ColdFusion contest</a>, I have decided to go ahead and run a second contest. As before,  it will involve games because, well, I think games are cool, and by their very nature games present many interesting challenges. 

This contest will be for intermediate developers. As before, I'm going to count on your honesty. If you are a ColdFusion Ninja, than wait till the next contest. (I have what I think is an uber cool idea for that one.) This contest will be to create a Blackjack game. In order to make the design a bit easier, I found this <a href="http://www.jfitz.com/cards/">url</a>, which contains card images that are free for anyone to use. All entries must use one of these card sets. Now for the particulars:

<ul>
<li>I am <b>not</b> a professional gambler, so the following rules will be a <b>subset</b> of "real" Blackjack games. 
<li>Every Blackjack game will begin by having two cards given to the player, and two cards given to computer. One card should be handed out at a time. One of the computer's cards will be visible.
<li>The player goes first. The player has two options. They can either "hit", which means ask for a new card, or "stay", at which point the computer takes over.
<li>The point of Blackjack is to get as close to 21 points as possible. If you go over 21 points, your game is over.
<li>Aces can be either one or eleven.
<li>If the computer and the player tie, the computer (dealer) wins.
<li>The computer must hit if the value of it's hand is less than 17. Once the value becomes 17 or higher, the dealer must stay.
<li>There is no "double down", "splitting pairs", or getting 5 cards for an automatic win. Again - I want to keep things simple.
<li>The game must use session management and track your progress though multiple hands. It is up to you to decide how much money to give the player.
<li>You do not need to keep track of cards after a hand. In other words, you can reshuffle for each hand.
</ul>

Design is not important - however - there were some cool design tricks I saw in the last design that I thought worked well. These weren't "artsy" things, but UI things that improved the game. I hope that distinction makes sense. Contest entries should be emailed to me at ray@camdenfamily.com. The deadline is two weeks from today, November 13th.

Oh - so I bet you want to know what the prize is? Well, it's just a small little piece of software... a full copy of ColdFusion MX Standard, a 1,299 dollar value. Big thanks go to <a href="http://www.macromedia.com">Macromedia</a> for sponsoring this prize. 

If you have any questions on the rules, please post it here so everyone can benefit from it - and with that - good luck!

<b>Edited:</b> Just a quick note as I don't think I made it obvious. You will start the player with a certain amount of money. For each hand the player decides how much they want to bet, and obviously it must be less than or equal to what they have in their bank.