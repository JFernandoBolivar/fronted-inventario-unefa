"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductForm from "./form-productos";
import { EstadisticasInventario } from "./estadisticas-inventario";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import type { Product } from "../../app/(protected)/types/produc";

const categorias = ["Papel", "Escritura", "Archivo", "Oficina", "Escolar"];

export default function TablaInventarioEjemplo() {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("all");
  const [mostrarStockBajo, setMostrarStockBajo] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Estados para la paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina, setProductosPorPagina] = useState(10);

  // Obtener productos desde la API
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/api/inventario/productos/"
      );
      if (!response.ok) {
        throw new Error("Error al cargar los productos");
      }
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductos();
  }, []);

  // Filtrar productos
  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre_producto
        .toLowerCase()
        .includes(terminoBusqueda.toLowerCase()) ||
      producto.marca?.toLowerCase().includes(terminoBusqueda.toLowerCase());
    const coincideCategoria =
      categoriaSeleccionada === "all" ||
      producto.categoria === categoriaSeleccionada;

    // Nuevo cálculo de porcentaje de stock
    const min = 0.02;

    const porcentajeStock =
      producto.stock_actual > 3 ? Math.max(1, producto.stock_actual * min) : 1;

    const coincideStockBajo = !mostrarStockBajo || porcentajeStock < 3;

    return coincideBusqueda && coincideCategoria && coincideStockBajo;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const retry = () => {
    fetchProductos();
    handleFormClose();
  };

  // Calcular datos de paginación
  const totalPaginas = Math.ceil(
    productosFiltrados.length / productosPorPagina
  );
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);

  // Resetear a la primera página cuando cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [terminoBusqueda, categoriaSeleccionada, mostrarStockBajo]);

  // Manejar cambio de página
  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="space-y-6">
      <EstadisticasInventario productos={productos} />
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Inventario de Productos</CardTitle>
              <CardDescription>Gestión de stock y productos</CardDescription>
            </div>
            <Button size={"sm"} onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Controles de filtrado y búsqueda */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={categoriaSeleccionada}
              onValueChange={setCategoriaSeleccionada}
            >
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={mostrarStockBajo ? "default" : "outline"}
              onClick={() => setMostrarStockBajo(!mostrarStockBajo)}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Stock Bajo
            </Button>
          </div>

          {/* Tabla de productos */}
          <div className="rounded-md border mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Stock</TableHead>
                  {/* <TableHead>Ubicación</TableHead> */}
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productosPaginados.map((producto) => {
                  const min = 0.02;

                  const porcentajeStock =
                    producto.stock_actual > 3
                      ? Math.max(1, producto.stock_actual * min)
                      : 1;

                  const esStockBajo = producto.stock_actual <= porcentajeStock;

                  return (
                    <TableRow key={producto.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {producto.nombre_producto}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {producto.marca}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{producto.categoria}</p>
                          {producto.subcategoria && (
                            <p className="text-sm text-muted-foreground">
                              {producto.subcategoria}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">
                            {producto.stock_actual}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Inicial: {producto.stock_actual}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Mín: {porcentajeStock}
                          </p>
                        </div>
                      </TableCell>
                      {/* <TableCell>{producto.ubicacion_fisica}</TableCell> */}
                      <TableCell>
                        Bs. {producto.precio_venta.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={esStockBajo ? "destructive" : "default"}
                        >
                          {esStockBajo ? "Stock Bajo" : "Normal"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(producto)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {/* Selector de items por página e información de paginación */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {indiceInicio + 1}-
              {Math.min(indiceFin, productosFiltrados.length)} de{" "}
              {productosFiltrados.length} productos
            </p>
          </div>

          {/* Controles de paginación */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Productos por página:
              </p>
              <Select
                value={productosPorPagina.toString()}
                onValueChange={(value) => {
                  setProductosPorPagina(Number(value));
                  setPaginaActual(1);
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              className="flex-1 text-sm text-muted-foreground m-auto
              text-center"
            >
              Página {paginaActual} de {totalPaginas}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => cambiarPagina(1)}
                disabled={paginaActual === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => cambiarPagina(totalPaginas)}
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mensaje cuando no hay productos */}
          {productosFiltrados.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No se encontraron productos
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <ProductForm
        isOpen={isFormOpen}
        onCloseAction={handleFormClose}
        editingProduct={editingProduct}
        onSuccessAction={retry}
      />
    </div>
  );
}
