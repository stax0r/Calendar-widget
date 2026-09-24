document.addEventListener('DOMContentLoaded', () => {
    // Match the document language to the user's device/browser settings
    document.documentElement.lang = navigator.language || 'en';

    const startInput = document.getElementById('gc-start');
    const endInput = document.getElementById('gc-end');
    const submitBtn = document.getElementById('gc-submit-btn');

    // Handle start time changes (sets minimum end time and defaults to 1 hour duration)
    if (startInput && endInput) {
        startInput.addEventListener('change', () => {
            const startVal = startInput.value;
            if (!startVal) return;

            // Restrict end time from being before the start time
            endInput.min = startVal;

            // Automatically set end time to 1 hour after the start time
            const startDate = new Date(startVal);
            startDate.setHours(startDate.getHours() + 1);

            const pad = (n) => String(n).padStart(2, '0');
            const year = startDate.getFullYear();
            const month = pad(startDate.getMonth() + 1);
            const day = pad(startDate.getDate());
            const hours = pad(startDate.getHours());
            const minutes = pad(startDate.getMinutes());

            endInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', generateGoogleCalendarLink);
    }
});

function generateGoogleCalendarLink() {
    const titleInput = document.getElementById('gc-title');
    const startInput = document.getElementById('gc-start');
    const endInput = document.getElementById('gc-end');
    const detailsInput = document.getElementById('gc-details');

    const title = titleInput.value.trim();
    const startVal = startInput.value;
    const endVal = endInput.value;
    const details = detailsInput ? detailsInput.value.trim() : '';

    if (!title || !startVal || !endVal) {
        alert('Please fill in the title, start time, and end time.');
        return;
    }

    // Safety validation check
    if (new Date(endVal) < new Date(startVal)) {
        alert('The end time cannot be earlier than the start time.');
        return;
    }

    // Format datetime strings to Google's required scheme (YYYYMMDDTHHMM00)
    const formatDateTime = (dtStr) => {
        return dtStr.replace(/[-:]/g, '') + '00';
    };

    const startFormatted = formatDateTime(startVal);
    const endFormatted = formatDateTime(endVal);
    const datesParam = `${startFormatted}/${endFormatted}`;

    const baseUrl = 'https://calendar.google.com/calendar/render';
    const url = `${baseUrl}?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${datesParam}&details=${encodeURIComponent(details)}`;

    window.open(url, '_blank');
}