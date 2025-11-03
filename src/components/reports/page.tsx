import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
const Reportes = () => {
  return (
    <div>
      <CardContent>
        <Card>
          <CardHeader>
            <CardTitle>Reportes</CardTitle>
            <CardDescription>
              Manejo y control de ventas - Reportes.
            </CardDescription>
          </CardHeader>
          <CardContent>Estadisticas</CardContent>
        </Card>
      </CardContent>
    </div>
  );
};

export default Reportes;
