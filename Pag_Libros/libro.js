// ✅ Actualizar contador del carrito
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const contador = document.getElementById('contador-carrito');
  if (contador) {
    contador.textContent = carrito.length;
  }
}

// ✅ Cargar detalle del libro
async function cargarDetalleLibro() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  if (!id) {
    alert('No se especificó el ID del libro.');
    return;
  }

  try {
    const response = await fetch(`https://localhost:7114/api/libros/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener los datos del libro');
    }

    const libro = await response.json();

    // ✅ Corregir imagen
    let imagenFinal = libro.imagenURL;
    if (imagenFinal && !imagenFinal.startsWith('http') && !imagenFinal.startsWith('/')) {
      imagenFinal = '../' + imagenFinal;
    }

    // ✅ Mostrar en la página
    document.getElementById('imagen-libro').src = imagenFinal || '../img/default.jpg';
    document.getElementById('titulo-libro').textContent = libro.titulo;
    document.getElementById('autor-libro').textContent = libro.autorNombre;
    document.getElementById('precio-libro').textContent = `S/ ${libro.precio.toFixed(2)}`;
    document.getElementById('stock-libro').textContent = libro.stock;
    document.getElementById('categoria-libro').textContent = libro.categoriaNombre;
    document.getElementById('descripcion-libro').textContent = libro.descripcion;

    // ✅ Manejar "Agregar al carrito"
    document.getElementById('agregar-carrito').addEventListener('click', () => {
      const cantidad = parseInt(document.getElementById('cantidad').value);

      if (isNaN(cantidad) || cantidad < 1) {
        alert('Ingrese una cantidad válida.');
        return;
      }

      if (cantidad > libro.stock) {
        alert(`No puedes agregar más de ${libro.stock} unidades.`);
        return;
      }

      // ✅ Construir objeto compatible con el carrito
      const libroParaCarrito = {
        id: libro.libroID,
        titulo: libro.titulo,
        precio: libro.precio, // número
        cantidad,
        imgSrc: imagenFinal || '../img/default.jpg'
      };

      // ✅ Guardar en carrito
      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      carrito.push(libroParaCarrito);
      localStorage.setItem('carrito', JSON.stringify(carrito));

      alert(`Se agregaron ${cantidad} unidad(es) de "${libro.titulo}" al carrito.`);
      actualizarContadorCarrito();
    });

  } catch (error) {
    console.error('Error al cargar el detalle del libro:', error);
    alert('Error al cargar los detalles del libro.');
  }
}

// ✅ Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarDetalleLibro();
  actualizarContadorCarrito();
});
