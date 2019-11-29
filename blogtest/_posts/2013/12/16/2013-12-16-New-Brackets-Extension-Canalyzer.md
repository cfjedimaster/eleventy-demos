---
layout: post
title: "New Brackets Extension - Canalyzer!"
date: "2013-12-16T16:12:00+06:00"
categories: [development,html5,javascript]
tags: []
banner_image: 
permalink: /2013/12/16/New-Brackets-Extension-Canalyzer
guid: 5103
---

<p>
Over the past few days I've worked on a little experiment for Brackets that I wanted to share with folks. I'm not sure this is a good idea. Or a practical one for that matter. But that hasn't stopped me from sharing code before so why start now?
</p>
<!--more-->
<p>
Today I've released <a href="https://github.com/cfjedimaster/canalyzer">Canalyzer!</a> (also available via the Brackets Extension Manager). Canalyzer attempts to parse your project directory for possible compatibility issues. For example, if your code makes use of a datalist then you may want to know that datalist isn't available on certain platforms. It uses a "dictionary" of regular expressions that match to <a href="http://www.caniuse.com">CanIUse.com</a> features. For each match it can then report on the possible browser issues.
</p>

<p>
<strong>To be clear</strong>, just because you have a piece of code in your HTML does <strong>not</strong> mean it won't render in a particular browser. datalist is a great example of this. Yes, an unsupported browser won't support the autocomplete feature. But it won't throw an error either! The same goes for modern HTML form types. These all degrade perfectly well into plain text fields.
</p>

<p>
My intent here wasn't to report these items as things you should fix, but more so to ensure you are <i>aware</i> of the items. 
</p>

<p>
Here is a screen shot showing it in action. And yes - this could be rendered a bit nicer.
</p>

<p>
<img src="https://static.raymondcamden.com/images/ss12.png" />
</p>

<p>
You will note that there are only 5 browsers listed. That was a personal choice based on what I thought would be most important. The feature link you see in the screen shot brings you to the specification for that feature. I should also point out that the "dictionary" has a grand total of... 2 items. So this is where other people come in. If people think this is a good idea - if they think they will actually use it - I'll definitely continue to work on it. I will also gladly accept pull requests from people who want to do some of the <strike>grunt</strike>glorious work.
</p>

<p>
Check it out. Again, you can grab the source over on GitHub (<a href="https://github.com/cfjedimaster/canalyzer">https://github.com/cfjedimaster/canalyzer</a>) or via the Extension Manager.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s25.png" />
</p>