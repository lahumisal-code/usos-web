export function slugify(value) {
  if (typeof value !== 'string') return ''
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function institutionSlugs(user) {
  return {
    universitySlug: slugify(user?.universityName) || 'university',
    collegeSlug: slugify(user?.collegeName) || 'college',
  }
}

export function dashboardPath(user) {
  const { universitySlug, collegeSlug } = institutionSlugs(user)
  const roleSegments = {
    TEACHER: 'teacher',
    STUDENT: 'student',
    PRINCIPAL: 'principal',
    ADMINISTRATOR: 'administrator',
    STAFF: 'staff',
  }
  return `/${universitySlug}/${collegeSlug}/${roleSegments[user.role]}/dashboard`
}
