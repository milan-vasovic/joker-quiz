let currentStep = 1;
const totalSteps = 4;
let acceptedAnswerIndex = 1;
let multipleAnswerIndex = 1;

function showStep(step) {
  // Sakrijemo sve korake
  const steps = document.querySelectorAll(".form-step");
  steps.forEach((stepDiv) => {
    stepDiv.style.display = "none";
  });

  // Prikažemo trenutni korak
  document.getElementById("step-" + step).style.display = "block";
}

function nextStep() {
  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
    handleDynamicFields();
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
    handleDynamicFields();
  }
}

function handleDynamicFields() {
  const type = document.getElementById("type").value;

  // Korak 3: Accepted Answers
  if (currentStep === 3) {
    const addAcceptedAnswerButton = document.getElementById(
      "addAcceptedAnswerButton"
    );
    const acceptedAnswersContainer = document.getElementById(
      "acceptedAnswersContainer"
    );
    const acceptedAnswers =
      acceptedAnswersContainer.querySelectorAll(".accepted-answer");

    // Ako je multipleChoice, dozvoljavamo dodavanje više tačnih odgovora
    if (type === "multipleChoice" || type === "matching") {
      addAcceptedAnswerButton.style.display = "block";

      // Prolazimo kroz sve postojeće tačne odgovore
      acceptedAnswers.forEach((answerDiv, index) => {
        const removeButton = answerDiv.querySelector(
          ".remove-accepted-answer-button"
        );
        if (index > 0) {
          // Prikazujemo dugme za brisanje za dodatne odgovore
          removeButton.style.display = "inline-block";
        } else {
          // Sakrivamo dugme za prvi odgovor
          if (removeButton) {
            removeButton.style.display = "none";
          }
        }
      });
    } else {
      addAcceptedAnswerButton.style.display = "none";

      // Sakrivamo dugmad za brisanje za sve odgovore
      acceptedAnswers.forEach((answerDiv) => {
        const removeButton = answerDiv.querySelector(
          ".remove-accepted-answer-button"
        );
        if (removeButton) {
          removeButton.style.display = "none";
        }
      });

      // Uklonimo dodatne tačne odgovore, ostavimo samo prvi
      acceptedAnswers.forEach((answerDiv, index) => {
        if (index > 0) {
          acceptedAnswersContainer.removeChild(answerDiv);
        }
      });
      acceptedAnswerIndex = 1;
    }
  }

  // Korak 4: Multiple Answers
  if (currentStep === 4) {
    const addMultipleAnswerButton = document.getElementById(
      "addMultipleAnswerButton"
    );
    const multipleAnswersContainer = document.getElementById(
      "multipleAnswersContainer"
    );
    const multipleAnswers =
      multipleAnswersContainer.querySelectorAll(".multiple-answer");

    // Uvek prikazujemo sekciju multipleAnswers

    // Ako je tip pitanja 'multipleChoice', omogućavamo dodavanje mogućih odgovora
    if (type === "multipleChoice" || type === 'matching') {
      addMultipleAnswerButton.style.display = "block";

      // Prolazimo kroz sve postojeće moguće odgovore
      multipleAnswers.forEach((answerDiv, index) => {
        const removeButton = answerDiv.querySelector(
          ".remove-multiple-answer-button"
        );
        if (index > 0) {
          // Prikazujemo dugme za brisanje za dodatne odgovore
          removeButton.style.display = "inline-block";
        } else {
          // Sakrivamo dugme za prvi odgovor
          if (removeButton) {
            removeButton.style.display = "none";
          }
        }
      });
    } else {
      addMultipleAnswerButton.style.display = "none";

      // Sakrivamo dugmad za brisanje za sve odgovore
      multipleAnswers.forEach((answerDiv) => {
        const removeButton = answerDiv.querySelector(
          ".remove-multiple-answer-button"
        );
        if (removeButton) {
          removeButton.style.display = "none";
        }
      });

      // Očistimo vrednosti polja ako tip pitanja nije multipleChoice
      document.getElementById("multiAnswerText0").value = "";
      document.getElementById("multiAnswerImage0").value = "";

      // Uklonimo dodatne moguće odgovore, ostavimo samo prvi
      multipleAnswers.forEach((answerDiv, index) => {
        if (index > 0) {
          multipleAnswersContainer.removeChild(answerDiv);
        }
      });
      multipleAnswerIndex = 1;
    }
  }
}

