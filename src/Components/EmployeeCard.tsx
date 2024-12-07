import React from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";

const { Meta } = Card;

interface EmployeeCardProps {
  data: {
    id: string;
    name: string;
    position: string;
  };
  setIsDelete: React.Dispatch<
    React.SetStateAction<{ id: string | null; isOpen: boolean }>
  >;
  onEdit: (employee: any) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  data,
  setIsDelete,
  onEdit,
}) => (
  <Card
    bordered={true}
    size="default"
    style={{ width: 300 }}
    cover={
      <img
        alt="example"
        src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${data.id}`}
      />
    }
    actions={[
      <EditOutlined
        key="edit"
        onClick={() => {
          onEdit(data);
        }}
      />,
      <DeleteOutlined
        key="delete"
        style={{ color: "#FF0000" }}
        onClick={() => {
          setIsDelete({ id: data.id, isOpen: true });
        }}
      />,
    ]}
  >
    <Meta
      avatar={
        <Avatar
          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${data.id}`}
        />
      }
      title={data.name}
      description={data.position}
    />
  </Card>
);

export default EmployeeCard;
