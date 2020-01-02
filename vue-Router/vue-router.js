
// 登录路由守卫的实现
router.beforeEach((to, from, next) => {
    // 这个 meta 是个对象，需要在路由里面进行设置
    //  如果这个 requireAuth 为true 则需要路由守卫，否者直接下一个页面
    // 其实也就 登录页面不需要路由守卫，其他一般都需要，不排除不用登陆也能访问的页面，比如淘宝的首页其他页面等
	if (to.meta.requireAuth) {
        // 这个是我存token 的地方
        // 这个判断的主要目的：看看有没有token，如果有那么就直接进入下一个页面
        // 如果没有，那么就直接回到登录页面
		if (sessionStorage.getItem("userInfo") !== 'undefined' && JSON.parse(sessionStorage.getItem("userInfo"))) {
		  	next();
		} else {
		  	next({
				path: "/login"//指向为你的登录界面
		  	});
		}
	} else {
		next();
	}
    
    // 这里就是防止回到登录页面，如果有token 了，那么就不需要进行登陆了，也不能回到登录页面
    //  不用担忧token 过期问题，如果过期了,后台会报错说token过期，然后在api封装里面会将token 清除
	if (to.fullPath === "/login") {
		if (sessionStorage.getItem("userInfo") !== 'undefined' && JSON.parse(sessionStorage.getItem("userInfo"))) {
			next({
				path: from.fullPath
			});
		} else {
		  	next();
		}
	}
})