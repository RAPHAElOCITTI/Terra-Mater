// src/admin.ts
import { supabase } from './supabaseClient';
import type { Testimonial, Blog, Faq, ContentType } from './types';
import { authService } from './auth';
import type  { User, AuthError } from '@supabase/supabase-js';

// Global DOM elements (will be set when DOM is ready)
let loginContainer: HTMLElement | null;
let adminDashboard: HTMLElement | null;
let loginForm: HTMLFormElement | null;
let emailInput: HTMLInputElement | null;
let passwordInput: HTMLInputElement | null;
let loginStatus: HTMLElement | null;
let logoutBtn: HTMLButtonElement | null;

const contentTypes: ContentType[] = ['testimonials', 'blogs', 'faqs', 'projects', 'data_entries'];

// --- CORE FUNCTIONS ---

/**
 * Checks the user's authentication state with Supabase.
 */
const checkAuth = async (): Promise<void> => {
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
const showDashboard = (): void => {
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
const showLogin = (): void => {
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
 * @param event The form submission event.
 */
const handleLogin = async (event: Event): Promise<void> => {
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
const handleLogout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout failed:', error.message);
    } else {
        showLogin();
    }
};

/**
 * Fetches and renders the list of items for a given content type.
 * @param type The content type ('testimonials', 'blogs', 'faqs', 'projects', 'data_entries').
 */
const renderList = async (type: ContentType): Promise<void> => {
    const listElement = document.getElementById(`${type}-list`) as HTMLTableSectionElement | null;
    if (!listElement) return;

    let query = supabase.from(type);
    
    // Select appropriate fields based on content type
    if (type === 'testimonials') {
        query = query.select('id, quote, author');
    } else if (type === 'blogs') {
        query = query.select('id, title');
    } else if (type === 'faqs') {
        query = query.select('id, question');
    } else if (type === 'projects') {
        query = query.select('id, name, location');
    } else if (type === 'data_entries') {
        query = query.select('id, project_id, data, created_at, projects(name)');
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error(`Error loading ${type}:`, error);
        return;
    }

    listElement.innerHTML = '';
    data.forEach((item: any) => {
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
            const dataPreview = typeof item.data === 'object' ? JSON.stringify(item.data).substring(0, 30) + '...' : String(item.data).substring(0, 30) + '...';
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
    
    // Load projects for data_entries dropdown if needed
    if (type === 'data_entries') {
        await loadProjectsDropdown();
    }
};

/**
 * Loads projects for the dropdown in data entries form.
 */
const loadProjectsDropdown = async (): Promise<void> => {
    const dropdown = document.getElementById('data-entry-project') as HTMLSelectElement | null;
    if (!dropdown) return;

    const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .order('name');

    if (error) {
        console.error('Error loading projects for dropdown:', error);
        return;
    }

    // Keep the first option and add projects
    dropdown.innerHTML = '<option value="">Select Project...</option>';
    data.forEach((project: any) => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        dropdown.appendChild(option);
    });
};

/**
 * Handles form submissions for creating/updating content.
 * @param type The content type.
 */
const setupFormHandler = (type: ContentType): void => {
    const formElement = document.getElementById(`${type}-form`) as HTMLFormElement | null;
    if (!formElement) return;

    formElement.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(formElement);
        const data: { [key: string]: any } = {};
        formData.forEach((value, key) => data[key] = value);

        const id = data.id;
        delete data.id;

        // Handle JSON fields for data_entries
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

        // Add created_by for new projects and data_entries
        if (!id && (type === 'projects' || type === 'data_entries')) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                data.created_by = user.id;
            }
        }

        if (id) {
            // Update an existing item
            const { error } = await supabase.from(type).update(data).eq('id', id);
            if (error) {
                console.error(`Error updating ${type.slice(0, -1)}:`, error);
                alert(`Error updating ${type.slice(0, -1)}: ${error.message}`);
            } else {
                alert(`Successfully updated ${type.slice(0, -1)}!`);
            }
        } else {
            // Insert a new item
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
 * @param event The click event.
 * @param type The content type.
 */
const handleListClick = async (event: MouseEvent, type: ContentType): Promise<void> => {
    const target = event.target as HTMLElement;
    const id = target.getAttribute('data-id');
    const action = target.getAttribute('data-action');

    if (!id || !action) return;

    if (action === 'edit') {
        // Fetch the item and pre-fill the form
        const { data, error } = await supabase.from(type).select('*').eq('id', id).single();
        if (error) {
            console.error(`Error fetching item for edit:`, error);
            return;
        }
        const form = document.getElementById(`${type}-form`) as HTMLFormElement | null;
        if (form) {
            (form.elements.namedItem('id') as HTMLInputElement).value = id;
            if (type === 'testimonials') {
                (form.elements.namedItem('quote') as HTMLInputElement).value = data.quote;
                (form.elements.namedItem('author') as HTMLInputElement).value = data.author;
            } else if (type === 'blogs') {
                (form.elements.namedItem('title') as HTMLInputElement).value = data.title;
                (form.elements.namedItem('excerpt') as HTMLTextAreaElement).value = data.excerpt;
                (form.elements.namedItem('content') as HTMLTextAreaElement).value = data.content;
                (form.elements.namedItem('link') as HTMLInputElement).value = data.link;
            } else if (type === 'faqs') {
                (form.elements.namedItem('question') as HTMLInputElement).value = data.question;
                (form.elements.namedItem('answer') as HTMLTextAreaElement).value = data.answer;
            } else if (type === 'projects') {
                (form.elements.namedItem('name') as HTMLInputElement).value = data.name;
                (form.elements.namedItem('description') as HTMLTextAreaElement).value = data.description || '';
                (form.elements.namedItem('location') as HTMLInputElement).value = data.location || '';
            } else if (type === 'data_entries') {
                (form.elements.namedItem('project_id') as HTMLSelectElement).value = data.project_id;
                (form.elements.namedItem('data') as HTMLTextAreaElement).value = JSON.stringify(data.data, null, 2);
                (form.elements.namedItem('metadata') as HTMLTextAreaElement).value = data.metadata ? JSON.stringify(data.metadata, null, 2) : '';
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
    // Get DOM elements after DOM is ready
    loginContainer = document.getElementById('login-container');
    adminDashboard = document.getElementById('admin-dashboard');
    loginForm = document.getElementById('login-form') as HTMLFormElement;
    emailInput = document.getElementById('email') as HTMLInputElement;
    passwordInput = document.getElementById('password') as HTMLInputElement;
    loginStatus = document.getElementById('login-status');
    logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;

    // Setup login/logout listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Setup form handlers and list click listeners for each content type
    contentTypes.forEach(type => {
        setupFormHandler(type);
        const listElement = document.getElementById(`${type}-list`);
        if (listElement) {
            listElement.addEventListener('click', (e) => handleListClick(e, type));
        }
    });

    // Check initial auth state
    checkAuth();
});
