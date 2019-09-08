/**
 * 这个api 是对接口进行统一处理
 */

import { post , get } from "./http";

/**
 * 比如需要post请求一个接口：http://www.xxxx.com/api/v1/users/my_address/address_edit_before
 * @注意：p是一个对象，必须进行处理才能传参
 * 当然 get 请求根据需求进行 传参操作
 */
const addRress = p => post('/api/v1/users/my_address/address_edit_before',p)

