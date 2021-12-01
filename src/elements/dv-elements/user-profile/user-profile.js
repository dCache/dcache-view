class UserProfile extends
      DcacheViewMixins.AdminAutoRefresh(DcacheViewMixins.AdminBase(DcacheViewMixins.Commons(Polymer.Element))) {

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

            homeDirLabel: {
                type: String,
                notify: true,
                value: function () {
                    return sessionStorage.getItem("homeDirectoryLabel");
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
            userQuota: {
                type: Object,
                notify: true,
            },
            groupQuotas: {
                type: Array,
                notify: true,
                value: []
            },
            cols: {
                type: Number,
                notify: true,
                value: 2
            }
        };
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

    _convert(data) {
        let quota = {};
        quota.id = data.id;
        quota.class = data.class;
        quota.charts = [];
        quota.charts.push(this._convertChart(data.id, data.class,
                    data.custodial, data.custodialLimit, "CUSTODIAL"));
        quota.charts.push(this._convertChart(data.id, data.class,
                    data.replica, data.replicaLimit, "REPLICA"));
        // REVISIT OUTPUT currently unused
        // REVISIT return to this when qos definitions are reviewed
        return quota;
    }

    _convertChart(id, clzz, used, quota, type) {
        let current = this.isNumber(used);
        let limit = this.isNumber(quota);
        let chart = {};
        chart.id = id;
        chart.class = clzz;
        chart.type = type;
        chart.exceeded = current && limit ? used >= quota : false;
        chart.used = {
            bytes: current ? used : 0,
            txt: this._handleConversion(used, current, false)
        };
        chart.limit = {
            bytes: limit ? quota : -1,
            txt: this._handleConversion(quota, limit, true)
        };
        return chart;
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
        if (!input.length) {
            this.userQuota = null;
            return;
        }
        if (input.length > 1) {
            this.userQuota = null;
            this.handleError(`More than one quota for user was returned: ${input}`);
            return;
        }

        const quota = input[0];
        quota.class = "USER";
        this.userQuota = this._convert(quota);
    }

    _handleGroupsResponse(response) {
        const input = JSON.parse(`${response}`);
        const converted = [];
        input.forEach((quota) => {
            if (this.gids.includes(quota.id)) {
                quota.class = "GROUP";
                converted.push(this._convert(quota));
            }
        });
        this.groupQuotas = converted;
    }

    _requestQuotaInfo() {
        this.users = null;
        this.groups = null;
        this._requestUserQuotaInfo();
        this._requestGroupQuotaInfo();
    }

    _requestUserQuotaInfo() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", this.getUrl('quota/user', '?user=true'), true);
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
        /*
         *  NOTE: since ?user=true returns only the principal gid quota, and
         *  we want info for all gids, we do not append the query.
         */
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