---
layout: post
title: "Setting the disabled property of a form field (help needed)"
date: "2007-01-21T11:01:00+06:00"
categories: [javascript]
tags: []
banner_image: 
permalink: /2007/01/21/Setting-the-disabled-property-of-a-form-field-help-needed
guid: 1783
---

Has anyone ever seen a case where you can't use JavaScript to  change the disabled property of a form field? I've used this exact same code elsewhere but for some reason it isn't working for me. I get no error, but the property never gets updated. Here is the JavaScript I'm using:

<code>
if(offset == 0) {% raw %}{ alert('set it to disble');$("prevbutton").disabled=true;}{% endraw %}
else { $("prevbutton").disabled=false; 
}
</code>

To be sure I wasn't doing anything stupid, I did alert $("prevbutton") to confirm it was an input field. I also alerted the disabled status and it correctly said true for this button:

<code>
&lt;input type="button" id="prevbutton" value="Prev" onclick="UpdatePage(pageOffset - pageSize);" /&gt;
</code>

As I said - I get no error at all - but it is almost like the button's disabled field is readonly when it should be read/write.