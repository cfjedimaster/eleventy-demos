---
layout: post
title: "Migrating a Static Site from Harp to Jekyll"
date: "2017-10-23T07:35:00-07:00"
categories: [static sites]
tags: [jekyll]
banner_image: 
permalink: /2017/10/23/migrating-a-static-site-from-harp-to-jekyll
---

So a few weeks back I [blogged](https://www.raymondcamden.com/2017/09/21/quick-note-on-cflib/) about how I was working on an update to [CFLib](http://cflib.org). Specifically - I was looking to migrate to a new static site generator to make it easier to update content. This past weekend I made a lot of progress with my update and I think I'm ready to release the new version. I thought folks might be interested in the details of the rebuild. 

The Current Version
===

The current version of the site is built with [Harp](http://harpjs.com/), the first static site generator (SSG) I used and the impetus for my introduction to the technology as a whole. I've got a soft spot for Harp. It's incredibly simple compared to most SSGs and a quick way to create a simple site. As much as I appreciate Harp, it hasn't been updated in a while and I'm not sure I could recommend it anymore. If you know you're building something *really* simple, maybe, but even then I worry the project isn't going to be around for much longer.

When I was building CFLib, I had to find a way to support the one thousand plus UDFs in a way that would let me tweak the layout if I needed to modify something. Harp, like most SSGs, requires a physical file for each piece of content. (Jekyll actually has an interesting way around that, but that's not important right now.) Each UDF was a one line file where I simply included an EJS file to render the content. So for example:

<pre><code class="language-javascript">&lt;%- partial("_udf.ejs") %&gt;
</code></pre>

And here is the main template. [EJS](http://www.embeddedjs.com/) is kind of a icky templating language. It's flexible and it works, but it reminds me a lot of old ASP sites. 

<pre><code class="language-markup">&lt;%- include(&#x27;..&#x2F;_udf.ejs&#x27;) %&gt;

&lt;%
	&#x2F;&#x2F;need to get udf name
	var udf = public.udfs.getUDFByName(current.source);
	title = udf.name;
%&gt;

&lt;h2&gt;&lt;%- udf.name %&gt;&lt;%- public.udfs.getArgString(udf.args)%&gt;&lt;&#x2F;h2&gt;
&lt;h5 class=&quot;lastUpdated&quot;&gt;Last updated &lt;%- public.udfs.dateFormat(new Date(udf.lastUpdated)) %&gt;&lt;&#x2F;h5&gt;

&lt;div class=&quot;author&quot;&gt;
	&lt;h3&gt;&lt;span&gt;author&lt;&#x2F;span&gt;&lt;&#x2F;h3&gt;
	&lt;p&gt;
	&lt;img src=&quot;&lt;%= public.udfs.gravatar(udf.authorEmail) %&gt;&quot; title=&quot;&lt;%- udf.author %&gt;&quot; class=&quot;img-left gravatar&quot; &#x2F;&gt;
	&lt;span class=&quot;name&quot;&gt;&lt;%= udf.author %&gt;&lt;&#x2F;span&gt; &lt;br&#x2F;&gt;
	&lt;&#x2F;p&gt;	
&lt;&#x2F;div&gt;
&lt;p class=&quot;description&quot;&gt;
	&lt;strong&gt;Version:&lt;&#x2F;strong&gt; &lt;%- udf.version %&gt; |  
	&lt;strong&gt;Requires:&lt;&#x2F;strong&gt; &lt;%- udf.cfVersion %&gt; | 
	&lt;strong&gt;Library:&lt;&#x2F;strong&gt; &lt;a href=&quot;&#x2F;library&#x2F;&lt;%- udf.library %&gt;&quot;&gt;&lt;%- udf.library %&gt;&lt;&#x2F;a&gt;
&lt;&#x2F;p&gt;

&lt;div class=&quot;udfDetails&quot;&gt;	
&lt;p&gt;
	&lt;strong&gt;Description:&lt;&#x2F;strong&gt; &lt;br&#x2F;&gt;
	&lt;%= udf.description %&gt;
&lt;&#x2F;p&gt;
&lt;p&gt;
	&lt;strong&gt;Return Values:&lt;&#x2F;strong&gt; &lt;br&#x2F;&gt;
	&lt;%- udf.returnValue %&gt;						
&lt;&#x2F;p&gt;

&lt;a name=&quot;examples&quot;&gt;&lt;&#x2F;a&gt;&lt;p&gt;&lt;strong&gt;Example:&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;

&lt;pre&gt;&lt;code class=&quot;language-markup&quot;&gt;&lt;%= udf.example %&gt;&lt;&#x2F;code&gt;&lt;&#x2F;pre&gt;

&lt;p&gt;&lt;strong&gt;Parameters:&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;

&lt;%
	if(udf.args.length &gt; 0) {
	
%&gt;
	&lt;table id=&quot;paramsTable&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot;&gt;
		&lt;tr&gt;
			&lt;th&gt;Name&lt;&#x2F;th&gt;
			&lt;th&gt;Description&lt;&#x2F;th&gt;
			&lt;th&gt;Required&lt;&#x2F;th&gt;
		&lt;&#x2F;tr&gt;
		&lt;% for(var i=0;i&lt;udf.args.length;i++) { %&gt;
			&lt;tr&gt;
				&lt;td&gt;&lt;%- udf.args[i].NAME %&gt;&lt;&#x2F;td&gt;
				&lt;td&gt;&lt;%= udf.args[i].DESC %&gt;&lt;&#x2F;td&gt;
				&lt;td&gt;&lt;%- udf.args[i].REQ? &quot;Yes&quot;:&quot;No&quot; %&gt;&lt;&#x2F;td&gt;
			&lt;&#x2F;tr&gt;
		&lt;% } %&gt;
	&lt;&#x2F;table&gt;
&lt;% } else { %&gt;
&lt;p&gt;No arguments.&lt;&#x2F;p&gt;
&lt;% } %&gt;


&lt;p&gt;&lt;strong&gt;Full UDF Source: &lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;
&lt;pre&gt;&lt;code class=&quot;language-&lt;%- udf.tagBased?&quot;markup&quot;:&quot;javascript&quot; %&gt;&quot;&gt;&lt;%= udf.javaDoc %&gt;
&lt;%= udf.code %&gt;&lt;&#x2F;code&gt;&lt;&#x2F;pre&gt;

&lt;div id=&quot;disqus_thread&quot;&gt;&lt;&#x2F;div&gt;
&lt;script type=&quot;text&#x2F;javascript&quot;&gt;
    var disqus_shortname = &#x27;cflib&#x27;;
    var disqus_identifier = &#x27;&lt;%- udf.oldId %&gt;&#x27;;

    &#x2F;* * * DON&#x27;T EDIT BELOW THIS LINE * * *&#x2F;
    (function() {
        var dsq = document.createElement(&#x27;script&#x27;); dsq.type = &#x27;text&#x2F;javascript&#x27;; dsq.async = true;
        dsq.src = &#x27;http:&#x2F;&#x2F;&#x27; + disqus_shortname + &#x27;.disqus.com&#x2F;embed.js&#x27;;
        (document.getElementsByTagName(&#x27;head&#x27;)[0] || document.getElementsByTagName(&#x27;body&#x27;)[0]).appendChild(dsq);
    })();
&lt;&#x2F;script&gt;
&lt;noscript&gt;Please enable JavaScript to view the &lt;a href=&quot;http:&#x2F;&#x2F;disqus.com&#x2F;?ref_noscript&quot;&gt;comments powered by Disqus.&lt;&#x2F;a&gt;&lt;&#x2F;noscript&gt;
&lt;a href=&quot;http:&#x2F;&#x2F;disqus.com&quot; class=&quot;dsq-brlink&quot;&gt;blog comments powered by &lt;span class=&quot;logo-disqus&quot;&gt;Disqus&lt;&#x2F;span&gt;&lt;&#x2F;a&gt;

&lt;&#x2F;div&gt;
</code></pre>

Not pretty, right? But it works. However, you may be asking - where's the data? Most SSGs support something called "front matter", which is basically a way to embed data on the top of a static page. This data is stripped out before rendering so it's not something the public sees, and it can be used across the site in other ways as well. So for example, your home page can show a list of titles from various blog posts where the title is embedded in front matter.

So yeah - Harp doesn't support that. Instead, you store all your data in JSON files. That's fine - I mean - JSON is easy to edit. So when I convert CFLib from dynamic to static, I simply wrote ColdFusion code to read from the database of UDFs and generate one giant JSON file of data. Giant. Like, huge. 

This worked just fine until I actually needed to edit code. I had to escape code, craft a JSON block, insert it at the end of my giant JSON file, and then hope I didn't screw things up. 

It got so bad that - frankly - I just stopped updating. While both traffic and submissions to CFLib has slowed considerably, I know it is still a resource for ColdFusion developers and I absolutely still want it to be available. 

With that in mind - I began the conversion to Jekyll.

The New Version
===

The new version is built with [Jekyll](https://jekyllrb.com/), my current favorite SSG. It doesn't power this site because as much as I like it, speed isn't it's best feature. (And I'll talk a bit more about speed in a bit.) Also, it uses Ruby, which I'm *not* a fan of, but I can get over that. The thing I like most about Jekyll is how flexible it is. Don't get me wrong - I think I can do the same stuff in Hugo that I can with Jekyll, but I swear Hugo seems to fight against me when I'm building something unique. Even the smallest thing in Hugo is awkward. (To me.) On the flip side, in Jekyll, I never worry about it. Assuming I can get past installation weirdnesses, once it's up and running I'm not concerned about being able to build what I need.

The biggest change in the Jekyll version revolves around UDFs. In Harp, a UDF is driven from:

* one mostly empty physical file
* a template file
* getting data from a large JSON packet

In Jekyll, I've still got one physical file per UDF. However now the data is embedded in YAML. The file is still "empty", but the data is much easier to get to. Here's one example.

<pre><code class="language-markup">---
layout: udf
title:  acronym
date:   2013-07-18T07:48:25.000Z
library: StrLib
argString: &quot;sTerms&quot;
author: Jordan Clark
authorEmail: JordanClark@Telus.net
version: 1
cfVersion: CF5
shortDescription: Pass in a set of words to only display its acronym.
tagBased: false
description: |
 Takes a full string of words as input then converts it for proper display in the html &amp;lt;acronym&amp;gt; tag. That way you see the acronym but in most browsers you can put your mouse over the acronym to display its full meaning. I often see acronyms used in Blogs.

returnValue: Returns a string.

example: |
 &lt;cfoutput&gt;I love #acronym( &quot;Hyper Text Markup Language&quot; )#.&lt;&#x2F;cfoutput&gt;

args:
 - name: sTerms
   desc: String to modify.
   req: true


javaDoc: |
 &#x2F;**
  * Pass in a set of words to only display its acronym.
  * 
  * @param sTerms      String to modify. (Required)
  * @return Returns a string. 
  * @author Jordan Clark (JordanClark@Telus.net) 
  * @version 1, July 18, 2013 
  *&#x2F;

code: |
 function acronym(sTerms) {
     return &#x27;&lt;acronym title=&quot;&#x27; &amp; sTerms &amp; &#x27;&quot;&gt;&#x27; &amp; trim( reReplaceNoCase( &quot; &quot; &amp; sTerms &amp; &quot; &quot;, &quot;(\w)\w+\s&quot;, &quot;\1&quot;, &quot;all&quot; ) ) &amp; &#x27;&lt;&#x2F;acronym&gt;&#x27;;
 }

---

</code></pre>

For the most part, the only issue I ran into here was figuring out various YAML aspects. So for example, the `args` portion is an array of structs. In the sample above the array has one element, but I had to find out exactly how it was done. While testing I ran into a few more issues (like needing to escape colons), but for the most part, it worked well. I started off with hard coded UDFs, a few, and once I was convinced my layout was ok I automated it with a Node script.

For comparison's sake, here's the layout using Jekyll's templating language, Liquid.

<pre><code class="language-markup">---
layout: default
---

&lt;h2&gt;{{ page.title }}({{ page.argString }}) &lt;&#x2F;h2&gt;
&lt;h5 class=&quot;lastUpdated&quot;&gt;Last updated {{ page.date | date: &quot;%B %d, %Y&quot; }}&lt;&#x2F;h5&gt;

&lt;div class=&quot;author&quot;&gt;
	&lt;h3&gt;&lt;span&gt;author&lt;&#x2F;span&gt;&lt;&#x2F;h3&gt;
	&lt;p&gt;
	&lt;img src=&quot;{{ page.authorEmail | to_gravatar }}?s=43&quot; title=&quot;{{ page.author }}&quot; class=&quot;img-left gravatar&quot; &#x2F;&gt;
	&lt;span class=&quot;name&quot;&gt;{{ page.author }}&lt;&#x2F;span&gt; &lt;br&#x2F;&gt;
	&lt;&#x2F;p&gt;	
&lt;&#x2F;div&gt;
&lt;p class=&quot;description&quot;&gt;
	&lt;strong&gt;Version:&lt;&#x2F;strong&gt; {{ page.version }} |  
	&lt;strong&gt;Requires:&lt;&#x2F;strong&gt; {{ page.cfVersion }} | 
	&lt;strong&gt;Library:&lt;&#x2F;strong&gt; &lt;a href=&quot;&#x2F;library&#x2F;{{ page.library }}&quot;&gt;{{ page.library}}&lt;&#x2F;a&gt;
&lt;&#x2F;p&gt;
&lt;div class=&quot;udfDetails&quot;&gt;	
&lt;p&gt;
	&lt;strong&gt;Description:&lt;&#x2F;strong&gt; &lt;br&#x2F;&gt;
	{{ page.description }}
&lt;&#x2F;p&gt;
&lt;p&gt;
	&lt;strong&gt;Return Values:&lt;&#x2F;strong&gt; &lt;br&#x2F;&gt;
	{{ page.returnValue }}
&lt;&#x2F;p&gt;

&lt;a name=&quot;examples&quot;&gt;&lt;&#x2F;a&gt;&lt;p&gt;&lt;strong&gt;Example:&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;

&lt;pre&gt;&lt;code class=&quot;language-markup&quot;&gt;{{ page.example | xml_escape }}&lt;&#x2F;code&gt;&lt;&#x2F;pre&gt;

&lt;p&gt;&lt;strong&gt;Parameters:&lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;

{% if page.args %}

&lt;table id=&quot;paramsTable&quot; cellpadding=&quot;0&quot; cellspacing=&quot;0&quot;&gt;
		&lt;tr&gt;
			&lt;th&gt;Name&lt;&#x2F;th&gt;
			&lt;th&gt;Description&lt;&#x2F;th&gt;
			&lt;th&gt;Required&lt;&#x2F;th&gt;
        &lt;&#x2F;tr&gt;
        {% for arg in page.args %}
			&lt;tr&gt;
				&lt;td&gt;{{ arg.name }}&lt;&#x2F;td&gt;
				&lt;td&gt;{{ arg.desc }}&lt;&#x2F;td&gt;
				&lt;td&gt;
                    {% if arg.req %}
                    Yes
                    {% else %}
                    No
                    {% endif %}
                &lt;&#x2F;td&gt;
			&lt;&#x2F;tr&gt;
		{% endfor %}
	&lt;&#x2F;table&gt;
{% else %}
    &lt;p&gt;No arguments.&lt;&#x2F;p&gt;
{% endif %}


&lt;p&gt;&lt;strong&gt;Full UDF Source: &lt;&#x2F;strong&gt;&lt;&#x2F;p&gt;
&lt;pre&gt;&lt;code class=&quot;language-{% if page.tagBased %}markup{% else %}javascript{% endif %}&quot;&gt;{{ page.javaDoc | xml_escape }}{{ page.code | xml_escape }}&lt;&#x2F;code&gt;&lt;&#x2F;pre&gt;

&lt;&#x2F;div&gt;
</code></pre>

Personally, I like this a heck of a lot better. 

There's more to it of course, but you can see the entire source code up on GitHub: [https://github.com/cfjedimaster/cflib2017](https://github.com/cfjedimaster/cflib2017)

There's only one feature missing now I want to add back in and that's Disqus support. All I'm missing for that is getting an ID value into the front matter that I'll need to do via my generator script. (You can see that in the repo, named `generate.js`.) I went ahead and got rid of the RSS feed because honestly there aren't enough updates to the site to make it worthwhile.

Now for the cool part - hosting. I've blogged about [Netlify](https://www.netlify.com/) before. They host my blog and have an incredible service. While CFLib currently runs on [Surge.sh](https://surge.sh/), and it is a cool service, I prefer the power of Netlify. 

With Netlify, the new CFLib gets - out of the box with me literally clicking a checkbox or two:

* CDN distribution
* Asset optimization (images, JS, CSS)
* free https

And automatic deployment. I literally commit my code to the repo and Netlify kicks off an update. You can see the Netlify version here: https://cflib.netlify.com/.

How has performance improved? To be fair, the new site does not have Disqus yet, nor Adsense (I'm not sure I'll keep that), but using Pingdom's test at https://tools.pingdom.com, the original site had these metrics:

![CFLib1](https://static.raymondcamden.com/images/2017/10/cflib1.png)

And here is the Netlify/Jekyll version:

![CFLib2](https://static.raymondcamden.com/images/2017/10/cflib2.png)

Damn tootin'. What's cool is that since Netlify can build from GitHub, all someone needs to do to submit a new UDF or a fix is to make a pull request. Once I approve it, it's online about 5 minutes later. <strong>I love that.</strong> 

And It Will Be Live...
===

Um, yeah, good question. So as I said, the Disqus integration is the only thing missing and it's probably a 5 minute fix, but I've got some intense travel coming up very soon where it will be difficult to manage any issues if things go wrong. So I either do it in the next few days or around Thanksgiving. I amy just saw screw it and push it tonight - we will see. Anyway, if you spot any problems on the Netlify version, please let me know in the comments below.