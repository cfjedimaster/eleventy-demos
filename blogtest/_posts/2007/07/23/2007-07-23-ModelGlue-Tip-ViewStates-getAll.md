---
layout: post
title: "ModelGlue Tip: ViewState's getAll()"
date: "2007-07-23T23:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/07/23/ModelGlue-Tip-ViewStates-getAll
guid: 2214
---

I was just talking to Todd and helping him a bit with some ModelGlue development. He was talking about doing some testing of ViewState values. I mentioned he should use the getAll()  method of the viewState. If you want to quickly see what is available in a view, just drop this line in:

<code>
&lt;cfdump var="#viewState.getAll()#" label="The Whole Enchilada"&gt;
</code>

I use this all the time when working on a Model-Glue site.