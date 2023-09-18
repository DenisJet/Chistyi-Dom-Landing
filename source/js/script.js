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

// telegram chat

const TOKEN = "6255542939:AAHERS28Vi18xML8uUg2v1GnJC9OKph6zwg";
const CHAT_ID = "-1001650046621";
const URI_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

const formHandler = (formId) => {
  document.getElementById(formId).addEventListener('submit', function (evt) {
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
        this.number.value = '';
        window.location = '../thanks.html';
      })
      .catch(() => {
      })
  })
}

formHandler('intro-form');
formHandler('price-form');
formHandler('works-form');
formHandler('pop-up-form');

// Геолокация

// fetch('https://ipapi.co/json/')
//   .then(response => response.json())
//   .then(ip => {
//     const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=";
//     const token = "a99fe25637403c0808469d6664873676da98e928";
//     const query = ip.ip;
//     const location = document.getElementById('location');
//     const introLocation = document.getElementById('intro-location');

//     const options = {
//       method: "GET",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json",
//         "Authorization": "Token " + token
//       }
//     }

//     fetch(url + query, options)
//       .then(response => response.json())
//       .then(result => {
//         console.log(result.location.data);
//         location.innerHTML = result.location.value.split(',')[0];
//         introLocation.innerHTML = result.location.value.split(',')[0];
//       })
//       .catch();
//   });

window.onload = () => {
  if (ymaps.geolocation.region) {
    document.getElementById('location').innerHTML = ymaps.geolocation.region;
    document.getElementById('intro-location').innerHTML = ymaps.geolocation.region;
  }
}

// sertificats slider

const sertificats = document.querySelectorAll('.sertificats__item');
const slider = document.querySelector('.slider-sertificats');
const sliderContainer = slider.querySelector('.slider-sertificats__container');
const slides = slider.querySelectorAll('.slider-sertificats__item');
const closeButton = slider.querySelector('.slider-sertificats__button--close');
const sliderButtonPrev = slider.querySelector('.slider-sertificats__swiper-button--prev')
const sliderButtonNext = slider.querySelector('.slider-sertificats__swiper-button--next')

const escKeyHandler = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    closePopup();
  }
}

const windowClickHandler = (evt) => {
  if (!evt.composedPath().includes(sliderContainer) && !evt.composedPath().includes(sliderButtonPrev) && !evt.composedPath().includes(sliderButtonNext)) {
    closePopup();
  }
};

const closeButtonHandler = () => {
  closePopup();
}

const openPopup = () => {
  slider.classList.add('slider-sertificats--active');
  document.addEventListener('keydown', escKeyHandler);
  slider.addEventListener('click', windowClickHandler);
  closeButton.addEventListener('click', closeButtonHandler);
}

const closePopup = () => {
  slider.classList.remove('slider-sertificats--active');
  document.removeEventListener('keydown', escKeyHandler);
  slider.removeEventListener('click', windowClickHandler);
  closeButton.removeEventListener('click', closeButtonHandler);
}

sertificats.forEach((sertificat) => {
  sertificat.addEventListener('click', () => {
    openPopup();
  })
})

new Swiper('.slider-sertificats__swiper', {
  loop: true,
  spaceBetween: 20,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
})

// works slider

new Swiper('.works__swiper', {
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// reviews slider

new Swiper('.reviews__swiper', {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 10,
  breakpoints: {
    600: {
      slidesPerView: 2,
      spaceBetween: 10
    },
    880: {
      slidesPerView: 3,
      spaceBetween: 10
    },
    1150: {
      slidesPerView: 4,
      spaceBetween: 10
    }
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// popup form

const popup = document.querySelector('.pop-up');
const popupContainer =popup.querySelector('.pop-up__container');
const popupCloseButton = popup.querySelector('.pop-up__close');

const escPopupKeyHandler = (evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    closePopupForm();
  }
}

const clickHandler = (evt) => {
  if (!evt.composedPath().includes(popupContainer)) {
    closePopupForm();
  }
};

const openPopupForm = () => {
  popup.classList.add('pop-up--active');
  document.addEventListener('keydown', escPopupKeyHandler);
  popup.addEventListener('click', clickHandler);
}

const closePopupForm = () => {
  popup.classList.remove('pop-up--active');
  document.removeEventListener('keydown', escPopupKeyHandler);
}

document.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('button-open-popup-form')) {
    openPopupForm();
  }
})

popupCloseButton.addEventListener('click', () => {
  closePopupForm();
})
