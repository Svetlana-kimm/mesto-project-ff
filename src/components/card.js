const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".places__item");

function createCard(element, openImagePopup, deleteCard, likeCard) {
  const cardElement = cardTemplate.cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");

  cardImage.src = element.link;
  cardImage.alt = element.name;
  const nameElement = cardElement.querySelector(".card__title");
  nameElement.textContent = element.name;

  deleteButton.addEventListener("click", () => {
    deleteCard(cardElement);
  });

  likeButton.addEventListener("click", () => {
    likeCard(likeButton);
  });

  cardImage.addEventListener("click", () => openImagePopup(element));

  return cardElement;
}

function deleteCard(cardElement) {
  cardElement.remove();
}

function likeCard(button) {
  button.classList.toggle("card__like-button_is-active");
}

export { createCard, deleteCard, likeCard };
