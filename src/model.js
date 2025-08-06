const TimelineOfDayModels = (() => {
    class Icon {
        /**
         * @param {string} imageFilename
         */
        constructor(imageFilename) {
            this.imageFilename = imageFilename;
        }
    }

    class Place {
        /**
         * @param {string} name
         */
        constructor(name) {
            this.name = name;
        }

        /**
         * @returns {string}
         */
        toString() {
            return this.name;
        }
    }

    class Travel {
        /**
         * @param {Place} placeFrom
         * @param {Place} placeTo
         */
        constructor(placeFrom, placeTo) {
            this.placeFrom = placeFrom;
            this.placeTo = placeTo;
        }

        /**
         * @returns {string} A string representation of the place.
         */
        toString() {
            return `${this.placeFrom.name} → ${this.placeTo.name}`;
        }
    }

    class Moment {
        /**
         * @param {integer} hour
         * @param {integer} minute
         */
        constructor(hour, minute) {
            this.hour = hour;
            this.minute = minute;
        }

        /** @returns {string} */
        toString() {
            const hourStr = (this.hour + '').padStart(2, '0');
            const minuteStr = (this.minute + '').padStart(2, '0');

            return `${hourStr}h${minuteStr}`;
        }

        /**
         * @param {Moment} nextMoment
         * @returns {boolean}
         */
        isBefore(nextMoment) {
            return (this.hour * 60 + this.minute) < (nextMoment.hour * 60 + nextMoment.minute);
        }

        /**
         * @param {Date} date
         * @returns {Moment}
         */
        static createFromDate(date) {
            return new Moment(date.getHours(), date.getMinutes());
        }

        /** @returns {Moment} */
        static createForNow() {
            return Moment.createFromDate(new Date());
        }
    }

    class Period {
        /**
         * @param {Moment} start
         * @param {Moment} end
         */
        constructor(start, end) {
            this.start = start;
            this.end = end;
        }

        /** @returns {string} */
        toString() {
            return `${this.start.toString()} - ${this.end.toString()}`;
        }

        /**
         * @param {Period} nextPeriod
         * @returns {boolean}
         */
        isBefore(nextPeriod) {
            return this.start.isBefore(nextPeriod.start);
        }
    }

    class Color {
        /**
         * @param {string} value
         */
        constructor(value) {
            this.value = value;
        }
    }

    class EventStyle {
        /**
         * @param {Color} backgroundColor
         */
        constructor(backgroundColor) {
            this.backgroundColor = backgroundColor;
        }
    }

    class Event {
        /**
         * @param {Icon|null} icon
         * @param {string} title
         * @param {string} description
         * @param {Place|Travel} place
         * @param {Period} period
         * @param {EventStyle} style
         */
        constructor(icon, title, description, place, period, style) {
            this.icon = icon;
            this.title = title;
            this.description = description;
            this.place = place;
            this.period = period;
            this.style = style;
            this.timelineEventEl = null; // Will be set later when creating the timeline event element
        }
    }

    let currentLineNumber = 1;

    class EventLine {
        /**
         * @param {number} number
         */
        constructor(number) {
            this.number = number;
            /** @type {Event[]} */
            this.events = [];
        }

        /**
         * @param {Event} event
         * @return {EventLine}
         */
        addEvent(event) {
            this.events.push(event);
            return this;
        }

        /** @returns {EventLine} */
        static createNewLine() {
            return new EventLine(currentLineNumber++);
        }
    }

    return {
        Icon,
        Place,
        Travel,
        Moment,
        Period,
        Color,
        EventStyle,
        Event,
        EventLine,
    }
})();
