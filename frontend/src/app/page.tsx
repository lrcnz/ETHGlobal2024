import { createStore, Provider as StorageProvider } from 'jotai';

const store = createStore();

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <StorageProvider store={store}>
        {children}
      </StorageProvider>
    </div>
  );
}
