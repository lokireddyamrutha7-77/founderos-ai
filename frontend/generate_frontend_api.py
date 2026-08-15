import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)

content = """// API Integration Layer
export interface User {
  id?: number;
  email: string;
  name: string;
  businessName?: string;
  hasOnboarded?: boolean;
}

export interface BusinessProfile {
  stage: 'no_idea' | 'idea' | 'business';
  industry: string;
  interests?: string[];
  skills?: string[];
  budget?: string;
  location?: string;
  availableTime?: string;
  onlinePreference?: 'online' | 'offline' | 'hybrid';
  soloPreference?: 'solo' | 'team';
  investmentCapacity?: number;
  currentChallenges?: string[];
  goals?: string[];
  revenue?: number;
  expenses?: number;
  details?: string;
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface AdvisorReport {
  id: string;
  createdAt: string;
  title: string;
  assessmentScore: number;
  explanation: string;
  targetCustomer: string;
  marketOpportunity: string;
  competition: string;
  revenueModel: string;
  pricing: string;
  costs: string;
  swot: SWOT;
  roadmap: { phase: string; title: string; tasks: string[] }[];
  risks: { risk: string; impact: 'High' | 'Medium' | 'Low'; mitigation: string }[];
  nextActions: string[];
}

export interface Memory {
  id: string;
  title: string;
  category: 'Business' | 'Ideas' | 'Goals' | 'Decisions' | 'Finance' | 'Tasks' | 'Milestones' | 'Advisor Reports' | 'Conversations';
  content: string;
  timestamp?: string;
  relatedContext?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'revenue' | 'expense' | 'investment';
  amount: number;
  category: string;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

const BASE_URL = 'http://localhost:8000';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('altora_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.detail || 'An error occurred');
  }
  return data.data;
}

export const api = {
  auth: {
    async signup(email: string, name: string, businessName?: string): Promise<User> {
      const data = await fetchAPI('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, name, password: 'default_password' }) // Need to adapt to real passwords later
      });
      return data;
    },

    async login(email: string): Promise<User> {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', 'default_password');

      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Login failed');

      localStorage.setItem('altora_token', data.access_token);
      return await this.getMe();
    },

    async logout(): Promise<void> {
      localStorage.removeItem('altora_token');
    },

    async getMe(): Promise<User | null> {
      try {
        return await fetchAPI('/auth/me');
      } catch {
        return null;
      }
    }
  },

  business: {
    async getProfile(): Promise<BusinessProfile | null> {
      return await fetchAPI('/business');
    },

    async saveOnboarding(profile: BusinessProfile): Promise<BusinessProfile> {
      const res = await fetchAPI('/business', {
        method: 'POST',
        body: JSON.stringify(profile)
      });

      // Auto generate advisor report on onboarding
      try {
        await api.advisor.generateMockReport(profile);
      } catch (e) {
        console.error("Failed to generate report on onboarding", e);
      }
      return res;
    },

    async updateProfile(profile: Partial<BusinessProfile>): Promise<BusinessProfile> {
      return await fetchAPI('/business', {
        method: 'PUT',
        body: JSON.stringify(profile)
      });
    }
  },

  advisor: {
    async getReports(): Promise<AdvisorReport[]> {
      return await fetchAPI('/advisor');
    },

    async generateMockReport(profile: BusinessProfile): Promise<AdvisorReport> {
      return await fetchAPI('/advisor', {
        method: 'POST',
        body: JSON.stringify(profile)
      });
    },

    async saveToMemory(report: AdvisorReport): Promise<Memory> {
      return await api.memory.addMemory(
        'Advisor Reports',
        `Saved Strategic Analysis: ${report.title}`,
        `Score: ${report.assessmentScore}%\\nTarget customer: ${report.targetCustomer}\\nRoadmap Steps: ${report.roadmap.map(r => r.title).join(' -> ')}`,
        report.id
      );
    }
  },

  memory: {
    async getMemories(): Promise<Memory[]> {
      const res = await fetchAPI('/memory/');
      // Map API response to expected Memory format
      return res.items ? res.items.map((m: any) => ({
        id: `mem_${m.id}`,
        title: m.title,
        category: m.category,
        content: m.content,
        timestamp: m.created_at,
        relatedContext: m.tags
      })) : [];
    },

    async addMemory(category: Memory['category'], title: string, content: string, relatedContext?: string): Promise<Memory> {
      const res = await fetchAPI('/memory/', {
        method: 'POST',
        body: JSON.stringify({
          title,
          category,
          content,
          tags: relatedContext || '',
          importance: 3
        })
      });
      return {
        id: `mem_${res.id}`,
        title: res.title,
        category: res.category,
        content: res.content,
        timestamp: res.created_at,
        relatedContext: res.tags
      };
    }
  },

  finance: {
    async getTransactions(): Promise<Transaction[]> {
      return await fetchAPI('/transactions');
    },

    async getSummary(): Promise<{ investment: number; revenue: number; expenses: number; profit: number }> {
      return await fetchAPI('/transactions/summary');
    },

    async addTransaction(amount: number, type: 'revenue' | 'expense' | 'investment', category: string, description: string): Promise<Transaction> {
      const tx = await fetchAPI('/transactions', {
        method: 'POST',
        body: JSON.stringify({ amount, type, category, description })
      });

      await api.memory.addMemory(
        'Finance',
        `Logged ${type}: $${amount.toLocaleString()}`,
        `${description} (${category})`
      );

      return tx;
    }
  },

  inventory: {
    async getItems(): Promise<InventoryItem[]> {
      return await fetchAPI('/inventory');
    },

    async addItem(name: string, quantity: number, costPrice: number, sellingPrice: number): Promise<InventoryItem> {
      return await fetchAPI('/inventory', {
        method: 'POST',
        body: JSON.stringify({ name, quantity, cost_price: costPrice, selling_price: sellingPrice })
      });
    },

    async updateStock(id: string, newQty: number): Promise<InventoryItem> {
      const actualId = id.replace('inv_', '');
      return await fetchAPI(`/inventory/${actualId}/stock`, {
        method: 'PUT',
        body: JSON.stringify({ quantity: newQty })
      });
    }
  },

  milestones: {
    async getMilestones(): Promise<Milestone[]> {
      return await fetchAPI('/milestones');
    },

    async addMilestone(title: string, description: string, date: string): Promise<Milestone> {
      return await fetchAPI('/milestones', {
        method: 'POST',
        body: JSON.stringify({ title, description, target_date: date })
      });
    },

    async toggleMilestone(id: string): Promise<Milestone> {
      const actualId = id.replace('ms_', '');
      return await fetchAPI(`/milestones/${actualId}/toggle`, {
        method: 'PUT'
      });
    }
  },

  tasks: {
    async getTasks(): Promise<Task[]> {
      return await fetchAPI('/tasks');
    },

    async addTask(title: string, dueDate: string): Promise<Task> {
      return await fetchAPI('/tasks', {
        method: 'POST',
        body: JSON.stringify({ title, dueDate })
      });
    },

    async toggleTask(id: string): Promise<Task> {
      return await fetchAPI(`/tasks/${id}/toggle`, {
        method: 'PUT'
      });
    }
  }
};
"""

write_file("src/services/api.ts", content)
print("Frontend api.ts rewritten successfully.")
