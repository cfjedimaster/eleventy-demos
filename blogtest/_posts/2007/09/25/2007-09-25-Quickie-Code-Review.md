---
layout: post
title: "Quickie Code Review"
date: "2007-09-25T18:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2007/09/25/Quickie-Code-Review
guid: 2370
---

From time to time in my job I'm asked to do code reviews. I love em. I get to tear apart someone else's code and pretend like I never make mistakes. It's perfect. I don't often review code over email as it's typically a big job, and I don't want to encourage folks to send me reams of code (well, not unless you have a budget ;), but as this was one simple file I thought I'd help the user out, and then share the results here. Is this kind of post useful? Let me know. I think it is as it shows real life production code - but again - do let me know. (I also know that people are still struggling to grok application.cfc - so I figure the more examples the better.)

So first off - here is the code as it was sent to me. I removed a few lines that were repetitive and not useful to the review and I changed a few values so as to not reveal any personal information:

<code>
&lt;cfcomponent output="no"&gt;

	&lt;cfset this.name = 'xxx'&gt;
	&lt;cfset this.applicationTimeout = createTimeSpan(0,0,2,0)&gt;
	&lt;cfset this.clientManagement = true&gt;
	&lt;cfset this.sessionManagement = true&gt;
	&lt;cfset this.sessionTimeout = createTimeSpan(0,2,0,0)&gt;
	&lt;cfset this.setClientCookies = true&gt;
	&lt;cfset this.setDomainCookies = false&gt;
	&lt;cfset this.scriptProtect = false&gt;

	&lt;cfsetting showdebugoutput="false"&gt;
	
	&lt;cffunction name="onApplicationStart" returnType="boolean" output="false"&gt;
		
		&lt;!---set some variables for DB, cfmail, and common emails used throughout site---&gt;
		
		&lt;cfscript&gt;
			application.dsn = "xxx";
			application.dev = "xxx-dev";
			application.root_url = "http://www.cnn.com";
			application.rootmap = "/cnn";
		&lt;/cfscript&gt;
		
		
		&lt;CFIF CGI.SERVER_NAME IS NOT "www.cnn.com"&gt;
			&lt;CFLOCATION url="http://www.cnn.com#CGI.SCRIPT_NAME#" addtoken="no"&gt;
		&lt;/CFIF&gt;
		
		&lt;!---set path for Doug Hughes Reactor---&gt;
		
			&lt;CFSET Application.Reactor = CreateObject("Component", "reactor.reactorFactory").init(expandPath(".") & "/reactor.xml") /&gt;
		
		&lt;!---set paths for other frequently used components-the memLib is the one I was talking about yesterday---&gt;
		
			&lt;CFSET Application.Boo = CreateObject("Component", "model.util").init() /&gt;
			
			&lt;cfset APPLICATION.memLib = CreateObject("component", "model.services.memberservice").Init()/&gt;
		
		&lt;!---set structs to work with Reactor files---&gt;
			&lt;CFSET application.relationshipcodes = structnew()&gt;
			&lt;CFSET structinsert(application.relationshipcodes,"", "")&gt;
			&lt;CFSET structinsert(application.relationshipcodes,"1", "Head Of Household")&gt;
			&lt;CFSET structinsert(application.relationshipcodes,"2", "Spouse")&gt;
			&lt;CFSET structinsert(application.relationshipcodes,"3", "Child")&gt;
			&lt;CFSET structinsert(application.relationshipcodes,"4", "Other")&gt;
		
			
		&lt;CFSCRIPT&gt;
			memberDOB = createDate(year(now())-12,month(now()),day(now()));
			gateway = Application.Reactor.createGateway("State");
			
			query = gateway.createquery();
		
			where = query.getWhere();
			where.isIN("state","country_id",'182,267');
			
			Application.stateQuery = gateway.getByQuery(query);
		&lt;/CFSCRIPT&gt;

		
		&lt;cfreturn true&gt;
		
		  &lt;/cffunction&gt;
		
		 &lt;cffunction
                name="OnRequestStart"
                access="public"
                returntype="boolean"
                output="false"
                hint="Fires when prior to page processing."&gt;

                &lt;cfif StructKeyExists( URL, "reset" )&gt;
					&lt;cfset THIS.OnApplicationStart() /&gt;
                &lt;/cfif&gt;

              
                &lt;cfreturn true /&gt;
      
		&lt;/cffunction&gt;
	
		&lt;cffunction name="onError" returnType="void" output="true"&gt;
		&lt;cfargument name="exception" required=true&gt;
		&lt;cfargument name="eventName" type="string" required=true&gt;

		&lt;cfmail to="#application.web#" from="#application.web#" subject="Error in #application.applicationName#" type="html"&gt;
		&lt;cfoutput&gt;
		&lt;h2&gt;An error occured!&lt;/h2&gt;
		&lt;p&gt;
		Page: #cgi.script_name#?#cgi.query_string#&lt;br&gt;
		Time: #dateFormat(now())# #timeFormat(now())#&lt;br&gt;
		&lt;/p&gt;
		
		&lt;cfdump var="#arguments.exception#" label="Exception"&gt;
		&lt;cfdump var="#url#" label="URL"&gt;
		&lt;cfdump var="#form#" label="Form"&gt;
		&lt;cfdump var="#cgi#" label="CGI"&gt;
		&lt;/cfoutput&gt;
		&lt;/cfmail&gt;
		
		&lt;cfoutput&gt;
		&lt;h2&gt;We are sorry...&lt;/h2&gt;
		
		&lt;p&gt;
		An error has occured while processing your request. Please do not be alarmed.
		We have sent an error message to the monkeys who coded this site and once they
		wake up from their four hour naps, they will attend to this bug.
		&lt;/p&gt;
		&lt;/cfoutput&gt;
		
	&lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code>

And here were the notes I wrote back to him with. These are in no particular order.

I'm not a big fan of structInsert. It's not bad - just extra typing:

<code>
&lt;CFSET application.membercodes = structnew()&gt;
&lt;CFSET structinsert(application.membercodes,"1", "Active Member")&gt;
&lt;CFSET structinsert(application.membercodes,"2", "Prospective Member")&gt;
</code>

I'd switch to:

<code>
&lt;cfset application.membercode[1] = "ActiveMember"&gt; 
</code>

<hr />

Snippet from onApplicationStart:

<code>
&lt;CFSCRIPT&gt;
memberDOB = createDate(year(now())-12,month(now()),day(now()));
gateway = Application.Reactor.createGateway("State");
query = gateway.createquery();
where = query.getWhere();
where.isIN("state","country_id",'182,267');
Application.stateQuery = gateway.getByQuery(query);
        &lt;/CFSCRIPT&gt;
</code>


The variables above (except for the Application variable) should be var scoped. The Application.cfc follows the same rules for var scoping as any other normal CFC or UDF.

<hr />

<code>
&lt;cfif StructKeyExists( URL, "reset" )&gt;
  &lt;cfset THIS.OnApplicationStart() /&gt;
&lt;/cfif&gt;
</code>

This is bad. Remove the This. When you are in a CFC and do

<code>
this.x()
</code>

You are doing an "outside" call to the CFC. So if x was access=private, it would fail. Just do x().