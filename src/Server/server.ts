import { createServer, Model, Response } from "miragejs";
import { ModelDefinition } from "miragejs/-types";

type Employee = {
  id: string;
  name: string;
  position: string;
};

const EmployeeModel: ModelDefinition<Employee> = Model.extend({});

export function makeServer() {
  createServer({
    models: {
      employee: EmployeeModel,
    },

    seeds(server) {
      server.create("employee", {
        id: "1",
        name: "Alice",
        position: "Developer",
      });
      server.create("employee", { id: "2", name: "Bob", position: "Designer" });
      server.create("employee", {
        id: "3",
        name: "Charlie",
        position: "Manager",
      });
      server.create("employee", {
        id: "4",
        name: "Anand",
        position: "Manager",
      });
      server.create("employee", {
        id: "5",
        name: "Vikash",
        position: "Manager",
      });
      server.create("employee", {
        id: "6",
        name: "Rahul",
        position: "Manager",
      });
      server.create("employee", {
        id: "7",
        name: "Mansi",
        position: "Manager",
      });
      server.create("employee", {
        id: "8",
        name: "Chirag",
        position: "Manager",
      });
      server.create("employee", {
        id: "9",
        name: "Jigar",
        position: "Manager",
      });
      server.create("employee", {
        id: "10",
        name: "Rajesh",
        position: "Manager",
      });
    },

    routes() {
      this.namespace = "api";

      this.get("/employees", (schema) => schema.all("employee"));

      this.post("/employees", (schema, request) => {
        const data = JSON.parse(request.requestBody);
        return schema.create("employee", data);
      });

      this.put("/employees/:id", (schema, request) => {
        const id = request.params.id;
        const data = JSON.parse(request.requestBody);
        const employee = schema.find("employee", id);

        if (!employee) {
          return new Response(404, {}, { error: "Employee not found" });
        }

        employee.update(data);
        return employee;
      });

      this.delete("/employees/:id", (schema, request) => {
        const id = request.params.id;
        const employee = schema.find("employee", id);

        if (!employee) {
          return new Response(404, {}, { error: "Employee not found" });
        }

        employee.destroy();
        return new Response(
          200,
          { "Content-Type": "application/json" },
          JSON.stringify({ deletedId: id })
        );
      });
    },
  });
}
