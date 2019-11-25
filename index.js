"use strict";

const assert = require("assert");
const CapabilityToken = require("capability-token");

const CapabilityURI = module.exports = function(config)
{
    const self = this;
    assert.ok(config.authority || config.capabilityAuthority);
    if (config.authority)
    {
        assert.ok(!config.capabilityAuthority);
        assert.ok(!config.authorityScheme);
        assert.ok(new RegExp("[^\/]{3,}").exec(config.authority));
        assert.ok(config.capabilityToken instanceof CapabilityToken);
        self.authority = config.authority;
        self.capabilityToken = config.capabilityToken;
    }
    else if (config.capabilityAuthority)
    {
        assert.ok(!config.authority);
        assert.ok(new RegExp(`^${CapabilityToken.BASE64URL_REGEX.source}$`).exec(config.capabilityAuthority));
        if (config.authorityScheme)
        {
            assert.ok(new RegExp("[-_A-Za-z0-9]+").exec(config.authorityScheme));
        }
        assert.ok(config.capabilityToken instanceof CapabilityToken);
        self.capabilityAuthority = config.capabilityAuthority;
        self.authorityScheme = config.authorityScheme;
        self.capabilityToken = config.capabilityToken;
    }
};

CapabilityURI.CUSTOM_URI_REGEX = new RegExp(`^cpblty:(${CapabilityToken.BASE64URL_REGEX.source})((?:@[-_A-Za-z0-9]+)?):(${CapabilityToken.TOKEN_REGEX.source.slice(1)})`);
CapabilityURI.NON_CUSTOM_URI_REGEX = new RegExp(`^cpblty:\/\/([^\/]{3,})/#(${CapabilityToken.TOKEN_REGEX.source.slice(1)})`);

CapabilityURI.parse = uri =>
{
    const nonCustomParsed = CapabilityURI.NON_CUSTOM_URI_REGEX.exec(uri);
    if (nonCustomParsed)
    {
        // nonCustomParsed[1] is authority
        // nonCustomParsed[2] is CapabilityToken
        return new CapabilityURI(
            {
                authority: nonCustomParsed[1],
                capabilityToken: CapabilityToken.parse(nonCustomParsed[2])
            }
        );
    }
    const customParsed = CapabilityURI.CUSTOM_URI_REGEX.exec(uri);
    if (customParsed)
    {
        // customParsed[1] is capabilityAuthority
        // customParsed[2] is authorityScheme
        // customParsed[3] is CapabilityToken
        return new CapabilityURI(
            {
                authorityScheme: customParsed[2].length > 0 ? customParsed[2].slice(1) : undefined,
                capabilityAuthority: customParsed[1],
                capabilityToken: CapabilityToken.parse(customParsed[3])
            }
        );
    }
    return false;
};

CapabilityURI.prototype.serialize = function()
{
    const self = this;
    if (self.authority)
    {
        return `cpblty://${self.authority}/#${self.capabilityToken.serialize()}`
    }
    else if (self.capabilityAuthority)
    {
        return `cpblty:${self.capabilityAuthority}${self.authorityScheme ? `@${self.authorityScheme}` : ""}:${self.capabilityToken.serialize()}`
    }
    throw new Error("Invalid CapabilityURI");
};
