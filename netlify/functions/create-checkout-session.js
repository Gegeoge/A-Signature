const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const products = require("../../data/products");

exports.handler = async function(event) {
    try {
        const { bag } = JSON.parse(event.body);

        const lineItems = bag.map(item => {
            const product = products.find(p => p.id === item.id);

            if (!product) {
                throw new Error("Product not found");
            }

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: product.name
                    },
                    unit_amount: product.price * 100
                },
                quantity: item.quantity
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: `${process.env.URL}/success.html`,
            cancel_url: `${process.env.URL}/bag.html`
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ url: session.url })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};