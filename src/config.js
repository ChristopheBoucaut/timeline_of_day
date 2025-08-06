const TimelineOfDayConfig = (() => {
    const minutesByColumn = 5;
    const hourColumnNumber = 60 / minutesByColumn;

    return {
        minutesByColumn,
        hourColumnNumber,
    };
})();