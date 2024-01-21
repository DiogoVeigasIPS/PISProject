/**
 * Filename: auxRecipes
 * Purpose: To fetch the add, edit and delete from the recipeActions and ask if the user is sure about the deletion
 */

const openRecipeDetailsModal = async (id) => {
    try {
        const response = await fetch(`http://localhost:8081/api/recipe/${id}`);

        if (response.ok) {
            const responseData = await response.json();

            const recipeId = document.getElementById('recipeId');
            const recipeName = document.getElementById('recipeName');
            const recipeCategory = document.getElementById('recipeCategory');
            const recipeDescription = document.getElementById('recipeDescription');
            const recipePreparation = document.getElementById('recipePreparation');
            const recipeArea = document.getElementById('recipeArea');
            const recipeAuthor = document.getElementById('recipeAuthor');
            const recipeImage = document.getElementById('recipeImage');
            const recipeIngredientsList = document.getElementById('recipeIngredientsList');
            const recipeImageURL = document.getElementById('recipeImageURL');
            const recipeDifficulty = document.getElementById('recipeDifficulty');
            const recipeCost = document.getElementById('recipeCost');

            recipeId.innerText = responseData.id;
            recipeName.innerText = responseData.name;
            recipeCategory.innerText = responseData.category.name;
            recipeDifficulty.innerText = responseData.difficulty.name ?? 'Not provided';
            recipeDescription.innerText = responseData.description ?? 'Not provided';
            recipePreparation.innerText = responseData.preparationDescription ?? 'Not provided';
            recipeArea.innerText = responseData.area.name;
            recipeAuthor.innerText = responseData.author.username;
            recipeCost.innerText = responseData.cost ?? 'Not provided';


            // Clear previous ingredients
            recipeIngredientsList.innerHTML = '';

            // Populate ingredients list
            responseData.ingredients.forEach((ingredient) => {
                // Create a column for each ingredient
                const ingredientColumn = document.createElement('div');
                ingredientColumn.className = 'col-md-4 mb-3';

                // Create ingredient div
                const ingredientDiv = document.createElement('div');
                ingredientDiv.className = 'list-group-item';

                // Create row for each ingredient
                const ingredientRow = document.createElement('div');
                ingredientRow.className = 'row align-items-center border';

                // Create column for ingredient image
                const imageColumn = document.createElement('div');
                imageColumn.className = 'col-md-4';

                // Create ingredient image
                const ingredientImage = document.createElement('img');
                ingredientImage.src = ingredient.ingredient.image;
                ingredientImage.alt = ingredient.ingredient.name + ' Image';
                ingredientImage.className = 'img-fluid';

                // Append image to column
                imageColumn.appendChild(ingredientImage);

                // Create column for ingredient details
                const detailsColumn = document.createElement('div');
                detailsColumn.className = 'col-md-8';

                // Create strong element for ingredient name
                const ingredientName = document.createElement('strong');
                ingredientName.innerText = ingredient.ingredient.name;

                // Create paragraph element for ingredient quantity
                const ingredientQuantity = document.createElement('p');
                ingredientQuantity.innerText = ingredient.quantity;

                // Append name and quantity to details column
                detailsColumn.appendChild(ingredientName);
                detailsColumn.appendChild(ingredientQuantity);

                // Append columns to ingredient row
                ingredientRow.appendChild(imageColumn);
                ingredientRow.appendChild(detailsColumn);

                // Append ingredient row to ingredient div
                ingredientDiv.appendChild(ingredientRow);

                // Append ingredient div to ingredient column
                ingredientColumn.appendChild(ingredientDiv);

                // Append ingredient column to the ingredient list row
                recipeIngredientsList.appendChild(ingredientColumn);
            });
            recipeImageURL.innerText = responseData.image;
            recipeImage.src = responseData.image;

            const recipeDetailsModal = new bootstrap.Modal(document.getElementById('recipeDetailsModal'));
            recipeDetailsModal.show();

        }

    } catch (err) {
        console.error(err);
    }
}

function getSelectedIngredients() {
    const ingredients = [];

    const quantities = document.getElementsByName('quantities[]');
    const ingredientIds = document.getElementsByName('ingredientIds[]');

    for (let i = 0; i < quantities.length; i++) {
        ingredients.push({
            ingredient: { id: ingredientIds[i].value },
            quantity: quantities[i].value
        });
    }

    return ingredients;
}

