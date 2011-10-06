dojo.provide("CalendarProject.tests.module");
//This file loads in all the test definitions.  

try
{
	dojo.require("CalendarProject.tests.CalendarDateTest");
	dojo.require("CalendarProject.tests.CalendarWidgetTestBootstrap")
}
catch (e)
{
	doh.debug(e);
}
