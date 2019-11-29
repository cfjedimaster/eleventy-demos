---
layout: post
title: "HTML5 Form Validation with Style"
date: "2012-03-23T12:03:00+06:00"
categories: [html5]
tags: []
banner_image: 
permalink: /2012/03/23/HTML5-Form-Validation-with-Style
guid: 4567
---

Welcome to my third and final (although whenever I say that it typically leads to more posts, diversions, and experiments) on HTML5-based form validation. In the <a href="http://www.raymondcamden.com/index.cfm/2012/3/16/A-look-at-HTML5-Form-Validition">first entry</a> I discussed how you could add simple client-side validation to your forms by just using HTML. In my <a href="http://www.raymondcamden.com/index.cfm/2012/3/19/HTML5-Form-Validation--The-Constraint-Validation-API">second entry</a>, I demonstrated how to add JavaScript for deeper, and customized validation. In this final entry, I'll discuss how to employ CSS to visually enhance your forms.
<!--more-->
<p>

While doing research into this topic, I had a vague idea of the CSS styles that could be used. But I had a difficult time finding an exact specification for the feature itself. Called "CSS Pseudo-Classes", these are styles that reflect a <i>state</i> of a DOM item instead of simple tag or class. I came across an excellent article by Ryan Seddon on <a href="http://www.alistapart.com/articles/forward-thinking-form-validation/">form validation</a> where he lists the following pseudo-classes:

<p>

<ul>
<li>valid</li>
<li>invalid</li>
<li>required</li>
<li>optional</li>
<li>in-range</li>
<li>out-of-range</li>
<li>read-only</li>
<li>read-write</li>
</ul>

<p>

Right away, we can see that there are some interesting options here. I went into this research expecting support for invalid and valid, but the other options surprised me. Using in-range and out-of-range, you can actually apply styles to number text fields that are not within a particular range. I also think it is cool that you can combine required, invalid, and valid to visually represent three separate states for a form field. Let's look at an example.

<p>

Here is one of the forms I used in my first example. It contains both a login and registration section.

<p>

<code>
&lt;h2&gt;Login&lt;/h2&gt;
&lt;form action="" autocomplete="off"&gt;
&lt;label for="username"&gt;Username&lt;/label&gt;
&lt;input id="username" name="username" pattern="[a-zA-Z0-9]{% raw %}{5,}{% endraw %}" title="Minmimum 5 letters or numbers." required&gt;
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
</code>

<p>

And here's how it renders normally.

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip48.png" />

<p>

Now let's add a bit of CSS:

<p>

<code>
&lt;style&gt;
input:required {
    border-style:solid;
    border-width:thick;
}
input:valid {
    background-color: #adff2f;
}
input:invalid {
    background-color: #f08080;
}
&lt;/style&gt;
</code>

<p>

I've defined 3 different things here - all using pseudo-classes. The first defines a thick border for required items. The second defines a greenish (it's a color - honest) color for valid items and a reddish color for invalid items. Now look at the same form:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip49.png" />

<p>

Big difference, right? Now look at it after I've done a bit of editing.

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip50.png" />

<p>

What isn't evident in these screenshots is that Chrome and Firefox both animate these styles. It's a minor animation, pretty subtle, but it works rather well. You can demo this form here:

<p>
<a href="http://www.raymondcamden.com/demos/2012/mar/23/20_validationnicer.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

Just imagine if someone with - you know - actual design sense were to work with this? Now let's look at another example. In the form below, I've got a few simple text fields but also some numeric ones:

<p>

<code>
&lt;form id="mainForm"&gt;

    &lt;p&gt;
        Not required, nothing special:
        &lt;input type="text" id="field0"&gt;
    &lt;/p&gt;

    &lt;p&gt;
        Just required:
        &lt;input type="text" id="field1" required&gt;
    &lt;/p&gt;

    &lt;p&gt;
        Email:
        &lt;input type="email" id="field2" required&gt;
    &lt;/p&gt;

    &lt;p&gt;
        URL:
        &lt;input type="url" id="field3" required&gt;
    &lt;/p&gt;

    &lt;p&gt;
        Number:
        &lt;input type="number" id="field4" required&gt;
    &lt;/p&gt;

    &lt;p&gt;
        Number (Min 0):
        &lt;input type="number" id="field5" required min="0"&gt;
    &lt;/p&gt;

    &lt;p&gt;
        Number (Max 10):
        &lt;input type="number" id="field6" required max="10"&gt;
    &lt;/p&gt;

    &lt;p&gt;
        Number (Min 1, Max 10):
        &lt;input type="number" id="field7" required min="1" max="10"&gt;
    &lt;/p&gt;

    &lt;p&gt;
        Number (Min 1, Max 10, Step 2):
        &lt;input type="number" id="field8" required min="1" max="10" step="2"&gt;
    &lt;/p&gt;

&lt;/form&gt;
</code>

<p>

I used the following CSS. Note specifically the in-range and out-of-range pseudo-classes:

<p>

<code>
&lt;style&gt;
input:required {
    border-style:solid;
     border-width:thick;
}
input:valid {
     background-color: #adff2f;
}
input:invalid {
     background-color: #f08080;
}
input:out-of-range {
     background-color: #808080;
}
input:in-range {
     background-color: #8a2be2;
}
&lt;/style&gt;
</code>

<p>

In Chrome, this is what you get:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip51.png" />

<p>

My numeric fields are empty, but marked in-range, which is a bit weird. But look what happens when I intentionally enter a bad value for one of them:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip52.png" />

<p>

As you can see, it did recognize my number was too low and colored it wrong. All very interesting, but it looks like Firefox doesn't support these two at all:

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip53.png" />

<p>

It looks like Firefox isn't supporting the number type at all so it makes sense for the pseudo-class not to be supported either. Thankfully Firefox supports mission critical features like Canvas, which is obviously more much more important than form fields. (Oops, sorry, I started my old rant again. I'll stop.) It does fall back nicely though so it's certainly not a total loss. For an example of that, we can always rely on IE... 

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip54.png" />

<p>

You can demo this version below.

<p>

<a href="http://www.raymondcamden.com/demos/2012/mar/23/21_validationnicer.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>