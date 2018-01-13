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

const trajectoryListSuccess = {
    code: 0,
    message: 'success',
    data: [
        { collectUser: 'LGW00', plateform: '01', utcdate: '161223' },
        { collectUser: 'LGW00', plateform: '01', utcdate: '161226' },
        { collectUser: 'LGW00', plateform: '01', utcdate: '161123' },
        { collectUser: 'LGW00', plateform: '01', utcdate: '161208' },
        { collectUser: 'LGW00', plateform: '01', utcdate: '161207' },
        { collectUser: 'LGW00', plateform: '01', utcdate: '160905' },
        { collectUser: 'LGW00', plateform: '01', utcdate: '160903' },
        { collectUser: 'LGW00', plateform: '01', utcdate: '161124' },
        { collectUser: 'LGW00', plateform: '01', utcdate: '161219' },
    ],
};

const mockData = {
    loginSuccess: loginSuccess,
    loginFail: loginFail,
    trajectoryListSuccess: trajectoryListSuccess,
};

export default mockData;
