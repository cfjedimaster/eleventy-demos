---
layout: post
title: "ColdFusion and SugarCRM Intergration"
date: "2009-02-07T08:02:00+06:00"
categories: [coldfusion]
tags: []
banner_image: 
permalink: /2009/02/07/ColdFusion-and-SugarCRM-Intergration
guid: 3227
---

If you would like to integrate your ColdFusion site with SugarCRM, please see the new <a href="http://coldsugar.riaforge.org/">ColdSugar</a> project at RIAForge. This is a simple CFC that allows for complete integration with a SugarCRM account. You can get any kind of data and perform updates as well. I wish I could say there was something sexy about this code, but their API was relatively simple to work with.

Some sample code:

<code>
&lt;cfset coldsugar = createObject("component", "sugarcrm").init("http://eval.sugarondemand.com/xxx/soap.php?wsdl", "admin", "foo", true)&gt;

&lt;cfdump var="#coldsugar.getList('Opportunities')#" label="Opportunities"&gt;

&lt;cfset q = "opportunities.name LIKE 'TI%'"&gt;
&lt;cfdump var="#coldsugar.getList(type='Opportunities',query=q)#" label="query=#q#"&gt;

&lt;cfdump var="#coldsugar.getList(type='Opportunities',orderby='amount_usdollar')#" label="sort by amount_usdollar"&gt;

&lt;cfdump var="#coldsugar.getList(type='Opportunities',deleted=true)#" label="deleted"&gt;

&lt;cfdump var="#coldsugar.getList(type='Opportunities',fields='name,amount_usdollar')#" label="Just name and amount_usdollar"&gt;

&lt;cfdump var="#coldsugar.getList('Contacts')#" label="Contacts"&gt;

&lt;cfdump var="#coldsugar.getList('Accounts')#" label="Accounts"&gt;

&lt;cfdump var="#coldsugar.getList('Documents')#" label="Documents"&gt;

&lt;cfdump var="#coldsugar.getList('Calls')#" label="Calls"&gt;

&lt;cfdump var="#coldsugar.getList('Meetings')#" label="Meetings"&gt;

&lt;cfdump var="#coldsugar.getList('Tasks')#" label="Tasks"&gt;

&lt;cfdump var="#coldsugar.getList('Notes')#" label="Notes"&gt;

&lt;cfdump var="#coldsugar.getFields('Emails')#" label="Email Fields"&gt;


&lt;cfset emails = coldsugar.getList('Emails')&gt;
&lt;cfdump var="#emails#" label="Emails"&gt;

&lt;cfset email = coldsugar.get('Emails', emails.id[1])&gt;
&lt;cfdump var="#email#" label="Emails"&gt;


&lt;cfset email.status = 'replied'&gt;
&lt;cfset r = coldsugar.save('Emails',email)&gt;
&lt;p&gt;
Result of save is #r#
&lt;/p&gt;

&lt;cfset coldsugar.logout()&gt;

&lt;p&gt;
Done with tests.
&lt;/p&gt;
&lt;/cfoutput&gt;
</code>