---
layout: post
title: "2008 @ ColdFusionBloggers.org"
date: "2009-01-07T17:01:00+06:00"
categories: [misc]
tags: []
banner_image: 
permalink: /2009/01/07/2008-ColdFusionBloggersorg
guid: 3182
---

Earlier today someone suggested adding a tag cloud to <a href="http://www.coldfusionbloggers.org">ColdFusionBloggers</a>. I'm just enough of a nerd to think that would be something fun to do Friday night. In the meantime, I whipped up a quick SQL statement and dumped the results into a structure and sorted it:
<!--more-->
<code>
&lt;cfquery name="cats" datasource="#application.dsn#"&gt;
select	categories
from	entries
where	year(posted) = 2008
and		categories != ''
&lt;/cfquery&gt;

&lt;cfset d = {}&gt;
&lt;cfloop query="cats"&gt;
	&lt;cfloop index="c" list="#categories#"&gt;
		&lt;cfif len(trim(c))&gt;
			&lt;cfif not structKeyExists(d, c)&gt;
				&lt;cfset d[c] = 0&gt;
			&lt;/cfif&gt;
			&lt;cfset d[c]++&gt;
		&lt;/cfif&gt;
	&lt;/cfloop&gt;
&lt;/cfloop&gt;

&lt;cfoutput&gt;
#numberFormat(cats.recordcount)# entries.
&lt;p/&gt;
&lt;table border="1" cellpadding="10" style="margin-top:0px;padding-top:0px;"&gt;
	&lt;tr&gt;
		&lt;th&gt;&nbsp;&lt;/th&gt;
		&lt;th&gt;Tag&lt;/th&gt;
		&lt;th&gt;Count&lt;/th&gt;
	&lt;/tr&gt;
&lt;/cfoutput&gt;

&lt;cfset sorted = structSort(d,"numeric", "desc")&gt;

&lt;cfloop index="x" from="1" to="#min(100,arrayLen(sorted))#"&gt;
	&lt;cfset k = sorted[x]&gt;
	&lt;cfoutput&gt;
	&lt;tr&gt;
		&lt;td&gt;#x#&lt;/td&gt;
		&lt;td&gt;#k#&lt;/td&gt;
		&lt;td&gt;#numberFormat(d[k])#&lt;/td&gt;
	&lt;/tr&gt;
	&lt;/cfoutput&gt;
&lt;/cfloop&gt;
&lt;cfoutput&gt;&lt;/table&gt;&lt;/cfoutput&gt;
</code>

Not the prettiest code in the world, but it worked. All 3 of you using copies of the CFB code base are welcome to it. And now the results. I've printed out the top 100. The top ten aren't surprising, especially #2. It almost matches exactly with what my top 10 concerns of year were (except for Lost of course!). ColdBox shows up rather high in the list, well over Model-Glue and Fusebox. I'm not surprised to see Mac at #17.

Anyway, enjoy the table-y goodness (need to find a simple, scrollable table for static data) and forgive the huge page size.

11,813 entries.

<table border="1" cellpadding="10">
	<tr>
		<th>&nbsp;</th>
		<th>Tag</th>
		<th>Count</th>
	</tr>
