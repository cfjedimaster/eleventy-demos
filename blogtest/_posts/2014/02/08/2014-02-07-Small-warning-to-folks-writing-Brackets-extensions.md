---
layout: post
title: "Small warning to folks writing Brackets extensions"
date: "2014-02-08T08:02:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2014/02/08/Small-warning-to-folks-writing-Brackets-extensions
guid: 5148
---

<p>
I've been writing extensions for Brackets now for at least a year and I never ran into this issue until yesterday, so as far as I can tell, the chances of anyone hitting the same issue is probably very slim. I tend to have a knack for hitting weird bugs though so I figured I should share this on the <strong>very</strong> off chance it hits anyone else. In theory this can only hit people who create extensions, but technically, it could hit people who manually install extensions as well. 
</p>
<!--more-->
<p>
I have an extension I built that does CSS linting. In the most recent Brackets update, you can now support multiple linters per file type. I wanted to see what that looked like so I tried to install <i>another</i> CSS linter. 
</p>

<p>
<img src="https://static.raymondcamden.com/images/sho1.png" />
</p>

<p>
But something odd happened. When I clicked install, I got this:
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot25.png" />
</p>

<p>
Notice that it thinks I have it installed already, and the version number it thinks I have matches the version number for my extension. At this point, I didn't know what to do so I just filed a <a href="https://github.com/adobe/brackets/issues/6797">bug report</a>. I did some more tinkering though and discovered what was going on.
</p>

<p>
The other extension used a name in package.json of "brackets-csslint". Mine uses "camden.csslint". Turns out, the name value is also used for the folder name when installing. When I first built my extension (before there was even such a thing as the extension manager) I used a folder name of... brackets-csslint. So because my extension had the same folder as the one the new one wanted to use - Brackets got confused. To fix this I simply renamed my own folder to match the package name value.
</p>

<p>
Peter Flynn (from the Brackets team) has already suggested that the error could be improved here but honestly, I don't know if this will hit very many people. I wanted to share it though just in case. Finally, curious to see how the multiple linter support works? Here is a screen shot:
</p>

<p>
<img src="https://static.raymondcamden.com/images/shot33.png" />
</p>

<p>
You may notice - both linters have the same name. This is because both extensions registered themselves with the same name. I've filed a <a href="https://github.com/adobe/brackets/issues/6805">ER</a> to see if it makes sense to add some other type of indicator to the UI so we can tell one from another.
</p>