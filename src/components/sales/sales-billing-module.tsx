"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Printer,
  FileText,
  User,
  CheckCircle2,
  X, // Asegurando la importación del ícono X
} from "lucide-react"

// --- INTERFACES ---

interface Product {
  id: string
  nombre_producto: string
  marca: string
  categoria: string
  sku: string
  precio_venta: number
  stock_actual: number
}

interface SaleItem {
  product_id: string
  product_name: string
  sku: string
  quantity: number
  unit_price: number
  total: number
}

interface Sale {
  id: string
  invoice_number: string
  client_name: string
  client_id?: string
  client_email?: string
  client_phone?: string
  date: string
  items: SaleItem[]
  subtotal: number
  tax: number
  total: number
  payment_type: "cash" | "credit"
  payment_status: "paid" | "pending" | "overdue"
  currency: "VES" | "USD" | "EUR"
  exchange_rate: number
  user_id: string
  user_name: string
  notes?: string
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  credit_limit: number
  credit_terms: number // days
  current_debt: number
}

// --- MOCK DATA (Datos de ejemplo) ---

const mockProducts: Product[] = [
  { id: "1", nombre_producto: "Papel Bond A4", marca: "Xerox", categoria: "Papel", sku: "PAP-BON-A4-001", precio_venta: 12000, stock_actual: 15 },
  { id: "2", nombre_producto: "Bolígrafos Azules", marca: "BIC", categoria: "Escritura", sku: "ESC-BOL-AZU-001", precio_venta: 1200, stock_actual: 45 },
  { id: "3", nombre_producto: "Carpetas Manila", marca: "Norma", categoria: "Archivo", sku: "ARC-CAR-MAN-001", precio_venta: 650, stock_actual: 8 },
  { id: "4", nombre_producto: "Cuadernos 100 Hojas", marca: "Norma", categoria: "Escolar", sku: "ESC-CUA-100-001", precio_venta: 2500, stock_actual: 25 },
  { id: "5", nombre_producto: "Marcadores Permanentes", marca: "Sharpie", categoria: "Escritura", sku: "ESC-MAR-PER-001", precio_venta: 3200, stock_actual: 12 },
]

const mockClients: Client[] = [
  { id: "1", name: "Empresa ABC", email: "contacto@empresaabc.com", phone: "+58 412-1234567", credit_limit: 500000, credit_terms: 30, current_debt: 125000 },
  { id: "2", name: "Colegio XYZ", email: "admin@colegioxyz.edu", phone: "+58 414-7654321", credit_limit: 300000, credit_terms: 45, current_debt: 89500 },
  { id: "3", name: "Oficina 123", email: "compras@oficina123.com", phone: "+58 416-9876543", credit_limit: 200000, credit_terms: 30, current_debt: 0 },
]

const mockSales: Sale[] = [
  {
    id: "1", invoice_number: "F-001234", client_name: "Empresa ABC", client_id: "1", date: "2024-01-15",
    items: [{ product_id: "1", product_name: "Papel Bond A4", sku: "PAP-BON-A4-001", quantity: 10, unit_price: 12000, total: 120000 }, { product_id: "2", product_name: "Bolígrafos Azules", sku: "ESC-BOL-AZU-001", quantity: 25, unit_price: 1200, total: 30000 }],
    subtotal: 150000, tax: 24000, total: 174000, payment_type: "credit", payment_status: "pending", currency: "VES", exchange_rate: 36.5, user_id: "admin", user_name: "Administrador",
  },
  {
    id: "2", invoice_number: "F-001235", client_name: "Cliente Contado", date: "2024-01-15",
    items: [{ product_id: "3", product_name: "Carpetas Manila", sku: "ARC-CAR-MAN-001", quantity: 2, unit_price: 650, total: 1300 }],
    subtotal: 1300, tax: 208, total: 1508, payment_type: "cash", payment_status: "paid", currency: "VES", exchange_rate: 36.5, user_id: "admin", user_name: "Administrador",
  },
]

