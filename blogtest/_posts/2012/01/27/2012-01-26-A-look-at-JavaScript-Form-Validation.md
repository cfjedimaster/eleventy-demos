---
layout: post
title: "A look at JavaScript Form Validation"
date: "2012-01-27T10:01:00+06:00"
categories: [development,javascript]
tags: []
banner_image: 
permalink: /2012/01/27/A-look-at-JavaScript-Form-Validation
guid: 4510
---

Validating forms with JavaScript has been possible since the very beginning of time... or at least the introduction of LiveScript (the original name before the marketing drones got ahold of it). While it's not particular new or as exciting as Canvas based games, JavaScript form validation is one of the best uses of the language (imo) and something that can dramatically improve your user's experience. I recently had a reader ask how to do JavaScript form validation so I thought it might be nice to write up a simple tutorial. This is not meant to cover every possible way, of course, and will be a very manual approach (no frameworks or plugins!) to the problem. As always, I welcome folks comments and suggestions below.
<!--more-->
<p/>

Before we write a lick of code, let's look at this topic at a high level. JavaScript form validation comes down to four basic steps:

<p/>

The first thing you must do is prevent your forms from doing their default behavior - submitting. There are a few ways of doing this but our method will focus on simply listening for the submit event for the form. One tricky thing here to watch out for is ensuring our code doesn't have any errors. Yeah, sure, we should <i>always</i> do that, right? Well one thing that may trip you up is that if an error occurs in your code then the browser will go ahead and submit the form as if nothing happened. This is probably a good thing for the web at large, but during development it can be a bit of a pain. See my random tips at the end for a workaround for this.

<p/>

The next thing is to introspect the form and figure out what needs to be checked for what. So that's part technical ("how do I know what form field X is set to?") and part business ("what fields do I care about?"). Obviously this guide can't cover every detail, but hopefully it will give you enough to go on to build more complex form validation routines. 

<p/>

The third concern will be reporting the error back to the user. Again, there are a couple of options here. You can use the old Alert prompt, which is ugly, but direct, or simply update the DOM with nice error messages. These can be on top of the form, to the side, underneath, or even next to the particular fields that are incorrect. Again, you've got options, but obviously you need to let the user know what in the heck is wrong.

<p/>

And lastly, you <b>must absolutely 100% no excuses test your form with JavaScript turned off</b>. While the amount of people without JavaScript is pretty minuscule, there are far too many sites that react badly when you submit a form with JavaScript turned off. I think it's perfectly reasonable to require JavaScript and simply return nothing, or a blunt error, to a user with JavaScript turned off, but you want to ensure bad things don't happen. Assume users will not send the right form fields, will send more data then you expect, less data, etc. Your form submission page is the exhaust port of the Death Star. It's dangerous.

<p/>

Ok, enough blather. Let's begin with a simple example. I've got a form with two simple fields that I will want to validate. Let's look at the code before any JavaScript code is added.

<p/>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	
&lt;head&gt;
&lt;title&gt;Form Validation&lt;/title&gt;
&lt;/head&gt;	
	
&lt;body&gt;
	
&lt;form action="something.php" method="post"&gt;
	username: &lt;input type="text" name="username" value=""&gt;&lt;br/&gt;
	password: &lt;input type="password" name="password" value=""&gt;&lt;br/&gt;
	&lt;input type="submit" value="Login"&gt;
&lt;/form&gt;

&lt;/body&gt;	
&lt;/html&gt;
</code>

<p/>

If for some reason you want to run this as is, you can view it here: <a href="http://www.raymondcamden.com/demos/2012/jan/27/test1.html">http://www.raymondcamden.com/demos/2012/jan/27/test1.html</a>.

<p/>

So - let's begin. I mentioned that our first task is to listen for, and take over, the form submission. We want to prevent the form from doing what it normally does - submit. 

<p/>

<code>
//get a handle to my form
var myform = document.getElementById("myform");
    
