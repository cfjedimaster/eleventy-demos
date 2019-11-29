---
layout: post
title: "Ask a Jedi: Bilingual Sites"
date: "2006-06-19T23:06:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2006/06/19/Ask-a-Jedi-Bilingual-Sites
guid: 1344
---

A reader had a short and sweet question for me:

<blockquote>
What is the best way to create a bilingual site...english and spanish?
</blockquote>

Like many short questions - this one is actually a quite huge topic. I'm going to answer it, but folks should be aware that I'm just scratching the surface of a more in-depth answer.
<!--more-->
So at a high level, there are two things you should be concerned about. Internationalization is the process of preparing your site for translation. So for example, <a href="http://ray.camdenfamily.com/projects/blogcfc">BlogCFC</a> was internationalized so that no English was used for the public UI. So simple buttons that would say "Add Entry" were instead set to point to a generic resource instead. The second step is localization, where you actually write the language resources for your application. Along with localizing the content, you also want to localize the date strings. Now, I don't know Spanish, but if they do dates as many other non-American people do (day/month/year instead of month/day/year) then you will also need to be sure your dates are formatted correctly. Luckily ColdFusion provides localized versions of the date formatting functions so that is rather easy.

So that handles the front end of your site. (Again, remember I'm just giving a broad, high level overview.) What about your data? If you plan on ensuring that all of your content will be in both languages, you will want to set up your database so you can flag the content. So imagine that you have press releases. In a typical site the columns for such content may include:

id (primary key)<br/>
title<br/>
published date<br/>
body<br/>

In a site with both English and Spanish content, you will need a way to flag the language, and you will need a way to signify that two articles (one English and one Spanish) both represent one core article. 

For a simple solution, you could just add extra columns:

id (primary key)<br/>
title<br/>
titleSpanish<br/>
published date<br/>
body<br/>
bodySpanish<br/>

This works fine, but if your site supported multiple languages, it could get a bit unwieldy. You could instead try something like this:

id (primary key)<br/>
pressReleaseID (UUID)<br>
title<br/>
published date<br/>
body<br/>
language

In the above table schema I added a pressReleaseID column. This column will signify one press release, but will not be unique to the table. Any other row that matches this value will represent the same article, but another language. The other column I added was a language column which, obviously, represents the language. 

As I said, this is a way simplistic overview of how such a site could be done. The Jedi Master of issues like this is <a href="http://www.sustainablegis.com/blog/cfg11n/">Paul Hastings</a>. He helped me internationalize BlogCFC. Hopefully this gives you the basic gist of how a multilingual site could be handled.

p.s. In case folks are curious why I'm not blogging like my normal mad self, I'm on vacation today and tomorrow.