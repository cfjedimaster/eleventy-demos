---
layout: post
title: "Does your form validation need to be less strict?"
date: "2008-06-30T19:07:00+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2008/06/30/Does-your-form-validation-need-to-be-less-strict
guid: 2906
---

I ran across an interesting issue with gmail this morning. I was logging into my Broadchoice hosted mail account. Those of you who use Gmail for your hosted mail know that the form looks something like so:

Username:<br />
input text field here<br />
@broadchoice.com<br />
Password:

Note line 3 above. Below the text field for your username is @broadchoice.com, or @yourhost.com. This is implying that you should enter your username only and not the full email address.

Being early in the morning (and still suffering with a sinus infection) I accidentally typed in my full email address. I got an error back stating that my username could not include any symbols or other characters.

Wouldn't it have been nice (and relatively simple) for gmail to say "Your username included the hostname for the account, I'll just strip that out." 

Do folks do this? Is this a good idea? I'd be willing to bet that folks do that (by accident) quite a bit.

The only example I know of within my code is for BlogCFC and the comment box. When you add a comment you have the option to enter a URL. I write "http://" in the field so you don't have to worry about entering it in. At the same time, I don't bother validating if the field still reads "http://". It's nicer than forcing the user to delete the field if they have no intention of using it.