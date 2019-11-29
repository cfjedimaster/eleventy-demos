---
layout: post
title: "Removing an error flag from a form field in Flex"
date: "2007-02-06T15:02:00+06:00"
categories: [flex]
tags: []
banner_image: 
permalink: /2007/02/06/Removing-an-error-flag-from-a-form-field-in-Flex
guid: 1821
---

Today I ran into a situation where I needed to clear the error flag from a form field in Flex. My code uses a datagrid to present a list of items to edit. You could click to edit an item, or click an Add button to add a new item.
<!--more-->
I ran into a problem though. If I clicked to edit a field, hit cancel, and then hit Add, I was seeing the values from the previous edit in the form field. Well that was easy enough. I added this to my cancel operation:

<code>
username.text = '';
password.text = '';
firstname.text = '';
lastname.text = '';
email.text = '';
</code>

This worked, but when I returned to add an item, the form was displaying red borders around each field. My code to set the form items to empty strings was also triggering the form validation.

I did a bit of looking around in the API and couldn't find a simple way to "reset" the validators I had applied to my form. Turns out I found a solution on Adobe: <a href="http://www.adobe.com/devnet/flex/quickstart/validating_data/">Flex Quick Starts: Validating Data</a>. 

Turns out you can manually change a property on the text field. If you set errorString to an empty string, the red "You messed up" border goes away:

<code>
username.text = '';
username.errorString = '';
password.text = '';
password.errorString = '';
firstname.text = '';
firstname.errorString = '';
lastname.text = '';
lastname.errorString = '';
email.text = '';
email.errorString = '';
</code>

Feels a little hackish to me. Anyone know a nicer way?