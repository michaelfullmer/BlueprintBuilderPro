export function createPageUrl(pageName) {
    const routes = {
        'Home': '/',
        'Projects': '/projects',
        'NewProject': '/new-project',
        'ProjectDetail': '/project'
    };

    // Handle query params like: ProjectDetail?id=123
    if (pageName.includes('?')) {
        const [page, query] = pageName.split('?');
        const id = query.split('=')[1];
        return `/project/${id}`;
    }

    return routes[pageName] || `/${pageName.toLowerCase()}`;
}
