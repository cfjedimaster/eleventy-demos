---
layout: post
title: "Ask a Jedi: Flexible string comparisons"
date: "2008-01-03T14:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/01/03/Ask-a-Jedi-Flexible-string-comparisons
guid: 2573
---

Martin asks a pretty interesting question about comparing strings:

<blockquote>
<p>
Is there a way to compare the similarities of variable strings in ColdFusion? For instance, lets say
variable.foo = "15 St Mungo Place" and variable.coo = "15 St. Mungo Place"

Sql will not return a match but you and I both know that these two strings mean the same thing AND that there is only a one character difference.

My question is - Is there a way to get Coldfusion to recognise that there is only a one character difference (similarities) between the two strings. Obviously the potential applications for search queries etc.. could be enormous here so I'm VERY curious to see if this is possible.
</p>
</blockquote>

Right off the bat, there is nothing baked into ColdFusion that will do this automatically, so we have to look at other possible solutions. 

For some cases, you could use straight substitutions. You could have a list of common alternative spellings ("st. for st") and loop over them and do replacements. That will work for simple things but probably isn't going to scale up.

You could also compare strings and see how close they are. I did some Googling on that, and kept coming across the <a href="http://en.wikipedia.org/wiki/Levenshtein_distance">Levenshtein distance</a> formula. I was actually working to rebuild the pseudo-code on Wikipedia when I remembered CFLib - turns out it has a udf, <a href="http://www.cflib.org/udf.cfm?ID=1067">levDistance</a>, that can use this logic. 

This is still somewhat of a slow process as you would need to compare your search against all the words in the database. This is probably a case where something like Verity, or the full text searching feature of your database, may be more handy.

Anyone done anything like this in ColdFusion?