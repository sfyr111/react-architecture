import {
  observable,
  computed,
  // autorun,
  action,
} from 'mobx'

export default class AppState {
  constructor({ count, name } = { count: 0, name: 'jokcy' }) {
    this.count = count
    this.name = name
  }
  @observable count = 0
  @observable name = 'jokcy'
  @computed get msg() {
    return `${this.name} say count is ${this.count}`
  }
  @action add() {
    this.count += 1
  }
  @action changeName(name) {
    this.name = name
  }
  toJson() { // 用于ssr 取到数据
    return {
      count: this.count,
      name: this.name,
    }
  }
}
