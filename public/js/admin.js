// src/admin.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';


// ⚡ Replace with your actual values from Supabase dashboard
const supabaseUrl = "https://nwgopjqgwdbmbwzctads.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53Z29wanFnd2RibWJ3emN0YWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDAwMDcsImV4cCI6MjA2ODA3NjAwN30.cd57Ldr86E44SkY77UdhKxY891BD-fltAC2mgcAcH_c";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Global DOM elements (will be set when DOM is ready)
let loginContainer;
let adminDashboard;
let loginForm;
let emailInput;
let passwordInput;
let loginStatus;
let logoutBtn;



const contentTypes = ['testimonials', 'blogs', 'faqs', 'projects', 'data_entries'];


// --- CORE FUNCTIONS ---

/**
 * Checks the user's authentication state with Supabase.
 */
const checkAuth = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            showDashboard();
        } else {
            showLogin();
        }
    } catch (err) {
        console.error('Error checking auth:', err);
        showLogin();
    }
};

/**
 * Shows the admin dashboard and loads content.
 */
const showDashboard = () => {
    if (loginContainer && adminDashboard) {
        loginContainer.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        contentTypes.forEach(type => {
            renderList(type);
        });
    }
};

/**
 * Shows the login form and hides the dashboard.
 */
const showLogin = () => {
    if (loginContainer && adminDashboard) {
        loginContainer.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
        if (loginStatus) {
            loginStatus.textContent = '';
        }
    }
};

/**
 * Handles user login.
 */
const handleLogin = async (event) => {
    event.preventDefault();

    if (!emailInput || !passwordInput || !loginStatus) return;

    const email = emailInput.value;
    const password = passwordInput.value;

    loginStatus.textContent = 'Logging in...';

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        loginStatus.textContent = `Login failed: ${error.message}`;
        console.error('Login error:', error.message);
    } else {
        loginStatus.textContent = 'Login successful!';
        showDashboard();
    }
};

/**
 * Handles user logout.
 */
const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout failed:', error.message);
    } else {
        showLogin();
    }
};

/**
 * Fetches and renders the list of items for a given content type.
 */
const selectMap = {
    testimonials: 'id, quote, author, created_at',
    blogs: 'id, title, created_at',
    faqs: 'id, question, created_at',
    projects: 'id, name, location, created_at',
    data_entries: 'id, project_id, data, created_at, projects(name)'
};

