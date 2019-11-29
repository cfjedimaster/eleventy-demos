---
layout: post
title: "Fun little AJAX/Internet Explorer issue (with cool Spry fix!)"
date: "2006-10-11T15:10:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2006/10/11/Fun-little-AJAXInternet-Explorer-issue-with-cool-Spry-fix
guid: 1581
---

A few days ago I mentioned a little issue I ran into with Spry. Today I was helping my friend diagnose some issues with his application and IE and I ran into a new little bug. This isn't a Spry issue - but just IE in general.

Imagine this situation: You have a drop down field being populated by Spry. Let's call it Categories. Whenever you change the category, you use Spry to populate a second drop down of products. 

Pretty simple related selects type feature, right?

Turns out in IE, something interesting happens. Whenever I would change the category, the products drop down would be correctly populated - but defaulted to the last item in the drop down. In FireFox, the first item would be selected. 

What's worse is that in my friend's demo, he had a detail region tied to the second drop down. It would correctly show the detail for the first item in the drop down, but visually you saw the last item selected.

Once again I went to my buddy Kin Blas of Adobe. Turns out this isn't a bug really - but a "feature" of IE, where it simply uses the last option as the default if you don't mark one as the selected item.

Luckily there is a cool little way to fix this in Spry using conditionals. Spry gives you a hook to various bits of information related to the current dataset. These are named ds_Something or another. The following example shows how we can use them.

<code>
&lt;div spry:region="categories"&gt;
&lt;select spry:repeatchildren="categories" spry:choose="choose" name="category" onChange="categories.setCurrentRow(this.selectedIndex);"&gt;
&lt;option spry:when="{% raw %}{ds_RowNumber}{% endraw %} == {% raw %}{ds_CurrentRowNumber}{% endraw %}" selected="selected"&gt;{% raw %}{category}{% endraw %}&lt;/option&gt;
&lt;option spry:default="default"&gt;{% raw %}{category}{% endraw %}&lt;/option&gt;
&lt;/select&gt;
&lt;/div&gt; 
</code>

Of particular note look at the when and default clause on the option tags. This will apply logic before letting the item be printed when the dataset is applied. Note the use of ds_RowNumber and ds_CurrentRowNumber. When the dataset is applied, these values will be dynamic and checked as Spry prints out the option tags. 

Make sense? If not - let me know.