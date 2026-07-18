let is24Hour = true;
let showSeconds = true;

const timezones = [
    { id: 'ny', timezone: 'America/New_York' },
    { id: 'london', timezone: 'Europe/London' },
    { id: 'paris', timezone: 'Europe/Paris' },
    { id: 'dubai', timezone: 'Asia/Dubai' },
    { id: 'tokyo', timezone: 'Asia/Tokyo' },
    { id: 'sydney', timezone: 'Australia/Sydney' },
    { id: 'la', timezone: 'America/Los_Angeles' },
    { id: 'singapore', timezone: 'Asia/Singapore' },
    { id: 'local', timezone: null }
];

function formatTime(date, use24Hour = true, includeSeconds = true) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if (!use24Hour) {
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
    }

    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    let timeString = `${hours}:${minutes}`;
    
    if (includeSeconds) {
        timeString += `:${seconds}`;
    }

    if (!use24Hour) {
        timeString += ` ${ampm}`;
    }

    return timeString;
}

function formatDate(date) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getTimeInTimezone(timezone) {
    if (timezone === null) {
        return new Date();
    }
    
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const parts = formatter.formatToParts(new Date());
    const values = {};
    parts.forEach(part => {
        values[part.type] = part.value;
    });

    const date = new Date();
    date.setHours(parseInt(values.hour), parseInt(values.minute), parseInt(values.second));
    return date;
}

function updateClocks() {
    timezones.forEach(tz => {
        const clockElement = document.getElementById(`${tz.id}-clock`);
        const dateElement = document.getElementById(`${tz.id}-date`);
        
        const timeInTZ = getTimeInTimezone(tz.timezone);
        
        clockElement.textContent = formatTime(timeInTZ, is24Hour, showSeconds);
        dateElement.textContent = formatDate(timeInTZ);
    });

    // Update local timezone info
    const localTzElement = document.getElementById('local-tz');
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    localTzElement.textContent = localTz;
}

function toggleFormat() {
    is24Hour = !is24Hour;
    updateClocks();
}

function toggleSeconds() {
    showSeconds = !showSeconds;
    updateClocks();
}

// Update clocks immediately
updateClocks();

// Update clocks every 1000ms (1 second)
setInterval(updateClocks, 1000);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
        toggleFormat();
    }
    if (e.key === 's' || e.key === 'S') {
        toggleSeconds();
    }
});