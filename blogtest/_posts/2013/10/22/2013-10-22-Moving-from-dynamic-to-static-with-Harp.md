---
layout: post
title: "Moving from dynamic to static with Harp"
date: "2013-10-22T14:10:00+06:00"
categories: [coldfusion,development]
tags: []
banner_image: 
permalink: /2013/10/22/Moving-from-dynamic-to-static-with-Harp
guid: 5065
---

<p>
I cut my teeth as a web developer building dynamic web sites, but more and more lately I'm finding that I don't need to do as much on the server. In fact, in some cases I don't need a back end server at all. Today I decided to take a stab at converting a dynamic web site to static using the <a href="http://harpjs.com/">Harp</a> framework</a>.
</p>
<!--more-->
<p>
Harp is a lightweight web server with built in processors for multiple different languages (Markdown, Jade, EJS, LESS, Stylus, and CoffeeScript). It follows a simple convention that makes it easy to layout a simple web site. After installing you can get up and running in seconds. You should definitely check out the <a href="http://harpjs.com/docs/">documentation</a> yourself (but note - I saw some layout issues in Chrome so you may want to use Firefox instead). 
</p>

<p>
But the real killer feature though is that once you've built your site, you can convert the entire thing into a static version with one command.
</p>

<p>
You may ask - why would you even bother? If I'm building a simple 3-4 page site, what is the benefit?
</p>

