---
layout: post
title: "Ask a Jedi: Foreign text over CFDIV"
date: "2010-07-19T12:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/07/19/Ask-a-Jedi-Foreign-text-over-CFDIV
guid: 3882
---

Darren asks:
<p>
<blockquote>
I've currently got an issue with cfdiv. I have a European site translated into lots of different languages, what seems to be happening is the html content, specifically the accents are not being encoded correctly in our favorite browser Internet Explorer! All other browsers are fine, the server is cf8 not 9 so I don't know if this would jave been fixed or not.
<br/><br/>
I tried adding cfcontent inside the template to force it (another devs suggestion) but it didn't make any diff, just wondered if you had any other ideas about it other than ripping out cfdiv an using jquery, though I don't know if this would be the case for any ajax request.
</blockquote>
<p>
<!--more-->
So I'm no localization expert, that would be <a href="http://cfg11n.blogspot.com/">Paul Hastings</a>, but I did have an idea as to what was wrong here. I began with two quick CFMs, one a client that would use Ajax to load the other. The second page would have my foreign text in it. Here is the first page.
<p>
<code>
&lt;h2&gt;Parent Page&lt;/h2&gt;
&lt;cfdiv bind="url:test3.cfm"&gt;
</code>
<p>

Yeah, that's it, but it's enough to recreate our page. Now our second page:

<p>

<code>
Me permettez-vous, dans ma gratitude pour le bienveillant accueil que
vous m'avez fait un jour,
d'avoir le souci de votre juste gloire et de vous dire que votre
étoile, si heureuse jusqu'ici,
 est menacée de la plus honteuse, de la plus ineffaçable des taches ?
</code>

<p>

No code there, just French text. I've forgotten 95% of my high school and college French, so if that's something offensive, please pardon the French. (Heh, sorry, couldn't resist.) I "fixed" this by simply adding a processing directive to the page.

<p>

<code>
&lt;cfprocessingdirective pageencoding="utf-8"&gt;
</code>

<p>

This sets the encoding value for the page which helps the response render right in the browser. I still find a lot of localization stuff voodoo, but I was surprised to find that Adobe has a ColdFusion Localization "center" - <a href="http://www.adobe.com/devnet/coldfusion/localization_globalization.html">http://www.adobe.com/devnet/coldfusion/localization_globalization.html</a>. It's a grand total of four articles, but it may be a good starting point for folks.