---
layout: post
title: "Turning a form into a multistep process with jQuery"
date: "2010-05-27T03:05:00+06:00"
categories: [jquery]
tags: []
banner_image: 
permalink: /2010/05/27/Turning-a-form-into-a-multistep-process-with-jQuery
guid: 3832
---

Byron asks:
<p>
<blockquote>
jQuery question that I can't get my head around.  I have a form with about 20 questions.  The client want to show one question "per page".  So instead of 20 cfm files, I thought I'd try jQuery to hide/show the questions so I'd have only one cfm page.  I put "Next" buttons to proceed to next question.
<br/><br/>
<br/>
Excerpt of form:<br/>
<br/>
&lt;div id="q2"&gt;<br/>
&lt;p&gt;2.) Question 2 &lt;input name="Age" type="text"&gt;&lt;/p&gt;<br/>
&lt;input type="button" name="Next" value="Next" id="Next2" /&gt;<br/>
&lt;/div&gt;<br/>
<br/><br/>
&lt;div id="q3"&gt;<br/>
&lt;p&gt;2.) Question 3 &lt;input name="Birthplace" type="text"&gt;&lt;/p&gt;<br/>
&lt;input type="button" name="Next" value="Next" id="Next3" /&gt;<br/>
&lt;/div><br/>
<br/>
My jQuery is like so:<br/>
<br/>
$('#Next2').click(function(){<br/>
       $('#q2').hide();<br/>
       $('#q3').show();<br/>
})<br/>
$('#Next3').click(function(){<br/>
       $('#q3').hide();<br/>
       $('#q4').show();<br/>
})<br/>
<br/>
Works like I want it to.  Now the question.  Is there way to create a function for this so I don't have to do 20 functions.  I tried some ways using .parentNode and .nextSibling with no avail.
</blockquote>

<p>

Before I had a chance to answer, Bryon came back with a partial solution:

<p>

<blockquote>
I was able to clean the code up  a bit like so:<br/>
<br/>
$('#Next2,#Next3').click(function(){<br/>
       $(this).parent().hide();<br/>
       $(this).parent().next().show();<br/>
       })<br/>
<br/>
So now I would need to list each ID selector (Next2-Next20) in the selector.  Would there be a way to clean that up?
</blockquote>

<p>

I decided to try to tackle this solution a different way. First, I decided that I did <i>not</i> want to have to add buttons to each question. I thought this would make the form a bit simpler and give us more control over the "pagination":

<p>

<code>
&lt;form id="mainform" method="post"&gt;

&lt;div class="question"&gt;
1) Why do you rock, Raymond? &lt;input type="text" name="whyrock"&gt;
&lt;/div&gt;

&lt;div class="question"&gt;
2) A radio question:&lt;br/&gt;
&lt;input type="radio" name="q2" value="a"&gt;Apples&lt;br/&gt;
&lt;input type="radio" name="q2" value="b"&gt;Bananas&lt;br/&gt;
&lt;/div&gt;

&lt;div class="question"&gt;
3) Another dumb question: &lt;input type="text" name="q3"&gt;
&lt;/div&gt;

&lt;div class="question"&gt;
4) A textarea question:&lt;br/&gt;
&lt;textarea name="foo"&gt;&lt;/textarea&gt;
&lt;/div&gt;

&lt;/form&gt;
</code>

<p>

Note that I've made use of a class on each div called question. To help create a pagination effect, I then added this style:

<p>

<code>
&lt;style&gt;
.question {% raw %}{ display:none; }{% endraw %}
&lt;/style&gt;
</code>

<p>

Now let's look at the jQuery I ended up with:

<p>

<code>
$(document).ready(function() {
	//add the Next button
	$('.question').append("&lt;br/&gt;&lt;input type='button' value='Next' class='questionBtn'&gt;")
	
	//show q1
	$('.question:first').show()
	
	$('.questionBtn').click(function(){
		//new logic here - am i the last one?
		if($(this).parent().is(":last-child")) {
			$("#mainform").submit()
		}
		$(this).parent().hide();
		$(this).parent().next().show();
	})
})
</code>

<p>

I begin by finding all my question divs and appending a Next button to them. This saves me some work right there. Since I previously hid all my questions, I now show the first one. Finally, I've modified Bryon's code a bit to handle the buttons. His code actually worked perfectly fine - but I wanted to make sure that the last button would perform a form submit. (In fact, it occurs to me I could also make the last button label read 'Submit' instead of 'Next' if I wanted to as well.) I use the is() function to compare the node to the last one - and if they match - perform a submit. (Thank you, StackOverflow: <a href="http://stackoverflow.com/questions/2448291/how-to-check-for-dom-equality-with-jquery">How to check for DOM equality with jQuery?</a>)

<p>

How well does it work? Check the demo yourself:

<p>

<a href="http://www.raymondcamden.com/demos/may272010/test3.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

You can view source to see the complete HTML there. Anyone else done something like this? I'll note that I wrote this in like five minutes so I'm sure there are things that can be improved.