// Функция для показа ошибки
const showError = (
  formElement,
  inputElement,
  errorMessage,
  validationConfig
) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(validationConfig.errorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.inputErrorClass);
};

// Функция для скрытия ошибки
const hideError = (formElement, inputElement, validationConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(validationConfig.errorClass);
};

// Проверка валидности инпута
const checkInputValidity = (formElement, inputElement, validationConfig) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  // Показ ошибок или их скрытие
  if (!inputElement.validity.valid) {
    const errorMessage = inputElement.validationMessage;
    showError(formElement, inputElement, errorMessage, validationConfig);
  } else {
    hideError(formElement, inputElement, validationConfig); // Убираем ошибку
  }
};

// Включение валидации форм
export const enableValidation = (validationConfig) => {
  const formList = Array.from(
    document.querySelectorAll(validationConfig.formSelector)
  );

  formList.forEach((formElement) => {
    setEventListeners(formElement, validationConfig); // Устанавливаем слушатели для каждой формы
  });
};

// Устанавливает слушатели на полях ввода
function setEventListeners(formElement, validationConfig) {
    
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  ); // Получаем все поля ввода

  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector
  ); // Получаем кнопку отправки

  toggleButtonState(inputList, buttonElement, validationConfig); // Проверяем состояние кнопки

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity (formElement, inputElement, validationConfig); // Проверка валидности каждого поля
      toggleButtonState(inputList, buttonElement, validationConfig); // Обновление состояния кнопки
    });
  });
}

// Проверка валидности всех инпутов
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// Переключение состояния кнопки
const toggleButtonState = (inputList, buttonElement, validationConfig) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(validationConfig.inactiveButtonClass); // Делаем кнопку неактивной
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(validationConfig.inactiveButtonClass); // Активируем кнопку
    buttonElement.disabled = false;
  }
};


// Очистка ошибок валидации
export const clearValidation = (formElement, validationConfig) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  ); // Получаем все поля ввода
  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector
  ); // Получаем кнопку отправки

  // Проходим по всем инпутам и скрываем ошибки
  inputList.forEach((inputElement) => {
    hideError(formElement, inputElement, validationConfig); // Убираем ошибку
  });
  toggleButtonState(inputList, buttonElement, validationConfig); // Делаем кнопку неактивной
};
