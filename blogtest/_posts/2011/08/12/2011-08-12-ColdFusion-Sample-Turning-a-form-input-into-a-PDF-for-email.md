---
layout: post
title: "ColdFusion Sample - Turning a form input into a PDF for email"
date: "2011-08-12T16:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/08/12/ColdFusion-Sample-Turning-a-form-input-into-a-PDF-for-email
guid: 4325
---

This idea came from a discussion today on the cf-newbie mail list. Zelda (real name, or real name in the sig, either way, cool) described a situation where she need to...

<p/>

<ul>
<li>Process a form
<li>Turn the form data into a PDF
<li>Email the PDF
</ul>

<p/>

This isn't a complex process, but it's an interesting example of where you can combine simple tasks in ColdFusion into something a bit more complex. I thought it would make an excellent entry in my ColdFusion Sample series. What follows is my take on how one could do this. Let's begin by creating a simple form.
<!--more-->
<p>

<code>
&lt;form method="post"&gt;
&lt;h2&gt;Order Request / Kuat Drive Yards&lt;/h2&gt;
			
&lt;p&gt;
	Thank you for your interest in ordering form Kuat Drive Yards. Please fill out the
	form below and be as complete as possible with your needs.
&lt;/p&gt;
			
&lt;cfoutput&gt;
&lt;cfif structKeyExists(variables, "errors")&gt;
	&lt;p&gt;
		&lt;b&gt;Please correct these errors:&lt;br&gt;
		#errors#
		&lt;/b&gt;
	&lt;/p&gt;
&lt;/cfif&gt;
			
&lt;p&gt;
&lt;label for="name"&gt;Your Name:&lt;/label&gt;
&lt;input type="text" name="name" id="name" value="#form.name#"&gt;&lt;br/&gt;
&lt;/p&gt;
			
&lt;p&gt;
&lt;label for="email"&gt;Your Email:&lt;/label&gt;
&lt;input type="text" name="email" id="email" value="#form.email#"&gt;&lt;br/&gt;
&lt;/p&gt;
			
&lt;p&gt;
&lt;label for="orderrequest"&gt;Your Request:&lt;/label&gt;&lt;br/&gt;
&lt;textarea name="orderrequest" id="orderrequest"&gt;#form.orderrequest#&lt;/textarea&gt;
&lt;/p&gt;
&lt;/cfoutput&gt;

&lt;p&gt;
&lt;input type="submit" name="submit" value="Send Request"&gt;
&lt;/p&gt;
&lt;/form&gt;
</code>

<p>

Nothing too complex here. I've got 3 main form fields and a bit of logic to handle errors. Where that variable comes from, and the form fields themselves, will get to in a minute. With a bit of styling, this is our result.

<p>

<img src="https://static.raymondcamden.com/images/ScreenClip151.png" />

<p>

Ok, now let's actually build in the form processing logic. In this version, I've got everything done except what we want to happen with the form when everything is entered correctly. 

<p>

<code>
&lt;cfparam name="form.name" default=""&gt;
&lt;cfparam name="form.email" default=""&gt;
&lt;cfparam name="form.orderrequest" default=""&gt;

&lt;cfset showForm = true&gt;
&lt;cfif structKeyExists(form, "submit")&gt;
	&lt;cfset errors = ""&gt;
	&lt;cfset form.name = trim(htmlEditFormat(form.name))&gt;
	&lt;cfset form.email = trim(htmlEditFormat(form.email))&gt;
	&lt;cfset form.orderrequest = trim(htmlEditFormat(form.orderrequest))&gt;

	&lt;cfif form.name is ""&gt;
		&lt;cfset errors = errors & "Include your name.&lt;br/&gt;"&gt;
	&lt;/cfif&gt;
	&lt;cfif form.email is "" or not isValid("email", form.email)&gt;
		&lt;cfset errors = errors & "Include your email address.&lt;br/&gt;"&gt;
	&lt;/cfif&gt;
	&lt;cfif form.orderrequest is ""&gt;
		&lt;cfset errors = errors & "Include your order request.&lt;br/&gt;"&gt;
	&lt;/cfif&gt;
	
	&lt;cfif errors is ""&gt;
		&lt;cfset showForm = false&gt;
	&lt;/cfif&gt;	

&lt;/cfif&gt;

&lt;html&gt;
	
