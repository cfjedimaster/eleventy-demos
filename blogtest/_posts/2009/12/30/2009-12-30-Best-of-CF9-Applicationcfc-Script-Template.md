---
layout: post
title: "Best of CF9: Application.cfc Script Template"
date: "2009-12-30T13:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/30/Best-of-CF9-Applicationcfc-Script-Template
guid: 3669
---

<img src="https://static.raymondcamden.com/images/cfjedi/bestcfcontest1.jpg" title="Best of ColdFusion 9" align="left" style="margin-right:5px;margin-bottom:5px"/> <b>Note from the Editor, AKA Ray:</b> Well obviously the contest is taking a bit longer to review than I thought. Sorry folks! But so far the entries have been great and I'm happy we have too <b>many</b> entries versus not enough! Anyway, this is, most likely, the last review for 2009. They will continue in 2010. This review was written by <a href="http://www.cfsilence.com">Todd Sharp</a>.
<!--more-->
<p>This contest entry comes from Russ Spivey and is a simple template for cfscript style Application.cfc.  In Russ' words:</p>

<p><blockquote>
This is self-explanatory. I did it because I couldn't find a complete Coldfusion 9 Application.cfc reference, or an example Application.cfc in CFScript, or a good example of documentation for components in CFScript. Method and variable descriptions are from Adobe's documentation. The order of variables and methods are the same as Adobe's. Variables are set to default values (where applicable). Method and argument hints will appear in the CFC explorer.</blockquote></p>

<p>Before I get into this version I should also point out <a href="http://www.danvega.org/blog/index.cfm/2009/12/13/ColdFusion9-Application-cfc-script-reference">Dan Vega's version</a>, which Dan released after Russ created his version.  I only mention Dan's because it offers an alternative and it helped me in reviewing both of the ref's side-by-side (since I'm personally not a user/fan of cfscript). </p>

<p>Russ starts out his reference by setting some attributes in the new 'java doc' style notation:</p>
<code>
/**
@title "Application.cfc reference in CFScript for Coldfusion 9"
@description "This component includes all Application.cfc methods and variables, set to their default values (if applicable). Please note that default values are not always desirable, and some methods or variables should be modified or removed depending on the situation."
@author "Russ Spivey (http://cfruss.blogspot.com)"

@dateCreated "November 29, 2009"
@licence "This work is licensed under the Creative Commons Attribution 3.0 United States License. To view a copy of this license, visit http://creativecommons.org/licenses/by/3.0/us/ or send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA."

@hint "You implement methods in Application.cfc to handle ColdFusion application events and set variables in the CFC to configure application characteristics."
*/

