---
title: react-router/react-router-dom（v4.x/v5.x）指北
date: 2019年07月24日11:25:15
tags:
- 效率
- react
- react-router-dom
categories:
- 经验
---

> https://juejin.im/post/5995a2506fb9a0249975a1a4

1. `yarn add react-router-dom @types/react-router-dom`

2. 包容性路由（小心引起路由重复渲染问题）

   在之前（v3.x）版本，路由是排他性的，也就是说只有一条路由会最终渲染，但是现在路由是包容性的，只要路由符合匹配规则，就会将路由声明的位置（多个Route，声明的位置决定其出现顺序）替换为props中指定的组件

   ```react
   // 这样子声明两个路由
   // href="http://xxx.xx/user" 匹配这样的路由的时候将会渲染两个组件A和U且A在前面
   <BrowserRouter>
   	<Route path="/" component={A}/>
   	<Route path="/user" component={U}/>
   </BrowserRouter>

   {/* 改变顺序不会导致包容性失效 */}
   <Route path="/child/c" component={C} />
   <Route path="/child" component={ChildRoute} />

   // 解决办法很简单 使用exact
   <Route path="/" exact component={A}/> {/* 只有严格匹配的时候才会渲染A */}
   ```

3. 排他性路由

   如果想在路由列表里只匹配一个路由（V3.x），可以在路由声明外面套一层`<Switch>`,使用Switch来启用排他性

   ```react
   // /user 这样只会渲染B
   // 这样有个问题 /user/add 路由就进不去了，因为/user/add 是匹配/user的
   // 解决方法 将 /user/add放到/user的上面，(更精确的路由放到最上面)
   // 或者使用exact进行全匹配
   <BrowserRouter>
   	<Header/>
   	<Switch>
   		<Route path="/" component={A}/>
   		<Route path="/user" component={B}/>
       <Route path="/user/add" component={C}/>
   	</Switch>
   </BrowserRouter>
   ```

   <iframe src="https://codesandbox.io/embed/elastic-butterfly-o9vb4?fontsize=14" title="router demo switch" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

4. Route必须写在BrowserRouter或HashRouter内部，（在Route包裹的内部是可以再次音容Route进行再次声明的）
   ```react
      <BrowserRouter>
        <Header/>
        <ul className="App-nav">
        {// Link 必须出现在BrowserRouter的下面}
          <li><Link to="/home">home</Link></li>
          <li><Link to="/about">about</Link></li>
        </ul>
        <Route path="/home" component={Home} />
        <Route path="/about" component={About} />
      </BrowserRouter>
   ```

5. 路由组件可以获取到`<Route>`传下来的props：`history` `location` `match`

   ```react
   const location = this.props.location || context.location;
             const match = this.props.computedMatch
               ? this.props.computedMatch // <Switch> already computed the match for us
               : this.props.path
                 ? matchPath(location.pathname, this.props)
                 : context.match;
   
   const props = { ...context, location, match }; // 这里展开了context history由上层提供
   // ... ...
   children = children(props); // 这里将上面构造的props传入了子组件 {match,location,history}
   ```

