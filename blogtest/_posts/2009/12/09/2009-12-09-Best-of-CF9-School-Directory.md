---
layout: post
title: "Best of CF9: School Directory"
date: "2009-12-09T21:12:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/12/09/Best-of-CF9-School-Directory
guid: 3640
---

<img src="https://static.raymondcamden.com/images/cfjedi/bestcfcontest1.jpg" title="Best of ColdFusion 9" align="left" style="margin-right:5px;margin-bottom:5px"/> Today's Best of ColdFusion 9 entry comes to us from Dale Severin. It was reviewed by <a href="http://www.remotesynthesis.com/">Brian Rinaldi</a>. His review was pretty nicely organized so I'm including it as is. Everything up till "Ray here" is straight from him. 

Dale Severin's entry specifically focuses on two new features in ColdFusion 9: Google Maps and Excel spreadsheet integration. The application takes a simulated query of adult schools in the San Francisco area and allows you to view each item placemarked on a Google map. You can also export the query of schools as an Excel spreadsheet. While the application itself isn't overly complex and only spans a few templates, it does serve as a good example of these new features and Dale clearly shows how you can create complex functionality with only a little code in ColdFusion 9 (and that's the point isn't it?).

As I mentioned, the data here is simply a simulated query that is loaded via a CFM template. This works fine, though I would have liked to see it perhaps create a built-in Apache Derby database. Though this isn't new to CF9, it would make the application more flexible and easier to expand upon should Dale or someone else choose to. Nonetheless, Dale made the application exceedingly easy to install as it can live in the site root or a subfolder and the only requirement is that you have a Google Maps API key set up in your ColdFusion Administrator. 

<img src="https://static.raymondcamden.com/images/cfjedi/Best of CF9 2.png" />

One you load the application, you can click on one of the schools and this will open a CFWindow pop-up containing a map of the school. ColdFusion 9 makes Google Maps incredibly easy to integrate. For example, the "guts" of Dale's map output is essentially one line of code:

<code>
&lt;cfmap centeraddress="#url.addr#"
            zoomlevel="15"
            typecontrol="none"
            width="500"
            height="500"
            showCenterMarker="false"&gt;
            &lt;cfmapitem address="#url.addr#" tip="#url.schl#"&gt;
&lt;/cfmap&gt;
</code>

<img src="https://static.raymondcamden.com/images/cfjedi/Best of CF9 1.png" />

One suggestion I had here was that he missed the opportunity to show off how you can create more complex maps just as easily. I would have added a map of all the schools where we simply add cfmapitems for each item in the query if no address is passed.

Clicking the "Excel Export" link will download an Excel spreadsheet containing the schools listed. This takes more lines of code than the Google Map but it still is pretty easy considering what it does.

<code>
&lt;!--- Create new spreadsheet ---&gt;
       &lt;cfset SFDir = spreadsheetNew()&gt;
        
        &lt;!--- Create header row ---&gt;
        &lt;cfset SpreadsheetAddRow(SFDir, "Name, Address")&gt;
        
        &lt;!--- Set column widths ---&gt;
        &lt;cfset SpreadSheetSetColumnWidth(SFDir,1,10)&gt; 
        &lt;cfset SpreadSheetSetColumnWidth(SFDir,2,25)&gt; 

        &lt;!--- Format column 1 ---&gt;
        &lt;cfset formatSFDir = structnew()&gt;
        &lt;cfset formatSFDir.bold = "true"&gt;
        &lt;cfset formatSFDir.alignment = "left"&gt;
        &lt;cfset SpreadsheetFormatRow(SFDir, formatSFDir, 1)&gt;
        
        &lt;!--- Add orders from query ---&gt;
        &lt;cfset SpreadsheetAddRows(SFDir, myQuery)&gt;
        
        &lt;!--- Save spreadsheet ---&gt;
        &lt;cflock name="SFSchoolList" timeout="20" type="exclusive"&gt;
            &lt;cfspreadsheet action="write"
                name="SFDir"
                filename="C:\temp\SF_School_Directory.xls"
                overwrite="true"&gt;

            &lt;!--- Open / Download Spreadsheet File ---&gt;
            &lt;cfheader    name="Content-Disposition" 
                        value="inline; filename=SF_School_Directory.xls"&gt;
            &lt;cfcontent    type="application/csv" 
                        file="C:\temp\SF_School_Directory.xls" 
                        deletefile="yes"&gt; 
        &lt;/cflock&gt;
</code>

One suggestion here is the use of a hardcoded file location is both in a Windows specific format (though it worked on my Mac) and entirely unnecessary. A location relative to the application itself could have been used with an ExpandPath() or placed in the CF temp directory using GetTempDirectory(), especially since the file it deleted anyway. Using a temp file name (with GetTempFile()) would probably have eliminated the need for the cflock to single-thread as well since the file name would be different on each request.

Overall, I think Dale made a good example to show people how these new features can be used quickly to add functionality that was once a pain in the butt to write. Nonetheless, I do think the application is missing the "wow" factor one might have expected for this contest.

<b>Ray Here:</b> I don't have much to add here. Brian has done an excellent job with the review here. I will definitely agree with him about the Windows pathing. Maybe I'm just more sensitive to it being on a Mac, but I see this a <b>lot</b>. As always, you can download the application below. Like Brian, I did not have to modify the path (which was a bit weird :) to get the download to work. I did ensure I had a Google Map Key already set in my CF Admin so be sure you check that first. By the way - when you sign up for a Google Map Key, they are perfectly happy taking "localhost" as a server name. This means you should have no problem testing locally. Thanks Dale!<p><a href='enclosures/C{% raw %}%3A%{% endraw %}5Chosts{% raw %}%5C2009%{% endraw %}2Ecoldfusionjedi{% raw %}%2Ecom%{% endraw %}5Cenclosures{% raw %}%2FSchoolDirectory%{% endraw %}2Ezip'>Download attached file.</a></p>