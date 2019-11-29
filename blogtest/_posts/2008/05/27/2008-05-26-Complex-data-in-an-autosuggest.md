---
layout: post
title: "Complex data in an auto-suggest"
date: "2008-05-27T10:05:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2008/05/27/Complex-data-in-an-autosuggest
guid: 2842
---

This is a question I get about once a month. Is it possible to use an autosuggest that returns complex data? What I mean is - I want to be able to start typing into a text field, see a list of matching names come up, but when I pick one, I need to know both the name value and the ID related to the name. So for example, imagine this data:

<table>
<tr>
<th>ID</th><th>Name</th>
</tr>
<tr>
<td>1</td><td>Paris Hilton</td>
</tr>
<tr>
<td>2</td><td>Darth Vader</td>
</tr>
<tr>
<td>3</td><td>Victor Newman</td>
</tr>
</table>

If I type "v" and see Victor Newman pop up, when I select him I need to know that his ID was 3.

As far as I know this isn't possible with both Spry and ColdFusion 8's autosuggest. Both demand you return simple values to populate the suggestions. 

You could do a lookup based on the name. So once you get the name, do another Ajax request to translate "Victor Newman" to 3. You can probably guess the problem with this. If there are two Victor Newmans, than what ID would you return? You could return names along with a middle initial, but that simply reduces the problem. It doesn't fix it. Depending on how complex you want to get though - you could do your Ajax request and when you see more than one result returned, prompt the user to pick the one they meant. 

Has anyone else solved this problem? I'm thinking there has to be a better solution.