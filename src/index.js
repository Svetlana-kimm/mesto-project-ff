import "./pages/index.css";
import { initialCards } from "./cards.js";
import { createCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  closeByOverlayClick,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  fetchUserData,
  fetchCards,
  patchUserProfile,
  createNewCard,
  deleteCardApi,
  likeCardApi,
  unlikeCard,
  updateAvatar,
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

const editIcon = document.querySelector('.profile__edit-icon');
const overlay = document.querySelector('.profile_overlay');
const avatarPopup = document.querySelector('.popup_type_edit-avatar');
const closeButton = avatarPopup.querySelector('.popup__close');
const avatarForm = avatarPopup.querySelector('form');
const avatarInput = document.getElementById('avatar-input');
const avatarInputError = avatarPopup.querySelector('.avatar-input-error');
const saveButton = avatarPopup.querySelector('.popup__button');


// Функция для открытия попапа
editIcon.addEventListener('click', () => {
  overlay.style.display = 'block'; // Показываем оверлей
  avatarPopup.style.display = 'block'; // Показываем попап
});

// Функция для закрытия попапа
closeButton.addEventListener('click', () => {
  overlay.style.display = 'none'; // Скрываем оверлей
  avatarPopup.style.display = 'none'; // Скрываем попап
});

// Обработка отправки формы
avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const avatarUrl = avatarInput.value;

  // Валидация URL
  if (!validateURL(avatarUrl)) {
    avatarInputError.textContent = avatarInput.dataset.errorMessage;
    return;
  }

  // Используем уже существующую функцию для обновления аватара
  updateAvatar(avatarUrl)
    .then(() => {
      // Успешно обновляем аватар на странице
      document.querySelector('.profile__image').style.backgroundImage = `url(${avatarUrl})`;
      overlay.style.display = 'none'; // Закрываем попап
      avatarPopup.style.display = 'none'; // Закрываем попап
    })
    .catch(error => {
      avatarInputError.textContent = 'Ошибка при обновлении аватара: ' + error.message; // Показываем ошибку
    });
    // Валидация URL
function validateURL(url) {
  const pattern =`/^(http|https):\/\/[^ "]+$/`;
  return pattern.test(url);
}
});


// Очистка ошибок при открытии формы редактирования профиля
editProfileButton.addEventListener("click", () => {
  clearValidation(editProfilePopupForm, validationConfig);
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  openModal(editProfilePopup);
});

profileCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    if (popup) {
      closeModal(popup);
    }
  });
});

document.querySelectorAll(".popup").forEach((popup) => {
  popup.classList.add("popup_is-animated");
});

function openImagePopup(element) {
  imageContentPopup.src = element.link;
  imageContentPopup.alt = element.name;
  imageCaptionPopup.textContent = element.name;

  openModal(imagePopup);
}

let userId = "";
// Функция для отображения карточек
function addCardElement(cards) {
  cards.forEach((cardData) => {
    const cardElement = createCard(
      cardData,
      openImagePopup,
      deleteCardApi,
      likeCardApi,
      userId
    );
    cardContainer.append(cardElement);
  });
}

// Функция обработки данных профиля
function loadUserProfile() {
  fetchUserData()
    .then((profileInfo) => {
      profileName.textContent = profileInfo.name;
      profileDescription.textContent = profileInfo.about;
      profileImage.style.backgroundImage = `url(${profileInfo.avatar})`;
      userId = profileInfo._id;
    })
    .catch((error) => console.error(`Ошибка: ${error}`));
}

// Функция обработки загрузки карточек
function loadInitialCards() {
  fetchCards()
    .then((cards) => {
      addCardElement(cards);
    })
    .catch((error) => console.error(`Ошибка: ${error}`));
}

function submitProfileForm(evt) {
  evt.preventDefault();
  const popupElement = evt.target.closest(".popup");
  const nameValue = inputName.value;
  const descriptionValue = inputDescription.value;

  saveButton.textContent= 'Сохранение...'

  patchUserProfile(nameValue, descriptionValue)
    .then((profileInfo) => {
      profileName.textContent = profileInfo.name;
      profileDescription.textContent = profileInfo.about;
      closeModal(editProfilePopup);
    })
    .catch((error) => console.error(`Ошибка: ${error}`));
}

editProfilePopupForm.addEventListener("submit", submitProfileForm);

// Обработка формы добавления карточки
addCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const newCard = {
    name: cardName.value,
    link: cardImageLink.value,
  };

  createNewCard(newCard.name, newCard.link)
    .then((cardData) => {
      const cardElement = createCard(
        cardData,
        openImagePopup,
        deleteCardApi,
        likeCardApi,
        userId
      );
      cardContainer.prepend(cardElement); // Добавляем новую карточку в начало
      addCardForm.reset();
      closeModal(addCardPopup);
    })
    .catch((error) => console.error(`Ошибка: ${error}`));
});

// Загружаем данные пользователя и карточек
Promise.all([fetchUserData(), fetchCards()])
  .then(([profileInfo, initialCards]) => {
    profileName.textContent = profileInfo.name;
    profileDescription.textContent = profileInfo.about;
    profileImage.style.backgroundImage = `url(${profileInfo.avatar})`;
    userId = profileInfo._id;
    addCardElement(initialCards);
  })
  .catch((error) => console.error(`Ошибка при загрузке данных: ${error}`));

// Обработка клика на иконку удаления
cardContainer.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("card__delete-button")) {
    const card = evt.target.closest(".card");
    const cardId = card.dataset.id; 
    deleteCardApi(cardId)
      .then(() => card.remove())
      .catch((error) => console.error(`Ошибка: ${error}`));
  }
});

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

  const cardElement = createCard(
    newCard,
    openImagePopup,
    deleteCardApi,
    likeCardApi
  );
  submitNewCardButton.textContent = "Сохранение...";
  cardContainer.prepend(cardElement);

  addCardForm.reset();
  closeModal(addCardPopup);
}
