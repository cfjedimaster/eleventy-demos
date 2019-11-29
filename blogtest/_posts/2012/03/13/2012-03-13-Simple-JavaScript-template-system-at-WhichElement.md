---
layout: post
title: "Simple JavaScript template system at WhichElement"
date: "2012-03-13T12:03:00+06:00"
categories: [html5,javascript]
tags: []
banner_image: 
permalink: /2012/03/13/Simple-JavaScript-template-system-at-WhichElement
guid: 4559
---

Yesterday Terry Ryan <a href="http://www.terrenceryan.com/blog/post.cfm/whichelement-com">announced</a> the launch of WhichElement.com, a site dedicated to the semantic side of HTML5. This is an area I had not dug into a lot previously. Terry is quite passionate about it and because of this I've taken a deeper look at the topic and found it to be quite interesting. I highly encourage you to check out the <a href="http://www.whichelement.com">site</a> and <a href="http://whichelement.com/contribute/">participate</a> in the discussion. I thought I'd take a few minutes and discuss a bit about the technology in use on the site.

<p/>
<!--more-->
As Terry mentioned in his blog post, he wanted the site to be as lightweight as possible. This meant no back-end server, no database, etc. Basically just a simple web server and that's it. This presented a problem for content creators though. We wanted to make it as easy as possible for folks to write new articles. In order to make it easier for contributors, we wanted to minimize the size of the template they had to use. This also made it easier on us. If we ever changed the header, for example, it would suck to have to manually go through all of the articles and update each one. 

<p/>

Obviously a server-side solution would make this trivial. You would take your article template and simply add directives to include a global header and footer. (Technically you could also use Server Side Includes. Does anyone still use those?) But without a server-side program in place, what could we do?

<p/>

For my solution I came up with - what I thought - was a simple enough technique. Given a request for an article, let's say something like so: whichelement.com/articles.html?article=address, I would use JavaScript to handle:

<p/>

<ul>
<li>Parsing in the requested content, in this case "address"
<li>Performing an Ajax request to load in the address content, which would be a file with minimal layout and focused entirely on the specific content of the article
</ul>

<p/>

This turned out to be rather simple. JavaScript gives you access to the URL. Given that, it's then trivial to do an Ajax request to get the content. We decided it would be nice to make the URLs a bit cleaner. If you go to the site now, you can see the form we have in place: http://whichelement.com/concepts/address. To get this to work, I "cheated" a bit and made use of an Apache URL rewrite scheme:

<p/>

<code>
RewriteCond {% raw %}%{REQUEST_FILENAME}{% endraw %} !-f
RewriteCond {% raw %}%{REQUEST_FILENAME}{% endraw %} !-d
RewriteRule ^(.*)$ engine.html [QSA,L]
</code>

<p/>

This logic notices a request for a non existent file/folder and rewrites the request to engine.html. The engine file contains the basic site template with certain aspects empty. Back on the JavaScript side we have this being run on startup:

<p/>

<code>
function doRoute(folder) {
    var loc = window.location.href;

    //strip final / if there
    if(loc.substr(loc.length-1,1) == "/") loc = loc.substr(0,loc.length-1);
    var parts = loc.split("/");
    var target = parts[parts.length-1];
    window.document.title = target + " "+window.document.title;
    $("#tagcrumb").text(target);
    $.ajax({
        url:folder+target+"/index.html",
        success:function(res,code) {
            $("#mainArticle").html(res);
            resizeFooter();
        },
        error:function(err) {
            //assume 404 and load in badtag.html, it better exist...
            $("#mainArticle").load(folder+"bad/index.html");
            $("#tagcrumb").text("unobtainium");
        }

    });

};
</code>

<p/>

The argument, folder, is simply an abstraction. We've got two instances of this engine in place, so the folder argument lets me specify which one is in use. You can see the URL parsing, and really, after that it's just a URL request and content update. Here's an example of one of the content files on the site:

<p/>

<code>
&lt;header&gt;
	&lt;h1&gt;Address&lt;/h1&gt;
	&lt;p&gt;A postal address, where someone would deliver mail.&lt;/p&gt;
