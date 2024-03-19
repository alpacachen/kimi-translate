export const LocalStorage = {
  set(key: string, value: string) {
    return chrome.storage.local.set({ [key]: value });
  },
  get(key: string) {
    return chrome.storage.local.get(key).then(r => r[key]);
  },
};
