---
layout: post
title: "Getting the columns of a Spry Dataset"
date: "2007-03-23T09:03:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2007/03/23/Getting-the-columns-of-a-Spry-Dataset
guid: 1918
---

A friend asked yesterday how he could get the columns from a dataset in Spry. I was sure there was an API for this, but it turns out there isn't. Luckily for me (and maybe not for Adobe), I've got the Spry guys on speed dial so I can bug them directly. Here is what Kin Blas had to say:
<!--more-->
<blockquote>
You can get the columns for a given row in JS like this:
</blockquote>

<code>
var row = ds.getCurrentRow();
var colNames = [];
for (colName in row)
	colNames.push(colName);
</code>

<blockquote>
Now keep in mind that because folks aren't always consistent in their XML output (they make attributes optional, sometimes the same elements don't have the same number of elements underneath them, etc ... that a given row may have more or less columns than the one that precedes it.
</blockquote>

Thanks Kin! I did mention to him that it would be a good idea to add a formal API for this.