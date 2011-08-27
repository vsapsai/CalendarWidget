// DOM helpers
function addRowToTable(tableSection, rowElements)
{
	var row = new Element('tr');
	$A(rowElements).inject(row, function(container, element)
		{
			container.appendChild(element);
			return container;
		});
	tableSection.appendChild(row);
}

function tableCells(from, to, attributes)
{
	attributes = attributes || {};
	return $A($R(from, to)).map(function(cell)
	{
		return new Element('td', attributes).update(cell);
	});
}

// event handlers
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

function buildCalendarForMonth(month, destinationContainer)
{
	var container = new Element('div', {'class': 'calendar'});
	// build title
	var title = new Element('div', {'id': 'calendarTitle', 'class': 'caption'});
	title.appendChild(new Element('a', {'id': 'backButton', 'href': '#'}).update('back'));
	title.appendChild(new Element('span').update(month.monthName()));
	title.appendChild(new Element('a', {'id': 'forwardButton', 'href': '#'}).update('fwd'));
	container.appendChild(title);

	var calendar = new Element('table', {'class': 'grid'});
	// build head
	var head = new Element('thead');
	var dayNames = rotateArray(Calendar.DAYS_SHORT_NAMES, Calendar.FIRST_DAY_OF_WEEK);
	addRowToTable(head, $A(dayNames).map(function(dayName)
	{
		return new Element('th').update(dayName);
	}));
	calendar.appendChild(head);

	// build calendar grid
	var grid = new Element('tbody', {'id': 'calendarGrid'});
	// --build mixed first week
	var daysFromPreviousMonth = daysInWeekBeforeDay(month.dayOfWeekMonthStarts());
	var previousMonth = month.previousMonth();
	var previousMonthCells = tableCells(
		previousMonth.daysInMonth() - daysFromPreviousMonth + 1,
		previousMonth.daysInMonth(),
		{'class': 'disabled'});
	var firstWeekDaysCount = Calendar.DAYS_IN_WEEK - daysFromPreviousMonth;
	previousMonthCells = previousMonthCells.concat(tableCells(1, firstWeekDaysCount));
	addRowToTable(grid, previousMonthCells);
	// --build full weeks
	var currentMonthDaysLeft = month.daysInMonth() - firstWeekDaysCount;
	var fullWeeksCount = Math.floor(currentMonthDaysLeft / Calendar.DAYS_IN_WEEK);
	for (var i = 0; i < fullWeeksCount; i++)
	{
		addRowToTable(grid, tableCells(
			firstWeekDaysCount + i * Calendar.DAYS_IN_WEEK + 1,
			firstWeekDaysCount + (i + 1) * Calendar.DAYS_IN_WEEK));
	}
	// --build mixed last week
	var lastWeekDaysCount = (month.daysInMonth() - firstWeekDaysCount) % Calendar.DAYS_IN_WEEK;
	var lastWeekCells = tableCells(
		month.daysInMonth() - lastWeekDaysCount + 1,
		month.daysInMonth());
	var nextMonthDays = Calendar.DAYS_IN_WEEK - lastWeekDaysCount;
	lastWeekCells = lastWeekCells.concat(tableCells(1, nextMonthDays, {'class': 'disabled'}));
	addRowToTable(grid, lastWeekCells);
	// --build additional week if necessary
	if (fullWeeksCount + 2 < 6) // require calendar to have 6 weeks
	{
		addRowToTable(grid, tableCells(
			nextMonthDays + 1,
			nextMonthDays + Calendar.DAYS_IN_WEEK,
			{'class': 'disabled'}));
	}
	calendar.appendChild(grid);
	container.appendChild(calendar);
	destinationContainer.appendChild(container);
}

document.observe("dom:loaded", function()
{
	$('calendarTitle').observe('click', goToHigherLevel);
	$('backButton').observe('click', goPrevious);
	$('forwardButton').observe('click', goNext);
	$('calendarGrid').observe('click', selectDay);

	var currentMonth = new CalendarDate();
	buildCalendarForMonth(currentMonth, $('calendarPlaceholder'));
});

