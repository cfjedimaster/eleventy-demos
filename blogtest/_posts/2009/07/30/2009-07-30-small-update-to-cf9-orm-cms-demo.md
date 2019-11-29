---
layout: post
title: "Small update to CF9 ORM CMS Demo"
date: "2009-07-31T00:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/07/30/small-update-to-cf9-orm-cms-demo
guid: 3467
---

It's been a few days since I posted my <a href="http://www.raymondcamden.com/index.cfm/2009/7/25/Very-simple-very-ugly-CMS-built-with-ColdFusion-9">CF9 ORM CMS demo</a>, but I wanted to share a small update I worked on yesterday while recovering from the beach. 

If you remember, both my sections and pages had a special property. Sections have a siteDefault boolean property. There should only be one section where this is true. Pages have a isHomePage boolean property where only one page per section should be allowed to set it true. 

I looked into event handling in ORM as a way to handle these two rules. Event handling, as you can guess, allows you to handle ORM based events. So for example, you can run logic before an item is deleted, after it is loaded from the database, and so on. For my demo, I was concerned about two events: postInsert and postUpdate. As you can guess, these events run after an insert and update action. So if I make a new section, for example, the postInsert will fire and I'll run my special logic. If I edit an existing section, postUpdate will fire, and I can do the check there as well. Before you can begin using event handling, you have to enable it in your ORM settings:

<code>
this.ormsettings = {
	dialect="MySQL",
	dbcreate="update",
	eventhandling="true"
};
</code>

I then modified section.cfc like so:

<code>

component persistent="true" {

	property name="id" generator="native" sqltype="integer" fieldtype="id";
	property name="name" ormtype="string";
	property name="sitedefault" ormtype="boolean";
	property name="order" ormtype="integer";

	public function postInsert() {
		
		if(not isNull(variables.sitedefault) and variables.sitedefault) {
			clearAllDefault();
		}

	}	

	public function postUpdate() {
		if(not isNull(variables.sitedefault) and variables.sitedefault) {
			clearAllDefault();
		}
	}	

	/*
	* We have made this section the site default, so get all the others, and set them to false
	*/
	private function clearAllDefault() {
		var sections = ormExecuteQuery('from section where id != ? and sitedefault = ?',[variables.id,true]);
		var i="";
		for(i=1; i &lt;= arrayLen(sections); i++) {
			sections[i].setSiteDefault(false);
			entitySave(sections[i]);
		}

	}
}
</code>

Skipping over the properties which didn't change my from the last demo, take note of postInsert and postUpdate. Both check to see if siteDefault was set and if it was true. If so, the very badly named clearAllDefault (I really couldn't think of a better name) will be run. 

I run a quick query using ormExecuteQuery to get all sections where the ID does not match the current record and siteDefault is true. In theory, that will return one record, but I let it assume there could be multiple. I looped over the results and set the siteDefault value to false. page.cfc had similar modifications:

<code>

component persistent="true" {

	property name="id" generator="native" sqltype="integer" fieldtype="id";
	property name="title" ormtype="string";
	property name="body" ormtype="text";
	
	property name="section" fieldType="many-to-one" cfc="section" fkcolumn="sectionidfk";
	property name="template" fieldType="many-to-one" cfc="template" fkcolumn="templateidfk";
	
	property name="isHomePage" datatype="boolean";
	
	public string function renderMe() {
		return template.getHeader() & body & template.getFooter();
	}

	public function postInsert() {
		
		if(not isNull(variables.isHomePage) and variables.isHomePage) {
			clearOtherHomepage();
		}

	}	

	public function postUpdate() {
		if(not isNull(variables.isHomePage) and variables.isHomePage) {
			clearOtherHomepage();
		}
	}	

	/*
	* We have made this page the home page for a section, so get the other pages in the section, and set them to false
	*/
	private function clearOtherHomepage() {
		var pages = ormExecuteQuery('from page where id != ? and section.id = ? and isHomePage = ?',[variables.id,variables.section.getID(),true]);
		var i="";
		for(i=1; i &lt;= arrayLen(pages); i++) {
			pages[i].setIsHomePage(false);
			entitySave(pages[i]);
		}

	}
		
}
</code>

Focusing on just clearOtherHomepage (again, not a great name), notice the query here is a bit more precise. It looks for pages in the same section with isHomePage set to true. 

I've attached the latest rev of the CMS to the blog entry. Obviously there is a lot more to event handling, but I was surprised how easy it was to use in my application. I hope this example helps other.<p><a href='/enclosures/cmsalpha1.zip'>Download attached file.</a></p>