//listen for submit
myform.addEventListener("submit", function(e) {
</code>

<p>

In order for this to work, we had to add an ID to the form. We could get the form object other ways, but IDs are the most direct, simple way:

<p/>

<code>
&lt;form action="something.php" method="post" id="myform"&gt;
</code>

<p/>

Now let's dig into the event handler I started earlier:

<p/>

<code>
myform.addEventListener("submit", function(e) {
     console.log("submit");
        
     var username = document.getElementById("username").value;
     var password = document.getElementById("password").value;
     var errors = '';
        
     if(username == '') errors += 'Please specify a username.\n';
     if(password == '') errors += 'Please specify a password.\n';
        
 
     if(errors != '') {
         alert(errors);
         e.preventDefault();
     }
        
});
</code>

<p>

For our form, we want to check the values of the username and password field and ensure they have something in them. My first two lines grab the fields and their values using getElementById. Those of you used to jQuery know that the framework makes this call a bit simpler, but as I said in the beginning I'm intentionally ignoring frameworks for now. I also create a simple errors string variable. This will store the text I'll show to the user in case an error.

<p>

The next block begins my simple validation. In my case, I'm just comparing both values to empty strings. Not the most complex validation, but it works. (For extra credit, I could have trimmed the space from my inputs. I've been to many forms that let me bypass their validation by just hitting the space bar.) Note how for each "rule" I simply append to the errors string. This then let's me check if the string is blank. If it isn't, it means something went wrong. I use the alert feature to tell the user.

<p>

Here's a critical part. I want to ensure the form does <b>not</b> proceed as normal. Without this one line, it would: e.preventDefault(). e is the name of the variable that the browser will pass the Event object in. Think of it as the actual form submission event. It's not the form, it's the action of me clicking submit. 

<p>

If you want to test this, use the URL here. Note that I did NOT bother building a file to accept the form input. something.php doesn't exist. If that confuses people, I'll put in a handler, but for now, expect a 404 when the form submits: <a href="http://www.raymondcamden.com/demos/2012/jan/27/test2.html">http://www.raymondcamden.com/demos/2012/jan/27/test2.html</a>

<p>

And here is the complete page:

<p>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	
&lt;head&gt;
&lt;title&gt;Form Validation&lt;/title&gt;
&lt;script&gt;
function init() {
    console.log("init");
    
    //get a handle to my form
    var myform = document.getElementById("myform");
    
    //listen for submit
    myform.addEventListener("submit", function(e) {
        console.log("submit");
        
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var errors = '';
        
        if(username == '') errors += 'Please specify a username.\n';
        if(password == '') errors += 'Please specify a password.\n';
        
 
        if(errors != '') {
            alert(errors);
            e.preventDefault();
        }
        
    });
}
&lt;/script&gt;
&lt;/head&gt;	
	
&lt;body onload="init()"&gt;
	
&lt;form action="something.php" method="post" id="myform"&gt;
	username: &lt;input type="text" name="username" id="username" value=""&gt;&lt;br/&gt;
	password: &lt;input type="password" name="password" id="password" value=""&gt;&lt;br/&gt;
	&lt;input type="submit" value="Login"&gt;
&lt;/form&gt;

&lt;/body&gt;	
&lt;/html&gt;
</code>

<p>

So, that works, but is a bit ugly. Let's get rid of the alert. It smells of 1997. How about inserting some text into the page instead? I added a new div, and relevant style, to my page:

<p>

<code>
&lt;style&gt;
#errorDiv {
    color: red;
    font-weight: bold;
}
&lt;/style&gt;
...

&lt;div id="errorDiv"&gt;&lt;/div&gt;
</code>

<p>