6. 为什么路由下的组件能取到这些属性呢？

   关键点在于上一小节提到的context，这些属性是通过context提供给子组件的

   下面是关键源码

   ```react
   // Router的源码 https://github.com/ReactTraining/react-router/blob/d44786392fddfd8f5452fe64da9d31e34cf23b09/packages/react-router/modules/Router.js#L10
   <RouterContext.Provider // 通过Provider创建context生产者，传入接收到的history及构建的location，match，staticContext
           children={this.props.children || null}
           value={{
             history: this.props.history,
             location: this.state.location,
             match: Router.computeRootMatch(this.state.location.pathname),
             staticContext: this.props.staticContext
           }}
         />
   
   // Route的部分源码 https://github.com/ReactTraining/react-router/blob/d44786392fddfd8f5452fe64da9d31e34cf23b09/packages/react-router/modules/Route.js#L17
   <RouterContext.Consumer> // 通过Provider创建的context消费者，可以接收到由Provider提供的value对象
           {context => {
             // ...
       			// match是router用来匹配路由的
       			const match = this.props.computedMatch
               ? this.props.computedMatch // 如果外层包裹了Switch，则使用该match <Switch> already computed the match for us
               : this.props.path
                 ? matchPath(location.pathname, this.props) // 指定了path的时候计算出来一个match
                 : context.match; // 否则直接使用context提供的
             const props = { ...context, location, match };
             let { children, component, render } = this.props;
       			// ...
       			return (
               <RouterContext.Provider value={props}> // 最后返回的组件也包裹了RouterContext.Provider 这也就意味着我们可以在路由组件的任意子组件内获取到该Provider提供的props属性
                 {children && !isEmptyChildren(children)
                   ? children
                   : props.match // 根据match的模式判断是渲染component指定的组件还是使用render传入的
                     ? component
                       ? React.createElement(component, props)
                       : render
                         ? render(props)
                         : null
                     : null}
               </RouterContext.Provider>
             );
     			}
   </RouterContext.Consumer>
   
   // withRouter 关键源码分析 https://github.com/ReactTraining/react-router/blob/d44786392fddfd8f5452fe64da9d31e34cf23b09/packages/react-router/modules/withRouter.js
   function withRouter(Component) {
     const displayName = `withRouter(${Component.displayName || Component.name})`;
     const C = props => {
       const { wrappedComponentRef, ...remainingProps } = props;
       return (
         <RouterContext.Consumer> // 在Route层提供了Provider，这里通过消费者获取到context，并传入其包裹的子组件
           {context => {
             return (
               <Component
                 {...remainingProps}
                 {...context}
                 ref={wrappedComponentRef}
               />
             );
           }}
         </RouterContext.Consumer>
       );
     };
   // 出了使用withRouter 我们其实也可以自行实现Consumer
   // __RouterContext为router为我们提供的Provider
   import { __RouterContext } from 'react-router-dom'
   function childInChildComp(){
     return <__RouterContext.Consumer>
               {
                   context=>{ // 这样就获取到了context
                       console.log('context in component d :', context);
                       return JSON.stringify(context)
                   }
               }
           </__RouterContext.Consumer>
       </div>;
   }
     
   // Link 同理link依然是通过消费者拿到context属性 https://github.com/ReactTraining/react-router/blob/d44786392fddfd8f5452fe64da9d31e34cf23b09/packages/react-router-dom/modules/Link.js#L43
   function Link({ component = LinkAnchor, replace, to, ...rest }) {//LinkAnchor 是router提供的一个a标签的封装，主要操作就是覆盖了其默认操作并提供onClick事件，如果Link传入了component，那么我们提供的组件将替代LinkAnchor进行渲染
     return (
       <RouterContext.Consumer>
         {context => {
           invariant(context, "You should not use <Link> outside a <Router>"); // 如果在Router外部使用Link是拿不到Provider的，所以要报错
           const { history } = context;
           const location = normalizeToLocation(
             resolveToLocation(to, context.location),
             context.location
           );
           const href = location ? history.createHref(location) : "";
           return React.createElement(component, {
             ...rest,
             href,
             navigate() {
               const location = resolveToLocation(to, context.location);
               const method = replace ? history.replace : history.push;
               method(location);
             }
           });
         }}
       </RouterContext.Consumer>
     );
   }
   ```

