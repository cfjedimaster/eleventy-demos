---
layout: post
title: "Using MobileFirst SQL Adapters with an Ionic Application"
date: "2015-04-02T16:00:44+06:00"
categories: [development,javascript,mobile]
tags: [ionic,mobilefirst]
banner_image: 
permalink: /2015/04/02/using-mobilefirst-sql-adapters-with-an-ionic-application
guid: 5939
---

As I continue my look at integrating <a href="http://www.ibm.com/mobilefirst/us/en/">MobileFirst</a> and <a href="http://ionicframework.com/">Ionic</a>, today I'm going to look at the SQL Adapter. MobileFirst Adapters are server-side components that connect your hybrid mobile application to other things. Those "things" being generally broken down into a few categories, and a few specific adapter types. The SQL adapter is, as you can guess, a connection to a database.

<!--more-->

So at this point you may be thinking - isn't that what I'd use ColdFusion, or Node, or heck, even PHP for? Sure - this is traditionally something an application server would handle. But MobileFirst lets you skip installing a complete application server where your needs may be met by a simpler adapter. If you've ever written server-side code that literally takes in a HTTP request, calls a simple SQL statement, and then just spits out JSON, then you really don't need a complete separate application server for that. The SQL adapter will handle that for you out of the box - and much easier.

Creating an adapter is simple. Inside a MobileFirst project, simply type <code>mfp add adapter</code>. You'll be prompted to enter a name and then select the type:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/bp1.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/bp1.png" alt="bp1" width="509" height="164" class="alignnone size-full wp-image-5940" /></a>

Select the one you want (in our case, SQL), and then just accept the default for the next question.

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/bp2.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/bp2.png" alt="bp2" width="700" height="111" class="alignnone size-full wp-image-5941" /></a>

This will create two files under your adapters folder: MyAdapterTest.xml and MyAdapterTest-impl.js. Both the directory these are created under and the names themselves are based on the name of the adapter you chose. Let's first look at the XML file.

<pre><code class="language-markup">&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;!--
    Licensed Materials - Property of IBM
    5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
    US Government Users Restricted Rights - Use, duplication or
    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
--&gt;
&lt;wl:adapter name=&quot;MyAdapterTest&quot;
	xmlns:xsi=&quot;http:&#x2F;&#x2F;www.w3.org&#x2F;2001&#x2F;XMLSchema-instance&quot; 
	xmlns:wl=&quot;http:&#x2F;&#x2F;www.ibm.com&#x2F;mfp&#x2F;integration&quot;
	xmlns:sql=&quot;http:&#x2F;&#x2F;www.ibm.com&#x2F;mfp&#x2F;integration&#x2F;sql&quot;&gt;

	&lt;displayName&gt;MyAdapterTest&lt;&#x2F;displayName&gt;
	&lt;description&gt;MyAdapterTest&lt;&#x2F;description&gt;
	&lt;connectivity&gt;
		&lt;connectionPolicy xsi:type=&quot;sql:SQLConnectionPolicy&quot;&gt;
			&lt;!-- Example for using a JNDI data source, replace with actual data source name --&gt;
			&lt;!-- &lt;dataSourceJNDIName&gt;java:&#x2F;data-source-jndi-name&lt;&#x2F;dataSourceJNDIName&gt; --&gt;
			
			&lt;!-- Example for using MySQL connector, do not forget to put the MySQL connector library in the project&#x27;s lib folder --&gt;
			&lt;dataSourceDefinition&gt;
				&lt;driverClass&gt;com.mysql.jdbc.Driver&lt;&#x2F;driverClass&gt;
				&lt;url&gt;jdbc:mysql:&#x2F;&#x2F;localhost:3306&#x2F;mydb&lt;&#x2F;url&gt;
			    &lt;user&gt;myUsername&lt;&#x2F;user&gt;
    			&lt;password&gt;myPassword&lt;&#x2F;password&gt; 
			&lt;&#x2F;dataSourceDefinition&gt;
		&lt;&#x2F;connectionPolicy&gt;
	&lt;&#x2F;connectivity&gt;

	&lt;!-- Replace this with appropriate procedures --&gt;
	&lt;procedure name=&quot;procedure1&quot;&#x2F;&gt;
	&lt;procedure name=&quot;procedure2&quot;&#x2F;&gt;

&lt;&#x2F;wl:adapter&gt;</code></pre>

That's a lot of markup, but you really only need to care about two parts. Under dataSourceDefinition, you can see a class, url, user and password defined. If using MySQL, you can leave the class alone, but <strong>do not forget to grab a copy of the MySQL Jar and copy it to your project!</strong> Modify the URL to point to your MySQL server and database. Finally, set an appropriate username and password.

