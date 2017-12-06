import React from 'react'
import {
  Route,
  Redirect,
} from 'react-router-dom'

import TopicList from '../views/topic-list/index'
import TopicDetail from '../views/topic-detail/index'

export default () => [
  <Route path="/" render={() => <Redirect to="/list" />} exact key="0" />, // exact 严格匹配path, push={true} 是用在历史里会来回跳转
  <Route path="/list" component={TopicList} key="1" />, // exact 严格匹配path
  <Route path="/detail" component={TopicDetail} key="2" />,
]
