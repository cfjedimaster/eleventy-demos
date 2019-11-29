---
layout: post
title: "Using jQuery to validate the sum of form fields (2)"
date: "2009-03-27T08:03:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/03/27/Using-jQuery-to-validate-the-sum-of-form-fields-2
guid: 3292
---

Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2009/3/26/Using-jQuery-to-validate-the-sum-of-form-fields">blogged</a> about how you can use jQuery to validate the sum of a set of form fields. I had some great feedback, including a comment by <a href="http://flexoop.com/">Gareth Arch</a>. He raised the point that - if you had 2 form fields that need to sum to 100, why not simply just let the user edit one field and automatically set the value of the other?

I liked this idea - but I didn't want to block editing of one particular field. Depending on how you feel you may want to edit either of the two fields. I based my modification on my <a href="http://www.coldfusionjedi.com/demos/cv/cv2.html">last demo</a> and added the following:

<code>
function setTo100() {	
	var theVal = parseInt($(this).val())
	var otherVal = 100-theVal
	if(this.id == 'phappy') $("#puhappy").val(otherVal)
	else $("#phappy").val(otherVal)
}
	
$("#phappy").change(setTo100)
$("#puhappy").change(setTo100)
</code>

Simply - I monitor the change event for my two form fields. When run, I get the value of the field changed and figure out what the other should be. I then look at the ID of the field changed and simply update the other one. 

Simple and easy. You can demo this <a href="http://www.coldfusionjedi.com/demos/cv/cv3.html">here</a>.