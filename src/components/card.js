import { unlikeCard, likeCardApi, deleteCardApi } from "./api.js";

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".places__item");

export function createCard(
  element,
  openImagePopup,
  userId,
  handleLikeCard,
  openDeleteCardPopup
) {
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const nameElement = cardElement.querySelector(".card__title");

  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCounter = cardElement.querySelector(".card__like-counter");

  const cardId = element._id;

  cardImage.src = element.link;
  cardImage.alt = element.name;
  nameElement.textContent = element.name;
  likeCounter.textContent = element.likes.length;

  if (element.likes.some((elem) => elem._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Показываем кнопку удаления только если пользователь является владельцем карточки
  if (element.owner._id === userId) {
    deleteButton.addEventListener("click", () =>
      openDeleteCardPopup(cardElement, cardId)
    );
  } else {
    deleteButton.remove();
  }

  likeButton.addEventListener("click", (evt) =>
    handleLikeCard(evt, cardId, likeCounter)
  );

  cardImage.addEventListener("click", () => openImagePopup(element));

  return cardElement;
}

export function handleDeleteCard(cardId, cardElem) {
  deleteCardApi(cardId)
    .then(() => {
      cardElem.remove();
    })
    .catch((error) => {
      console.log(`Ошибка при удалении карточки: ${error}`);
    });
}

export function handleLikeCard(evt, cardId, likeCounter) {
  const target = evt.target;
  const isLiked = target.classList.contains("card__like-button_is-active");
  const likeMethod = isLiked ? unlikeCard : likeCardApi;

  likeMethod(cardId)
    .then((element) => {
      likeCounter.textContent = element.likes.length;
      if (isLiked) {
        target.classList.remove("card__like-button_is-active");
      } else {
        target.classList.add("card__like-button_is-active");
      }
    })
    .catch((error) => {
      console.log(
        `Ошибка при ${isLiked ? "удалении" : "добавлении"} лайка: ${error}`
      );
    });
}