7. 路由和redux连接

   为什么：路由状态也是应用状态的一部分。在很多情况下， 我们的业务逻辑和路由状态有很强的关联关系，将其关联之后就可以在redux中获取路由状态，也可以在redux中操作路由

   ```react
   // 分析其实现原理
   // ConnectedRouter关键源码 https://github.com/supasate/connected-react-router/blob/master/src/ConnectedRouter.js
   const ConnectedRouterWithContext = props => {
     	// ReactReduxContext是react-redux提供的
       const Context = props.context || ReactReduxContext // 如果有指定context就使用指定的context
       if (Context == null) {
         throw 'Please upgrade to react-redux v6'
       }
       return (
         // 通过ReactReduxContext获取到store并传入到下层的router
         <Context.Consumer>
           {({ store }) => <ConnectedRouter store={store} {...props} />}
         </Context.Consumer>
       )
     }
     ConnectedRouterWithContext.propTypes = {
       context: PropTypes.object,
     }
     return connect(null, mapDispatchToProps)(ConnectedRouterWithContext)
   }
   // ConnectedRouter
   class ConnectedRouter extends PureComponent {
     store.subscribe(() => {...  // 可以获取到store进行订阅
     this.unlisten = history.listen(handleLocationChange) // 监听路由变化的操作函数
                            
   // connectRouter创建router的reducer creator https://github.com/supasate/connected-react-router/blob/master/src/reducer.js
   // ...
   return (state = initialRouterState, { type, payload } = {}) => {
         if (type === LOCATION_CHANGE) { // 只实现了这一种action，当路由变化时更新redux中的router
           const { location, action, isFirstRendering } = payload
           // Don't update the state ref for the first rendering
           // to prevent the double-rendering issue on initilization
           return isFirstRendering
             ? state
             : merge(state, { location: fromJS(location), action })
         }
   // routerMiddleware https://github.com/supasate/connected-react-router/blob/master/src/middleware.js
   const routerMiddleware = (history) => store => next => action => { // eslint-disable-line no-unused-vars
     if (action.type !== CALL_HISTORY_METHOD) { // 只响应CALL_HISTORY_METHOD类型的action
       return next(action)
     }
     const { payload: { method, args } } = action // 这样dispatch(push('/xx/xx'))的方法会在该方法中执行
     history[method](...args)
   }
   ```

8. 默认路由，及NotFound

   从V4开始没有了IndexRoute，但是可以使用`<Route exact>`来达到相同的效果

   404需要Switch和Redirect配合才能实现

   ```react
   <Switch>
     <Route path="/" exact component={A} />
     <Redirect to="/"/>
   </Switch>
   ```

   <iframe src="https://codesandbox.io/embed/router-demo-switch-1gl7g?fontsize=14" title="router demo switch" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

9. 新特性(支持多路径)

   1. ```react
      // Instead of this:
      <Switch>
        <Route path="/users/:id" component={User} />
        <Route path="/profile/:id" component={User} />
      </Switch>

      // you can now do this in 5.x:
      <Route path={["/users/:id", "/profile/:id"]} component={User} />
      ```

10. 路由嵌套实现

   在路由组件里嵌套使用子路由

   <iframe src="https://codesandbox.io/embed/router-demo-switch-j4meb?fontsize=14" title="子路由嵌套实现" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

11. 匹配

   props.match(其他组件访问不到match可以使用 [withRouter](https://reacttraining.com/react-router/web/api/withRouter)高阶组件进行包裹)提供了几个属性：`path` `url` `isExact` `params`

   path和url的区别，url:就是浏览器地址栏中显示的值（/users/123），path在没有参数时跟url是一样的（/users/123），当匹配到有参数的path时，其值是声明路由时指定的（/users/:id）

   在构建嵌套路由时必须使用path

   match:

   - path - (`string`) 用于匹配路径模式。**用于构建嵌套的 <Route>**
   - url - (`string`) URL 匹配的部分。 **用于构建嵌套的 <Link>**

11. 避免匹配冲突

    ```react
    // /:userId(\\d+) 可以确保userId是一个数字  https://github.com/pillarjs/path-to-regexp#custom-match-parameters
    // /:userId 指向A
    // /:userId/edit 指向B(虽然/:userId指向了一个路由，但是并不意味着/:userId/edit必须指向B)
    <Switch>
            <Route exact path={props.match.path} component={BrowseUsersPage} />
            <Route path={`${match.path}/add`} component={AddUserPage} />
            <Route path={`${match.path}/:userId/edit`} component={EditUserPage} />
            <Route path={`${match.path}/:userId(\\d+)`} component={UserProfilePage} />
          </Switch>
    ```

12. 授权路由

    <iframe src="https://codesandbox.io/embed/shouquanluyou-811w6?autoresize=1&fontsize=14" title="授权路由" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

13. Link 和 NavLink

    NavLink是Link的增强，增加了激活时的属性 `class="active"`和 `aria-current='xx'`

14. 动态路由

    关于 v4 最好的部分之一是几乎所有的东西（包括 `<Route>`）只是一个 React 组件。路由不再是神奇的东西了。我们可以随时随地渲染它们。想象一下，当满足某些条件时，你的应用程序的整个部分都可以路由到。当这些条件不满足时，我们可以移除路由。甚至我们可以做一些疯狂而且很酷的[递归路由](https://reacttraining.com/react-router/web/example/recursive-paths)

15. Ss
