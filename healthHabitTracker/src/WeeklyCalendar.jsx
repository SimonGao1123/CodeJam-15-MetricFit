function WeeklyCalendar (currentDay, weeklyCalendar, setWeeklyCalendar) {
    const wholeCalendarDisplay = [];
    for (let i = 0; i < 7; i++) {
        <DisplayCalendarSquare dayIndex={i} currentDay={currentDay} calendarSquareData={weeklyCalendar[i]}/>
    }
}
function DisplayCalendarSquare (dayIndex, currentDay, calendarSquareData) {
    // dayIndex is 0 = sunday ... 6 = saturday
    const dayRefs = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayRefs[dayIndex];
    return (
        <div className="calendar-square">
            <p>{dayName}</p>
        </div>
    );
}
export default WeeklyCalendar;