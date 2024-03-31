import { Product } from "./Product";

const serverUrl = "http://localhost:5000";
let currentPage = 1;
let productsData = []; // Variável para armazenar os dados dos produtos

async function handleProduct(page) {
  const limit = 9;
  const res = await fetch(
    `${serverUrl}/products?_page=${page}&_limit=${limit}`
  );
  const data = await res.json();

  // Adicionar os dados dos produtos ao array productsData
  productsData = [...productsData, ...data];

  renderProducts(data);
}

document
  .querySelector(".content__cards__load-more")
  .addEventListener("click", async () => {
    currentPage++;
    await handleProduct(currentPage);
  });

function renderProducts(products) {
  const container = document.querySelector(".content__cards");

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("content__cards__card");

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = "";

    const title = document.createElement("h4");
    title.classList.add("content__cards__card__title");
    title.textContent = product.name;

    const price = document.createElement("p");
    price.classList.add("content__cards__card__price");
    price.textContent = `R$ ${product.price.toFixed(2)}`;

    const installments = document.createElement("p");
    installments.classList.add("content__cards__card__Installments");
    installments.textContent = `até ${
      product.parcelamento[0]
    }x de R$${product.parcelamento[1].toFixed(2)}`;

    const buyButton = document.createElement("button");
    buyButton.classList.add("content__cards__card__buy");
    buyButton.textContent = "Comprar";
    buyButton.onclick = function () {
      addToCart();
    };

    // Adicionando a data e a cor ao dataset do elemento
    card.dataset.date = product.date;
    card.dataset.color = product.color;
    card.dataset.size = product.size;

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(installments);
    card.appendChild(buyButton);

    container.appendChild(card);
  });
}

function addToCart() {
  const bag = document.querySelector(".header__bag-elipse-quantity-number");
  if (bag && bag.textContent) {
    const currentQuantity = parseInt(bag.textContent);
    bag.textContent = (currentQuantity + 1).toString();
  }
}

handleProduct(1);
document
  .querySelector(".content__cards__load-more")
  .addEventListener("click", async () => {
    currentPage++;
    await handleProduct(currentPage);
  });

document
  .querySelector(".content__cards__load-more")
  .addEventListener("click", async () => {
    await handleProduct(2);
  });

function applyPressButtonEffect() {
  const btnEls = document.querySelectorAll(
    ".content__filter__size__buttons button"
  );

  btnEls.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remover a classe "pressButton" de todos os botões
      btnEls.forEach((button) => button.classList.remove("pressButton"));

      // Adicionar a classe "pressButton" apenas ao botão clicado
      this.classList.add("pressButton");

      // Aplicar os filtros com base no botão clicado
      applyFilters();
    });
  });
}

// Função para reordenar os itens com base na opção selecionada
function sortItemsBy(option) {
  const container = document.querySelector(".content__cards");
  const items = Array.from(container.querySelectorAll(".content__cards__card"));

  // Remover os itens do contêiner
  items.forEach((item) => container.removeChild(item));

  // Função de comparação personalizada para ordenação
  function compareItems(a, b) {
    if (option === "menor" || option === "maior") {
      const priceA = parseFloat(
        a
          .querySelector(".content__cards__card__price")
          .textContent.replace("R$ ", "")
      );
      const priceB = parseFloat(
        b
          .querySelector(".content__cards__card__price")
          .textContent.replace("R$ ", "")
      );

      if (option === "menor") {
        return priceA - priceB; // Ordenar do menor para o maior preço
      } else {
        return priceB - priceA; // Ordenar do maior para o menor preço
      }
    } else if (option === "recentes") {
      const dateA = new Date(a.dataset.date);
      const dateB = new Date(b.dataset.date);

      return dateB - dateA; // Ordenar pela data mais recente
    }
    // Se a opção não for "menor", "maior" nem "recentes", não fazer nada (ou usar outra lógica)
    return 0;
  }

  // Ordenar os itens usando a função de comparação personalizada
  items.sort(compareItems);

  // Adicionar os itens reordenados de volta ao contêiner
  items.forEach((item) => container.appendChild(item));
}

