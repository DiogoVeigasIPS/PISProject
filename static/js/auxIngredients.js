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