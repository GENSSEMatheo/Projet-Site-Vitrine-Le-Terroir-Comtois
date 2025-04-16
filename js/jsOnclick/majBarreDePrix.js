function updatePriceValue(value) {
    document.getElementById("priceValue").textContent = value;
    filterByPrice(value);
}

function filterByPrice(max) {
    document.querySelectorAll("#listesProduitsUl li").forEach(item => {
        const price = parseFloat(item.querySelector("h3")?.innerText.replace("€", "").replace(",", ".").trim()) || 0;
        item.style.display = price <= max ? "" : "none";
    });
}

function searchFunction() {
    const input = document.getElementById("searchBar").value.toLowerCase();
    document.querySelectorAll("#listesProduitsUl li").forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(input) ? "" : "none";
    });
}