At the bottom, note the procedure list. This is where you define the various different calls your mobile application is going to make. What those calls are obviously depends on your needs. Now let's look at the JavaScript file.

<pre><code class="language-javascript">&#x2F;*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *&#x2F;

&#x2F;************************************************************************
 * Implementation code for procedure - &#x27;procedure1&#x27;
 *
 *
 * @return - invocationResult
 *&#x2F;
 
var procedure1Statement = WL.Server.createSQLStatement(&quot;select COLUMN1, COLUMN2 from TABLE1 where COLUMN3 = ?&quot;);
function procedure1(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : procedure1Statement,
		parameters : [param]
	});
}

&#x2F;************************************************************************
 * Implementation code for procedure - &#x27;procedure2&#x27;
 *
 *
 * @return - invocationResult
 *&#x2F;
 
function procedure2(param) {
	return WL.Server.invokeSQLStoredProcedure({
		procedure : &quot;storedProcedure2&quot;,
		parameters : [param]
	});
}</code></pre>

Yeah, the first time I saw this, and realized I could write my adapters in JavaScript, I was all like - 

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/60905765.jpg"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/60905765.jpg" alt="60905765" width="262" height="192" class="alignnone size-full wp-image-5942" /></a>

To be clear, this isn't a Node-engine, I'll be talking more about working with JavaScript and MobileFirst tomorrow, but if you can write JavaScript, you can probably handle this just fine. You can see two examples in the default - calling a simple SQL statement (and with a bound parameter) and calling a stored procedure.

And that's really it. You do need to remember to build/deploy when you work on your adapter. When I worked on my demo, I kept one tab open for my adapters and one more my common (HTML, CSS, JS) code so I could build/deploy at will when I needed to. 

For my application I created a simple table called "content" that had text entries, a bit like a blog. I wanted one procedure to list all the content and one to get all the columns for one entry. I began by creating two procedures in the XML:

<pre><code class="language-markup">&lt;procedure name=&quot;getContent&quot;&#x2F;&gt;
&lt;procedure name=&quot;getDetail&quot;&#x2F;&gt;</code></pre>

Looking at it now, getContent feels a bit vague since it can mean one or more things, but you get the idea. Now let's look at the code.

<pre><code class="language-javascript">var getAllStmt = 
WL.Server.createSQLStatement(&quot;select id, title from content order by created desc&quot;);
var getDetailStmt = 
WL.Server.createSQLStatement(&quot;select id, title, body, created from content where id = ?&quot;);

function getContent() {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getAllStmt
	});
}

function getDetail(id) {
	WL.Logger.info(&quot;getDetail, requesting id &quot;+id);
	return WL.Server.invokeSQLStatement({
		preparedStatement : getDetailStmt,
		parameters:[id]
	});
}</code></pre>

So I assume this probably makes sense as is. I'm using the MobileFirst server-side API to create two SQL statements. Notice that the second one has a bound parameter. I then build my two functions with names matching the procedures in the XML. The first simply executes, and returns, all the rows, while the second uses a parameter to return one row.

At this point, even before I try using it in Ionic, I can test it from the command line using <code>mfp invoke</code>. When run, it first asks you to select an adapter, and then a procedure:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/bo3.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/bo3.png" alt="bo3" width="435" height="80" class="alignnone size-full wp-image-5943" /></a>

Select the procedure, optionally enter parameters, and you can then see the result right in your command prompt:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/bp4.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/bp4.png" alt="bp4" width="399" height="383" class="alignnone size-full wp-image-5944" /></a>

You definitely want to make use of this tool as it will be much quicker to debug any possible issues with your adapters here. Alright, now let's turn to the client-side. I'm assuming you've read my earlier posts about using Ionic with MobileFirst. I created a new application with the blank template and set up two simple screens. The first just shows a list of articles:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/iOS-Simulator-Screen-Shot-Apr-2-2015-3.49.06-PM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/iOS-Simulator-Screen-Shot-Apr-2-2015-3.49.06-PM.png" alt="iOS Simulator Screen Shot Apr 2, 2015, 3.49.06 PM" width="750" height="513" class="alignnone size-full wp-image-5945" /></a>

Clicking an item takes you to the detail page:

<a href="http://www.raymondcamden.com/wp-content/uploads/2015/04/iOS-Simulator-Screen-Shot-Apr-2-2015-3.55.35-PM.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/04/iOS-Simulator-Screen-Shot-Apr-2-2015-3.55.35-PM.png" alt="iOS Simulator Screen Shot Apr 2, 2015, 3.55.35 PM" width="750" height="505" class="alignnone size-full wp-image-5946" /></a>

