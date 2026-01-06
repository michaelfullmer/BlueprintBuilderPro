export const base44 = {
  auth: {
    async me() {
      return {
        full_name: 'Demo User',
        email: 'demo@example.com',
        avatar_url: ''
      };
    },
    async logout() {
      return true;
    }
  },
  entities: {
    Project: {
      async list(sortBy = '-updated_date') {
        const stored = localStorage.getItem('projects');
        const projects = stored ? JSON.parse(stored) : [];
        const samples = [
          {
            id: '1',
            name: 'Sample House',
            status: 'ready',
            total_estimate: 125000,
            location: { city: 'Austin', state: 'TX' },
            created_date: new Date().toISOString(),
            updated_date: new Date().toISOString(),
            blueprint_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=60'
          },
          {
            id: '2',
            name: 'Modern Loft',
            status: 'in_progress',
            total_estimate: 98000,
            location: { city: 'Denver', state: 'CO' },
            created_date: new Date().toISOString(),
            updated_date: new Date().toISOString()
          }
        ];
        const all = [...samples, ...projects];
        const sortField = sortBy.replace('-', '');
        const desc = sortBy.startsWith('-');
        all.sort((a, b) => {
          const av = a[sortField] || 0;
          const bv = b[sortField] || 0;
          if (typeof av === 'string' && /\d{4}-\d{2}-\d{2}/.test(av)) {
            return desc ? (new Date(bv) - new Date(av)) : (new Date(av) - new Date(bv));
          }
          if (typeof av === 'string' && typeof bv === 'string') {
            return desc ? bv.localeCompare(av) : av.localeCompare(bv);
          }
          return desc ? (bv - av) : (av - bv);
        });
        return all;
      },
      async filter(query) {
        const all = await this.list();
        if (query?.id) {
          return all.filter(p => String(p.id) === String(query.id));
        }
        return all;
      },
      async create(data) {
        const stored = localStorage.getItem('projects');
        const projects = stored ? JSON.parse(stored) : [];
        const now = new Date().toISOString();
        const id = String(Date.now());
        const project = {
          id,
          created_date: now,
          updated_date: now,
          status: data.status || 'draft',
          ...data
        };
        projects.push(project);
        localStorage.setItem('projects', JSON.stringify(projects));
        return project;
      },
      async delete(id) {
        const stored = localStorage.getItem('projects');
        const projects = stored ? JSON.parse(stored) : [];
        const next = projects.filter(p => String(p.id) !== String(id));
        localStorage.setItem('projects', JSON.stringify(next));
        return true;
      }
    }
  },
  integrations: {
    Core: {
      async UploadFile({ file }) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ file_url: reader.result });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      },
      async InvokeLLM({ prompt, file_urls, response_json_schema }) {
        return {
          total_sqft: 2200,
          floors: 2,
          foundation_type: 'slab',
          roof_type: 'gable',
          roof_pitch: '6/12',
          rooms: [
            { name: 'Living Room', length: 20, width: 15, sqft: 300, flooring_type: 'hardwood' },
            { name: 'Kitchen', length: 12, width: 10, sqft: 120, flooring_type: 'tile' }
          ],
          structural_elements: [
            { type: 'beam', description: 'LVL main span', quantity: 2 }
          ],
          windows: 12,
          doors: 8,
          garage_bays: 2,
          special_features: ['patio', 'deck'],
          exterior_walls_linear_ft: 180,
          interior_walls_linear_ft: 400
        };
      }
    }
  }
};