&lt;head&gt;
&lt;title&gt;Order Request / Kuat Drive Yards&lt;/title&gt;
&lt;style&gt;
	#orderForm {
		width: 500px;
		margin-left: auto;
		margin-right: auto;
		margin-top: 10px;
		background-color: white;
		padding: 10px;
	}

	input[type='text'] { 
		width: 250px;
		float: right;
	}
	textarea {
		width: 100%;
		height: 200px;
	}
	
	body {
		background-color: #c0c0c0;;	
	}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="orderForm"&gt;	

	&lt;cfif showForm&gt;
		&lt;form method="post"&gt;
		
			&lt;h2&gt;Order Request / Kuat Drive Yards&lt;/h2&gt;
			
			&lt;p&gt;
				Thank you for your interest in ordering form Kuat Drive Yards. Please fill out the
				form below and be as complete as possible with your needs.
			&lt;/p&gt;
			
			&lt;cfoutput&gt;
			&lt;cfif structKeyExists(variables, "errors")&gt;
				&lt;p&gt;
					&lt;b&gt;Please correct these errors:&lt;br&gt;
					#errors#
					&lt;/b&gt;
				&lt;/p&gt;
			&lt;/cfif&gt;
			
			&lt;p&gt;
			&lt;label for="name"&gt;Your Name:&lt;/label&gt;
			&lt;input type="text" name="name" id="name" value="#form.name#"&gt;&lt;br/&gt;
			&lt;/p&gt;
			
			&lt;p&gt;
			&lt;label for="email"&gt;Your Email:&lt;/label&gt;
			&lt;input type="text" name="email" id="email" value="#form.email#"&gt;&lt;br/&gt;
			&lt;/p&gt;
			
			&lt;p&gt;
			&lt;label for="orderrequest"&gt;Your Request:&lt;/label&gt;&lt;br/&gt;
			&lt;textarea name="orderrequest" id="orderrequest"&gt;#form.orderrequest#&lt;/textarea&gt;
			&lt;/p&gt;
			
			&lt;/cfoutput&gt;
			&lt;p&gt;
			&lt;input type="submit" name="submit" value="Send Request"&gt;
			&lt;/p&gt;
		&lt;/form&gt;
		
	&lt;cfelse&gt;
		&lt;h2&gt;Thank you&lt;/h2&gt;
		&lt;p&gt;
		Your order request has been received. Thank you.
		&lt;/p&gt;
	&lt;/cfif&gt;
	
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Scrolling from the top to the bottom, you can see I've paramed my form fields first. This allows me to always assume they exist and use them in the form right away. Whenever an error occurs and we redisplay the form, this allows for keeping their previous data in the form. If you don't do this, your users will hate you. I'm using a simple variable, showForm, that will keep track of whether or not we need to display the form. 

<p>

My form processing logic is rather simple. Notice I trim and htmlEditFormat all the fields. Then I simply ensure they are all not blank. Only the email field gets a bit of extra love with the isValid function. Now I should be able to test my form. I can try leaving a few fields blank, hitting submit, and ensuring I get my error messages. The error message should change based on what I did wrong and the form should remember the fields I entered. Nice. Ok, now for the last bits.

<p>

First - generating a PDF is incredibly simple. I create my PDF from the form input using the cfdocument tag.

<p>

<code>
&lt;!--- create a PDF from the request: ---&gt;
&lt;cfdocument format="pdf" name="pdfData"&gt;
&lt;cfoutput&gt;
&lt;h2&gt;Order Request&lt;/h2&gt;
&lt;p&gt;
Order made by #form.name# (#form.email#) on #dateFormat(now(), "mm/dd/yy")# at #timeFormat(now(), "h:mm tt")#.
&lt;/p&gt;
&lt;p&gt;
The request was for:
&lt;/p&gt;
&lt;p&gt;
#form.orderrequest#
&lt;/p&gt;
&lt;/cfoutput&gt;
&lt;/cfdocument&gt;
</code>

<p>

While you've probably seen cfdocument before, make note of the name attribute. This tells ColdFusion to store the PDF bits in a variable instead of saving it or writing it out to screen. Now let's send our email:

<p>

<code>
&lt;cfmail to="raymondcamden@gmail.com" from="#form.email#" subject="Order Request"&gt;
	&lt;cfmailparam disposition="attachment" file="request.pdf" type="application/pdf" content="#pdfData#" &gt;
	An order request has been filed. See the attached PDF for details.
&lt;/cfmail&gt;
</code>

<p>

Nothing too fancy here. I send the email and attach the document. Make note of the content attribute of the cfmailparam tag. This allows me to attach the PDF and skip saving it to the file system. This is <b>not</b> in the PDF for the CFML 9 reference but is in the  <a href="http://help.adobe.com/en_US/ColdFusion/9.0/CFMLRef/WSc3ff6d0ea77859461172e0811cbec22c24-7c15.html">online</a> version.

<p>

And that's it. If you're curious about the PDF I've attached it to the blog entry. And yes - this is a bit of a silly example. I didn't really need to create a PDF for 3 simple fields, but if your business process requires a PDF to be generated and emailed, hopefully this demonstrates how simple it is in ColdFusion. The full code of the template I used may be found below.

<p>

<code>
&lt;cfparam name="form.name" default=""&gt;
&lt;cfparam name="form.email" default=""&gt;
&lt;cfparam name="form.orderrequest" default=""&gt;

