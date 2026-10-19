const SUPPORTED_ROLES = new Set(['TEACHER', 'STUDENT', 'PRINCIPAL', 'ADMINISTRATOR', 'STAFF'])

export function isUniversityAdministrator(user) {
  return user?.role === 'ADMINISTRATOR' && user?.userType === 'UNIVERSITY'
}

function isPermission(permission) {
  return permission
    && typeof permission.permissionName === 'string'
    && typeof permission.permissionDescription === 'string'
}

export function isValidUser(user) {
  return Boolean(user
    && (typeof user.userId === 'number' || typeof user.userId === 'string')
    && typeof user.firstName === 'string'
    && typeof user.lastName === 'string'
    && typeof user.email === 'string'
    && SUPPORTED_ROLES.has(user.role)
    && typeof user.userType === 'string'
    && typeof user.token === 'string'
    && user.token.length > 0
    && (user.universityName === undefined || user.universityName === null || typeof user.universityName === 'string')
    && (user.collegeName === undefined || user.collegeName === null || typeof user.collegeName === 'string')
    && Array.isArray(user.allowedPermissions)
    && user.allowedPermissions.every(isPermission))
}
