class UserProfile extends Polymer.Element
{
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
            }
        }
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
}
window.customElements.define(UserProfile.is, UserProfile);