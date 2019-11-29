---
layout: post
title: "Stupid ColdFusion Syntax Trick"
date: "2009-09-01T13:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/09/01/Stupid-ColdFusion-Syntax-Trick
guid: 3508
---

I was in a development meeting earlier today and the following typo came up on screen:

<code>
x = "That's no moon. It's a space station.";
writeOutput (x);
</code>

Notice the space? What was odd though was that ColdFusion Builder did <b>not</b> flag it as an error. On a whim I tried it and it actually worked. I even added about 20 spaces between the end of writeOutput and the left parenthesis and it ran with no complaints. 

Weird - and useless - but kind of interesting how ColdFusion Builder helped me discover something I didn't know you could do.