The div is empty for now which means the user won't see it until I actually put something in it. Now instead of creating an alert, I'm going to just inject HTML into the div. I modified my error messages to use BR tags. (In case it wasn't clear, the alert uses line breaks, \n, to create the breaks.)

<p>

<code>
if(username == '') errors += 'Please specify a username.&lt;br/&gt;';
if(password == '') errors += 'Please specify a password.&lt;br/&gt;';
</code>

<p>

And to inject it, I modify the div's innerHTML property:

<p>

<code>
var errorDiv = document.getElementById("errorDiv");
if(errors != '') {
     errorDiv.innerHTML=errors;
     e.preventDefault();
} else errorDiv.innerHTML='';
</code>

<p>

So - what's up with the else there? When the user hits the form, it's possible that they will make some type of mistake. When they do, a message is added into the div. When they correct the mistake and hit submit, the form submission will go along as normal. But if the form processor is slow, then the user will continue to see the error message. By clearing it, we remove any doubt in the user's mind that their form is being processed. 

<p>

You can demo this here: <a href="http://www.raymondcamden.com/demos/2012/jan/27/test3.html">http://www.raymondcamden.com/demos/2012/jan/27/test3.html</a> The full code is below:

<p>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	
&lt;head&gt;
&lt;title&gt;Form Validation&lt;/title&gt;
&lt;script&gt;
function init() {
    console.log("init");
    
    //get a handle to my form
    var myform = document.getElementById("myform");
    
    //listen for submit
    myform.addEventListener("submit", function(e) {
        console.log("submit");
        
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var errors = '';
        
        if(username == '') errors += 'Please specify a username.&lt;br/&gt;';
        if(password == '') errors += 'Please specify a password.&lt;br/&gt;';
        
        var errorDiv = document.getElementById("errorDiv");
        if(errors != '') {
            errorDiv.innerHTML=errors;
            e.preventDefault();
        } else errorDiv.innerHTML='';
        
    });
}
&lt;/script&gt;
&lt;style&gt;
#errorDiv {
    color: red;
    font-weight: bold;
}
&lt;/style&gt;
&lt;/head&gt;	
	
&lt;body onload="init()"&gt;

&lt;div id="errorDiv"&gt;&lt;/div&gt;
	
&lt;form action="something.php" method="post" id="myform"&gt;
	username: &lt;input type="text" name="username" id="username" value=""&gt;&lt;br/&gt;
	password: &lt;input type="password" name="password" id="password" value=""&gt;&lt;br/&gt;
	&lt;input type="submit" value="Login"&gt;
&lt;/form&gt;

&lt;/body&gt;	
&lt;/html&gt;
</code>

<p>

Alrighty... now that we've got the basics down, it's time to kick it up a notch. Let's begin by looking at a slightly more complex form:

<p>

<code>
&lt;form action="something.php" method="post" id="myform"&gt;
    &lt;p&gt;
	name: &lt;input type="text" name="name" id="name" value=""&gt;
	&lt;/p&gt;
	
	&lt;p&gt;
	bio: &lt;textarea name="bio" id="bio"&gt;&lt;/textarea&gt;
    &lt;/p&gt;
    
    &lt;p&gt;
    gender: &lt;select name="gender" id="gender"&gt;
    &lt;option value=""&gt;Pick One&lt;/option&gt;
    &lt;option value="female"&gt;Female&lt;/option&gt;
    &lt;option value="male"&gt;Male&lt;/option&gt;
    &lt;/select&gt;&lt;br/&gt;
    &lt;/p&gt;
    
    &lt;p&gt;
    favorite colors:&lt;br/&gt;
    &lt;input type="checkbox" name="favcolor" id="favcolor-red" value="red"&gt; &lt;label for="favcolor-red"&gt;Red&lt;/label&gt;&lt;br/&gt;
    &lt;input type="checkbox" name="favcolor" id="favcolor-blue" value="blue"&gt; &lt;label for="favcolor-blue"&gt;Blue&lt;/label&gt;&lt;br/&gt;
    &lt;input type="checkbox" name="favcolor" id="favcolor-green" value="green"&gt; &lt;label for="favcolor-green"&gt;Green&lt;/label&gt;&lt;br/&gt;
    &lt;/p&gt;

    &lt;p&gt;
    favorite food:&lt;br/&gt;
    &lt;input type="radio" name="favfood" id="favfood-pizza" value="pizza"&gt; &lt;label for="favfood-pizza"&gt;Pizza&lt;/label&gt;&lt;br/&gt;
    &lt;input type="radio" name="favfood" id="favfood-beer" value="beer"&gt; &lt;label for="favfood-beer"&gt;Beer&lt;/label&gt;&lt;br/&gt;
    &lt;input type="radio" name="favfood" id="favfood-cookie" value="cookie"&gt; &lt;label for="favfood-cookie"&gt;Cookies&lt;/label&gt;&lt;br/&gt;
    &lt;/p&gt;
    
	&lt;input type="submit" value="Submit"&gt;
