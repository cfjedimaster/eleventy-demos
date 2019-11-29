---
layout: post
title: "Take a look at Angular"
date: "2011-06-19T16:06:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2011/06/19/Take-a-look-at-Angular
guid: 4273
---

Earlier this year I had the opportunity to hear <a href="http://www.elliottsprehn.com/blog/">Elliott Sprehn</a> talk about <a href="http://angularjs.org/#/">Angular</a> at cfObjective. I found the session fascinating and promised myself I'd play around with it a bit more later. I've finally gotten around to doing so and I thought I'd share a few thoughts on why folks may want to check it out.
<p/>
<!--more-->
First, what is Angular? At a high level it's a JavaScript library, much like jQuery is. (Edit: Ok, so "library" is not how Angular likes to describe itself, as you can read <a href="http://docs.angularjs.org/#!/guide/dev_guide.overview">here</a> in the "More Angular Philosophy" section. I get that - but I'm leaving the text in because I think it's the most direct way to get people thinking about Angular.) But what specifically does it feature? I'm going to quote their site and give a bit of commentary.
<p/>

<blockquote>
<b>Declarative UI Templates</b><br/>
HTML is already a good templating language; angular makes it better. Preview your UI in your favorite HTML editor.
</blockquote>
<p/>

Right away one of the first things I noticed was that Angular reminded me a lot of Spry. I know I don't use Spry much anymore, but I have a great deal of respect for how easy Spry made it to take Ajax-loaded data and display it on screen. There's work being done on the jQuery side to help that as well (with templates), but seeing Angular's built in support for it really blew me away. As a simple example, and I know this won't be terribly clear out of syntax, but here's a simple template that iterates over a list of phones:

<p/>

<code>
 &lt;ul&gt;
    &lt;li ng:repeat="phone in phones"&gt;
      {% raw %}{{phone.name}}{% endraw %}
      &lt;p&gt;{% raw %}{{phone.snippet}}{% endraw %}&lt;/p&gt;
    &lt;/li&gt;
  &lt;/ul&gt;
</code>

<p/>

Code like this is something that a non-developer could easily work with. You could imagine a designer going in and tweaking layout. 

<p/>

<blockquote>
<b>Two-Way Data Binding</b><br/>
With angular, the view and data model are always in sync -- there is no need for manual DOM manipulation
</blockquote>

<p/>

What this means - to me anyway - is that there is much less $("#foo").html() and more just name=something. The binding allows you to work with data and have your display automatically update. It simplifies things quite a bit.

<p/>

<blockquote>
<b>Framework</b><br/>
Angular supports the entire development process, provides structure for your web apps, and works with the best JS libraries.
<br/><br/>
<b>MVC with Dependency Injection</b>
Separation of concerns, loose coupling, and inversion of control -- all the good stuff for testable and maintainable code.
</blockquote>

<p/>

This is where things get interesting. I've done a lot of jQuery work. A lot. But in general it's small features - ie a few things on a page. Certainly useful - powerful - etc. But not necessarily very deep. I've done a few games where I've gotten close to something that's a bit complex, but it's been a bit of a struggle to figure out the best way to organize things. It's a problem. And as I've said before - MVC (and design patterns in general) exist to help solve problems. I'm still wrapping my head around how Angular does this, but from what I see it makes adding MVC to your application very straight forward - especially with it's use of DI. 

<p/>

Here is what really sold me on Angular and - frankly - impressed the hell out of me. Angular has a <a href="http://docs.angularjs.org/#!/tutorial">tutorial</a>. Ok, so do most frameworks. But what really surprised me was how well their tutorial is presented.

<p/>

First - they make use of Git. Now - if you've never used Git before - don't let that scare you away. They lead you through how to get Git and tell you <b>precisely</b> what command lines you need to use. <b>You don't have to learn Git.</b> As you progress through the tutorial you load in a new branch for each step. What I realized - pretty early on - was that this allowed me to play around a bit. In fact, at the end of each step they have a set of experiments for you to try. This encourages you to screw around and best of us - if you break stuff - you have nothing to lose. Just go ahead to the next step and use Git to set the code up. 

<p/>

Second - they make use of unit testing. Right away. I'm not a TDD extremist, but I definitely encourage the use of unit testing, and seeing them being used throughout the tutorial was great. Let's be honest - no one is testing enough. (It certainly isn't just a problem for ColdFusion devs.) The more encouragement folks have to add testing to their development cycle the better off we will all be. 

<p/>

I haven't yet done any demos with Angular, but I'm hoping to build something involving a ColdFusion back end this week. I'm also interested to see if I can rebuild my old Hangman Adobe AIR application to make use of it. If any of my readers have used it and want to share their experiences, I'd love to hear about it. I'd also recommend the <a href="https://groups.google.com/forum/#!forum/angular">mailing list</a>. I posted there a few times and got responses pretty quickly (and friendly responses at that - friendly communities rock). 

<p/>

p.s. Ok - so one thing I'm not sure about is if I should be calling it "Angular" or "AngularJS" or "&lt;angular/&gt;". I can promise you I'm not going to use the last version - that's too much typing. ;)