const renderList = async (type) => {
    const listElement = document.getElementById(`${type}-list`);
    if (!listElement) return;

    const select = selectMap[type];

    const { data, error } = await supabase
        .from(type)
        .select(select)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(`Error loading ${type}:`, error);
        return;
    }

    listElement.innerHTML = '';
    data.forEach((item) => {
        const row = document.createElement('tr');

        if (type === 'testimonials') {
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.quote?.substring(0, 50)}...</td>
                <td>
                    <button data-id="${item.id}" data-action="edit" class="btn btn-edit">Edit</button>
                    <button data-id="${item.id}" data-action="delete" class="btn btn-delete">Delete</button>
                </td>
            `;
        } else if (type === 'blogs') {
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>
                    <button data-id="${item.id}" data-action="edit" class="btn btn-edit">Edit</button>
                    <button data-id="${item.id}" data-action="delete" class="btn btn-delete">Delete</button>
                </td>
            `;
        } else if (type === 'faqs') {
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.question}</td>
                <td>
                    <button data-id="${item.id}" data-action="edit" class="btn btn-edit">Edit</button>
                    <button data-id="${item.id}" data-action="delete" class="btn btn-delete">Delete</button>
                </td>
            `;
        } else if (type === 'projects') {
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.location || 'N/A'}</td>
                <td>
                    <button data-id="${item.id}" data-action="edit" class="btn btn-edit">Edit</button>
                    <button data-id="${item.id}" data-action="delete" class="btn btn-delete">Delete</button>
                </td>
            `;
        } else if (type === 'data_entries') {
            const dataPreview = typeof item.data === 'object'
                ? JSON.stringify(item.data).substring(0, 30) + '...'
                : String(item.data).substring(0, 30) + '...';
            const projectName = item.projects?.name || 'Unknown Project';
            const createdDate = new Date(item.created_at).toLocaleDateString();
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${projectName}</td>
                <td>${dataPreview}</td>
                <td>${createdDate}</td>
                <td>
                    <button data-id="${item.id}" data-action="edit" class="btn btn-edit">Edit</button>
                    <button data-id="${item.id}" data-action="delete" class="btn btn-delete">Delete</button>
                </td>
            `;
        }

        listElement.appendChild(row);
    });

    if (type === 'data_entries') {
        await loadProjectsDropdown();
    }
};

/**
 * Loads projects for the dropdown in data entries form.
 */
const loadProjectsDropdown = async () => {
    const dropdown = document.getElementById('data-entry-project');
    if (!dropdown) return;

    const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .order('name');

    if (error) {
        console.error('Error loading projects for dropdown:', error);
        return;
    }

    dropdown.innerHTML = '<option value="">Select Project...</option>';
    data.forEach((project) => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        dropdown.appendChild(option);
    });
};

/**
 * Handles form submissions for creating/updating content.
 */
const setupFormHandler = (type) => {
    const formElement = document.getElementById(`${type}-form`);
    if (!formElement) return;

    formElement.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(formElement);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        const id = data.id;
        delete data.id;

        if (type === 'data_entries') {
            try {
                data.data = JSON.parse(data.data);
                if (data.metadata) {
                    data.metadata = JSON.parse(data.metadata);
                }
            } catch (err) {
                alert('Invalid JSON in data or metadata fields');
                return;
            }
        }

        if (!id && (type === 'projects' || type === 'data_entries')) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                data.created_by = user.id;
            }
        }

        if (id) {
            const { error } = await supabase.from(type).update(data).eq('id', id);
            if (error) {
                console.error(`Error updating ${type.slice(0, -1)}:`, error);
                alert(`Error updating ${type.slice(0, -1)}: ${error.message}`);
            } else {
                alert(`Successfully updated ${type.slice(0, -1)}!`);
            }
        } else {
            const { error } = await supabase.from(type).insert([data]);
            if (error) {
                console.error(`Error inserting ${type.slice(0, -1)}:`, error);
                alert(`Error inserting ${type.slice(0, -1)}: ${error.message}`);
            } else {
                alert(`Successfully added new ${type.slice(0, -1)}!`);
            }
        }
        formElement.reset();
        renderList(type);
    });
};

/**
 * Handles edit and delete actions on the list.
 */
const handleListClick = async (event, type) => {
    const target = event.target;
    const id = target.getAttribute('data-id');
    const action = target.getAttribute('data-action');

    if (!id || !action) return;

    if (action === 'edit') {
        const { data, error } = await supabase.from(type).select('*').eq('id', id).single();
        if (error) {
            console.error(`Error fetching item for edit:`, error);
            return;
        }
        const form = document.getElementById(`${type}-form`);
        if (form) {
            form.elements.namedItem('id').value = id;
            if (type === 'testimonials') {
                form.elements.namedItem('quote').value = data.quote;
                form.elements.namedItem('author').value = data.author;
            } else if (type === 'blogs') {
                form.elements.namedItem('title').value = data.title;
                form.elements.namedItem('excerpt').value = data.excerpt;
                form.elements.namedItem('content').value = data.content;
                form.elements.namedItem('link').value = data.link;
            } else if (type === 'faqs') {
                form.elements.namedItem('question').value = data.question;
                form.elements.namedItem('answer').value = data.answer;
            } else if (type === 'projects') {
                form.elements.namedItem('name').value = data.name;
                form.elements.namedItem('description').value = data.description || '';
                form.elements.namedItem('location').value = data.location || '';
            } else if (type === 'data_entries') {
                form.elements.namedItem('project_id').value = data.project_id;
                form.elements.namedItem('data').value = JSON.stringify(data.data, null, 2);
                form.elements.namedItem('metadata').value = data.metadata ? JSON.stringify(data.metadata, null, 2) : '';
            }
        }
    } else if (action === 'delete') {
        if (confirm('Are you sure you want to delete this item?')) {
            const { error } = await supabase.from(type).delete().eq('id', id);
            if (error) {
                console.error(`Error deleting item:`, error);
                alert(`An error occurred while deleting the ${type.slice(0, -1)}.`);
            } else {
                renderList(type);
                alert(`Successfully deleted ${type.slice(0, -1)}.`);
            }
        }
    }
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    //supabase = window.supabaseClient;

    loginContainer = document.getElementById('login-container');
    adminDashboard = document.getElementById('admin-dashboard');
    loginForm = document.getElementById('login-form');
    emailInput = document.getElementById('email');
    passwordInput = document.getElementById('password');
    loginStatus = document.getElementById('login-status');
    logoutBtn = document.getElementById('logout-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    contentTypes.forEach(type => {
        setupFormHandler(type);
        const listElement = document.getElementById(`${type}-list`);
        if (listElement) {
            listElement.addEventListener('click', (e) => handleListClick(e, type));
        }
    });

    checkAuth();
});
