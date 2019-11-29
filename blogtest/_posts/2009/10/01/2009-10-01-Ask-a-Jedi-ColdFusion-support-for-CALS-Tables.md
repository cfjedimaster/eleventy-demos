---
layout: post
title: "Ask a Jedi: ColdFusion support for CALS Tables"
date: "2009-10-01T11:10:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/10/01/Ask-a-Jedi-ColdFusion-support-for-CALS-Tables
guid: 3548
---

Aaron asked:

<blockquote>
<p>
I've been a follower of your blog forever and it's been an indispensable tool while I've been learning ColdFusion. I started on Allaire's 4.5 version and more recently got ahold of CF8. I'd consider myself a moderate level developer, with a good handle on building CFC's and manipulating XML documents.
</p>
<p>
I've run into a snag recently though, regarding table representation in XML and the process of converting CALS-based format into HTML and vice-versa. This issue came about when I exported pages out of Adobe InDesign to XML and saw CALS format for the first time. My attempt to use the same data from an exported catalog for use on a website has been thwarted by these demonic CALS tables.
</p>
Knowing that CF8 has awesome XML power, I thought there would be a custom tag or CFC for converting these tables into either format but my search has turned up nil. Before attempting to write my own, I was curious if you had any suggestions or knew of any resources I could tap to help with the process? If I did end up creating one, I'd love to pass it off to any who needed it. Maybe you could cover it in a blog entry?
</p>
</blockquote>
<!--more-->
I had to admit to Aaron - I had no idea what CALS was. I did a quick Google search and didn't have luck, but Wikipedia helped me out: <a href="http://en.wikipedia.org/wiki/CALS_Table_Model">CALS Table Model</a>. From what I can gather, CALS is an XML format for describing tables for print. I could be a bit off on that - some of the jargon was a bit hard to grok. But that's what I took from it. Wikipedia then led me to a web page and a DTD description: <a href="http://www.oasis-open.org/specs/a502.htm">CALS Table Model Document Type Definition</a>. Be sure to check the date on that document - 2001. I had a lot less gray hairs in the beard back when this was published. 

I asked Aaron for a sample of his XML to see if I could work with it. Here is a sample of the XML he had to work with:

