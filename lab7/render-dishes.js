// ОТОБРАЖЕНИЕ БЛЮД (ОБНОВЛЕНО ДЛЯ ЛР7)

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);

    const img = document.createElement('img');
    // ЗАМЕНА HTTP НА HTTPS ДЛЯ ИЗОБРАЖЕНИЙ (mixed content fix)
    img.src = dish.image.replace('http://', 'https://');
    img.alt = dish.name;
    // ЗАПАСНОЙ ВАРИАНТ, ЕСЛИ КАРТИНКА НЕ ЗАГРУЗИЛАСЬ
    img.onerror = function() {
        this.onerror = null;
        this.src = 'icons/placeholder.png';
    };

    const price = document.createElement('p');
    price.className = 'price';
    price.textContent = `${dish.price}Р`;

    const name = document.createElement('p');
    name.className = 'name';
    name.textContent = dish.name;

    const weight = document.createElement('p');
    weight.className = 'weight';
    weight.textContent = dish.count;

    const button = document.createElement('button');
    button.className = 'add-btn';
    button.textContent = 'Добавить';

    card.appendChild(img);
    card.appendChild(price);
    card.appendChild(name);
    card.appendChild(weight);
    card.appendChild(button);

    return card;
}

function getContainerId(category) {
    switch (category) {
    case 'soup': return 'soups-container';
    case 'main-course': return 'main-container';
    case 'salad': return 'salad-container';
    case 'drink': return 'beverages-container';
    case 'dessert': return 'dessert-container';
    default: return '';
    }
}

function renderCategory(category, dishesList) {
    const containerId = getContainerId(category);
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = '';

    const sortedCategoryDishes = [...dishesList].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    sortedCategoryDishes.forEach(dish => {
        const dishCard = createDishCard(dish);
        container.appendChild(dishCard);
    });
}

function renderAllDishes() {
    const sortedDishes = [...dishes].sort((a, b) => {
        const categoryOrder = {
            'soup': 1,
            'main-course': 2,
            'salad': 3,
            'drink': 4,
            'dessert': 5,
        };

        if (categoryOrder[a.category] !== categoryOrder[b.category]) {
            return categoryOrder[a.category] - categoryOrder[b.category];
        }

        return a.name.localeCompare(b.name);
    });

    const dishesByCategory = {
        'soup': sortedDishes.filter(d => d.category === 'soup'),
        'main-course': sortedDishes.filter(d => d.category === 'main-course'),
        'salad': sortedDishes.filter(d => d.category === 'salad'),
        'drink': sortedDishes.filter(d => d.category === 'drink'),
        'dessert': sortedDishes.filter(d => d.category === 'dessert'),
    };

    renderCategory('soup', dishesByCategory.soup);
    renderCategory('main-course', dishesByCategory['main-course']);
    renderCategory('salad', dishesByCategory.salad);
    renderCategory('drink', dishesByCategory.drink);
    renderCategory('dessert', dishesByCategory.dessert);
}

// ЗАГРУЗКА ДАННЫХ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
document.addEventListener('DOMContentLoaded', async function() {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = 'Загрузка меню...';
    document.querySelector('main').prepend(loadingIndicator);

    try {
        await loadDishes();

        if (dishes.length === 0) {
            loadingIndicator.textContent = 'Не удалось загрузить меню';
            loadingIndicator.style.color = 'red';
            return;
        }

        loadingIndicator.remove();
        renderAllDishes();
    } catch (error) {
        console.error('Ошибка при загрузке и отрисовке:', error);
        loadingIndicator.textContent = 'Ошибка загрузки меню';
        loadingIndicator.style.color = 'red';
    }
});