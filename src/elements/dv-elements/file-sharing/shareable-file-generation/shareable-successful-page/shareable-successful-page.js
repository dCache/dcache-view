class ShareableSuccessfulPage extends Polymer.Element
{
    constructor(fn, fp, m)
    {
        super();
        this.fileName = fn;
        this.fullPath = fp;
        this.macaroon = m;

        this.generatedLink = `${window.location.href}#!/shared-link?m=${this.macaroon}`;
        this.src = QRCode.generatePNG(this.generatedLink, {
            modulesize: 5,
            margin: 4,
            version: -1,
            ecclevel: "L",
            mask: -1,
        });
    }
    static get is()
    {
        return "shareable-successful-page";
    }
    static get properties()
    {
        return {
            fileName: {
                type: String,
                notify: true
            },
            fullPath: {
                type: String,
                notify: true
            },
            src: {
                type: String,
                notify: true
            },
            macaroon: {
                type: String,
                notify: true
            },
            generatedLink: {
                type: String,
                notify: true
            },
        }
    }
    _copy(id)
    {
        const copiedLink = this.$[id];
        copiedLink.select();
        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unsuccessful';
            const linkOrMacaroon = id === "linkText"? 'Shareable link' : 'Macaroon';
            window.dispatchEvent(new CustomEvent('dv-namespace-show-message-toast',
                {detail: {message: `${linkOrMacaroon} copied ${msg}`}}
            ));
        } catch (err) {
            window.dispatchEvent(new CustomEvent('dv-namespace-show-message-toast',
                {detail: {message: `Oops, unable to copy. ${err.message}`}}
            ));
        }
    }
    _copyLink()
    {
        this._copy("linkText");
    }
    _copyMacaroon()
    {
        this._copy("macaroonText");
    }
    _downloadQR()
    {
        const a = document.createElement('a');
        a.href = this.src;
        a.download = `${this.fileName}_qrcode.png`;
        a.click();
    }
}
window.customElements.define(ShareableSuccessfulPage.is, ShareableSuccessfulPage);