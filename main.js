function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const contador = document.getElementById('contador-carrito');
  if (contador) {
    contador.textContent = carrito.length;
  }
}

async function cargarLibrosPorCategoriasDesdeAPI() {
  try {
    const response = await fetch('https://localhost:7114/api/libros');
    const libros = await response.json();

    // SOLO categorías que deben aparecer en el index
    const categoriasEnIndex = ['Fantasía', 'Romance', 'Misterio'];

    // Limpiar todos los libros-grid en los fieldset visibles
    document.querySelectorAll('.genero-fieldset .libros-grid').forEach(grid => {
      grid.innerHTML = '';
    });

    // Recorrer libros
    libros.forEach(libro => {
      if (categoriasEnIndex.includes(libro.categoriaNombre)) {
        // Determinar en qué fieldset va
        let gridSelector = '';

        if (libro.categoriaNombre === 'Fantasía') {
          gridSelector = '.genero-fieldset:nth-of-type(1) .libros-grid';
        } else if (libro.categoriaNombre === 'Romance') {
          gridSelector = '.genero-fieldset:nth-of-type(2) .libros-grid';
        } else if (libro.categoriaNombre === 'Misterio') {
          gridSelector = '.genero-fieldset:nth-of-type(3) .libros-grid';
        }

        // Si corresponde a un fieldset del index
        if (gridSelector) {
          const grid = document.querySelector(gridSelector);

          const div = document.createElement('div');
          div.className = 'libro';

          div.innerHTML = `
            <img src="${libro.imagenURL || 'img/default.jpg'}" alt="${libro.titulo}">
            <h3>${libro.titulo}</h3>
            <p>${libro.autorNombre}</p>
            <p>S/ ${libro.precio.toFixed(2)}</p>
            <button data-id="${libro.libroID}">Ver libro</button>
          `;

          // Evento "Ver libro"
          div.querySelector('button').addEventListener('click', () => {
            window.location.href = `Pag_Libros/HP.html?id=${libro.libroID}`;
          });

          grid.appendChild(div);
        }
      }
    });
  } catch (error) {
    console.error('Error al cargar los libros por categorías:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarLibrosPorCategoriasDesdeAPI(); // Cargar libros por categorías

  actualizarContadorCarrito(); // Actualizar contador del carrito

  // Buscador
  const searchInput = document.querySelector('.search-bar');
  searchInput?.addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    const libros = document.querySelectorAll('.libro');

    libros.forEach(libro => {
      const titulo = libro.querySelector('h3').textContent.toLowerCase();
      const autor = libro.querySelector('p').textContent.toLowerCase();
      libro.style.display = (titulo.includes(term) || autor.includes(term)) ? 'block' : 'none';
    });
  });

  // Configurar botones "Ver más" en los fieldset
  document.querySelectorAll('.genero-fieldset').forEach(fieldset => {
    const legend = fieldset.querySelector('legend')?.textContent?.trim();
    const btnVerMas = fieldset.querySelector('.ver-mas');

    if (legend && btnVerMas) {
      btnVerMas.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `categoria.html?categoria=${encodeURIComponent(legend)}`;
      });
    }
  });
});