<tr><td>1</td><td>ColdFusion</td><td>4,098</td></tr><tr><td>2</td><td>Flex</td><td>954</td></tr><tr><td>3</td><td>General</td><td>544</td></tr><tr><td>4</td><td>Adobe</td><td>483</td></tr><tr><td>5</td><td>Air</td><td>396</td></tr><tr><td>6</td><td>conferences</td><td>262</td></tr><tr><td>7</td><td>Misc</td><td>258</td></tr><tr><td>8</td><td>Javascript</td><td>242</td></tr><tr><td>9</td><td>Ajax</td><td>238</td></tr><tr><td>10</td><td>Technology</td><td>205</td></tr><tr><td>11</td><td>ColdBox</td><td>205</td></tr><tr><td>12</td><td>Development</td><td>200</td></tr><tr><td>13</td><td>Flash</td><td>199</td></tr><tr><td>14</td><td>Code</td><td>195</td></tr><tr><td>15</td><td>cfml</td><td>195</td></tr><tr><td>16</td><td>Tools</td><td>193</td></tr><tr><td>17</td><td>Mac</td><td>187</td></tr><tr><td>18</td><td>Programming</td><td>173</td></tr><tr><td>19</td><td>Web Development</td><td>160</td></tr><tr><td>20</td><td>Java</td><td>160</td></tr><tr><td>21</td><td>SQL</td><td>158</td></tr><tr><td>22</td><td>Personal</td><td>147</td></tr><tr><td>23</td><td>Uncategorized</td><td>143</td></tr><tr><td>24</td><td>posts</td><td>141</td></tr><tr><td>25</td><td>Apple</td><td>134</td></tr><tr><td>26</td><td>Open Source</td><td>132</td></tr><tr><td>27</td><td>Linux</td><td>129</td></tr><tr><td>28</td><td>community</td><td>129</td></tr><tr><td>29</td><td>CFEclipse</td><td>112</td></tr><tr><td>30</td><td>Transfer</td><td>107</td></tr><tr><td>31</td><td>jQuery</td><td>105</td></tr><tr><td>32</td><td>business</td><td>104</td></tr><tr><td>33</td><td>MAX</td><td>104</td></tr><tr><td>34</td><td>security</td><td>99</td></tr><tr><td>35</td><td>Eclipse</td><td>97</td></tr><tr><td>36</td><td>cfunited</td><td>95</td></tr><tr><td>37</td><td>Presentations</td><td>92</td></tr><tr><td>38</td><td>ActionScript</td><td>90</td></tr><tr><td>39</td><td>Scotch on the Rocks</td><td>87</td></tr><tr><td>40</td><td>ColdSpring</td><td>87</td></tr><tr><td>41</td><td>Life</td><td>85</td></tr><tr><td>42</td><td>Jobs</td><td>82</td></tr><tr><td>43</td><td>Stuff</td><td>80</td></tr><tr><td>44</td><td>Oracle</td><td>77</td></tr><tr><td>45</td><td>Google</td><td>77</td></tr><tr><td>46</td><td>iPhone</td><td>76</td></tr><tr><td>47</td><td>Open-Source CF</td><td>72</td></tr><tr><td>48</td><td>Frameworks</td><td>69</td></tr><tr><td>49</td><td>ColdFusion 8</td><td>68</td></tr><tr><td>50</td><td>Web Dev</td><td>68</td></tr><tr><td>51</td><td>Railo</td><td>68</td></tr><tr><td>52</td><td>Blogging</td><td>67</td></tr><tr><td>53</td><td>Work</td><td>66</td></tr><tr><td>54</td><td>Fun</td><td>66</td></tr><tr><td>55</td><td>AS3</td><td>66</td></tr><tr><td>56</td><td>Appearances</td><td>66</td></tr><tr><td>57</td><td>AdobeMAX08</td><td>65</td></tr><tr><td>58</td><td>Microsoft</td><td>63</td></tr><tr><td>59</td><td>BlueDragon</td><td>57</td></tr><tr><td>60</td><td>RIA</td><td>57</td></tr><tr><td>61</td><td>Projects</td><td>57</td></tr><tr><td>62</td><td>Universal Mind</td><td>55</td></tr><tr><td>63</td><td>subversion</td><td>54</td></tr><tr><td>64</td><td>model-glue</td><td>54</td></tr><tr><td>65</td><td> Flex General </td><td>53</td></tr><tr><td>66</td><td>ruby</td><td>52</td></tr><tr><td>67</td><td>Windows</td><td>52</td></tr><tr><td>68</td><td>SixSigns</td><td>51</td></tr><tr><td>69</td><td>fusebox</td><td>51</td></tr><tr><td>70</td><td>BlazeDS</td><td>50</td></tr><tr><td>71</td><td>Adobe AIR</td><td>50</td></tr><tr><td>72</td><td>Apache</td><td>50</td></tr><tr><td>73</td><td>music</td><td>48</td></tr><tr><td>74</td><td>Applications</td><td>47</td></tr><tr><td>75</td><td>Video</td><td>47</td></tr><tr><td>76</td><td>database</td><td>47</td></tr><tr><td>77</td><td>events</td><td>47</td></tr><tr><td>78</td><td>WhosOnCFC</td><td>46</td></tr><tr><td>79</td><td>BlogCFC</td><td>46</td></tr><tr><td>80</td><td>mysql</td><td>46</td></tr><tr><td>81</td><td>Off Topic</td><td>46</td></tr><tr><td>82</td><td>HTML/ColdFusion</td><td>46</td></tr><tr><td>83</td><td>news</td><td>46</td></tr><tr><td>84</td><td>Databases</td><td>46</td></tr><tr><td>85</td><td>Random</td><td>45</td></tr><tr><td>86</td><td>Ubuntu</td><td>45</td></tr><tr><td>87</td><td>openbd</td><td>44</td></tr><tr><td>88</td><td>Default</td><td>44</td></tr><tr><td>89</td><td>.NET</td><td>43</td></tr><tr><td>90</td><td>Ask Ben</td><td>42</td></tr><tr><td>91</td><td>SQL Server</td><td>42</td></tr><tr><td>92</td><td>Reviews</td><td>42</td></tr><tr><td>93</td><td>mapguide</td><td>41</td></tr><tr><td>94</td><td>ANT</td><td>41</td></tr><tr><td>95</td><td>WordPress.com</td><td>40</td></tr><tr><td>96</td><td>Razuna</td><td>40</td></tr><tr><td>97</td><td>collaboration</td><td>40</td></tr><tr><td>98</td><td>Announcements</td><td>40</td></tr><tr><td>99</td><td>CFUG</td><td>39</td></tr><tr><td>100</td><td>design</td><td>39</td></tr></table>