---
layout: post
title: "Using jQuery and ColdFusion to create an auto-link for definition application"
date: "2009-01-31T13:01:00+06:00"
categories: [coldfusion,jquery]
tags: []
banner_image: 
permalink: /2009/01/31/Using-jQuery-and-ColdFusion-to-create-an-autolink-for-definition-application
guid: 3215
---

Sean asks:

<blockquote>
<p>
I have an existing application.  Its for doctors and technologists who are applying for accreditation.  There are a lot of terms that are used and the client wants the terms linked to a pop up that has a definition.  Now, I can set up a CFC to grab the term's definition and return it to an ajax call from CF and link the term to it, that's no problem.  The problem is, I don't want to go through each page, and then again when the content is changed and manually link any recognized words to the JS function that executes the remote call to the CFC.  Do you know of a way, perhaps with jQuery or the built-in CF stuff, to, after each page loads, scan the text for any recognized words (this list can be retreived from another CFC call for all the words we "know of") and then link to it using the pop-up bubble?
</p>
</blockquote>
<!--more-->
This is a pretty interesting idea. I was pretty mad at Sean for mailing this to me on Wednesday right when I had to fly! (In case folks are wondering why I was so silent recently, I flew up to CA on Wednesday and back home on Friday so I've been a bit remote.) As always, there are many ways we could attack this, but this is the route I chose.

<ul>
<li>On load, use JavaScript to get all the text from one div. While Sean said he wanted to scan the 'page', I assume he really means the main page content, and not stuff like the header of footer.
<li>Convert that text into a unique list of words.
<li>Send that list to the server and figure out which words are 'hot', ie, terms that we have definitions for.
<li>When we get the list of terms back, update the content to create links to something that will display the definition.
</ul>

Make sense? Ok, let's start. I began with a super simple HTML page:

<code>
&lt;html&gt;
	
&lt;head&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;div id="content"&gt;
&lt;p&gt;
This is some &lt;b&gt;fun&lt;/b&gt; text.
&lt;/p&gt;
&lt;p&gt;
This is some &lt;b&gt;boring&lt;/b&gt; text.
&lt;/p&gt;
&lt;blockquote&gt;
&lt;p&gt;
For score and seven years ago...
&lt;/p&gt;
&lt;/blockquote&gt;
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

Notice I have one main div with the ID of content. You could imagine a system by where you use ColdFusion custom tags to wrap your content (see this <a href="http://www.raymondcamden.com/index.cfm/2007/9/3/ColdFusion-custom-tag-for-layout-example">blog entry</a> for an example) and always count on the important page content being within one specific ID. 

Our first task is to get the text from the div. Notice I said text and not html. Let's use jQuery:

<code>
var content = $("#content").text()
</code>

Now we need to split the content into words. I'll use a bit of regex for that:

<code>
var words = content.split(/\b/)
</code>

And now I'll store each word into a simple object. I'm using this as a trick to convert a list of words into a set of unique words. There is probably a nicer way to do this.

<code>
var uWords = new Object()
for(var i=0; i&lt;words.length;i++) {
	var word = words[i]
	word = word.replace(/[\s\n]/g,'')
	if(word != '' && uWords[word] == null) uWords[word] = '' 		
}
</code>

I then convert this generic object into an array:

<code>
var aWords = new Array()
for(var w in uWords) aWords.push(w)
</code>

And lastly, let's send this to ColdFusion:

<code>
if(aWords.length) $.post('term.cfc?method=filteredTermList&returnFormat=json',{% raw %}{termList:aWords.toString()}{% endraw %},highlightWords,"json")
</code>

This code says: If I had any words, do a POST operation to the CFC named term.cfc, run the method filteredTermList, and pass an argument named termList. The aWords.toString() is a shortcut to convert the array into a list. Next I tell jQuery to run a method, highlightWords, when done. The last argument lets jQuery know the result will be in json. This let's jQuery automatically convert it to native JavaScript data.

All of of the above code was wrapped in a $(document).ready(function() package so as to run as soon as the page loads. (Don't worry, I'll post the complete code at the end.)

Ok, now let's go to the CFC side. It's a rather simple CFC so I'll post the entire file first:

<code>
&lt;cfcomponent&gt;

&lt;!--- Hard coded list of terms we know. ---&gt;
&lt;cfset variables.termList = ["boring","cool","hot","cold","nice","watch","score"]&gt;

&lt;cffunction name="filteredTermList" access="remote" returnType="array" output="false"&gt;
	&lt;cfargument name="termList" type="string" required="true" hint="List of words to search. Assumed to be unique."&gt;
	&lt;cfset var term = ""&gt;
	&lt;cfset var result = []&gt;

	&lt;cfloop index="term" list="#arguments.termList#"&gt;
		&lt;cfif arrayFind(variables.termList,term)&gt;
			&lt;cfset arrayAppend(result, term)&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;

	&lt;cfreturn result&gt;
&lt;/cffunction&gt;

&lt;cffunction name="arrayFind" access="private" returnType="numeric" output="false" hint="Returns the position of an item in an array, or 0"&gt;
	&lt;cfargument name="arr" type="array" required="true"&gt;
	&lt;cfargument name="s" type="string" required="true"&gt;
	&lt;cfset var x = ""&gt;

	&lt;cfloop index="x" from="1" to="#arrayLen(arguments.arr)#"&gt;
		&lt;cfif arguments.arr[x] is arguments.s&gt;
			&lt;cfreturn x&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;

	&lt;cfreturn 0&gt;
&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

The CFC begins with a hard coded list of known terms. This would normally be dynamic. The important method, filteredTermList, is what I'll focus on. It accepts a list of words. For each word, it will check and see if it exists in our known list (notice the use of arrayFind), and if there is a match, the word gets appended to a result array. This result is returned at the end of the method.

Ok, so back to the front end. Remember we had told jQuery to run a function called highlightWords when done. Here is how I defined that method:

<code>
function highlightWords(data,textStatus) {	
	var currentContent = $("#content").html()

	for(var x=0; x&lt;data.length;x++) {
		word = data[x]
		//replace word with &lt;a href="" click="return showTerm('term')"&gt;term&lt;/a&gt;
		var newstr = '&lt;a href="" onclick="return showTerm(\''+word+'\')"&gt;'+word+'&lt;/a&gt;'
		//get current html
		//replace word with the new html
		var reg = new RegExp(word, "gi")
		currentContent = currentContent.replace(reg,newstr)
	}
	//update it	
	$("#content").html(currentContent);
}
</code>

We begin by grabbing the HTML of our content div. We need the HTML this time as we are actually going to be modifying the markup a bit. I then loop over the data result. This is what was returned from the CFC so it will be an array of words. For each word, I do a replace where each word is exchanged with HTML that will run a function, showTerm. 

Now lets look at showTerm. This is what will show the definition for our word. 

<code>
function showTerm(term){
	ColdFusion.Window.create('term','Definition of '+term,'term.cfc?method=definition&term='+escape(term)+'&returnformat=plain', {% raw %}{center:true,modal:true}{% endraw %})
	ColdFusion.Window.onHide('term',winClosed);
	return false
}
function winClosed() {
	ColdFusion.Window.destroy('term',true)
}
</code>

For showTerm I made use of cfwindow. (See the PS for why I did and my rant about jQuery UI.) Notice that I make sure of the CFC again, but set the returnFormat to plain. This lets me run a CFC method that will return a string and not have to worry about JSON or WDDX encoding. The onHide/winClosed stuff just helps me handle creating new window objects. The method I added to the CFC is pretty simple:

<code>
&lt;cffunction name="definition" access="remote" returnType="string" output="false"&gt;
	&lt;cfargument name="term" type="string" required="true" hint="Word to look up."&gt;

	&lt;cfreturn "The definition of " & arguments.term & " is, um, something."&gt;
&lt;/cffunction&gt;
</code>

As you can guess, this would normally be a database lookup. But that's it! We now add terms to our CFC and know that the front end will automatically pick up on the terms and automatically hot link them. I've included the code as a zip to the entry so feel free to download and play. (Although you will have to download <a href="http://jquery.com">jQuery</a> yourself.) 

Before I get into my little rant about jQueryUI, here are some things to consider:

<ul>
<li>Why not simply load the known words on startup? I could have done that, especially with my short list of known words. But I figured that in a real production system your list of known words could be huge. That isn't something you probably want to add to each page load. I figured scanning for unique words and sending that to the server to get the known list back would mean less traffic. I don't <b>know</b> that of course, and this ties back to something I said at the NYCFUG earlier this month. Don't consider AJAX a magic bullet. Sending data back and forth with JavaScript isn't going to magically be 'better' just because it's JSON or XML or whatever. 
<li>It would be cool to add tracing to which terms get looked up. If you notice that some words are almost always looked up, it may represent an opportunity for something you can educate yours users about. So for example, if you see a lot of traffic for terms related to throat diseases, maybe you could write additional content on that area of study. On the flip side, if no one ever looks up the definition of Foo, then you can probably remove Foo from the list of content to hot link. 
</ul>

Any other things people would mention? Anyone using a system like this in production?

I've uploaded my demo here: <a href="http://www.coldfusionjedi.com/demos/termdemo/test.cfm">http://www.coldfusionjedi.com/demos/termdemo/test.cfm</a>

p.s. Ok, my rant. For my term popup I wanted to use jQueryUI. I was happy to find that there was a simple <a href="http://docs.jquery.com/UI/Dialog">Dialog</a> control, but I found skinning it to be very difficult. The docs talk about themes and mention the <a href="http://docs.jquery.com/UI/Theming/Themeroller">ThemeRoller</a> application, all of which look really cool. But I wasn't able to find a simple example of using the theme for the dialog. The theme I downloaded had one HTML file, but it was cluttered with every possible example control you could imagine. Maybe I was being lazy, but I just found it difficult and overwhelming as a new user. To be fair, I thought jQuery's main code was a bit overwhelming at first, so I probably just need to give it another try, but I was pretty ticked at first. That's why I 'punted' and switched to cfwindow. It just plain worked.<p><a href='enclosures/D{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5Cwww%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fterm%{% endraw %}2Ezip'>Download attached file.</a></p>