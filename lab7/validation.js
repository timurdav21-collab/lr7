// ВАЛИДАЦИЯ ЗАКАЗА И УВЕДОМЛЕНИЯ (ЛАБ 6 + 7)

document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('order-form');
    const notificationOverlay = document.getElementById('notification-overlay');

    function getSelectedDishes() {
        if (typeof window.selectedDishes !== 'undefined') {
            return window.selectedDishes;
        }
        return {
            soup: null,
            'main-course': null,
            salad: null,
            drink: null,
            dessert: null,
        };
    }

    function showNotification(message) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <h3>Внимание</h3>
            <p>${message}</p>
            <button class="notification-btn">Окей 👌</button>`;

        notificationOverlay.appendChild(notification);
        notificationOverlay.style.display = 'flex';

        const okBtn = notification.querySelector('.notification-btn');
        okBtn.addEventListener('click', function() {
            notificationOverlay.style.display = 'none';
            notification.remove();
        });
    }

    function validateOrder() {
        const selected = getSelectedDishes();

        const hasSoup    = !!selected.soup;
        const hasMain    = !!selected['main-course'];
        const hasSalad   = !!selected.salad;
        const hasDrink   = !!selected.drink;
        const hasDessert = !!selected.dessert;

        // 1. Ничего не выбрано
        if (!hasSoup && !hasMain && !hasSalad && !hasDrink && !hasDessert) {
            showNotification('Ничего не выбрано. Выберите блюда для заказа');
            return false;
        }

        // 2. Только напиток и/или десерт
        if (!hasSoup && !hasMain && !hasSalad && (hasDrink || hasDessert)) {
            showNotification('Выберите главное блюдо');
            return false;
        }

        // 3. Только салат
        if (hasSalad && !hasSoup && !hasMain && !hasDrink) {
            showNotification('Выберите суп или главное блюдо');
            return false;
        }

        // 4. Только суп
        if (hasSoup && !hasMain && !hasSalad && !hasDrink) {
            showNotification('Выберите главное блюдо/салат/стартер');
            return false;
        }

        // 5. Валидные комбо
        const validCombos = [
            { soup: true,  main: true,  salad: true,  drink: true  },
            { soup: true,  main: true,  salad: false, drink: true  },
            { soup: true,  main: false, salad: true,  drink: true  },
            { soup: false, main: true,  salad: true,  drink: true  },
            { soup: false, main: true,  salad: false, drink: true  },
        ];

        const current = { soup: hasSoup, main: hasMain, salad: hasSalad, drink: hasDrink };
        const isValid = validCombos.some(c =>
            c.soup === current.soup && c.main === current.main &&
            c.salad === current.salad && c.drink === current.drink
        );

        if (isValid) return true;

        // 6. Не хватает напитка
        if ((hasSoup || hasMain || hasSalad) && !hasDrink) {
            showNotification('Выберите напиток');
            return false;
        }

        // 7. Заглушка
        showNotification('Выберите блюда для заказа');
        return false;
    }

    if (orderForm) {
        orderForm.addEventListener('submit', function(event) {
            if (!validateOrder()) event.preventDefault();
        });
    }

    if (notificationOverlay) {
        notificationOverlay.addEventListener('click', function(event) {
            if (event.target === notificationOverlay) {
                notificationOverlay.style.display = 'none';
                const notif = document.querySelector('.notification');
                if (notif) notif.remove();
            }
        });
    }
});