document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const clearBtn = document.getElementById('clear-search');
  const cards = document.querySelectorAll('.food-card');

  // Фільтрація карток по пошуку
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    cards.forEach(card => {
      const name = card.getAttribute('data-text').toLowerCase().trim();
      card.style.display = name.includes(query) ? '' : 'none';
    });

    // Показати або сховати кнопку хрестик
    clearBtn.style.display = query ? 'inline' : 'none';
  });

  // Очищення пошуку при натисканні на хрестик
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    cards.forEach(card => card.style.display = '');
    clearBtn.style.display = 'none';
    searchInput.focus();
  });

  // Спочатку хрестик схований
  clearBtn.style.display = 'none';
});