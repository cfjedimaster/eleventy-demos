---
layout: post
title: "Ask a Jedi: Using CFTREE for Navigation (2)"
date: "2008-07-10T10:07:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2008/07/10/Ask-a-Jedi-Using-CFTREE-for-Navigation-2
guid: 2923
---

So last night, during my CF/AJAX presentation, I mentioned that I didn't think most folks made use of cftree, so this question is perfectly poised to prove me wrong. John asks:

<blockquote>
<p>
I loved your <a href="http://www.raymondcamden.com/index.cfm/2007/7/31/Using-CFTREE-for-Navigation">example</a> of binding a cfdiv to a
cftree node. I would like to use this example but only have the cfdiv bind when a child node is clicked on. I have a simple parent-child tree structure with only one level. Do you have any ideas?
</p>
</blockquote>
<!--more-->
I always have ideas, but I assume you want a <i>good</i> idea, and those are a bit more rare. The original <a href="http://www.coldfusionjedi.com/index.cfm/2007/7/31/Using-CFTREE-for-Navigation">blog entry</a> had a cfdiv that was bound to the tree. As soon as you clicked any leaf, the div was updated. In order to stop navigating on certain types of nodes, we need to change things up a bit. First, let's add a cfajaxproxy tag. This will give us more control over the binding:

<code>
&lt;cfajaxproxy bind="javascript:doNav({% raw %}{mytree.node}{% endraw %})"&gt;
</code>

This line says - "When the tree's selected node changes, run a JavaScript function doNav and pass the node value." My JavaScript is rather simple:

<code>
&lt;script&gt;
function doNav(n) {
	if(n != 'root') ColdFusion.navigate('dyn.cfm?value='+n,'content');
}
&lt;/script&gt;
</code>

My original tree (the full code will be below) used root for the top level leaf. So basically I just said, if the node was root, then don't do anything, otherwise, update the div. Here is the complete file:

<code>
&lt;cfajaxproxy bind="javascript:doNav({% raw %}{mytree.node}{% endraw %})"&gt;

&lt;script&gt;
function doNav(n) {
	if(n != 'root') ColdFusion.navigate('dyn.cfm?value='+n,'content');
}
&lt;/script&gt;

&lt;cfform name="form"&gt;
&lt;cftree format="html" name="mytree"&gt;
   &lt;cftreeitem display="Navigation" value="root"&gt;
   &lt;cftreeitem display="Page A" parent="root" value="a"&gt;
   &lt;cftreeitem display="Page B" parent="root" value="b"&gt;
&lt;/cftree&gt;
&lt;/cfform&gt;

&lt;cfdiv id="content" /&gt;
</code>

The issue with this is that it only supports one root node. If you had another root node (imagine two parent leafs, Products and Services), you would need to update your JavaScript to check for both values. You could perhaps get a bit fancy and name all your root nodes like so:

root_Products<br/>
root_Services<br/>

And then simply use JavaScript to see if the selected node begins with root_.

Anyway, I think this gives you the idea.