component output="false" {</code>

<p>The first thing that stands out is the lack of a few of the potential component level attributes.  Russ mainly used the component level attribute declaration block for meta info (@title, @author) which is certainly 'OK' to do, but he's missing many of the actual potential component level attributes (like @accessors, @alias, etc) so I'll deduct 100 <cfpoints> for that omission.  I liked that he used the 'java doc' style notation for the meta, but then he used an inline declaration for the 'output' attribute.  I'm a big proponent of consistency and I'd personally prefer choosing one style and sticking with it. </p>

<p>The next part of his reference showed the potential application specific variables (the 'this' scoped vars):</p>

<code>/* **************************** APPLICATION VARIABLES **************************** */

// The application name. If you do not set this variable, or set it to the empty string, your CFC applies to the unnamed application scope, which is the ColdFusion J2EE servlet context.
THIS.name = "foo";

// Life span, as a real number of days, of the application, including all Application scope variables.
THIS.applicationTimeout = createTimeSpan(0, 1, 0, 0);

// Whether the application supports Client scope variables.
THIS.clientManagement = false;

// Where Client variables are stored; can be cookie, registry, or the name of a data source.
THIS.clientStorage = "registry"; //cookie{% raw %}||registry|{% endraw %}|datasource

// Contains ColdFusion custom tag paths.
THIS.customTagPaths = "";

// The Google Maps API key required to embed Google Maps in your web pages.
THIS.googleMapKey = "";

// Name of the data source from which the query retrieves data.
THIS.datasource = "";

// Whether to store login information in the Cookie scope or the Session scope.
THIS.loginStorage = "cookie"; //cookie||session

// A structure that contains ColdFusion mappings. Each element in the structure consists of a key and a value. The logical path is the key and the absolute path is the value.
THIS.mappings = {};

// Whether to enable validation on cfform fields when the form is submitted.
THIS.serverSideFormValidation = true;

// Whether the application supports Session scope variables.
THIS.sessionManagement = true;

// Life span, as a real number of days, of the user session, including all Session variables.
THIS.sessionTimeout = createTimeSpan(0, 0, 30, 0);

// Whether to send CFID and CFTOKEN cookies to the client browser.
THIS.setClientCookies = true;

// Whether to set CFID and CFTOKEN cookies for a domain (not just a host).
THIS.setDomainCookies = false;

// Whether to protect variables from cross-site scripting attacks.
THIS.scriptProtect = false;

// A Boolean value that specifies whether to add a security prefix in front of the value that a ColdFusion function returns in JSON-format in response to a remote call.
THIS.secureJSON = false;

// The security prefix to put in front of the value that a ColdFusion function returns in JSON-format in response to a remote call if the secureJSON setting is true.
THIS.secureJSONPrefix = "";

// A comma-delimited list of names of files. Tells ColdFusion not to call the onMissingTemplate method if the files are not found.
THIS.welcomeFileList = "";

// A struct that contains the following values: server, username, and password.If no value is specified, takes the value in the administrator.
THIS.smtpServersettings = {};

// Request timeout. Overrides the default administrator settings.
THIS.timeout = 30; // seconds

// A list of ip addresses that need debugging.
THIS.debugipaddress = "";

// Overrides the default administrator settings. It does not report compile-time exceptions.
THIS.enablerobustexception = false;

/* ORM variables */

// Specifies whether ORM should be used for the ColdFusion application.Set the value to true to use ORM. The default is false.
THIS.ormenabled = false;

// The struct that defines all the ORM settings. Documentation: http://help.adobe.com/en_US/ColdFusion/9.0/Developing/WSED380324-6CBE-47cb-9E5E-26B66ACA9E81.html
THIS.ormsettings = {};

// note: THIS.datasource applies to cfquery as well as ORM. It is defined on line 31.
</code>
<p>
Pretty standard and he appears to have nailed everything.  A part of me strongly wishes that Ben Forta would have never used UPPERCASE scope names in the WACK books so that my eyes wouldn't have to bleed every time I see someone else do that, but oh well :).  One minor correction - this.debugipaddress is actually this.debuggingipaddresses (see <a href="http://www.raymondcamden.com/index.cfm/2009/7/13/ColdFusion-9s-new-Application-variables#c2EE4FB47-B864-DABB-DCFFBC5FE56A2C9C">here</a>) - no points deducted for that since it's a doc bug.  I also would have liked to have seen him mention the struct keys for smtpServerSettings ({% raw %}{server="",username="",password=""}{% endraw %}).</p>

<p>The rest of this entry just lays out a skeleton for the various methods within Application.cfc with some helpful comments. </p>

<code>/* **************************** APPLICATION METHODS **************************** */


/**
@hint "Runs when an application times out or the server is shutting down."
@ApplicationScope "The application scope."
*/
public void function onApplicationEnd(struct ApplicationScope=structNew()) {

return;
}


/**
@hint "Runs when ColdFusion receives the first request for a page in the application."
*/
public boolean function onApplicationStart() {

return true;
}


/**
@hint "Intercepts any HTTP or AMF calls to an application based on CFC request."
@cfcname "Fully qualified dotted path to the CFC."

@method "The name of the method invoked."
@args "The arguments (struct) with which the method is invoked."
*/
public void function onCFCRequest(required string cfcname, required string method, required string args) {

return;
}


/**
@hint "Runs when an uncaught exception occurs in the application."
@Exception "The ColdFusion Exception object. For information on the structure of this object, see the description of the cfcatch variable in the cfcatch description."
@EventName "The name of the event handler that generated the exception. If the error occurs during request processing and you do not implement an onRequest method, EventName is the empty string."

note: This method is commented out because it should only be used in special cases
*/
/*
public void function onError(required any Exception, required string EventName) {
return;
}
*/


/**
@hint "Runs when a request specifies a non-existent CFML page."
@TargetPage "The path from the web root to the requested CFML page."
note: This method is commented out because it should only be used in special cases
*/
/*
public boolean function onMissingTemplate(required string TargetPage) {
return true;
}
*/


/**
@hint "Runs when a request starts, after the onRequestStart event handler. If you implement this method, it must explicitly call the requested page to process it."
@TargetPage "Path from the web root to the requested page."
note: This method is commented out because it should only be used in special cases
*/
/*
public void function onRequest(required string TargetPage) {
return;
}
*/


/**
@hint "Runs at the end of a request, after all other CFML code."

*/
public void function onRequestEnd() {
return;

}


/**
@hint "Runs when a request starts."
@TargetPage "Path from the web root to the requested page."
*/
public boolean function onRequestStart(required string TargetPage) {

return true;
}


/**
@hint "Runs when a session ends."
@SessionScope "The Session scope"

@ApplicationScope "The Application scope"
*/
public void function onSessionEnd(required struct SessionScope, struct ApplicationScope=structNew()) {

return;
}


/**
@hint "Runs when a session starts."
*/
public void function onSessionStart() {

return;
}

}</code>

<p>
Overall it's a handy reference for folks.  Nice job Russ!</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fupdatedapplication%{% endraw %}5Fcfcincfscriptreference1%2Ezip'>Download attached file.</a></p>