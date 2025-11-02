import { NextResponse } from "next/server";

// --- 1. Definición de Interfaces y Tipos (Exportables) ---

/**
 * Interfaz del Producto. Debe ser EXPORTADA para que ventas pueda importarla.
 */
export interface Product {
  id: number;
  nombre_producto: string;
  marca?: string;
  categoria: string;
  subcategoria?: string;
  descripcion?: string;
  stock_actual: number; // Campo que será modificado por las ventas
  precio_venta: number;
}

type ProductsResponse = Product[];

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

// Handler para la ruta GET /api/inventory
export async function GET() {
  try {
    // Simulamos un pequeño retardo para hacerlo más realista
    await new Promise((resolve) => setTimeout(resolve, 500));

    const data = await getData(); // Obtiene la referencia compartida

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Usamos console.error para justificar el uso de 'error' y solucionar el warning de ESLint.
    console.error("Error al obtener los datos de inventario:", error); 
    
    return NextResponse.json(
      { error: "Error al obtener los datos de inventario" },
      { status: 500 }
    );
  }
}