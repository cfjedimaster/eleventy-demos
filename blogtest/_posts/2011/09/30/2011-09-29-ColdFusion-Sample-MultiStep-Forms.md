---
layout: post
title: "ColdFusion Sample - Multi-Step Forms"
date: "2011-09-30T10:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/09/30/ColdFusion-Sample-MultiStep-Forms
guid: 4377
---

The "ColdFusion Sample" series is a collection of blog entries that describe how to do common tasks in web development with ColdFusion. They are not meant to be the only solution, but simply one solution, presented in such a fashion that you can take the code and immediately use it (with modifications of course) in a production environment. For today's entry I'm going to demonstrate how to handle a multi-step form in ColdFusion. My example will be the fairly common checkout form seen on e-commerce sites. Multi-step forms <i>can</i> be done completely client side. For this entry though I'm going to rely on a simpler solution. One quick aside. I try like heck to keep my code samples as simple as possible. So for example, if I wanted to demonstrate how to output the current time in ColdFusion, I'm not going to bother with a 'complete' HTML page. While all of the extra HTML may make for a "Proper" HTML result, it's stupid to clutter up one line of CFML with 10 lines of HTML. That being said I decided to try out the <a href="http://twitter.github.com/bootstrap/">Bootstrap</a> toolkit to make my demo look a bit nicer. At the very end of this blog entry I'll have a few notes on Bootstrap and what I both liked and disliked.
<!--more-->
<p>

Before we get into the code, let's describe at a high level how we can handle a multi-step form. There a few different approaches:

<p>

<ol>
<li>Each step of the form is one HTML page. State data (what you entered already) is preserved in hidden form fields.
<li>Each step of the form is one HTML page. State data (what you entered already) is stored in a persistent server side scope unique to the user.
<li>The entire form is loaded onto the client and CSS/JS is used to show/hide one step at a time.
</ol>

<p>

In approach one, you have to ensure that you store the previous data in hidden form fields. This can be get cumbersome especially after a few steps. I already mentioned that we weren't going to cover the completely client-side approach. So for this demo, we will make use of ColdFusion's Session scope. Let's then begin with our Application.cfc file:

<p>

<code>
component {
	this.name="formdemo";
	this.sessionManagement="true";
	
	public void function onSessionEnd(sessionScope,appScope) {
		//consider logging an incomplete form
	}
	
}
</code>

<p>

Two things I want to point out here. First, notice I'm not using onSessionStart. You may be thinking, "Don't we want to default some data for the form?" We may. But - in a complete web site, you can't assume all users are going to actually perform a check out. Therefore we will only setup the data when we need to. Secondly - what about the empty onSessionEnd? This is purely a reminder about the fact that you <b>can run</b> things on a session expiring. I've <a href="http://www.raymondcamden.com/index.cfm/2006/10/20/How-ColdFusion-can-save-you-business">blogged/preached</a> about this feature before and I truly don't think it is used often enough. Now let's move on to the first step.

<p>

<h2>step1.cfm</h2>
<code>
&lt;!---
Initial check to see if we have a core structure to store our data.
---&gt;
&lt;cfif not structKeyExists(session, "checkout")&gt;
	&lt;cfset session.checkout = {}&gt;
&lt;/cfif&gt;
&lt;!--- initial defaults for the first section ---&gt;
&lt;cfif not structKeyExists(session.checkout, "bio")&gt;
	&lt;cfset session.checkout.bio = {% raw %}{firstname="", lastname="", email=""}{% endraw %}&gt;
&lt;/cfif&gt;

&lt;!--- form fields will default according to session values ---&gt;
&lt;cfparam name="form.firstname" default="#session.checkout.bio.firstname#"&gt;
&lt;cfparam name="form.lastname" default="#session.checkout.bio.lastname#"&gt;
&lt;cfparam name="form.email" default="#session.checkout.bio.email#"&gt;

