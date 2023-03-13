// site-nav

const siteNavMenu = document.querySelector(".nav-list");
const toggleButton = document.querySelector(".toggle-button");

siteNavMenu.classList.remove("nav-list--nojs");
toggleButton.classList.remove("toggle-button--nojs");

const onSiteNavHandle = () => {
  siteNavMenu.classList.add("nav-list--closed");
  siteNavMenu.classList.remove("nav-list--opened");
  toggleButton.classList.add("toggle-button--closed");
  toggleButton.classList.remove("toggle-button--opened");
};

toggleButton.addEventListener("click", (evt) => {
  if (
    toggleButton.classList.contains("toggle-button--closed") &&
    siteNavMenu.classList.contains("nav-list--closed")
  ) {
    siteNavMenu.classList.remove("nav-list--closed");
    siteNavMenu.classList.add("nav-list--opened");
    toggleButton.classList.remove("toggle-button--closed");
    toggleButton.classList.add("toggle-button--opened");
    siteNavMenu.addEventListener("click", onSiteNavHandle);
  } else {
    siteNavMenu.classList.add("nav-list--closed");
    siteNavMenu.classList.remove("nav-list--opened");
    toggleButton.classList.add("toggle-button--closed");
    toggleButton.classList.remove("toggle-button--opened");
    siteNavMenu.removeEventListener("klick", onSiteNavHandle);
  }
});

//services card

const tasksList = document.querySelector(".tasks-list");
const taskItemAll = document.querySelectorAll(".tasks-list__item");

const removeActiveClass = () => {
  const items = tasksList.querySelectorAll(".tasks-list__item");
  items.forEach((item) => {
    if (item.classList.contains("tasks-list__item--active"))
      item.classList.remove("tasks-list__item--active");
  });
};

const removeText = () => {
  const text = tasksList.querySelectorAll(".tasks-list__text");
  text.forEach((item) => {
    item.classList.add("visually-hidden");
  });
};

const removeOrderButton = () => {
  const orderButtons = tasksList.querySelectorAll(".tasks-list__button--order");
  orderButtons.forEach((button) => {
    button.classList.add("visually-hidden");
  });
};

const changeTextOfMoreButton = () => {
  const moreButtons = tasksList.querySelectorAll(".tasks-list__button--more");
  moreButtons.forEach((button) => {
    button.textContent = "Подробнее";
  });
};

taskItemAll.forEach((item) => {
  const itemText = item.querySelector(".tasks-list__text");
  const moreButton = item.querySelector(".tasks-list__button--more");
  const orderButton = item.querySelector(".tasks-list__button--order");
  moreButton.addEventListener("click", () => {
    if (!item.classList.contains("tasks-list__item--active")) {
      removeActiveClass();
      removeText();
      removeOrderButton();
      changeTextOfMoreButton();
      item.classList.add("tasks-list__item--active");
      itemText.classList.remove("visually-hidden");
      orderButton.classList.remove("visually-hidden");
      moreButton.textContent = "Закрыть";
    } else {
      removeActiveClass();
      item.classList.remove("tasks-list__item--active");
      itemText.classList.add("visually-hidden");
      orderButton.classList.add("visually-hidden");
      moreButton.textContent = "Подробнее";
    }
  });
});

// modals

const successMessageTemplate = document.querySelector('#success').content;
const errorMessageTemplate = document.querySelector('#error').content;
const body = document.querySelector('body');

const Keys = {
  ESC: 'Esc',
  ESCAPE: 'Escape',
};

const isEscEvent = (evt) => {
  return evt.key === Keys.ESCAPE || evt.key === Keys.ESC;
};

const removeMessage = (message) => {
  document.querySelector(message).remove();
}

const onSuccessMessageEscKeydown = (evt) => {
  if (isEscEvent(evt)) {
    removeMessage('.success');
    document.removeEventListener('keydown', onSuccessMessageEscKeydown);
  }
}

const onDocumentClickRemoveSuccessMessage = () => {
  removeMessage('.success');
  document.removeEventListener('click', onDocumentClickRemoveSuccessMessage);
}

const successMessageShow = () => {
  const successMessage = successMessageTemplate.cloneNode(true);

  document.addEventListener('keydown', onSuccessMessageEscKeydown);
  document.addEventListener('click', onDocumentClickRemoveSuccessMessage);

  body.appendChild(successMessage);

  setTimeout(() => {
    removeMessage('.success');
  }, 2000);
}

const onErrorMessageEscKeydown = (evt) => {
  if (isEscEvent(evt)) {
    removeMessage('.error');
    document.removeEventListener('keydown', onErrorMessageEscKeydown);
  }
}

const onDocumentClickRemoveErrorMessage = () => {
  removeMessage('.error');
  document.removeEventListener('click', onDocumentClickRemoveErrorMessage);
}

const errorMessageShow = () => {
  const errorMessage = errorMessageTemplate.cloneNode(true);

  document.addEventListener('keydown', onErrorMessageEscKeydown);
  document.addEventListener('click', onDocumentClickRemoveErrorMessage);

  body.appendChild(errorMessage);

  setTimeout(() => {
    removeMessage('.error');
  }, 2000);
}

// form validation



// telegram chat

const TOKEN = "6255542939:AAHERS28Vi18xML8uUg2v1GnJC9OKph6zwg";
const CHAT_ID = "-1001650046621";
const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

document.getElementById('intro-form').addEventListener('submit', function (evt) {
  evt.preventDefault();

  let message = `<b>Заявка с сайта СЭС Чистый дом</b>\n`;
  message += `<b>Номер телефона: </b> ${this.number.value}\n`;
  console.log(message);

  axios.post(URI_API, {
    chat_id: CHAT_ID,
    parse_mode: 'html',
    text: message
  })
    .then((response) => {
      successMessageShow();
      this.number.value = '';
    })
    .catch(() => {
      errorMessageShow();
    })
})

document.getElementById('price-form').addEventListener('submit', function (evt) {
  evt.preventDefault();

  let message = `<b>Заявка с сайта СЭС Чистый дом</b>\n`;
  message += `<b>Номер телефона: </b> ${this.number.value}\n`;
  console.log(message);

  axios.post(URI_API, {
    chat_id: CHAT_ID,
    parse_mode: 'html',
    text: message
  })
    .then((response) => {
      successMessageShow();
      this.number.value = '';
    })
    .catch(() => {
      errorMessageShow();
    })
})

