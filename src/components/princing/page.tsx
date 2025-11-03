import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
const Princing = () => {
  return (
    <div>
      <CardContent>
        <Card>
          <CardHeader>
            <CardTitle>Precios y Cotización</CardTitle>
            <CardDescription>
              Gestione los precios y cotizaciones de los productos.
            </CardDescription>
          </CardHeader>
          <CardContent>Contenido de Precios y Cotización</CardContent>
        </Card>
      </CardContent>
    </div>
  );
};

export default Princing;
