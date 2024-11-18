export default function permissionList() {
    const permissions = localStorage.getItem('permissions');
    return permissions ? JSON.parse(permissions) : [];
}