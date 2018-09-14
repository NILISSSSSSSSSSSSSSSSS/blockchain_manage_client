import $http from "api/config";

export function axiosget(url, options) {
    return $http.get(url, {
        params: options
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err)
    })
}
export function axiospost(url, options, config) {
    return $http.post(url, options, config).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err)
    })
}

export function axiosdelete(url, options) {
    return $http.delete(url, {
        data: options
    }).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err)
    })
}

export function axiosput(url, options, config) {
    // console.log(config)
    return $http.put(url, options, config).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err)
    })
}

export function axiospatch(url,options,config) {
    return $http.patch(url,options,config).then((res) => {
        return Promise.resolve(res.data)
    }).catch((err) => {
        return Promise.reject(err)
    })
}