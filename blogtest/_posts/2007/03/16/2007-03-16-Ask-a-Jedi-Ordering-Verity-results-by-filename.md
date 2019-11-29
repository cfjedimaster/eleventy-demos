---
layout: post
title: "Ask a Jedi: Ordering Verity results by filename"
date: "2007-03-16T14:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/03/16/Ask-a-Jedi-Ordering-Verity-results-by-filename
guid: 1898
---

David had an interesting question about Verity results:

<blockquote>
Is there an easy way to order the output of a Verity spider search based on the .cfm page it offers in the results?

An example:

If someone searched for "hammer". Right now my search results show Press Releases that contain "hammer" before it shows Product pages containing "hammer". Can I tell Verity to give pages such as "product.cfm" a better rank than "pressrelease.cfm" where each would have query strings?
</blockquote>

So the short answer is - as far as I know, no. You can't tell Verity to give a higher rank based on the filename. Let me just say though that Verity's language can get super complex. I'd be willing to bet I'm wrong on this. But, either way, there is a simple way around this.
<!--more-->
Do not forget that the result of a Verity search is a ColdFusion query. That means you can use Query of Query on it. Therefore, you could easily select all the columns, and use an order by that gives preference to another column. Now for filenames (which would be your KEY or URL value most likely), the sort would be in alphabetical order. You could assign a rank to the file type. So if the file contained product.cfm, then the rank would be 1. If it contained pressrelease.cfm, it would be 2. If you store this value in the first custom column, then you could simply sort your results like so:

ORDER BY SCORE DESC, CUSTOM1 ASC

This simply says to sort on score, but on a tie, use the CUSTOM1 column, which would contain the custom value I described above.