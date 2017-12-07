import AppStateClass from './app-state'

export const AppState = AppStateClass

export default {
  AppState,
}

export const createStoreMap = () => ({
  // 专门给ssr 使用
  appState: new AppState(),
})
