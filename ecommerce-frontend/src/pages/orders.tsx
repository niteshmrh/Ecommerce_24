import { ReactElement, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Column } from 'react-table';
import TableHOC from '../components/admin/TableHOC';
import { Skeleton } from '../components/loader';
import { useMyOrderQuery } from '../redux/api/orderAPI';
import { CustomError } from '../types/api-types';
import { UserReducerInitialState } from '../types/reducer-types';

type DataType = {
    _id:string;
    amount: number;
    quantity: number;
    discount: number;
    status: ReactElement;
    action: ReactElement;
};

const column : Column<DataType>[] = [
    {
        Header: "ID",
        accessor: "_id",
    },
    {
        Header: "Quantity",
        accessor: "quantity",
    },
    {
        Header: "Discount",
        accessor: "discount",
    },
    {
        Header: "Amount",
        accessor: "amount",
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
const Orders = () => {
    const { user } = useSelector((state: {userReducer : UserReducerInitialState}) => state.userReducer);
    const { data, isLoading, isError, error } = useMyOrderQuery(user?._id!);
    const [rows, setRows]  = useState<DataType[]>([
        // {
        //     _id:"abcde",
        //     amount: 500,
        //     quantity: 5,
        //     discount: 100,
        //     status: <span className='red'>Processing</span>,
        //     action: <Link to={`/order/abcde`}>View</Link>,
        // }
    ]);

    if(isError){
        toast.error((error as CustomError).data.message);
      }
    
      useEffect(()=>{
        if(data?.success){
          setRows(data?.result.map((items)=>({
            _id: items._id,
            amount: items.total,
            discount: items.discount,
            quantity: items.orderItems.length,
            status: <span className={items.status === 'Processing' ? 'red': items.status === 'Shipped' ? "green" : 'purple'}>{items.status}</span>,
            action: <Link to={`/order/${items._id}`}>Manage</Link>,
          })));
        }
      },[data]);

    const Table = TableHOC<DataType>(
        column, 
        rows, 
        "dashboard-product-box", 
        "Orders", 
        rows.length > 6,
    )();
  return (
    <div className='container'>
        <h1>My Orders</h1>
        <main>{isLoading ? <Skeleton width="80vw" length={20}/> : Table}</main>
    </div>
  )
}

export default Orders