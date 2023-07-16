const hamburgerBtn = document.getElementById("hamburger-btn");
const hiddenNavItems = document.querySelectorAll(".hide");
const mobileMenu = document.querySelector(".header__nav ul");

const input = document.getElementById("textInput");
const shortenBtn = document.getElementById("shorten-btn");
const errorMessage = document.getElementById("error-message");

const shortenedLinksList = document.getElementById("shortenedLinksList");

let savedUrls = JSON.parse(localStorage.getItem("saved")) || [];
let indexArr = [];

savedUrls.forEach((url) => {
  createLinkElement(url.original, url.short);
});

hamburgerBtn.addEventListener("click", () => {
  hamburgerBtn.classList.toggle("open");

  hiddenNavItems.forEach((item) => {
    item.classList.toggle("hide");
  });

  mobileMenu.classList.toggle("show");
});

async function getShortUrl(url) {
  const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
  const data = await response.json();

  return data;
}

function createLinkElement(original, short) {
  const linkItem = document.createElement("div");
  linkItem.classList.add("animate__animated");
  linkItem.classList.add("animate__fadeInDown");

  linkItem.innerHTML = `
        <span class="statistics__originalLink cut-text">${original}</span>
        <span class="statistics__shortenedLink">${short}</span>
        <button class="statistics__copyBtn">Copy</button>
        <button class="statistics__removeItem">x</button>
      `;

  const shortLink = linkItem.querySelector(
    ".statistics__shortenedLink"
  ).innerHTML;
  const copyBtn = linkItem.querySelector(".statistics__copyBtn");
  const removeItem = linkItem.querySelector(".statistics__removeItem");

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shortLink);
      copyBtn.innerText = "Copied!";
      copyBtn.classList.add("copied");
    } catch (err) {
      alert("Failed to copy: ", err);
    }
  });

  shortenedLinksList.appendChild(linkItem);
  indexArr.push(linkItem);

  removeItem.addEventListener("click", () => {
    shortenedLinksList.removeChild(linkItem);

    let index = indexArr.indexOf(linkItem);
    indexArr.splice(index, 1);

    savedUrls.splice(index, 1);

    localStorage.setItem("saved", JSON.stringify(savedUrls));
  });
}

shortenBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let inputValue = input.value.trim().replace(" ", "");

  if (
    input.value === "" ||
    !input.value.match(
      /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/
    )
  ) {
    errorMessage.style.display = "block";
    input.classList.add("error");
  } else {
    errorMessage.style.display = "none";
    input.classList.remove("error");

    getShortUrl(inputValue).then((data) => {
      let originalUrl = data.result.original_link;
      let shortUrl = data.result.full_short_link;

      let generatedUrls = {
        original: originalUrl,
        short: shortUrl,
      };

      savedUrls.push(generatedUrls);

      createLinkElement(generatedUrls.original, generatedUrls.short);

      localStorage.setItem("saved", JSON.stringify(savedUrls));
    });
  }
});