function addAcceptedAnswer() {
  const acceptedAnswersContainer = document.getElementById(
    "acceptedAnswersContainer"
  );

  const answerDiv = document.createElement("div");
  answerDiv.classList.add("accepted-answer");

  answerDiv.innerHTML = `
            <label for="answerText${acceptedAnswerIndex}">Tačan Odgovor</label>
            <textarea name="acceptedAnswers[text]" id="answerText${acceptedAnswerIndex}" required></textarea>

            <label for="points${acceptedAnswerIndex}">Bodovi</label>
            <input type="number" name="acceptedAnswers[points]" id="points${acceptedAnswerIndex}" required>

            <label for="answerImage${acceptedAnswerIndex}">Slika</label>
            <input type="text" name="acceptedAnswers[image]" id="answerImage${acceptedAnswerIndex}">
            <img id="answerImagePreview${acceptedAnswerIndex}" src="" alt="" style="display: none;">

            <!-- Dugme za brisanje odgovora -->
            <button type="button" class="remove-accepted-answer-button" onclick="removeAcceptedAnswer(${acceptedAnswerIndex})">Obriši odgovor</button>
        `;

  acceptedAnswersContainer.appendChild(answerDiv);

  acceptedAnswerIndex++;
  handleDynamicFields(); // Ažuriramo prikaz dugmadi za brisanje
}

function removeAcceptedAnswer(index) {
  const acceptedAnswersContainer = document.getElementById(
    "acceptedAnswersContainer"
  );
  const answerDiv = document.getElementById(`answerText${index}`).parentNode;
  acceptedAnswersContainer.removeChild(answerDiv);
  acceptedAnswerIndex--;

  // Nakon uklanjanja, potrebno je ažurirati indekse preostalih odgovora
  updateAcceptedAnswerIndices();

  handleDynamicFields(); // Ažuriramo prikaz dugmadi za brisanje
}

function updateAcceptedAnswerIndices() {
  const acceptedAnswersContainer = document.getElementById(
    "acceptedAnswersContainer"
  );
  const acceptedAnswers =
    acceptedAnswersContainer.querySelectorAll(".accepted-answer");
  acceptedAnswers.forEach((answerDiv, newIndex) => {
    // Ažuriramo ID-ove i imena polja
    const textArea = answerDiv.querySelector("textarea");
    textArea.name = `acceptedAnswers[text]`;
    textArea.id = `answerText${newIndex}`;

    const pointsInput = answerDiv.querySelector('input[type="number"]');
    pointsInput.name = `acceptedAnswers[points]`;
    pointsInput.id = `points${newIndex}`;

    const imageInput = answerDiv.querySelector('input[type="text"]');
    imageInput.name = `acceptedAnswers[image]`;
    imageInput.id = `answerImage${newIndex}`;

    const imgPreview = answerDiv.querySelector("img");
    imgPreview.id = `answerImagePreview${newIndex}`;

    const removeButton = answerDiv.querySelector(
      ".remove-accepted-answer-button"
    );
    if (removeButton) {
      removeButton.setAttribute("onclick", `removeAcceptedAnswer(${newIndex})`);
    }
  });

  acceptedAnswerIndex = acceptedAnswers.length;
}

// Slične izmene za multiple answers

