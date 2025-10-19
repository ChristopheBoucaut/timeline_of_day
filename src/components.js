const TimelineOfDayComponents = (() => {
    /** @type {HTMLElement|null} */
    let timelineEventTemplate = null;
    /** @type {HTMLElement|null} */
    let cardContentTemplate = null;
    /** @type {HTMLElement|null} */
    let taskTemplate = null;
    /** @type {HTMLElement|null} */
    let modalTemplate = null;

    /**
     * @param {number} hour
     * @returns {HTMLElement}
     */
    function createHourContainerEl(hour) {
        const containerEl = document.createElement('div');
        containerEl.textContent = `${hour} H`;
        containerEl.classList.add('timeline__line-0');
        containerEl.style.gridColumn = `${hour*TimelineOfDayConfig.hourColumnNumber+1} / ${(hour+1)*TimelineOfDayConfig.hourColumnNumber+1}`;

        return containerEl;
    }

    /**
     * @param {number} positionX
     * @returns {HTMLElement}
     */
    function createHourSeparatorEl(positionX) {
        const hourSeparatorEl = document.createElement('div');
        hourSeparatorEl.classList.add('timeline__hour-separator');
        hourSeparatorEl.style.left = `${positionX}px` ;

        return hourSeparatorEl;
    }

    /** @returns {HTMLElement} */
    function createCurrentTimeBar() {
        const hourSeparatorEl = document.createElement('div');
        hourSeparatorEl.classList.add('timeline__current-time-bar');

        return hourSeparatorEl;
    }

    /**
     * @param {number} lineNumber
     * @param {TimelineOfDayModels.Event} event
     * @param {Function} callbackOnClick
     * @returns {HTMLElement}
     */
    function createTimelineEventEl(lineNumber, event, callbackOnClick) {
        timelineEventTemplate = timelineEventTemplate || document.querySelector('#timeline-event-template');

        const eventEl = document.importNode(timelineEventTemplate.content, true).children[0];
        eventEl.classList.add(`timeline__line-${lineNumber}`);
        eventEl.style.backgroundColor = event.style.backgroundColor.value;
        eventEl.onclick = callbackOnClick;

        const fromColumn = parseInt((event.period.start.hour * 60 + event.period.start.minute) / TimelineOfDayConfig.minutesByColumn) + 1;
        let toColumn = parseInt((event.period.end.hour * 60 + event.period.end.minute) / TimelineOfDayConfig.minutesByColumn) + 1;

        if (toColumn < fromColumn) {
            // If we end before the start, it means we are in the next day. We change the end to finish at the end of the day.
            toColumn = TimelineOfDayConfig.hourColumnNumber * 24 + 1
        }

        eventEl.style.gridColumn = `${fromColumn} / ${toColumn}`;

        if (event.icon === null) {
            eventEl.querySelector('.event__icon').remove();
        } else {
            eventEl.querySelector('.event__icon').src = getIconPath(event.icon);
        }
        eventEl.querySelector('.timeline__event__title').textContent = `${event.title}`;
        eventEl.title = `${event.title}`;

        return eventEl;
    }

    /**
     * @param {TimelineOfDayModels.Event} event
     * @returns {HTMLElement}
     */
    function createCardContentEl(event) {
        cardContentTemplate = cardContentTemplate || document.querySelector('#card-content-template');

        const cardContentEl = document.importNode(cardContentTemplate.content, true);

        cardContentEl.querySelectorAll('.event__icon').forEach((el) => {
            el.src = getIconPath(event.icon);
        });

        cardContentEl.querySelectorAll('.card__title').forEach((el) => {
            el.textContent = event.title;
        });

        cardContentEl.querySelectorAll('.card__time').forEach((el) => {
            el.textContent = `${event.period.toString()} 🕒`;
        });

        cardContentEl.querySelectorAll('.card__place').forEach((el) => {
            el.textContent = `${event.place.toString()} 🏠`;
        });

        cardContentEl.querySelectorAll('.card__description').forEach((el) => {
            el.innerHTML = event.description;
        });

        const cardTasksUlEl = cardContentEl.querySelector('.card__tasks ul')
        if (event.tasks.length === 0) {
            cardTasksUlEl.remove();
        } else {
            event.tasks.forEach((task) => {
                const liEl = document.createElement('li');
                liEl.append(createTaskEl(task));
                cardTasksUlEl.append(liEl);
            });
        }

        return cardContentEl;
    }

    /**
     * @param {TimelineOfDayModels.Task} task
     * @returns {HTMLElement}
     */
    function createTaskEl(task) {
        taskTemplate = taskTemplate || document.querySelector('#card-task-template');

        const taskEl = document.importNode(taskTemplate.content, true);
        taskEl.querySelector('span').textContent = task.name;

        const taskInputEl = taskEl.querySelector('input');
        taskInputEl.checked = task.done;

        const taskUsersEl = taskEl.querySelector('.task__users');
        task.users.forEach((user) => {
            taskUsersEl.append(createUserEl(user));
        });
        taskInputEl.onchange = () => task.done = taskInputEl.checked;

        return taskEl;
    }

    /**
     * @param {HTMLElement} taskModalEl
     * @param {Map<TimelineOfDayModels.User, Map<TimelineOfDayModels.Event, TimelineOfDayModels.Task[]>>} tasksByUser
     */
    function setupTasksModal(tasksModalEl, tasksByUser) {
        setupModal(
            tasksModalEl,
            "Actions par intervenants",
            (contentEl) => {
                // Create description texte.
                const descriptionEl = document.createElement('p');
                descriptionEl.textContent = "Cliquez sur une des personnes ci-dessous pour voir ses tâches."

                // Create tasks list
                const tasksByEventListEl = document.createElement('ul');
                tasksByEventListEl.classList.add('tasks-by-event-list');

                // Create users list
                const usersListEl = createUsersListEl(
                    tasksByUser.keys(),
                    (user) => {
                        tasksByEventListEl.innerHTML = '';
                        tasksByUser.get(user).forEach((tasks, event) => {
                            const tasksListEl = document.createElement('ul');
                            tasksListEl.classList.add('tasks-list');

                            tasks.forEach(task => {
                                const liEl = document.createElement('li');
                                liEl.append(createTaskEl(task));
                                tasksListEl.append(liEl);
                            });

                            const tasksByEventEl = document.createElement('li');
                            tasksByEventEl.textContent = event.title;
                            tasksByEventEl.append(tasksListEl);
                            tasksByEventListEl.append(tasksByEventEl);
                        });
                    }
                );

                contentEl.append(descriptionEl);
                contentEl.append(usersListEl);
                contentEl.append(tasksByEventListEl);
            }
        );
    }

    function setupModal(modalEl, title, callbackForModalContent) {
        // Reset
        modalEl.innerHTML = '';

        modalTemplate = modalTemplate || document.querySelector('#modal-template');
        const modalContentEl = document.importNode(modalTemplate.content, true);

        // Setup static elements
        // -- Title
        modalContentEl.querySelector('.modal__title').textContent = title;
        // -- Close action
        modalContentEl.querySelector('.modal__action-close').addEventListener('click', () => modalEl.close());
        // -- Content
        callbackForModalContent(modalContentEl.querySelector('.modal__content'));

        modalEl.append(modalContentEl);
    }

    /**
     * @param {TimelineOfDayModels.User[]} users
     * @param {Function} actionOnClick
     * @returns {HTMLElement}
     */
    function createUsersListEl(users, actionOnClick = null) {
        const listContainerEl = document.createElement('ul');
        listContainerEl.classList.add('users-list');
        users.forEach(user => {
            const userEl = createUserEl(user);
            if (actionOnClick) {
                userEl.addEventListener('click', ({target}) => {
                    listContainerEl.querySelector('.user_selected')?.classList.remove('user_selected');
                    target.classList.add('user_selected');

                    actionOnClick(user);
                });
            }
            listContainerEl.append(userEl);
        });

        return listContainerEl;
    }

    /**
     * @param {TimelineOfDayModels.User} user
     * @returns {HTMLElement}
     */
    function createUserEl(user) {
        const imgEl = document.createElement('img');
        imgEl.src = getUserPath(user);
        imgEl.alt = user.name;
        imgEl.title = user.name;
        imgEl.classList.add('user');

        return imgEl;
    }

    /**
     * @param {TimelineOfDayModels.Icon} icon
     * @returns {string}
     */
    function getIconPath(icon) {
        return `images/icons/${icon.imageFilename}`;
    }

    /**
     * @param {TimelineOfDayModels.User} user
     * @returns {string}
     */
    function getUserPath(user) {
        return `images/users/${user.imageFilename}`;
    }

    return {
        createHourContainerEl,
        createHourSeparatorEl,
        createCurrentTimeBar,
        createTimelineEventEl,
        createCardContentEl,
        createTaskEl,
        setupTasksModal,
    };
})();
