(() => {
    const timelineWrapperEl = document.querySelector('#timeline-section');
    const modalEl = document.querySelector('#modal');
    /** @type {Map<TimelineOfDayModels.User, Map<TimelineOfDayModels.Event, TimelineOfDayModels.Task[]>> | null} */
    let tasksByUser = null; // Used to be a cache for modal.

    /** Setup all components */
    setupDynamicStyles(
        TimelineOfDayData.lines,
        TimelineOfDayConfig.minutesByColumn,
        TimelineOfDayConfig.hourColumnNumber,
    );
    setupHours();
    setupCurrentTimeBar();
    setupTimelineEvents(TimelineOfDayData.lines);
    setupActions();

    /** Setup hours for the timeline */
    function setupHours() {
        document.querySelectorAll('.timeline').forEach((timelineEl) => {
            for (let i = 0; i < 24; i++) {
                const containerEl = TimelineOfDayComponents.createHourContainerEl(i);
                timelineEl.append(containerEl);

                const hourSeparatorEl = TimelineOfDayComponents.createHourSeparatorEl(containerEl.getBoundingClientRect().x);
                timelineEl.append(hourSeparatorEl);
            }
        });
    }

    /** Setup current time bar position */
    function setupCurrentTimeBar() {
        document.querySelectorAll('.timeline').forEach((timelineEl) => {
            timelineEl.append(TimelineOfDayComponents.createCurrentTimeBar());
        });
        refreshCurrentTimeBar();
    }

    /** Refresh current time bar position */
    function refreshCurrentTimeBar() {
        const now = TimelineOfDayModels.Moment.createForNow()
        const {xPosition} = calcXPositionForMoment(now);


        document.querySelectorAll('.timeline__current-time-bar').forEach((currentTimeBarEl) => {
            currentTimeBarEl.dataset.text = now.toString();
            currentTimeBarEl.style.left = `${xPosition}px` ;
        });
        setTimeout(refreshCurrentTimeBar, 1000 * 60); // Update position every minutes
    }

    /**
     * @param {TimelineOfDayModels.Moment} moment
     * @returns {xPosition: number, sizeMax: number}
     */
    function calcXPositionForMoment(moment) {
        const minutes = moment.hour * 60 + moment.minute;
        const sizeMax = timelineWrapperEl.querySelector('.timeline-wrapper').offsetWidth;

        // We find the position from div's size and the number of minutes in a day.
        let xPosition = parseInt(sizeMax * minutes / (24 * 60));
        xPosition -= 14; // @TODO : Improve, we need to ajust because timeline has padding.

        return {
            xPosition: xPosition,
            sizeMax: sizeMax,
        };
    }

    /**
     * @param {TimelineOfDayModels.EventLine[]} lines
     * @param {number} minutesByColumn
     * @param {number} hourColumnNumber
     */
    function setupDynamicStyles(
        lines,
        minutesByColumn,
        hourColumnNumber,
    ) {
        const styleEl = document.createElement('style');
        document.head.append(styleEl);
        const styleSheet = styleEl.sheet;

        // Setup css for timeline
        styleEl.sheet.insertRule(`
            :root {
                --minutes-by-column: ${minutesByColumn};
                --hour-column-number: ${hourColumnNumber};
            }
        `);
        styleEl.sheet.insertRule(`
            .timeline {
                grid-template-rows: 30px repeat(${lines.length}, 60px);
            }
        `);

        // Setup css for lines
        lines.forEach((line) => {
            styleSheet.insertRule(`.timeline__line-${line.number} { grid-row: ${line.number + 1}; }`, 0);
        });
    }

    /**
     * @param {TimelineOfDayModels.EventLine[]} lines
     */
    function setupTimelineEvents(lines) {
        const els = [];
        let firstEvent = null;

        lines.forEach((line) => {
            line.events.forEach((event) => {
                if (firstEvent === null || event.period.isBefore(firstEvent.period)) {
                    firstEvent = event;
                }
                event.timelineEventEl = TimelineOfDayComponents.createTimelineEventEl(
                    line.number,
                    event,
                    () => changeCurrentCard(event)
                );
                els.push(event.timelineEventEl);
            });
        });

        document.querySelectorAll('.timeline').forEach((timelineEl) => {
            els.forEach(el => {
                timelineEl.append(el);
            });
        });

        // Scroll to current time or first timeline card if current time is earlier
        const now = TimelineOfDayModels.Moment.createForNow();
        if (firstEvent !== null && now.isBefore(firstEvent.period.start)) {
            scrollToMoment(firstEvent.period.start);
        } else {
            scrollToMoment(now);
        }
    }

    /**
     * @param {Moment} moment
     */
    function scrollToMoment(moment) {
        const positionData = calcXPositionForMoment(moment);
        // We move the position to the left (30min) to be sure to see the moment asked.
        positionData.xPosition -= parseInt(positionData.sizeMax * 0.5 / 24);
        timelineWrapperEl.scroll(Math.max(0, positionData.xPosition), 0);
    }

    /**
     * @param {TimelineOfDayModels.Event} event
     */
    function changeCurrentCard(event) {
        document.querySelector('.timeline__event--selected')?.classList?.remove('timeline__event--selected');
        event.timelineEventEl.classList.add('timeline__event--selected');

        document.querySelectorAll('.card').forEach((cardEl) => {
            cardEl.innerHTML = '';
            cardEl.append(TimelineOfDayComponents.createCardContentEl(event));
            cardEl.style.backgroundColor = event.style.backgroundColor.value;
        });
    }

    function setupActions() {
        document.querySelectorAll('.action-open-tasks-modal').forEach((el) => {
            el.addEventListener('click', (ev) => {
                ev.preventDefault();
                TimelineOfDayComponents.openTasksModal(
                    modalEl,
                    getTasksByUser(TimelineOfDayData.lines)
                );
            });
        });

        document.querySelectorAll('.action-open-help-modal').forEach((el) => {
            el.addEventListener('click', (ev) => {
                ev.preventDefault();
                TimelineOfDayComponents.openHelpModal(modalEl);
            });
        });

        // Open help modal for first visit.
        if (localStorage.getItem('helpShown') !== '1') {
            localStorage.setItem('helpShown', '1');
            TimelineOfDayComponents.openHelpModal(modalEl);
        }
    }

    /**
     * @param {TimelineOfDayModels.EventLine[]} lines
     * @return {Map<TimelineOfDayModels.User, Map<TimelineOfDayModels.Event, TimelineOfDayModels.Task[]>>}
     */
    function getTasksByUser(lines) {
        if (tasksByUser === null) {
            tasksByUser = new Map();
            lines.forEach(line => {
                line.events.forEach(event => {
                    event.tasks.forEach(task => {
                        task.users.forEach(user => {
                            if (!tasksByUser.has(user)) {
                                tasksByUser.set(user, new Map());
                            }
                            if (!tasksByUser.get(user).has(event)) {
                                tasksByUser.get(user).set(event, []);
                            }
                            tasksByUser.get(user).get(event).push(task);
                        });
                    });
                });
            });
        }

        return tasksByUser;
    }
})();