---
layout: post
title: "An Introduction to jQuery and Form Validation"
date: "2009-02-09T15:02:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2009/02/09/An-introduction-to-jQuery-and-Form-Validation
guid: 3230
---

<img src="https://static.raymondcamden.com/images/cfjedi//Picture 139.png" align="left" style="margin-right: 5px"> Last week I was performing a security review on a charity's web site (because that's how I roll, I'm nice like that) when I noticed they were using a jQuery plugin for forms validation. This was something I had not yet looked at in the jQuery world so I decided I'd take a closer look this weekend. I have to admit that I'm in awe over what I've found. I've avoided client side form validation for a long time (and I'll talk more about why in a minute) but I see no reason to do so anymore. What follows is a brief introduction into what I've learned. I'll be blogging a bit more on this topic later in the week with some more advanced examples.
<!--more-->
First, the nitty gritty. All of the code I'm going to talk about today uses a jQuery plugin. This is <b>not</b> something built into the main jQuery file. The plugin has the wonderfully simple name of Validation and may be found <a href="http://bassistance.de/jquery-plugins/jquery-plugin-validation/">here</a>. It was written by a member of the jQuery team, Joern Zaefferer. Documentation may be found <a href="http://docs.jquery.com/Plugins/Validation">here</a>.

The plugin works in two main ways. You can either use various CSS classes and attributes in your HTML to 'flag' fields for validation or use JavaScript to explicitly define validation rules and behavior. I'll be focusing on the 'inline' version for this blog entry. It is the simplest and most direct way to do validation, but only scratches the surface of what the plugin supports. (And to be clear - even in the 'inline' version I'll use a bit of JavaScript.) Let me start with a sample (ripped from the jQuery docs) to give you an idea of how easy this plugin makes validation.

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
     &lt;em&gt;*&lt;/em&gt;&lt;input id="cname" name="name" size="25" class="required"  /&gt;
   &lt;/p&gt;
   &lt;p&gt;
     &lt;label for="cemail"&gt;E-Mail&lt;/label&gt;
     &lt;em&gt;*&lt;/em&gt;&lt;input id="cemail" name="email" size="25"  class="required email" /&gt;
   &lt;/p&gt;
   &lt;p&gt;
     &lt;label for="ccomment"&gt;Your comment&lt;/label&gt;
     &lt;em&gt;*&lt;/em&gt;&lt;textarea id="ccomment" name="comment" cols="22"  class="required"&gt;&lt;/textarea&gt;
   &lt;/p&gt;
   &lt;p&gt;
     &lt;input class="submit" type="submit" value="Submit"/&gt;
   &lt;/p&gt;
 &lt;/fieldset&gt;
 &lt;/form&gt;


&lt;/body&gt;
&lt;/html&gt;
</code>

So going down the code line by line, ignoring HTML we don't care about, make note that we include the plugin right after we load the main jQuery library. The script block will contain the only line of JavaScript we need for the entire validation:

<code>
$("#commentForm").validate();
</code>

This means: "Find the form with the id commentForm and turn on validation."

And that's it. Seriously. I mean, they couldn't make that any simpler unless they walked over to your house, wrote the code for you while simultaneously pouring you a cup of coffee. How does the validation work? Notice that each of my form fields has a class attribute. The name and comment form fields each have a class of required while email has a class of required and email. You can see this in action here: <a href="http://www.raymondcamden.com/demos/jqueryvalidation/test0.html">http://www.coldfusionjedi.com/demos/jqueryvalidation/test0.html</a>

If you load up the form and immediately hit the submit button, notice that all 3 form fields will have an error message added next to them. Enter a name and a comment, but then try putting in a bad email address. Notice how the error changes? That's slick. As you can probably guess, you could change the error messages but in my tests with simple inline validation, the error messages simply just plain worked and worked well!

