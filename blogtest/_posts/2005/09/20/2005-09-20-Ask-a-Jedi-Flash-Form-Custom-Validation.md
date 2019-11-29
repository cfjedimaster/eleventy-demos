---
layout: post
title: "Ask a Jedi: Flash Form Custom Validation"
date: "2005-09-20T18:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2005/09/20/Ask-a-Jedi-Flash-Form-Custom-Validation
guid: 792
---

A reader asks:

<blockquote>
Ray, any easy way to do custom validation of Flash forms on submit (like making sure password and confirmPassword are the same)? And how to "inject" the appropriate message into the Flash validation pop-ups?
</blockquote>

Part of the answer is rather simple. Flash Forms support an onSubmit call. You can then run ActionScript code to do whatever you want. Here is a simple example:

<div class="code"><FONT COLOR=MAROON>&lt;cfsavecontent variable=<FONT COLOR=BLUE>"verify"</FONT>&gt;</FONT><br>
if(password.text != password2.text) {<br>
&nbsp;&nbsp;&nbsp;mx.controls.Alert.show('Password and Confirmation Password do not match!','Error');<br>
&nbsp;&nbsp;&nbsp;return false;<br>
} <br>
return true;<br>
<FONT COLOR=MAROON>&lt;/cfsavecontent&gt;</FONT><br>
<br>
<FONT COLOR=MAROON>&lt;cfform format=<FONT COLOR=BLUE>"flash"</FONT> name=<FONT COLOR=BLUE>"test"</FONT> width=<FONT COLOR=BLUE>"400"</FONT> onSubmit=<FONT COLOR=BLUE>"#verify#"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"text"</FONT> name=<FONT COLOR=BLUE>"name"</FONT> required=<FONT COLOR=BLUE>"true"</FONT> message=<FONT COLOR=BLUE>"Enter your name!"</FONT> label=<FONT COLOR=BLUE>"Name"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"password"</FONT> name=<FONT COLOR=BLUE>"password"</FONT> required=<FONT COLOR=BLUE>"true"</FONT> message=<FONT COLOR=BLUE>"Enter your password!"</FONT> label=<FONT COLOR=BLUE>"Password"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"password"</FONT> name=<FONT COLOR=BLUE>"password2"</FONT> required=<FONT COLOR=BLUE>"true"</FONT> message=<FONT COLOR=BLUE>"Enter your confirmation password!"</FONT> label=<FONT COLOR=BLUE>"Confirm Password"</FONT>&gt;</FONT><br>
&nbsp;&nbsp;&nbsp;<FONT COLOR=MAROON>&lt;cfinput type=<FONT COLOR=BLUE>"submit"</FONT> name=<FONT COLOR=BLUE>"submit"</FONT> value=<FONT COLOR=BLUE>"Save"</FONT>&gt;</FONT><br>
<FONT COLOR=MAROON>&lt;/cfform&gt;</FONT></div>

In this example, when the submit button is pushed, we check to see if the password and the confirmation password match up. If not, we use an Alert box to show a message. This is <b>not</b> the exact same popup as the built-in Flash Forms errors, but it is close enough. (I bet the smart cookies over at <a href="http://www.asfusion.com">ASFusion.com</a> know how to do that.) Obviously you would change the AS code to match the custom validation you require.