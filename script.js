// Translation dictionary
const translations = {
    en: {
        cardTitle: "Add to Google Calendar",
        labelTitle: "Event Title",
        placeholderTitle: "Meeting, Workshop, etc.",
        labelStart: "Start Date & Time",
        labelEnd: "End Date & Time",
        labelDetails: "Description (Optional)",
        placeholderDetails: "Add some notes...",
        submitBtn: "Add to Google Calendar",
        alertFill: "Please fill in the title, start time, and end time.",
        alertValidation: "The end time cannot be earlier than the start time."
    },
    pt: {
        cardTitle: "Adicionar ao Google Agenda",
        labelTitle: "Título do Evento",
        placeholderTitle: "Reunião, Workshop, etc.",
        labelStart: "Data e Hora de Início",
        labelEnd: "Data e Hora de Término",
        labelDetails: "Descrição (Opcional)",
        placeholderDetails: "Adicione algumas notas...",
        submitBtn: "Adicionar ao Google Agenda",
        alertFill: "Por favor, preencha o título, o horário de início e o horário de término.",
        alertValidation: "O horário de término não pode ser anterior ao horário de início."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Detect device language (default to 'en' if not Portuguese)
    const userLang = navigator.language || navigator.userLanguage || 'en';
    const langKey = userLang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
    const t = translations[langKey];

    // Set document lang attribute
    document.documentElement.lang = langKey;

    // 2. Apply translations to elements
    document.getElementById('gc-card-title').textContent = t.cardTitle;
    document.getElementById('gc-label-title').textContent = t.labelTitle;
    document.getElementById('gc-title').placeholder = t.placeholderTitle;
    document.getElementById('gc-label-start').textContent = t.labelStart;
    document.getElementById('gc-label-end').textContent = t.labelEnd;
    document.getElementById('gc-label-details').textContent = t.labelDetails;
    document.getElementById('gc-details').placeholder = t.placeholderDetails;
    document.getElementById('gc-submit-btn').textContent = t.submitBtn;

    // 3. Time input logic & validation
    const startInput = document.getElementById('gc-start');
    const endInput = document.getElementById('gc-end');
    const submitBtn = document.getElementById('gc-submit-btn');

    if (startInput && endInput) {
        startInput.addEventListener('change', () => {
            const startVal = startInput.value;
            if (!startVal) return;

            // Prevent end time from being before start time
            endInput.min = startVal;

            // Default duration: 1 hour ahead
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
        submitBtn.addEventListener('click', () => generateGoogleCalendarLink(t));
    }
});

function generateGoogleCalendarLink(t) {
    const titleInput = document.getElementById('gc-title');
    const startInput = document.getElementById('gc-start');
    const endInput = document.getElementById('gc-end');
    const detailsInput = document.getElementById('gc-details');

    const title = titleInput.value.trim();
    const startVal = startInput.value;
    const endVal = endInput.value;
    const details = detailsInput ? detailsInput.value.trim() : '';

    if (!title || !startVal || !endVal) {
        alert(t.alertFill);
        return;
    }

    if (new Date(endVal) < new Date(startVal)) {
        alert(t.alertValidation);
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