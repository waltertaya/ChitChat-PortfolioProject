const editProfileEl = document.querySelector('.edit-profile');
const profileHeader = document.querySelector('.profile-header');

profileHeader.addEventListener('click', (e) => {
    if (e.target.closest('.edit-profile-btn')) {
        console.log('Clicked');
        editProfileEl.style.display = 'block';

        const closeWindowListener = (e) => {
            if (!editProfileEl.contains(e.target) && !e.target.closest('.edit-profile-btn')) {
                editProfileEl.style.display = 'none';
                document.removeEventListener('click', closeWindowListener);
            }
        };

        document.addEventListener('click', closeWindowListener);
    }
});
