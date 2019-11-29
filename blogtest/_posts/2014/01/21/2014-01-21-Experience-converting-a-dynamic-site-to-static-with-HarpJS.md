---
layout: post
title: "Experience converting a dynamic site to static with HarpJS"
date: "2014-01-21T17:01:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2014/01/21/Experience-converting-a-dynamic-site-to-static-with-HarpJS
guid: 5134
---

<p>
Yesterday I <a href="http://www.raymondcamden.com/index.cfm/2014/1/20/Some-quick-HarpJS-Tips">blogged</a> some tips for working with HarpJS. These tips came about from working on my latest project, the conversion of dynamic site into a static one. In this blog post I thought I'd share the experience. I <a href="http://www.raymondcamden.com/index.cfm/2013/10/22/Moving-from-dynamic-to-static-with-Harp">blogged</a> about this before, but the last site was <i>very</i> simple and nearly 15 years old. This time I worked on something a bit more beefy - the <a href="http://www.coldfusioncookbook.com">ColdFusion Cookbook</a>.
</p>
<!--more-->
<p>
The ColdFusion Cookbook was built about five or so years ago. It used a ColdFusion MVC framework (Model-Glue) and MySQL for the back end. It wasn't terribly complex, consisting of the following features/views:
</p>

<ul>
<li>A home page that reported the last few entries added
<li>Categories that listed related content
<li>An entry view page with color coding and tag/feature linking (so if an entry mentioned ColdFusion tag X it would be detected and linked to in the official docs)
<li>A basic FAQ
<li>A submit form to suggest new content
<li>A RSS feed
<li>PDF generation of the entire content set for download
<li>And an Admin tool for editing categories and content
</ul>

<p>
The site gets around 4000 page views a month, so it wasn't high traffic, but certainly not terrible either. (It makes a bit of money as well - enough to pay the domain fees a few times over.) Content submissions though have dwindled to - well - nothing. I got an entry when I recently reopened it, but nothing since then. To me this was a perfect candidate for moving it to static. I'd still be able to add content (if someone cared to submit any) but I'd not have to worry about the application (or database) server crashing.
</p>

<p>
I began by creating the layout and a simple home page. This was relatively trivial. I basically viewed the HTML version of the page (not the ColdFusion source) and copied and pasted. I use <a href="http://embeddedjs.com/">EJS</a> for my templating because Jade forces you to kill a kitten for every template you write. The difficult aspect was the box in the upper left hand corner.
</p>

<p>
<img src="https://static.raymondcamden.com/images/s11.jpg" />
</p>

<p>
It changes for every file and ends up being a bit complex at times. For the top level pages it is pretty direct, but for categories it is based on the current category being shown. Finally, for entries it is blank. So I ended up with the following logic.
</p>

<pre><code class="language-markup">
&lt;div id=&quot;desc&quot;&gt;
&lt;{% raw %}% if(current.path.length === 1) { %{% endraw %}&gt;	
&lt;h2&gt; &lt;{% raw %}%= public._data[current.path].headertitle %{% endraw %}&gt;&lt;&#x2F;h2&gt;
&lt;p&gt;
&lt;{% raw %}%= public._data[current.path].headertext %{% endraw %}&gt;
&lt;&#x2F;p&gt;
&lt;{% raw %}% }{% endraw %} else if(current.path.length === 2 &amp;&amp; current.path[0] == &quot;category&quot;) {% raw %}{ %{% endraw %}&gt;
	&lt;h2&gt;&lt;{% raw %}%- public.category._data[current.source].title %{% endraw %}&gt;&lt;&#x2F;h2&gt;
	&lt;p&gt;
		&lt;{% raw %}%- public.category._data[current.source].desc %{% endraw %}&gt;
	&lt;&#x2F;p&gt;
&lt;{% raw %}% }{% endraw %} %&gt;
&lt;&#x2F;div&gt;
</code></pre>

<p>
What you see there is logic that looks at both the Current scope (HarpJS passes information about where you are request-wise) as well as the Public scope for a particular category. You create metadata for your content via JSON files. The structure of that metadata is whatever you want - so in my case my categories had a title and a desc field. Here is a snippet.
</p>

