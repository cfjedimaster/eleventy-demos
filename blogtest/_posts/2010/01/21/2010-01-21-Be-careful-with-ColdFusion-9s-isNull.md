---
layout: post
title: "Be careful with ColdFusion 9's isNull"
date: "2010-01-21T22:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2010/01/21/Be-careful-with-ColdFusion-9s-isNull
guid: 3692
---

I guess this isn't surprising - but I certainly wasn't expecting it. Check out the following code snippet:

<p>

<code>
public function renderPanels(string area, any me, any group = "", any helper="") {
	var panels = getPanels();
	if(isNull(paensl)) return;
	for(var i=1; i&lt;=arrayLen(panels); i++) {
		if(panels[i].getArea() == arguments.area) {
</code>

<p>

Notice anything odd? How about that horrible typo on the 3rd line. But what surprised me was that this didn't throw a variable is undefined error. Since the variable didn't exist, it returned true for isNull. Obviously I expect to get nulls from my getPanels() code (a Page object may have panels) but the typo made it <i>always</i> return true.

<p>

Again - 100% obvious and expected - but this is the first time I've done this in CF9.