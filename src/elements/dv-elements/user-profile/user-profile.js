class UserProfile extends DcacheViewMixins.AdminAutoRefresh(DcacheViewMixins.AdminBase(DcacheViewMixins.Commons(Polymer.Element))) {

    constructor()
    {
        super();
        this.listOfAllRoles = this._getInitialListOfAllRoles();
        this.gravatarSwitch = sessionStorage.useGravatar === "yes";
    }

    static get is()
    {
        return 'user-profile';
    }

    static get properties()
    {
        return {
            username: {
                type: String,
                notify: true,
                value: function () {
                    return sessionStorage.getItem("name");
                }
            },
            email: {
                type: String,
                notify: true,
                value: function () {
                    return !!sessionStorage.getItem("email") ? sessionStorage.getItem("email"): 'not available';
                }
            },
            uid: {
                type: String,
                notify: true,
                value: function () {
                    return sessionStorage.uid;
                }
            },
            gids: {
                type: String,
                notify: true,
                value: function () {
                    return sessionStorage.gids;
                }
            },
            organisationName: {
                type: String,
                value: function () {
                    return window.CONFIG["dcache-view.org-name"];
                },
                notify: true
            },
            rootDir: {
                type: String,
                notify: true,
                value: function () {
                    return sessionStorage.getItem("rootDirectory");
                }
            },
            homeDir: {
                type: String,
                notify: true,
                value: function () {
                    return sessionStorage.getItem("homeDirectory");
                }
            },
            listOfAllRoles: {
                type: Array,
                notify: true,
                value: function () {
                    return [];
                }
            },
            gravatarSwitch: {
                type: Boolean,
                notify: true
            },
            quotas: {
                type: Array,
                notify: true,
                value: []
            },
            users: {
                type: Array,
                value: []
            },
            groups: {
                type: Array,
                value: []
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.refreshAndReset(this._requestQuotaInfo.bind(this), 60000);
    }

    _view(e)
    {
        page.redirect("/");
        this.dispatchEvent(
            new CustomEvent('dv-namespace-ls-path', {
                detail: {path: e.target.getAttribute('data-path')}, bubbles: true, composed: true}));
    }

    _computedClass(str)
    {
        return this.listOfAllRoles.length === 0 ? str === "no-roles" ?
            ' display-flex row vertically-align' : ' hide row' : str === "no-roles" ?
            ' hide row' : str === "all-roles" ? this.listOfAllRoles.length === 1 ?
                ' hide' : ' toggleBtn' : ' paper-material-inner display-flex column';
    }
    _computedEmailCss(email)
    {
        let classes = 'value flex';
        if (email === "not available") {
            classes += ' red';
        }
        return classes;
    }
    _computedColumnCss(exceeded) {
        return exceeded ? 'column-centre red' : 'column-centre';
    }
    _allCurrentStatus()
    {
        const len = this.listOfAllRoles.length;
        let allRolesAsserted = true;
        for (let i = 0; i < len; i++) {
            if (this.listOfAllRoles[i].assert === false) {
                allRolesAsserted = false;
                break;
            }
        }
        return allRolesAsserted;
    }
    _roleAssertion(e)
    {
        const role = e.target.dataRoles === undefined ?
            e.target.getAttribute('data-roles'): e.target.dataRoles;
        const toggle = e.target;

        const rolesAssertion = new RoleRequest();
        rolesAssertion.promise.then(response => {
            const len = this.listOfAllRoles.length;
            if (role === "*") {
                for (let i = 0; i < len; i++) {
                    if (this.listOfAllRoles[i].assert === !toggle.active) {
                        this.set(`listOfAllRoles.${i}`, {assert: toggle.active});
                    }
                }
                this.dispatchEvent(new CustomEvent('dv-namespace-show-message-toast', {
                    detail: {message: response.detail.message}, bubbles: true, composed: true
                }));
            } else {
                if (len > 1) {
                    let assert = 0, leave = 0;
                    for (let i = 0; i < len; i++) {
                        if (this.listOfAllRoles[i].assert === true) {
                            assert += 1;
                        }
                        if (this.listOfAllRoles[i].assert === false) {
                            leave += 1;
                        }
                    }
                    if (assert === len) {
                        this.$.allRolesAssertionToggle.checked = true;
                    }
                    if (leave === len) {
                        this.$.allRolesAssertionToggle.checked = false;
                    }
                }
            }
            store(normaliseCredentialFormat(response.detail.credential));
            this.dispatchEvent(new CustomEvent('dv-authentication-successful', {
                detail: {
                    message: response.detail.message,
                    roles: response.detail.credential.roles === undefined ?
                        "": `${response.detail.credential.roles}`
                }, bubbles: true, composed: true
            }));
            window.dispatchEvent(new CustomEvent('dv-role-validation',
                { bubbles: true, composed: true }));
        }).catch(err => {
            toggle.checked = !toggle.checked;
            this.dispatchEvent(new CustomEvent('dv-namespace-show-message-toast', {
                detail: {message: `${err}`}, bubbles: true, composed: true
            }));
        });
        if (toggle.active) {
            rolesAssertion.assert(role === "*"?`${sessionStorage.listOfPossibleRoles}`:role);
        } else {
            rolesAssertion.leave(role);
        }
    }
    _getInitialListOfAllRoles()
    {
        const roles = sessionStorage.roles === "" ? [] : (sessionStorage.roles).split(",");
        const unAsserted = sessionStorage.listOfPossibleRoles === "" ?
            [] : (sessionStorage.listOfPossibleRoles).split(",");
        return [...roles.map(str => {
            if (str !== undefined || str !== "") return {"role": str, "assert": true};}),
            ...unAsserted.map(str => {
                if (str !== undefined || str !== "") return {"role": str, "assert": false};})
        ];
    }
    _requestIdenticonImage(e)
    {
        if (this.$['identicon'].checked === true) {
            this.dispatchEvent(new CustomEvent('dv-user-image-request', {
                detail: {
                    type: "identicon",
                    email: sessionStorage.email,
                    name: this.username,
                    id: 'main'
                },
                bubbles: true, composed: true
            }));
        } else {
            this._requestGravatar();
        }
    }
    _requestGravatarImage(e)
    {
        if (this.$['gravatar'].checked === true) {
            this._requestGravatar();
        } else {
            this.dispatchEvent(new CustomEvent('dv-user-image-request', {
                detail: {
                    type: "identicon",
                    email: sessionStorage.email,
                    name: this.username,
                    id: 'main'
                }, bubbles: true, composed: true
            }));
        }
    }
    _requestGravatar()
    {
        const email = sessionStorage["email"];
        if (!!email) {
            this.dispatchEvent(new CustomEvent('dv-user-image-request', {
                detail: {
                    type: "gravatar",
                    email: sessionStorage.email,
                    name: this.username,
                    id: 'main'
                }, bubbles: true, composed: true
            }));
        } else {
            this.$['gravatar'].checked = false;
            this.dispatchEvent(new CustomEvent('dv-namespace-show-message-toast', {
                detail: {message: "To use Gravatar image, a valid and registered email " +
                        "must be associated with this account."}, bubbles: true, composed: true
            }));
        }
    }

    _convertSizes(quota) {
        let current = this.isNumber(quota.custodial);
        let limit = this.isNumber(quota.custodialLimit);

        if (current && limit) {
            quota.custodialExceeded = quota.custodial >= quota.custodialLimit;
        } else {
            quota.custodialExceeded = false;
        }

        quota.custodial = this._handleConversion(quota.custodial, current, false);
        quota.custodialLimit = this._handleConversion(quota.custodialLimit, limit, true);

        // REVISIT OUTPUT currently unused, return to this when qos definitions are reviewed

        // current = this.isNumber(quota.output);
        // limit = this.isNumber(quota.outputLimit);
        //
        // if (current && limit) {
        //     quota.outputExceeded = quota.output >= quota.outputLimit;
        // } else {
        //     quota.outputExceeded = false;
        // }
        //
        // quota.output = this._handleConversion(quota.output, current, false);
        // quota.outputLimit = this._handleConversion(quota.outputLimit, limit, true);

        current = this.isNumber(quota.replica);
        limit = this.isNumber(quota.replicaLimit);

        if (current && limit) {
            quota.replicaExceeded = quota.replica >= quota.replicaLimit;
        } else {
            quota.replicaExceeded = false;
        }

        quota.replica = this._handleConversion(quota.replica, current, false);
        quota.replicaLimit = this._handleConversion(quota.replicaLimit, limit, true);
    }

    _handleConversion(value, isNumber, isLimit) {
        if (!isLimit || isNumber) {
            return this.convertBytesToNearestBinaryPrefix(value);
        }

        return 'UNDEF';
    }

    _handleError(event) {
        this.handleError(event.detail.error.message);
    }

    _handleUsersResponse(response) {
        const input = JSON.parse(`${response}`);
        input.forEach((quota) => {
            quota.type = {name: "USER", value: 0};
            this._convertSizes(quota);
        });
        this.users = input;
        this._mergeQuotas();
    }

    _handleGroupsResponse(response) {
        const input = JSON.parse(`${response}`);
        input.forEach((quota) => {
            quota.type = {name: "GROUP", value: 1};
            this._convertSizes(quota);
        });
        this.groups = input;
        this._mergeQuotas();
    }

    _mergeQuotas() {
        if (this.users !== null && this.groups !== null) {
            const all = [];
            this.users.forEach((quota) => {
                if (this.uid === quota.id.toString()) {
                    all.push(quota);
                }
            });
            this.groups.forEach((quota) => {
                if (this.gids.includes(quota.id)) {
                    all.push(quota);
                }
            });
            this.quotas = all;
        }
    }

    _requestQuotaInfo() {
        this.users = null;
        this.groups = null;
        this._requestUserQuotaInfo();
        this._requestGroupQuotaInfo();
    }

    _requestUserQuotaInfo() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", this.getUrl('quota/user', null), true);
        this.setXHRHeaders(xhr);
        xhr.onerror = this._handleError.bind(this);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    this._handleUsersResponse(xhr.response);
                }
            }
        }.bind(this);
        xhr.send();
    }

    _requestGroupQuotaInfo() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", this.getUrl('quota/group', null), true);
        this.setXHRHeaders(xhr);
        xhr.onerror = this._handleError.bind(this);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    this._handleGroupsResponse(xhr.response);
                }
            }
        }.bind(this);
        xhr.send();
    }
}
window.customElements.define(UserProfile.is, UserProfile);