const openAddRecipeModal = async () => {
    const recipeDetails = new bootstrap.Modal(document.getElementById('recipeFormModal'));

    const recipeNameForm = document.getElementById('recipeNameForm');
    const recipeCategoryForm = document.getElementById('recipeCategoryForm');
    const recipeAreaForm = document.getElementById('recipeAreaForm');
    const recipePreparationTimeForm = document.getElementById('recipePreparationTimeForm');
    const recipeDifficultyForm = document.getElementById('recipeDifficultyForm');
    const recipeCostForm = document.getElementById('recipeCostForm');
    const imageInputForm = document.getElementById('image');
    const recipeDescriptionForm = document.getElementById('recipeDescriptionForm');
    const recipePreparationDescriptionForm = document.getElementById('recipePreparationDescription');

    const selectedIngredients = document.querySelector('#selectedIngredients');
    selectedIngredients.innerHTML = "";

    recipeNameForm.value = recipePreparationTimeForm.value = recipeCostForm.value = imageInputForm.value = recipeDescriptionForm.value = recipePreparationDescriptionForm.value = "";
    recipeCategoryForm.selectedIndex = recipeAreaForm.selectedIndex = recipeDifficultyForm.selectedIndex = 0;

    const submitRecipeButton = document.getElementById('submitRecipeButton');
    submitRecipeButton.innerText = 'Add Recipe';
    const activityTitle = document.getElementById('activityTitle');
    activityTitle.innerText = 'Add a Recipe';

    const recipeForm = document.querySelector('#recipeForm');
    recipeForm.onsubmit = async (e) => {
        e.preventDefault();

        // Ingredient manipulation
        const ingredients = getSelectedIngredients();

        const recipe = {
            name: recipeNameForm.value,
            category: { id: recipeCategoryForm.value },
            description: recipeDescriptionForm.value,
            preparationDescription: recipePreparationDescriptionForm.value,
            area: { id: recipeAreaForm.value },
            author: { id: window.userId },
            image: imageInputForm.value,
            preparationTime: recipePreparationTimeForm.value,
            difficulty: { id: recipeDifficultyForm.value, name: null },
            cost: recipeCostForm.value,
            ingredients: ingredients
        };

        const options = {
            method: "POST",
            body: JSON.stringify(recipe),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch("http://localhost:8081/api/recipe", options);

            const errorDiv = recipeForm.querySelector('#recipeError');

            if (response.ok) {
                const responseData = await response.json();
                errorDiv.classList.add('d-none');
                // Create a new table row using JavaScript
                const newRecipeRow = document.createElement('tr');

                // Customize this according to your recipe table structure
                newRecipeRow.innerHTML = `
                    <td class="text-center align-middle">${responseData.id}</td>
                    <td class="text-center align-middle text-truncate maxNameSize" 
                        data-toggle="tooltip" title="${responseData.name}">${responseData.name}</td>
                    <td class="text-center align-middle">
                        <img src="${responseData.image}" alt="Recipe Image" class="img-thumbnail" style="max-width: 100px;">
                    </td>
                    <td class="text-center align-middle">${responseData.category.name}</td>
                    <td class="text-center align-middle">${responseData.area.name}</td>
                    <td class="text-center align-middle">${responseData.author.username}</td>
                    <td class="text-center align-middle">${responseData.difficulty.name}</td>
                    <td class="text-center align-middle">
                        <a href="javascript:openRecipeDetailsModal(${responseData.id});" class="mr-2"><i class="bi bi-eye-fill h3"></i></a>
                        <a href="javascript:openEditRecipeModal(${responseData.id})" class="mr-2"><i class="bi bi-pencil-fill text-warning h3"></i></a>
                        <a href="javascript:openDeleteModal('${responseData.id}', '${responseData.name}')" class="mr-2">
                            <i class="bi bi-trash3 text-danger h3"></i>
                        </a>
                    </td>
                `;

                // Append the new row to the table
                const tbody = document.querySelector('#recipesTable tbody');
                tbody.appendChild(newRecipeRow);

                recipeDetails.hide();
                showToast("Recipe added successfully!");
            } else {
                const responseData = await response.text();
                errorDiv.classList.remove('d-none');
                errorDiv.innerHTML = responseData;
            }

        } catch (error) {
            console.error("Error during recipe addition:", error);
        }
    };

    recipeDetails.show();
}