Ok, so how do we use it? I created a service for my Ionic application and wrapped calls to WL.Client.invokeProcedure. This library exists for you automatically in a hybrid application running in the MobileFirst platform. Here is the complete service:

<pre><code class="language-javascript">angular.module(&#x27;starter.services&#x27;, [])

.factory(&#x27;ContentService&#x27;, function($q) {


	function getAll() {
		var data = {
			adapter:&quot;DatabaseAdapter&quot;,
			procedure:&quot;getContent&quot;
		};

		var deferred = $q.defer();

		WL.Client.invokeProcedure(data).then(function(res) {
			deferred.resolve(res.invocationResult.resultSet);
		}, function(bad) {
			console.log(&quot;bad&quot;);
			console.dir(bad);
			deferred.reject(&quot;um something here&quot;);
		});

		return deferred.promise;
	};

	function getOne(id) {
		var data = {
			adapter:&quot;DatabaseAdapter&quot;,
			procedure:&quot;getDetail&quot;,
			parameters:[id]
		};

		var deferred = $q.defer();
		WL.Client.invokeProcedure(data).then(function(res) {
			console.log(&quot;good&quot;);console.dir(res.invocationResult);
			deferred.resolve(res.invocationResult.resultSet[0]);
		}, function(bad) {
			console.log(&quot;bad&quot;);
			console.dir(bad);
			deferred.reject(&quot;um something here&quot;);
		});

		return deferred.promise;
	}

	return {
		getAll:getAll,
		getOne:getOne
	};

});</code></pre>

The calls to invokeProcedure return promises so I simply use a deferred to handle the result. Here is my controller:

<pre><code class="language-javascript">angular.module(&#x27;starter.controllers&#x27;, [])

.controller(&#x27;ListCtrl&#x27;, function($scope, ContentService) {
	console.log(&#x27;ListCtrl loaded&#x27;);

	ContentService.getAll().then(function(results) {
		console.log(results);
		$scope.content = results;
	});

})
.controller(&#x27;DetailCtrl&#x27;, function($scope, $stateParams, ContentService, $timeout) {
	console.log(&#x27;DetailCtrl loaded&#x27;);
	$scope.detail = {};

	ContentService.getOne($stateParams.itemId).then(function(result) {
		console.log(&quot;i got one result&quot;);
		console.dir(result);
		$scope.detail = result;
	});

});</code></pre>

Pretty simple, right? The result data is simply an array of plain JavaScript objects, or in the case of the detail view, one object. Using them in the view layer then is pretty trivial. Here is the list view:

<pre><code class="language-markup">&lt;ion-view view-title=&quot;List&quot;&gt;
	&lt;ion-content class=&quot;padding&quot;&gt;

		&lt;ion-list class=&quot;list list-inset&quot;&gt;

			&lt;ion-item ng-repeat=&quot;item in content&quot; href=&quot;#&#x2F;item&#x2F;{% raw %}{{item.id}}{% endraw %}&quot;&gt;
				{% raw %}{{item.title}}{% endraw %}
			&lt;&#x2F;ion-item&gt;

		&lt;&#x2F;ion-list&gt;

	&lt;&#x2F;ion-content&gt;
&lt;&#x2F;ion-view&gt;</code></pre>

And the detail view:

<pre><code class="language-markup">&lt;ion-view view-title=&quot;Detail&quot;&gt;
	&lt;ion-content class=&quot;padding&quot;&gt;

		&lt;div class=&quot;card&quot;&gt;

		  &lt;div class=&quot;item item-divider&quot;&gt;
		    {% raw %}{{detail.title}}{% endraw %}
		  &lt;&#x2F;div&gt;

		  &lt;div class=&quot;item item-text-wrap&quot;&gt;
		    &lt;p&gt;
				{% raw %}{{detail.body}}{% endraw %}
		    &lt;&#x2F;p&gt;
		  &lt;&#x2F;div&gt;

		  &lt;div class=&quot;item item-divider&quot;&gt;
		    {% raw %}{{detail.created}}{% endraw %}
		  &lt;&#x2F;div&gt;

		&lt;&#x2F;div&gt;

	&lt;&#x2F;ion-content&gt;
&lt;&#x2F;ion-view&gt;</code></pre>

For a video of this process, watch the embed below!
<iframe width="853" height="480" src="https://www.youtube.com/embed/4cPb3KDfwvc?rel=0" frameborder="0" allowfullscreen></iframe>