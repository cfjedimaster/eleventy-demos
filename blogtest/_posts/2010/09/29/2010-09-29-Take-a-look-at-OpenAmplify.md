---
layout: post
title: "Take a look at OpenAmplify"
date: "2010-09-29T11:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/09/29/Take-a-look-at-OpenAmplify
guid: 3955
---

Yesterday I discovered a service called <a href="http://community.openamplify.com/content/docs.aspx">OpenAmplify</a>. OpenAmplify is a free API that provides deep, and I mean really deep, textual analysis. Currently they only support English, and I've no idea how long the service will remain free, but the level of detail their analysis provides is pretty darn stunning. As an example of the level of detail it provides, when I used their API to scan this blog, it was able to tell me:
<!--more-->
<p/>

<ul>
<li>I'm a male adult (which, ok, to be fair, is pretty easy to guess ;)
<li>My writing has a high level of decisiveness and is somewhat flamboyant (cool)
<li>It says I offer guidance "a lot" which is very accurate
<li>My content is more positive than negative 
<li>My topics include computers, computer programming, html, ajax, etc
<li>And waaay more info than I can describe here
</ul>

<p/>

Along with parsing a URL, you can also check individual strings. So for example, I wrote up a CFC wrapper that allows you to just do this:

<p/>

<code>
&lt;cfset oa = new openamplify("my key")&gt;
&lt;cfset res = oa.parse(text="This is a test of the openamplify system. It is slick!")&gt;
</code>

<p/>

I then dumped out the polarity:

<p/>

<code>
&lt;cfdump var="#res.styles.polarity#"&gt;
</code>

<p/>

<img src="https://static.raymondcamden.com/images/screen8.png" />

<p/>

Polarity values will range from -1 (negative) to 1 (positive). Watch what happens when I change my text to something a bit more excited: "This is a test of the openamplify system. It is super awesome!"

<p/>

<img src="https://static.raymondcamden.com/images/cfjedi/screen9.png" />

<p/>

Notice how it went up a bit to reflect the higher level of positivity. I did tests with negative values as well and found the API to be a bit scary in how accurate it was.

<p/>

Anyway - I'm very impressed by this service so far. Imagine this in a blogging application. You could run a daily report that gathers comments posted in the previous 24 hours and report on the top topics as well as the general mood of the discussions. For an online community, that type of feedback could be killer. If you see a sharp swing to the negative and a particular product is a top topic, then you can immediately begin working on figuring out why the product is getting such bad commentary. Take a look at the CFC I attached to this entry. It is pretty simple and could probably be improved a bit. Consider it free and open source.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fopenamplify%{% endraw %}2Ezip'>Download attached file.</a></p>