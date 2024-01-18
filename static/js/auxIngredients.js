/**
 * Filename: auxIngredients
 * Purpose: To fetch the add, edit and delete from the ingredientActions and ask if the user is sure about the deletion
 */

const openIngredientDetailsModal = async (id) => {
    try {
        const response = await fetch(`http://localhost:8081/api/ingredient/${id}`);

        if (response.ok) {
            const responseData = await response.json();

            const ingredientId = document.getElementById('ingredientId');
            const ingredientName = document.getElementById('ingredientName');
            const ingredientDescription = document.getElementById('ingredientDescription');
            const ingredientImageURL = document.getElementById('ingredientImageURL');
            const ingredientImage = document.getElementById('ingredientImage');

            ingredientId.innerText = responseData.id;
            ingredientName.innerText = responseData.name;
            ingredientDescription.innerText = responseData.description ?? 'Not provided';
            ingredientImageURL.innerText = responseData.image;

            ingredientImage.src = responseData.image;

            const ingredientDetails = new bootstrap.Modal(document.getElementById('ingredientDetailsModal'));
            ingredientDetails.show();
        }

    } catch (err) {
        console.error(err)
    }
}

const openAddIngredientModal = async () => {
    const ingredientNameForm = document.getElementById('ingredientNameForm');
    const ingredientDescriptionForm = document.getElementById('ingredientDescriptionForm');
    const ingredientImageInputForm = document.getElementById('ingredientImageInputForm');
    const imagePreview = document.getElementById('imagePreview');

    ingredientNameForm.value = ingredientDescriptionForm.value = ingredientImageInputForm.value = imagePreview.src = "";

    const submitIngredientButton = document.getElementById('submitIngredientButton');
    submitIngredientButton.innerText = 'Add Ingredient';

    const activityTitle = document.getElementById('activityTitle');
    activityTitle.innerText = 'Add an ingredient';

    const ingredientForm = document.querySelector('#ingredientForm');
    ingredientForm.onsubmit = async (e) => {
        e.preventDefault();

        const name = ingredientNameForm.value;
        const description = ingredientDescriptionForm.value;
        const image = ingredientImageInputForm.value;

        const options = {
            method: "POST",
            body: JSON.stringify({ name, description, image }),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch("http://localhost:8081/api/ingredient", options);
            
            const errorDiv = ingredientForm.querySelector('#ingredientError');

            if (response.ok) {
                const responseData = await response.json();
                errorDiv.classList.add('d-none');
                // Add through DOM
                location.href = "http://localhost:8081/admin/ingredients";
            } else {
                const responseData = await response.text();
                errorDiv.classList.remove('d-none');
                errorDiv.innerHTML = responseData;
            }

        } catch (error) {
            console.error("Error during ingredient addition:", error);
        }
    };

    const ingredientDetails = new bootstrap.Modal(document.getElementById('ingredientFormModal'));
    ingredientDetails.show();
}

const openEditIngredientModal = async (id) => {
    const ingredientNameForm = document.getElementById('ingredientNameForm');
    const ingredientDescriptionForm = document.getElementById('ingredientDescriptionForm');
    const ingredientImageInputForm = document.getElementById('ingredientImageInputForm');
    const imagePreview = document.getElementById('imagePreview');

    const activityTitle = document.getElementById('activityTitle');

    try {
        const response = await fetch(`http://localhost:8081/api/ingredient/${id}`);
        if (response.ok) {
            const responseData = await response.json();
            activityTitle.innerHTML = `Edit <strong>${responseData.name}</strong>`;
            ingredientNameForm.value = responseData.name;
            ingredientDescriptionForm.value = responseData.description;
            ingredientImageInputForm.value = responseData.image;
            imagePreview.src = responseData.image;
        }
    } catch (err) {
        console.error(err)
    }

    const submitIngredientButton = document.getElementById('submitIngredientButton');
    submitIngredientButton.innerText = 'Edit Ingredient';

    const ingredientForm = document.querySelector('#ingredientForm');
    ingredientForm.onsubmit = async (e) => {
        e.preventDefault();

        const name = ingredientNameForm.value;
        const description = ingredientDescriptionForm.value;
        const image = ingredientImageInputForm.value;

        const options = {
            method: "PUT",
            body: JSON.stringify({ name, description, image }),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(`http://localhost:8081/api/ingredient/${id}`, options);

            const errorDiv = ingredientForm.querySelector('#ingredientError');

            if (response.ok) {
                const responseData = await response.json();
                errorDiv.classList.add('d-none');
                location.href = "http://localhost:8081/admin/ingredients";
            } else {
                const responseData = await response.text();
                errorDiv.classList.remove('d-none');
                errorDiv.innerHTML = responseData;
            }

        } catch (error) {
            console.error("Error during ingredient addition:", error);
        }
    };

    const ingredientDetails = new bootstrap.Modal(document.getElementById('ingredientFormModal'));
    ingredientDetails.show();
}

