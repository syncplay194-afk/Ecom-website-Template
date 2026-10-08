import { mockProducts, mockSettings, mockOrders } from './mockData';

class MockDatabase {
  from(table: string) {
    return {
      select: () => this.buildQuery(table, 'select'),
      insert: () => this.buildQuery(table, 'insert'),
      update: () => this.buildQuery(table, 'update'),
      delete: () => this.buildQuery(table, 'delete'),
    };
  }

  rpc(funcName: string) {
    if (funcName === 'get_order_short_id') {
      return Promise.resolve({ data: 'ORD-123456', error: null });
    }
    return Promise.resolve({ data: null, error: null });
  }

  buildQuery(table: string, action: string) {
    let mockData = table === 'Products' ? [...mockProducts] : 
                   table === 'Orders' ? [...mockOrders] : 
                   table === 'Settings' ? [...mockSettings] : [];

    const chain = {
      eq: (field: string, value: unknown) => {
        mockData = mockData.filter((item: Record<string, unknown>) => item[field] === value);
        return chain;
      },
      neq: (field: string, value: unknown) => {
        mockData = mockData.filter((item: Record<string, unknown>) => item[field] !== value);
        return chain;
      },
      limit: (n: number) => {
        mockData = mockData.slice(0, n);
        return chain;
      },
      order: () => {
        // naive sort
        return chain;
      },
      single: async () => {
        return { data: mockData[0] || null, error: null };
      },
      then: (resolve: (val: unknown) => void) => {
        if (action === 'insert' || action === 'update' || action === 'delete') {
          return resolve({ data: null, error: null });
        }
        return resolve({ data: mockData, error: null });
      }
    };
    
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        if (action === 'insert' || action === 'update' || action === 'delete') {
          resolve({ data: null, error: null });
        } else {
          resolve({ data: mockData, error: null });
        }
      }, 50);
    });
    
    Object.assign(chain, promise);
    chain.then = promise.then.bind(promise);
    return chain as unknown;
  }
}

export const insforge = {
  database: new MockDatabase(),
  auth: {
    getCurrentUser: async () => ({ data: { id: 'mock-user-123', email: 'admin@example.com' }, error: null }),
    signInWithPassword: async (credentials: any) => ({ data: { user: { id: 'mock-user-123' } }, error: null }),
    signOut: async () => ({ error: null }),
  }
};
