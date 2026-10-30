
const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const results = document.getElementById("results");
const count = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = input.value.trim();

    if (query === "") return;

    results.innerHTML = "";
    emptyState.style.display = "none";
    count.textContent = "Searching...";

    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch images");
        }

        const data = await response.json();

        const images = Object.values(data.query?.pages || {});

        images.forEach((item) => {
            const imageUrl = item.imageinfo?.[0]?.thumburl;

            if (!imageUrl) return;

            const card = document.createElement("div");
            card.className = "image-card";

            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = item.title;

            const title = document.createElement("p");
            title.textContent = item.title.replace("File:", "");

            card.appendChild(img);
            card.appendChild(title);

            results.appendChild(card);
        });

        count.textContent = `${results.children.length} images · Results for "${query}"`;

    } catch (error) {
        count.textContent = "Unable to load images. Try again.";
        console.error(error);
    }
});
