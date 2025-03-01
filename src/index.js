// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

import "./pages/index.css";
import { initialCards } from "./cards.js";
import { createCard, deleteCard, likeCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  closeByOverlayClick,
} from "./components/modal.js";

const container = document.querySelector(".content");
const cardContainer = container.querySelector(".places__list");

const editProfileButton = document.querySelector(".profile__edit-button");
const addCardButton = document.querySelector(".profile__add-button");

const editProfilePopup = document.querySelector(".popup_type_edit");
const addCardPopup = document.querySelector(".popup_type_new-card");

const editProfilePopupForm = editProfilePopup.querySelector(".popup__form");
const inputName = editProfilePopupForm.querySelector(".popup__input_type_name");
const inputDescription = editProfilePopupForm.querySelector(
  ".popup__input_type_description"
);

const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const addCardForm = addCardPopup.querySelector(".popup__form");
const cardName = addCardForm.querySelector(".popup__input_type_card-name");

const cardImageLink = addCardForm.querySelector(".popup__input_type_url");
const imagePopup = document.querySelector(".popup_type_image");
const imageContentPopup = imagePopup.querySelector(".popup__image");
const imageCaptionPopup = imagePopup.querySelector(".popup__caption");
const profileCloseButton = document.querySelectorAll(".popup__close");

profileCloseButton.forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    if (popup) {
      closeModal(popup);
    }
  });
});

document.querySelectorAll(".popup").forEach((popup) => {
  popup.classList.add("popup_is-animated");
  popup.addEventListener("mousedown", closeByOverlayClick);
});

function openImagePopup(element) {
  imageContentPopup.src = element.link;
  imageContentPopup.alt = element.link;
  imageCaptionPopup.textContent = element.name;

  openModal(imagePopup);
}

function addCardElement(cards) {
  cards.forEach(function (element) {
    const cardElement = createCard(
      element,
      openImagePopup,
      deleteCard,
      likeCard
    );
    cardContainer.append(cardElement);
  });
}

addCardElement(initialCards);

function submitProfileForm(evt) {
  evt.preventDefault();

  const popupElement = evt.target.closest(".popup");
  const nameValue = inputName.value;
  const descriptionValue = inputDescription.value;

  profileName.textContent = nameValue;
  profileDescription.textContent = descriptionValue;

  closeModal(popupElement);
}

editProfilePopupForm.addEventListener("submit", submitProfileForm);
addCardButton.addEventListener("click", () => openModal(addCardPopup));
function openEditProfileForm() {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;

  openModal(editProfilePopup);
}

editProfileButton.addEventListener("click", openEditProfileForm);

function submitNewCardForm(evt) {
  evt.preventDefault();

  const newCard = {
    name: cardName.value,
    link: cardImageLink.value,
  };

  const cardElement = createCard(newCard, openImagePopup, deleteCard, likeCard);
  cardContainer.prepend(cardElement);

  addCardForm.reset();
  closeModal(addCardPopup);
}

addCardForm.addEventListener("submit", submitNewCardForm);