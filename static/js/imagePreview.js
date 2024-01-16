const imagePreview = (input, image) => {
    const imageInput = document.getElementById(input);
    const imagePreview = document.getElementById(image);

    if (imageInput) {
        imageInput.addEventListener('input', () => {
            const imageUrl = imageInput.value.trim();
            imagePreview.src = imageUrl;
        });
    }

    if(imagePreview){
        imagePreview.onload = function() {
            imagePreview.classList.remove('d-none');
        };
        
        imagePreview.onerror = function() {
            imagePreview.classList.add('d-none');
        };
    }
}