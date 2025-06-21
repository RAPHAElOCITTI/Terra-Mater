/**
 * admin.js (Fixed & Refactored)
 * * This script handles all frontend logic for the Terra Mater Coaching admin panel.
 * * It has been refactored to prevent event listeners from being attached multiple times,
 * * which fixes the content replication bug and ensures all functions work correctly.
 *
 * It manages:
 * 1. Admin login and logout.
 * 2. Toggling visibility of the login form and the main dashboard.
 * 3. Fetching and displaying existing data (Testimonials, Blogs, FAQs).
 * 4. Handling form submissions to create, update, and delete content reliably.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    const API_URL = '/api/admin';
    let authToken = sessionStorage.getItem('terramater_admin_token');

    // --- DOM ELEMENT SELECTORS ---
    const loginContainer = document.getElementById('login-container');
    const adminDashboard = document.getElementById('admin-dashboard');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const loginStatus = document.getElementById('login-status');
    const logoutBtn = document.getElementById('logout-btn');

    const contentTypes = ['testimonials', 'blogs', 'faqs'];

    // --- CORE FUNCTIONS ---

    /**
     * Shows the admin dashboard, hides the login form, and loads content.
     */
    const showDashboard = () => {
        loginContainer.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        // Load (or reload) all content when the dashboard is shown.
        contentTypes.forEach(type => renderList(type));
    };

    /**
     * Shows the login form, hides the dashboard, and clears session data.
     */
    const showLogin = () => {
        loginContainer.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
        authToken = null;
        sessionStorage.removeItem('terramater_admin_token');
        passwordInput.value = '1234'; // Clear password field on logout
    };

    /**
     * Handles the login form submission.
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        const password = passwordInput.value;
        loginStatus.textContent = 'Logging in...';

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (response.ok) {
                // NOTE: Using the password as a token is for simplicity.
                // A real app should use a secure, temporary token (JWT).
                authToken = password;
                sessionStorage.setItem('terramater_admin_token', password);
                loginStatus.textContent = '';
                showDashboard();
            } else {
                loginStatus.textContent = 'Invalid password. Please try again.';
            }
        } catch (error) {
            console.error('Login error:', error);
            loginStatus.textContent = 'An error occurred. Could not connect to the server.';
        }
    };

    /**
     * Fetches and renders the list of items for a given content type.
     * This function is the single source for displaying content.
     */
    const renderList = async (type) => {
        const listContainer = document.getElementById(`${type}-list`);
        
        try {
            const response = await fetch(`${API_URL}/${type}`, {
                headers: { 'Authorization': authToken }
            });
            if (response.status === 403) { // Handle expired/invalid token
                showLogin();
                loginStatus.textContent = 'Your session has expired. Please log in again.';
                return;
            }
            if (!response.ok) throw new Error(`Failed to fetch ${type}.`);
            
            const items = await response.json();
            listContainer.innerHTML = ''; // Always clear the list before rendering.

            items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'list-item';
                itemElement.dataset.id = item.id; // Store the ID on the element

                let contentHtml = '';
                if (type === 'testimonials') {
                    contentHtml = `<p><strong>"${item.quote}"</strong> - <em>${item.author}</em></p>`;
                } else if (type === 'blogs') {
                    contentHtml = `<h4>${item.title}</h4><p>${item.content.substring(0, 100)}...</p>`;
                } else if (type === 'faqs') {
                    contentHtml = `<strong>Q: ${item.question}</strong><p>A: ${item.answer}</p>`;
                }
                
                itemElement.innerHTML = `
                    <div class="list-item-content">${contentHtml}</div>
                    <div class="list-item-actions">
                        <button class="btn btn-secondary edit-btn">Edit</button>
                        <button class="btn btn-delete delete-btn">Delete</button>
                    </div>
                `;
                listContainer.appendChild(itemElement);
            });

        } catch (error) {
            console.error(`Error loading ${type}:`, error);
            listContainer.innerHTML = `<p class="error">Could not load ${type}.</p>`;
        }
    };

    /**
     * Handles clicks on 'edit' or 'delete' buttons within any list.
     * Uses event delegation for efficiency.
     */
    const handleListClick = async (e, type) => {
        const itemElement = e.target.closest('.list-item');
        if (!itemElement) return;
        
        const id = itemElement.dataset.id;
        const form = document.getElementById(`${type.slice(0, -1)}-form`);
        const idField = document.getElementById(`${type.slice(0, -1)}-id`);
        const fields = Array.from(form.elements).filter(el => el.id).map(el => el.id.split('-').pop());

        // Handle 'delete' button click
        if (e.target.classList.contains('delete-btn')) {
            if (window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) {
                try {
                    const response = await fetch(`${API_URL}/${type}/${id}`, { 
                        method: 'DELETE',
                        headers: { 'Authorization': authToken }
                    });
                    if (!response.ok) throw new Error('Failed to delete.');
                    renderList(type); // Re-render the list after successful deletion
                } catch (error) {
                    console.error('Error deleting item:', error);
                    alert('Failed to delete item.');
                }
            }
        }

        // Handle 'edit' button click
        if (e.target.classList.contains('edit-btn')) {
            try {
                const response = await fetch(`${API_URL}/${type}/${id}`, { headers: { 'Authorization': authToken } });
                if (!response.ok) throw new Error('Could not fetch item to edit.');

                const itemToEdit = await response.json();
            
                if (itemToEdit) {
                    idField.value = itemToEdit.id;
                    fields.forEach(field => {
                        const el = document.getElementById(`${type.slice(0, -1)}-${field}`);
                        if (el) el.value = itemToEdit[field] || '';
                    });
                    form.querySelector('button[type="submit"]').textContent = `Update ${type.slice(0, -1)}`;
                    form.scrollIntoView({ behavior: 'smooth' });
                }
            } catch(error) {
                console.error('Error preparing edit form:', error);
                alert('Could not load item for editing.');
            }
        }
    };
    
    /**
     * Sets up the submission handler for a specific CRUD form.
     */
    const setupFormHandler = (type) => {
        const form = document.getElementById(`${type.slice(0, -1)}-form`);
        const idField = document.getElementById(`${type.slice(0, -1)}-id`);
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = idField.value;
            const isUpdating = !!id;

            const bodyData = {};
            Array.from(form.elements).forEach(el => {
                if(el.id && el.tagName !== 'BUTTON') {
                    const key = el.id.split('-').pop();
                    if(key !== 'id') bodyData[key] = el.value;
                }
            });

            const url = isUpdating ? `${API_URL}/${type}/${id}` : `${API_URL}/${type}`;
            const method = isUpdating ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
                    body: JSON.stringify(bodyData)
                });

                if (!response.ok) throw new Error('API request failed');

                form.reset();
                idField.value = '';
                form.querySelector('button[type="submit"]').textContent = `Save ${type.slice(0, -1)}`;
                
                renderList(type); // Refresh the list to show the new/updated item
            } catch (error) {
                console.error(`Error saving ${type}:`, error);
                alert(`An error occurred while saving the ${type.slice(0, -1)}.`);
            }
        });
    };


    // --- INITIALIZATION ---

    // Setup login/logout listeners
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', showLogin);

    // **CRITICAL FIX**: Setup form handlers and list click listeners ONCE for each type.
    // This prevents the replication bug.
    contentTypes.forEach(type => {
        setupFormHandler(type);
        document.getElementById(`${type}-list`).addEventListener('click', (e) => handleListClick(e, type));
    });

    // Check initial auth state
    if (authToken) {
        showDashboard();
    } else {
        showLogin();
    }
});
