---
layout: post
title: "Using jQuery to validate the sum of form fields"
date: "2009-03-26T10:03:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/03/26/Using-jQuery-to-validate-the-sum-of-form-fields
guid: 3290
---

Christian asked an interesting question yesterday. The solution ended up being rather simple, but I wasted (well, wasted may be a strong term) time trying to solve it in an overly complicated manner. One of the things I've learned when it comes to ColdFusion development is that it almost always makes sense to go for simplicity. While not always possible, it doesn't hurt to stop and ask myself if the route I'm going down to solve some problem could be simplified in some way. Let me share the problem, and then I'll share the complex solutions I tried until I got to a much simpler fix.

Christian asked:

<blockquote>
<p>
I was looking through your jQuery form validation posts (very helpful, thanks!) and then through the jQuery validation docs and I can't seem to find an example of something that is probably very simple.
</p>
<p>
I have two text input fields that I need to make sure are integers AND that they total 100.
</p>
</blockquote>
<!--more-->
So - ensuring two fields are numeric and add up to 100. The first part of that equation is simple enough. You can use a number validator for that. You can also get a bit fancy and use a min/max validator as well. The numbers should not be less than 0 nor higher than 100. However, I was really confused about how to check the sum of two fields. 

My first attempt to solve this was by using a custom rule. I talked about this during my <a href="http://www.raymondcamden.com/index.cfm/2009/2/10/An-Introduction-to-jQuery-and-Form-Validation-2">form validation series</a>. The validation plugin allows you to define any custom rule and apply it to a field. But the problem is that the rule applies to <b>one</b> field. The plugin will only pass in the field's value. You do have the option to pass any number of params to the rule. That's what I tried at first. So imagine this form:

<code>
&lt;form id="commentForm" method="get" action=""&gt;
 &lt;fieldset&gt;
   &lt;p&gt;
     &lt;label for="phappy"&gt;Percent Happy&lt;/label&gt;
     &lt;em&gt;*&lt;/em&gt;&lt;input id="phappy" name="phappy" size="2" /&gt;
   &lt;/p&gt;
   &lt;p&gt;
     &lt;label for="puhappy"&gt;Percent Unhappy&lt;/label&gt;
     &lt;em&gt;*&lt;/em&gt;&lt;input id="puhappy" name="puhappy" size="2" /&gt;
   &lt;/p&gt;
   &lt;p&gt;
     &lt;input class="submit" type="submit" value="Submit"/&gt;
   &lt;/p&gt;
 &lt;/fieldset&gt;
 &lt;div class="error"&gt;&lt;/div&gt;
 &lt;/form&gt;
</code>

I've got two form fields, phappy, and puhappy. They represent how happy and unhappy you are, percentage wise, and should total 100. I mentioned that custom rules only get data for themselves, but can be passed additional parameters. I designed my rule then to let me specify which form IDs to check and what total value to require:

<code>
rules: {
	phappy: {
	required: true,
	number: true,
	min: 0,
	max: 100,
	checksum : [["phappy","puhappy"],100]
	},
	puhappy: {
	required: true,
	number: true,
	min: 0,
	max: 100,
	checksum : [["phappy","puhappy"],100]
	}
},
</code>

Here we see the rules applied to the form fields. I made them required, numeric, and use a range, and the last rule was my custom one, checksum. Notice checksum is passed 2 values: A list of form ids and a total. My rule was defined as:

<code>
$.validator.addMethod("checksum", function(value,element,params) {
	//get all the IDs passed in parsm[0] and add their value
	var total = 0;
	for (var i = 0; i &lt; params[0].length; i++) {
		total += parseInt($("#"+params[0][i]).val())
	}
	return total == params[1]
}, jQuery.format("The percentage fields must equal {% raw %}{1}{% endraw %} "));
</code>

The logic simply goes through the first param, which is a list, and for each, grabs the value for each (note you have to use parseInt to turn them into numbers) and creates a sum. Lastly, we check to see if the total value matches the desired total. If not, we output an error. The {% raw %}{1}{% endraw %} token gets replaced with the total so we could modify the designed sum and not worry about updating the error message.

So this worked.... mostly. Because I applied the rule to two form fields, I ran into issues where the error wouldn't disappear from one form field when I fixed the second. I tried to hack around a bit... and got close... but then stopped. I took a deep breath and tried to see if there may be a simpler way to go about this. 

I read over the jQuery Validation plugin docs again and noticed they had support for handling the submission of a form. By that I mean, you can tell the plugin: "Hey, if you validate everything is good, let me handle the actual form submission." The docs mention this is a good way to do an Ajax submission with the form instead of a normal POST, but instead, I used it do to my final checking. Here is the setup I used for my final example:

<code>
&lt;script&gt;
$(document).ready(function(){

    $("#commentForm").validate({
    
	    rules: {
			phappy: {
				required: true,
				number: true,
				min: 0,
				max: 100,
			},
			puhappy: {
				required: true,
				number: true,
				min: 0,
				max: 100,
			}

	    },
		submitHandler: function(form){
			var total = parseInt($("#phappy").val()) + parseInt($("#puhappy").val()); 
			if (total != 100) {
				$("#commentForm div.error").html("Your percantage fields must sum to 100.")
				return false;
			} else form.submit();
		}
    
    });
});

&lt;/script&gt;
</code>

Notice I've removed the custom rule, and just stuck with the simple numeric/range style checking. I've added submitHandler as an argument to my validate constructor. In that function I simply grab the values I want to check. If they don't equal 100, I add a new error message. If they do, I tell the form to submit as normal.

<i>Much</i> simpler, isn't it? It may not be as dynamic as the earlier version, but it works and just reads a lot better to me. You can view the first version <a href="http://www.coldfusionjedi.com/demos/cv/cv.html">here</a> and the final, I think nicer, version <a href="http://www.coldfusionjedi.com/demos/cv/cv2.html">here</a>.