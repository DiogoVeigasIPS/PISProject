document.addEventListener('DOMContentLoaded', function () {
    const ingredientsInput = document.getElementById('ingredients');
    const ingredientSuggestions = document.getElementById('ingredientSuggestions');
    const selectedIngredientsTable = document.getElementById('selectedIngredients');
    const selectedIngredientNames = new Set(); // Set to store selected ingredient names

    ingredientsInput.addEventListener('input', function () {
        const inputText = this.value.trim();

        // Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();

        // Set up the request
        xhr.open('GET', `http://localhost:8081/api/ingredient?name=${inputText}&max=8`, true);

        // Set up the callback function
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                updateSuggestions(data);
            }
        };

        // Send the request
        xhr.send();
    });

    const updateSuggestions = (suggestions) => {
        // Clear previous suggestions
        ingredientSuggestions.innerHTML = '';

        // Filter out suggestions that are already selected
        const filteredSuggestions = suggestions.filter(suggestion => !selectedIngredientNames.has(suggestion.name));

        // Display new suggestions
        filteredSuggestions.forEach(suggestion => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-group-item');
            listItem.style.cursor = 'pointer'; // Set cursor to pointer
            listItem.textContent = suggestion.name;

            // Add a click event listener to add the clicked ingredient to the input
            listItem.addEventListener('click', function () {
                ingredientsInput.value = '';
                addSelectedIngredient(suggestion);
                ingredientSuggestions.innerHTML = ''; // Clear suggestions after selecting
            });

            ingredientSuggestions.appendChild(listItem);
        });
    }

    const addSelectedIngredient = (suggestion) => {
        // Add the ingredient name to the set
        selectedIngredientNames.add(suggestion.name);

        // Create a new table row for the selected ingredient
        const row = selectedIngredientsTable.insertRow();

        // Add a cell with the hidden input for ingredient ID
        const cellId = row.insertCell(0);
        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.name = 'ingredientIds[]';
        idInput.value = suggestion.id; // Assuming that 'id' is the property holding the ingredient ID
        cellId.appendChild(idInput);

        // Add a cell with the ingredient name
        const cellName = row.insertCell(1);
        cellName.textContent = suggestion.name;
        cellName.style.cursor = 'pointer'; // Set cursor to pointer

        // Add a cell with the input for quantity
        const cellQuantity = row.insertCell(2);
        const quantityInput = document.createElement('input');
        quantityInput.type = 'text';
        quantityInput.name = 'quantities[]'; // Add the name attribute
        quantityInput.placeholder = 'Enter the quantity';
        quantityInput.required = true; // Make the quantity input required
        quantityInput.style.cursor = 'pointer'; // Set cursor to pointer
        cellQuantity.appendChild(quantityInput);

        // Add a cell with the remove button
        const cellRemove = row.insertCell(3);
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.style.cursor = 'pointer'; // Set cursor to pointer
        removeButton.addEventListener('click', function () {
            // Remove the ingredient name from the set
            selectedIngredientNames.delete(suggestion.name);
            selectedIngredientsTable.deleteRow(row.rowIndex);
        });
        cellRemove.appendChild(removeButton);
    }

    // Close suggestions when clicking outside the input and suggestions
    document.addEventListener('click', function (event) {
        if (!event.target.matches('#ingredients') && !event.target.matches('#ingredientSuggestions *')) {
            ingredientSuggestions.innerHTML = '';
        }
    });
});
