function WeeklyCalendar (currentDay, weeklyCalendar, setWeeklyCalendar) {
    const currDayIndex = currentDay.getDay();
    const wholeCalendarDisplay = [];
    for (let i = 0; i < 7; i++) {
        wholeCalendarDisplay.push(<DisplayCalendarSquare ifCurrDay={i === currDayIndex} dayIndex={i} currentDay={currentDay} calendarSquareData={weeklyCalendar[i]}/>)
    }
}
function DisplayCalendarSquare ({ifCurrDay, dayIndex, currentDay, calendarSquareData}) {
    // dayIndex is 0 = sunday ... 6 = saturday
    const dayRefs = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayRefs[dayIndex];
    return (
        <div style={{backgroundColor: ifCurrDay ? "yellow" : "white"}} className="calendar-square">
            <p>{dayName}</p>
        </div>
    );
}
export default WeeklyCalendar;