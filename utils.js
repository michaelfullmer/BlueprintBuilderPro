export function createPageUrl(name) {
  if (typeof name === 'string') {
    if (name.startsWith('ProjectDetail?id=')) {
      const id = name.split('ProjectDetail?id=')[1];
      return `/projects/${id}`;
    }
    if (name.startsWith('NewProject?id=')) {
      const id = name.split('NewProject?id=')[1];
      return `/new?id=${id}`;
    }
  }
  
  switch (name) {
    case 'Home':
      return '/';
    case 'Projects':
      return '/projects';
    case 'NewProject':
      return '/new';
    case 'ProjectDetail':
      return '/projects';
    default:
      return '/';
  }
}
