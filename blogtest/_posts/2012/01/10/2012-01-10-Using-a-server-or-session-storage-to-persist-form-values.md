---
layout: post
title: "Using a server, or session storage, to persist form values"
date: "2012-01-10T17:01:00+06:00"
categories: [coldfusion,html5,javascript,jquery]
tags: []
banner_image: 
permalink: /2012/01/10/Using-a-server-or-session-storage-to-persist-form-values
guid: 4491
---

Yesterday on Twitter <a href="https://twitter.com/#!/docwisdom">docwisdom</a> asked me about using AJAX to persist form values while you edited data. This is something I've talked about before. I thought though it would be a great example to a) blog it again (I'm a believer in multiple examples, and worse case, the more I work on the client side the more comfortable I get) and b) a great time to compare a server based example versus a completely client side version using HTML5 technology.
<!--more-->
Before we begin, it makes sense to talk about why you would want to persist a form before submission anyway. While it (luckily) doesn't happen too often, crashes do occur. It's also possible for a user to simply close a tab by accident. (Not that - um - I've ever done this.) 

<p>

Let's begin with the first example. In this one, we're going to make use of ColdFusion, HTML, and jQuery. jQuery will be used to notice form changes and will pass it off to the server. The server will simply copy this data to the session scope. The form will be made so that it notices this session information and will make use of it. With me so far? While this is ColdFusion specific, it could be done in other languages using the same techniques I'll employ here. First, the form. It's a bit big, so after the code I'll explain whats going on.

<p>
<pre><code class="language-markup">
&lt;!--- Default if we have our session vars ---&gt;
&lt;cfif not structKeyExists(form, "save") and structKeyExists(session, "formdata")&gt;
	&lt;cfif structKeyExists(session.formdata, "name")&gt;
		&lt;cfset form.name = session.formdata.name&gt;
	&lt;cfelse&gt;
		&lt;cfset form.name = ""&gt;
	&lt;/cfif&gt;
	&lt;cfif structKeyExists(session.formdata, "email")&gt;
		&lt;cfset form.email = session.formdata.email&gt;
	&lt;cfelse&gt;
		&lt;cfset form.email = ""&gt;
	&lt;/cfif&gt;
	&lt;cfif structKeyExists(session.formdata, "genre")&gt;
		&lt;cfif isArray(session.formdata.genre)&gt;
			&lt;cfset form.genre = arrayToList(session.formdata.genre)&gt;
		&lt;cfelse&gt;
			&lt;cfset form.genre = session.formdata.genre&gt;
		&lt;/cfif&gt;
	&lt;cfelse&gt;
		&lt;cfset form.genre = ""&gt;
	&lt;/cfif&gt;
&lt;cfelse&gt;
	&lt;cfparam name="form.name" default=""&gt;
	&lt;cfparam name="form.email" default=""&gt;
	&lt;cfparam name="form.genre" default=""&gt;
&lt;/cfif&gt;

&lt;!DOCTYPE html&gt;    
&lt;html&gt;    
&lt;head&gt;    
    &lt;title&gt;&lt;/title&gt;    
	&lt;meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1" /&gt;	    
	&lt;meta name="description" content="" /&gt;    
	&lt;meta name="keywords" content="" /&gt;    

	&lt;link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.4.0/bootstrap.min.css"&gt;    
	&lt;!--[if lt IE 9]&gt;&lt;script src="http://html5shim.googlecode.com/svn/trunk/html5.js"&gt;&lt;/script&gt;&lt;![endif]--&gt;    
	&lt;script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"&gt;&lt;/script&gt;    
	&lt;script type="text/javascript"&gt;    
		$(function() {    

			//listen for changes to the form
			$("input").change(function() {
				console.log("A change has occurred...");
				//first grab a packet of the form
				var info = $("#theform").serializeArray();
				var jsonInfo = JSON.stringify(info);
				$.post("formsaver.cfc?method=preserve",{% raw %}{data:jsonInfo}{% endraw %}, function () {% raw %}{ }{% endraw %});
			});			    
		});	    
	&lt;/script&gt;    
&lt;/head&gt;    
&lt;body&gt;    

	&lt;div class="container"&gt;    

		&lt;form method="post" id="theform"&gt;
        &lt;fieldset&gt;
          &lt;legend&gt;Registration Form&lt;/legend&gt;

		  &lt;cfoutput&gt;
          &lt;div class="clearfix"&gt;
            &lt;label for="name"&gt;Name&lt;/label&gt;
            &lt;div class="input"&gt;
              &lt;input class="xlarge" id="name" name="name" size="30" type="text" value="#form.name#" /&gt;
            &lt;/div&gt;
          &lt;/div&gt;
		  
          &lt;div class="clearfix"&gt;
            &lt;label for="email"&gt;Email&lt;/label&gt;
            &lt;div class="input"&gt;
              &lt;input class="xlarge" id="email" name="email" size="30" type="email" value="#form.email#" /&gt;
            &lt;/div&gt;
          &lt;/div&gt;
		  
		  &lt;div class="clearfix"&gt;
            &lt;label id="genrelist"&gt;Genres&lt;/label&gt;
            &lt;div class="input"&gt;
              &lt;ul class="inputs-list"&gt;
                &lt;li&gt;
                	&lt;label&gt;
                	&lt;input type="checkbox" name="genre" value="scifi" &lt;cfif listFindNoCase(form.genre,"scifi")&gt;checked&lt;/cfif&gt; /&gt;
                    &lt;span&gt;Science Fiction&lt;/span&gt;
					&lt;/label&gt;
				&lt;/li&gt;
                &lt;li&gt;
                	&lt;label&gt;
                	&lt;input type="checkbox" name="genre" value="horror" &lt;cfif listFindNoCase(form.genre,"horror")&gt;checked&lt;/cfif&gt; /&gt;
                    &lt;span&gt;Horror&lt;/span&gt;
					&lt;/label&gt;
				&lt;/li&gt;
                &lt;li&gt;
                	&lt;label&gt;
                	&lt;input type="checkbox" name="genre" value="fantasy" &lt;cfif listFindNoCase(form.genre,"fantasy")&gt;checked&lt;/cfif&gt; /&gt;
                    &lt;span&gt;Fantasy&lt;/span&gt;
					&lt;/label&gt;
				&lt;/li&gt;
                &lt;li&gt;
                	&lt;label&gt;
                	&lt;input type="checkbox" name="genre" value="crime" &lt;cfif listFindNoCase(form.genre,"crime")&gt;checked&lt;/cfif&gt; /&gt;
                    &lt;span&gt;Crime&lt;/span&gt;
					&lt;/label&gt;
				&lt;/li&gt;
			  &lt;/ul&gt;
            &lt;/div&gt;
		    &lt;/cfoutput&gt;
          &lt;/div&gt;
		   &lt;div class="actions"&gt;
            &lt;input type="submit" class="btn primary" name="save" value="Save changes"&gt;&nbsp;&lt;button type="reset" class="btn"&gt;Cancel&lt;/button&gt;
          &lt;/div&gt;
		&lt;/fieldset&gt;
		&lt;/form&gt;

	&lt;/div&gt;    

&lt;/body&gt;    
&lt;/html&gt;

&lt;cfdump var="#session#" label="For Testing..." expand="false"&gt;
</code></pre>

<p>

Let's talk about the bottom half of this template first. The very last line is simply a debugging tag, cfdump. Since I'm storing information in the Session scope, I wanted a quick way to actually look at it while testing. I decided to keep it in the demo that you guys will play with. Above this is the form. Nothing special here, but do note the use of ColdFusion values for the form fields. This is mostly just simple values, but for the Genre field we check against a list of data.

<p>

Move up a bit into the JavaScript. I've added an input event handler for change events. My form only has inputs, but if it had a select or textarea I could add it in there as well. I make use of a jQuery utility, serializeArray, that converts all the form data into a nice little array. Arrays can't be passed as is - so I then convert that to JSON and pass it to ColdFusion. 

<p>

Finally, the top portion of the code is what's handling the initial defaults. It's a bit more verbose then I'd like, but essentially we look into the Session scope for our values, and if there, set our defaults. Real quick, let's look at the CFC that handles storage.

<p>

<pre><code class="language-markup">
component {


	remote void function preserve(string data) {
		if(!isJSON(arguments.data)) return;
		arguments.data = deserializeJSON(arguments.data);

		//convert the array into a name based struct
		var s = {};
		for(var i=1; i&lt;=arrayLen(arguments.data); i++) {
			var name = arguments.data[i].name;
			if(!structKeyExists(s, name)) {
				s[name] = arguments.data[i].value;	
			} else {
				//convert into an array
				if(!isArray(s[name])) {
					s[name]	= [s[name]];
				}
				arrayAppend(s[name], arguments.data[i].value);
			}	
		}
		session.formdata = s;	
		
	}


}
</code></pre>

<p>

Initially I had something much simpler - convert from JSON to native data and store. It was 2 lines of logic. But the array is a bit hard to deal with on the flip side. We have N items since our user may fill out one or more genre fields. Converting to a structure allows me to have a nicer way to access the data. The only "weird" part perhaps is the logic that says, "If I store more than one value for a key, turn it into an array." I could have used a List, but didn't want to assume commas wouldn't exist.

<p>

<strike>
Demo this version here: http://www.raymondcamden.com/demos/2012/jan/10/draft1/form.cfm
</strike>

<p>

Ok - that's draft 1. How about a version that requires no server (for persistence) but instead makes use of SessionStorage? (In case folks don't know, SessionStorage is the version of LocalStorage that doesn't last. Think of LocalStorage as fruitcake and SessionStorage as milk.) I've reduced this form just to one file now.

<p>

<pre><code class="language-markup">
&lt;cfparam name="form.name" default=""&gt;
&lt;cfparam name="form.email" default=""&gt;
&lt;cfparam name="form.genre" default=""&gt;

&lt;!DOCTYPE html&gt;    
&lt;html&gt;    
&lt;head&gt;    
    &lt;title&gt;&lt;/title&gt;    
	&lt;meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1" /&gt;	    
	&lt;meta name="description" content="" /&gt;    
	&lt;meta name="keywords" content="" /&gt;    

	&lt;link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.4.0/bootstrap.min.css"&gt;    
	&lt;!--[if lt IE 9]&gt;&lt;script src="http://html5shim.googlecode.com/svn/trunk/html5.js"&gt;&lt;/script&gt;&lt;![endif]--&gt;    
	&lt;script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"&gt;&lt;/script&gt;    
	&lt;script type="text/javascript"&gt;    
		$(function() {    

			//check for savedform only one
			if (sessionStorage["savedform"]) {
				console.log("yes, have something in the session to load...");
				var data = JSON.parse(sessionStorage["savedform"]);
				console.dir(data);
				for (var i = 0; i &lt; data.length; i++) {
					if(data[i].name == "name") $("#name").val(data[i].value);
					if(data[i].name == "email") $("#email").val(data[i].value);
					if (data[i].name == "genre") {
						var checked = data[i].value;
						$("input[value='"+checked+"']").attr("checked","checked");
					}
				}
				sessionStorage.removeItem("savedform");
			}
			
			//listen for changes to the form
			$("input").change(function() {
				console.log("A change has occurred...");
				//first grab a packet of the form
				var info = $("#theform").serializeArray();				
				var jsonInfo = JSON.stringify(info);
				sessionStorage["savedform"] = jsonInfo;
			});			    
		});	    
	&lt;/script&gt;    
&lt;/head&gt;    
&lt;body&gt;    

	&lt;div class="container"&gt;    

		&lt;form method="post" id="theform"&gt;
        &lt;fieldset&gt;
          &lt;legend&gt;Registration Form&lt;/legend&gt;

		  &lt;cfoutput&gt;
          &lt;div class="clearfix"&gt;
            &lt;label for="name"&gt;Name&lt;/label&gt;
            &lt;div class="input"&gt;
              &lt;input class="xlarge" id="name" name="name" size="30" type="text" value="#form.name#" /&gt;
            &lt;/div&gt;
          &lt;/div&gt;
		  
          &lt;div class="clearfix"&gt;
            &lt;label for="email"&gt;Email&lt;/label&gt;
            &lt;div class="input"&gt;
              &lt;input class="xlarge" id="email" name="email" size="30" type="email" value="#form.email#" /&gt;
            &lt;/div&gt;
          &lt;/div&gt;
		  
		  &lt;div class="clearfix"&gt;
            &lt;label id="genrelist"&gt;Genres&lt;/label&gt;
            &lt;div class="input"&gt;
              &lt;ul class="inputs-list"&gt;
                &lt;li&gt;
                	&lt;label&gt;
                	&lt;input type="checkbox" name="genre" value="scifi" &lt;cfif listFindNoCase(form.genre,"scifi")&gt;checked&lt;/cfif&gt; /&gt;
                    &lt;span&gt;Science Fiction&lt;/span&gt;
					&lt;/label&gt;
				&lt;/li&gt;
                &lt;li&gt;
                	&lt;label&gt;
                	&lt;input type="checkbox" name="genre" value="horror" &lt;cfif listFindNoCase(form.genre,"horror")&gt;checked&lt;/cfif&gt; /&gt;
                    &lt;span&gt;Horror&lt;/span&gt;
					&lt;/label&gt;
				&lt;/li&gt;
                &lt;li&gt;
                	&lt;label&gt;
                	&lt;input type="checkbox" name="genre" value="fantasy" &lt;cfif listFindNoCase(form.genre,"fantasy")&gt;checked&lt;/cfif&gt; /&gt;
                    &lt;span&gt;Fantasy&lt;/span&gt;
					&lt;/label&gt;
				&lt;/li&gt;
                &lt;li&gt;
                	&lt;label&gt;
                	&lt;input type="checkbox" name="genre" value="crime" &lt;cfif listFindNoCase(form.genre,"crime")&gt;checked&lt;/cfif&gt; /&gt;
                    &lt;span&gt;Crime&lt;/span&gt;
					&lt;/label&gt;
				&lt;/li&gt;
			  &lt;/ul&gt;
            &lt;/div&gt;
		    &lt;/cfoutput&gt;
          &lt;/div&gt;
		   &lt;div class="actions"&gt;
            &lt;input type="submit" class="btn primary" name="save" value="Save changes"&gt;&nbsp;&lt;button type="reset" class="btn"&gt;Cancel&lt;/button&gt;
          &lt;/div&gt;
		&lt;/fieldset&gt;
		&lt;/form&gt;

	&lt;/div&gt;    

&lt;/body&gt;    
&lt;/html&gt;
</code></pre>

<p>

The primary area you want to look at is the code block. Let's look first at the second section - our event handler. It's been modified now to simply store the JSON string into sessionStorage. In theory I should check to see if that exists, but almost all browsers support local/sessionStorage, even IE. Yes, even IE. And shoot, if IE supports a feature you almost <i>have</i> to use it. 

<p>

Now scroll up a bit. The block of code there will run when the page loads (and the DOM is ready). If we see a sessionStorage value, we then grab it, convert it, and update our form. I'm not terribly happy with the code in the loop there as it's very specific. You would have to update this for another form, but I'm not building a plugin here so I'm ok with hard coded values. 

<p>

<strike>
You can demo this version here: http://www.raymondcamden.com/demos/2012/jan/10/draft2/form.cfm
</strike>

<p>

So - which version is better? The HTML5 one, right? 

<p>

<img src="https://static.raymondcamden.com/images/HTML5_Badge_256.png" />

<p>

Well, it definitely has in it's favor less server side code. Disabling JavaScript would break both versions so that's not something that leads us to one solution or another. It's also going to require less network activity. But we've also put the work of storage into the hands of the client too, whereas before we had a 'fire and forget' logic for storage. Not to be creepy, but the first version could also be used to persist and be used for tracking and analysis. 

<p>

So - thoughts? (Note - you can get all the code by clicking the download link below.)<p><a href='https://static.raymondcamden.com/enclosures/saveform.zip'>Download attached file.</a></p>