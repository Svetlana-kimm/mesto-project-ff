// openModal и closeModal

export { openModal, closeModal, closeByOverlayClick };

function openModal(popup) {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeModalOnEsc);
  popup.addEventListener("mousedown", closeByOverlayClick);
}

function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeModalOnEsc);
  popup.removeEventListener("mousedown", closeByOverlayClick);
}

function closeModalOnEsc(evt) {
  if (evt.key === "Escape") {
    const popupIsOpened = document.querySelector(".popup_is-opened");
    if (popupIsOpened) {
      closeModal(popupIsOpened);
    }
  }
}

function closeByOverlayClick(evt) {
  if (evt.target.classList.contains("popup")) {
    closeModal(evt.target);
  }
}
