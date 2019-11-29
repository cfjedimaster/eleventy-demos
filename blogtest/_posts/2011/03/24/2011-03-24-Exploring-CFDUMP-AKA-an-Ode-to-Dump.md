---
layout: post
title: "Exploring CFDUMP, AKA an Ode to Dump"
date: "2011-03-24T23:03:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2011/03/24/Exploring-CFDUMP-AKA-an-Ode-to-Dump
guid: 4170
---

It may be a bit silly to say that I have a favorite tag, but I'll happily admit to being somewhat infatuated with the cfdump tag. Since it's introduction (in ColdFusion 4.5 I believe, but it was available earlier in the Spectra CMS), it's probably been my number one debugging/testing/all around useful utility tag in the language for close to a decade. I thought it might be fun to talk a bit about some of the lesser known features of cfdump. In preparation for this blog entry I've already discovered a few new things myself, so hopefully this guide will be of use to folks and really prove, once and forever, that the coolest tag ever created is cfdump.
<!--more-->
<p>

Let's begin by looking at the bar minimum required for cfdump, the var attribute. This must be a ColdFusion variable. Not the name of a variable. (Although Railo supports passing the name of a variable.)

<p>

<code>
&lt;cfset x = [1,2,3]&gt;
&lt;cfdump var="#x#"&gt;
</code>

<p>

Which returns:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip54.png" />

<p>

This is probably the way most people use the tag. You can also easily dump built in scopes as well:

<p>

<code>
&lt;cfdump var="#url#"&gt;
&lt;cfdump var="#form#"&gt;
&lt;cfdump var="#cgi#"&gt;
&lt;cfdump var="#server#"&gt;
&lt;cfdump var="#cookie#"&gt;
etc...
</code>

<p>

You can also dump the result of calling a method or UDF. 

<p>

<code>
&lt;cfscript&gt;
function thatsHowIRoll(x) {
	return x*2;
}
&lt;/cfscript&gt;

&lt;cfdump var="#thatsHowIRoll(42)#"&gt;
</code>

<p>

Notice I didn't have to create a temporary variable. I can call the method right there in the tag and see the result. I might find something like this useful then:

<p>

<code>
&lt;cfdump var="#thatsHowIRoll(41)#"&gt;
&lt;cfdump var="#thatsHowIRoll(42)#"&gt;
&lt;cfdump var="#thatsHowIRoll(43)#"&gt;
</code>

<p>

Now let's start looking at some of the other attributes. The first is simple - label. The label attribute is used in the display of any non-simple variable. What does that mean? Whenever you dump anything that isn't a simple string, ColdFusion wraps it in some lovely tabular structures. Watch what happens when I apply a label to two variables - one complex, one simple.

<p>

<code>
&lt;cfset hawking = [1,2,{% raw %}{name="Ray",age="Almost my birthday"}{% endraw %},4]&gt;
&lt;cfset paris = "hilton"&gt;

&lt;cfdump var="#hawking#" label="Complex"&gt;
&lt;cfdump var="#paris#" label="Not so complex"&gt;
</code>

<p>

Which returns:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip55.png" />

<p>

As you can see, the label is really useful, especially if you have more than one thing you are dumping, but it will be ignored if the value is simple. You could get around that a bit:

<p>

<code>
&lt;cfdump var="Simple: #paris#"&gt;
</code>

<p>

This will simply prepend the paris value with a string that <i>kind</i> of acts like a label. Using cfdump for something you know is simple is overkill, but it's an option. 

<p>

Another display related attribute is expand. This dictates if the dump should be expanded (fully visible) or compressed. The default is true and normally there isn't much use in setting the value to false, but I've done that from time to time when I don't want the dump to "explode" over a page. Even if you don't use this value, you can click the header of a dump to compress or expand the display. The docs say this only works in Mozilla and Internet Explorer, but it works fine in Chrome and Safari as well. Here is an example of two dumps, one set to expand false.

<p>

<code>
&lt;cfset hawking = [1,2,{% raw %}{name="Ray",age="Almost my birthday"}{% endraw %},4]&gt;
&lt;cfset beer = ["good","really good", "not worth drinking"]&gt;

&lt;cfdump var="#hawking#" expand="false" label="Foo"&gt;
&lt;cfdump var="#beer#" label="Beer"&gt;
</code>

<p>

Which returns:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip56.png" />

<p>

One place where I make use of this is in <a href="http://groups.adobe.com">Adobe Groups</a>. When an error occurs in the publishing system, and you are logged in as an admin, I dump the error with expand="false" to keep the page layout somewhat like it should be. Like the label attribute, the expand attribute is ignored for simple values. 

<p>

Now let's look at probably the most important attribute - top. The top attribute allows you to restrict the amount of data returned. In a query, this number represents the number of rows to show. In a structure, it represents how deep to go. Let's look at examples of both, starting with a query.

<p>