<p>
I went through this myself a few months ago when I built a site for a family friend. She is an artist (<a href="http://louisianawatercolors.com/">http://louisianawatercolors.com/</a>) and basically needed a quick web site she could use to showcase some work and add contact information. I picked up a web site template and everything was cool until I realized I needed to make a few tweaks to the template. This was <i>after</i> I had built out the site. It certainly wasn't a big deal, I just edited 5 files, but where Harp shines is that I could have done this in <b>one</b> layout file and simply generated a new build at once.
</p>

<p>
For my experiment, I decided to rebuild my oldest (still living) web site, <a href="http://www.whatthethundersaid.org">What the Thunder Said</a>. This is a site I built in 1996 (yes, they had the Internet back then) as a class project. The HTML is horrible. Now, horrible is a bit too nice. If you view source you'll see tables, font tags, and, I'm sorry to say, tags in all caps. I'm sorry. But I also thought it would be a perfect candidate for conversion.
</p>

<p>
The ColdFusion version of the site was "dynamic", but only minimally so. I used a ColdFusion template for layout. On top of that there was a contact form and forums. No one used the forums or the contact form in the past five years so I decided they could go away. Therefore the only real work I had to do was build out my layout. Let's take a look at the code. (And disclaimer - this is my first Harp site - I probably did it wrong.)
</p>

<p>
First - I decided to go with <a href="http://embeddedjs.com/">EJS</a> for my templating. EJS is ok, not as good as Handlebars, but I absolutely loathe Jade and Harp doesn't support Handlebars yet. (Although it is coming soon apparently.) Using EJS, I could build a simple template like so.
</p>

<pre><code class="language-markup">&lt;html&gt;

&lt;head&gt;
&lt;meta name=&quot;robots&quot; content=&quot;index,follow&quot; &#x2F;&gt;
&lt;meta name=&quot;title&quot; content=&quot;&lt;{% raw %}%- title %{% endraw %}&gt;&quot;&#x2F;&gt;
&lt;meta name=&quot;Description&quot; content=&quot;What the Thunder Said is a site devoted to the life and works of T.S. Eliot.&quot;&gt;
&lt;meta name=&quot;Keywords&quot; content=&quot;t.s. eliot,eliot,T.S. Eliot,poetry,fiction,what the thunder said,thunder,waste land&quot;&gt;
&lt;link rel=&quot;stylesheet&quot; type=&quot;text&#x2F;css&quot; href=&quot;&#x2F;style.css&quot;&gt;
&lt;title&gt;&lt;{% raw %}%- title %{% endraw %}&gt;&lt;&#x2F;title&gt;
&lt;&#x2F;head&gt;

&lt;body bgcolor=&quot;#ac9581&quot; text=&quot;#000000&quot; link=&quot;#490000&quot; vlink=&quot;#490000&quot;&gt;

&lt;{% raw %}%- yield %{% endraw %}&gt;

&lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

<p>
Note - this is a somewhat simpler version of the real template file. In the template, you can see a few tokens. The title value is one, and yield is another. The yield value will be replaced with the HTML of the file being requested. What this means is that I can write an about page and just drop in the content specific to that page.
</p>

<p>
So while it's obvious where the body comes from for a template, what about that title field? In my ColdFusion application, each page passed this as an argument to a layout helper. In Harp, you use a _data.json file to specify values like this. Here is how I did it for my site.
</p>

<pre><code class="language-javascript">{
	"index": {
		"title":"What the Thunder Said: T.S. Eliot"
	},
	"eliot_timeline": {
		"title":"What the Thunder Said: Timeline of T.S. Eliot",
		"header":"timeline"
	},
	"poetry_works": {
		"title":"Works by T.S. Eliot",
		"header":"works"
	},
	"literature_resources": {
		"title":"Resources on T.S. Eliot",
		"header":"res"
	},
	"eliot_etcetera": {
		"title":"Etcetera",
		"header":"etc"
	},
	"poetry_feedback":{
		"title":"Feedback",
		"header":"feedback"
	},
	"404":{
		"title":"File not found",
		"header":"etc"
	}
}</code></pre> 

<p>
In case you are curious, the header value is used by my real layout template to handle changing out the header graphic. 
</p>

<p>
Once I built out the files (and finished shaking my head at how bad my HTML was back then), I then dropped to the command line:
</p>

<p>
<code>harp compile</code>
</p>

<p>
And that's it. Seriously. It parsed my project and spit out pure HTML. Here is the folder for my project. The public folder is where I did my work, and the www folder is the static output.
</p>

<p>
<img src="https://static.raymondcamden.com/images/file.jpg" />
</p>

<p>
If I opened up index.html, I saw the combination of my layout file along with the contents of index.ejs. Ditto for my other files as well. And just to drive the point home - if I find a mistake in my layout (outside of the horrible HTML) - I can edit the file - rebuild my static site - and I'm done.
</p>

<p>
So - the final aspect of this journey was even cooler. <a href="http://gregsramblings.com/">Greg Wilson</a> has been telling me for <i>ages</i> to look into static web site hosting with Amazon S3. Turns out - Amazon's free tier allows for an <i>incredible</i> 20000 requests per month for free. <strong>That's insane!</strong> It is definitely more than I'd need for this site. 
</p>

<p>
If you haven't seen it, Amazon makes the process pretty gentle for creating a web site out of a S3 bucket. You begin in the properties:
</p>

<p>
<img src="https://static.raymondcamden.com/images/s3permissions.jpg" />
</p>

<p>
Next, you need to add a bucket policy. This part is pretty confusing. But I found I could copy the XML from here (<a href="http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteAccessPermissionsReqd.html">http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteAccessPermissionsReqd.html</a>) and just change the bucket name and it worked fine.
</p>

<p>
The final step of the process was a few quick domain/DNS updates at GoDaddy (and thanks again to Greg for the help) and that was it. The first change is a CNAME for the www prefix. That's pretty simple. The next one wasn't so obvious. (Again, thanks to Greg.) In order for foo.com to also work, add a Forwarding rule:
</p>

<p>
<img src="https://static.raymondcamden.com/images/f.jpg" />
</p>

<p>
I've gone from a hosted solution running with Apache and ColdFusion to a completely static solution on S3... for no price. Even better, I still have the power of a dynamic application for generating my files. A win all around I'd say.
</p>

<p>
p.s. As an aside, I just noticed that my titles aren't consistent. It took me about 20 seconds to correct and push to production.
</p>