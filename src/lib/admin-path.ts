const DEFAULT_ADMIN_ENTRY_PATH = '/studio';

function normalizeAdminEntryPath(value: string | undefined) {
  const trimmed = value?.trim();
  let path = trimmed || DEFAULT_ADMIN_ENTRY_PATH;

  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  path = path.replace(/\/+$/, '') || DEFAULT_ADMIN_ENTRY_PATH;

  if (path === '/admin' || path.startsWith('/admin/')) {
    return DEFAULT_ADMIN_ENTRY_PATH;
  }

  return path;
}

export function getAdminEntryPath() {
  return normalizeAdminEntryPath(process.env.NEXT_PUBLIC_ADMIN_ENTRY_PATH);
}

export function buildAdminEntryPath(pathname = '') {
  const basePath = getAdminEntryPath();
  const suffix = pathname
    ? pathname.startsWith('/')
      ? pathname
      : `/${pathname}`
    : '';
  return `${basePath}${suffix}`;
}

export function getAdminLoginPath() {
  return buildAdminEntryPath('/login');
}

export function getAdminPostsPath() {
  return buildAdminEntryPath('/posts');
}

export function getAdminNewPostPath() {
  return buildAdminEntryPath('/posts/new');
}

export function getAdminEditPostPath(id: string) {
  return buildAdminEntryPath(`/posts/${id}/edit`);
}

export const ADMIN_ENTRY_HEADER = 'x-victor-admin-entry';
