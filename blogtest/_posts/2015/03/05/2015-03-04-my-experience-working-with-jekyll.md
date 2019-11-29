---
layout: post
title: "My experience working with Jekyll"
date: "2015-03-05T09:56:11+06:00"
categories: [development]
tags: []
banner_image: 
permalink: /2015/03/05/my-experience-working-with-jekyll
guid: 5780
---

Yesterday I <a href="http://www.raymondcamden.com/2015/03/04/hosting-static-sites-with-surge">blogged</a> about the new static-site hosting service, <a href="http://surge.sh">Surge</a>. In order to test it, I decided to rebuild <a href="http://www.javascriptcookbook.com">JavaScript Cookbook</a> as a static site. (Which, to be honest, was a silly decision. Surge takes about five minutes to use. My rewrite took about five hours. ;) I decided to give <a href="http://jekyllrb.com/">Jekyll</a> a try and I thought I'd share my thoughts about the platform. Obviously I've just built one site with it so take what I say with a grain of salt, but if you're considering setting up a static site, maybe this post will be helpful.

<!--more-->
<a href="http://www.raymondcamden.com/wp-content/uploads/2015/03/jekyll.png"><img src="https://static.raymondcamden.com/images/wp-content/uploads/2015/03/jekyll.png" alt="jekyll" width="375" height="166" class="alignnone size-full wp-image-5781" /></a>

Jekyll, like <a href="http://harpjs.com">HarpJS</a>, is run via a command line tool. Unlike Harp, Jekyll is a Ruby-based tool but you don't need to know Ruby in order to use it. I had kind of a crash course in Ruby while I worked with it, but that's only because of some of the requirements I had while building out my site. The full <a href="http://jekyllrb.com/docs/installation/">requirements</a> are documented with the big red flag being that there is no Windows support. There's <a href="http://jekyllrb.com/docs/windows/#installation">unofficial support</a>, but I'd be wary of committing to Jekyll if you need to support developers on the Windows platform. 

Once installed, you can fire up the Jekyll server from the command line and begin working. Jekyll will automatically refresh while you work so it is quick to get up and running. Speaking of testing, the command line includes an option to create a default site, simply do <code>jekyll new directoryname</code>. 

At this point you can start typing away and testing the results in the browser. I'm assuming most of my readers are already familiar with why tools like this are cool, but in case you aren't, the point of a static site generator is to let you build sites in a <i>similar</i> fashion to dynamic server-side apps but with a flat, static file as the output. So as a practical matter that means I can build a template and simply use a token, like {% raw %}{{body}}{% endraw %}, that will be replaced with a page's content. I can write a page and just include the relevant data for that page and when viewed in the browser it will automatically be wrapped in the template. This isn't necessarily that special - it's 101-level PHP/ColdFusion/Node stuff - but the generator tool will spit out flat HTML files that can then be hosted on things like S3, Google Cloud, or, of course, Surge. 

