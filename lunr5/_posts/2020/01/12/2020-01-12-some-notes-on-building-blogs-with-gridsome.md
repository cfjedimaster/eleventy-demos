---
layout: post
title: "Some Notes on Building Blogs with Gridsome"
date: "2020-01-12"
categories: ["static sites"]
tags: ["gridsome"]
banner_image: /images/banners/grid.jpg
permalink: /2020/01/12/some-notes-on-building-blogs-with-gridsome
description: 
---

I'm doing some research for an upcoming presentation on Gridsome ([An Introduction to Gridsome](https://www.eventbrite.com/e/javascript-and-friends-vuejs-columbus-meetup-tickets-85537704577) on January 22) and ran into an issue understanding how one particular feature works that is of particular interest to folks building blogs with Gridsome. 

<h3>tl;dr</h3>
<blockquote>
The frontmatter of your Markdown files become part of your GraphQL schema. You must use <code>date</code> as a field if you want URLs (paths) based on a date property. You will get additional properties (like excerpt) automatically.
</blockquote>

Gridsome supports a filesystem plugin that let you point at a folder of files and automatically import them for use within your site. This is first shown in the docs for [Import with source plugins](https://gridsome.org/docs/fetching-data/#import-with-source-plugins). The specific code example show is this:

```js
module.exports = {
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'docs/**/*.md',
        typeName: 'DocPage'
      }
    }
  ]
}
```

That's fairly straight forward. Point to a path, give it a type name that will be used for the GraphQL server and you're good to go. You need a bit more information though, and you can then checkout the docs for [source-filesystem](https://gridsome.org/plugins/@gridsome/source-filesystem). This page brings up an important detail - that in order to use the filesystem a transformer must be used to parse your files. For Markdown, you are asked to install [@gridsome/transformer-remark](https://www.npmjs.com/package/@gridsome/transformer-remark). 

So far so good, but let's look at the sample code used in the plugin doc:

```js
module.exports = {
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        typeName: 'BlogPost',
        path: './content/blog/**/*.md',
      }
    }
  ],
  templates: {
    BlogPost: '/blog/:year/:month/:day/:slug'
  }
}
```

One important detail different is that this example shows that you need a template to handle displaying the blog posts. [Templates](https://gridsome.org/docs/templates/) are how Gridsome transform collections of data into pages. Personally I don't like the name as templates make me think of layouts, but that's just me. ;) 

Ok.... so here's where I began to have issues. If you look at the template defintion above, you'll see this value: `/blog/:year/:month/:day/:slug`. While I admit I didn't read every single line of Gridsome documentation, I wasn't sure where slug, year, month, and day came from.

To make matters worse, when I tested, I used one Markdown file that looked like this:

```
Hi I'm *markdown*!
```

That's a valid example, but it was missing a crucial part, frontmatter.

So while it's mostly obvious, I guess, that a blog using Markdown files will use frontmatter, it wasn't necessarily called out how important this was.

Gridsome, the filesystem plugin, and the transformer plugin beneath that, will make use of your frontmatter in multiple ways.

First, all the unique values of your frontmatter will be made available in the GraphQL collection. What do I mean by that? Imagine your blog has two files:

	```
	title: Blog one
	cat: I like cats
	```

And...

	```
	title: Blog one
	dog: I like cats too
	```

The resultant GraphQL schema type will include: `title`, `cat`, and `dog` properties. But that's not all - I'll get back to the full schema later in the post.

Alright, so what about `:slug`? A slug generally refers to taking a string and making URL safe (and lower case), so something like "Ray's Happy World" turns into "rays-happy-world". When I used `:slug` in my testing, I got this error:

<img src="https://static.raymondcamden.com/images/2020/01/grid1.png" alt="Notice about using slug versus title" class="imgborder imgcenter">

Ok... so... I guess if my frontmatter included slug then I'd be fine, but for now I simply switched to using `:title` and it used that value from my frontmatter. 

Alright, so what about `:year/:month/:day`? In my testing this only worked if your frontmatter uses a value called `date` and it follows the UTC date format, then it will be picked up and parsed automatically. So like so:

	---
	title: Goo
	date: 2020-01-05
	---

	This is goo

This will output a URL path like so, `/2020/01/05`. I didn't find this till this morning, but it is documented on the [templates](https://gridsome.org/docs/templates/) page. 

Unfortunately I can't see anyway to change this behavior if you use another field for your date. To be clear, if you use another date field, like `edited: 2020-01-10` then Gridsome (and the relevant plugins) will recognize it as a date and make it available as a date type in GraphQL, but I don't believe you can use it in the template path. Wait, I lie. It absolutely can be if you write a custom path function. Here's how the templates doc demonstrate that:

```js
// gridsome.config.js
module.exports = {
  templates: {
    Post: [
      {
        path: (node) => {
          return `/product/${node.slug}/reviews`
        }
      }
    ]
  }
}
```

So in my case I could use values from node.edited. 

Finally, if for some reason you don't specify a date field in your frontmatter, the output will include "Invalid date" in the path: `http://localhost:8080/blog/Invalid%20date/Invalid%20date/Invalid%20date/ray-rules/` So don't do that. ;)

Ok... there's more. When Gridsome (and the relevant plugins again) parse your frontmatter, you get a *lot* of fields in your collection. For a test, I used three Markdown files with frontmatter like this:

	---
	title: dude
	date: 2020-01-05
	cover_image: goo.jpg
	tags: php, perl
	---

This generated this GraphQL schema:

```js
type BlogPost implements Node {
  id: ID!
  path(to: String = "default"): String
  fileInfo: BlogPost_FileInfo
  content: String
  excerpt: String
  title: String
  date(
    format: String
    locale: String
  ): Date
  cover_image: String
  tags: String
  headings(
    depth: RemarkHeadingLevels
    stripTags: Boolean = true
  ): [RemarkHeading]
  timeToRead(speed: Int = 230): Int
  belongsTo(
    sortBy: String = "date"
    order: SortOrder = DESC
    perPage: Int
    skip: Int = 0
    limit: Int
    page: Int
    sort: [SortArgument!]
    filter: BelongsToFilterInput
  ): NodeBelongsTo
}
```

There's a lot there to note. For example, `excerpt` is useful for sure and `timeToRead` is nice. I'm guessing these come from the transformer, but I'm not sure where this is documented. `excerpt` is documented, I believe, way down in the [gray-matter](https://github.com/jonschlinkert/gray-matter#options) code which is a couple chains down from the top plugin, but I really wish this was closer to the "main" Gridsome docs if that makes sense. `headings` seems to come from the fact that the [transformer](https://github.com/gridsome/gridsome/tree/master/packages/transformer-remark#readme) plugin supports automatically creating anchors for your headings in Markdown. I mean I assume that's why. I like the automatic anchors. Not sure when I'd use it in GraphQL query. (Oh, I know how - for maybe making a table of contents for a long documentation page.) 

You'll notice that my tags ended up as a string. The source-filesystem plugin supports a [refs](https://gridsome.org/plugins/@gridsome/source-filesystem#refs) feature that lets you fix that:

```js
module.exports = {
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        refs: {
          // Create a Tag content type and its nodes automatically.
          tags: {
            typeName: 'Tag',
            create: true
          }
        }
      }
    }
  ]
}
```

I ran into one more issue though. It treated my multitag value "php, perl" as a string. When I rewrote it like so, `tags: ["php","perl"]` it worked. I also saw this represented in the GraphQL schema:

```js
tags(
    sortBy: String
    order: SortOrder = DESC
    skip: Int = 0
    sort: [SortArgument]
    limit: Int
  ): [Tag]
  ```

  Finally, and I think I'm really done now, sometimes it took a server restart for Gridsome to notice and update the GraphQL schema. As a specific example, when I was testing getting tags to work as an array I had to restart with every change. I hope this helps!

<i>Header photo by <a href="https://unsplash.com/@worldsbetweenlines?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Patrick Hendry</a> on Unsplash</i>