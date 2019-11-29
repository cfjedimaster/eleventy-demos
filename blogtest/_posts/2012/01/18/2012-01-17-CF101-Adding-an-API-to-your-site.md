---
layout: post
title: "CF101: Adding an API to your site"
date: "2012-01-18T10:01:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2012/01/18/CF101-Adding-an-API-to-your-site
guid: 4498
---

Have you ever wanted to create an API for your web site? Many sites do so now - using their API as a way to share their information with others. This allows other web sites, desktop apps, and mobile applications a way to work with and repackage your data. In this blog entry, I'm going to demonstrate how you can use ColdFusion to build a simple API for your site.
<!--more-->
<p/>

Before we begin, there are a few considerations to keep in mind.

<p/>

First, what you decide to share is less a technical question and more a business question. If your web site is your business, you have to consider if it makes sense for folks to get information without actually visiting your site. Sharing is nice, but it doesn't pay for hosting. You need to look at what your site provides and make a decision on how much you want to share. So for example, a news site could possibly share news within a given time range, perhaps just the past 24 hours. A stock market site could share stock prices, but only those that are one hour old. Or perhaps only the stocks from a certain list. 

<p/>

As I said, this is <i>entirely</i> business level and not technical, but you want to have a good idea in place <b>before</b> you create the API. About one of the worst things you could do as a provider of information is provide a set of data initially and then change your mind later. It happens - and it can't always be avoided, but you want to avoid this at all possible.

<p/>

Even for folks who aren't in a commercial business at all, you want to be sure that your server can handle the load of hundreds, thousands, maybe millions of people hitting your API. Most of us make use of tools like Google Analytics or Omniture to track our traffic on public pages, but these tools do not work with APIs (not as far as I know). While your site may be get a few hundred hits per week, if you release a popular API it may get a tremendous amount of traffic and you may not be aware of it until your server crawls to a halt.

<p/>

To summarize - you want to have a good idea of <b>what</b> you will serve and <b>how</b> you will handle the potential traffic. 

<p/>

The good news is that those decisions are the hard ones. Technically, ColdFusion goes a long way to making APIs easy to create.

<p/>

We've got a few options here on how data can be served to others. You could...

<p/>

<ul>
<li>Create a web service
<li>Create a simple HTTP based service that spits out JSON
<li>Expose your data as simple text, perhaps TSV or CSV formatted
<li>Hell, you could create an API that sends out results via email or IM as well
<li>Double Hell, you could create an API that sends out results via SMS
</ul>

<p/>

For my demo, I'll be making use of ColdFusion Components. As you will see, this will allow me to create both a JSON-based service and a web service all at once. I'm not a big fan of web services, but since ColdFusion makes it so trivial to produce them, there's no reason not to support it. Let's begin by taking a look at the application as it stands now. 

<p/>

<strike>Demo</strike><i>(Demo no longer avaialble.)</i>

<p/>

Sexy demo, right? So obviously there isn't a lot here, but let's go over the base code. First, our Application.cfc:

<p/>

<pre><code class="language-javascript">
component {

	this.name="cfremoteapidemo";
	this.datasource="cfartgallery";
	
	public boolean function onApplicationStart() {    
		application.artCFC = new model.art();
    		return true;    
    	}    
    
}
</code></pre>

<p/>

Not much going on here. We set up a few settings and in the application start up, create an Application scope variable for an Art component. This is not a full MVC type application, but I've tried to separate out my business logic from my display as much as possible. In this case, we will have one CFC handling the business logic and database interaction while my CFMs will just do display. Let's look at art.cfc:

<p/>

<pre><code class="language-javascript">
component {

	public query function getart() {
		var q = new com.adobe.coldfusion.query();    
	    q.setSQL("select artid, artname, description, price, largeimage, issold from art");    
	    return q.execute().getResult();	
	}

}
</code></pre>

<p/>

Again, not much here but a simple query. Now to our front end:

<p/>

<pre><code class="language-markup">
&lt;cfset art = application.artCFC.getart()&gt;

&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;&lt;/title&gt;
	&lt;meta http-equiv="Content-Type" content="text/html;charset=ISO-8859-1" /&gt;	
	&lt;meta name="description" content="" /&gt;
	&lt;meta name="keywords" content="" /&gt;

	&lt;link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.4.0/bootstrap.min.css"&gt;
	&lt;!--[if lt IE 9]&gt;&lt;script src="http://html5shim.googlecode.com/svn/trunk/html5.js"&gt;&lt;/script&gt;&lt;![endif]--&gt;
	&lt;script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"&gt;&lt;/script&gt;
	&lt;script type="text/javascript"&gt;
		$(function() {
			
		});	
	&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
	

	&lt;div class="container"&gt;

	&lt;div class="page-header"&gt;
		&lt;h1&gt;Art&lt;/h1&gt;
	&lt;/div&gt;

		&lt;cfoutput query="art"&gt;
			&lt;p&gt;
				&lt;h3&gt;#artname#&lt;/h3&gt;
				Price: #dollarFormat(price)# &lt;cfif isBoolean(issold) and issold&gt;&lt;span class="label important"&gt;Sold&lt;/span&gt;&lt;/cfif&gt;&lt;br/&gt;
				#description#&lt;br/&gt;
				&lt;img src="/cfdocs/images/artgallery/#largeimage#"&gt;
			&lt;/p&gt;
		&lt;/cfoutput&gt;

	&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code></pre>

