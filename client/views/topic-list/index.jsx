import React from 'react'
import {
  observer,
  inject,
} from 'mobx-react'
import PropTypes from 'prop-types'
import { AppState } from '../../store/app-state'

@inject('appState') @observer // 注入state
export default class TopicList extends React.Component {
  constructor() {
    super()
    this.changeName = this.changeName.bind(this)
  }

  componentDidMount() {
    // do something
  }

  asyncBootstrap() { // dev-static 里会先执行
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3
        resolve(true)
      }, 1000)
    })
  }

  changeName(event) {
    this.props.appState.changeName(event.target.value)
  }

  render() {
    return (
      <div>
        <input type="text" onChange={this.changeName} />
        <span>{this.props.appState.msg}</span>
      </div>
    )
  }
}

TopicList.propTypes = {
  // appState: PropTypes.instanceOf(AppState).isRequired, // 验证类型 必须
  appState: PropTypes.instanceOf(AppState), // 16版本的问题，去除isRequired
}
