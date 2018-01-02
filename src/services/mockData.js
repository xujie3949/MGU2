const loginSuccess = {
    errcode: 0,
    errmsg: '登录成功',
    data: {
        token: 'abc',
    },
};

const loginFail = {
    errcode: -1,
    errmsg: '登录失败',
    data: null,
};

const mockData = {
    loginSuccess: loginSuccess,
    loginFail: loginFail,
};

export default mockData;
