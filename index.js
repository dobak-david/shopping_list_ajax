let listTypes = document.querySelectorAll("div.listType");
let activeTypeIndex = null;
const newItemBtn = document.querySelector("#newItemBtn");
const addItemBtn = document.querySelector("#addItemBtn");
const itemInput = document.querySelector("#itemInput");
const itemCategory = document.querySelector("#itemCategory");
let activeItemsList = document.querySelector("#activeItemsList");
let activeListItems = document.querySelector(".activeListItems");
let activeListTitle = document.querySelector("#activeListTitle");
let listTypeDivs = document.querySelectorAll(".listType");
let newItemDiv = document.querySelector("#newItem");

let itemsDisplayed = [];

listTypes.forEach((place) => place.addEventListener("click", clickOnListLi));
newItemBtn.addEventListener("click", clickOnNewItem);
addItemBtn.addEventListener("click", clickOnAddItemBtn);

async function deleteItem(event) {
  let target = event.target;
  let itemName = target.innerHTML;
  let resp = await fetch(
    "index.php?id=" + activeTypeIndex + "&itemName=" + itemName
  );
  let data = await resp.json();

  itemsDisplayed = [];
  for (let value of data.data) {
    itemsDisplayed.push(value);
  }

  if (data.data.length == 0) {
    listTypes.forEach((listType) => {
      console.log(listType);
      if (listType.id == activeTypeIndex) {
        listType.classList.remove("hasItemInit");
      }
    });
  }

  renderItems();
}

async function clickOnListLi(event) {
  if (activeTypeIndex)
    listTypes[activeTypeIndex].classList.remove("activeList");
  let target = event.target;
  if (target.hasAttribute("id")) {
    activeTypeIndex = target.getAttribute("id");
  } else {
    activeTypeIndex = target.parentElement.getAttribute("id");
  }
  listTypes[activeTypeIndex].classList.add("activeList");
  listTypes.forEach((listType) => {
    if (listType.id == activeTypeIndex)
      itemCategory.value = listType.children[1].innerHTML;
  });

  //ajax keres + valasz
  let resp = await fetch("index.php?id=" + activeTypeIndex);
  let data = await resp.json();

  itemsDisplayed = [];
  for (let value of data.data) {
    itemsDisplayed.push(value);
  }

  renderItems();
}

function renderItems() {
  let activeItemsList = document.querySelector("#activeItemsList");
  activeItemsList.remove();

  activeListTitle.innerHTML =
    listTypes[activeTypeIndex].children[1].innerHTML + " lista";

  let newUl = document.createElement("ul");
  newUl.id = "activeItemsList";
  for (let i = 0; i < itemsDisplayed.length; i++) {
    let newLi = document.createElement("li");
    newLi.innerHTML = itemsDisplayed[i];
    newLi.addEventListener("dblclick", deleteItem);
    newUl.appendChild(newLi);
  }
  activeListItems.appendChild(newUl);
}

function clickOnNewItem(event) {
  listTypes.forEach((listType) => {
    if (listType.id == activeTypeIndex)
      itemCategory.value = listType.children[1].innerHTML;
  });
  newItemDiv.toggleAttribute("hidden");
}

async function clickOnAddItemBtn() {
  newItemDiv.setAttribute("hidden", true);
  let newData = itemInput.value;
  let category = itemCategory.value;
  itemInput.value = "";

  let resp = await fetch("index.php?item=" + newData + "&category=" + category);
  let data = await resp.json();

  if (data.data.length > 0) {
    listTypes.forEach((listType) => {
      console.log(listType);
      if (listType.children[1].innerHTML == category) {
        listType.classList.add("hasItemInit");
      }
    });
  }

  renderItems();
}