<code>
&lt;cfquery name="getart" datasource="cfartgallery"&gt;
select 	*
from	art
&lt;/cfquery&gt;
&lt;cfdump var="#getart#" label="Art" top=3&gt;
</code>

<p>

Which returns:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip57.png" />

<p>

Notice the dump actually tells you it's filtered. Very handy in case you forget. While not documented, top works in arrays as well:

<p>

<code>
&lt;cfset a = [1,2,4,8,16,32]&gt;
&lt;cfdump var="#a#" top=4&gt;
</code>

<p>

Which oddly does <i>not</i> report the filter:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip58.png" />

<p>

And here is a structure example. As I mentioned above, this applies to how deep you will go into the structure. It will not limit the number of keys. So consider this structure with deeper members:

<p>

<code>
&lt;cfset s = {
	name = "Ray",
	age = 37,
	race = "white",
	religion = "it's complicated", 
	music = "!country",
	genres = {
		literature=["sci fi","fantasy"],
		music=["alt","indie","classical","jazz","cajun"]
	}
}&gt;

&lt;cfdump var="#s#" top=1&gt;
</code>

<p>

Notice the result doesn't show the contents of genres keys:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip59.png" />

<p>

The top attribute is probably most crucial with ORM entities. When you dump a CFC that is persistent, the tag will possibly generate an incredibly large amount of HTML. Consider a simple Group object. Groups have Members. So imagine one group has 50 members. Now imagine that Users have Groups. Each user has 1-5 groups. Groups have 50 or so members. Are you guessing what's going to happen? I've brought down more ColdFusion servers than ever before by dumping an ORM entity. Unfortunately, using top in a persistent CFC can make it difficult to see whats in the object. So imagine that group with 50 members. Let's just add a top=1 to keep the dump from getting too big.

<p>

<code>
&lt;cfset g = entityLoadByPk("group", 113)&gt;
&lt;cfdump var="#g#" top=1&gt;
</code>

<p>

Now check out the result:

<p>
<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip60.png" />

<p>

Notice that my members property, which should have a bunch of results, was limited to one. I can't easily tell the true size of the data there as the top attribute applies all the way down the dump. It would be nice (and I've blogged this before), if cfdump was more ORM-aware, and perhaps had a way to nicely handle relationships like this. In case you're wondering, top also has no impact on simple values. Don't forget though you can limit the size of a string by using a function like left:

<p>

<code>
&lt;cfset name="Raymond Camden Smith"&gt;
&lt;cfdump var="#left(name,10)#"&gt;
</code>

<p>

Since we're talking about limiting results, let's talk about two related attributes: show and hide. For a query, these attributes are a list of columns to either hide or show. For a structure, it's keys. In both cases, if you specify values that don't exist, ColdFusion won't mind.

<p>

<code>
&lt;cfquery name="getart" datasource="cfartgallery"&gt;
select 	*
from	art
&lt;/cfquery&gt;
&lt;cfdump var="#getart#" label="Art" top=3 hide="artid"&gt;
</code>

<p>

Here is an example of something I've done many times - hide the primary key. If I know there are columns I don't care about and really need to focus, I'll just hide them. Ditto for using show if I just care about one column. Like top, cfdump will tell you it filtered:

<p>

<code>
&lt;cfquery name="getart" datasource="cfartgallery"&gt;
select 	*
from	art
&lt;/cfquery&gt;
&lt;cfdump var="#getart#" label="Art" top="3" show="artid"&gt;
</code>

<p>

Which returns:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip61.png" />

<p>

As I said, this works in structures as well, but apparently is buggy in subkeys. Consider:

<p>

<code>
&lt;cfset s = {
	name = "Ray",
	age = 37,
	race = "white",
	religion = "it's complicated", 
	music = "!country",
	genres = {
		literature=["sci fi","fantasy"],
		music=["alt","indie","classical","jazz","cajun"]
	}
}&gt;

&lt;cfdump var="#s#" hide="music"&gt;
</code>

<p>

Which returns:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip62.png" />

<p>