&lt;/form&gt;
</code>

<p>

We've now got a text field, a textarea, a select box, a set of checkboxes, and a radio group. The code we used earlier to grab form values will need to be updated a bit. So for example, we can't just get the value of a set of checkboxes. 

<p>

In order to simplify things a bit, we're going to upgrade our code a bit to something more modern - the <a href="http://www.w3.org/TR/selectors-api2/">Selectors API</a>. Roughly, this gives us jQuery-style APIs to the DOm and simplifies things for us quite a bit, especially in terms of our radio/checkbox groups. The API comes down to two main method: querySelector and querySelectorAll. I recommend this blog entry for a good introduction: <a href="http://webdirections.org/blog/html5-selectors-api-its-like-a-swiss-army-knife-for-the-dom/">HTML5 selectors API -- It's like a Swiss Army Knife for the DOM</a>. This is - yet again - one more cool aspect of HTML5 that seems to be passed over for demos of Canvas apps and kittens. Sigh. That being said, the support for this is actually rather good. When we talk about support and HTML features, typically the bugaboo is IE. In this case, IE8 and above supports the feature. Good enough for me. Let's look at one change:

<p>

<code>
var myform = document.getElementById("myform");
</code>

<p>

versus:

<p>
var myform = document.querySelector("#myform");
</code>

<p>

Not too terribly different, right? And if you are used to jQuery then this is familiar. You aren't saving a lot of keystrokes here, but wait, it gets better. Let's take a look at how we grab some of these form fields:

<p>

<code>
var name = document.querySelector("#name").value;
var bio = document.querySelector("#bio").value;
</code>

<p>

Ok - not too different. Basically we just get to the DOM via the newer API versus the older one. How about the select? Well, select fields have a selectedIndex. Our business rule will be to simply ensure the first item isn't picked, so all we care about is the index.

<p>

<code>
var gender = document.querySelector("#gender").selectedIndex;
</code>

<p>

Ok, now it's time to get fancy. How do we ensure our users pick at least one from the checkbox group? We could use document.getElementById for all four fields and ensure at least one has their checked property set to true. That's not horrible per se, but it's a lot of typing I would hope we can skip. Our radio group has same validation rule. How can we do this nice and easy?

<p>

<code>
var colorcbs = document.querySelectorAll("input[name='favcolor']:checked");
var foodcbs = document.querySelectorAll("input[name='favfood']:checked");
</code>

<p>

Let's look at the first one since the second example is the same ignoring the name. Our selector is: input[name='favcolor']:checked. Reading left to right we have: Give me input fields that have an attribute name with the value favcolor, and filter to those that are checked. Or in English - what did I check in the favcolor group? These two calls both return an array of DOM items for any checked field. What's cool is that I can then just check the length of this array. This would also let me support things like, "Pick at least one favorite food but no more than three." Let's take a look now at the validation code:

<p>

<code>
if(name == '') errors += 'Enter a name.&lt;br/&gt;';
//bio not required
if(gender == 0) errors += 'Select a gender.&lt;br/&gt;'
if(colorcbs.length == 0) errors += 'Select a favorite color.&lt;br&gt;';
if(foodcbs.length == 0) errors += 'Select a favorite food.&lt;br&gt;';
</code>

<p>

Not too difficult, right? You can view the full demo here: <a href="http://www.raymondcamden.com/demos/2012/jan/27/test4.html">http://www.raymondcamden.com/demos/2012/jan/27/test4.html</a>

<p>

And here is the complete template:

<p>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
	