// Adicionar um ouvinte de evento para o evento de alteração na seleção
document
  .querySelectorAll('input[type="radio"][name="category"]')
  .forEach((input) => {
    input.addEventListener("change", function () {
      const selectedOption = this.value;
      sortItemsBy(selectedOption);
    });
  });

function applyToggleSelectOptionList() {
  const selectedValue = document.getElementById("selected-value");
  const optionsViewButton = document.getElementById("options-view-button");
  const inputsOptions = document.querySelectorAll(".option input");

  inputsOptions.forEach((input) => {
    input.addEventListener("click", (e) => {
      selectedValue.textContent = input.dataset.label || "";

      const eventType = e.type;
      const isMouseOrTouch =
        eventType === "click" || eventType === "touchstart";

      if (isMouseOrTouch) {
        optionsViewButton.click();
      }
    });
  });
}

function toggleMobile(classToggle, classTitle) {
  classTitle.addEventListener("click", () => {
    if (classToggle.classList.contains("closeMobileMenu")) {
      classToggle.classList.remove("closeMobileMenu");
    } else {
      classToggle.classList.add("closeMobileMenu");
    }
  });
}

function applyToggleMenuMobile() {
  const mobileMenu = document.querySelector(".mobile-menu");
  const closeMobileButtons = document.querySelectorAll(
    ".mobile-menu__order__title__x"
  );

  const elementsToToggle = [
    {
      title: ".mobile-menu__filter__options__color--title",
      content: ".mobile-menu__filter__options__color--content",
    },
    {
      title: ".mobile-menu__filter__options__size--title",
      content: ".mobile-menu__filter__options__size--content",
    },
    {
      title: ".mobile-menu__filter__options__price--title",
      content: ".mobile-menu__filter__options__price--content",
    },
  ];

  elementsToToggle.forEach(({ title, content }) => {
    const titleElement = document.querySelector(title);
    const contentElement = document.querySelector(content);

    if (titleElement && contentElement) {
      toggleMobile(contentElement, titleElement);
    }
  });

  closeMobileButtons.forEach((button) => {
    button.addEventListener("click", () => {
      mobileMenu.classList.add("closeMobileMenu");
    });
  });

  const optionRecentes = document.querySelector("#btnRecentesMobile");
  const optionMaior = document.querySelector("#btnMaiorPrecoMobile");
  const optionMenor = document.querySelector("#btnMenorPrecoMobile");

  optionRecentes.addEventListener("click", () => {
    sortItemsBy("recentes");
    mobileMenu.classList.add("closeMobileMenu");
  });

  optionMaior.addEventListener("click", () => {
    sortItemsBy("maior");
    mobileMenu.classList.add("closeMobileMenu");
  });

  optionMenor.addEventListener("click", () => {
    sortItemsBy("menor");
    mobileMenu.classList.add("closeMobileMenu");
  });
}

function applyFilterOrderButtonClick() {
  const mobileMenu = document.querySelector(".mobile-menu");
  const MobileMenuFilter = document.querySelector(".mobile-menu__filter");
  const MobileMenuOrder = document.querySelector(".mobile-menu__order");

  const filterMobileButton = document.querySelector(
    ".sortable-section__buttons-mobile__filter"
  );
  const orderMobileButton = document.querySelector(
    ".sortable-section__buttons-mobile__order"
  );

  filterMobileButton.addEventListener("click", () => {
    if (mobileMenu.classList.contains("closeMobileMenu")) {
      mobileMenu.classList.remove("closeMobileMenu");
    }

    if (MobileMenuFilter.classList.contains("closeMobileMenu")) {
      MobileMenuFilter.classList.remove("closeMobileMenu");
    }

    if (!MobileMenuOrder.classList.contains("closeMobileMenu")) {
      MobileMenuOrder.classList.add("closeMobileMenu");
    }
  });

  orderMobileButton.addEventListener("click", () => {
    if (mobileMenu.classList.contains("closeMobileMenu")) {
      mobileMenu.classList.remove("closeMobileMenu");
    }

    if (MobileMenuOrder.classList.contains("closeMobileMenu")) {
      MobileMenuOrder.classList.remove("closeMobileMenu");
    }

    if (!MobileMenuFilter.classList.contains("closeMobileMenu")) {
      MobileMenuFilter.classList.add("closeMobileMenu");
    }
  });
}

