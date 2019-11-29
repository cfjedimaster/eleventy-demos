---
layout: post
title: "A look at HTML5 Form Validation"
date: "2012-03-16T11:03:00+06:00"
categories: [html5]
tags: []
banner_image: 
permalink: /2012/03/16/A-look-at-HTML5-Form-Validition
guid: 4563
---

I'm doing research for my upcoming HTML5 presentation at <a href="http://www.cfobjective.com">cfObjective</a>. One of the areas that I find most interesting is updates to forms. I'm probably biased since I've worked on so many web applications as opposed to front end/marketing type sites, but I tend to think forms are pretty critical. (And no big surprise - my other favorite areas of HTML5 involve data and networking.) I've previously looked at updates to form fields, but I had not really spent a lot of time looking at validation. I spent some time on it this week and have come away pretty damn impressed. Here is the first in a series of blog entries planned on the topic.

<!--more-->

In today's blog entry, I want to look at validation at the tag level. Tomorrow's entry (well, the next entry) will look at some of the JavaScript involved, but I was <i>very</i> surprised by how much you could do without writing a line of JavaScript. At a high level, validation in HTML5 comes down to three features:


<ul>
<li>Adding a required attribute to a form field will make it required. Duh. 
<li>Adding a type attribute to a form field will make the form check your input and ensure it matches the type.
<li>And finally - if you match the two (a type and a required attribute) then you will be required to enter <i>something</i> and have it match the type.
</ul>


What that means is that adding basic validation is as trivial as adding the word "required" to your HTML. Consider this login form:


<pre><code class="language-markup">
&lt;form action="" autocomplete="off"&gt;
	&lt;label for="username"&gt;Username&lt;/label&gt;
	&lt;input id="username" name="username" required&gt;

	&lt;label for="password"&gt;Password&lt;/label&gt;
	&lt;input id="password" name="password" type="password" required&gt;
	&lt;p/&gt;
	&lt;input type="submit" class="btn" value="Login"&gt;

&lt;/form&gt;
</code></pre>


That's it. No JavaScript library. No form submit handler. Nada. In compliant browsers, you immediately get visual feedback when submitting the form:


<img src="https://static.raymondcamden.com/images/ScreenClip44.png" />


The browser actually prevents you from submitting the form. Entering a value for the username and then submitting again automatically moves the error to my password field:


<img src="https://static.raymondcamden.com/images/ScreenClip45.png" />


How much simpler can it get? Now let's talk about type validation. HTML5 adds a variety of new input types. Two of them are particularly useful - email and url. These form fields render the exact same as any normal text field, but in terms of validation, they will be a bit more picky about what you enter. We just demonstrated a login form, now let's look at a slightly more complex registration form.

<p>

<pre><code class="language-markup">
&lt;form action="" autocomplete="off"&gt;
	&lt;label for="username2"&gt;Username&lt;/label&gt;
	&lt;input id="username2" name="username" required&gt;

	&lt;label for="password2"&gt;Password&lt;/label&gt;
	&lt;input id="password2" name="password" type="password" required&gt;

	&lt;label for="email"&gt;Email&lt;/label&gt;
	&lt;input id="email" name="email" type="email" required&gt;

	&lt;label for="url"&gt;Homepage&lt;/label&gt;
	&lt;input id="url" name="url" type="url"&gt;

	&lt;p/&gt;
	&lt;input type="submit" class="btn" value="Register"&gt;

&lt;/form&gt;
</code></pre>


Notice I've still got a required username and password. I've added an email field that is required (note the use of type="email") and an optional url field. The type is set to url but it is not required. 

Just by changing the types and adding required, I've now added logic to my form such that:

<ul>
<li>Username and password will be required.
<li>Email will be required, and it must be a valid email address.
<li>Homepage is <i>not</i> required, but if I type anything in, it must be a valid URL. (And by valid we mean syntax wise. It could be a valid URL and not actually resolve to a host.)
</ul>


Want to play with this? Then check out my demo: <a href="https://static.raymondcamden.com/demos/2012/mar/16/forms/10_validation.html">https://static.raymondcamden.com/demos/2012/mar/16/forms/10_validation.html</a>


But wait! There's more. What if you want to do a more customized validation? I mentioned earlier that we can use JavaScript, and I plan on talking about that more in the next blog entry. But there is also another option: Regular Expressions. You can add simple regex checks to a field by using the <b>pattern</b> attribute. I found a <a href="http://stackoverflow.com/questions/5458076/regex-in-new-pattern-attr-for-html5-forms">great example</a> of this that adds simple logic to require a minimum size: pattern="[a-zA-Z0-9]{% raw %}{5,}{% endraw %}". Here's a modified form of our login and registration form that will require a username and password to be 5 characters long. Usernames are also set to require letters and numbers only.


<pre><code class="language-markup">
&lt;h2&gt;Login&lt;/h2&gt;
&lt;form action="" autocomplete="off"&gt;
	&lt;label for="username"&gt;Username&lt;/label&gt;
	&lt;input id="username" name="username" pattern="[a-zA-Z0-9]{% raw %}{5,}{% endraw %}" title="Minimum 5 letters or numbers." required&gt;
	&lt;!-- Credit: http://stackoverflow.com/questions/5458076/regex-in-new-pattern-attr-for-html5-forms --&gt;
	&lt;label for="password"&gt;Password&lt;/label&gt;
	&lt;input id="password" name="password" type="password" pattern=".{% raw %}{5,}{% endraw %}" title="Minmimum 5 letters or numbers." required&gt;
	&lt;p/&gt;
	&lt;input type="submit" class="btn" value="Login"&gt;

&lt;/form&gt;

&lt;h2&gt;Register&lt;/h2&gt;
&lt;form action="" autocomplete="off"&gt;
	&lt;label for="username2"&gt;Username&lt;/label&gt;
	&lt;input id="username2" name="username" pattern="[a-zA-Z0-9]{% raw %}{5,}{% endraw %}" title="Minmimum 5 letters or numbers."  required&gt;

	&lt;label for="password2"&gt;Password&lt;/label&gt;
	&lt;input id="password2" name="password" type="password" pattern=".{% raw %}{5,}{% endraw %}" title="Minmimum 5 letters or numbers." required&gt;

	&lt;label for="email"&gt;Email&lt;/label&gt;
	&lt;input id="email" name="email" type="email" required&gt;

	&lt;label for="url"&gt;Homepage&lt;/label&gt;
	&lt;input id="url" name="url" type="url"&gt;

	&lt;p/&gt;
	&lt;input type="submit" class="btn" value="Register"&gt;

&lt;/form&gt;
</code></pre>


Note the use of the title attribute to provide a hint to the user. In Chrome and Firefox, this is even rendered in the error:

<img src="https://static.raymondcamden.com/images/ScreenClip46.png" />

<p>

You can view a demo of this one here: <a href="https://static.raymondcamden.com/demos/2012/mar/16/forms/11_validation_regex.html">https://static.raymondcamden.com/demos/2012/mar/16/forms/11_validation_regex.html</a> 

<p>

So - the big question is - what in the heck happens with browsers that don't support this? <b>Nothing.</b> And there's nothing at all wrong with that. Why? First off - when these new form features "fail", they fail well. The user doesn't see anything weird - they just seem forms. Secondly - we all use server-side validation and don't ever assume client side validation is going to work. No one makes that mistake. No one. So that being said - even with easy to use jQuery-based solutions, I can see skipping that and just relying on this. For folks with decent browsers, they get a great feature with about 2 seconds of my time to code it. For folks with crap browsers (hint - rhymes with "my pee"), they still get a usable form and server-side validation.