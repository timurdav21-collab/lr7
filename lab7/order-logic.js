// Глобальный объект — доступен из других файлов
window.selectedDishes = {
    soup: null,
    'main-course': null,   // ключ как в API
    salad: null,
    drink: null,           // ключ как в API
    dessert: null,
};

document.addEventListener('DOMContentLoaded', function() {
    const selectedDishes = window.selectedDishes;

    const emptyOrderMessage = document.getElementById('empty-order-message');
    const selectedSoupEl = document.getElementById('selected-soup');
    const selectedMainEl = document.getElementById('selected-main');
    const selectedSaladEl = document.getElementById('selected-salad');
    const selectedBeverageEl = document.getElementById('selected-beverage');
    const selectedDessertEl = document.getElementById('selected-dessert');
    const selectedSoupName = document.getElementById('selected-soup-name');
    const selectedMainName = document.getElementById('selected-main-name');
    const selectedSaladName = document.getElementById('selected-salad-name');
    const selectedBeverageName = document.getElementById('selected-beverage-name');
    const selectedDessertName = document.getElementById('selected-dessert-name');
    const orderTotalEl = document.getElementById('order-total');
    const totalPriceEl = document.getElementById('total-price');
    const selectedSoupInput = document.getElementById('selected_soup_input');
    const selectedMainInput = document.getElementById('selected_main_input');
    const selectedSaladInput = document.getElementById('selected_salad_input');
    const selectedBeverageInput = document.getElementById('selected_beverage_input');
    const selectedDessertInput = document.getElementById('selected_dessert_input');
    const totalPriceInput = document.getElementById('total_price_input');

    function updateHiddenInputs() {
        selectedSoupInput.value = selectedDishes.soup ? selectedDishes.soup.keyword : '';
        selectedMainInput.value = selectedDishes['main-course'] ? selectedDishes['main-course'].keyword : '';
        selectedSaladInput.value = selectedDishes.salad ? selectedDishes.salad.keyword : '';
        selectedBeverageInput.value = selectedDishes.drink ? selectedDishes.drink.keyword : '';
        selectedDessertInput.value = selectedDishes.dessert ? selectedDishes.dessert.keyword : '';
    }

    function updateCategoryDisplay(category, element, nameElement, defaultText) {
        const dish = selectedDishes[category];
        if (dish) {
            element.style.display = 'block';
            nameElement.textContent = `${dish.name} ${dish.price}Р`;
            nameElement.classList.remove('empty');
        } else {
            element.style.display = 'block';
            nameElement.textContent = defaultText;
            nameElement.classList.add('empty');
        }
    }

    function calculateTotal() {
        let total = 0;
        if (selectedDishes.soup) total += selectedDishes.soup.price;
        if (selectedDishes['main-course']) total += selectedDishes['main-course'].price;
        if (selectedDishes.salad) total += selectedDishes.salad.price;
        if (selectedDishes.drink) total += selectedDishes.drink.price;
        if (selectedDishes.dessert) total += selectedDishes.dessert.price;
        totalPriceEl.textContent = `${total}Р`;
        totalPriceInput.value = total;
    }

    function updateSectionHeadings() {
        const sections = document.querySelectorAll('.dishes-section');
        sections[0].querySelector('h2').textContent = selectedDishes.soup
            ? `Выберите суп (выбран: ${selectedDishes.soup.name})` : 'Выберите суп';
        sections[1].querySelector('h2').textContent = selectedDishes['main-course']
            ? `Выберите главное блюдо (выбран: ${selectedDishes['main-course'].name})` : 'Выберите главное блюдо';
        sections[2].querySelector('h2').textContent = selectedDishes.salad
            ? `Выберите салат или стартер (выбран: ${selectedDishes.salad.name})` : 'Выберите салат или стартер';
        sections[3].querySelector('h2').textContent = selectedDishes.drink
            ? `Выберите напиток (выбран: ${selectedDishes.drink.name})` : 'Выберите напиток';
        sections[4].querySelector('h2').textContent = selectedDishes.dessert
            ? `Выберите десерт (выбран: ${selectedDishes.dessert.name})` : 'Выберите десерт';
    }

    function updateOrderDisplay() {
        const hasSelectedDishes = selectedDishes.soup
            || selectedDishes['main-course']
            || selectedDishes.salad
            || selectedDishes.drink
            || selectedDishes.dessert;

        if (!hasSelectedDishes) {
            emptyOrderMessage.style.display = 'block';
            selectedSoupEl.style.display = 'none';
            selectedMainEl.style.display = 'none';
            selectedSaladEl.style.display = 'none';
            selectedBeverageEl.style.display = 'none';
            selectedDessertEl.style.display = 'none';
            orderTotalEl.style.display = 'none';
        } else {
            emptyOrderMessage.style.display = 'none';
            updateCategoryDisplay('soup', selectedSoupEl, selectedSoupName, 'Блюдо не выбрано');
            updateCategoryDisplay('main-course', selectedMainEl, selectedMainName, 'Блюдо не выбрано');
            updateCategoryDisplay('salad', selectedSaladEl, selectedSaladName, 'Блюдо не выбрано');
            updateCategoryDisplay('drink', selectedBeverageEl, selectedBeverageName, 'Напиток не выбран');
            updateCategoryDisplay('dessert', selectedDessertEl, selectedDessertName, 'Десерт не выбран');
            orderTotalEl.style.display = 'block';
            calculateTotal();
        }
        updateHiddenInputs();
    }

    function resetOrder() {
        selectedDishes.soup = null;
        selectedDishes['main-course'] = null;
        selectedDishes.salad = null;
        selectedDishes.drink = null;
        selectedDishes.dessert = null;

        document.querySelectorAll('.dish-card.selected').forEach(card => {
            card.classList.remove('selected');
            card.querySelector('.add-btn').textContent = 'Добавить';
        });

        updateOrderDisplay();
        updateSectionHeadings();
    }

    function selectDish(dishKeyword) {
        // ВАЖНО: dishes — глобальная переменная из dishes.js
        const dish = dishes.find(d => d.keyword === dishKeyword);
        if (!dish) return;

        const category = dish.category;

        if (selectedDishes[category]) {
            const previousSelected = document.querySelector(
                `.dish-card[data-dish="${selectedDishes[category].keyword}"]`
            );
            if (previousSelected) {
                previousSelected.classList.remove('selected');
                previousSelected.querySelector('.add-btn').textContent = 'Добавить';
            }
        }

        const currentCard = document.querySelector(
            `.dish-card[data-dish="${dishKeyword}"]`
        );
        if (currentCard) {
            currentCard.classList.add('selected');
            currentCard.querySelector('.add-btn').textContent = '✓ Добавлено';
        }

        selectedDishes[category] = dish;
        updateOrderDisplay();
        updateSectionHeadings();
    }

    function init() {
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('add-btn')) {
                const dishCard = event.target.closest('.dish-card');
                if (dishCard) {
                    selectDish(dishCard.getAttribute('data-dish'));
                }
            }
        });

        document.querySelector('.reset-btn').addEventListener('click', resetOrder);

        document.getElementById('order-form').addEventListener('reset', function() {
            setTimeout(resetOrder, 0);
        });
    }

    init();
    updateOrderDisplay();
    updateSectionHeadings();
});