&lt;cfif structKeyExists(form, "submit")&gt;

	&lt;cfset errors = []&gt;
	&lt;cfset form.firstname = trim(htmlEditFormat(form.firstname))&gt;
	&lt;cfset form.lastname = trim(htmlEditFormat(form.lastname))&gt;
	&lt;cfset form.email = trim(htmlEditFormat(form.email))&gt;
	&lt;cfif not len(form.firstname)&gt;
		&lt;cfset arrayAppend(errors, "First name is empty.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.lastname)&gt;
		&lt;cfset arrayAppend(errors, "Last name is empty.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.email) or not isValid("email", form.email)&gt;
		&lt;cfset arrayAppend(errors, "Email is empty or not correct.")&gt;
	&lt;/cfif&gt;

	&lt;cfif not arrayLen(errors)&gt;
		&lt;cfset session.checkout.bio = {firstname=form.firstname, 
									   lastname=form.lastname,
									   email=form.email}&gt;
		&lt;cflocation url="step2.cfm" addToken="false"&gt;
	&lt;/cfif&gt;

&lt;/cfif&gt;

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Check Out Form - Step 1&lt;/title&gt;
	&lt;meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1" /&gt;	
	&lt;link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.3.0/bootstrap.min.css"&gt;
	&lt;script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://twitter.github.com/bootstrap/1.3.0/bootstrap-alerts.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;

	&lt;div class="container"&gt;

		&lt;h1&gt;Step 1: Your Name&lt;/h1&gt;
		
		&lt;cfif structKeyExists(variables, "errors")&gt;
			&lt;div class="alert-message block-message error" data-alert="alert"&gt;
			&lt;a class="close" href="#"&gt;&times;&lt;/a&gt;
			&lt;p&gt;&lt;strong&gt;Oh snap! You got an error!&lt;/strong&gt;&lt;/p&gt;
			&lt;ul&gt;
			&lt;cfloop index="error" array="#errors#"&gt;
				&lt;cfoutput&gt;
				&lt;li&gt;#error#&lt;/li&gt;
				&lt;/cfoutput&gt;
			&lt;/cfloop&gt;
			&lt;/ul&gt;
			&lt;/div&gt;
		&lt;/cfif&gt;

		&lt;form method="post"&gt;
		&lt;cfoutput&gt;
		&lt;div class="clearfix"&gt;
			&lt;label for="firstname"&gt;Your Name:&lt;/label&gt;
			&lt;div class="input"&gt;
				&lt;input type="text" name="firstname" id="firstname" placeholder="First" value="#form.firstname#"&gt;
				&lt;input type="text" name="lastname" id="lastname" placeholder="Last" value="#form.lastname#"&gt;
			&lt;/div&gt;
		&lt;/div&gt;
		
		&lt;div class="clearfix"&gt;
			&lt;label for="email"&gt;Your Email Address:&lt;/label&gt;
			&lt;div class="input"&gt;
				&lt;input type="email" name="email" id="email" value="#form.email#"&gt;
			&lt;/div&gt;
		&lt;/div&gt;
		&lt;/cfoutput&gt;

		&lt;div class="actions"&gt;
			&lt;input type="submit" class="btn primary" name="submit" value="Save"&gt;
		&lt;/div&gt;
		  
		&lt;/form&gt;
		
	&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Ok, we've got a lot going on here so let's approach this at a high level (ie, not just top to bottom). I will, though, point out the top of the file handles some start up logic necessary for the process. I begin by initializing a checkout structure. This is going to hold all of the data for the entire process. Next, I default a structure just for this step. I've named it bio and it includes three keys.

<p>

The file is a self-posting form. What that means is that when you hit submit, it's going to send the FORM data to itself. This makes handling errors a lot simpler. In the bottom half of the page you can see our form consists of 3 fields: 2 for our name and one for an email address. If you go back up towards the top, you can see my form validation. This by itself shouldn't be new. But pay attention to what we do when no errors exist. We copy the value to the session scope, specifically session.checkout.bio, and then use cflocation to move to the next step. Now let's look at step 2.

<p>

<h2>step2.cfm</h2>
<code>
&lt;!---
If no checkout, send them to step 1
---&gt;
&lt;cfif not structKeyExists(session, "checkout")&gt;
	&lt;cflocation url="step1.cfm" addToken="false"&gt;
&lt;/cfif&gt;
&lt;!--- initial defaults for the section ---&gt;
&lt;cfif not structKeyExists(session.checkout, "address")&gt;
	&lt;cfset session.checkout.address = {% raw %}{street="", city="", state="", postal=""}{% endraw %}&gt;
&lt;/cfif&gt;

&lt;!--- form fields will default according to session values ---&gt;
&lt;cfparam name="form.street" default="#session.checkout.address.street#"&gt;
&lt;cfparam name="form.city" default="#session.checkout.address.city#"&gt;
&lt;cfparam name="form.state" default="#session.checkout.address.state#"&gt;
&lt;cfparam name="form.postal" default="#session.checkout.address.postal#"&gt;

&lt;cfif structKeyExists(form, "submit")&gt;

	&lt;cfset errors = []&gt;
	&lt;cfset form.street = trim(htmlEditFormat(form.street))&gt;
	&lt;cfset form.city = trim(htmlEditFormat(form.city))&gt;
	&lt;cfset form.state = trim(htmlEditFormat(form.state))&gt;
	&lt;cfset form.postal = trim(htmlEditFormat(form.postal))&gt;

	&lt;cfif not len(form.street)&gt;
		&lt;cfset arrayAppend(errors, "Street is empty.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.city)&gt;
		&lt;cfset arrayAppend(errors, "City is empty.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.state)&gt;
		&lt;cfset arrayAppend(errors, "State is empty.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.postal) or not isValid("zipcode", form.postal)&gt;
		&lt;cfset arrayAppend(errors, "Postal code is empty or not correct.")&gt;
	&lt;/cfif&gt;

	&lt;cfif not arrayLen(errors)&gt;
		&lt;cfset session.checkout.address = {street=form.street, 
									   city=form.city,
									   state=form.state,
									   postal=form.postal}&gt;
		&lt;cflocation url="step3.cfm" addToken="false"&gt;
	&lt;/cfif&gt;

&lt;/cfif&gt;

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Check Out Form - Step 2&lt;/title&gt;
	&lt;meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1" /&gt;	
	&lt;link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.3.0/bootstrap.min.css"&gt;
	&lt;script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://twitter.github.com/bootstrap/1.3.0/bootstrap-alerts.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;

	&lt;div class="container"&gt;

		&lt;h1&gt;Step 2: Your Address&lt;/h1&gt;
		
		&lt;cfif structKeyExists(variables, "errors")&gt;
			&lt;div class="alert-message block-message error" data-alert="alert"&gt;
			&lt;a class="close" href="#"&gt;&times;&lt;/a&gt;
			&lt;p&gt;&lt;strong&gt;Oh snap! You got an error!&lt;/strong&gt;&lt;/p&gt;
			&lt;ul&gt;
			&lt;cfloop index="error" array="#errors#"&gt;
				&lt;cfoutput&gt;
				&lt;li&gt;#error#&lt;/li&gt;
				&lt;/cfoutput&gt;
			&lt;/cfloop&gt;
			&lt;/ul&gt;
			&lt;/div&gt;
		&lt;/cfif&gt;

		&lt;form method="post"&gt;
		&lt;cfoutput&gt;
		&lt;div class="clearfix"&gt;
			&lt;label for="street"&gt;Your Street:&lt;/label&gt;
			&lt;div class="input"&gt;
				&lt;input type="text" name="street" id="street" value="#form.street#"&gt;
			&lt;/div&gt;
		&lt;/div&gt;
		
		&lt;div class="clearfix"&gt;
			&lt;label for="city"&gt;Your City:&lt;/label&gt;
			&lt;div class="input"&gt;
				&lt;input type="text" name="city" id="city" value="#form.city#"&gt;
			&lt;/div&gt;
		&lt;/div&gt;

		&lt;div class="clearfix"&gt;
			&lt;label for="state"&gt;Your State:&lt;/label&gt;
			&lt;div class="input"&gt;
				&lt;cfinclude template="states.cfm"&gt;
			&lt;/div&gt;
		&lt;/div&gt;

		&lt;div class="clearfix"&gt;
			&lt;label for="street"&gt;Your Postal Code:&lt;/label&gt;
			&lt;div class="input"&gt;
				&lt;input type="text" name="postal" id="postal" value="#form.postal#"&gt;
			&lt;/div&gt;
		&lt;/div&gt;

		&lt;/cfoutput&gt;

		&lt;div class="actions"&gt;
			&lt;input type="submit" class="btn primary" name="submit" value="Save"&gt;
		&lt;/div&gt;
		  
		&lt;/form&gt;
		
	&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

For the most part, this template follows the flow of the previous one, but notice that the very beginning of the file checks to see if the checkout structure exists. If it doesn't, then we want to push the user back to step 1. All of the next few steps will follow this exact same logic. Outside of that though nothing else is different. Step 2 deals with the address so I use the "location" of session.checkout.address. The fields here are different, but the flow is the same. Step 3 is the <b>exact</b> same but with shipping data instead.

<p>

<h2>step3.cfm</h2>
<code>
&lt;!---
If no checkout, send them to step 1
---&gt;
&lt;cfif not structKeyExists(session, "checkout")&gt;
	&lt;cflocation url="step1.cfm" addToken="false"&gt;
&lt;/cfif&gt;
&lt;!--- initial defaults for the section ---&gt;
&lt;cfif not structKeyExists(session.checkout, "shippingaddress")&gt;
	&lt;cfset session.checkout.shippingaddress = {% raw %}{street="", city="", state="", postal=""}{% endraw %}&gt;
&lt;/cfif&gt;

&lt;!--- form fields will default according to session values ---&gt;
&lt;cfparam name="form.street" default="#session.checkout.shippingaddress.street#"&gt;
&lt;cfparam name="form.city" default="#session.checkout.shippingaddress.city#"&gt;
&lt;cfparam name="form.state" default="#session.checkout.shippingaddress.state#"&gt;
&lt;cfparam name="form.postal" default="#session.checkout.shippingaddress.postal#"&gt;

&lt;cfif structKeyExists(form, "submit")&gt;

	&lt;cfset errors = []&gt;
	&lt;cfset form.street = trim(htmlEditFormat(form.street))&gt;
	&lt;cfset form.city = trim(htmlEditFormat(form.city))&gt;
	&lt;cfset form.state = trim(htmlEditFormat(form.state))&gt;
	&lt;cfset form.postal = trim(htmlEditFormat(form.postal))&gt;

	&lt;cfif not len(form.street)&gt;
		&lt;cfset arrayAppend(errors, "Street is empty.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.city)&gt;
		&lt;cfset arrayAppend(errors, "City is empty.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.state)&gt;
		&lt;cfset arrayAppend(errors, "State is empty.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.postal) or not isValid("zipcode", form.postal)&gt;
		&lt;cfset arrayAppend(errors, "Postal code is empty or not correct.")&gt;
	&lt;/cfif&gt;

	&lt;cfif not arrayLen(errors)&gt;
		&lt;cfset session.checkout.shippingaddress = {street=form.street, 
									   city=form.city,
									   state=form.state,
									   postal=form.postal}&gt;
		&lt;cflocation url="step4.cfm" addToken="false"&gt;
	&lt;/cfif&gt;

&lt;/cfif&gt;

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Check Out Form - Step 3&lt;/title&gt;
	&lt;meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1" /&gt;	
	&lt;link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.3.0/bootstrap.min.css"&gt;
	&lt;script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://twitter.github.com/bootstrap/1.3.0/bootstrap-alerts.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;

	&lt;div class="container"&gt;

		&lt;h1&gt;Step 3: Your Shipping Address&lt;/h1&gt;
		
		&lt;cfif structKeyExists(variables, "errors")&gt;
			&lt;div class="alert-message block-message error" data-alert="alert"&gt;
			&lt;a class="close" href="#"&gt;&times;&lt;/a&gt;
			&lt;p&gt;&lt;strong&gt;Oh snap! You got an error!&lt;/strong&gt;&lt;/p&gt;
			&lt;ul&gt;
			&lt;cfloop index="error" array="#errors#"&gt;
				&lt;cfoutput&gt;
				&lt;li&gt;#error#&lt;/li&gt;
				&lt;/cfoutput&gt;
			&lt;/cfloop&gt;
			&lt;/ul&gt;
			&lt;/div&gt;
		&lt;/cfif&gt;

		&lt;form method="post"&gt;
		&lt;cfoutput&gt;
		&lt;div class="clearfix"&gt;
			&lt;label for="street"&gt;Your Street:&lt;/label&gt;
			&lt;div class="input"&gt;
				&lt;input type="text" name="street" id="street" value="#form.street#"&gt;
			&lt;/div&gt;
		&lt;/div&gt;
		
		&lt;div class="clearfix"&gt;
			&lt;label for="city"&gt;Your City:&lt;/label&gt;
			&lt;div class="input"&gt;
				&lt;input type="text" name="city" id="city" value="#form.city#"&gt;
			&lt;/div&gt;
		&lt;/div&gt;

		&lt;div class="clearfix"&gt;
			&lt;label for="state"&gt;Your State:&lt;/label&gt;
			&lt;div class="input"&gt;
				&lt;cfinclude template="states.cfm"&gt;
			&lt;/div&gt;
		&lt;/div&gt;

		&lt;div class="clearfix"&gt;
			&lt;label for="street"&gt;Your Postal Code:&lt;/label&gt;
			&lt;div class="input"&gt;
				&lt;input type="text" name="postal" id="postal" value="#form.postal#"&gt;
			&lt;/div&gt;
		&lt;/div&gt;

		&lt;/cfoutput&gt;

		&lt;div class="actions"&gt;
			&lt;input type="submit" class="btn primary" name="submit" value="Save"&gt;
		&lt;/div&gt;
		  
		&lt;/form&gt;
		
	&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

And here is our 4th step, the one that handles credit card data.

<p>

<h2>step4.cfm</h2>
<code>
&lt;!---
If no checkout, send them to step 1
---&gt;
&lt;cfif not structKeyExists(session, "checkout")&gt;
	&lt;cflocation url="step1.cfm" addToken="false"&gt;
&lt;/cfif&gt;
&lt;!--- initial defaults for the section ---&gt;
&lt;cfif not structKeyExists(session.checkout, "ccinfo")&gt;
	&lt;cfset session.checkout.ccinfo = {% raw %}{number="", name="", expmonth="", expyear=""}{% endraw %}&gt;
&lt;/cfif&gt;

&lt;!--- form fields will default according to session values ---&gt;
&lt;cfparam name="form.number" default="#session.checkout.ccinfo.number#"&gt;
&lt;cfparam name="form.name" default="#session.checkout.ccinfo.name#"&gt;
&lt;cfparam name="form.expmonth" default="#session.checkout.ccinfo.expmonth#"&gt;
&lt;cfparam name="form.expyear" default="#session.checkout.ccinfo.expyear#"&gt;

&lt;cfif structKeyExists(form, "submit")&gt;

	&lt;cfset errors = []&gt;
	&lt;cfset form.number = trim(htmlEditFormat(form.number))&gt;
	&lt;cfset form.name = trim(htmlEditFormat(form.name))&gt;
	&lt;cfset form.expmonth = trim(htmlEditFormat(form.expmonth))&gt;
	&lt;cfset form.expyear = trim(htmlEditFormat(form.expyear))&gt;

	&lt;cfif not len(form.number) or not isValid("creditcard" ,form.number)&gt;
		&lt;cfset arrayAppend(errors, "Credit card number is empty.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.name)&gt;
		&lt;cfset arrayAppend(errors, "Name on credit card is empty.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.expmonth)&gt;
		&lt;cfset arrayAppend(errors, "Expiration month not selected.")&gt;
	&lt;/cfif&gt;
	&lt;cfif not len(form.expyear)&gt;
		&lt;cfset arrayAppend(errors, "Expiration year not selected.")&gt;
	&lt;/cfif&gt;
	&lt;cfif len(form.expyear) and len(form.expmonth) and form.expyear is year(now()) and form.expmonth lt month(now())&gt;
		&lt;cfset arrayAppend(errors, "Credit card expiration is in the past.")&gt;
	&lt;/cfif&gt;
	
	&lt;cfif not arrayLen(errors)&gt;
		&lt;cfset session.checkout.ccinfo = {number=form.number, 
									   name=form.name,
									   expmonth=form.expmonth,
									   expyear=form.expyear}&gt;
		&lt;cflocation url="step5.cfm" addToken="false"&gt;
	&lt;/cfif&gt;

&lt;/cfif&gt;

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Check Out Form - Step 4&lt;/title&gt;
	&lt;meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1" /&gt;	
	&lt;link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.3.0/bootstrap.min.css"&gt;
	&lt;script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://twitter.github.com/bootstrap/1.3.0/bootstrap-alerts.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;

	&lt;div class="container"&gt;

		&lt;h1&gt;Step 4: Your Credit Card&lt;/h1&gt;
		
		&lt;cfif structKeyExists(variables, "errors")&gt;
			&lt;div class="alert-message block-message error" data-alert="alert"&gt;
			&lt;a class="close" href="#"&gt;&times;&lt;/a&gt;
			&lt;p&gt;&lt;strong&gt;Oh snap! You got an error!&lt;/strong&gt;&lt;/p&gt;
			&lt;ul&gt;
			&lt;cfloop index="error" array="#errors#"&gt;
				&lt;cfoutput&gt;
				&lt;li&gt;#error#&lt;/li&gt;
				&lt;/cfoutput&gt;
			&lt;/cfloop&gt;
			&lt;/ul&gt;
			&lt;/div&gt;
		&lt;/cfif&gt;

		&lt;form method="post"&gt;
		&lt;cfoutput&gt;
		&lt;div class="clearfix"&gt;
			&lt;label for="number"&gt;Your Credit Card Number:&lt;/label&gt;
			&lt;div class="input"&gt;
				&lt;input type="text" name="number" id="number" value="#form.number#"&gt;
			&lt;/div&gt;
		&lt;/div&gt;
		
		&lt;div class="clearfix"&gt;
			&lt;label for="name"&gt;Name on Credit Card:&lt;/label&gt;
			&lt;div class="input"&gt;
				&lt;input type="text" name="name" id="name" value="#form.name#"&gt;
			&lt;/div&gt;
		&lt;/div&gt;

		&lt;div class="clearfix"&gt;
			&lt;label for="expmonth"&gt;CC Expiration:&lt;/label&gt;
			&lt;div class="input"&gt;
				&lt;select class="small" name="expmonth" id="expmonth"&gt;
					&lt;cfloop index="x" from="1" to="12"&gt;
						&lt;option value="#x#" &lt;cfif form.expmonth is x&gt;selected&lt;/cfif&gt;&gt;#monthAsString(x)#&lt;/option&gt;
					&lt;/cfloop&gt;
				&lt;/select&gt;
				&lt;select class="small" name="expyear" id="expyear"&gt;
					&lt;cfloop index="x" from="#year(now())#" to="#year(now())+10#"&gt;
						&lt;option value="#x#" &lt;cfif form.expyear is x&gt;selected&lt;/cfif&gt;&gt;#x#&lt;/option&gt;
					&lt;/cfloop&gt;
				&lt;/select&gt;
			&lt;/div&gt;
		&lt;/div&gt;


		&lt;/cfoutput&gt;

		&lt;div class="actions"&gt;
			&lt;input type="submit" class="btn primary" name="submit" value="Save"&gt;
		&lt;/div&gt;
		  
		&lt;/form&gt;
		
	&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

Now let's look at step5 - the confirmation page. This one is pretty simple since there isn't really a form involved. I did keep a form in the page though so the user has to do a real form submission to move on. Notice I provide links back to the earlier steps. 

<p>

<h2>step5.cfm</h2>
<code>
&lt;!---
If no checkout, send them to step 1
---&gt;
&lt;cfif not structKeyExists(session, "checkout")&gt;
	&lt;cflocation url="step1.cfm" addToken="false"&gt;
&lt;/cfif&gt;

&lt;cfscript&gt;
/**
 * Escapes a credit card number, showing only the last 4 digits. The other digits are replaced with the * character.
 * return just stars if str too short, found by Tony Monast
 * 
 * @param ccnum 	 Credit card number you want to escape. (Required)
 * @return Returns a string. 
 * @author Joshua Miller (&#106;&#111;&#115;&#104;&#64;&#106;&#111;&#115;&#104;&#117;&#97;&#115;&#109;&#105;&#108;&#108;&#101;&#114;&#46;&#99;&#111;&#109;) 
 * @version 2, April 26, 2009 
 */
function ccEscape(ccnum){
	if(len(ccnum) lte 4) return "****";
	return "#RepeatString("*",val(Len(ccnum)-4))##Right(ccnum,4)#";
}
&lt;/cfscript&gt;

&lt;cfif structKeyExists(form, "submit")&gt;

	&lt;!--- do something ---&gt;
	&lt;!--- clear info ---&gt;
	&lt;cfset session.checkout = {}&gt;
	&lt;cflocation url="step6.cfm" addToken="false"&gt;

&lt;/cfif&gt;

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Check Out Form - Step 5&lt;/title&gt;
	&lt;meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1" /&gt;	
	&lt;link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.3.0/bootstrap.min.css"&gt;
	&lt;script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://twitter.github.com/bootstrap/1.3.0/bootstrap-alerts.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;

	&lt;div class="container"&gt;

		&lt;h1&gt;Step 5: Confirm&lt;/h1&gt;
		
		&lt;cfif structKeyExists(variables, "errors")&gt;
			&lt;div class="alert-message block-message error" data-alert="alert"&gt;
			&lt;a class="close" href="#"&gt;&times;&lt;/a&gt;
			&lt;p&gt;&lt;strong&gt;Oh snap! You got an error!&lt;/strong&gt;&lt;/p&gt;
			&lt;ul&gt;
			&lt;cfloop index="error" array="#errors#"&gt;
				&lt;cfoutput&gt;
				&lt;li&gt;#error#&lt;/li&gt;
				&lt;/cfoutput&gt;
			&lt;/cfloop&gt;
			&lt;/ul&gt;
			&lt;/div&gt;
		&lt;/cfif&gt;

		&lt;cfoutput&gt;		
		&lt;h2&gt;You&lt;/h2&gt;
		&lt;div class="row"&gt;
			&lt;div class="span2"&gt;
				Name:
			&lt;/div&gt;
			&lt;div class="span6"&gt;
				#session.checkout.bio.firstname# #session.checkout.bio.lastname#
			&lt;/div&gt;	
		&lt;/div&gt;
		&lt;div class="row"&gt;
			&lt;div class="span2"&gt;
				Email:
			&lt;/div&gt;
			&lt;div class="span6"&gt;
				#session.checkout.bio.email#
			&lt;/div&gt;	
		&lt;/div&gt;
		
		&lt;p&gt;
		&lt;a href="step1.cfm"&gt;[Return to Step 1]&lt;/a&gt;
		&lt;/p&gt;
		
		&lt;h2&gt;Your Address&lt;/h2&gt;
		&lt;address&gt;
		#session.checkout.address.street#&lt;br/&gt;
		#session.checkout.address.city#, #session.checkout.address.state# #session.checkout.address.postal#
		&lt;/address&gt;

		&lt;p&gt;
		&lt;a href="step2.cfm"&gt;[Return to Step 2]&lt;/a&gt;
		&lt;/p&gt;

		&lt;h2&gt;Your Shipping Address&lt;/h2&gt;
		&lt;address&gt;
		#session.checkout.shippingaddress.street#&lt;br/&gt;
		#session.checkout.shippingaddress.city#, #session.checkout.shippingaddress.state# #session.checkout.shippingaddress.postal#
		&lt;/address&gt;

		&lt;p&gt;
		&lt;a href="step3.cfm"&gt;[Return to Step 3]&lt;/a&gt;
		&lt;/p&gt;

		&lt;h2&gt;Your Credit Card&lt;/h2&gt;
		&lt;div class="row"&gt;
			&lt;div class="span2"&gt;
				Number:
			&lt;/div&gt;
			&lt;div class="span6"&gt;
				#ccEscape(session.checkout.ccinfo.number)#
			&lt;/div&gt;	
		&lt;/div&gt;
		&lt;div class="row"&gt;
			&lt;div class="span2"&gt;
				Name on Card:
			&lt;/div&gt;
			&lt;div class="span6"&gt;
				#session.checkout.ccinfo.name#
			&lt;/div&gt;	
		&lt;/div&gt;
		&lt;div class="row"&gt;
			&lt;div class="span2"&gt;
				Expired:
			&lt;/div&gt;
			&lt;div class="span6"&gt;
				#session.checkout.ccinfo.expmonth#/#session.checkout.ccinfo.expyear#
			&lt;/div&gt;	
		&lt;/div&gt;
		
		&lt;p&gt;
		&lt;a href="step4.cfm"&gt;[Return to Step 4]&lt;/a&gt;
		&lt;/p&gt;
		
		&lt;/cfoutput&gt;
		
		&lt;form method="post"&gt;

		&lt;div class="actions"&gt;
			&lt;input type="submit" class="btn primary" name="submit" value="Checkout"&gt;
		&lt;/div&gt;
		  
		&lt;/form&gt;
		
	&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

All in all, not much to it, right? Most of the code so far really has been the HTML. The final step is really just a thank you page. I'll include it here for completeness sake.

<p>

<h2>step6.cfm</h2>
<code>

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Check Out Form - Step 1&lt;/title&gt;
	&lt;meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1" /&gt;	
	&lt;link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.3.0/bootstrap.min.css"&gt;
	&lt;script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script src="http://twitter.github.com/bootstrap/1.3.0/bootstrap-alerts.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;

	&lt;div class="container"&gt;

		&lt;h1&gt;Thank You&lt;/h1&gt;
		
		&lt;p&gt;
Prosciutto drumstick tri-tip brisket flank meatball shank capicola. Turkey cow shankle pork chop tail, tenderloin strip steak pastrami ball tip meatball capicola ham. Pig meatloaf pork chop bresaola t-bone. Shankle pork chop chuck kielbasa ham hock, cow ball tip tongue prosciutto filet mignon beef biltong meatball. Ground round sirloin turkey turducken, chuck fatback flank jerky bresaola beef. Bresaola spare ribs pancetta, flank beef ribeye ground round pastrami chicken pork loin rump turducken. Salami turkey drumstick, shoulder pork chop shankle jerky prosciutto leberkäse beef t-bone brisket short loin.
		&lt;/p&gt;
				
	&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

You can try this code by hitting the big demo button below. For a credit card number, use 4111111111111111. I did not post the code for the states include but I've attached all the code as a zip to this blog entry.

<p>

<a href="http://www.coldfusionjedi.com/demos/sep302011/step1.cfm"><img src="https://static.raymondcamden.com/images/cfjedi/icon_128.png" title="Demo, Baby" border="0"></a>

<p>

Finally, some notes on the Bootstrap framework. I really like it a lot. It was pretty easy to make my pages look a <b>hell</b> of a lot better than they normally do. I do wish they had proper documentation. I know I can view source to see how they built stuff, but it would be nice to have it on screen too while looking at the demos. Also, some things are missing. So for example, they demonstrate a normal and medium sized select. I guessed that there was a small one and I was right, but why not - you know - document it so you don't have to guess?<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fformdemo1%{% endraw %}2Ezip'>Download attached file.</a></p>