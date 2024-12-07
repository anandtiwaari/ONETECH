import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addEmployee,
  fetchEmployees,
  removeEmployees,
  updateEmployee,
} from "./store/Slices/employee/employeeSlice";
import EmployeeCard from "./Components/EmployeeCard";
import { Badge, Button, Card, Divider, Form, Modal, Space } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { EmployeeForm } from "./Components/EmployeeForm";

interface Employee {
  id: number;
  name: string;
  position: string;
}

interface EmployeeState {
  employees: Employee[];
  addLoading: boolean;
  // Include other necessary loading or state fields here
}

interface IsDeleteState {
  id: number | null;
  isOpen: boolean;
}

interface IsAddFormState {
  isOpen: boolean;
}

interface IsUpdateFormState {
  values: Employee | {};
  isOpen: boolean;
}

const App = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isDelete, setIsDelete] = useState<IsDeleteState>({
    id: null,
    isOpen: false,
  });
  const [isAddForm, setIsAddForm] = useState<IsAddFormState>({
    isOpen: false,
  });
  const [isUpdateForm, setIsUpdateForm] = useState<IsUpdateFormState>({
    values: {},
    isOpen: false,
  });

  const employeeData = useSelector(
    (state: { employee: EmployeeState }) => state.employee
  );

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleAddEmployee = async (values: Employee) => {
    try {
      const response = await dispatch(addEmployee(values));
      setIsAddForm({ isOpen: false });
      form.resetFields();
      console.log(response, "Add Employee Response");
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateEmployee = async (values: Employee) => {
    try {
      const response = await dispatch(
        updateEmployee({ ...values, id: isUpdateForm.values.id })
      );
      setIsUpdateForm({ isOpen: false, values: {} });
      form.resetFields();
      console.log(response, "Update Employee Response");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (employee: Employee) => {
    setIsUpdateForm({
      isOpen: true,
      values: employee,
    });
  };

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ width: "80%" }}>
        <Badge.Ribbon text="Employees">
          <Card title="Employee List" size="large"></Card>
        </Badge.Ribbon>
      </Space>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={() => {
            setIsAddForm({ isOpen: true });
            form.resetFields();
          }}
          size={"middle"}
        >
          Add Employee
        </Button>
      </div>

      <Modal
        title="Confirm Delete"
        open={isDelete.isOpen}
        onOk={() => {
          dispatch(removeEmployees(isDelete.id as number));
          setIsDelete({ isOpen: false, id: null });
          dispatch(fetchEmployees());
        }}
        onCancel={() => setIsDelete({ isOpen: false, id: null })}
      >
        <p>Are you sure you want to delete?</p>
      </Modal>

      <Divider dashed />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {employeeData?.employees?.map((employee) => (
          <EmployeeCard
            key={employee.id}
            data={employee}
            setIsDelete={setIsDelete}
            onEdit={() => handleEditClick(employee)}
          />
        ))}
      </div>

      <Modal
        title={isAddForm?.isOpen ? "Add Employee" : "Edit Employee"}
        open={isAddForm?.isOpen || isUpdateForm.isOpen}
        footer={null}
        closable={true}
        onCancel={() => {
          form.resetFields();
          setIsAddForm({ isOpen: false });
          setIsUpdateForm({ isOpen: false, values: {} });
        }}
      >
        <EmployeeForm
          form={form}
          initialValues={isUpdateForm.isOpen ? isUpdateForm.values : {}}
          onSubmit={
            isUpdateForm.isOpen ? handleUpdateEmployee : handleAddEmployee
          }
          loading={employeeData.addLoading}
        />
      </Modal>
    </div>
  );
};

export default App;
