dojo.provide("CalendarProject.tests.CalendarWidgetTestBootstrap");

if (dojo.isBrowser)
{
	//Define the HTML file/module URL to import as a 'remote' test.
	doh.registerUrl("CalendarProject.tests.CalendarWidgetTest", 
					dojo.moduleUrl("CalendarProject", "tests/CalendarWidgetTest.html"));
}