function main() {
  applyPressButtonEffect();
  applyToggleSelectOptionList();
  applyToggleMenuMobile();
  applyFilterOrderButtonClick();
}

document.addEventListener("DOMContentLoaded", main);

function applyFilters() {
  const selectedColors = Array.from(
    document.querySelectorAll('.content__filter input[type="checkbox"]:checked')
  ).map((checkbox) => checkbox.id.split("_")[0].toLowerCase().trim());

  const selectedSizes = Array.from(
    document.querySelectorAll(
      ".content__filter__size__buttons button.pressButton"
    )
  ).map((button) => button.textContent.trim());

  const selectedPrices = Array.from(
    document.querySelectorAll(
      '.content__filter__price input[type="checkbox"]:checked'
    )
  ).map((checkbox) => checkbox.id);

  console.log(selectedPrices);

  console.log("Selected Colors:", selectedColors);
  console.log("Selected Sizes:", selectedSizes);
  console.log("Selected Prices:", selectedPrices);

  let filteredProducts = productsData.filter((product) => {
    const colorMatch =
      selectedColors.length === 0 ||
      selectedColors.includes(product.color.toLowerCase());
    const sizeMatch =
      selectedSizes.length === 0 ||
      selectedSizes.some((size) => product.size.includes(size.toUpperCase()));
    const priceMatch =
      selectedPrices.length === 0 ||
      selectedPrices.some((priceRange) =>
        isPriceInRange(product.price, priceRange)
      ) ||
      selectedPrices.length === Object.keys(priceRanges).length;

    console.log("Product:", product.name);
    console.log("Color Match:", colorMatch);
    console.log("Size Match:", sizeMatch);
    console.log("Price Match:", priceMatch);

    return colorMatch && sizeMatch && priceMatch;
  });

  console.log("Filtered Products:", filteredProducts);

  const container = document.querySelector(".content__cards");
  container.innerHTML = "";

  renderProducts(filteredProducts);
}

const priceRanges = {
  R$50_d: { min: 0, max: 50 },
  R$150_d: { min: 51, max: 150 },
  R$300_d: { min: 151, max: 300 },
  R$500_d: { min: 301, max: 500 },
  R$501_d: { min: 501, max: Infinity },
};
function isPriceInRange(productPrice, priceRangeId) {
  const priceRanges = {
    R$50_d: { min: 0, max: 50 },
    R$150_d: { min: 51, max: 150 },
    R$300_d: { min: 151, max: 300 },
    R$500_d: { min: 301, max: 500 },
    R$501_d: { min: 501, max: Infinity },
  };

  const range = priceRanges[priceRangeId];

  if (!range) {
    console.error("Faixa de preço não reconhecida:", priceRangeId);
    return false;
  }

  const minPrice = range.min;
  const maxPrice = range.max;
  const numericPrice = parseFloat(productPrice.replace(",", ".")); // Convertendo para número

  console.log("Product Price:", numericPrice);
  console.log("Min Price:", minPrice);
  console.log("Max Price:", maxPrice);

  if (numericPrice >= minPrice && numericPrice <= maxPrice) {
    console.log("Price Match: true");
    return true; // Retorna true se o preço estiver dentro do intervalo
  } else {
    console.log("Price Match: false");
    return false; // Retorna false caso contrário
  }
}

// Adicionar um ouvinte de evento para os checkboxes de cor
document
  .querySelectorAll('.content__filter input[type="checkbox"]')
  .forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilters);
  });

// Adicionar um ouvinte de evento para os botões de tamanho
document
  .querySelectorAll(".content__filter__size__buttons button")
  .forEach((button) => {
    button.addEventListener("click", applyFilters);
  });

// Adicionar um ouvinte de evento para os checkboxes de preço
document
  .querySelectorAll('.content__filter__price input[type="checkbox"]')
  .forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilters);
  });
