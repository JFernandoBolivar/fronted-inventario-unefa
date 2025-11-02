import { NextResponse } from "next/server";

<<<<<<< HEAD
// --- 1. Definición de Interfaces y Tipos (Exportables) ---

/**
 * Interfaz del Producto. Debe ser EXPORTADA para que ventas pueda importarla.
 */
export interface Product {
=======
// Definimos la interfaz del producto según tu estructura
interface Product {
>>>>>>> 72c11592c80c804b1beee52043e637f7cd88b219
  id: number;
  nombre_producto: string;
  marca?: string;
  categoria: string;
  subcategoria?: string;
  descripcion?: string;
<<<<<<< HEAD
  stock_actual: number; // Campo que será modificado por las ventas
=======
  stock_actual: number;
  // stock_minimo: number;
  // ubicacion_fisica: string;
>>>>>>> 72c11592c80c804b1beee52043e637f7cd88b219
  precio_venta: number;
}

type ProductsResponse = Product[];

<<<<<<< HEAD
// --- 2. Variable de Datos Compartida ---

/**
 * Esta variable almacena el estado actual del inventario en memoria.
 * Al estar fuera de getData(), su referencia es compartida y puede ser modificada.
 */
const inventoryData: ProductsResponse = [
  {
    id: 1,
    nombre_producto: "Lápices HB",
    descripcion: "Lápices de alta calidad para dibujo y escritura",
    marca: "Faber-Castell",
    categoria: "Escritura",
    subcategoria: "Lápices",
    stock_actual: 150,
    precio_venta: 0.75,
  },
  {
    id: 2,
    nombre_producto: "Resma de Papel",
    marca: "Norma",
    categoria: "Papel",
    subcategoria: "Bond",
    stock_actual: 20,
    precio_venta: 15.5,
  },
  {
    id: 3,
    nombre_producto: "Grapadora",
    marca: "Swingline",
    categoria: "Oficina",
    subcategoria: "Grapadoras",
    stock_actual: 8,
    precio_venta: 12.99,
  },
  {
    id: 4,
    nombre_producto: "Bolígrafos Azules",
    marca: "BIC",
    categoria: "Escritura",
    subcategoria: "Bolígrafos",
    stock_actual: 200,
    precio_venta: 1.25,
  },
  {
    id: 5,
    nombre_producto: "Cuaderno Universitario",
    marca: "Norma",
    categoria: "Papel",
    subcategoria: "Cuadernos",
    stock_actual: 45,
    precio_venta: 8.75,
  },
  {
    id: 6,
    nombre_producto: "Tijeras",
    marca: "Fiskars",
    categoria: "Oficina",
    subcategoria: "Herramientas",
    stock_actual: 5,
    precio_venta: 9.99,
  },
  {
    id: 7,
    nombre_producto: "Tijeras", // Producto duplicado para simulación
    marca: "Fiskars",
    categoria: "Oficina",
    subcategoria: "Herramientas",
    stock_actual: 5,
    precio_venta: 9.99,
  },
];

// --- 3. Función para Obtener Datos (Exportable) ---

/**
 * getData: Debe ser EXPORTADA para que el módulo de ventas pueda obtener 
 * una referencia al inventario y manipular el stock.
 */
export async function getData(): Promise<ProductsResponse> {
  // Retornamos la referencia a la variable de datos compartida
  return inventoryData;
}

// --- 4. Handler GET: Responder a las solicitudes de Inventario ---

=======
// Función para generar los datos de simulación
async function getData(): Promise<ProductsResponse> {
  return [
    {
      id: 1,
      nombre_producto: "Lápices HB",
      descripcion: "Lápices de alta calidad para dibujo y escritura",
      marca: "Faber-Castell",
      categoria: "Escritura",
      subcategoria: "Lápices",
      stock_actual: 150,
      // stock_minimo: 50,
      // ubicacion_fisica: "A2-C3",
      precio_venta: 0.75,
    },
    {
      id: 2,
      nombre_producto: "Resma de Papel",
      marca: "Norma",
      categoria: "Papel",
      subcategoria: "Bond",
      stock_actual: 20,
      // stock_minimo: 30,
      // ubicacion_fisica: "B1-D4",
      precio_venta: 15.5,
    },
    {
      id: 3,
      nombre_producto: "Grapadora",
      marca: "Swingline",
      categoria: "Oficina",
      subcategoria: "Grapadoras",
      stock_actual: 8,
      // stock_minimo: 10,
      // ubicacion_fisica: "C3-E2",.\
      precio_venta: 12.99,
    },
    // Podemos agregar más productos de ejemplo
    {
      id: 4,
      nombre_producto: "Bolígrafos Azules",
      marca: "BIC",
      categoria: "Escritura",
      subcategoria: "Bolígrafos",
      stock_actual: 200,
      // stock_minimo: 100,
      // ubicacion_fisica: "A1-B2",
      precio_venta: 1.25,
    },
    {
      id: 5,
      nombre_producto: "Cuaderno Universitario",
      marca: "Norma",
      categoria: "Papel",
      subcategoria: "Cuadernos",
      stock_actual: 45,
      // stock_minimo: 25,
      // ubicacion_fisica: "B3-C1",
      precio_venta: 8.75,
    },
    {
      id: 6,
      nombre_producto: "Tijeras",
      marca: "Fiskars",
      categoria: "Oficina",
      subcategoria: "Herramientas",
      stock_actual: 5,
      // stock_minimo: 15,
      // ubicacion_fisica: "D2-E4",
      precio_venta: 9.99,
    },
    {
      id: 7,
      nombre_producto: "Tijeras",
      marca: "Fiskars",
      categoria: "Oficina",
      subcategoria: "Herramientas",
      stock_actual: 5,
      // stock_minimo: 15,
      // ubicacion_fisica: "D2-E4",
      precio_venta: 9.99,
    },
  ];
}

>>>>>>> 72c11592c80c804b1beee52043e637f7cd88b219
// Handler para la ruta GET /api/inventory
export async function GET() {
  try {
    // Simulamos un pequeño retardo para hacerlo más realista
    await new Promise((resolve) => setTimeout(resolve, 500));

<<<<<<< HEAD
    const data = await getData(); // Obtiene la referencia compartida
=======
    const data = await getData();
>>>>>>> 72c11592c80c804b1beee52043e637f7cd88b219

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
<<<<<<< HEAD
    // Usamos console.error para justificar el uso de 'error' y solucionar el warning de ESLint.
    console.error("Error al obtener los datos de inventario:", error); 
    
=======
>>>>>>> 72c11592c80c804b1beee52043e637f7cd88b219
    return NextResponse.json(
      { error: "Error al obtener los datos de inventario" },
      { status: 500 }
    );
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 72c11592c80c804b1beee52043e637f7cd88b219
