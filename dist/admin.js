var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// src/admin.ts
import { supabase } from './supabaseClient.js';
//import { authService } from './auth';
//[import type  { User, AuthError } from '@supabase/supabase-js';
// Global DOM elements (will be set when DOM is ready)
var loginContainer;
var adminDashboard;
var loginForm;
var emailInput;
var passwordInput;
var loginStatus;
var logoutBtn;
var contentTypes = ['testimonials', 'blogs', 'faqs', 'projects', 'data_entries'];
// --- CORE FUNCTIONS ---
/**
 * Checks the user's authentication state with Supabase.
 */
var checkAuth = function () { return __awaiter(void 0, void 0, void 0, function () {
    var user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, supabase.auth.getUser()];
            case 1:
                user = (_a.sent()).data.user;
                if (user) {
                    showDashboard();
                }
                else {
                    showLogin();
                }
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.error('Error checking auth:', err_1);
                showLogin();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Shows the admin dashboard and loads content.
 */
var showDashboard = function () {
    if (loginContainer && adminDashboard) {
        loginContainer.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        contentTypes.forEach(function (type) {
            renderList(type);
        });
    }
};
/**
 * Shows the login form and hides the dashboard.
 */
var showLogin = function () {
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
var handleLogin = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                event.preventDefault();
                if (!emailInput || !passwordInput || !loginStatus)
                    return [2 /*return*/];
                email = emailInput.value;
                password = passwordInput.value;
                loginStatus.textContent = 'Logging in...';
                return [4 /*yield*/, supabase.auth.signInWithPassword({ email: email, password: password })];
            case 1:
                error = (_a.sent()).error;
                if (error) {
                    loginStatus.textContent = "Login failed: ".concat(error.message);
                    console.error('Login error:', error.message);
                }
                else {
                    loginStatus.textContent = 'Login successful!';
                    showDashboard();
                }
                return [2 /*return*/];
        }
    });
}); };
/**
 * Handles user logout.
 */
var handleLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, supabase.auth.signOut()];
            case 1:
                error = (_a.sent()).error;
                if (error) {
                    console.error('Logout failed:', error.message);
                }
                else {
                    showLogin();
                }
                return [2 /*return*/];
        }
    });
}); };
/**
 * Fetches and renders the list of items for a given content type.
 * @param type The content type ('testimonials', 'blogs', 'faqs', 'projects', 'data_entries').
 */
