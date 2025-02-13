const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];
const editModal = document.querySelector("#edit-modal");
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileFormElement = editModal.querySelector("#form");
//const modalContent = editModal.querySelector(".modal");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#name");
const editModalDescriptionInput = editModal.querySelector("#description");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector("#close-button");
function closeModal(modal) {
  document.removeEventListener("Keydown", handleEscapeKey);
  document.removeEventListener("mousedown", handleMouseClick);
  modal.classList.remove("modal_opened");
}
function openModal(modal) {
  document.addEventListener("keydown", handleEscapeKey);
  document.addEventListener("mousedown", handleMouseClick);
  modal.classList.add("modal_opened");
}
function handleEscapeKey(event) {
  if (event.key === "Escape") {
    closeModal(editModal);
    closeModal(cardModal);
    closeModal(previewModal);
  }
}
function handleMouseClick(event) {
  switch (event.target) {
    case editModal:
      closeModal(editModal);
    case cardModal:
      closeModal(cardModal);
    case previewModal:
      closeModal(previewModal);
    default:
  }
}
profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;

  openModal(editModal);
});
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button_liked");
  });

  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
  });

  cardNameEl.textContent = data.name;
  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = data.link;
  cardImage.alt = data.name;

  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });
  return cardElement;
}

initialCards.forEach((item) => {
  const cardEl = getCardElement(item);
  cardsList.append(cardEl);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});
previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };
  const cardEl = getCardElement(inputValues);
  cardsList.prepend(cardEl);
  cardNameInput.value = "";
  cardLinkInput.value = "";
  disableButton(cardSubmitBtn, settings);
  closeModal(cardModal);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;

  closeModal(editModal);
}

//profileEditButton.addEventListener("click", openModal);
//editModalCloseBtn.addEventListener("click", closeModal);
profileFormElement.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
