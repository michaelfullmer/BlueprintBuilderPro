const projectStore = [];

export const base44 = {
  entities: {
    Project: {
      list: async () => [...projectStore],
      filter: async (params) => {
        if (params?.id) return projectStore.filter(p => p.id === params.id);
        return [...projectStore];
      },
      get: async (id) => projectStore.find(p => p.id === id) || null,
      create: async (data) => {
        const newProject = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          created_date: new Date().toISOString()
        };
        projectStore.push(newProject);
        return newProject;
      },
      delete: async (id) => {
        const index = projectStore.findIndex(p => p.id === id);
        if (index !== -1) projectStore.splice(index, 1);
      }
    }
  },
  auth: {
    me: async () => ({ id: '1', email: 'user@example.com', full_name: 'Beta User', avatar_url: null }),
    logout: () => { console.log('Mock logout'); }
  },
 const base64Client = {
  integrations: {
    Core: {
      InvokeLLM: async (params) => {
        try {
          
          let base64Data = params.file_urls[0];
          if (base64Data.includes(',')) {
            base64Data = base64Data.split(',')[1];
          }

          
          const response = await fetch('/.netlify/functions/analyze-blueprint', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64Data,
              prompt: params.prompt
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          return {
            content: [
              {
                type: "text",
                text: data.content[0].text
              }
            ]
          };
        } catch (error) {
          console.error('Error calling Netlify function:', error);
          throw error;
        }
      },

      UploadFile: async ({ file }) => {
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        return { file_url: base64Data };
      }
    }
  },

  Project: {
    list: async () => [...projectStore],
    filter: async (params) => {
      if (params?.id) return projectStore.filter(p => p.id === params.id);
      return [...projectStore];
    },
    get: async (id) => projectStore.find(p => p.id === id) || null,
    create: async (data) => {
      const newProject = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        created_date: new Date().toISOString()
      };
      projectStore.push(newProject);
      return newProject;
    },
    delete: async (id) => {
      const index = projectStore.findIndex(p => p.id === id);
      if (index !== -1) projectStore.splice(index, 1);
    }
  }
};
    // If no API key, use mock data
    if (!apiKey || apiKey === 'your_key_here') {
      console.log('No Claude API key found, using mock data');
      return getMockResponse(prompt);
    }

    try {
      // REAL CLAUDE API CALL
      console.log('Calling Claude API for real analysis...');

      // Convert blob URL to base64 if needed
      let base64Image;
      if (file_urls && file_urls.length > 0) {
        const response = await fetch(file_urls[0]);
        const blob = await response.blob();
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(blob);
        });
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [{
            role: 'user',
            content: base64Image ? [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: prompt + '\n\nPlease respond with ONLY valid JSON, no other text.'
              }
            ] : [
              {
                type: 'text',
                text: prompt + '\n\nPlease respond with ONLY valid JSON, no other text.'
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content[0].text;

      // Clean up response and parse JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return JSON.parse(content);

    } catch (error) {
      console.error('Claude API Error:', error);
      console.log('Falling back to mock data');
      return getMockResponse(prompt);
    }
  }
};

