export function retourHautPage() {
    let bouton = document.getElementById("btnRetourHaut");

    if (!bouton) {
        bouton = document.createElement("button");
        bouton.id = "btnRetourHaut";
        bouton.innerText = "⬆ Haut de page";
        document.body.appendChild(bouton);

        Object.assign(bouton.style, {
            position: "fixed",
            bottom: "20px",
            right: "-1000px",
            padding: "10px 15px",
            fontSize: "16px",
            backgroundColor: "#aa7d00",
            color: "white",
            border: "solid 1px white",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "right 0.5s ease-in-out",
            zIndex: "1000"
        });

        bouton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    bouton.style.right = window.scrollY > 0 ? "20px" : "-1000px";
}