<code>
&lt;?xml version="1.0" encoding="UTF-8" standalone="yes"?&gt;
&lt;catalog&gt;
	&lt;category&gt;	
		&lt;item&gt;
			&lt;itemsku&gt;SEE BELOW&lt;/itemsku&gt;
			&lt;itemroottitle&gt;Aimpoint CompM3 Weapon Sight &lt;/itemroottitle&gt;
			&lt;itemintroduction&gt;When police and armed forces personnel are on duty, they need their equipment to handle just about any situation, anytime, anywhere. That's why Aimpoint created the CompM3, a revolutionary sight that offers the highest standard available for sight systems technology.  The CompM3 features their latest technology and is even more rugged than Aimpoint's other sights. Featuring revolutionary Advanced Circuit Efficiency Technology that gives the sight unparalleled battery life and ease of use, the CompM3 works with any generation of night vision device (NVD). Built primarily for armed forces and police use to hold up under the roughest physical handling and most severe weather conditions.   The CompM3 comes with a replaceable, outer black rubber cover, which protects it from scratching and adds an additional stealth factor. The outer cover is also available in Dark Earth Brown perfect camo for use in the desert and in  the jungle.&lt;/itemintroduction&gt;
			&lt;itemfeatures&gt;Compatible with every generation of NVD New technology called ACET allows 50,000 hours of operation on one single battery (on setting 7 out of 10) 500,000 hours of use on NVD setting Unequalled light transmission Available in 2 dot sizes (2 and 4 MOA) Submersible to 45 meters (135 feet) Comes with replaceable outer black rubber cover Outer rubber cover available in Dark Earth Brown&lt;/itemfeatures&gt;
			&lt;!--- CALS Table Format. (tables is the defined tag in indesign where the table is kept, the rest is IndDesign created stuff ---&gt;
			&lt;tables&gt;
				&lt;table frame="none"&gt;
					&lt;tgroup cols="2"&gt;
						&lt;colspec colname="c1" colwidth="56.82176592382906pt"&gt;&lt;/colspec&gt;
						&lt;colspec colname="c2" colwidth="90.68922308716pt"&gt;&lt;/colspec&gt;
						&lt;tbody&gt;
							&lt;row&gt;
								&lt;entry namest="c1" nameend="c2" colsep="0" align="center" valign="top"&gt;Models&lt;/entry&gt;
							&lt;/row&gt;
							&lt;row&gt;
								&lt;entry colsep="0" align="right" valign="top"&gt;AIM-11408&lt;/entry&gt;
								&lt;entry colsep="0" align="left" valign="top"&gt;With 2 MOA dot size&lt;/entry&gt;
							&lt;/row&gt;
							&lt;row&gt;
								&lt;entry colsep="0" rowsep="0" align="right" valign="top"&gt;AIM-11403&lt;/entry&gt;
								&lt;entry colsep="0" rowsep="0" align="left" valign="top"&gt;With 4 MOA dot size&lt;/entry&gt;
							&lt;/row&gt;
						&lt;/tbody&gt;
					&lt;/tgroup&gt;
				&lt;/table&gt;
			&lt;/tables&gt;
			&lt;!--- End of CALS Table Format ---&gt;
			&lt;pageid&gt;199&lt;/pageid&gt;
		&lt;/item&gt;
	&lt;/category&gt;
&lt;/catalog&gt;
</code>

Would you believe I just now noticed this XML contains information about weapons and "outer black rubber cover"?? Ok, so that aside, the CALS specific section should be obvious. For my testing I copied that portion into a CFXML variable:

<code>
&lt;!--- COLS Data ---&gt;
&lt;cfxml variable="colxml"&gt;
&lt;tables&gt;
	&lt;table frame="none"&gt;
		&lt;tgroup cols="2"&gt;
			&lt;colspec colname="c1" colwidth="56.82176592382906pt"&gt;&lt;/colspec&gt;
			&lt;colspec colname="c2" colwidth="90.68922308716pt"&gt;&lt;/colspec&gt;
			&lt;tbody&gt;
				&lt;row&gt;
					&lt;entry namest="c1" nameend="c2" colsep="0" align="center" valign="top"&gt;Models&lt;/entry&gt;
				&lt;/row&gt;
				&lt;row&gt;
					&lt;entry colsep="0" align="right" valign="top"&gt;AIM-11408&lt;/entry&gt;
					&lt;entry colsep="0" align="left" valign="top"&gt;With 2 MOA dot size&lt;/entry&gt;
				&lt;/row&gt;
				&lt;row&gt;
					&lt;entry colsep="0" rowsep="0" align="right" valign="top"&gt;AIM-11403&lt;/entry&gt;
					&lt;entry colsep="0" rowsep="0" align="left" valign="top"&gt;With 4 MOA dot size&lt;/entry&gt;
				&lt;/row&gt;
			&lt;/tbody&gt;
		&lt;/tgroup&gt;
	&lt;/table&gt;
&lt;/tables&gt;
&lt;/cfxml&gt;
</code>

From my reading of the spec, my understanding was that a table contained N sets of tgroups. Each tgroup is really it's own table, but they must all fit within one uber table frame. To simplify things though I decided to just work with the main tgroup.

<code>
&lt;!--- get the tgroup ---&gt;
&lt;cfset myTable = colxml.tables.table.tgroup&gt;
</code>

This could be a bit more dynamic, but for a proof of concept I'll go with it. My next step was to parse the colspec tags. 

<code>
&lt;!--- parse the cols to get names and widths ---&gt;
&lt;cfset cols = []&gt;
&lt;cfif structKeyExists(myTable, "colspec")&gt;
	&lt;cfloop index="x" from="1" to="#arrayLen(myTable.colspec)#"&gt;
		&lt;cfset colspec = myTable.colspec[x]&gt;
		&lt;cfset col = {}&gt;
		&lt;cfif structKeyExists(colspec.xmlAttributes, "colname")&gt;
			&lt;cfset col.name = colspec.xmlAttributes.colname&gt;
		&lt;/cfif&gt;
		&lt;cfif structKeyExists(colspec.xmlAttributes, "colwidth")&gt;
			&lt;cfset col.width = colspec.xmlAttributes.colwidth&gt;
		&lt;/cfif&gt;
		&lt;cfset arrayAppend(cols, col)&gt;
	&lt;/cfloop&gt;
&lt;/cfif&gt;
</code>

Basically I create an array of structs, where each struct contains information about the colspec tags. CALS may support more attributes, but I worked with what I saw in the sample XML.

Next was to parse the cells. For the most part this was simple, but notice how they handle colspans. They have a namest and nameend attribute. These point to named columns and represent a start/end "span" for a cell. That's going to be a bit tricky, but before we get ahead of ourselves, let's begin the basic parsing:

<code>
&lt;!--- now parse the rows ---&gt;
&lt;cfset rows = []&gt;
&lt;cfloop index="x" from="1" to="#arrayLen(myTable.tbody.row)#"&gt;
	&lt;cfset row = myTable.tbody.row[x]&gt;
	&lt;!--- each row has N or more entries (cells) ---&gt;
	&lt;cfset cells = []&gt;
	
	&lt;cfloop index="y" from="1" to="#arrayLen(row.entry)#"&gt;
		&lt;cfset entry = row.entry[y]&gt;
</code>

I begin by creating an array for my rows. I then loop over the XML for each row. A row is an array of cells so I create another array as well. Lastly I loop over each entry. 

<code>
		&lt;cfset cell = {}&gt;
		&lt;!--- support colspan by looking for namest/namend ---&gt;
		&lt;!--- require both for now ---&gt;
		&lt;cfif structKeyExists(entry.xmlAttributes, "namest") and structKeyExists(entry.xmlAttributes, "nameend")&gt;
			&lt;cfset colstart = entry.xmlAttributes.namest&gt;
			&lt;cfset colend = entry.xmlAttributes.nameend&gt;
			&lt;!--- Ok, given that we know the name of our start and end col, we can get a colspan. Don't support not starting at 0, just support a count ---&gt;
			&lt;cfset begin = 0&gt;
			&lt;cfset end = 0&gt;
			&lt;cfloop index="z" from="1" to="#arrayLen(cols)#"&gt;
				&lt;cfif structKeyExists(cols[z], "name")&gt;
					&lt;cfif cols[z].name is colstart&gt;
						&lt;cfset begin = z&gt;
					&lt;cfelseif cols[z].name is colend&gt;
						&lt;cfset end = z&gt;
					&lt;/cfif&gt;
				&lt;/cfif&gt;
			&lt;/cfloop&gt;
			&lt;cfif begin gt 0 and end gt 0&gt;
				&lt;cfset cell.colspan = end-begin+1&gt;
			&lt;/cfif&gt;
		&lt;/cfif&gt;
</code>

The cell structure represents one table cell. My first task is to see if a colspan should be in effect. This becomes a bit tricky because it is possible I may not have the named columns. So I do a lot of checking to see if they actually exist, and finally, if they do, I set a colspan value equal to the "distance" between the two columns. 

<code>
		&lt;cfif structKeyExists(entry.xmlAttributes,"valign")&gt;
			&lt;cfset cell.valign = entry.xmlAttributes.valign&gt;
		&lt;/cfif&gt;
		&lt;cfif structKeyExists(entry.xmlAttributes,"align")&gt;
			&lt;cfset cell.align = entry.xmlAttributes.align&gt;
		&lt;/cfif&gt;
</code>

The rest of the cell creation is a bit more simpler. If I have a valign or align attribute, copy it over. Finally, add the cell, add the rows, end the loops, etc:

<code>
		&lt;cfset cell.text = entry.xmlText&gt;
		&lt;cfset arrayAppend(cells, cell)&gt;
	&lt;/cfloop&gt;

	&lt;cfset arrayAppend(rows, cells)&gt;	
&lt;/cfloop&gt;
</code>

Woot. So at this point I've got an array of arrays. Let's see about rendering it:

<code>
&lt;!--- try to render ---&gt;
&lt;table border="1"&gt;

&lt;cfloop index="row" array="#rows#"&gt;
	&lt;tr&gt;
	
	&lt;cfloop index="cell" array="#row#"&gt;
		&lt;cfoutput&gt;
		&lt;td
			&lt;cfif structKeyExists(cell, "colspan")&gt;
			colspan="#cell.colspan#"
			&lt;/cfif&gt;
			&lt;cfif structKeyExists(cell, "valign")&gt;
			valign="#cell.valign#"
			&lt;/cfif&gt;
			&lt;cfif structKeyExists(cell, "align")&gt;
			align="#cell.align#"
			&lt;/cfif&gt;
		&gt;#cell.text#&lt;/td&gt;
		&lt;/cfoutput&gt;
	&lt;/cfloop&gt;
	
	&lt;/tr&gt;
&lt;/cfloop&gt;

&lt;/table&gt;
</code>

I begin, and end, with a table tag. I added a border to my output to make it a bit clearer, but obviously that is something that CALS handles with an XML attribute not present in the sample above. For each row, and each cell, I check the attributes and output the relevant HTML for it. The result?

<img src="https://static.raymondcamden.com/images/Screen shot 2009-10-01 at 10.43.34 AM.png" />

I've attached the entire template to the blog entry. As I said above - this code isn't terribly flexible, but hopefully it can give people a head start if they need to work with CALS data.<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2Ftest%{% endraw %}2Ezip'>Download attached file.</a></p>