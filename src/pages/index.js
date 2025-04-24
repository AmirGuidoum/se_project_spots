import stepsSrc from "../images/steps.png";
import "./index.css";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";
import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "./scripts/validation.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f4bd1f8a-e18d-4c3a-acbb-903bd8b88513",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardsList.append(cardEl);
    });
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    avatarElement.src = userInfo.avatar;
  })
  .catch(console.error);
const editModal = document.querySelector("#edit-modal");
const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileFormElement = editModal.querySelector("#form");
const avatarElement = document.querySelector(".profile__avatar");
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarForm.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#name");
const editModalDescriptionInput = editModal.querySelector("#description");
const editSubmitBtn = profileFormElement.querySelector(".modal__submit-btn");
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteButton = deleteModal.querySelector("#delete-button");
const exitDeletelBtn = deleteModal.querySelector(".modal__close-btn");
const cancelButton = deleteModal.querySelector("#cancelButton");
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector("#close-button");
let selectedCard;
let selectedCardId;
function closeModal(modal) {
  document.removeEventListener("keydown", handleEscapeKey);
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
    const openedPopup = document.querySelector(".modal_opened");
    closeModal(openedPopup);
  }
}
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  setButtonText(avatarSubmitBtn, true);
  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      /*set new avatar element */
      avatarElement.src = data.avatar;
      avatarInput.value = "";
      disableButton(avatarSubmitBtn, settings);
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(avatarSubmitBtn, false);
    });
}
function handleMouseClick(event) {
  if (event.target.classList.contains("modal")) {
    closeModal(event.target);
  }
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    profileFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
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

  if (data.isLiked) {
    cardLikeBtn.classList.toggle("card__like-button_liked");
  }
  cardLikeBtn.addEventListener("click", (evt) => {
    const isLiked = cardLikeBtn.classList.contains("card__like-button_liked");
    api
      .changeLikeStatus(data._id, isLiked)
      .then(() => {
        cardLikeBtn.classList.toggle("card__like-button_liked");
      })
      .catch(console.error);
  });

  cardDeleteBtn.addEventListener("click", () => {
    openModal(deleteModal);
    selectedCard = cardElement;
    selectedCardId = data._id;
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
avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

exitDeletelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});
cancelButton.addEventListener("click", () => {
  closeModal(deleteModal);
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
avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  setButtonText(cardSubmitBtn, true);
  api
    .addCard({
      name: cardNameInput.value,
      link: cardLinkInput.value,
    })
    .then((data) => {
      cardNameInput.textContent = data.name;
      cardLinkInput.textContent = data.link;
      const cardEl = getCardElement(data);
      cardsList.prepend(cardEl);
      cardNameInput.value = "";
      cardLinkInput.value = "";
      disableButton(cardSubmitBtn, settings);
      closeModal(cardModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(cardSubmitBtn, false);
    });
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  setButtonText(editSubmitBtn, true);
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      disableButton(editSubmitBtn, settings);
      closeModal(editModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(editSubmitBtn, false);
    });
}
function handleDeleteSubmit(evt) {
  evt.preventDefault();
  setButtonText(deleteButton, true, "Deleting", "Delete");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(deleteButton, false, "Deleting", "Delete");
    });
}
deleteForm.addEventListener("submit", handleDeleteSubmit);
profileFormElement.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
enableValidation(settings);
