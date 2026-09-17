const config = window.INVITATION_CONFIG || {};
const setText = (id, value) => {
  const node = document.getElementById(id);
  if (node && value) node.textContent = value;
};

setText("event-date", config.eventDate);
setText("detail-date", config.eventDate);
setText("detail-time", config.eventTime);
setText("detail-place", config.eventPlace);

if (config.heroImage) {
  const hero = document.querySelector(".hero");
  hero.classList.add("has-image");
  hero.style.backgroundImage = `linear-gradient(90deg, rgba(10,9,13,.96), rgba(10,9,13,.68), rgba(10,9,13,.78)), url("${config.heroImage}")`;
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));

const form = document.getElementById("character-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const google = config.googleForm || {};
  const ready = google.action && google.playerNameEntry && google.characterNameEntry && google.characterClassEntry;


  const payload = new URLSearchParams();
  payload.set(google.playerNameEntry, document.getElementById("player-name").value.trim());
  payload.set(google.characterNameEntry, document.getElementById("character-name").value.trim());
  payload.set(google.characterClassEntry, document.getElementById("character-class").value.trim());

  const submitButton = form.querySelector("button");
  submitButton.disabled = true;
  status.textContent = "Отправляем ответ…";

  fetch(google.action, { method: "POST", mode: "no-cors", body: payload })
    .then(() => {
      form.reset();
      status.textContent = "Ваш ответ принят. Приглашение остаётся у вас.";
    })
    .catch(() => {
      status.textContent = "Не удалось отправить ответ. Попробуйте ещё раз или напишите мастеру лично.";
    })
    .finally(() => { submitButton.disabled = false; });
});
