import React from "react";
import MenuCard from "./MenuCard";

const sampleItems = [
	{ id: 1, title: "Classic Burger", price: 199, img: "" },
	{ id: 2, title: "Cheese Burger", price: 249, img: "" },
];

function Menu() {
	const handleBuy = (id) => {
		console.log("Buy", id);
	};

	return (
		<section className="menu">
			<h2>Our Menu</h2>
			<div className="menu-grid">
				{sampleItems.map((it, idx) => (
					<MenuCard
						key={it.id}
						itemNum={it.id}
						burgerSrc={it.img}
						price={it.price}
						title={it.title}
						handler={handleBuy}
						delay={idx * 0.1}
					/>
				))}
			</div>
		</section>
	);
}

export default Menu;
