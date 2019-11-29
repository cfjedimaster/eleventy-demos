---
layout: post
title: "Quick follow up to Modal Dialog Editing post with jQuery and ColdFusion"
date: "2011-01-04T18:01:00+06:00"
categories: [coldfusion,javascript,jquery]
tags: []
banner_image: 
permalink: /2011/01/04/Quick-follow-up-to-Modal-Dialog-Editing-post-with-jQuery-and-ColdFusion
guid: 4073
---

This weekend I wrote up a <a href="http://www.raymondcamden.com/index.cfm/2011/1/2/Ask-a-Jedi-Example-of-modal-dialog-editing-with-jQuery">quick blog post</a> that demonstrated using jQuery and jQuery UI for front end editing of database content. ColdFusion was used to store changes made via a jQuery dialog and jQuery did all the handling of data back and forth. Alex asked if it was possible to demonstrate the code using a table instead of the lovely green divs I had created. Here is what I came up with. I'm going to focus on the changes so please be sure to read the <a href="http://www.coldfusionjedi.com/index.cfm/2011/1/2/Ask-a-Jedi-Example-of-modal-dialog-editing-with-jQuery">previous entry</a> for details on how this all works together. Ok, so first, the template.
<!--more-->
<p>

<code>
&lt;cfset getArt = new artservice().getArt()&gt;

&lt;html&gt;
&lt;head&gt;
&lt;script src="jquery-ui-1.8.7.custom/js/jquery-1.4.4.min.js"&gt;&lt;/script&gt;
&lt;script src="jquery-ui-1.8.7.custom/js/jquery-ui-1.8.7.custom.min.js"&gt;&lt;/script&gt;
&lt;link rel="stylesheet" href="jquery-ui-1.8.7.custom/css/overcast/jquery-ui-1.8.7.custom.css" /&gt;
&lt;script&gt;
//credit: http://www.mredkj.com/javascript/numberFormat.html
function dollarFormat(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length &gt; 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{% raw %}{3}{% endraw %})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return "$" + x1 + x2;	
}

$(document).ready(function() {

	$(".editLink").click(function(e) {
		var initialRow = $(this).parent().parent();

		//based on which we click, get the current values
		var artid = $(initialRow).data("artid");
		var name = $("td:first", initialRow).text();
		var price = $("td:nth-child(2)", initialRow).data("price");
		console.log(price);
		var desc = $("td:nth-child(3)", initialRow).text();
		desc = $.trim(desc);

		$("#artid").val(artid);		
		$("#namefield").val(name);
		$("#pricefield").val(price);
		$("#descriptionfield").val(desc);
		
		$("#editForm").dialog({
			buttons: {
				"Save": function() {
					var thisDialog = $(this);
					$.post("artservice.cfc?method=saveart", 
					{
						id:$("#artid").val(),
						name:$("#namefield").val(),
						price:$("#pricefield").val(),
						description:$("#descriptionfield").val()
					}, 
					function() {
						//update the initial div
						$("td:first", initialRow).text($("#namefield").val());
						var price = $("#pricefield").val();
						$("td:nth-child(2)", initialRow).data("price", price);
						price = parseInt(price).toFixed(2);
						$("td:nth-child(2)", initialRow).text("Price: "+dollarFormat(price));
						$("td:nth-child(3)", initialRow).text($("#descriptionfield").val());
						$(thisDialog).dialog("close");
					});
				}
			}
		});
		
		e.preventDefault();
	});
	
});
&lt;/script&gt;
&lt;style&gt;
.artdiv {
	padding: 5px;
	margin: 5px;
	background-color: #80ff80;
}
#editForm {
	display:none;	
}
&lt;/style&gt;
&lt;/head&gt;

&lt;body&gt;

&lt;table width="100%" border="1"&gt;
	&lt;tr&gt;
		&lt;th&gt;Name&lt;/th&gt;
		&lt;th&gt;Price&lt;/th&gt;
		&lt;th&gt;Description&lt;/th&gt;
		&lt;th&gt;&nbsp;&lt;/th&gt;
	&lt;/tr&gt;
	
&lt;cfoutput query="getart"&gt;
	
	&lt;tr data-artid="#artid#"&gt;
		&lt;td&gt;#artname#&lt;/td&gt;
		&lt;td data-price="#price#"&gt;
		Price: #dollarFormat(price)#
		&lt;/td&gt;
		&lt;td class="description"&gt;
		#description#
		&lt;/td&gt;
		&lt;td&gt;&lt;a class="editLink" href=""&gt;Edit&lt;/a&gt;&lt;/td&gt;
	&lt;/tr&gt;
	
&lt;/cfoutput&gt;

&lt;/table&gt;

&lt;div id="editForm" title="Edit Art"&gt;
	&lt;input type="hidden" id="artid"&gt;
	&lt;p&gt;
	&lt;b&gt;Name:&lt;/b&gt;&lt;br/&gt;
	&lt;input type="text" id="namefield"&gt;
	&lt;/p&gt;
	&lt;p&gt;
	&lt;b&gt;Price:&lt;/b&gt;&lt;br/&gt;
	&lt;input type="text" id="pricefield"&gt;
	&lt;/p&gt;
	&lt;p&gt;
	&lt;b&gt;Description:&lt;/b&gt;&lt;br/&gt;
	&lt;textarea id="descriptionfield"&gt;&lt;/textarea&gt;
	&lt;/p&gt;
	
&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;
</code>

<p>

So the first obvious change is the display at the bottom. Instead of a list of DIVs I output table rows. That's a pretty simple change. I also added an edit link as the fourth column in the table.

<p>

Now go back up to the document ready block. I'm now listening for clicks to my new edit link. Note that at the very end I now use e.preventDefault() to block the browser from actually trying to do something with the link. The only other change then is to how I get the various values. Notice I get the table row by using parent.parent on my link. Once I have that, I use a combination of td:first and td:nth-child calls to get at my various items. Outside of that though nothing much else has changed. If you want to run this, please download the attachment from the previous entry and just copy the code above into a new table. Hope this helps!