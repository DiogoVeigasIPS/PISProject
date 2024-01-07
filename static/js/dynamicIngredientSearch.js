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

    const addSelectedIngredient = (ingredient) => {
        // Add the ingredient name to the set
        selectedIngredientNames.add(ingredient.name);
    
        // Create a new table row for the selected ingredient
        const row = selectedIngredientsTable.insertRow();
    
        // Add a cell with the image
        const cellImage = row.insertCell(0);
        const ingredientImage = document.createElement('img');
        ingredientImage.src = `https://www.themealdb.com/images/ingredients/${ingredient.name}.png`;
        ingredientImage.alt = ingredient.name;
        ingredientImage.style.width = '5rem';
        cellImage.appendChild(ingredientImage);
    
        // Add a cell with the ingredient name
        const cellName = row.insertCell(1);
        cellName.textContent = ingredient.name;
        cellName.classList.add('align-middle'); // Bootstrap class to vertically align
    
        // Add a cell with the input for quantity
        const cellQuantity = row.insertCell(2);
        cellQuantity.classList.add('align-middle');
        const quantityInput = document.createElement('input');
        quantityInput.type = 'text';
        quantityInput.name = 'quantities[]'; // Add the name attribute
        quantityInput.placeholder = 'Enter the quantity';
        quantityInput.required = true; // Make the quantity input required
        quantityInput.classList.add('form-control'); // Bootstrap classes
        cellQuantity.appendChild(quantityInput);
    
        // Add a cell with the remove button
        const cellRemove = row.insertCell(3);
        cellRemove.classList.add('align-middle');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('btn', 'btn-danger', 'align-middle'); // Bootstrap classes
        removeButton.addEventListener('click', function () {
            // Remove the ingredient name from the set
            selectedIngredientNames.delete(ingredient.name);
            selectedIngredientsTable.deleteRow(row.rowIndex);
        });
        cellRemove.appendChild(removeButton);
    };

    // Close suggestions when clicking outside the input and suggestions
    document.addEventListener('click', function (event) {
        if (!event.target.matches('#ingredients') && !event.target.matches('#ingredientSuggestions *')) {
            ingredientSuggestions.innerHTML = '';
        }
    });
});
