function goToHigherLevel(event)
{
	console.log("goToHigherLevel");
	event.stop();
}

function goNext(event)
{
	console.log("goNext");
	event.stop();
}

function goPrevious(event)
{
	console.log("goPrevious");
	event.stop();
}

function selectDay(event)
{
	console.log("selectDay");
	event.stop();
}

document.observe("dom:loaded", function()
{
	$('calendarTitle').observe('click', goToHigherLevel);
	$('backButton').observe('click', goPrevious);
	$('forwardButton').observe('click', goNext);
	$('calendarGrid').observe('click', selectDay);
});