<pre><code class="language-javascript">{
	&quot;Application-Management&quot;:{
		&quot;title&quot;:&quot;Application Management&quot;,
		&quot;desc&quot;:&quot;This covers anything related to applications, including session and client tracking.&quot;
	},
	&quot;Caching&quot;:{
		&quot;title&quot;:&quot;Caching&quot;,
		&quot;desc&quot;:&quot;This category covers a full range of caching options and tricks that are available to ColdFusion.&quot;
	},
</code></pre>

<p>
I built this JSON by hand as it was a short list, but I should have automated it. (I did automate a part of the process - more on that in a bit.)
</p>

<p>
The site had 151 entries stored in 2 MySQL tables. One stored the main entry information and another was a join table for entries to categories. I first created an entry template and figured out what made sense with my JSON data. I did this with static data obviously and ensured things worked OK. For example, my home page needed to count the data and list the most recent entries. I went back and forth between using an array versus a simple object and went with the object form as it worked better with HarpJS's built in URL matching system. This resulted in <i>slightly</i> awkward code in my home page template. Note the use of Object.keys below.
</p>

<pre><code class="language-markup">&lt;p&gt;
There are currently &lt;b&gt;&lt;{% raw %}%= Object.keys(public.entries._data).length %{% endraw %}&gt;&lt;&#x2F;b&gt; entries released!
&lt;&#x2F;p&gt;

&lt;h3&gt;Recent Entries&lt;&#x2F;h3&gt;

&lt;p&gt;
&lt;%
	for(var i=0; i&lt;Math.min(10, Object.keys(public.entries._data).length); i++) {
		var key = Object.keys(public.entries._data)[i];
		var entry = public.entries._data[key];
%&gt;
	&lt;a href=&quot;&#x2F;entries&#x2F;&lt;{% raw %}%= key %{% endraw %}&gt;.html&quot;&gt;&lt;{% raw %}%= entry.title %{% endraw %}&gt;&lt;&#x2F;a&gt;&lt;br&#x2F;&gt;
&lt;%
	}
%&gt;
&lt;&#x2F;p&gt;
</code></pre>

<p>
Once I felt like entries were OK with my fake data, I then switched back to ColdFusion. On my dev server I wrote a script that:
</p>

<ul>
<li>Selected all the entries.
<li>Generated a JSON string that I'd copy and paste into my HarpJS app.
<li>Created flat files for every entry. This proved to be a bit difficult as I had some rather intense formatting going on. I had decided to remove the 'auto link' for tags so that was simpler, but I really wanted clean HTML for my entries. Previously I had used some sloppy code that rendered well enough. I probably spent more time on this than any other aspect. But once done I was able to quickly generate all my static content and output crap to copy into the Harp copy.
</ul>

<p>
One final thing I'll show you is the page that categories use to list content. I <a href="http://www.raymondcamden.com/index.cfm/2014/1/2/Some-HarpJS-experiments-involving-categories">blogged</a> about this already so it isn't new, but it was nice to try it out on a real project. This code exists in a partial that is loaded by every category page. 
</p>

<pre><code class="language-markup">&lt;h3&gt;Questions&lt;&#x2F;h3&gt;

&lt;% 
	function getCat(input) {
		for(var c in public.category._data) {
			if(c === input) return public.category._data[c].title;	
		}
	}

	function getEntries(cat,entries) {
		var results = [];
		var keys = Object.keys(entries);
		for(var i=0; i&lt;keys.length; i++) {
			var cats = entries[keys[i]].categories.split(&quot;,&quot;);
			if(cats.indexOf(cat) &gt;= 0) {
				results.push(entries[keys[i]]);	
				results[results.length-1].key = keys[i];
			}
		}
		return results;
	}
	
	var entries = getEntries(getCat(current.source), public.entries._data);
	for(var i=0; i&lt;entries.length; i++) { 
		entry = entries[i];
%&gt;
	&lt;p&gt;
		&lt;a href=&#x27;&#x2F;entries&#x2F;&lt;{% raw %}%- entry.key %{% endraw %}&gt;.html&#x27;&gt;&lt;{% raw %}%- entry.title %{% endraw %}&gt;&lt;&#x2F;a&gt;&lt;br&#x2F;&gt;
	&lt;&#x2F;p&gt;
&lt;{% raw %}% }{% endraw %} %&gt;</code></pre>

<p>
The final step was to run "harp compile" and convert the application into static HTML files. What's fascinating is the change in size. In the screen shot below, the right side is the new version and includes both the source HarpJS and the production out.
</p>

<img src="https://static.raymondcamden.com/images/s21.jpg" />

<p>
To be fair, the old dynamic version had other folders of stuff I wasn't using and a large MVC framework. I ended up removing the PDF version for now since - again - as far as I knew this wasn't something people used. Search used to be driven by Solr. I switched to Google. Something tells me Google knows search. One tip though. Note that my site has a search box in the UI. How do you integrate that with Google's Custom Search tool so that when the page loads, the embedded search will use the initial input?
</p>

<p>
Simple - first - change your form to use GET. Then note the URL parameter used for the field and add it to the Google embed code.
</p>

<pre><code class="language-markup">&lt;gcse:search queryParameterName=&quot;searchterms&quot;&gt;&lt;&#x2F;gcse:search&gt;</code></pre>

<p>
In the code sample above the modification is the addition of queryParameterName. I should also point out I got rid of the contact form. It is certainly possible to replace it (see my article: <a href="http://flippinawesome.org/2013/12/16/moving-to-static-and-keeping-your-toys/">Moving to Static and Keeping Your Toys</a>) but since no one had used it for a while I went with the simpler route (i.e., I tell you to email me). 
</p>

<p>
The <i>final</i> final step was to create a S3 Amazon bucket, upload the files, and update DNS. That's it. I realized during the writing of this article that my dev server was missing the latest entry so I'll be adding that soon. I don't have the fancy web based admin anymore so this will take me about 4 minutes - well worth it in my mind for the peace of mind of having absolutely <b>no</b> back end server I have to worry about. 
</p>

<p>
Want to see the code? I've included a zip of the project in this entry. It includes everything but the custom ColdFusion code to output the static crap.
</p><p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2013%{% endraw %}2Eraymondcamden{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Fcoldfusioncookbook21%{% endraw %}2Ezip'>Download attached file.</a></p>