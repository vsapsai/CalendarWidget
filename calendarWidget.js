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
	var table = this.up(2).down("table").next();
	new Effect.Move(table, {'x': -60, 'y': 0});
	event.stop();
}

function goPrevious(event)
{
	console.log("goPrevious");
	var table = this.up(2).down("table").next();
	new Effect.Move(table, {'x': 60, 'y': 0});
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
	title.observe('click', goToHigherLevel);
	var backButton = new Element('a', {'id': 'backButton', 'href': '#'}).update('back');
	backButton.observe('click', goPrevious);
	title.appendChild(backButton);
	title.appendChild(new Element('span').update(month.monthName()));
	var forwardButton = new Element('a', {'id': 'forwardButton', 'href': '#'}).update('fwd');
	forwardButton.observe('click', goNext);
	title.appendChild(forwardButton);
	container.appendChild(title);
	var gridsContainer = new Element('div', {'class': 'horizontalAnimatedContainer'});
	buildGridPlaceholder(gridsContainer);
	buildCalendarGridForMonth(month, gridsContainer, 0);
	container.appendChild(gridsContainer);
	destinationContainer.appendChild(container);
}

function buildGridPlaceholder(container)
{
	container.update("<table class=\"gridPlaceholder\">" +
						"<thead><tr><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th><th>S</th></tr></thead>" +
						"<tbody id=\"calendarGrid\">" +
							"<tr><td>29</td><td>30</td><td>31</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>" +
							"<tr><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td></tr>" +
							"<tr><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td></tr>" +
							"<tr><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td></tr>" +
							"<tr><td>26</td><td>27</td><td>28</td><td>29</td><td>30</td><td>1</td><td>2</td></tr>" +
							"<tr><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td></tr>" +
						"</tbody>" +
					"</table>");
}

function buildCalendarGridForMonth(month, container, xOffset)
{
	var calendar = new Element('table', {'class': 'grid', 'style': 'top: 0; left:' + xOffset + ';'});
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
	grid.observe('click', selectDay);
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
}
