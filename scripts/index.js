// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const container = document.querySelector('.content');
const cardContainer = container.querySelector('.places__list');

initialCards.forEach(addCard);

function addCard (element) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const deleteButton = cardElement.querySelector('.card__delete-button');

    cardElement.querySelector('.card__image').src = element.link;
    cardElement.querySelector('.card__description').textContent = element.name;

    deleteButton.addEventListener('click', cardsDelete);

    cardContainer.append(cardElement);  
};

function cardsDelete (e){
    let cardItem = container.querySelector('.card__delete-button').closest(".card");
    cardItem.remove();
};

    
 
   
  

 
  


