---
layout: post
title: "Adding a Recent Content Component to VuePress"
date: "2018-05-09"
categories: [static sites]
tags: [vuejs]
banner_image: /images/banners/pineapple.jpg
permalink: /2018/05/09/adding-a-recent-content-component-to-vuepress
---

A few weeks back a new static site generator was launched, [VuePress](https://vuepress.vuejs.org/). Being based on Vue.js, I was immediately interested in it. I've only been using it for a few hours, mainly prototyping it for something I'd like to build at [work](https://goextend.io), but I thought I'd share a little code snippet I wrote. You should assume this is probably the wrong way to do it. As I said, I'm pretty new to VuePress, but when I get something working I like to share it. 

Imagine your building a blog, or a cookbook, and you want to show the latest content on your home page, or perhaps in side navigation. How would you do that?

Well first off, VuePress provides access to the entire site via a - wait for it - `$site` variable. So in theory, you could do this:

```html
### Recent Cool Crap

<ul>
<li v-for="page in $site.pages">{% raw %}{{ page.title }}{% endraw %}</li>
</ul>
```

That works, but breaks down when you need to add sorting and filtering. So for example, in a blog you probably only want the latest blog entries. You don't want to include the home page or contact page. In theory you could get crazy in your `v-for` there but why make your layout messy when a component will do instead?

VuePress supports [custom global components](https://vuepress.vuejs.org/guide/using-vue.html#using-components) by simply dropping a file in the `.vuepress/components` folder. In my testing it appeared as if I needed to restart the server in order to get VuePress to recognize it, but it could have been another issue. For me, I created a file called `RecentArticles.vue`. This then let me drop this into the home page:

```html
## Recent Additions

<RecentArticles/>
```

Now let's look at the component.

```html
<template>
<div>
	<ul>
		<li v-for="post in recentFiles">
			<a :href="post.path">{% raw %}{{post.title}}{% endraw %}</a>
		</li>
	</ul>
</div>
</template>

<script>
export default {
	data() {
		return {};
	}, 
	computed:{
		recentFiles() {
			let files = this.$site.pages.filter(p => {
				return p.path.indexOf('/posts/') >= 0;
			}).sort((a,b) => {
				let aDate = new Date(a.frontmatter.published).getTime();
				let bDate = new Date(b.frontmatter.published).getTime();
				let diff = aDate - bDate;
				if(diff < 0) return -1;
				if(diff > 0) return 1;
				return 0;
			}).slice(0,5);

			return files;
		}
	}
}
</script>
```

The top portion simply handles the display, which in my case is a basic unordered list. The crucial bits is the computed property, `recentFiles`. In order for this to work, I have to make a few assumptions.

First - I assume all of the blog entries are in a path called `posts`. VuePress returns the location of each page via the `path` property. I check for `/posts/` in the path as a way of saying that this particular file is a post. You also get access to the frontmatter of each file and you could use a marker there too if you want. 

Second - I then a sort. I'm assuming each post will have a `published` value in the front matter. (And I'm very happy that VuePress lets me use JSON for frontmatter and not just YAML.) I parse the published value and then sort.

Finally - I return the top five. In theory I could make that an argument passed to the component and default it to 5. In fact, I'm pretty sure I'll do that. Heck, I may even be able to repurpose this to work for an RSS feed as well. (Someone wrote up a great article on how to build UI-less components but I'm having trouble finding that link. If I do, I'll post it as a comment below.)

Anyway, I hope this is helpful. If I play more with VuePress I'll share more tips!

<i>Header photo by <a href="https://unsplash.com/photos/jIU6rQccJAU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Pineapple Supply Co</a> on Unsplash</i>