const openEditRecipeModal = async (id, inDetailsPage = false) => {
    const recipeDetails = new bootstrap.Modal(document.getElementById('recipeFormModal'));

    // Retrieve the necessary form elements
    const recipeNameForm = document.getElementById('recipeNameForm');
    const recipeCategoryForm = document.getElementById('recipeCategoryForm');
    const recipeAreaForm = document.getElementById('recipeAreaForm');
    const recipePreparationTimeForm = document.getElementById('recipePreparationTimeForm');
    const recipeDifficultyForm = document.getElementById('recipeDifficultyForm');
    const recipeCostForm = document.getElementById('recipeCostForm');
    const imageInputForm = document.getElementById('image');
    const recipeDescriptionForm = document.getElementById('recipeDescriptionForm');
    const recipePreparationDescriptionForm = document.getElementById('recipePreparationDescription');

    // Additional elements for ingredient manipulation
    const selectedIngredients = document.querySelector('#selectedIngredients');
    selectedIngredients.innerHTML = "";

    // Set the activity title
    const activityTitle = document.getElementById('activityTitle');
    activityTitle.innerText = 'Edit Recipe';

    var author;
    try {
        // Fetch recipe details using the provided recipe id
        const response = await fetch(`http://localhost:8081/api/recipe/${id}`);

        if (response.ok) {
            const responseData = await response.json();

            // Populate the form with existing recipe details
            recipeNameForm.value = responseData.name;
            recipeCategoryForm.value = responseData.category.id;
            recipeAreaForm.value = responseData.area.id;
            recipePreparationTimeForm.value = responseData.preparationTime;
            recipeDifficultyForm.value = responseData.difficulty.id;
            recipeCostForm.value = responseData.cost;
            imageInputForm.value = responseData.image;
            recipeDescriptionForm.value = responseData.description;
            recipePreparationDescriptionForm.value = responseData.preparationDescription;
            author = responseData.author;

            // Populate the selected ingredients section
            responseData.ingredients.forEach((element) => {
                addSelectedIngredient(element.ingredient, element.quantity);
            });
        }
    } catch (err) {
        console.error(err);
    }

    // Set up the form submission for recipe editing
    const submitRecipeButton = document.getElementById('submitRecipeButton');
    submitRecipeButton.innerText = 'Edit Recipe';

    const recipeForm = document.querySelector('#recipeForm');
    recipeForm.onsubmit = async (e) => {
        e.preventDefault();

        // Similar to the add recipe functionality, construct the recipe object
        // based on the form values, including any changes made during editing

        const recipe = {
            name: recipeNameForm.value,
            category: { id: recipeCategoryForm.value },
            description: recipeDescriptionForm.value,
            preparationDescription: recipePreparationDescriptionForm.value,
            area: { id: recipeAreaForm.value },
            image: imageInputForm.value,
            preparationTime: recipePreparationTimeForm.value,
            difficulty: { id: recipeDifficultyForm.value, name: null },
            cost: recipeCostForm.value,
            ingredients: getSelectedIngredients(),
            author
        };

        const options = {
            method: "PUT",
            body: JSON.stringify(recipe),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            // Make a PUT request to update the recipe
            const response = await fetch(`http://localhost:8081/api/recipe/${id}`, options);

            const errorDiv = recipeForm.querySelector('#recipeError');

            if (response.ok) {
                const responseData = await response.json();
                errorDiv.classList.add('d-none');

                if (!inDetailsPage) {
                    // Update the existing row in the table with the edited recipe details
                    const trs = [...document.querySelectorAll('#recipesTable tbody tr')];
                    const tr = trs.find(row => {
                        const idColumn = row.querySelector('td');
                        return idColumn.innerText.trim() == id;
                    });

                    const columns = tr.querySelectorAll('td');
                    columns[1].innerText = responseData.name;
                    columns[2].src = responseData.image;
                    columns[3].innerText = responseData.category.name;
                    columns[4].innerText = responseData.area.name;
                    columns[5].innerText = responseData.author.username;
                    columns[6].innerText = responseData.difficulty.name;
                    // Update other columns as needed
                }else{
                    // Get the ids and change the DOM from the details page
                }

                recipeDetails.hide();
                showToast(`${responseData.name} edited successfully!`);
            } else {
                const responseData = await response.text();
                errorDiv.classList.remove('d-none');
                errorDiv.innerHTML = responseData;
            }
        } catch (error) {
            console.error("Error during recipe edition:", error);
        }
    };

    // Show the recipe edit modal
    recipeDetails.show();
}