&lt;/header&gt;


&lt;figure class="example" &gt;
	&lt;img src="/concepts/articles/address/address_example.jpg" width="299" height="227" alt="An example address" /&gt;
	&lt;figcaption&gt;An example address, as if you had no idea what &lt;q&gt;postal address&lt;/q&gt; meant.&lt;/figcaption&gt;
&lt;/figure&gt;

&lt;h2&gt;Overview&lt;/h2&gt;

&lt;p&gt;It's seems straight-forward, there is an element named &lt;address&gt;.  Case closed right?
It's not so simple, the spec has something to say. &lt;/p&gt;

&lt;h2&gt;Candidates&lt;/h2&gt;
&lt;ul&gt;
	&lt;li&gt;&lt;a href="/elements/address"&gt;&lt;address&gt;&lt;/a&gt;&lt;/li&gt;
	&lt;li&gt;A collection of &lt;a href="/elements/div"&gt;&lt;div&gt;&lt;/a&gt; and &lt;a href="/elements/span"&gt;&lt;span&gt;&lt;/a&gt; elements.&lt;/li&gt;
&lt;/ul&gt;

&lt;p&gt;At first glance it would seem &lt;address&gt; would be the right choice, it's called &lt;em&gt;address&lt;/em&gt; for goodness' sake.  But alas, as per the specification, address in the context of an &lt;abbr&gt;HTML5&lt;/abbr&gt; element &lt;address&gt; means &lt;q&gt;To whom should I &lt;strong&gt;address&lt;/strong/&gt; my issue with this piece of content.&lt;/q&gt; So in this case it is referring to the authors of the article or the maintainer of the page.  If in that context, a postal address makes sense then you can use it, otherwise postal addresses should be otherwise marked up.&lt;/p&gt;
	
	
&lt;h2&gt;Verdict&lt;/h2&gt;
&lt;p&gt;We reccomend a collection of &lt;a href="/elements/div"&gt;&lt;div&gt;&lt;/a&gt; and &lt;a href="/elements/span"&gt;&lt;span&gt;&lt;/a&gt; elements because the spec clearly states &lt;address&gt; is not the correct element ot use.
&lt;/p&gt;	

&lt;h2&gt;Further Reading&lt;/h2&gt;
&lt;ul class="optionlist"&gt;
	&lt;li&gt;&lt;a href="http://html5doctor.com/the-address-element/"&gt;HTML5 Doctor -&gt; The Address Element&lt;/a&gt;&lt;/li&gt;
	&lt;li&gt;&lt;a href="http://dev.w3.org/html5/spec/the-address-element.html#the-address-element"&gt;w3c -&gt; The address element&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
</code>

<p/>

I think you will agree - this is pretty darn slim. There's one last piece to this puzzle I want to share. The solution I created worked fine, but with one exception. If a non-JavaScript capable browser came to the site, they would see nothing. (Well, no content.) I was perfectly happy with that <i>outside of</i> the fact that Google's search engine would also see nothing. I added a slight tweak to my Apache rewrite rule to simply bypass it for Google's search bot:

<p/>

<code>
RewriteEngine On

RewriteCond {% raw %}%{HTTP_USER_AGENT}{% endraw %} ^Googlebot.*
RewriteRule ^(.*)$	/concepts/articles/$1.html [L]

RewriteCond {% raw %}%{REQUEST_FILENAME}{% endraw %} !-f
RewriteCond {% raw %}%{REQUEST_FILENAME}{% endraw %} !-d
RewriteRule ^(.*)$ engine.html [QSA,L]
</code>

<p/>

So - any comments on this technique? It seems to be working well, but obviously with the site going live just yesterday, I definitely assume there are going to be some edge cases.

<p/>

p.s. I had to edit the code sample for Address to remove the code tag. My blog uses the code tag to do highlighting. I wanted to be sure that was out in the open so that if anyone compares it to what they see in Firebug, they knew I wasn't trying to make the template seem even smaller than it really is.