---
layout: post
title: "An Introduction to jQuery and Form Validation (2)"
date: "2009-02-10T11:02:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/02/10/An-Introduction-to-jQuery-and-Form-Validation-2
guid: 3231
---

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 139.png" align="left" style="margin-right: 5px"> Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2009/2/9/An-introduction-to-jQuery-and-Form-Validation">blogged</a> about jQuery and form validation using the excellent <a href="http://bassistance.de/jquery-plugins/jquery-plugin-validation/">Validation</a> plugin by Joern Zaefferer. I demonstrated simple validation techniques using simple additions to your HTML and one line of JavaScript. In today's blog post I'm going to dig a bit deeper into the JavaScript API for the plugin and show more advanced examples of forms validation. As always, please remember that I'm still new to jQuery (and especially this plugin) so comments are welcome!
<p/>
<!--more-->
In yesterday's blog entry, all of the validation I demonstrated made use of CSS or HTML attributes. So for example, to mark a name field as required and require a minimum of two characters, you would do:
<p/>

<code>
&lt;input id="cname" name="name" size="25" class="required" minlength="2" /&gt;
</code>
<p/>

To mark a field as requiring a valid URL, you would do:
<p/>

<code>
&lt;input id="curl" name="url" size="25" class="required url" /&gt;
</code>
<p/>

And so on. While this works, you may want to have more complex validation. Some fields may only be required if you enable a checkbox. Some fields may have validation rules that don't fall into simple patterns. I also raved about how nice the default error messages are, but what if you don't like them? Luckily the plugin makes modifying all of these settings rather easy. Let's begin with a simple example.
<p/>

