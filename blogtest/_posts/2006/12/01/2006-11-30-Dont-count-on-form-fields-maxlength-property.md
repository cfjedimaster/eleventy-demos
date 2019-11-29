---
layout: post
title: "Don't count on form field's maxlength property"
date: "2006-12-01T11:12:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2006/12/01/Dont-count-on-form-fields-maxlength-property
guid: 1687
---

I've talked about this before, but don't count on maxlength in your form fields. Why? Because it is trivial to turn them off using Firefox's Web Developer toolbar extension. I was looking at a ColdFusion based shopping cart solution today, and noticed that when I did this to their cart display, I was able to enter a huge number for the line item. What was my final line item price?

499, 900, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000, 000.00

I hope that comes with free shipping. I'm not revealing the name of the product as I've emailed them to inform them of the bug and I'm sure I've made the same mistake myself as well. Of course, if I don't hear back maybe I will anyway. ;)