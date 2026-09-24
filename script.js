document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('gc-submit-btn');
    
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

    // Helper to format "YYYY-MM-DDTHH:MM" to Google's "YYYYMMDDTHHMM00"
    const formatDateTime = (dtStr) => {
        return dtStr.replace(/[-:]/g, '') + '00';
    };

    const startFormatted = formatDateTime(startVal);
    const endFormatted = formatDateTime(endVal);
    const datesParam = `${startFormatted}/${endFormatted}`;

    // Build Google Calendar URL
    const baseUrl = 'https://calendar.google.com/calendar/render';
    const url = `${baseUrl}?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${datesParam}&details=${encodeURIComponent(details)}`;

    // Open in a new tab
    window.open(url, '_blank');
}