<p>

Most of the code here is HTML related, but you can see on top where I ask my Application-scoped component for the data and then display it below.

<p/>

So as I said - a simple application, right? For my API, I want to expose my art data. I can't share my Application-scoped Art component because it's a variable. Technically folks could hit the CFC directly with their browser, but it's got no remote methods so it wouldn't actually expose any functionality. What I'll do instead though is build a new CFC. This CFC will serve as my API. As I add more features to my site, this one CFC will continue to be the core way folks "communicate" with my data.

<p/>

Here is api.cfc, stored in the root of my application:

<p/>

<pre><code class="language-javascript">
component {

	remote array function listart() {
		//convert to an array of structs
		var result = [];
		var art = application.artCFC.getArt();
		for(var i=1; i&lt;=art.recordCount; i++) {
			arrayAppend(result, {"artid"=art.artid[i], 
								 "artname"=art.artname[i],
								 "description"=art.description[i],
								 "price"=art.price[i],
								 "largeimage"=art.largeimage[i],
								 "issold"=art.issold[i]});
		}
		return result;	
	}


}
</code></pre>

<p>

The API has one function, listart, marked as remote. I could have simply done this:

<p/>

<pre><code class="language-javascript">
return application.artCFC.getArt();
</code></pre>

<p/>

But the serialized version of ColdFusion queries is... well not bad... but a bit odd. I'd think most folks would prefer an array of structs. So my code takes the query result and recreates it. That's it. 

<p/>

What's cool (at least to me), is that at this point right now, we have a web service. Any technology that can talk SOAP can hit the WSDL and see this: http://www.raymondcamden.com/demos/2012/jan/18/v1/api.cfc?wsdl. But even better, at the <i>same</i> time, we have a HTTP service that can spit out JSON as well: http://www.raymondcamden.com/demos/2012/jan/18/v1/api.cfc?method=listart&returnformat=json

<p/>

Now let's take it up a notch and show something with a bit of interactivity. I've created a new version that has a slightly enhanced model:

<p/>

<pre><code class="language-javascript">
component {

	public query function getart(string search="",string sort="artname",string sortdir="asc") {
		var validsortlist = "artname,price";
		
		var q = new com.adobe.coldfusion.query();  
		var sql = "select artid, artname, description, price, largeimage, issold from art"; 
	    if(arguments.search != "") {
	    	sql &= " where artname like :search or description like :search ";
		    q.addParam(name="search",value="{% raw %}%#arguments.search#%{% endraw %}",cfsqltype="cf_sql_varchar");    
		}
		
		if(!listFindNoCase(validsortlist, arguments.sort)) {
			arguments.sort = "artname";
		}
		if(arguments.sortdir != "asc" && arguments.sortdir != "desc") arguments.sortdir = "asc";
		
		sql &= " order by #arguments.sort# #arguments.sortdir# ";

	    q.setSQL(sql);  

	    return q.execute().getResult();	
	}


}
</code></pre>

<p/>

Now my CFC supports searching and sorting. I can then expose that via the API:

<p/>

<pre><code class="language-javascript">
component {

	remote array function listart(string sort,string sortdir) {
		//convert to an array of structs
		var result = [];
		var art = application.artCFC.getArt(argumentCollection=arguments);
		for(var i=1; i&lt;=art.recordCount; i++) {
			arrayAppend(result, {"artid"=art.artid[i], 
								 "artname"=art.artname[i],
								 "description"=art.description[i],
								 "price"=art.price[i],
								 "largeimage"=art.largeimage[i],
								 "issold"=art.issold[i]});
		}
		return result;	
	}

}
</code></pre>

<p/>

<strike>
You can see this running here: http://www.raymondcamden.com/demos/2012/jan/18/v2/api.cfc?method=listart&returnformat=json&sort=price&sortdir=desc This URL lists art by price with the most expensive items first.</strike>

<p/>

I've attached a zip of both v1 and v2 applications to this blog entry. In order for them to work you will need to have the cfartgallery datasource present on your system.<p><a href='https://static.raymondcamden.com/enclosures/cfapi1.zip'>Download attached file.</a></p>