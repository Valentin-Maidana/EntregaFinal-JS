const navbar = document.getElementById('navbar');

const contenedorProductos = document.getElementById('productos');

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(producto => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta';
            const tituloTarjeta = document.createElement('h3');
            tituloTarjeta.textContent = producto.nombre;
            const precioTarjeta = document.createElement('p');
            precioTarjeta.textContent = `Precio: ${producto.precio}`;
            const descripcionTarjeta = document.createElement('p');
            descripcionTarjeta.textContent = producto.descripcion;
            const imagenTarjeta = document.createElement('img');
            imagenTarjeta.src = producto.imagen;
            imagenTarjeta.alt = producto.nombre;
            const botonAgregar = document.createElement('button');
            botonAgregar.textContent = 'Agregar al Carrito';
            botonAgregar.addEventListener('click', () => {
                Swal.fire({
                    title: 'Confirmar compra',
                    text: `¿Deseas agregar ${producto.nombre} al carrito?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, agregar',
                    cancelButtonText: 'No, cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        agregarAlCarrito(producto);
                        Swal.fire(
                            'Agregado',
                            `${producto.nombre} ha sido agregado al carrito.`,
                            'success'
                        );
                    }
                });
            });

            tarjeta.appendChild(imagenTarjeta);
            tarjeta.appendChild(tituloTarjeta);
            tarjeta.appendChild(precioTarjeta);
            tarjeta.appendChild(descripcionTarjeta);
            tarjeta.appendChild(botonAgregar);

            contenedorProductos.appendChild(tarjeta);
        });
    })
    .catch(error => console.error('Error al cargar los productos:', error));

const contenedorCarrito = document.getElementById('carrito');

const listaCarrito = document.getElementById('itemsCarrito');

const totalCarritoElemento = document.getElementById('totalCarrito');

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const calcularTotalCarrito = () => {
    let total = 0;
    carrito.forEach(item => {
        total += parseInt(item.precio.replace('$', ''));
    });
    return total;
};

const actualizarCarrito = () => {
    listaCarrito.innerHTML = '';
    carrito.forEach((item, index) => {
        const itemLista = document.createElement('li');
        itemLista.textContent = `${item.nombre} - ${item.precio}`;
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', () => {
            eliminarDelCarrito(index);
        });
        itemLista.appendChild(botonEliminar);
        listaCarrito.appendChild(itemLista);
    });

    const total = calcularTotalCarrito();
    totalCarritoElemento.textContent = `Total: $${total}`;
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

const agregarAlCarrito = (producto) => {
    carrito.push(producto);
    actualizarCarrito();
};

const eliminarDelCarrito = (index) => {
    carrito.splice(index, 1);
    actualizarCarrito();
};

actualizarCarrito();

document.getElementById('comprarTodo').addEventListener('click', () => {
    if (carrito.length === 0) {
        Swal.fire(
            'Carrito Vacío',
            'No hay productos en el carrito para comprar.',
            'warning'
        );
    } else {
        Swal.fire({
            title: 'Confirmar compra',
            text: `¿Deseas comprar todos los productos del carrito por un total de $${calcularTotalCarrito()}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, comprar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                actualizarCarrito();
                Swal.fire(
                    'Compra realizada',
                    'Tu compra ha sido realizada con éxito.',
                    'success'
                );
            }
        });
    }
});
