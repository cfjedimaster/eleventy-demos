---
layout: post
title: "HTML5 Form Validation - The Constraint Validation API"
date: "2012-03-19T11:03:00+06:00"
categories: [html5]
tags: []
banner_image: 
permalink: /2012/03/19/HTML5-Form-Validation-The-Constraint-Validation-API
guid: 4565
---

In my <a href="http://www.raymondcamden.com/index.cfm/2012/3/16/A-look-at-HTML5-Form-Validition">last blog entry</a>, I introduced the basic concepts of form validation under HTML5. The focus was on basic tag/attribute support. In other words, what could be done without writing JavaScript code. In today's entry I want to talk about how you can use JavaScript to further enhance and work with validation, specifically the Constraint Validation API.

<p>
<!--more-->
At a high level, this API covers the following features:

<p/>

<ul>
<li>Form fields have a validity property. This property is a set of keys and boolean values that represent the validity, or lack of, of a particular form. A great example of this is the numeric field type. You can specify that a form field should be numeric, higher than 0, and less than 70. The validity property would actually be able to tell you if the value wasn't a number, or was too low or too high.
<li>Form fields also have a generic checkValidity() function that returns true or false. So if you don't care <i>why</i> a field is invalid, you can simply use that. Or you can use that before digging into the validity property to determine exactly why the field isn't valid.
<li>Finally, there is a setCustomValidity() method that lets you create a custom validation error. You can think of this like a throw() call as it both lets you set a message and, by default, sets the field as being in an error state. If you use an empty string, the field is considered valid.
</ul>

<p/>

I began my investigation by looking at the validity property. If you read the <a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#the-constraint-validation-api">spec</a> (no, I'm not joking, you really should),  you'll see a nice list of the validity properties and their meanings. I'm quoting here from that spec:

<p/>

<blockquote>
element . validity . valueMissing<br/>
Returns true if the element has no value but is a required field; false otherwise.
<br/><br/>
element . validity . typeMismatch<br/>
Returns true if the element's value is not in the correct syntax; false otherwise.
<br/><br/>
element . validity . patternMismatch<br/>
Returns true if the element's value doesn't match the provided pattern; false otherwise.
<br/><br/>
element . validity . tooLong<br/>
Returns true if the element's value is longer than the provided maximum length; false otherwise.
<br/><br/>
element . validity . rangeUnderflow<br/>
Returns true if the element's value is lower than the provided minimum; false otherwise.
<br/><br/>
element . validity . rangeOverflow<br/>
Returns true if the element's value is higher than the provided maximum; false otherwise.
<br/><br/>
element . validity . stepMismatch<br/>
Returns true if the element's value doesn't fit the rules given by the step attribute; false otherwise.
<br/><br/>
element . validity . customError<br/>
Returns true if the element has a custom error; false otherwise.
<br/><br/>
element . validity . valid<br/>
Returns true if the element's value has no validity problems; false otherwise.
</blockquote>

<p/>

That's quite a few properties. I created a form that made use of various new input types and wrote code to iterate over those properties and write them out so I could see in real time how the values would change based on the inputs I provided.

<p/>

<code>
var fields = document.querySelectorAll("input");
for(var i=0,len=fields.length; i&lt;len; i++) {
        var thisId = fields[i].id;
        var s = "&lt;div class='results'&gt;Validity for "+thisId;
        s += "&lt;table&gt;";
          //first, call checkValidity as a whole
          s += "&lt;tr&gt;&lt;td&gt;&lt;b&gt;VALID:&lt;/b&gt;&lt;/td&gt;&lt;td&gt;"+fields[i].checkValidity()+"&lt;/td&gt;&lt;/tr&gt;";
        for(prop in fields[i].validity) {
            s += "&lt;tr&gt;&lt;td&gt;"+prop+"&lt;/td&gt;&lt;td&gt;"+fields[i].validity[prop]+"&lt;/td&gt;&lt;/tr&gt;";
        }
        s+= "&lt;/table&gt;&lt;/div&gt;";
        fields[i].insertAdjacentHTML("afterend",s);
}
</code>

<p/>

You can see my simple for/in loop there generating nice table rows. Also note I use the checkValidity API to show, at a high level, if the field is valid or not.

<p/>

Here's an example:

<p/>

<img src="https://static.raymondcamden.com/images/ScreenClip47.png" />

<p/>

I mentioned the checkValidity API and how it can be used as a shortcut for determining if a field is valid. What's cool is that you can also do it for the entire form. Here is another example:

<p/>

<code>
//check the form as a whole
var form = getBySel("#mainForm");
var formStatus = getBySel("#formStatus");
formStatus.innerHTML = "&lt;p&gt;Form validity as a whole is "+form.checkValidity()+"&lt;/p&gt;";
</code>

<p/>

As a quick aside, getBySel was just a shortcut function I wrote:

<p/>

<code>
//jQuery is a drug - a shiny, happy drug...
function getBySel(id) {% raw %}{ return document.querySelector(id); }{% endraw %}
</code>

<p/>

Put together, I've got a nice demo application that lets you test this API against a variety of constraints. Since it is entirely client-side, I'll encourage you to View Source:

<p/>

<a href="http://www.raymondcamden.com/demos/2012/mar/19/15_validationapi.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>

<p/>

Now let's look at the next piece of the puzzle - custom validation. I mentioned the setCustomValidity API before. It works like so:

<p/>

Given a field - if you set any non-empty string value via setCustomValidity, it is implied that the field is in error. If you set an empty string, it is implied that the field is ok. 

<p/>

So that makes sense, but it feels a bit awkward to me. I know I tend to rail against making things overly complex, but it feels weird that setting a string value for the <i>message</i> also sets the field as being invalid. I'd rather a two step process along the lines of setValid(false);setCustomValidity("....");.

<p/>

Let's look at an example. This is a bit contrived, but in the form below we want to error out if the value is ray.

<p/>

<code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&lt;script&gt;
function getBySel(id) {% raw %}{ return document.querySelector(id); }{% endraw %}

function demoForm() {
    var field = getBySel("#field1");
    var value = field.value;
    if(value == 'ray') {
        field.setCustomValidity("Ray is wack!");
    } else {
		field.setCustomValidity("");
	}
}

function init() {
    getBySel("#testForm").addEventListener("click",demoForm,false);
}
&lt;/script&gt;
&lt;style&gt;
&lt;/style&gt;
&lt;/head&gt;
&lt;body onload="init()"&gt;

&lt;form&gt;

    &lt;p&gt;
        Just required:
        &lt;input type="text" id="field1"&gt;
    &lt;/p&gt;

    &lt;p&gt;
        &lt;button id="testForm"&gt;Test&lt;/button&gt;
    &lt;/p&gt;
&lt;/form&gt;
&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

As I said - it's a rather trivial example, but you can see where I use a simple event handler to check the value of a form field. It is important to remember that once you setCustomValidity and pass a non-empty string, the field is considered in error until you setCustomValidity with an empty string. Basically you've marked the field as bad until you explicitly set it to good.

<p/>

Obviously one could do something a bit more complex here. You're options are pretty much anything at all. You could do an Ajax request to ensure the value was unique. You could check other values in the form. Try the demo yourself:

<p/>


<a href="http://www.raymondcamden.com/demos/2012/mar/19/16_validationapi2.html"><img src="https://static.raymondcamden.com/images/icon_128.png" title="Demo, Baby" border="0"></a>