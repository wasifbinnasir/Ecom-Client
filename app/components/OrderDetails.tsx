import { useGetOrderQuery } from "../services/ordersApi";

export default function OrderDetails({ orderId }: { orderId: string }) {
  const { data: order, isLoading, error } = useGetOrderQuery(orderId, {
    skip: !orderId,
  });

  if (!orderId) return <p>Select an order to view details</p>;
  if (isLoading) return <p>Loading order details...</p>;
  if (error) return <p>Failed to load order</p>;

  return (
    <div className="p-4 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Order Details</h2>

      <div className="mb-4">
        <h3 className="font-medium">Customer Info</h3>
        <p>Name: {order?.user?.name}</p>
        <p>Email: {order?.user?.email}</p>
      </div>

      <div>
        <h3 className="font-medium">Items</h3>
        <ul className="space-y-2">
          {order?.items.map((item, idx) => (
            <li key={idx} className="p-2 border rounded">
              <p>Product: {item.product?.name}</p>
              {item.color && <p>Color: {item.color}</p>}
              {item.size && <p>Size: {item.size}</p>}
              <p>Qty: {item.quantity}</p>
              <p>Price: ${item.price}</p>
              <p>Subtotal: ${item.subtotal}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 font-bold">
        Total: ${order?.totalAmount}
      </div>
    </div>
  );
}
