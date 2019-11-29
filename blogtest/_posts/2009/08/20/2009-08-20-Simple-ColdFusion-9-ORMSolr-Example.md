---
layout: post
title: "Simple ColdFusion 9 ORM/Solr Example"
date: "2009-08-20T13:08:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/08/20/Simple-ColdFusion-9-ORMSolr-Example
guid: 3497
---

Last night I decided to whip together a simple example of how to add Solr search indexing to an application. Luckily, for the most part, this is the exact same process we've been using for years now with Verity. I know many people avoided Verity due to the document size limits so with that in mind, I thought a simple ColdFusion 9 example would help introduce the feature. To start off with, let me show you a simple application that has no search capability at all. This will be the first draft application that I'll modify to add Solr support.
<!--more-->
My application is a Press Release viewer. The public page consists of a list of press releases. You click on a press release to view the details. The admin folder (and for this proof of concept it won't have any security) allows for basic CRUD operations. I won't show most of the code as it's rather boring, but I'll demonstrate my Application.cfc and the model layer. First, the Application.cfc file:

<code>
component {

	this.name = "pressreleases";
	this.ormenabled = true;
	this.datasource=this.name;
	this.ormsettings = {
		dialect="MySQL",
		dbcreate="update",
		eventhandling="true"
	};
	this.mappings["/model"] = getDirectoryFromPath(getCurrentTemplatePath()) & "model";

	public boolean function onApplicationStart() {
		application.prService = new model.prService();
		return true;
	}
			
	public boolean function onRequestStart(string page) {
		if(structKeyExists(url, "init")) {% raw %}{ ormReload(); applicationStop(); location('index.cfm?reloaded=true'); }{% endraw %}
		return true;
	}
}
</code>

Nothing too fancy here - I've enabled ORM, allowed for easy restarts, and created a grand total of one CFC in the application scope, the prService. The prService is simply a component to abstract access to my press release model. The press release entity is just:

<code>
component persistent="true" {

	property name="id" generator="native" sqltype="integer" fieldtype="id";
	property name="title" ormtype="string";
	property name="author" ormtype="string";
	property name="body" ormtype="text";
	property name="published" ormtype="date";

}
</code>

And the service provides an abstraction layer to it:

<code>
component {

	pubic function deletePressRelease(id) {
		entityDelete(getPressRelease(id));
		ormFlush();
	}
	
	public function getPressRelease(id) {
		if(id == "") return new pressrelease();
		else return entityLoad("pressrelease", id, true);
	}
	
	public function getPressReleases() {
		return entityLoad("pressrelease");
	}

	public function getReleasedPressReleases() {
		return ormExecuteQuery("from pressrelease where published &lt; ? order by published desc", [now()]);
	}

	public function savePressRelease(id,string title,string author,date published,string body) {
		var pr = getPressRelease(id);
		pr.setTitle(title);
		pr.setAuthor(author);
		pr.setPublished(published);
		pr.setBody(body);
		entitySave(pr);
	}
}
</code>

I assume most of this makes sense. Note that I have bot ha getPressReleases function as well as a getReleasedPressReeleases function. The later handles the public view and only gets press releases where the published date is in the past. Notice that savePressRelease is kind of nice - it just plain works whether you have a new press release or an existing one. Also make note of delete. In order to handle calling a delete operation followed by a list, I force a flush on the ORM stuff. If I didn't, the deleted item would show in the list during the same request.

You can download all of this code at the bottom, and again, I don't want to waste too much time on basic list/edit forms. What I want to talk about instead is the process of enabling Solr searching support for this application. 

When you work with Solr (and Verity as well), you work with an index of your data. This index, much like an index in a book, represents all the data that you want to be searchable. However, and this is the critical point, it is <b>your responsibility</b> to keep the index up to date. That means every time you add, edit, or delete content, you have to update the index. The maintenance aspect then is typically the most complex part of the process. Searching really just comes down to one tag. 

I normally create a "Ground Zero" type script that handles creating my collection and index from scratch. (Think of the collection just as the folder or name of the index.) This is useful to run during testing or if you encounter a bug where your index gets out of data. I created the following script for that purpose:

<code>
&lt;cfcollection action="list" name="collections" engine="solr"&gt;

&lt;!--- collection check ---&gt;
&lt;cfif not listFindNoCase(valueList(collections.name), application.collection)&gt;
	&lt;cfoutput&gt;
	&lt;p&gt;
	Need to create collection #application.collection#.
	&lt;/p&gt;
	&lt;/cfoutput&gt;
	
	&lt;cfcollection action="create" collection="#application.collection#" engine="solr" path="#application.collection#"&gt;
&lt;/cfif&gt;

&lt;!--- nuke old data ---&gt;
&lt;cfindex collection="#application.collection#" action="purge"&gt;

&lt;!--- get data ---&gt;
&lt;cfset prs = application.prService.getPressReleases()&gt;
&lt;cfoutput&gt;&lt;p&gt;Total of #arraylen(prs)# press releases.&lt;/p&gt;&lt;/cfoutput&gt;

&lt;!--- convert to a query ---&gt;
&lt;cfset data = entityToQuery(prs)&gt;

&lt;!--- add to collection ---&gt;
&lt;cfindex collection="#application.collection#" action="update" body="body,title" custom1="author" title="title" key="id" query="data"&gt;

&lt;p&gt;Done.&lt;/p&gt;
</code>

I begin by getting a list of collections. The ColdFusion 9 docs say that if you leave the engine attribute off the cfcollection tag it will return everything. I did <b>not</b> see that. I file a bug on it. But for now, I've just added the engine attribute. This returns a query of collections. If I don't find my collection in there (I created an application variable to store the name) then I create one. In theory, this will only happen one time.

Next I remove all data from the collection with the purge. Again, I'm thinking that this script would be useful both for a first time seeding of the index as well as a 'recovery' type action. 

Once we have an empty index, I get all of my press releases and convert it to a query with the entityToQuery function.

Lastly, I simply pass that query to the cfindex tag. Now, here is an important part. When you pass data into the index, you get to the decide what gets stored in the body and what, if anything, gets stored in the 4 custom fields. I decided that the body and title made sense for the searchable information. I repeated title again for the title attribute. This will let me get the title in search results. For the custom field I used the author. Again, this was totally up to me and what made sense for my application. 

Alright, so at this point we can run the script to create our collection and populate the index. I then switched gears and worked on the front end. I create a new search template to handle that:

<code>
&lt;cfparam name="url.search" default=""&gt;
&lt;cfparam name="form.search" default="#url.search#"&gt;
&lt;cfset form.search = trim(form.search)&gt;

&lt;form action="search.cfm" method="post"&gt;
&lt;cfoutput&gt;&lt;input type="text" name="search" value="#form.search#"&gt; &lt;input type="submit" value="Search"&gt;&lt;/cfoutput&gt;
&lt;/form&gt;

&lt;cfif len(form.search)&gt;
	&lt;cfsearch collection="#application.collection#" criteria="#form.search#" name="results" status="r" suggestions="always" contextPassages="2"&gt;

	&lt;cfif results.recordCount&gt;
	
		&lt;cfoutput&gt;
		&lt;p&gt;There were #results.recordCount# result(s).&lt;/p&gt;
		&lt;cfloop query="results"&gt;
		&lt;p&gt;
		&lt;a href="detail.cfm?id=#key#"&gt;#title#&lt;/a&gt;&lt;br/&gt;
		#context#
		&lt;/p&gt;
		&lt;/cfloop&gt;
		&lt;/cfoutput&gt;
	
	&lt;cfelse&gt;
	
		&lt;p&gt;
		Sorry, but there were no results.
		&lt;!--- trim is in relation to bug 79509 ---&gt;
		&lt;cfif len(trim(r.suggestedQuery))&gt;
			&lt;cfoutput&gt;Try a search for &lt;a href="search.cfm?search=#urlEncodedFormat(r.suggestedQuery)#"&gt;#r.suggestedQuery#&lt;/a&gt;.&lt;/cfoutput&gt;
		&lt;/cfif&gt;
		&lt;/p&gt;
		
	&lt;/cfif&gt;
	
&lt;/cfif&gt;
</code>

Going line by line, we begin with some simple parameterizing of a search variable, along with a basic form. If the user actually searched for something, we use cfsearch. As you can see, it works pretty simply. Pass in a criteria and a name for the results and you are done. The status attribute is not necessary but provides some cool functionality I'll describe in a bit.

If we have any results, I simply loop over them like any other query. The context is created by Solr based on your matches. So if you searched for enlightenment (don't we all), then the context will show you where it was found in the data. 

The cool part is the else block. Solr (and Verity before it) provided a nice feature for searches called suggestions. Let's say a user wanted to search for Dharma but accidentally entered Dhrma. In some cases, the Solr engine can recognize the typo and will actually return a suggested query: Dharma. Pretty cool, right? Please note that the trim in there is due to another bug I found. In cases where Solr could not find a suggestion, it returned a single space character. I'm sure this will be fixed for the final release. If we do get a suggested query then we simply provide a link to allow the user to try that instead.

So far so good. Now let's talk about keeping the index up to date. If you remember, I had built a simple service component, prService, to handle all CRUD operations for my data. Because I did that, it was rather simple to handle the changes necessary for my index. First, my Application.cfc onApplicationStart was modified to support passing in the collection name:

<code>
public boolean function onApplicationStart() {
	application.collection = "pressreleases";
	application.prService = new model.prService(application.collection);
	return true;
}
</code>

And then prService was modified to support it. Unfortunately, there are no script based alternatives for Solr/Verity support. To be honest, it would probably be trivial to create such a component. (In case you didn't know, the ColdFusion 9 script based support for mail, and other things, was done this way.) I ended up simply rewriting my component into tags:

<code>
&lt;cfcomponent output="false"&gt;

	&lt;cffunction name="init" output="false"&gt;
		&lt;cfargument name="collection"&gt;
		&lt;cfset variables.collection = arguments.collection&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="deletePressRelease" output="false"&gt;
		&lt;cfargument name="id"&gt;


		&lt;cfset entityDelete(getPressRelease(id))&gt;
		&lt;cfset ormFlush()&gt;

		&lt;!--- update collection ---&gt;
		&lt;cfindex collection="#variables.collection#" action="delete" key="#id#" type="custom"&gt;

	&lt;/cffunction&gt;
	
	&lt;cffunction name="getPressRelease" output="false"&gt;
		&lt;cfargument name="id"&gt;
		
		&lt;cfif id is ""&gt;
			&lt;cfreturn new pressrelease()&gt;
		&lt;cfelse&gt;
			&lt;cfreturn entityLoad("pressrelease", id, true)&gt;
		&lt;/cfif&gt;
	&lt;/cffunction&gt;
	
	&lt;cffunction name="getPressReleases" output="false"&gt;
		&lt;cfreturn entityLoad("pressrelease")&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="getReleasedPressReleases" output="false"&gt;
		&lt;cfreturn ormExecuteQuery("from pressrelease where published &lt; ? order by published desc", [now()])&gt;
	&lt;/cffunction&gt;

	&lt;cffunction name="savePressRelease" output="false"&gt;
		&lt;cfargument name="id"&gt;
		&lt;cfargument name="title"&gt;
		&lt;cfargument name="author"&gt;
		&lt;cfargument name="published"&gt;
		&lt;cfargument name="body"&gt;
		
		&lt;cfset var pr = getPressRelease(id)&gt;
		&lt;cfset pr.setTitle(title)&gt;
		&lt;cfset pr.setAuthor(author)&gt;
		&lt;cfset pr.setPublished(published)&gt;
		&lt;cfset pr.setBody(body)&gt;
		&lt;cfset entitySave(pr)&gt;
		
		&lt;!--- update collection ---&gt;
		&lt;cfindex collection="#variables.collection#" action="update" key="#pr.getId()#" body="#pr.getBody()#,#pr.getTitle()#" title="#pr.getTitle()#" custom1="#pr.getAuthor()#" type="custom"&gt;
		
	&lt;/cffunction&gt;
	
&lt;/cfcomponent&gt;
</code>

If we ignore the tags, the only changes are the cfindex tags in deletePressRelease and savePressRelease. In both cases it isn't too difficult. The key attribute refers to the primary key in the index. We used the database ID record so it's what we use when updating/deleting. The update action works for both additions and updates, so that is pretty simple as well. 

Unfortunately, I ran into an issue with deletes. Delete operations are 100% broken in the current release of ColdFusion 9, at least on the Mac (and I bet it works ok in Verity). Keep this in mind as you play with the demo code. I've been told this is fixed already.

So what do folks think? Will you use this when you upgrade to ColdFusion 9? Also, have you notice the slight logic bug with search? I won't say what it was - but I'll tackle it in the next post.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Formsolr%{% endraw %}2Ezip'>Download attached file.</a></p>