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

document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('imagePreview');

    imageInput.addEventListener('input', () => {
        const imageUrl = imageInput.value.trim();
        imagePreview.src = imageUrl;
    });    
});

const ingredientForm = document.querySelector('#ingredientForm');
ingredientForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = ingredientForm.querySelector('input[name="name"]').value;
    const description = ingredientForm.querySelector('textarea[name="description"]').value;
    const image = ingredientForm.querySelector('input[name="image"]').value;

    const options = {
        method: "POST",
        body: JSON.stringify({ name, description, image}),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        console.log("Before fetch");
        const response = await fetch("http://localhost:8081/admin/ingredient/create/", options);
        console.log("After fetch");

        let responseData = null;
        const errorDiv = ingredientForm.querySelector('#ingredientError');

        if (response.headers.get("content-type") !== "application/json; charset=utf-8") {
            // Show error
            errorDiv.innerHTML = await response.text();
            errorDiv.classList.remove('d-none');
            console.log("if")
        } else {
            // Ingredient added
            errorDiv.classList.add('d-none');
            responseData = await response.json();
            console.log("else");
            console.log(responseData);
            if (responseData && responseData.statusCode === 200) {
                console.log("extra if")
                location.href = "http://localhost:8081/admin/ingredients";
            }        
        }
    } catch (error) {
        console.error("Error during ingredient addition:", error);
    }
});