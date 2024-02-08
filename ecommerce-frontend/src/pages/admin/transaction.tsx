import { ReactElement, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllOrderQuery } from "../../redux/api/orderAPI";
import { CustomError } from "../../types/api-types";
import { UserReducerInitialState } from "../../types/reducer-types";
import { Skeleton } from "../../components/loader";

interface DataType {
  user: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
}

// const arr: Array<DataType> = [
//   {
//     user: "Charas",
//     amount: 4500,
//     discount: 400,
//     status: <span className="red">Processing</span>,
//     quantity: 3,
//     action: <Link to="/admin/transaction/sajknaskd">Manage</Link>,
//   },

//   {
//     user: "Xavirors",
//     amount: 6999,
//     discount: 400,
//     status: <span className="green">Shipped</span>,
//     quantity: 6,
//     action: <Link to="/admin/transaction/sajknaskd">Manage</Link>,
//   },
//   {
//     user: "Xavirors",
//     amount: 6999,
//     discount: 400,
//     status: <span className="purple">Delivered</span>,
//     quantity: 6,
//     action: <Link to="/admin/transaction/sajknaskd">Manage</Link>,
//   },
// ];

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "user",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transaction = () => {
  const { user } = useSelector((state: {userReducer : UserReducerInitialState}) => state.userReducer);
  const [rows, setRows] = useState<DataType[]>([]);

  const { data, isLoading, isError, error } = useAllOrderQuery(user?._id!);

  if(isError){
    toast.error((error as CustomError).data.message);
  }

  useEffect(()=>{
    if(data?.success){
      setRows(data?.result.map((items)=>({
        user: items.user.name,
        amount: items.total,
        discount: items.discount,
        quantity: items.orderItems.length,
        status: <span className={items.status === 'Processing' ? 'red': items.status === 'Shipped' ? "green" : 'purple'}>{items.status}</span>,
        action: <Link to={`/admin/transaction/${items._id}`}>Manage</Link>,
      })));
    }
  },[data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Transactions",
    rows.length > 6
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton width="80vw" length={20}/> : Table}</main>
    </div>
  );
};

export default Transaction;
