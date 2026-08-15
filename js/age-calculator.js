document.addEventListener('DOMContentLoaded', () => {
    const dobInput = document.getElementById('dobInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsSection = document.getElementById('resultsSection');
    
    const exactAgeEl = document.getElementById('exactAge');
    const totalDaysEl = document.getElementById('totalDays');
    const nextBirthdayEl = document.getElementById('nextBirthday');

    calculateBtn.addEventListener('click', () => {
        if (!dobInput.value) {
            showToast('Please select your Date of Birth.', 'error');
            return;
        }

        const dobDate = new Date(dobInput.value);
        const todayRaw = new Date();
        
        // Strip time to just dates to prevent timezone/hour shifting issues
        const today = new Date(todayRaw.getFullYear(), todayRaw.getMonth(), todayRaw.getDate());
        const dob = new Date(dobDate.getFullYear(), dobDate.getMonth(), dobDate.getDate());

        if (dob > today) {
            showToast('Date of Birth cannot be in the future.', 'error');
            return;
        }

        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        let days = today.getDate() - dob.getDate();

        if (days < 0) {
            months--;
            // Find out how many days were in the previous month
            let prevMonth = today.getMonth() - 1;
            let prevYear = today.getFullYear();
            if (prevMonth < 0) {
                prevMonth = 11;
                prevYear--;
            }
            const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
            days += daysInPrevMonth;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        exactAgeEl.textContent = `${years} Year${years !== 1 ? 's' : ''}, ${months} Month${months !== 1 ? 's' : ''}, ${days} Day${days !== 1 ? 's' : ''}`;

        // Total Days Lived
        const msPerDay = 1000 * 60 * 60 * 24;
        const totalDaysLived = Math.round((today - dob) / msPerDay);
        totalDaysEl.textContent = totalDaysLived.toLocaleString();

        // Days until next birthday
        const nextBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
        
        // If birthday has already passed this year, look at next year
        if (nextBday < today) {
            nextBday.setFullYear(today.getFullYear() + 1);
        }

        const daysUntilNext = Math.round((nextBday - today) / msPerDay);
        nextBirthdayEl.textContent = daysUntilNext;

        resultsSection.style.display = 'block';

    const copyAgeBtn = document.getElementById('copyAgeBtn');
    if (copyAgeBtn) {
        copyAgeBtn.addEventListener('click', () => {
            const text = `Exact Age: ${exactAgeEl.textContent}\nTotal Days Lived: ${totalDaysEl.textContent}\nDays until next birthday: ${nextBirthdayEl.textContent}`;
            navigator.clipboard.writeText(text).then(() => {
                showToast('Copied to clipboard!');
            });
        });
    }

    });
});
