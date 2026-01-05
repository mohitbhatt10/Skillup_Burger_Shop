import React from "react";
import { useParams } from "react-router-dom";

function OrderDetails() {
	const { id } = useParams();
	return (
		<section className="order-details">
			<h2>Order Details</h2>
			<p>Showing details for order: {id}</p>
		</section>
	);
}

export default OrderDetails;