function addMultipleAnswer() {
  const multipleAnswersContainer = document.getElementById(
    "multipleAnswersContainer"
  );

  const answerDiv = document.createElement("div");
  answerDiv.classList.add("multiple-answer");

  answerDiv.innerHTML = `
            <label for="multiAnswerText${multipleAnswerIndex}">Mogući Odgovor</label>
            <textarea name="multipleAnswers[text]" id="multiAnswerText${multipleAnswerIndex}" required></textarea>

            <label for="multiAnswerImage${multipleAnswerIndex}">Slika</label>
            <input type="text" name="multipleAnswers[image]" id="multiAnswerImage${multipleAnswerIndex}">
            <img id="multiAnswerImagePreview${multipleAnswerIndex}" src="" alt="" style="display: none;">

            <!-- Dugme za brisanje odgovora -->
            <button type="button" class="remove-multiple-answer-button" onclick="removeMultipleAnswer(${multipleAnswerIndex})">Obriši odgovor</button>
        `;

  multipleAnswersContainer.appendChild(answerDiv);

  multipleAnswerIndex++;
  handleDynamicFields(); // Ažuriramo prikaz dugmadi za brisanje
}

function removeMultipleAnswer(index) {
  const multipleAnswersContainer = document.getElementById(
    "multipleAnswersContainer"
  );
  const answerDiv = document.getElementById(
    `multiAnswerText${index}`
  ).parentNode;
  multipleAnswersContainer.removeChild(answerDiv);
  multipleAnswerIndex--;

  // Nakon uklanjanja, potrebno je ažurirati indekse preostalih odgovora
  updateMultipleAnswerIndices();

  handleDynamicFields(); // Ažuriramo prikaz dugmadi za brisanje
}

function updateMultipleAnswerIndices() {
  const multipleAnswersContainer = document.getElementById(
    "multipleAnswersContainer"
  );
  const multipleAnswers =
    multipleAnswersContainer.querySelectorAll(".multiple-answer");
  multipleAnswers.forEach((answerDiv, newIndex) => {
    // Ažuriramo ID-ove i imena polja
    const textArea = answerDiv.querySelector("textarea");
    textArea.name = `multipleAnswers[text]`;
    textArea.id = `multiAnswerText${newIndex}`;

    const imageInput = answerDiv.querySelector('input[type="text"]');
    imageInput.name = `multipleAnswers[image]`;
    imageInput.id = `multiAnswerImage${newIndex}`;

    const imgPreview = answerDiv.querySelector("img");
    imgPreview.id = `multiAnswerImagePreview${newIndex}`;

    const removeButton = answerDiv.querySelector(
      ".remove-multiple-answer-button"
    );
    if (removeButton) {
      removeButton.setAttribute("onclick", `removeMultipleAnswer(${newIndex})`);
    }
  });

  multipleAnswerIndex = multipleAnswers.length;
}

// Event listener za promenu tipa pitanja
document.getElementById("type").addEventListener("change", function () {
  // Resetujemo indekse i polja ako je potrebno
  acceptedAnswerIndex = 1;
  multipleAnswerIndex = 1;

  // Resetujemo accepted answers
  const acceptedAnswersContainer = document.getElementById(
    "acceptedAnswersContainer"
  );
  const acceptedAnswers =
    acceptedAnswersContainer.querySelectorAll(".accepted-answer");
  acceptedAnswers.forEach((answerDiv, index) => {
    if (index > 0) {
      acceptedAnswersContainer.removeChild(answerDiv);
    } else {
      // Resetujemo vrednosti prvog tačnog odgovora
      document.getElementById("answerText0").value = "";
      document.getElementById("points0").value = "";
      document.getElementById("answerImage0").value = "";
    }
  });

  // Resetujemo multiple answers
  const multipleAnswersContainer = document.getElementById(
    "multipleAnswersContainer"
  );
  const multipleAnswers =
    multipleAnswersContainer.querySelectorAll(".multiple-answer");
  multipleAnswers.forEach((answerDiv, index) => {
    if (index > 0) {
      multipleAnswersContainer.removeChild(answerDiv);
    } else {
      // Resetujemo vrednosti prvog mogućeg odgovora
      document.getElementById("multiAnswerText0").value = "";
      document.getElementById("multiAnswerImage0").value = "";
    }
  });

  handleDynamicFields();
});

// Inicijalizacija forme
showStep(currentStep);
handleDynamicFields();
