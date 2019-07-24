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

5. 默认路由，及NotFound

   从V4开始没有了IndexRoute，但是可以使用`<Route exact>`来达到相同的效果

   404需要Switch和Redirect配合才能实现

   ```react
   <Switch>
             <Route path="/" exact component={A} />
             <Redirect to="/"/>
           </Switch>
   ```

   <iframe src="https://codesandbox.io/embed/router-demo-switch-1gl7g?fontsize=14" title="router demo switch" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

6. 新特性(支持多路径)

   1. ```react
      // Instead of this:
      <Switch>
        <Route path="/users/:id" component={User} />
        <Route path="/profile/:id" component={User} />
      </Switch>

      // you can now do this in 5.x:
      <Route path={["/users/:id", "/profile/:id"]} component={User} />
      ```

7. 路由嵌套实现

   在路由组件里嵌套使用子路由

   <iframe src="https://codesandbox.io/embed/router-demo-switch-j4meb?fontsize=14" title="子路由嵌套实现" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

8. 匹配

   props.match(其他组件访问不到match可以使用 [withRouter](https://reacttraining.com/react-router/web/api/withRouter)高阶组件进行包裹)提供了几个属性：`path` `url` `isExact` `params`

   path和url的区别，url:就是浏览器地址栏中显示的值（/users/123），path在没有参数时跟url是一样的（/users/123），当匹配到有参数的path时，其值是声明路由时指定的（/users/:id）

   在构建嵌套路由时必须使用path

   match:

   - path - (`string`) 用于匹配路径模式。**用于构建嵌套的 <Route>**
   - url - (`string`) URL 匹配的部分。 **用于构建嵌套的 <Link>**

9. 避免匹配冲突

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

10. 授权路由

    <iframe src="https://codesandbox.io/embed/shouquanluyou-811w6?autoresize=1&fontsize=14" title="授权路由" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

11. Link 和 NavLink

    NavLink是Link的增强，增加了激活时的属性 `class="active"`和 `aria-current='xx'`

12. 动态路由

    关于 v4 最好的部分之一是几乎所有的东西（包括 `<Route>`）只是一个 React 组件。路由不再是神奇的东西了。我们可以随时随地渲染它们。想象一下，当满足某些条件时，你的应用程序的整个部分都可以路由到。当这些条件不满足时，我们可以移除路由。甚至我们可以做一些疯狂而且很酷的[递归路由](https://reacttraining.com/react-router/web/example/recursive-paths)
