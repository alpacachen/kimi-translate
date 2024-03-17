import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

type ThemeStorage = BaseStorage<string> & {
  set: (str: string) => Promise<void>;
};

const storage = createStorage<string>('api-key', '', {
  storageType: StorageType.Local,
  liveUpdate: true,
});

const exampleThemeStorage: ThemeStorage = {
  ...storage,
  set: async (str: string) => {
    await storage.set(str);
  },
};

export default exampleThemeStorage;
