async function startCheckout() {
    const bag = JSON.parse(localStorage.getItem("bag")) || [];

    if (bag.length === 0) {
        alert("Your bag is empty.");
        return;
    }

    try {
        const response = await fetch("/.netlify/functions/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ bag })
        });

        const data = await response.json();

        if (data.url) {
            window.location.href = data.url;
        } else {
            alert("Checkout could not start. Please try again.");
        }

    } catch (error) {
        alert("Checkout will work after Netlify and Stripe are connected.");
    }
}