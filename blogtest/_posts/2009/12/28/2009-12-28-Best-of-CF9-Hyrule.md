---
layout: post
title: "Best of CF9: Hyrule"
date: "2009-12-28T23:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/28/Best-of-CF9-Hyrule
guid: 3667
---

<img src="https://static.raymondcamden.com/images/cfjedi/bestcfcontest1.jpg" title="Best of ColdFusion 9" align="left" style="margin-right:5px;margin-bottom:5px"/> Today's Best of ColdFusion 9 entry is <a href="http://hyrule.riaforge.org">Hyrule</a> from <a href="http://www.danvega.org/blog/">Dan Vega</a>. This entry is - to me - a slight break in the rules. It is an existing project and not something created brand new for the contest. I don't think I was specific in that regards and since the code is ColdFusion 9 specific and therefore pretty much new, I'm letting it slide here. Plus it has a Zelda-based name and therefore it must be cool.
<!--more-->
At it's heart, Hyrule is a validation framework. Now - I don't know about you - but one thing I've yet to really nail down in my development is a good way to do validation. I have a few different ways I do it in my applications, and I don't expect to have "One Right Way", but I would like to have a method that I feel confident in and that I use most of the time. I'm just not there yet. Hyrule looks to be a solution for that problem.

In his readme, Dan says that Hyrule is based off of both the <a href="http://quicksilver.riaforge.org/">QuickSilver</a> project and Hibernate Validation. Neither of those are projects I've been exposed to so I can't really comment on how well Hyrule implements them. 

Hyrule makes use of annotations. An annotation is a non-code based comment that is treated specially by either the server compiling the code or other code processes. Certain tags in ColdFusion, since the MX time frame, have allowed you to add additional arguments. So for example, your component tag can look like this:

<code>
&lt;cfcomponent name="Cobra Commander" snakevoice="true" egoOfARubyDev="true"&gt;
</code>

Now obviously those last two attributes aren't supported by ColdFusion, but if you run code like this you won't get an error. Instead, ColdFusion simply copies those arguments into the metadata about the component.

With the introduction of script based components in ColdFusion 9, we now have a new way of doing this. For example:

<code>
/**
 * @name "Cobra Commander"
 * @snakevoice true
 * @egoOfARubyDev true
 */
component {
</code>

So technically none of this is very useful. Some metadata items are used in documentation, but outside of that they really don't do anything. That's where Hyrule comes in. By following some basic rules, you can quickly add validation to a component. So for example, consider this simple User component (which comes from the nicely documented samples):

<code>
/**
 * @output false
 * @accessors true
 */
component {

	/**
	 * @display First Name
	 * @NotEmpty
	 */
	property string firstname;

	/**
	 * @display Last Name
	 * @NotEmpty
	 */
	property string lastname;

}
</code>

You can see that each of the two properties have a few comments above them. Each of these annotations will be picked up by Hyrule. Here is a quick example of running the validator against the component:

<code>
&lt;cfset user = new User()&gt;
&lt;cfset user.setFirstName("")&gt;
&lt;cfset user.setLastName("")&gt;
&lt;!--- create an instance of the hyrule framework ---&gt;
&lt;cfset hyrule = new hyrule.Validator()&gt;
&lt;!--- validate the object by passing it to the validate method ---&gt;
&lt;cfset hyrule.validate(user)&gt;
</code>

Once you've validated your component, you can then get the result:

<code>
&lt;!--- did this object have any errors ---&gt;
&lt;cfdump var="#hyrule.hasErrors()#"&gt;
&lt;!--- dump the errors array ---&gt;
&lt;cfdump var="#hyrule.getErrors()#"&gt;
</code>

The result:<br/><br/>
<img src="https://static.raymondcamden.com/images/cfjedi/Screen shot 2009-12-28 at 10.33.04 PM.png" /><br/><br/>

Pretty nifty. There is a long list of validators supported by Hyrule, including basic type checking (numeric for example), range checking, regex patterns, etc. And if you don't find a validator to your liking, you can actually create a custom one:

<code>
/**
* @custom hyrule.samples.custom.isUniqueUsername
*
*/
property username;
</code>

All in all, very slick. As a framework, it has the typical "installation" process of copying the folder. It then have one glaring fault - and this may already be fixed in the latest release. The code tries to load a resource bundle for error messages. That's nice because it means you can localize the errors. However, it uses a \. Line 34 of ValidatorMessage.cfc has:

<code>
	var rbPath = dir & "resources\" & getResourceBundle();
</code>

Repeat after me: <b>Stop using \.</b> / works just fine on Windows and Unix. If this isn't fixed in the latest version, simply replace the \ with a /, and next time you see Dan, tell him Ray said he has to buy you a beer. 

Ignoring that - everything works smoothly. I like the samples page - although I wish he would also show more of the code. So instead of just telling me about a feature and linking to a result, actually show the code you used to set up the validation. That would save me from having to open the CFC and look at the code directly.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fhyrule%{% endraw %}2Ezip'>Download attached file.</a></p>