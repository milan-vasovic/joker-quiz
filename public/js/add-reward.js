document.getElementById('addReward').addEventListener('click', function(e) {
    e.preventDefault();
    const rewardsContainer = document.getElementById("rewardsContainer");
    const newReward = document.createElement("div");
    const newIndex = Date.now(); // Jedinstveni indeks
    newReward.classList.add("input-container");
    newReward.innerHTML = `
<input class="main-form__input" id="rewards${newIndex}" type="text" name="rewards" placeholder="Nagrada" required>
<input class="main-form__input" id="images${newIndex}" type="text" name="images" placeholder="Slika" required>
<button type="button" class="btn btn-danger removeReward" data-index="${newIndex}">Izbacite</button>
`;
    rewardsContainer.appendChild(newReward);

    // Event listener for remove button
    newReward.querySelector('.removeReward').addEventListener('click', function() {
        newReward.remove();  // Remove the entire container
    });
});