const openDeleteModal = (id, name) => {
    const deleteModalName = document.getElementById('deleteModalName');
    deleteModalName.innerText = name;

    const confirmDeletion = document.getElementById('confirmDeletion');

    confirmDeletion.onclick = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/ingredient/${id}`, { method: "DELETE" })
            const responseText = await response.text();

            if (response.status != 200) {
                showToast(responseText, true)
                return;
            }

            const ingredientsTable = document.getElementById('ingredientsTable');
            const rows = Array.from(ingredientsTable.querySelectorAll('tbody tr'));

            const filteredRows = rows.filter(row => {
                const tdValue = row.querySelector('td').textContent.trim();
                return tdValue === id;
            });
            ingredientsTable.querySelector('tbody').removeChild(filteredRows[0]);

            showToast(responseText, false)
        } catch (err) {
            console.error(err)
        }
    }

    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
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

function addSortQueryParam(sortBy) {
    const currentURL = window.location.href;
    const separator = currentURL.includes('?') ? '&' : '?';

    const sortParam = `sort=${encodeURIComponent(sortBy)}`;

    const newURL = currentURL.includes('sort=') ?
        currentURL.replace(/(sort=)[^&]*/, `$1${encodeURIComponent(sortBy)}`) :
        currentURL + `${separator}${sortParam}`;

    history.pushState({ path: newURL }, '', newURL);
    location.reload();
}

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const formSearch = document.getElementById('formSearch');

    formSearch?.addEventListener('submit', function (e) {
        e.preventDefault();
        filterTable();
    });

    searchInput?.addEventListener('input', function () {
        filterTable();
    });

    function filterTable() {
        const filter = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('#ingredientsTable tbody tr');

        rows.forEach(function (row) {
            const columns = row.getElementsByTagName('td');
            let shouldHide = true;

            for (let i = 0; i < columns.length; i++) {
                const columnText = columns[i].textContent.toLowerCase();
                if (columnText.includes(filter)) {
                    shouldHide = false;
                    break;
                }
            }

            row.style.display = shouldHide ? 'none' : '';
        });

        // Update the URL if the search input is not empty
        if (filter !== '') {
            const currentURL = window.location.href;
            const separator = currentURL.includes('?') ? '&' : '?';
            const newURL = currentURL.split(separator)[0] + `${separator}name=${encodeURIComponent(filter)}`;
            history.pushState({ path: newURL }, '', newURL);
        } else {
            const currentURL = window.location.href;
            const separator = currentURL.includes('?') ? '&' : '';
            const newURL = currentURL.split(separator)[0];
            history.pushState({ path: newURL }, '', newURL);
        }
    }

    // Initialize the search input with the value from the URL parameter
    const urlSearchParams = new URLSearchParams(window.location.search);
    const nameParam = urlSearchParams.get('name');
    if (nameParam !== null) {
        searchInput.value = decodeURIComponent(nameParam);
        filterTable();
    }

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
    document.getElementById('copyLink').addEventListener('click', function () {
        var ingredientId = document.getElementById('ingredientId').innerText;
        var link = `http://localhost:8081/admin/ingredient/details/${ingredientId}`;

        copyToClipboard(link);

        showToast('Link copied to clipboard!');
    });
});