First I'll repost the first code sample I shared yesterday. This uses inline CSS/HTML to specify validation settings.
<p/>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script src="/jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script src="/jquery/jquery.validate.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function(){
$("#commentForm").validate();
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form id="commentForm" method="get" action=""&gt;
&lt;fieldset&gt;
&lt;legend&gt;A simple comment form with submit validation and default messages&lt;/legend&gt;
&lt;p&gt;
&lt;label for="cname"&gt;Name&lt;/label&gt;
&lt;em&gt;*&lt;/em&gt;&lt;input id="cname" name="name" size="25" class="required" /&gt;
&lt;/p&gt;
&lt;p&gt;
&lt;label for="cemail"&gt;E-Mail&lt;/label&gt;
&lt;em&gt;*&lt;/em&gt;&lt;input id="cemail" name="email" size="25" class="required email" /&gt;
&lt;/p&gt;
&lt;p&gt;
&lt;label for="ccomment"&gt;Your comment&lt;/label&gt;
&lt;em&gt;*&lt;/em&gt;&lt;textarea id="ccomment" name="comment" cols="22" class="required"&gt;&lt;/textarea&gt;
&lt;/p&gt;
&lt;p&gt;
&lt;input class="submit" type="submit" value="Submit"/&gt;
&lt;/p&gt;
&lt;/fieldset&gt;
&lt;/form&gt;


&lt;/body&gt;
&lt;/html&gt;
</code>
<p/>

Now here is an exact copy that specifies the rules in JavaScript instead:
<p/>

<code>
&lt;html&gt;

&lt;head&gt;
&lt;script src="/jquery/jquery.js"&gt;&lt;/script&gt;
&lt;script src="/jquery/jquery.validate.js"&gt;&lt;/script&gt;
&lt;script&gt;
$(document).ready(function(){
    $("#commentForm").validate({
    
    rules: {
    	name: "required",
    	email: {
    		required: true,
    		email: true,
    	},
    	comment: "required"
    }
    
    });
});
&lt;/script&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;form id="commentForm" method="get" action=""&gt;
 &lt;fieldset&gt;
   &lt;legend&gt;A simple comment form with submit validation and default messages&lt;/legend&gt;
   &lt;p&gt;
     &lt;label for="cname"&gt;Name&lt;/label&gt;
     &lt;em&gt;*&lt;/em&gt;&lt;input id="cname" name="name" size="25" /&gt;
   &lt;/p&gt;
   &lt;p&gt;
     &lt;label for="cemail"&gt;E-Mail&lt;/label&gt;
     &lt;em&gt;*&lt;/em&gt;&lt;input id="cemail" name="email" size="25" /&gt;
   &lt;/p&gt;
   &lt;p&gt;
     &lt;label for="ccomment"&gt;Your comment&lt;/label&gt;
     &lt;em&gt;*&lt;/em&gt;&lt;textarea id="ccomment" name="comment" cols="22" &gt;&lt;/textarea&gt;
   &lt;/p&gt;
   &lt;p&gt;
     &lt;input class="submit" type="submit" value="Submit"/&gt;
   &lt;/p&gt;
 &lt;/fieldset&gt;
 &lt;/form&gt;


&lt;/body&gt;
&lt;/html&gt;
</code>
<p/>

Moving from the bottom up, note that I've removed all the validation related CSS items and HTML attributes. My validate() function now has a new argument: rules. The rules attribute (which can be used with inline code as well if you want to mix them up) creates a list of rules that the plugin will use when validating the form. For each rule you can specify a simple value, as I did with name, or specify a structure of more complex data, as I did with the email field. While this is a bit more complex (and takes up more lines because of my vertical spacing), notice now that the validation is removed from the HTML below and placed entirely within the JavaScript. This is a bit cleaner I think and for folks more comfortable with JavaScript this is definitely going to be the better option. You can view this version here: <a href="http://www.coldfusionjedi.com/demos/jqueryvalidation/test02.html">http://www.coldfusionjedi.com/demos/jqueryvalidation/test02.html</a>. As I said though, it should run exactly the same as the <a href="http://www.coldfusionjedi.com/demos/jqueryvalidation/test0.html">previous version</a>.
<p/>

Let's look at another modification now. Imagine the following form:
<p/>

<code>
&lt;form id="commentForm" method="get" action=""&gt;
 &lt;fieldset&gt;
   &lt;legend&gt;A simple comment form with submit validation and default messages&lt;/legend&gt;
   &lt;p&gt;
     &lt;label for="cname"&gt;Name&lt;/label&gt;
     &lt;em&gt;*&lt;/em&gt;&lt;input id="cname" name="name" size="25" /&gt;
   &lt;/p&gt;
   &lt;p&gt;
     &lt;label for="ccomment"&gt;Your comment&lt;/label&gt;
     &lt;em&gt;*&lt;/em&gt;&lt;textarea id="ccomment" name="comment" cols="22" &gt;&lt;/textarea&gt;
   &lt;/p&gt;
     &lt;p&gt;
     &lt;label for="csub"&gt;Subscribe to newsletter?&lt;/label&gt;
     &lt;input type="checkbox" id="csub" name="csub" /&gt;
   &lt;/p&gt;
   
   &lt;p&gt;
     &lt;label for="cemail"&gt;E-Mail&lt;/label&gt;
     &lt;input id="cemail" name="email" size="25" /&gt;
   &lt;/p&gt;
   &lt;p&gt;
     &lt;input class="submit" type="submit" value="Submit"/&gt;
   &lt;/p&gt;
 &lt;/fieldset&gt;
 &lt;/form&gt;
</code>
<p/>

I've added a new 'Subscribe' checkbox. If you want to subscribe to a newsletter, email should be required. I bet that's real difficult. 
<p/>

<code>
rules: {
	name: "required",
	email: {
		required: "#csub:checked",
		email: true,
    	},
    	comment: "required"
}
</code>
<p/>

I've modified the email rule from required equals true to a check against the csub item and the checked property. Basically, "jQuery - go see if the form field with id csub has a checked property that is true". Maybe I'm crazy, but I don't even consider this as 'writing' JavaScript yet. All I've done is define some data! You can see this in action here: <a href="http://www.coldfusionjedi.com/demos/jqueryvalidation/test3.html">http://www.coldfusionjedi.com/demos/jqueryvalidation/test3.html</a>
<p/>

So far I've just showed specifying rules. How about customized messages? Just as we can pass a rules object to the plugin we can also pass in a messages object as well. As an example:
<p/>

<code>
messages: {
    	comment: "This is a comment form. Why in the heck would you leave the comment blank?",
    	email: {
    		required: "Dude, you want the newsletter, but you didn't enter an email address?",
    		email: "Email addresses are of the form user@host. Not yourRstupid."
    	},
    	name: {
    		required: "Stand up for your comments or go home.",
    		minlength: jQuery.format("You need to use at least {% raw %}{0}{% endraw %} characters for your name.")
    	}
}
</code>
<p/>

Each message is keyed to the rule and like rules itself, I can specify either a simple value (see the comment example) or a complex object. For emails we can specify a different message for each thing you fail. For name notice I made use of jQuery.format, a utility function supplied by the plugin (mostly sure it is a plugin function and not a core function) to allow for a dynamic message. If I were to change my minlength requirement for my rule from 2 to 5 I wouldn't have to worry about updating the error message. The complete constructor is below:
<p/>

<code>
$(document).ready(function(){
    $("#commentForm").validate({
    
    rules: {
    	name: {
    		required: true,
    		minlength: 2
    	},
    	email: {
    		required: "#csub:checked",
    		email: true,
    	},
    	comment: "required"
    },
    messages: {
    	comment: "This is a comment form. Why in the heck would you leave the comment blank?",
    	email: {
    		required: "Dude, you want the newsletter, but you didn't enter an email address?",
    		email: "Email addresses are of the form user@host. Not yourRstupid."
    	},
    	name: {
    		required: "Stand up for your comments or go home.",
    		minlength: jQuery.format("You need to use at least {% raw %}{0}{% endraw %} characters for your name.")
    	}
    }
    
    });
});
</code>
<p/>

A demo of this may be found here: <a href="http://www.coldfusionjedi.com/demos/jqueryvalidation/test30.html">http://www.coldfusionjedi.com/demos/jqueryvalidation/test30.html</a>
<p/>

Alright, let's look at another example. What if we wanted to supply our own logic for validation. Scott Stroz asked this in a comment in yesterday's blog post. Once again, the plugin makes this rather simple. One way to handle this is by using the validator's addMethod function. The addMethod function allows you to add your own validation logic. Once done, you can apply this as a validation form in any rule. You can even build up a library of these and use it for multiple projects. Let's look at a simple example:
<p/>

<code>
$.validator.addMethod("noanon", function(value) {
		return value.toLowerCase().indexOf("anonymous") != 0;
	}, 'Do not hide behind the cover of anonymity');

</code>
<p/>

The addMethod function takes 3 arguments. A name, the logic to actually run, and lastly, the default message to use for failures. My use of the function above is rather simple - I just check the value to see if the value beings with the string 'anonymous'. You can write more complex versions that take any number of arguments. (See the <a href="http://docs.jquery.com/Plugins/Validation/Validator/addMethod#namemethodmessage">doc</a> for an example.)
<p/>

So once I have this validation method, I can apply it to my name rule:
<p/>

<code>
name: {
    	required: true,
    	minlength: 2,
    	noanon: true
},
</code>
<p/>

So now my name field must be entered, must have at least two characters, and must pass my custom rule. You can see an example of this here: <a href="http://www.coldfusionjedi.com/demos/jqueryvalidation/test31.html">http://www.coldfusionjedi.com/demos/jqueryvalidation/test31.html</a>
<p/>

Ok, so now I've actually written a bit of code, but frankly, for what I've got now the code is minimal. 
<p/>

Alright, so far we've looked at 2 options to the core validate constructor - rules and messages. Obviously there is quite a bit more. You can peruse the list <a href="http://docs.jquery.com/Plugins/Validation/validate#toptions">here</a>, but I'll wrap up with one more example. I mentioned yesterday that I tend to prefer my errors on top of the form. I will typically put these in a nice bulleted list. The plugin makes this rather simple. I can supply options for a container to use for the errors, a place to store each error, as well as HTML to use to wrap the errors. Consider this example:
<p/>

<code>
$("#commentForm").validate({
    
errorContainer: "#errorbox",
errorLabelContainer: "#errorbox ul",
wrapper: "li",
... more code here ...
</code>

I then added this style to my page:

<code>
&lt;style&gt;
#errorbox {
	background-color: yellow;
	display: none;
}
&lt;/style&gt;
</code>
<p/>

The display: none ensures the error box won't show up until the plugin turns it on. The yellow background ensures people remember that I shouldn't be allowed to design. Ever. Lastly I added this to my page:
<p/>

<code>
&lt;div id="errorbox"&gt;&lt;ul&gt;&lt;/ul&gt;&lt;/div&gt;
</code>
<p/>

Put all together you can see this in action here: <a href="http://www.coldfusionjedi.com/demos/jqueryvalidation/test32.html">http://www.coldfusionjedi.com/demos/jqueryvalidation/test32.html</a>
<p/>

<img src="https://static.raymondcamden.com/images/cfjedi//whos_awsome.jpg">
<p/>

That's it for this entry. I remain incredibly impressed by this plugin, and I think my next blog entry will really cement the <b>Awesome Coolness that is jQuery</b>. I'll be demonstrating an example that mixes client side validation along with server side checks.