&lt;head&gt;
&lt;title&gt;Form Validation&lt;/title&gt;
&lt;script&gt;
function init() {
    console.log("init");
    
    //get a handle to my form
    var myform = document.querySelector("#myform");
    
    //listen for submit
    myform.addEventListener("submit", function(e) {
        console.log("submit");
        
        var errors = '';
        var errorDiv = document.querySelector("#errorDiv");
               
        var name = document.querySelector("#name").value;
        var bio = document.querySelector("#bio").value;
        var gender = document.querySelector("#gender").selectedIndex;

        var colorcbs = document.querySelectorAll("input[name='favcolor']:checked");
        var foodcbs = document.querySelectorAll("input[name='favfood']:checked");

        if(name == '') errors += 'Enter a name.&lt;br/&gt;';
        //bio not required
        if(gender == 0) errors += 'Select a gender.&lt;br/&gt;'
        if(colorcbs.length == 0) errors += 'Select a favorite color.&lt;br&gt;';
        if(foodcbs.length == 0) errors += 'Select a favorite food.&lt;br&gt;';
        
        if(errors != '') {
            errorDiv.innerHTML=errors;
            e.preventDefault();
        } else errorDiv.innerHTML='';
            
            
    });
}
&lt;/script&gt;
&lt;style&gt;
#errorDiv {
    color: red;
    font-weight: bold;
}
&lt;/style&gt;
&lt;/head&gt;	
	
&lt;body onload="init()"&gt;

&lt;div id="errorDiv"&gt;&lt;/div&gt;
	
&lt;form action="something.php" method="post" id="myform"&gt;
    &lt;p&gt;
	name: &lt;input type="text" name="name" id="name" value=""&gt;
	&lt;/p&gt;
	
	&lt;p&gt;
	bio: &lt;textarea name="bio" id="bio"&gt;&lt;/textarea&gt;
    &lt;/p&gt;
    
    &lt;p&gt;
    gender: &lt;select name="gender" id="gender"&gt;
    &lt;option value=""&gt;Pick One&lt;/option&gt;
    &lt;option value="female"&gt;Female&lt;/option&gt;
    &lt;option value="male"&gt;Male&lt;/option&gt;
    &lt;/select&gt;&lt;br/&gt;
    &lt;/p&gt;
    
    &lt;p&gt;
    favorite colors:&lt;br/&gt;
    &lt;input type="checkbox" name="favcolor" id="favcolor-red" value="red"&gt; &lt;label for="favcolor-red"&gt;Red&lt;/label&gt;&lt;br/&gt;
    &lt;input type="checkbox" name="favcolor" id="favcolor-blue" value="blue"&gt; &lt;label for="favcolor-blue"&gt;Blue&lt;/label&gt;&lt;br/&gt;
    &lt;input type="checkbox" name="favcolor" id="favcolor-green" value="green"&gt; &lt;label for="favcolor-green"&gt;Green&lt;/label&gt;&lt;br/&gt;
    &lt;/p&gt;

    &lt;p&gt;
    favorite food:&lt;br/&gt;
    &lt;input type="radio" name="favfood" id="favfood-pizza" value="pizza"&gt; &lt;label for="favfood-pizza"&gt;Pizza&lt;/label&gt;&lt;br/&gt;
    &lt;input type="radio" name="favfood" id="favfood-beer" value="beer"&gt; &lt;label for="favfood-beer"&gt;Beer&lt;/label&gt;&lt;br/&gt;
    &lt;input type="radio" name="favfood" id="favfood-cookie" value="cookie"&gt; &lt;label for="favfood-cookie"&gt;Cookies&lt;/label&gt;&lt;br/&gt;
    &lt;/p&gt;
    
	&lt;input type="submit" value="Submit"&gt;
&lt;/form&gt;

&lt;/body&gt;	
&lt;/html&gt;
</code>

<p>

So... what do you think? If you've never worked with JavaScript, or are just beginning, does this make sense? Any question?

<p>

p.s. So I mentioned above that one of the things you have to watch our for is errors in your submit handler. One way to work around that - at least in Chrome - is to enable Console/Preserve log upon navigation. This will keep the error in your log even after the form goes to the submit page.