// --- COMPONENTE DE FACTURA PARA IMPRESIÓN/VISTA ---

interface InvoiceProps {
  sale: Sale;
  formatCurrency: (amount: number, currency: string) => string;
}

const InvoiceComponent: React.FC<InvoiceProps> = ({ sale, formatCurrency }) => {
  return (
    <div id={`invoice-${sale.id}`} className="p-6 border border-gray-300 bg-white shadow-lg w-[800px] mx-auto print:shadow-none print:border-0 print:p-0">
      <div className="flex justify-between items-start mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold font-geist">FACTURA DE VENTA</h1>
          <p className="text-sm font-manrope">Nº de Factura: <span className="font-mono font-semibold">{sale.invoice_number}</span></p>
          <p className="text-sm font-manrope">Fecha: {sale.date}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold font-manrope">Tu Empresa Suministros C.A.</h2>
          <p className="text-xs font-manrope">RIF: J-00000000-0</p>
          <p className="text-xs font-manrope">Telf: +58 212-0000000</p>
        </div>
      </div>

      {/* Datos del Cliente */}
      <div className="mb-6 border-b pb-4">
        <h3 className="text-sm font-semibold mb-2 font-manrope">FACTURADO A:</h3>
        <p className="text-sm font-manrope font-medium">{sale.client_name}</p>
        {sale.client_email && <p className="text-sm font-manrope">Email: {sale.client_email}</p>}
        {sale.client_phone && <p className="text-sm font-manrope">Telf: {sale.client_phone}</p>}
      </div>

      {/* Detalle de Productos */}
      <Table className="mb-6">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="font-manrope">Producto</TableHead>
            <TableHead className="text-right font-manrope">Precio Unitario (Bs)</TableHead>
            <TableHead className="text-right font-manrope">Cantidad</TableHead>
            <TableHead className="text-right font-manrope">Total (Bs)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sale.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-manrope text-sm">{item.product_name} <span className="text-xs text-muted-foreground font-mono">({item.sku})</span></TableCell>
              <TableCell className="text-right font-geist">{formatCurrency(item.unit_price, "VES")}</TableCell>
              <TableCell className="text-right font-geist">{item.quantity}</TableCell>
              <TableCell className="text-right font-geist font-semibold">{formatCurrency(item.total, "VES")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Totales */}
      <div className="flex justify-end">
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between border-t pt-2">
            <span className="font-manrope text-sm">Subtotal (Bs):</span>
            <span className="font-geist">{formatCurrency(sale.subtotal, "VES")}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-manrope text-sm">IVA (16%):</span>
            <span className="font-geist">{formatCurrency(sale.tax, "VES")}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span className="font-manrope">TOTAL (Bs):</span>
            <span className="font-geist">{formatCurrency(sale.total, "VES")}</span>
          </div>
          {/* Referencia en USD */}
          <div className="flex justify-between text-sm text-muted-foreground border-t pt-2">
            <span className="font-manrope">Total (USD Ref @{sale.exchange_rate}):</span>
            <span className="font-geist">{formatCurrency(sale.total / sale.exchange_rate, "USD")}</span>
          </div>
        </div>
      </div>

      {/* Notas y Pie de página */}
      {sale.notes && (
        <div className="mt-6 border-t pt-4">
          <p className="text-xs font-semibold font-manrope mb-1">Notas:</p>
          <p className="text-xs font-manrope italic">{sale.notes}</p>
        </div>
      )}
      <div className="mt-8 text-center text-xs text-gray-500 font-manrope">
        Gracias por su compra. Esta es una representación digital.
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL ---

export default function SalesBillingModule() {
  const [activeTab, setActiveTab] = useState("new-sale")
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [clients] = useState<Client[]>(mockClients)
  const [sales, setSales] = useState<Sale[]>(mockSales)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<SaleItem[]>([])
  const [currentSale, setCurrentSale] = useState<Partial<Sale>>({
    client_name: "",
    payment_type: "cash",
    currency: "VES",
    exchange_rate: 36.5,
    user_name: "Administrador",
    notes: "",
  })
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null)

  const [saleToView, setSaleToView] = useState<Sale | null>(null)

  const [saleToPrint, setSaleToPrint] = useState<Sale | null>(null);

  const currentRate = 36.5

  // --- UTILIDADES ---

  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (fromCurrency === toCurrency) return amount
    if (fromCurrency === "VES" && toCurrency === "USD") return amount / currentRate
    if (fromCurrency === "USD" && toCurrency === "VES") return amount * currentRate
    return amount
  }

  const formatCurrency = useCallback((amount: number, currency: string) => {
    const symbols = { VES: "Bs.", USD: "$", EUR: "€" }
    return `${symbols[currency as keyof typeof symbols]} ${amount.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }, [])

  // --- LÓGICA DE CÁLCULO ---

  const calculateTotals = useMemo(() => {
    const subtotalVES = selectedProducts.reduce((sum, item) => sum + item.total, 0)
    const taxVES = subtotalVES * 0.16 // IVA 16%
    const totalVES = subtotalVES + taxVES

    const subtotal = convertCurrency(subtotalVES, "VES", currentSale.currency || "VES")
    const tax = convertCurrency(taxVES, "VES", currentSale.currency || "VES")
    const total = convertCurrency(totalVES, "VES", currentSale.currency || "VES")

    return { subtotal, tax, total, totalVES }
  }, [selectedProducts, currentSale.currency])

  const { subtotal, tax, total, totalVES } = calculateTotals

  // --- LÓGICA DE PRODUCTOS ---
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [products, searchTerm])

  const addProductToSale = (product: Product) => {
    const existingItem = selectedProducts.find((item) => item.product_id === product.id)
    setSelectedProducts((prevItems) => {
      if (existingItem) {
        if (existingItem.quantity < product.stock_actual) {
          return prevItems.map((item) =>
            item.product_id === product.id
              ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unit_price }
              : item,
          )
        }
        return prevItems
      } else {
        if (product.stock_actual > 0) {
          const newItem: SaleItem = {
            product_id: product.id,
            product_name: product.nombre_producto,
            sku: product.sku,
            quantity: 1,
            unit_price: product.precio_venta,
            total: product.precio_venta,
          }
          return [...prevItems, newItem]
        }
        return prevItems
      }
    })
  }

  const updateItemQuantity = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const newQuantity = Number.parseInt(quantity.toString()) || 0

    setSelectedProducts((prevItems) => {
      const originalSaleItem = editingSaleId ? sales.find(s => s.id === editingSaleId)?.items.find(i => i.product_id === productId) : null;
      const availableStock = product.stock_actual + (originalSaleItem ? originalSaleItem.quantity : 0);


      if (newQuantity <= 0) {
        return prevItems.filter((item) => item.product_id !== productId)
      } else if (newQuantity <= availableStock) {
        return prevItems.map((item) =>
          item.product_id === productId ? { ...item, quantity: newQuantity, total: newQuantity * item.unit_price } : item,
        )
      } else {
        alert(`No hay suficiente stock para ${product.nombre_producto}. Stock disponible: ${availableStock}`);
        return prevItems;
      }
    })
  }

  const removeItemFromSale = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((item) => item.product_id !== productId))
  }

  // --- LÓGICA DE CLIENTES ---
  const selectClient = (client: Client) => {
    setSelectedClient(client)
    setCurrentSale({
      ...currentSale,
      client_name: client.name,
      client_id: client.id,
      client_email: client.email,
      client_phone: client.phone,
      payment_type: client.id ? "credit" : "cash",
    })
    setIsClientDialogOpen(false)
  }

  // --- RESETEO DE FORMULARIO ---
  const resetSaleForm = () => {
    setSelectedProducts([])
    setCurrentSale({
      client_name: "",
      payment_type: "cash",
      currency: "VES",
      exchange_rate: currentRate,
      user_name: "Administrador",
      notes: "",
    })
    setSelectedClient(null)
    setEditingSaleId(null)
    setSearchTerm("")
  }

  // --- LÓGICA DE PROCESO DE VENTA / EDICIÓN ---
  const startEditingSale = (saleId: string) => {
    const saleToEdit = sales.find(s => s.id === saleId);
    if (!saleToEdit) return;

    setCurrentSale({
      client_name: saleToEdit.client_name,
      client_id: saleToEdit.client_id,
      client_email: saleToEdit.client_email,
      client_phone: saleToEdit.client_phone,
      payment_type: saleToEdit.payment_type,
      currency: saleToEdit.currency,
      notes: saleToEdit.notes,
      date: saleToEdit.date,
    });
    setSelectedProducts(saleToEdit.items);

    if (saleToEdit.client_id) {
      const client = clients.find(c => c.id === saleToEdit.client_id);
      if (client) {
        setSelectedClient(client);
      }
    } else {
      setSelectedClient(null);
    }

    setEditingSaleId(saleId);
    setActiveTab("new-sale");
  }

  const saveEditedSale = (saleId: string, updatedSale: Sale) => {
    const originalSale = sales.find(s => s.id === saleId);
    if (!originalSale) return;

    const tempUpdatedProducts = [...products];

    originalSale.items.forEach(oldItem => {
      const productIndex = tempUpdatedProducts.findIndex(p => p.id === oldItem.product_id);
      if (productIndex !== -1) {
        tempUpdatedProducts[productIndex] = {
          ...tempUpdatedProducts[productIndex],
          stock_actual: tempUpdatedProducts[productIndex].stock_actual + oldItem.quantity
        };
      }
    });

    updatedSale.items.forEach(newItem => {
      const productIndex = tempUpdatedProducts.findIndex(p => p.id === newItem.product_id);
      if (productIndex !== -1) {
        tempUpdatedProducts[productIndex] = {
          ...tempUpdatedProducts[productIndex],
          stock_actual: tempUpdatedProducts[productIndex].stock_actual - newItem.quantity
        };
      }
    });

    setProducts(tempUpdatedProducts);

    setSales(prevSales =>
      prevSales.map(sale => (sale.id === saleId ? updatedSale : sale))
    );
  };

  const processSale = () => {
    if (selectedProducts.length === 0 || !currentSale.client_name) {
      alert("Error: Debe seleccionar al menos un producto y especificar el cliente.")
      return
    }

    const { subtotal: subtotalVES, tax: taxVES, total: totalFinalVES } = calculateTotals

    if (editingSaleId) {
      saveEditedSale(editingSaleId, {
        ...currentSale,
        id: editingSaleId,
        invoice_number: sales.find(s => s.id === editingSaleId)?.invoice_number || "ERROR",
        items: selectedProducts,
        subtotal: subtotalVES,
        tax: taxVES,
        total: totalFinalVES,
        currency: "VES",
        exchange_rate: currentRate,
        payment_status: currentSale.payment_type === "cash" ? "paid" : "pending",
        date: currentSale.date || new Date().toISOString().split("T")[0],
      } as Sale);
      alert("Venta actualizada exitosamente!");
    } else {
      const invoiceNumber = `F-${String(sales.length + 1).padStart(6, "0")}`
      const newSale: Sale = {
        id: Date.now().toString(),
        invoice_number: invoiceNumber,
        client_name: currentSale.client_name || "Cliente General",
        client_id: selectedClient?.id,
        client_email: selectedClient?.email,
        client_phone: selectedClient?.phone,
        date: new Date().toISOString().split("T")[0],
        items: selectedProducts,
        subtotal: subtotalVES,
        tax: taxVES,
        total: totalFinalVES,
        payment_type: currentSale.payment_type || "cash",
        payment_status: currentSale.payment_type === "cash" ? "paid" : "pending",
        currency: "VES",
        exchange_rate: currentRate,
        user_id: "admin",
        user_name: currentSale.user_name || "Administrador",
        notes: currentSale.notes,
      }

      setSales([newSale, ...sales])

      // Actualizar el stock de los productos vendidos
      const updatedProducts: Product[] = products.map((product) => {
        const soldItem = selectedProducts.find((item) => item.product_id === product.id)
        if (soldItem) {
          return {
            ...product,
            stock_actual: product.stock_actual - soldItem.quantity,
          }
        }
        return product
      })
      setProducts(updatedProducts)
      alert("Nueva venta procesada exitosamente!");
    }

    resetSaleForm()
    setActiveTab("sales-history")
  }

  // --- MANEJO DE VISTA DE FACTURA ---
  const handleViewSale = (sale: Sale) => {
    setSaleToView(sale);
    setActiveTab("invoices");
  }

  // --- MANEJO DE ACCIONES EN HISTORIAL (IMPRESIÓN/DESCARGA) ---

  useEffect(() => {
    if (saleToPrint) {
      setTimeout(() => {
        window.print();
        setSaleToPrint(null);
      }, 100);
    }
  }, [saleToPrint]);

  const triggerPrint = (sale: Sale) => {
    setSaleToPrint(sale);
  };

  const handlePrintSale = (sale: Sale) => {
    triggerPrint(sale);
  }

  // Función utilizada en la descarga
  const handleDownloadSale = (sale: Sale) => {
    alert("El navegador abrirá el diálogo de impresión. Por favor, selecciona 'Guardar como PDF' para descargar la factura.");
    triggerPrint(sale);
  }

  return (
    <div className="space-y-6">

      {/* INYECCIÓN PARA IMPRESIÓN */}
      <style dangerouslySetInnerHTML={{
        __html: `
            @media print {
                body > div:first-child {
                    display: none;
                }

                .invoice-print-container {
                    display: block !important;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                    padding: 0;
                    background: white;
                    z-index: 9999;
                }

                /* Asegura que el formato de factura ocupe todo */
                .invoice-print-container > div {
                    width: 100% !important;
                    box-shadow: none !important;
                    border: none !important;
                    padding: 10px !important;
                    margin: 0 !important;
                }

                /* Clases de Tailwind específicas para la impresión */
                .print\\:shadow-none { box-shadow: none !important; }
                .print\\:border-0 { border: none !important; }
                .print\\:p-0 { padding: 0 !important; }

            }
        `}} />

      {/* CONTENEDOR DE LA FACTURA (RENDERIZADO CONDICIONAL) */}
      {saleToPrint && (
        <div className="invoice-print-container hidden">
          <InvoiceComponent sale={saleToPrint} formatCurrency={formatCurrency} />
        </div>
      )}


      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new-sale" className="font-manrope">
            {editingSaleId ? "Editar Venta" : "Nueva Venta"}
          </TabsTrigger>
          <TabsTrigger value="sales-history" className="font-manrope">
            Historial de Ventas
          </TabsTrigger>
          <TabsTrigger value="invoices" className="font-manrope">
            Facturas
          </TabsTrigger>
        </TabsList>

        {/* --- New Sale Tab --- */}
        <TabsContent value="new-sale" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* 1. Product Selection */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-geist">Seleccionar Productos</CardTitle>
                  <CardDescription className="font-manrope">Busca y agrega productos a la venta</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar productos por nombre o SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <Card key={product.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h4 className="font-manrope font-medium text-sm">{product.nombre_producto}</h4>
                                <p className="text-xs text-muted-foreground font-manrope">{product.marca}</p>
                                <p className="text-xs text-muted-foreground font-geist font-mono">{product.sku}</p>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => addProductToSale(product)}
                                disabled={product.stock_actual <= 0}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-geist font-semibold text-sm">
                                {formatCurrency(product.precio_venta, "VES")}
                              </span>
                              <Badge
                                variant={product.stock_actual > 10 ? "default" : "destructive"}
                                className="text-xs"
                              >
                                Stock: {product.stock_actual}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sale Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="font-geist">Resumen de Venta</CardTitle>
                  <CardDescription className="font-manrope">Productos seleccionados y totales</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                  {/* Client Selection */}
                  <div className="space-y-2">
                    <Label className="font-manrope">Cliente</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nombre del cliente"
                        value={currentSale.client_name || ""}
                        onChange={(e) => setCurrentSale({ ...currentSale, client_name: e.target.value, client_id: undefined, client_email: undefined, client_phone: undefined })}
                        className="flex-1"
                      />
                      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <User className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="font-geist">Seleccionar Cliente</DialogTitle>
                            <DialogDescription className="font-manrope">
                              Elige un cliente registrado para ventas a crédito
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {clients.map((client) => (
                              <Card
                                key={client.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => selectClient(client)}
                              >
                                <CardContent className="p-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-manrope font-medium">{client.name}</p>
                                      <p className="text-sm text-muted-foreground font-manrope">{client.email}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-geist">
                                        Límite: {formatCurrency(client.credit_limit, "VES")}
                                      </p>
                                      <p className="text-xs text-muted-foreground font-geist">
                                        Deuda: {formatCurrency(client.current_debt, "VES")}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Payment Type */}
                  <div className="space-y-2">
                    <Label className="font-manrope">Tipo de Pago</Label>
                    <Select
                      value={currentSale.payment_type || "cash"}
                      onValueChange={(value) =>
                        setCurrentSale({ ...currentSale, payment_type: value as "cash" | "credit" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Contado</SelectItem>
                        <SelectItem value="credit" disabled={!selectedClient}>Crédito (Requiere Cliente)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Currency */}
                  <div className="space-y-2">
                    <Label className="font-manrope">Moneda de Visualización</Label>
                    <Select
                      value={currentSale.currency || "VES"}
                      onValueChange={(value) =>
                        setCurrentSale({ ...currentSale, currency: value as "VES" | "USD" | "EUR" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VES">Bolívares (VES)</SelectItem>
                        <SelectItem value="USD">Dólares (USD)</SelectItem>
                        <SelectItem value="EUR">Euros (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Products */}
                  <div className="space-y-2">
                    <Label className="font-manrope">Productos ({selectedProducts.length})</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedProducts.map((item) => {
                        const product = products.find((p) => p.id === item.product_id);
                        const originalSaleItem = editingSaleId ? sales.find(s => s.id === editingSaleId)?.items.find(i => i.product_id === item.product_id) : null;
                        const maxStock = product ? product.stock_actual + (originalSaleItem ? originalSaleItem.quantity : 0) : item.quantity;

                        return (
                          <div key={item.product_id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex-1">
                              <p className="font-manrope text-sm font-medium">{item.product_name}</p>
                              <p className="text-xs text-muted-foreground font-geist">{item.sku}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateItemQuantity(item.product_id, Number.parseInt(e.target.value) || 0)
                                }
                                className="w-16 h-8 text-center"
                                min="0"
                                max={maxStock}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItemFromSale(item.product_id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="font-manrope text-sm">Subtotal:</span>
                      <span className="font-geist">
                        {formatCurrency(subtotal, currentSale.currency || "VES")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-manrope text-sm">IVA (16%):</span>
                      <span className="font-geist">
                        {formatCurrency(tax, currentSale.currency || "VES")}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="font-manrope">Total:</span>
                      <span className="font-geist">
                        {formatCurrency(total, currentSale.currency || "VES")}
                      </span>
                    </div>

                    {currentSale.currency !== "USD" && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="font-manrope">USD (Ref):</span>
                        <span className="font-geist">
                          {formatCurrency(convertCurrency(totalVES, "VES", "USD"), "USD")}
                        </span>
                      </div>
                    )}

                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label className="font-manrope">Notas</Label>
                    <Textarea
                      placeholder="Notas adicionales..."
                      value={currentSale.notes || ""}
                      onChange={(e) => setCurrentSale({ ...currentSale, notes: e.target.value })}
                      rows={2}
                    />
                  </div>

                  {/* Process Sale / Save Changes Button */}
                  <Button
                    onClick={processSale}
                    disabled={selectedProducts.length === 0 || !currentSale.client_name}
                    className="w-full"
                  >
                    {editingSaleId ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
                    {editingSaleId ? "Guardar Cambios" : "Procesar Venta"}
                  </Button>
                  {editingSaleId && (
                    <Button
                      onClick={resetSaleForm}
                      variant="outline"
                      className="w-full mt-2"
                    >
                      Cancelar Edición
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- Sales History Tab --- */}
        <TabsContent value="sales-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-geist">Historial de Ventas</CardTitle>
              <CardDescription className="font-manrope">Registro completo de todas las transacciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-manrope">Factura</TableHead>
                      <TableHead className="font-manrope">Cliente</TableHead>
                      <TableHead className="font-manrope">Fecha</TableHead>
                      <TableHead className="font-manrope">Total</TableHead>
                      <TableHead className="font-manrope">Tipo Pago</TableHead>
                      <TableHead className="font-manrope">Estado</TableHead>
                      <TableHead className="font-manrope">Vendedor</TableHead>
                      <TableHead className="font-manrope">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-geist font-mono">{sale.invoice_number}</TableCell>
                        <TableCell className="font-manrope">{sale.client_name}</TableCell>
                        <TableCell className="font-geist">{sale.date}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-geist font-semibold">{formatCurrency(sale.total, "VES")}</p>
                            <p className="text-sm text-muted-foreground font-geist">
                              {formatCurrency(convertCurrency(sale.total, "VES", "USD"), "USD")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={sale.payment_type === "cash" ? "default" : "secondary"}
                            className="font-manrope"
                          >
                            {sale.payment_type === "cash" ? "Contado" : "Crédito"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              sale.payment_status === "paid"
                                ? "default"
                                : sale.payment_status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="font-manrope"
                          >
                            {sale.payment_status === "paid" && "Pagada"}
                            {sale.payment_status === "pending" && "Pendiente"}
                            {sale.payment_status === "overdue" && "Vencida"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-manrope">{sale.user_name}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {/* NUEVO BOTÓN: Ver Factura */}
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Ver Factura"
                              onClick={() => handleViewSale(sale)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Editar Venta"
                              onClick={() => startEditingSale(sale.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Invoices Tab (Vista de Factura) --- */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-geist">Vista de Factura</CardTitle>
              <CardDescription className="font-manrope">Detalle completo de la factura seleccionada.</CardDescription>
              {saleToView && (
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="outline" onClick={() => handleDownloadSale(saleToView)}>
                    <Download className="h-4 w-4 mr-2" /> Descargar PDF
                  </Button>
                  <Button onClick={() => handlePrintSale(saleToView)}>
                    <Printer className="h-4 w-4 mr-2" /> Imprimir
                  </Button>
                  <Button variant="ghost" onClick={() => setSaleToView(null)}>
                    <X className="h-4 w-4 mr-1" /> Cerrar Vista
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {saleToView ? (
                <div className="border p-4 rounded-lg bg-gray-50 max-h-[70vh] overflow-y-auto">
                  <InvoiceComponent sale={saleToView} formatCurrency={formatCurrency} />
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground font-manrope">
                    Selecciona una factura del ¡¡Historial de Ventas!! para visualizarla aquí.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}