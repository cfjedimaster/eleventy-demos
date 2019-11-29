---
layout: post
title: "Brackets Tip: Specifying one linter (the right way)"
date: "2015-03-03T16:00:46+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2015/03/03/brackets-tip-specifying-one-linter-the-right-way
guid: 5763
---

A few days ago I noticed Brackets was no longer linting JSON files. I had recently updated so I assumed it was a bug with that particular extension. Like a good developer, I checked the console and when I didn't see anything, I filed a report and moved on. (For folks curious, the extension I was using is called "JSONLint Extension for Brackets" by Ingo Richter. Oh, and for what I used when it was't working - I used <a href="http://jsonlint.com/">JSONLint.com</a>.) Turns out the issue was a mistake I made in my preferences.

<!--more-->

Brackets has a pretty complex preferences system. While there isn't a UI for it, you can open your global preferences file by going to the Debug menu and selecting Open Preferences File. Brackets ships with a linter for JavaScript files called JSLint. I have another extension that wraps JSHint that I prefer. By default, if Brackets sees multiple linters for a file, it will display issues from both:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/shot4.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/shot4.png" alt="shot" width="850" height="484" class="alignnone size-full wp-image-5764" /></a>

That's not really ideal so I checked out the <a href="https://github.com/adobe/brackets/wiki/How-to-Use-Brackets#preferences">Preferences docs</a> on how I could correct this. 

I focused my attention on two settings: linting.prefer and lintingUsePrefferedOnly. The first lets you specify an order of preferred linters and the second specifies that you only want to use the preferred one. So I added this to my global preferences:

<pre><code class="language-javascript">"linting.prefer": [
    "JSHint"
],
"linting.usePreferredOnly": true,</code></pre>

Seems legit, right? I prefer JSHint and I only want to use that. However, this was the root of my issues. Because this preference was global, it applied to <strong>all</strong> file types. When reading the docs, I had focused in on the table of settings and missed this <strong>crucial</strong> detail:

<blockquote>
Within either file, there are three levels of specificity at which you can set a preference:

<ul>
<li>default - global (user-level file) or project-global (project-level file)
<li>"path" layer - overrides in effect for files that match the given path/filename wildcard
<li>"language" layer - overrides in effect for files that Brackets detects as the given programming language (this is also filename/extension based, but it's easier to work with since Brackets already understands many file extensions out of the box, and additional languages supported by Brackets extensions can automatically be used here too).
</ul>
</blockquote>

Basically, you can specify settings per language, which is what I needed to do for JavaScript. Here is the corrected version:

<pre><code class="language-javascript">"language": {
    "javascript": {
        "linting.prefer": [
	    "JSHint"
	],
    "linting.usePreferredOnly": true
    }
},
</code></pre>

And that corrected it. In JavaScript I only see JSHint and my other linters work fine elsewhere. A big thank you to <a href="https://github.com/redmunds">Randy Edmunds</a> for pointing out my mistake.