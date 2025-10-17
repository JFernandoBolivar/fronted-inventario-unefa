import { NextResponse } from "next/server";

// Definimos la interfaz del producto según tu estructura
interface Product {
  id: number;
  nombre_producto: string;
  marca?: string;
  categoria: string;
  subcategoria?: string;
  descripcion?: string;
  stock_actual: number;
  // stock_minimo: number;
  // ubicacion_fisica: string;
  precio_venta: number;
}

type ProductsResponse = Product[];

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

// Handler para la ruta GET /api/inventory
export async function GET() {
  try {
    // Simulamos un pequeño retardo para hacerlo más realista
    await new Promise((resolve) => setTimeout(resolve, 500));

    const data = await getData();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los datos de inventario" },
      { status: 500 }
    );
  }
}
