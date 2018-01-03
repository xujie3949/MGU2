import {
    observable,
    action,
} from 'mobx';

export default class User {
    @observable name;
    @observable password;
    @observable token;
    @observable mapToken;

    constructor() {
        this.name = null;
        this.password = null;
        this.token = null;
        this.mapToken = null;
    }

    @action
    setName(value) {
        this.name = value;
    }

    @action
    setPassword(value) {
        this.password = value;
    }

    @action
    setToken(value) {
        this.token = value;
    }

    @action
    setMapToken(value) {
        this.mapToken = value;
    }

    @action
    fromJson(json) {
        this.name = json.name;
        this.password = json.password;
        this.token = json.token;
        this.mapToken = json.mapToken;
    }

    toJson() {
        return {
            name: this.name,
            password: this.password,
            token: this.token,
            mapToken: this.mapToken,
        };
    }
}
