---
layout: post
title: "Triple Related Selects (and interesting CFDIV trick)"
date: "2008-09-14T21:09:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/09/14/Triple-Related-Selects-and-interesting-CFDIV-trick
guid: 3015
---

Last week I helped a user who was having problems with a multi-related select application. You've probably seen the ColdFusion 8 related selects example before, where one drop down drives the content for another. His code was a bit more complex since he had three drop downs in play instead of two. The main problem he had though was in dealing with the second and third selects when the page loaded. After selecting items in his drop downs everything worked fine, but that initial load kept throwing errors. 

Lets take a look at his front end code first:

<pre><code class="language-markup">
&lt;cfform name="Localiza"&gt;
&lt;table&gt;
&lt;tr&gt;
&lt;td width="100"&gt;Division:&lt;/td&gt;
&lt;td width="150"&gt;
&lt;cfselect name="SelDivision" bind="cfc:Places.GetDivision()"
		display="DsDivision" value="IdDivision" BindOnLoad="true"/&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;
&lt;td width="100"&gt;State:&lt;/td&gt;
&lt;td width="150"&gt;
&lt;cfselect name="SelState" bind="cfc:Places.GetState({% raw %}{SelDivision}{% endraw %})"
		display="DsState" value="IdState" /&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;tr&gt;
&lt;td width="100"&gt;County:&lt;/td&gt;
&lt;td width="150"&gt;
&lt;cfselect name="SelCounty" bind="cfc:Places.GetCounty({% raw %}{SelDivision}{% endraw %},{% raw %}{SelState}{% endraw %})"
		display="DsCounty" value="IdCounty"/&gt;&lt;/td&gt;&lt;/tr&gt;
&lt;/table&gt;
&lt;/cfform&gt;
</code></pre>

Nothing too complex here. The first drop down asks a CFC for a list of divisions. The second drop down is bound to that value. The third drop down is then bound to the first two. 

I had him simply debug that arguments being sent to the CFC methods, and as you can probably guess, the drop downs were getting null values for their arguments on the initial load. 

To fix this, I recommended that both the getState and getCounty methods should look for empty values being passed. Here is the complete CFC. Notice in the two latter methods how he handles and responds to the empty values.

<pre><code class="language-markup">
&lt;cfcomponent&gt;

&lt;cfinclude template="QryPlaces.cfm"&gt;

    &lt;cffunction name="GetDivision" access="remote" returnType="query"&gt;
        &lt;cfquery name="LstDivision" dbtype="query"&gt;
            SELECT IdDivision, DsDivision
            FROM Division
            ORDER BY DsDivision
        &lt;/cfquery&gt;
        &lt;cfreturn LstDivision&gt;
    &lt;/cffunction&gt;

    &lt;cffunction name="GetState" access="remote" returnType="query"&gt;
    &lt;cfargument name="Division" type="any" required="true"&gt;
    &lt;cfif ARGUMENTS.Division EQ ""&gt;
    	&lt;cfset LstState = QueryNew("IdDivision, IdState, DsState", "Integer, Integer, Varchar")&gt;
    &lt;cfelse&gt;
        &lt;cfquery name="LstState" dbtype="query"&gt;
            SELECT IdDivision, IdState, DsState
            FROM State
            WHERE IdDivision = #ARGUMENTS.Division#
            ORDER BY DsState
        &lt;/cfquery&gt;
    &lt;/cfif&gt;
    &lt;cfreturn LstState&gt;
    &lt;/cffunction&gt;

    &lt;cffunction name="GetCounty" access="remote" returnType="query"&gt;
    &lt;cfargument name="Division" type="any" required="true"&gt;
    &lt;cfargument name="State" type="any" required="true"&gt;
	&lt;cfif ARGUMENTS.Division EQ "" OR ARGUMENTS.State EQ ""&gt;
    	&lt;cfset LstCounty = QueryNew("IdDivision, IdState, IdCounty, DsCounty", "Integer, Integer, Integer, Varchar")&gt;
    &lt;cfelse&gt;
        &lt;cfquery name="LstCounty" dbtype="query"&gt;
            SELECT IdDivision, IdState, IdCounty, DsCounty
            FROM County
            WHERE IdDivision = #ARGUMENTS.Division# AND
			IdState = #ARGUMENTS.State#
            ORDER BY DsCounty
        &lt;/cfquery&gt;
    &lt;/cfif&gt;
    &lt;cfreturn LstCounty&gt;
    &lt;/cffunction&gt;

&lt;/cfcomponent&gt;
</code></pre>

Yes, he is missing var statements and cfqueryparam tags. So these changes did solve his initial load problem. I'd also probably recommend slimming down his queries a bit. So for example, the third drop down uses dsCount and IdCountry, but his CFC method is returning four columns. Now on one hand, it's nice to be able to use the exact same code for your Ajax code as you would for other code. But if this CFC is only being used for Ajax, he may want to trim down the query for performance reasons. While JSON is used to pass the data to the client and is pretty slim, there is no reason not to make that as small as possible. 

Ok, so all in all, a rather simple issue, and I thought folks might like to see this in action. The user, Rigo, was kind enough to take his code and package it up with fake query data. You can download it below, and run a live demo <a href="http://www.raymondcamden.com/demos/threeselects/places.cfm">here</a>. Now for the kind of cool part. I noticed when running his demo that the three values for the drop downs were being displayed on the page. He did this with this code:

<pre><code class="language-markup">
&lt;cfdiv name="despliegue" bind="{% raw %}{SelDivision}{% endraw %},{% raw %}{SelState}{% endraw %},{% raw %}{SelCounty}{% endraw %}"&gt;&lt;/cfdiv&gt;
</code></pre>

Note the bind statement. No URL, CFC, or JavaScript function is in use here. All he did was use the bound values. On a whim, I changed it to (and this is what you see in the live demo):

<pre><code class="language-markup">
&lt;cfdiv name="despliegue" bind="static - {% raw %}{SelDivision}{% endraw %},{% raw %}{SelState}{% endraw %},{% raw %}{SelCounty}{% endraw %}"&gt;&lt;/cfdiv&gt;
</code></pre>

And this worked perfectly fine as well. I had no idea this would work, but I guess if you don't specify URL, CFC, or javascript, than ColdFusion treats it as a literal string result for the div. I'm not sure how I'd use that in production, but for debugging it's pretty useful.

<a href="https://static.raymondcamden.com/enclosures/RelatedSelectsPlaces.zip">Download attached file.</a>