&lt;cfset showForm = true&gt;
&lt;cfif structKeyExists(form, "submit")&gt;
	&lt;cfset errors = ""&gt;
	&lt;cfset form.name = trim(htmlEditFormat(form.name))&gt;
	&lt;cfset form.email = trim(htmlEditFormat(form.email))&gt;
	&lt;cfset form.orderrequest = trim(htmlEditFormat(form.orderrequest))&gt;

	&lt;cfif form.name is ""&gt;
		&lt;cfset errors = errors & "Include your name.&lt;br/&gt;"&gt;
	&lt;/cfif&gt;
	&lt;cfif form.email is "" or not isValid("email", form.email)&gt;
		&lt;cfset errors = errors & "Include your email address.&lt;br/&gt;"&gt;
	&lt;/cfif&gt;
	&lt;cfif form.orderrequest is ""&gt;
		&lt;cfset errors = errors & "Include your order request.&lt;br/&gt;"&gt;
	&lt;/cfif&gt;
	
	&lt;cfif errors is ""&gt;

		&lt;!--- create a PDF from the request: ---&gt;
		&lt;cfdocument format="pdf" name="pdfData"&gt;
		&lt;cfoutput&gt;
		&lt;h2&gt;Order Request&lt;/h2&gt;
		&lt;p&gt;
		Order made by #form.name# (#form.email#) on #dateFormat(now(), "mm/dd/yy")# at #timeFormat(now(), "h:mm tt")#.
		&lt;/p&gt;
		&lt;p&gt;
		The request was for:
		&lt;/p&gt;
		&lt;p&gt;
		#form.orderrequest#
		&lt;/p&gt;
		&lt;/cfoutput&gt;
		&lt;/cfdocument&gt;

		&lt;cfmail to="raymondcamden@gmail.com" from="#form.email#" subject="Order Request"&gt;
			&lt;cfmailparam disposition="attachment" file="request.pdf" type="application/pdf" content="#pdfData#" &gt;
			An order request has been filed. See the attached PDF for details.
		&lt;/cfmail&gt;
		&lt;cfset showForm = false&gt;
	&lt;/cfif&gt;	

&lt;/cfif&gt;

&lt;html&gt;
	
&lt;head&gt;
&lt;title&gt;Order Request / Kuat Drive Yards&lt;/title&gt;
&lt;style&gt;
	#orderForm {
		width: 500px;
		margin-left: auto;
		margin-right: auto;
		margin-top: 10px;
		background-color: white;
		padding: 10px;
	}

	input[type='text'] { 
		width: 250px;
		float: right;
	}
	textarea {
		width: 100%;
		height: 200px;
	}
	
	body {
		background-color: #c0c0c0;;	
	}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="orderForm"&gt;	

	&lt;cfif showForm&gt;
		&lt;form method="post"&gt;
		
			&lt;h2&gt;Order Request / Kuat Drive Yards&lt;/h2&gt;
			
			&lt;p&gt;
				Thank you for your interest in ordering form Kuat Drive Yards. Please fill out the
				form below and be as complete as possible with your needs.
			&lt;/p&gt;
			
			&lt;cfoutput&gt;
			&lt;cfif structKeyExists(variables, "errors")&gt;
				&lt;p&gt;
					&lt;b&gt;Please correct these errors:&lt;br&gt;
					#errors#
					&lt;/b&gt;
				&lt;/p&gt;
			&lt;/cfif&gt;
			
			&lt;p&gt;
			&lt;label for="name"&gt;Your Name:&lt;/label&gt;
			&lt;input type="text" name="name" id="name" value="#form.name#"&gt;&lt;br/&gt;
			&lt;/p&gt;
			
			&lt;p&gt;
			&lt;label for="email"&gt;Your Email:&lt;/label&gt;
			&lt;input type="text" name="email" id="email" value="#form.email#"&gt;&lt;br/&gt;
			&lt;/p&gt;
			
			&lt;p&gt;
			&lt;label for="orderrequest"&gt;Your Request:&lt;/label&gt;&lt;br/&gt;
			&lt;textarea name="orderrequest" id="orderrequest"&gt;#form.orderrequest#&lt;/textarea&gt;
			&lt;/p&gt;
			
			&lt;/cfoutput&gt;
			&lt;p&gt;
			&lt;input type="submit" name="submit" value="Send Request"&gt;
			&lt;/p&gt;
		&lt;/form&gt;
		
	&lt;cfelse&gt;
		&lt;h2&gt;Thank you&lt;/h2&gt;
		&lt;p&gt;
		Your order request has been received. Thank you.
		&lt;/p&gt;
	&lt;/cfif&gt;
	
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Frequest%{% endraw %}2Epdf'>Download attached file.</a></p>