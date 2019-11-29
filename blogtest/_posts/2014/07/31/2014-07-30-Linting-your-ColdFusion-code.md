---
layout: post
title: "Linting your ColdFusion code"
date: "2014-07-31T08:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2014/07/31/Linting-your-ColdFusion-code
guid: 5278
---

<p>
Earlier this week I discovered a new project on GitHub, <a href="https://github.com/ryaneberly/CFLint">CFLint</a>. For my readers who may not be aware, linters are tools that inspect your code for bugs, best practices, and other issues. Numerous different types of linters exist, but as far as I know this is the first one for ColdFusion. It is still a bit rough (in my tests it would routinely have parsing issues on some of my files) but it is a good start and I think it could be a great tool for ColdFusion developers.
</p>
<!--more-->
<p>
<img src="https://static.raymondcamden.com/images/CFLint-logo.jpg" />
</p>

<p>
You can test this yourself on the project's <a href="https://github.com/ryaneberly/CFLint/releases">releases</a> page. They included scripts for both OS X and Windows. The core code is Java based if you want to peak under the hood. Like most linters, you can also disable rules you don't agree with. As I said, it isn't perfect, but I'd strongly urge folks to check it out and - even better - help improve it.
</p>

<p>
Want to test it out with ColdFusion Builder? I worked on an extension for it last night. You can right-click on a project, folder, or file and scan it using CFLint. As an example:
</p>

<p>
<img src="https://static.raymondcamden.com/images/cflint.png" />
</p>

<p>
You can click on each line item to open the file right to the line reported by CFLint. Currently the biggest issue is that it doesn't provide feedback while it is working. If you test it on a large project, keep that in mind. You can download my extension here: <a href="https://github.com/cfjedimaster/CFLint-Extension">https://github.com/cfjedimaster/CFLint-Extension</a>.
</p>