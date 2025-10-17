"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import newArticulo from "../../../actions/new_articulo";
import {
  articuloSchema,
  type ArticuloInput,
} from "@/app/(protected)/zod/formArticulos";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { ApiService } from "@/lib/api";
import type { Product } from "../../app/(protected)/types/produc";

const categories = ["Papel", "Escritura", "Archivo", "Oficina", "Escolar"];
const subcategories = {
  Papel: ["Bond", "Fotocopia", "Cartulina", "Construcción"],
  Escritura: ["Bolígrafos", "Lápices", "Marcadores", "Plumas"],
  Archivo: ["Carpetas", "Folders", "Archivadores", "Separadores"],
  Oficina: ["Clips", "Grapas", "Cintas", "Correctores"],
  Escolar: ["Cuadernos", "Libretas", "Reglas", "Compases"],
};

interface ProductFormProps {
  isOpen: boolean;
  onCloseAction: () => void;
  editingProduct?: Product | null;
  onSuccessAction: () => void;
}
// function mostrarCamposEspeciales(categoria: string, subcategoria: string) {
//   // Ejemplo: mostrar para Papel/Bond y Escritura/Lápices
//   if (
//     (categoria === "Oficina" && subcategoria === "Clips") ||
//     (categoria === "Oficina" && subcategoria === "Grapas")
//   ) {
//     return { unidades_por_bulto: false, peso: true, volumen: false };
//   }
//   if (
//     (categoria === "Papel" && subcategoria === "Bond") ||
//     (categoria === "Papel" && subcategoria === "Fotocopia") ||
//     (categoria === "Papel" && subcategoria === "Cartulina") ||
//     (categoria === "Papel" && subcategoria === "Construcción")
//   ) {
//     return { unidades_por_bulto: false, peso: true, volumen: true };
//   }

//   // Por Volumen/Bulto o Unidades por Bulto: El resto de los productos.
//   // Todos los artículos se manejan en cajas o paquetes para inventario.
//   return { unidades_por_bulto: false, peso: false, volumen: false };
// }