So if 'email' flags a field as an email address, you can probably guess that there are other options as well. I'll throw in my one main complaint here and that is the documentation doesn't clearly talk about how to work with this inline version of the validation. I asked about this on the jQuery listserv and this is what I found. If you view the list of built in methods (<a href="http://docs.jquery.com/Plugins/Validation#List_of_built-in_Validation_methods">http://docs.jquery.com/Plugins/Validation#List_of_built-in_Validation_methods</a>), you can translate each of these built in methods to an 'inline' version by following these rules:

a) If the validation method takes no arguments, simply add it to the class attribute.

b) If the validation method takes an argument, add it as an argument to the tag itself.

In English, what does that mean? Well for simple checks like url, date, you can do this:

<code>
&lt;p&gt;
&lt;label for="cbd"&gt;Birthday&lt;/label&gt;
&lt;em&gt;*&lt;/em&gt;&lt;input id="cbd" name="cbd" size="25"  class="required date" /&gt;
&lt;/p&gt;
&lt;p&gt;
&lt;label for="curl"&gt;URL&lt;/label&gt;
&lt;em&gt;  &lt;/em&gt;&lt;input id="curl" name="url" size="25"  class="url" value="" /&gt;
&lt;/p&gt;
</code>

I've added two new form fields. One for birthdate and one for URL. The date validation worked <i>surprisingly</i> well. If there is one thing I've learned about JavaScript and dates is... well, I hate it. Period. So I was pleasantly surprised to see it nicely handle "April 8, 1973" as well as "4/8/73" and "4/8/1973". Also note that my URL field does not have required set. This means that I can leave the field blank, but if I type anything in, it has to be a valid URL. 

But what about validation methods that take arguments? You can add these to your HTML as additional attributes. So for example:

<code>
&lt;p&gt;
&lt;label for="cname"&gt;Name&lt;/label&gt;
&lt;em&gt;*&lt;/em&gt;&lt;input id="cname" name="name" size="25" class="required" minlength="2"  /&gt;
&lt;/p&gt;
&lt;p&gt;
&lt;label for="cage"&gt;Age&lt;/label&gt;
&lt;em&gt;*&lt;/em&gt;&lt;input id="cage" name="cage" size="4"  class="required number" min="1" max="100" /&gt;
&lt;/p&gt;
</code>

In the first field above I used minlength to specify that the name must be at least two characters. In the second field I specified a min and max value for age. Remember how I said the built in error messages were nicely done? When you try the demo (URL coming up in a second) notice that the error message will correctly handle input both below 1 and over 100. 

Let's look at another quick example:

<code>
&lt;p&gt;
&lt;label for="cfu"&gt;Bio Upload&lt;/label&gt;
&lt;em&gt;*&lt;/em&gt;&lt;input type="file" id="cfu" name="cfu" size="25"  class="required" value="" accept="pdf" /&gt;
&lt;/p&gt;
</code>

This creates a required file upload field where only PDFs are allowed. Obviously it can only check the extension, but as I said, pretty darn easy, isn't it? 

You can view this demo here: <a href="http://www.coldfusionjedi.com/demos/jqueryvalidation/test1.html">http://www.coldfusionjedi.com/demos/jqueryvalidation/test1.html</a>

Note too that the errors are styled a bit nicer. I added this to the HTML:

<code>
&lt;style type="text/css"&gt;
label.error {% raw %}{ float: none; color: red; padding-left: .5em; vertical-align: top; font-weight:bold}{% endraw %}
&lt;/style&gt;
</code>

I found this in a demo (by this I mean the use of label.error) but I don't remember seeing it in the documentation anywhere.

So... what next? As I mentioned earlier in the blog entry there is a lot more that this plugin supports if you are up to writing a bit more JavaScript. I've got a few more blog entries in mind over the week so please stay tuned. Finally, let me get on my soapbox for a minute. This stuff is all very cool. It's all very simple. It just plain works. <b>You must remember, however, that no amount of client side validation can replace server side validation.</b> I can disable JavaScript in Firefox with a few mouse clicks so you <b>must</b> always ensure you do proper server side validation before even considering adding client side validation. (If folks want, I can show an example of that as well.)