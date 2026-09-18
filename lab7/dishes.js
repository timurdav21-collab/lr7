// ЗАГРУЗКА ДАННЫХ С СЕРВЕРА ЧЕРЕЗ API (ЛАБ 7)

// ГЛОБАЛЬНАЯ ПЕРЕМЕННАЯ ДЛЯ ХРАНЕНИЯ БЛЮД
let dishes = [];

// АСИНХРОННАЯ ФУНКЦИЯ ЗАГРУЗКИ ДАННЫХ
async function loadDishes() {
    // ВАЖНО: выберите URL в зависимости от того, где открыта страница:
    // - локально / Netlify / GitHub Pages → HTTPS
    // - хостинг МосПолитеха → HTTP
    const url = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
    // const url = 'http://lab7-api.std-900.ist.mospolytech.ru/api/dishes';

    try {
        console.log('Запрос к API:', url);

        const response = await fetch(url);
        console.log('Статус ответа:', response.status);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }

        dishes = await response.json();
        console.log('Данные загружены с сервера:', dishes.length, 'блюд');
        console.log('Пример блюда:', dishes[0]);

        return dishes;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error.name, error.message);
        return [];
    }
}