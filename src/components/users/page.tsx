import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
const Users = () => {
  return (
    <div>
      <CardContent>
        <Card>
          <CardHeader>
            <CardTitle>Control de Usuarios </CardTitle>
            <CardDescription>Gestione los Usuarios y roles .</CardDescription>
          </CardHeader>
          <CardContent>Ajustes de Users</CardContent>
        </Card>
      </CardContent>
    </div>
  );
};

export default Users;