var selectMap = {
    testimonials: 'id, quote, author, created_at',
    blogs: 'id, title, created_at',
    faqs: 'id, question, created_at',
    projects: 'id, name, location, created_at',
    data_entries: 'id, project_id, data, created_at, projects(name)'
};
var renderList = function (type) { return __awaiter(void 0, void 0, void 0, function () {
    var listElement, select, _a, data, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                listElement = document.getElementById("".concat(type, "-list"));
                if (!listElement)
                    return [2 /*return*/];
                select = selectMap[type];
                return [4 /*yield*/, supabase
                        .from(type)
                        .select(select) // returns FilterBuilder
                        .order('created_at', { ascending: false })];
            case 1:
                _a = _b.sent(), data = _a.data, error = _a.error;
                if (error) {
                    console.error("Error loading ".concat(type, ":"), error);
                    return [2 /*return*/];
                }
                listElement.innerHTML = '';
                data.forEach(function (item) {
                    var _a, _b;
                    var row = document.createElement('tr');
                    if (type === 'testimonials') {
                        row.innerHTML = "\n                <td>".concat(item.id, "</td>\n                <td>").concat((_a = item.quote) === null || _a === void 0 ? void 0 : _a.substring(0, 50), "...</td>\n                <td>\n                    <button data-id=\"").concat(item.id, "\" data-action=\"edit\" class=\"btn btn-edit\">Edit</button>\n                    <button data-id=\"").concat(item.id, "\" data-action=\"delete\" class=\"btn btn-delete\">Delete</button>\n                </td>\n            ");
                    }
                    else if (type === 'blogs') {
                        row.innerHTML = "\n                <td>".concat(item.id, "</td>\n                <td>").concat(item.title, "</td>\n                <td>\n                    <button data-id=\"").concat(item.id, "\" data-action=\"edit\" class=\"btn btn-edit\">Edit</button>\n                    <button data-id=\"").concat(item.id, "\" data-action=\"delete\" class=\"btn btn-delete\">Delete</button>\n                </td>\n            ");
                    }
                    else if (type === 'faqs') {
                        row.innerHTML = "\n                <td>".concat(item.id, "</td>\n                <td>").concat(item.question, "</td>\n                <td>\n                    <button data-id=\"").concat(item.id, "\" data-action=\"edit\" class=\"btn btn-edit\">Edit</button>\n                    <button data-id=\"").concat(item.id, "\" data-action=\"delete\" class=\"btn btn-delete\">Delete</button>\n                </td>\n            ");
                    }
                    else if (type === 'projects') {
                        row.innerHTML = "\n                <td>".concat(item.id, "</td>\n                <td>").concat(item.name, "</td>\n                <td>").concat(item.location || 'N/A', "</td>\n                <td>\n                    <button data-id=\"").concat(item.id, "\" data-action=\"edit\" class=\"btn btn-edit\">Edit</button>\n                    <button data-id=\"").concat(item.id, "\" data-action=\"delete\" class=\"btn btn-delete\">Delete</button>\n                </td>\n            ");
                    }
                    else if (type === 'data_entries') {
                        var dataPreview = typeof item.data === 'object' ? JSON.stringify(item.data).substring(0, 30) + '...' : String(item.data).substring(0, 30) + '...';
                        var projectName = ((_b = item.projects) === null || _b === void 0 ? void 0 : _b.name) || 'Unknown Project';
                        var createdDate = new Date(item.created_at).toLocaleDateString();
                        row.innerHTML = "\n                <td>".concat(item.id, "</td>\n                <td>").concat(projectName, "</td>\n                <td>").concat(dataPreview, "</td>\n                <td>").concat(createdDate, "</td>\n                <td>\n                    <button data-id=\"").concat(item.id, "\" data-action=\"edit\" class=\"btn btn-edit\">Edit</button>\n                    <button data-id=\"").concat(item.id, "\" data-action=\"delete\" class=\"btn btn-delete\">Delete</button>\n                </td>\n            ");
                    }
                    listElement.appendChild(row);
                });
                if (!(type === 'data_entries')) return [3 /*break*/, 3];
                return [4 /*yield*/, loadProjectsDropdown()];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
/**
 * Loads projects for the dropdown in data entries form.
 */
var loadProjectsDropdown = function () { return __awaiter(void 0, void 0, void 0, function () {
    var dropdown, _a, data, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                dropdown = document.getElementById('data-entry-project');
                if (!dropdown)
                    return [2 /*return*/];
                return [4 /*yield*/, supabase
                        .from('projects')
                        .select('id, name')
                        .order('name')];
            case 1:
                _a = _b.sent(), data = _a.data, error = _a.error;
                if (error) {
                    console.error('Error loading projects for dropdown:', error);
                    return [2 /*return*/];
                }
                // Keep the first option and add projects
                dropdown.innerHTML = '<option value="">Select Project...</option>';
                data.forEach(function (project) {
                    var option = document.createElement('option');
                    option.value = project.id;
                    option.textContent = project.name;
                    dropdown.appendChild(option);
                });
                return [2 /*return*/];
        }
    });
}); };
/**
 * Handles form submissions for creating/updating content.
 * @param type The content type.
 */