export default function ProductForm({
  isOpen,
  onCloseAction,
  editingProduct,
  onSuccessAction,
}: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    id: editingProduct?.id || 0,
    nombre_producto: editingProduct?.nombre_producto || "",
    descripcion: editingProduct?.descripcion || "",
    marca: editingProduct?.marca || "",
    categoria: editingProduct?.categoria || "",
    subcategoria: editingProduct?.subcategoria || "",
    stock_actual: editingProduct?.stock_actual || 0,
    stock_minimo: editingProduct?.stock_minimo || 0,
    // ubicacion_fisica: editingProduct?.ubicacion_fisica || "",
    precio_compra: editingProduct?.precio_compra || 0,
    precio_venta: editingProduct?.precio_venta || 0,
    unidades_por_bulto: editingProduct?.unidades_por_bulto || 0,

    fecha_actualizacion: editingProduct?.fecha_actualizacion || "",
  });
  const [loading, setLoading] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);
  // ...existing code...
  const handleSubmit = async () => {
    setLoading(true);
    setValidationError(null);

    const parsed = articuloSchema.safeParse(formData);

    if (!parsed.success) {
      setValidationError(
        "Por favor completa los campos requeridos correctamente."
      );
      setLoading(false);
      return;
    }
    if (!formData.nombre_producto || !formData.categoria) return;

    try {
      // Mostrar en consola
      console.log("Saving product:", formData);

      await newArticulo(formData, editingProduct?.id);
      onSuccessAction();
      onCloseAction();
      setFormData({
        id: 0,
        nombre_producto: "",
        descripcion: "",
        marca: "",
        categoria: "",
        subcategoria: "",
        stock_actual: 0,
        stock_minimo: 0,
        precio_compra: 0,
        precio_venta: 0,
        unidades_por_bulto: 0,
        fecha_actualizacion: "",
      });
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };
  // const campos = mostrarCamposEspeciales(
  //   formData.categoria,
  //   formData.subcategoria
  // );

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-geist">
            {editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
          </DialogTitle>
          <DialogDescription className="font-manrope">
            Complete la información del producto
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 w-full mb-4">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="font-manrope">
              Nombre del Producto *
            </Label>
            <Input
              id="nombre"
              value={formData.nombre_producto}
              onChange={(e) =>
                setFormData({ ...formData, nombre_producto: e.target.value })
              }
              placeholder="Ej: Papel Bond A4"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marca" className="font-manrope">
              Marca
            </Label>
            <Input
              id="marca"
              value={formData.marca}
              onChange={(e) =>
                setFormData({ ...formData, marca: e.target.value })
              }
              placeholder="Ej: Xerox"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoria" className="font-manrope">
              Categoría *
            </Label>
            <Select
              value={formData.categoria}
              onValueChange={(value) =>
                setFormData({ ...formData, categoria: value, subcategoria: "" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subcategoria" className="font-manrope">
              Subcategoría
            </Label>
            <Select
              value={formData.subcategoria}
              onValueChange={(value) =>
                setFormData({ ...formData, subcategoria: value })
              }
              disabled={!formData.categoria}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar subcategoría" />
              </SelectTrigger>
              <SelectContent>
                {formData.categoria &&
                  subcategories[
                    formData.categoria as keyof typeof subcategories
                  ]?.map((subcat) => (
                    <SelectItem key={subcat} value={subcat}>
                      {subcat}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="descripcion" className="font-manrope">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              placeholder="Descripción detallada del producto"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock_actual" className="font-manrope">
              Stock Actual
            </Label>
            <Input
              id="stock_actual"
              type="number"
              value={formData.stock_actual}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock_actual: Number.parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock_minimo" className="font-manrope">
              Stock Mínimo
            </Label>
            <Input
              id="stock_minimo"
              type="number"
              value={formData.stock_minimo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock_minimo: Number.parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="precio_compra" className="font-manrope">
              Precio de Compra (Bs)
            </Label>
            <Input
              id="precio_compra"
              type="number"
              value={formData.precio_compra}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  precio_compra: Number.parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="precio_venta" className="font-manrope">
              Precio de Venta (Bs)
            </Label>
            <Input
              id="precio_venta"
              type="number"
              value={formData.precio_venta}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  precio_venta: Number.parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidades_por_bulto" className="font-manrope">
              Unidades por Bulto
            </Label>
            <Input
              id="unidades_por_bulto"
              type="number"
              value={formData.unidades_por_bulto ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  unidades_por_bulto:
                    e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
              placeholder="0"
            />
          </div>
          {/*          
          {campos.peso && (
            <div className="space-y-2">
              <Label htmlFor="peso" className="font-manrope">
                Peso (kg)
              </Label>
              <Input
                id="peso"
                type="number"
                value={formData.peso ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    peso: e.target.value === "" ? 0 : Number(e.target.value),
                  })
                }
                placeholder="0"
              />
            </div>
          )}
          {campos.volumen && (
            <div className="space-y-2">
              <Label htmlFor="volumen" className="font-manrope">
                volumen (m³)
              </Label>
              <Input
                id="volumen"
                type="number"
                value={formData.volumen}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    peso: Number(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div> */}
          {/* )} */}
          {/* Ubicación física siempre visible */}
          {/* <div className="space-y-2">
            <Label htmlFor="ubicacion_fisica" className="font-manrope">
              Ubicación Física
            </Label>
            <Input
              id="ubicacion_fisica"
              value={formData.ubicacion_fisica}
              onChange={(e) =>
                setFormData({ ...formData, ubicacion_fisica: e.target.value })
              }
              placeholder="Ej: Estante 3, Fila B"
            />
          </div> */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCloseAction} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading
              ? "Guardando..."
              : editingProduct
              ? "Actualizar"
              : "Agregar"}{" "}
            Producto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
