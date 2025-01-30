// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const container = document.querySelector('.content');
const cardContainer = container.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content.querySelector(".places__item");

initialCards.forEach(element => { const cardElement = createCard(element); console.log(cardContainer.append(cardElement)); });

function createCard (element) {
    const cardElement = cardTemplate.cloneNode(true);
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const link = cardElement.querySelector('.card__image').src = element.link;
    const altname = cardElement.querySelector('.card__image').alt = 'Изображение места: ${name}';
    const name = cardElement.querySelector('.card__title').textContent = element.name;
    deleteButton.addEventListener('click', () => deleteCard(cardElement));
    return cardElement;
};

function deleteCard(cardElement) {
    cardElement.remove();
  };