var setupFormHandler = function (type) {
    var formElement = document.getElementById("".concat(type, "-form"));
    if (!formElement)
        return;
    formElement.addEventListener('submit', function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var formData, data, id, user, error, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    formData = new FormData(formElement);
                    data = {};
                    formData.forEach(function (value, key) { return data[key] = value; });
                    id = data.id;
                    delete data.id;
                    // Handle JSON fields for data_entries
                    if (type === 'data_entries') {
                        try {
                            data.data = JSON.parse(data.data);
                            if (data.metadata) {
                                data.metadata = JSON.parse(data.metadata);
                            }
                        }
                        catch (err) {
                            alert('Invalid JSON in data or metadata fields');
                            return [2 /*return*/];
                        }
                    }
                    if (!(!id && (type === 'projects' || type === 'data_entries'))) return [3 /*break*/, 2];
                    return [4 /*yield*/, supabase.auth.getUser()];
                case 1:
                    user = (_a.sent()).data.user;
                    if (user) {
                        data.created_by = user.id;
                    }
                    _a.label = 2;
                case 2:
                    if (!id) return [3 /*break*/, 4];
                    return [4 /*yield*/, supabase.from(type).update(data).eq('id', id)];
                case 3:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error("Error updating ".concat(type.slice(0, -1), ":"), error);
                        alert("Error updating ".concat(type.slice(0, -1), ": ").concat(error.message));
                    }
                    else {
                        alert("Successfully updated ".concat(type.slice(0, -1), "!"));
                    }
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, supabase.from(type).insert([data])];
                case 5:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error("Error inserting ".concat(type.slice(0, -1), ":"), error);
                        alert("Error inserting ".concat(type.slice(0, -1), ": ").concat(error.message));
                    }
                    else {
                        alert("Successfully added new ".concat(type.slice(0, -1), "!"));
                    }
                    _a.label = 6;
                case 6:
                    formElement.reset();
                    renderList(type);
                    return [2 /*return*/];
            }
        });
    }); });
};
/**
 * Handles edit and delete actions on the list.
 * @param event The click event.
 * @param type The content type.
 */
var handleListClick = function (event, type) { return __awaiter(void 0, void 0, void 0, function () {
    var target, id, action, _a, data, error, form, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                target = event.target;
                id = target.getAttribute('data-id');
                action = target.getAttribute('data-action');
                if (!id || !action)
                    return [2 /*return*/];
                if (!(action === 'edit')) return [3 /*break*/, 2];
                return [4 /*yield*/, supabase.from(type).select('*').eq('id', id).single()];
            case 1:
                _a = _b.sent(), data = _a.data, error = _a.error;
                if (error) {
                    console.error("Error fetching item for edit:", error);
                    return [2 /*return*/];
                }
                form = document.getElementById("".concat(type, "-form"));
                if (form) {
                    form.elements.namedItem('id').value = id;
                    if (type === 'testimonials') {
                        form.elements.namedItem('quote').value = data.quote;
                        form.elements.namedItem('author').value = data.author;
                    }
                    else if (type === 'blogs') {
                        form.elements.namedItem('title').value = data.title;
                        form.elements.namedItem('excerpt').value = data.excerpt;
                        form.elements.namedItem('content').value = data.content;
                        form.elements.namedItem('link').value = data.link;
                    }
                    else if (type === 'faqs') {
                        form.elements.namedItem('question').value = data.question;
                        form.elements.namedItem('answer').value = data.answer;
                    }
                    else if (type === 'projects') {
                        form.elements.namedItem('name').value = data.name;
                        form.elements.namedItem('description').value = data.description || '';
                        form.elements.namedItem('location').value = data.location || '';
                    }
                    else if (type === 'data_entries') {
                        form.elements.namedItem('project_id').value = data.project_id;
                        form.elements.namedItem('data').value = JSON.stringify(data.data, null, 2);
                        form.elements.namedItem('metadata').value = data.metadata ? JSON.stringify(data.metadata, null, 2) : '';
                    }
                }
                return [3 /*break*/, 4];
            case 2:
                if (!(action === 'delete')) return [3 /*break*/, 4];
                if (!confirm('Are you sure you want to delete this item?')) return [3 /*break*/, 4];
                return [4 /*yield*/, supabase.from(type).delete().eq('id', id)];
            case 3:
                error = (_b.sent()).error;
                if (error) {
                    console.error("Error deleting item:", error);
                    alert("An error occurred while deleting the ".concat(type.slice(0, -1), "."));
                }
                else {
                    renderList(type);
                    alert("Successfully deleted ".concat(type.slice(0, -1), "."));
                }
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements after DOM is ready
    loginContainer = document.getElementById('login-container');
    adminDashboard = document.getElementById('admin-dashboard');
    loginForm = document.getElementById('login-form');
    emailInput = document.getElementById('email');
    passwordInput = document.getElementById('password');
    loginStatus = document.getElementById('login-status');
    logoutBtn = document.getElementById('logout-btn');
    // Setup login/logout listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    // Setup form handlers and list click listeners for each content type
    contentTypes.forEach(function (type) {
        setupFormHandler(type);
        var listElement = document.getElementById("".concat(type, "-list"));
        if (listElement) {
            listElement.addEventListener('click', function (e) { return handleListClick(e, type); });
        }
    });
    // Check initial auth state
    checkAuth();
});