// Mock response function (fallback when no API key)
function getMockResponse(prompt) {
  // Simulate AI processing delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Check what type of analysis is being requested
      if (prompt.includes('cost estimate') || prompt.includes('construction cost')) {
        // Return mock estimate data
        resolve({
          phases: [
            {
              id: "foundation",
              name: "Foundation & Footers",
              materials: [
                { name: "Concrete Mix", brand: "QuikCrete", quantity: 50, unit: "cubic yards", unit_price: 150, total_price: 7500 },
                { name: "Rebar #4", brand: "Steel Grade 60", quantity: 2000, unit: "lbs", unit_price: 0.75, total_price: 1500 },
                { name: "Forms & Stakes", brand: "Generic", quantity: 500, unit: "linear ft", unit_price: 2.50, total_price: 1250 }
              ],
              materials_cost: 15000,
              labor_cost: 12000,
              duration_days: 10,
              dependencies: []
            },
            {
              id: "framing",
              name: "Framing",
              materials: [
                { name: "2x4 Studs", brand: "Lumber Grade", quantity: 800, unit: "pieces", unit_price: 8, total_price: 6400 },
                { name: "2x6 Headers", brand: "Lumber Grade", quantity: 200, unit: "pieces", unit_price: 15, total_price: 3000 },
                { name: "Plywood Sheathing", brand: "4x8 sheets", quantity: 150, unit: "sheets", unit_price: 45, total_price: 6750 }
              ],
              materials_cost: 35000,
              labor_cost: 28000,
              duration_days: 21,
              dependencies: ["foundation"]
            },
            {
              id: "roofing",
              name: "Roofing",
              materials: [
                { name: "Asphalt Shingles", brand: "GAF Timberline", quantity: 35, unit: "squares", unit_price: 120, total_price: 4200 },
                { name: "Underlayment", brand: "Synthetic", quantity: 35, unit: "rolls", unit_price: 85, total_price: 2975 }
              ],
              materials_cost: 12000,
              labor_cost: 8000,
              duration_days: 7,
              dependencies: ["framing"]
            },
            {
              id: "electrical",
              name: "Electrical Rough-In",
              materials: [
                { name: "Romex Wire 12/2", brand: "Southwire", quantity: 2500, unit: "feet", unit_price: 0.65, total_price: 1625 }
              ],
              materials_cost: 8000,
              labor_cost: 12000,
              duration_days: 14,
              dependencies: ["framing"]
            },
            {
              id: "plumbing",
              name: "Plumbing Rough-In",
              materials: [
                { name: "PEX Tubing", brand: "Uponor", quantity: 1500, unit: "feet", unit_price: 1.25, total_price: 1875 }
              ],
              materials_cost: 10000,
              labor_cost: 15000,
              duration_days: 14,
              dependencies: ["framing"]
            },
            {
              id: "interior",
              name: "Interior Finishes",
              materials: [
                { name: "Drywall 1/2\"", brand: "USG", quantity: 200, unit: "sheets", unit_price: 15, total_price: 3000 }
              ],
              materials_cost: 25000,
              labor_cost: 20000,
              duration_days: 21,
              dependencies: ["electrical", "plumbing"]
            }
          ],
          total_material_cost: 105000,
          total_labor_cost: 95000,
          total_estimate: 200000,
          total_duration_days: 87
        });
      }

      // Blueprint analysis - return mock extracted data
      resolve({
        total_sqft: 2400,
        floors: 2,
        foundation_type: "slab",
        roof_type: "gable",
        roof_pitch: "6/12",
        roof_sqft: 1400,
        exterior_walls_sqft: 2800,
        rooms: [
          { name: "Living Room", length: 20, width: 15, sqft: 300, flooring_type: "Hardwood" },
          { name: "Kitchen", length: 15, width: 12, sqft: 180, flooring_type: "Tile" },
          { name: "Master Bedroom", length: 16, width: 14, sqft: 224, flooring_type: "Carpet" },
          { name: "Bedroom 2", length: 12, width: 11, sqft: 132, flooring_type: "Carpet" },
          { name: "Bedroom 3", length: 12, width: 11, sqft: 132, flooring_type: "Carpet" },
          { name: "Master Bath", length: 10, width: 8, sqft: 80, flooring_type: "Tile" },
          { name: "Bath 2", length: 8, width: 6, sqft: 48, flooring_type: "Tile" },
          { name: "Dining Room", length: 14, width: 12, sqft: 168, flooring_type: "Hardwood" },
          { name: "Garage", length: 22, width: 22, sqft: 484, flooring_type: "Concrete" }
        ],
        structural_elements: [
          { type: "Load-bearing wall", description: "Main support walls", quantity: 4 },
          { type: "Beam", description: "Support beams", quantity: 8 }
        ],
        windows: 18,
        doors: 8,
        garage_bays: 2,
        special_features: ["Covered front porch", "Attached 2-car garage", "Open floor plan"],
        exterior_walls_linear_ft: 280,
        interior_walls_linear_ft: 420
      });
    }, 2000);
  });
}