const openDeleteModal = (id, name) => {
    const deleteModalName = document.getElementById('deleteModalName');
    deleteModalName.innerText = name;

    const confirmDeletion = document.getElementById('confirmDeletion');

    confirmDeletion.onclick = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/recipe/${id}`, { method: "DELETE" })
            const responseText = await response.text();

            if (response.status != 200) {
                showToast(responseText, true)
                return;
            }

            const recipesTable = document.getElementById('recipesTable');
            const rows = Array.from(recipesTable.querySelectorAll('tbody tr'));

            const filteredRows = rows.filter(row => {
                const tdValue = row.querySelector('td').textContent.trim();
                return tdValue === id;
            });
            recipesTable.querySelector('tbody').removeChild(filteredRows[0]);

            showToast(responseText, false)
        } catch (err) {
            console.error(err)
        }
    }

    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

const updateSearchBar = () => {
    const searchInput = document.getElementById('searchInput');

    const urlSearchParams = new URLSearchParams(window.location.search);
    const nameParam = urlSearchParams.get('name');

    searchInput.value = nameParam || '';
}

const showToast = (message, isError = false) => {
    const toast = document.getElementById('toast');
    const bootstrapToast = bootstrap.Toast.getOrCreateInstance(toast);

    const toastBody = document.getElementById('toastBody');
    toastBody.innerText = message;

    if (!isError) {
        if (toastBody.classList.contains('text-danger')) {
            toastBody.classList.remove('text-danger')
        }
        toastBody.classList.add('text-success');
    } else {
        if (toastBody.classList.contains('text-success')) {
            toastBody.classList.remove('text-success')
        }
        toastBody.classList.add('text-danger');
    }

    bootstrapToast.show();
}

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const formSearch = document.getElementById('formSearch');

    const idSort = document.getElementById('idSort');
    const nameSort = document.getElementById('nameSort');
    const categorySort = document.getElementById('categorySort');
    const areaSort = document.getElementById('areaSort');
    const authorSort = document.getElementById('authorSort');
    const difficultySort = document.getElementById('difficultySort');

    formSearch?.addEventListener('submit', function (e) {
        e.preventDefault();
        filterTable(searchInput.value);
    });

    searchInput?.addEventListener('input', function () {
        filterTable(searchInput.value);
    });

    if (idSort != null)
        idSort.onclick = () => {
            filterTable(searchInput.value, "");
        }

    if (nameSort != null)
        nameSort.onclick = () => {
            filterTable(searchInput.value, 'name');
        }
    if (categorySort != null)
        categorySort.onclick = () => {
            filterTable(searchInput.value, 'category');
        }
    if (areaSort != null)
        areaSort.onclick = () => {
            filterTable(searchInput.value, 'area');
        }
    if (authorSort != null)
        authorSort.onclick = () => {
            filterTable(searchInput.value, 'author');
        }
    if (difficultySort != null)
        difficultySort.onclick = () => {
            filterTable(searchInput.value, 'difficulty')
        }
    const filterTable = async (stringSearch, order = "") => {

        const searchParams = new URLSearchParams(window.location.search);

        if (stringSearch.trim() !== "") {
            searchParams.set('name', stringSearch);
        } else {
            searchParams.delete('name');
        }

        if (order?.trim() !== "") {
            searchParams.set('order', order);
        } else {
            searchParams.delete('order');
        }
        const newURL = `${window.location.pathname}?${searchParams.toString()}`;
        history.pushState(null, '', newURL);

        try {
            const url = !order ? `http://localhost:8081/api/recipe?name=${stringSearch}` :
                `http://localhost:8081/api/recipe?name=${stringSearch}&order=${order}`;

            const response = await fetch(url);

            if (response.ok) {
                const responseData = await response.json();

                const tbody = document.querySelector('#recipesTable tbody')
                tbody.innerHTML = "";
                responseData.forEach(r => {
                    const newRecipeRow = document.createElement('tr');
                    newRecipeRow.innerHTML = `
                    <td class="text-center align-middle">${r.id}</td>
                    <td class="text-center align-middle text-truncate maxNameSize"
                        data-toggle="tooltip" title="${r.name}">${r.name}</td>
                    <td class="text-center align-middle">
                        <img src="${r.image}" alt="Recipe Image" class="img-thumbnail" style="max-width: 100px;">
                    </td>
                    <td class="text-center align-middle">${r.category.name}</td>
                    <td class="text-center align-middle">${r.area.name}</td>
                    <td class="text-center align-middle">${r.author.username}</td>
                    <td class="text-center align-middle">${r.difficulty.name ?? 'Not provided'}</td>
                    <td class="text-center align-middle">
                        <a href="javascript:openRecipeDetailsModal(${r.id});" class="mr-2"><i class="bi bi-eye-fill h3"></i></a>
                        <a href="javascript:openEditRecipeModal(${r.id})" class="mr-2"><i class="bi bi-pencil-fill text-warning h3"></i></a>
                        <a href="javascript:openDeleteModal('${r.id}', '${r.name}')" class="mr-2">
                            <i class="bi bi-trash3 text-danger h3"></i>
                        </a>
                    </td>
                `;
                    tbody.appendChild(newRecipeRow);
                })
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Function to copy the link to the clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(function () {
                showToast('Link copied to clipboard!');
            })
            .catch(function (err) {
                console.error('Unable to copy text to clipboard', err);
            });
    }

    // Event listener for the copy link button
    document.getElementById('copyLink')?.addEventListener('click', function () {
        var recipeId = document.getElementById('recipeId').innerText;
        var link = `http://localhost:8081/admin/recipe/${recipeId}`;

        copyToClipboard(link);

        showToast('Link copied to clipboard!');
    });
});
