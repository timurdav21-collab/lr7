// ЛОГИКА ФИЛЬТРАЦИИ (ОБНОВЛЕНО ДЛЯ ЛР7)

document.addEventListener('DOMContentLoaded', function() {
    const activeFilters = {
        soup: null,
        'main-course': null,
        salad: null,
        drink: null,
        dessert: null,
    };

    function filterDishes() {
        document.querySelectorAll('.dish-card').forEach(card => {
            const dishKeyword = card.getAttribute('data-dish');
            const dish = dishes.find(d => d.keyword === dishKeyword);
            if (!dish) return;

            const category = dish.category;
            const activeFilter = activeFilters[category];

            if (activeFilter && dish.kind !== activeFilter) {
                card.style.display = 'none';
            } else {
                card.style.display = 'flex';
            }
        });
    }

    function initFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const kind = this.getAttribute('data-kind');
                const category = this.getAttribute('data-category');

                if (activeFilters[category] === kind) {
                    activeFilters[category] = null;
                    this.classList.remove('active');
                } else {
                    activeFilters[category] = kind;
                    document.querySelectorAll(
                        `.filter-btn[data-category="${category}"]`
                    ).forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                }

                filterDishes();
            });
        });
    }

    initFilters();
});