Notice that the top level music value was hidden, but not the subkey value. (I'll file a bug report for this in the morning.) 

<p>

As long as we're still on filtering, let's cover an attribute I had completely no idea existed until tonight: keys. This works much like top, but whereas top for structures implies how deep, keys represents the number of keys to show. Consider this code:

<p>

<code>

&lt;cfset s = {
	name = "Ray",
	age = 37,
	race = "white",
	religion = "it's complicated", 
	music = "!country",
	genres = {
		literature=["sci fi","fantasy"],
		music=["alt","indie","classical","jazz","cajun"],
		foo="goo",
		zoo=[1,2]
	}
}&gt;

&lt;cfdump var="#s#" keys="3"&gt;
</code>

<p>

The result of this is:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip63.png" />

<p>

As before - note that while the filter worked on "top", it was forgotten in the substructure genres. I honestly don't know when I'd use this - but it's an option.

<p>

Ok, moving along, another option we have is format. Format can be either html (the default), or text. Using our structure from before, I simply switched the format to text and remove the keys attribute:

<p>

<code>
&lt;cfdump var="#s#" format="text"&gt;
</code>

<p>

And consider the result:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip64.png" />

<p>

Notice that the result is <i>much</i> simpler, and it's automatically formatted with PRE tags. How does a query look? Here is a text dump of my query from earlier.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip65.png" />

<p>

It's a bit vertical for my tastes (Ben Nadel must have been here ;), but I suppose it works. So where would this be useful? The cfdump result is quite heavy in terms of HTML sent out. This version is much smaller. It could be a lot better for email. You could also save the result to the file system. How would you do that? Let's now look at another argument - output.

<p>

The output attribute can be browser (the default), console (the server console, basically a log file if you run ColdFusion as a simple service), or a random file name. The file must be a complete path. Here is an example:

<p>

<code>
&lt;cfquery name="getart" datasource="cfartgallery"&gt;
select 	*
from	art
&lt;/cfquery&gt;
&lt;cfdump var="#getart#" label="Art" format="text" output="c:\ray.txt"&gt;
</code>

<p>

When run, nothing from the dump is output to screen. Instead, the entire thing is sent to a file. ColdFusion will append results so if you have other dumps using output and the same file, they won't overwrite each other. Also note that cfdump is smart enough to know it doesn't need the pre tags when outputting to a file. Of course, you can also output to a file with html format;

<p>

<code>
&lt;cfdump var="#getart#" label="Art" format="html" output="c:\ray.html"&gt;
</code>

<p>

I've done this in the past for complex items I don't want to show up in the browser. I'll simply double click it and view it in my browser. A good example of this will be a dump within the model portion of a complex MVC application. 

<p>

OK, still with me? Got a few more attributes to go before we're done. Now let's talk about metadata. Did you notice earlier on when I dumped the query we got some additional data? That included the cache status, SQL, and the execution time. If you don't like that, or just want to focus on the data, turn metadata off like so:

<p>

<code>
&lt;cfdump var="#getart#" label="Art" metainfo="false" top="3"&gt;
</code>

<p>

Which returns...

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip66.png" />

<p>

Now the freaky version of this. Remember how I talked about persistent CFCs and how big they can get? Turns out the default value for metadata in persistent CFCs is false. Turning it on returns.... something odd.

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip67.png" />

<p>

What you are seeing is the result of this:

<p>

<code>
&lt;cfdump var="#g#" top="3" metainfo="true"&gt;
</code>

<p>

The result is just plain odd. You still see much of the same data, but it considers the properties as an array of structs. It also seemingly mixes in the real database value along with the hard coded CFML. So look at the 3rd item in the array. The code behind this is:

<p>

<code>
property name="active" ormtype="boolean" dbdefault="false";
</code>

<p>

cfdump shows ormtype and dbdefault with their values, yet knew "name" was special and used the value as the key and the database value as the value. Make sense? Increasing top a bit results in some pretty complex coloring:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip68.png" />

<p>

Freaky-Tiki. Ok, another attribute is showUDFs. This applies to any <i>container</i> of data. If you cfdump a UDF itself - not the call, you will always get a result

<p>

<code>
&lt;cffunction name="helloWorld" access="public" returnType="string" output="false"&gt;
	&lt;cfargument name="name" required="true" hint="Your name"&gt;
	&lt;cfreturn "Hello, #arguments.name#"&gt;
&lt;/cffunction&gt;
	
&lt;cfdump var="#helloWorld#" showUDFs="false"&gt;
</code>

<p>

Result:

<p>

<img src="https://static.raymondcamden.com/images/cfjedi/ScreenClip69.png" />

<p>

But if I switch to dumping variables, then this time the UDF will be hidden:

<p>

<code>
&lt;cfdump var="#variables#" showUDFs="false"&gt;
</code>

<p>

Even if you turn showUDFs on (or leave it off the tag as on/true is the default), ColdFusion automatically compresses UDFs. I'm guessing here is that the thinking is that you won't normally need to see a UDF. If you wrote it, you probably already know how it's defined anyway. 

<p>

And now we come to our final attribute. If you made it this far, I congratulate you. The final attribute is perfect to end on - abort. For years, folks using cfdump for testing would do something like this.

<p>

<code>
&lt;cfdump var="#something#"&gt;
&lt;cfabort&gt;
</code>

<p>

If something was going wrong in their code, doing a quick dump and an abort allowed them to see the state of values and stop execution at that point. Apparently this done so much that Adobe actually made it part of the tag:

<p>

<code>
&lt;cfdump var="#something#" abort&gt;
</code>

<p>

Note that you do not need to actually state abort="true". Just the presence of the attribute by itself implies abort="true". 

<p>

So - I hope this was helpful. I'd love to hear about any interesting dump use cases or other tricks folks may have. Any questions are also - of course - welcome.