import "./pages/index.css";
import { createCard, handleLikeCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  closeByOverlayClick,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  patchUserProfile,
  fetchCards,
  fetchUserData,
  createNewCard,
  updateAvatar,
  deleteCardApi,
} from "./components/api.js";

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Включение валидации
enableValidation(validationConfig);
let userId;

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
const profileImage = document.querySelector(".profile__image");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const addCardForm = addCardPopup.querySelector(".popup__form");
const cardName = addCardForm.querySelector(".popup__input_type_card-name");

const cardImageLink = addCardForm.querySelector(".popup__input_type_url");
const imagePopup = document.querySelector(".popup_type_image");
const imageContentPopup = imagePopup.querySelector(".popup__image");
const imageCaptionPopup = imagePopup.querySelector(".popup__caption");
const profileCloseButtons = document.querySelectorAll(".popup__close");
const confirmButton = document.querySelectorAll(".card__delete-button");

const avatarPopup = document.querySelector(".popup_type_edit-avatar");
const avatarInput = document.getElementById("avatar-input");

const formNewCard = document.forms["new-place"];
const formEditCard = document.forms["edit-profile"];
const formEditAvatar = document.forms["edit-avatar"];

const formNewCardButton = formNewCard.querySelector(".popup__button");
const formEditCardButton = formEditCard.querySelector(".popup__button");
const formEditAvatarButton = formEditAvatar.querySelector(".popup__button");

function renderLoading(isLoading, element) {
  element.textContent = isLoading ? "Сохранение..." : "Сохранить";
}

function openImagePopup(element) {
  imageContentPopup.src = element.link;
  imageContentPopup.alt = element.name;
  imageCaptionPopup.textContent = element.name;

  openModal(imagePopup);
}

// Функция для отображения карточек
function addCardElement(initialCards) {
  initialCards.forEach((element) => {
    cardContainer.append(
      createCard(
        element,
        openImagePopup,
        userId,
        handleLikeCard,
        openDeleteCardPopup
      )
    );
  });
}

function loadUserProfile(profileInfo) {
  profileName.textContent = profileInfo.name;
  profileDescription.textContent = profileInfo.about;
  profileImage.style.backgroundImage = `url(${profileInfo.avatar})`;
  userId = profileInfo._id;
}

Promise.all([fetchUserData(), fetchCards()])
  .then(([profileInfo, initialCards]) => {
    loadUserProfile(profileInfo);
    addCardElement(initialCards);
  })
  .catch((error) => {
    console.error(`Ошибка загрузки данных: ${error}`);
  });

function handleProfileEditClick() {
  openModal(editProfilePopup);
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  clearValidation(editProfilePopupForm, validationConfig);
}

function submitProfileForm(evt) {
  evt.preventDefault();

  renderLoading(true, formEditCardButton);

  const nameValue = inputName.value;
  const descriptionValue = inputDescription.value;

  patchUserProfile(nameValue, descriptionValue)
    .then((profileInfo) => {
      profileName.textContent = profileInfo.name;
      profileDescription.textContent = profileInfo.about;
      closeModal(editProfilePopup);
    })
    .catch((error) => console.error(`Ошибка изменения данных: ${error}`))
    .finally(() => {
      renderLoading(false, formEditCardButton);
    });
}

function submitNewCardForm(evt) {
  evt.preventDefault();

  renderLoading(true, formNewCardButton);

  createNewCard(cardName.value, cardImageLink.value)
    .then((element) => {
      cardContainer.prepend(
        createCard(
          element,
          openImagePopup,
          userId,
          handleLikeCard,
          openDeleteCardPopup
        )
      );

      closeModal(addCardPopup);
      addCardForm.reset();
      clearValidation(addCardForm, validationConfig);
    })
    .catch((error) => {
      console.log(`Ошибка добавления карточки: ${error}`);
    })
    .finally(() => {
      renderLoading(false, formNewCardButton);
    });
}

profileCloseButtons.forEach((button) => {
  button.addEventListener("click", (evt) => {
    closeModal(evt.currentTarget.closest(".popup"));
  });
});

document.querySelectorAll(".popup").forEach((evt) => {
  evt.addEventListener("click", closeByOverlayClick);
});

addCardButton.addEventListener("click", () => {
  openModal(addCardPopup);
  addCardForm.reset();
});

profileImage.addEventListener("click", () => {
  openModal(avatarPopup);

  formEditAvatar.reset();
  clearValidation(formEditAvatar, validationConfig);
});

formEditAvatar.addEventListener("submit", (evt) => {
  evt.preventDefault();
  renderLoading(true, formEditAvatarButton);

  updateAvatar(avatarInput.value)
    .then((element) => {
      profileImage.style.backgroundImage = `url(${element.avatar})`;
      formEditAvatar.reset();
      closeModal(formEditAvatar);
    })
    .catch((error) => {
      console.log(`Ошибка загрузка изображения: ${error}`);
    })
    .finally(() => {
      renderLoading(false, formEditAvatarButton);
    });
});

const deleteCardPopup = document.querySelector(".popup__type_confirm");
const formDeleteCard = document.querySelector(".form__delete-card");

let cardElementDelete;
let cardElementIdDelete;

function openDeleteCardPopup(cardElement, cardId) {
  cardElementDelete = cardElement;
  cardElementIdDelete = cardId;
  openModal(deleteCardPopup);
}

function submitDeleteCard(evt) {
  evt.preventDefault();

  deleteCardApi(cardElementIdDelete)
    .then(() => {
      cardElementDelete.remove();
      closeModal(deleteCardPopup);
    })
    .catch((error) => {
      console.log(`Ошибка удаления карточки: ${error}`);
    });
}

formDeleteCard.addEventListener("submit", submitDeleteCard);

editProfileButton.addEventListener("click", handleProfileEditClick);

formEditCard.addEventListener("submit", submitProfileForm);

formNewCard.addEventListener("submit", submitNewCardForm);