For its templates, Jekyll allows for Markdown and <a href="https://github.com/Shopify/liquid/wiki">Liquid</a>. It does not support Jade, because Jade is evil and smelly and shouldn't be supported anywhere. I found Liquid to be very nice. You've got your basics (variable outputting, looping, conditionals) as well as some powerful filters too. For example, this will title case a string: {% raw %}{{ title |{% endraw %} capitalize}}. This will do truncation: {% raw %}{{ content |{% endraw %} truncate: 200, '...' }}. You can do this with EJS templates in HarpJS as well (but I didn't know that till today!). 

The other big change in Jekyll is how it handles data for content. In Harp, this is separated into a file unique to a folder. In Jekyll, this is done via "front matter", basically formatted content on top of a page. Initially I preferred Harp's way, but the more I played with Jekyll the more it seemed natural to include it with the content itself. 

You can, if you want, also include random data files, which is cool. If you need something that isn't related to content you could abstract it out into a JSON or YAML file and make use of it in your site. Hell, you can even use CSV.

As a trivial example of a Liquid file, here's a super simple page I use for thanking people after they submit content. It doesn't have anything dynamic in it at all, but the content on top tells Jekyll what template to use and passes on a title value.

<pre><code class="language-markup">---
layout: default
title: Thank You!
---

&lt;p&gt;
Thanks for sending your content submission. I&#x27;ll try to respond as soon as possible. If
for some reason I don&#x27;t get back to you, please feel free to drop me a line via email (raymondcamden at gmail dot com).
&lt;&#x2F;p&gt;</code></pre>

Here is a slightly more complex example, the default layout for the site. Note the use of variables and conditions for determining which tab to highlight. 

<pre><code class="language-markup">&lt;!doctype html&gt;
&lt;html lang=&quot;en&quot;&gt;
    &lt;head&gt;
        &lt;title&gt;{% raw %}{{page.title}}{% endraw %}&lt;&#x2F;title&gt;
    &lt;link rel=&quot;stylesheet&quot; href=&quot;&#x2F;css&#x2F;bootstrap.min.css&quot; type=&quot;text&#x2F;css&quot; &#x2F;&gt;
    &lt;link rel=&quot;stylesheet&quot; href=&quot;&#x2F;css&#x2F;app.css&quot; type=&quot;text&#x2F;css&quot; &#x2F;&gt;
    &lt;script src=&quot;&#x2F;js&#x2F;jquery-2.0.2.min.js&quot;&gt;&lt;&#x2F;script&gt;
    &lt;script src=&quot;&#x2F;js&#x2F;bootstrap.min.js&quot;&gt;&lt;&#x2F;script&gt;

    &lt;script src=&quot;&#x2F;js&#x2F;prism.js&quot;&gt;&lt;&#x2F;script&gt;
    &lt;link rel=&quot;stylesheet&quot; href=&quot;&#x2F;css&#x2F;prism.css&quot; &#x2F;&gt;
    &lt;link rel=&quot;alternate&quot; type=&quot;application&#x2F;rss+xml&quot; title=&quot;RSS&quot; href=&quot;http:&#x2F;&#x2F;www.javascriptcookbook.com&#x2F;rss&quot; &#x2F;&gt;
    &lt;&#x2F;head&gt;
    
    &lt;body&gt;
    &lt;div class=&quot;container&quot;&gt;
      
      &lt;div class=&quot;navbar navbar-inverse&quot;&gt;
        &lt;div class=&quot;navbar-inner&quot;&gt;
          &lt;div class=&quot;container&quot; style=&quot;width: auto;&quot;&gt;
          &lt;a class=&quot;btn btn-navbar&quot; data-toggle=&quot;collapse&quot; data-target=&quot;.nav-collapse&quot;&gt;
            &lt;span class=&quot;icon-bar&quot;&gt;&lt;&#x2F;span&gt;
            &lt;span class=&quot;icon-bar&quot;&gt;&lt;&#x2F;span&gt;
            &lt;span class=&quot;icon-bar&quot;&gt;&lt;&#x2F;span&gt;
          &lt;&#x2F;a&gt;
          &lt;a class=&quot;brand&quot; href=&quot;&#x2F;&quot;&gt;JavaScript Cookbook&lt;&#x2F;a&gt;
          &lt;div class=&quot;nav-collapse&quot;&gt;
            &lt;ul class=&quot;nav&quot;&gt;
            &lt;li {% raw %}{% if page.url == &#x27;&#x2F;index.html&#x27; %{% endraw %}}class=&quot;active&quot;{% raw %}{% endif %{% endraw %}}&gt;&lt;a href=&quot;&#x2F;&quot;&gt;Home&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;
            &lt;li {% raw %}{% if page.url == &#x27;&#x2F;submit.html&#x27; %{% endraw %}}class=&quot;active&quot;{% raw %}{% endif %{% endraw %}}}&gt;&lt;a href=&quot;&#x2F;submit.html&quot;&gt;Submit&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;
            &lt;li {% raw %}{% if page.url == &#x27;&#x2F;about.html&#x27; %{% endraw %}}class=&quot;active&quot;{% raw %}{% endif %{% endraw %}}&gt;&lt;a href=&quot;&#x2F;about.html&quot;&gt;About&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;
            
            &lt;&#x2F;ul&gt;
            &lt;form class=&quot;navbar-search pull-right&quot; action=&quot;&#x2F;search.html&quot; method=&quot;get&quot;&gt;
            &lt;input type=&quot;search&quot; class=&quot;search-query span2&quot; placeholder=&quot;Search&quot; name=&quot;search&quot;&gt;
            &lt;&#x2F;form&gt;
          &lt;&#x2F;div&gt;&lt;!-- &#x2F;.nav-collapse --&gt;
          &lt;&#x2F;div&gt;
        &lt;&#x2F;div&gt;&lt;!-- &#x2F;navbar-inner --&gt;
        &lt;&#x2F;div&gt;&lt;!-- &#x2F;navbar --&gt;

        {% raw %}{{content}}{% endraw %} 
    
    &lt;&#x2F;div&gt;

&lt;script&gt;
  (function(i,s,o,g,r,a,m){% raw %}{i[&#x27;GoogleAnalyticsObject&#x27;]=r;i[r]=i[r]|{% endraw %}|function(){
  (i[r].q=i[r].q{% raw %}||[]).push(arguments)}{% endraw %},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,&#x27;script&#x27;,&#x27;&#x2F;&#x2F;www.google-analytics.com&#x2F;analytics.js&#x27;,&#x27;ga&#x27;);

  ga(&#x27;create&#x27;, &#x27;UA-70863-21&#x27;, &#x27;javascriptcookbook.com&#x27;);
  ga(&#x27;send&#x27;, &#x27;pageview&#x27;);

&lt;&#x2F;script&gt;
    
    &lt;&#x2F;body&gt;
&lt;&#x2F;html&gt;</code></pre>

One of the cooler aspects of Liquid is the <code>assign</code> operator. Given that you have access to data about your site, a list of articles for example, you can quickly slice and dice it within your template. While Jekyll makes it easy to work with blog posts, my content was a bit different. I needed a quick way to get all my article content and sort it by the last date published. Here's how the "Latest Articles" gets generated.

<pre><code class="language-markup">&lt;h3&gt;Latest Articles&lt;&#x2F;h3&gt;

{% raw %}{% assign sorted = (site.pages |{% endraw %} where:&quot;layout&quot;,&quot;article&quot; {% raw %}| sort: &#x27;published&#x27; |{% endraw %} reverse) %}

{% raw %}{% for page in sorted limit:5 %{% endraw %}}
    &lt;p&gt;
    &lt;a href=&quot;{% raw %}{{page.dir}}{% endraw %}&quot;&gt;{% raw %}{{page.title}}{% endraw %}&lt;&#x2F;a&gt; - {% raw %}{{page.published |{% endraw %} date: &quot;{% raw %}%-m&#x2F;%{% endraw %}-d&#x2F;{% raw %}%y at %{% endraw %}I:{% raw %}%M&quot; }}{% endraw %}
    &lt;&#x2F;p&gt;
{% raw %}{% endfor %{% endraw %}}</code></pre>

Like I said, that <code>assign</code> command just makes me happy all over. 

So this is all well and good - but there is one killer feature of Jekyll that makes me think this may be the best tool for the job I've seen yet - plugins. Jekyll lets you create multiple additions to the server to do things like:

<ul>
<li>Create generators - code that will create new files for you
<li>Add tags to the Liquid template system
<li>Add filters that can be used in assign calls
</ul>

These plugins must be written in Ruby, but even with my absolute lack of knowledge in the language I was able to create two plugins to complete my site. Let me be clear - without these plugins I would not have been able to complete the conversion. (Well, I would have had to do a lot more work.) Let me give you a concrete example of where this helps.

One of the issues you run into with static-site generators is that they require one file per URL. What I mean is - for every page of my site, from the home page, to the "About" page, to each piece of blog content, you will have one physical file. That's certainly OK. I just add a file, write my content, and I know I get the benefits of automatic layout, variable substitution, etc. But there are some cases where this requirement is a hinderance.

Imagine you have N articles. Each article has a set of assigned tags. In Harp this would be defined in your data file, in Jekyll this would just be front matter. Here's a sample from one of the JSCookbook articles:

<pre>
---
layout: article
title: Check if a value is an array
published: 2014-10-23T21:18:46.858Z
author: Maciek
sourceurl: 
tags: [array]
id: 544970b682f286f555000001
sesURL: Check-if-a-value-is-an-array
moreinfo: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
---
</pre>

Now imagine I want to make one page for each tag. Normally I'd have to:

<ul>
<li>Figure out all my tags. That's not necessarily a bad thing - you may only have 5-10 static tags.
<li>Make a file each for tag, called sometag.html.
<li>Write the code that slurps content and displays items that match that tag.
<li>Include that code in every page. Both Harp and Jekyll support template languages that make this easy.
</ul>

At the end I have N pages, one for each tag. If I remove a tag, or add one, I have to remember to create a new flat file. Not the end of the world, but something you could forget.

With Jekyll, I can use a plugin to create a generator. This will run on server startup and when things change, and can add new pages to the system dynamically. Here is a plugin I wrote to handle my tag issue. Keep in my mind I'm probably better at ballet dancing then Ruby.

<code><pre class="language-markup">module Jekyll

  class TagPage &lt; Page
    def initialize(site, base, dir, tag, pages)
      @site = site
      @base = base
      @dir = dir
      @name = &#x27;index.html&#x27;

      #print &quot;Running Tag page for &quot;+tag+&quot; &quot;+pages.length.to_s+&quot;\n&quot;

      self.process(@name)
      self.read_yaml(File.join(base, &#x27;_layouts&#x27;), &quot;tag.html&quot;)
      self.data[&#x27;tag&#x27;] = tag
      self.data[&#x27;title&#x27;] = tag
      self.data[&#x27;pages&#x27;] = pages
    end
  end

  class TagPageGenerator &lt; Generator
    safe true

    def generate(site)

      dir = &quot;tag&#x2F;&quot;

      #create unique array of tags
      unique_tags = {}
      site.pages.each do {% raw %}|page|{% endraw %}
        if page.data.key? &#x27;layout&#x27; and page.data[&quot;layout&quot;] == &#x27;article&#x27; 
          #print page.data
          #print &quot;\n&quot;
          page.data[&quot;tags&quot;].each do {% raw %}|tag|{% endraw %}
            if !unique_tags.include?(tag)
              unique_tags[tag] = []
            end
            unique_tags[tag].push(page)
          end
        end

      end

      #print &quot;unique tags: &quot;+unique_tags.keys.join(&quot;,&quot;) + &quot;\n&quot;

      #create page for each
      unique_tags.keys.each do {% raw %}|tag|{% endraw %}
        site.pages &lt;&lt; TagPage.new(site, site.source, File.join(dir, tag), tag, unique_tags[tag])
      end

    end
  end

end</code></pre>

And that's it! (A big thank you to Ryan Morrissey for his <a href="http://ryancmorrissey.com/blog/2014/01/20/auto-create-jekyll-category-and-tag-pages/">blog post</a> about this - I ripped my initial code from it.)

Another example of plugin support is adding your own tags. I needed a way to generate a unique list of tags for the home page. I wrote this plugin, which adds <code>taglist</code> to Liquid for my site.

<pre><code class="language-markup">module Jekyll
  class TagListTag &lt; Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
    end

    def render(context)
      tags = []
      context.registers[:site].pages.each do {% raw %}|page|{% endraw %} 
        if page.data.key?&#x27;layout&#x27; and page.data[&quot;layout&quot;] == &#x27;article&#x27;
          if page.data.key?&#x27;tags&#x27;
            page.data[&quot;tags&quot;].each do {% raw %}|tag|{% endraw %}
              if !tags.include?tag
                tags.push(tag)
              end
            end
          end
        end
      end
      tags = tags.sort
      #now output list
      s = &quot;&quot;
      tags.each do {% raw %}|tag|{% endraw %}
        s += &quot;&lt;li&gt;&lt;a href=&#x27;&#x2F;tag&#x2F;&quot; + tag + &quot;&#x27;&gt;&quot; + tag + &quot;&lt;&#x2F;a&gt;&lt;&#x2F;li&gt;&quot;
      end
      return s
    end

  end
end

Liquid::Template.register_tag(&#x27;taglist&#x27;, Jekyll::TagListTag)</code></pre>

Again - I'm probably writing pretty crappy Ruby - but I <strong>love</strong> that I was able to extend Jekyll this way. If Harp could add this in - and let me use JavaScript - that would be killer. 

And that was really it. I converted my form to use <a href="http://formkeep.com">FormKeep</a> and converted the search to use a Google Custom Search Engine. You can see the final result here: <a href="http://aloof-zephyr.surge.sh/">http://aloof-zephyr.surge.sh/</a>.

As JavaScript Cookbook has not had the traffic I'd like (hint hint - I'm still looking for content!), I'll be pointing the domain to the static version so I can have a bit less Node out there. Once I add in Grunt support and add in Surge, I can write a post and push live in 30 seconds. I can't wait.

p.s. I didn't include a zip of the Jekyll version, but if anyone would like it, just ask.