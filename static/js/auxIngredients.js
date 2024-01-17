/**
 * Filename: auxIngredients
 * Purpose: To fetch the add, edit and delete from the ingredientActions and ask if the user is sure about the deletion
 */

const backDeleteIngredient = async (id) => {
    try {
        const confirmed = confirm("Are you sure you want to delete this ingredient?");
        if (!confirmed) {
            return;
        }

        // Use fetch to send a DELETE request to your existing API endpoint
        const response = await fetch(`/admin/ingredient/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            // Successful deletion
            console.log("Ingredient deleted successfully.");
            location.reload();
        } else {
            // Handle errors
            console.error("Failed to delete ingredient.");
        }
    } catch (error) {
        console.error(error);
    }
}

const ingredientForm = document.querySelector('#ingredientForm');
if (ingredientForm) {
    ingredientForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = ingredientForm.querySelector('input[name="name"]').value;
        const description = ingredientForm.querySelector('textarea[name="description"]').value;
        const image = ingredientForm.querySelector('input[name="image"]').value;

        const options = {
            method: "POST",
            body: JSON.stringify({ name, description, image }),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch("http://localhost:8081/admin/ingredient/create/", options);

            let responseData = null;
            const errorDiv = ingredientForm.querySelector('#ingredientError');

            responseData = await response.json();

            if (responseData?.statusCode === 200) {
                errorDiv.classList.add('d-none');
                location.href = "http://localhost:8081/admin/ingredients";
            } else {
                errorDiv.classList.remove('d-none');
                errorDiv.innerHTML = responseData.responseMessage;
            }

        } catch (error) {
            console.error("Error during ingredient addition:", error);
        }
    });
}

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

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const formSearch = document.getElementById('formSearch');

    formSearch.addEventListener('submit', function (e) {
        e.preventDefault();
        filterTable();
    });

    searchInput.addEventListener('input', function () {
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
            const newURL = currentURL.split('?')[0] + `?name=${encodeURIComponent(filter)}`;
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
});


