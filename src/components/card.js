import { deleteCardApi, likeCardApi, unlikeCard } from './api.js';

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".places__item");

function createCard(element, openImagePopup, userId) {
  const cardElement = cardTemplate.cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCounter = cardElement.querySelector('.card__like-counter');
  const isLiked = element.likes.some((like) => like._id === userId);
  const nameElement = cardElement.querySelector(".card__title");

  cardImage.src = element.link;
  cardImage.alt = element.name;
  nameElement.textContent = element.name;
  likeCounter.textContent = element.likes.length;
  cardElement._id = element._id;

  // Показываем кнопку удаления только если пользователь является владельцем карточки
  if (element.owner._id === userId) {
    deleteButton.addEventListener("click", () => {
      deleteCardApi(cardElement._id)
        .then(() => cardElement.remove()) // Удаляем элемент после успешного ответа
        .catch(error => console.error(`Ошибка при удалении карточки: ${error}`));
    });
  } else {
    deleteButton.style.display = 'none'; // Если не владелец, скрываем кнопку
  }

  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }
  
  likeButton.addEventListener('click', () => {
    likeCardApi(cardElement, likeButton, likeCounter);
  });
  
  cardImage.addEventListener("click", () => openImagePopup(element));

  return cardElement;
}

export function handleLikeCard(cardId, likeButton, likeCounter) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  const likeMethod = isLiked ? 'DELETE' : 'PUT';
  fetch(`https://nomoreparties.co/v1/wff-cohort-34/cards/likes/${cardId}`, {
    method: likeMethod,
    headers: {
      authorization: "782c1b99-8f51-4f78-9bbe-612fa93b6e30",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      likeButton.classList.toggle('card__like-button_is-active');
      likeCounter.textContent = data.likes.length;
    })
    .catch((error) => console.error('Ошибка при лайке карточки:', error));
}

export function handleDeleteCard(cardId, cardElement) {
  fetch(`https://nomoreparties.co/v1/wff-cohort-34/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      authorization: "782c1b99-8f51-4f78-9bbe-612fa93b6e30",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.ok) {
        cardElement.remove();
      } else {
        console.error('Ошибка при удалении карточки:', res.status);
      }
    })
    .catch((error) => console.error('Ошибка при удалении карточки:', error));
}

export { createCard };



