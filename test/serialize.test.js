"use strict";

const CapabilityToken = require("capability-token");
const crypto = require("crypto");
const UrlSafeBase64 = require("urlsafe-base64");

const CapabilityUri = require("../index.js");

test("serializes IP URI", () =>
    {
        const token = new CapabilityToken();
        const uri = new CapabilityUri(
            {
                authority: "127.0.0.1",
                capabilityToken: token
            }
        );
        expect(uri.serialize()).toEqual(`cpblty://127.0.0.1/#${token.serialize()}`);
    }
);

test("serializes DNS URI", () =>
    {
        const token = new CapabilityToken();
        const uri = new CapabilityUri(
            {
                authority: "example.com",
                capabilityToken: token
            }
        );
        expect(uri.serialize()).toEqual(`cpblty://example.com/#${token.serialize()}`);
    }
);

test("serializes capability authority URI", () =>
    {
        const capabilityAuthority = UrlSafeBase64.encode(crypto.randomBytes(64));
        const token = new CapabilityToken();
        const uri = new CapabilityUri(
            {
                capabilityAuthority,
                capabilityToken: token
            }
        );
        expect(uri.serialize()).toEqual(`cpblty:${capabilityAuthority}:${token.serialize()}`);
    }
);

test("serializes capability authority with authority scheme URI", () =>
    {
        const authorityScheme = "dht";
        const capabilityAuthority = UrlSafeBase64.encode(crypto.randomBytes(64));
        const token = new CapabilityToken();
        const uri = new CapabilityUri(
            {
                authorityScheme,
                capabilityAuthority,
                capabilityToken: token
            }
        );
        expect(uri.serialize()).toEqual(`cpblty:${capabilityAuthority}@${authorityScheme}:${token.serialize()}`);
    }
);
