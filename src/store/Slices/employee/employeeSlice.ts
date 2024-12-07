import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Employee {
  id?: number;
  name?: string;
  position?: string;
}
interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  addLoading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  addLoading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk<Employee[]>(
  "employees/fetch",
  async () => {
    const response = await fetch("/api/employees");
    const data = await response.json();
    return data.employees as Employee[];
  }
);

export const removeEmployees = createAsyncThunk<number, number>(
  "employees/remove",
  async (id) => {
    const response = await fetch(`/api/employees/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to delete employee");
    }

    return id;
  }
);
export const addEmployee = createAsyncThunk<Employee, Omit<Employee, "id">>(
  "employees/add",
  async (employee) => {
    const response = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });

    const data = await response.json();
    return data.employee as Employee;
  }
);
export const updateEmployee = createAsyncThunk<Employee, Employee>(
  "employees/update",
  async (employee) => {
    const response = await fetch(`/api/employees/${employee.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });

    const data = await response.json();
    return data.employee as Employee;
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchEmployees.fulfilled,
        (state, action: PayloadAction<Employee[]>) => {
          state.loading = false;
          state.employees = action.payload;
        }
      )
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch employees.";
      })

      // Remove employee
      .addCase(removeEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        removeEmployees.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.employees = state.employees.filter(
            (employee) => employee.id !== action.payload
          );
        }
      )
      .addCase(removeEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove employee.";
      })

      // Add employee
      .addCase(addEmployee.pending, (state) => {
        state.addLoading = true;
      })
      .addCase(
        addEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.addLoading = false;
          state.employees.push(action.payload);
        }
      )
      .addCase(addEmployee.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.error.message || "Failed to add employee.";
      })

      // Update employee
      .addCase(updateEmployee.pending, (state) => {
        state.addLoading = true;
      })
      .addCase(
        updateEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.addLoading = false;
          state.employees = state.employees.map((employee) =>
            employee.id === action.payload.id ? action.payload : employee
          );
        }
      )
      .addCase(updateEmployee.rejected, (state, action) => {
        state.addLoading = false;
        state.error = action.error.message || "Failed to update employee.";
      });
  },
});

export default employeeSlice.reducer;
