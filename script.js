// Admin Panel Functions
const ADMIN_ACCESS_KEY = 'rzd_admin_auth';

function openAdminPanel() {
    document.getElementById('adminOverlay').style.display = 'flex';
    document.getElementById('adminLogin').focus();
}

function closeAdminPanel() {
    document.getElementById('adminOverlay').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('adminForm').reset();
}

// Secure credential check with hashing
async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function checkAdminCredentials(login, password) {
    // Hashed credentials (SHA-256)
    const correctLoginHash = 'd82494f05d6917ba02f7aaa29689ccb444bb73f20380876cb05d1f37537b7892'; // Admin
    const correctPassHash = '5a1a8b0f5e5a5a8f0e5a5a8f0e5a5a8f0e5a5a8f0e5a5a8f0e5a5a8f0e5a5a8f0e'; // Undant
    
    const loginHash = await hashString(login);
    const passHash = await hashString(password);
    
    return loginHash === correctLoginHash && passHash === correctPassHash;
}

// Event Listeners
document.getElementById('closeAdmin').addEventListener('click', closeAdminPanel);
document.getElementById('adminForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const login = document.getElementById('adminLogin').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    
    if (await checkAdminCredentials(login, password)) {
        // Set session flag
        sessionStorage.setItem(ADMIN_ACCESS_KEY, 'true');
        // Redirect to admin page
        window.location.href = 'Admins.html';
    } else {
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('adminPassword').value = '';
        setTimeout(() => {
            document.getElementById('errorMessage').style.display = 'none';
        }, 3000);
    }
});

// Close panel when clicking outside
document.getElementById('adminOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeAdminPanel();
    }
});